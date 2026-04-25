import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";

import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import { findMockProduct, getMockRelatedProducts, MOCK_PRODUCTS } from "@/data/marketplaceMocks";
import type { Product as BaseProduct, ProductImage } from "@/types/database";

type Product = BaseProduct & {
  categories: { name: string; icon: string | null } | null;
};

type SellerProfile = {
  full_name: string;
  avatar_url: string | null;
  city: string | null;
  phone: string | null;
};

type ShopInfo = {
  name: string;
  seller_id: string;
  city: string | null;
  phone: string | null;
  location: string | null;
};

const ITEMS_PER_BATCH = 12;

const normalizeCategory = (name?: string | null) => name?.trim().toLowerCase() || "__uncategorized__";

const getStableOffset = (value: string) => Array.from(value).reduce((total, char) => total + char.charCodeAt(0), 0);

const rotateItems = <T,>(items: T[], offset: number) => {
  if (items.length <= 1) return items;
  const start = offset % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
};

const buildRelatedProducts = (currentProduct: Product, candidates: Product[], limit = ITEMS_PER_BATCH) => {
  const seen = new Set<string>();
  const uniqueCandidates = candidates.filter((candidate) => {
    if (candidate.id === currentProduct.id || seen.has(candidate.id)) return false;
    seen.add(candidate.id);
    return true;
  });

  const currentCategory = normalizeCategory(currentProduct.categories?.name);
  const featuredSameCategoryCount = currentCategory === "__uncategorized__" ? 0 : Math.min(4, limit);
  const sameCategory = uniqueCandidates.filter(
    (candidate) => normalizeCategory(candidate.categories?.name) === currentCategory
  );
  const otherCategories = uniqueCandidates.filter(
    (candidate) => normalizeCategory(candidate.categories?.name) !== currentCategory
  );

  const sameCategoryRotated = rotateItems(sameCategory, getStableOffset(`${currentProduct.id}${currentProduct.name}`));
  const groupedOthers = new Map<string, Product[]>();

  rotateItems(otherCategories, getStableOffset(`${currentProduct.name}${currentProduct.id}`)).forEach((candidate) => {
    const key = normalizeCategory(candidate.categories?.name);
    const bucket = groupedOthers.get(key) ?? [];
    bucket.push(candidate);
    groupedOthers.set(key, bucket);
  });

  const curated: Product[] = [];
  const pushUnique = (candidate: Product) => {
    if (!curated.some((item) => item.id === candidate.id)) {
      curated.push(candidate);
    }
  };

  sameCategoryRotated.slice(0, featuredSameCategoryCount).forEach(pushUnique);

  const buckets = Array.from(groupedOthers.values());
  for (let index = 0; curated.length < limit && buckets.some((bucket) => index < bucket.length); index += 1) {
    for (const bucket of buckets) {
      const candidate = bucket[index];
      if (!candidate) continue;
      pushUnique(candidate);
      if (curated.length === limit) break;
    }
  }

  if (curated.length < limit) {
    sameCategoryRotated.slice(featuredSameCategoryCount).forEach((candidate) => {
      if (curated.length < limit) pushUnique(candidate);
    });
  }

  return curated.slice(0, limit);
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setQuantity(1);
    setCurrentImage(0);
    setProduct(null);
    setShop(null);
    setImages([]);
    setRelatedProducts([]);
    setSellerProfile(null);

    const load = async () => {
      const mockProduct = findMockProduct(id);

      if (mockProduct) {
        setProduct(mockProduct);
        setShop(mockProduct.mockShop);
        setSellerProfile(mockProduct.mockSellerProfile);
        setImages(mockProduct.mockImages.length > 0 ? mockProduct.mockImages : mockProduct.image_url ? [mockProduct.image_url] : []);
        setRelatedProducts(buildRelatedProducts(mockProduct, [...getMockRelatedProducts(mockProduct, 50), ...MOCK_PRODUCTS]));
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("products")
        .select("*, categories(name, icon)")
        .eq("id", id)
        .single();

      if (!data) { setLoading(false); return; }
      const product = data as Product;
      setProduct(product);

      const { data: shopData } = await supabase
        .from("shops")
        .select("name, seller_id, city, phone, location")
        .eq("id", product.shop_id)
        .single();
      if (shopData) {
        setShop(shopData);
        const { data: prof } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, city, phone")
          .eq("user_id", shopData.seller_id)
          .single();
        if (prof) setSellerProfile(prof);
      }

      const { data: prodImages } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("display_order");

      const imgList: string[] = [];
      if (prodImages && prodImages.length > 0) {
        imgList.push(...prodImages.map((img: ProductImage) => img.image_url));
      }
      if (imgList.length === 0 && product.image_url) {
        imgList.push(product.image_url);
      }
      setImages(imgList);

      const { data: rel } = await supabase
        .from("products")
        .select("*, categories(name, icon)")
        .eq("is_active", true)
        .neq("id", id)
        .limit(50);
      if (rel) {
        setRelatedProducts(buildRelatedProducts(product, rel as Product[]));
      }

      setLoading(false);
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentImage < images.length - 1) setCurrentImage((c) => c + 1);
      if (diff < 0 && currentImage > 0) setCurrentImage((c) => c - 1);
    }
    setTouchStart(null);
  };

  const formatPrice = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        priceNum: product.price,
        unit: product.unit,
        image: images[0] || "/placeholder.svg",
        farmer: sellerProfile?.full_name || shop?.name || "Vendeur",
        shopId: product.shop_id,
      });
    }
    toast.success(`${product.name} ajouté au panier`, {
      description: `${quantity} × ${formatPrice(product.price)}`,
      icon: "🧺",
    });
  }, [product, quantity, images, sellerProfile, shop, addItem]);

  const handleAddRelated = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: p.id,
      name: p.name,
      price: formatPrice(p.price),
      priceNum: p.price,
      unit: p.unit,
      image: p.image_url || "/placeholder.svg",
      farmer: "Producteur",
      shopId: p.shop_id,
    });
    toast.success(`${p.name} ajouté au panier`, { icon: "🧺" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-spin">progress_activity</span>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-6">search_off</span>
          <h1 className="text-4xl font-headline font-extrabold mb-4">Produit introuvable</h1>
          <p className="text-on-surface-variant mb-8">Ce produit n'existe pas ou a été retiré.</p>
          <Link to="/marche" className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full font-headline font-extrabold hover:scale-95 transition-transform">
            Retour au Marché
          </Link>
        </main>
      </div>
    );
  }

  const sellerName = sellerProfile?.full_name || shop?.name || "Producteur";
  const sellerCity = sellerProfile?.city || shop?.city || "Sénégal";
  const totalPrice = product.price * quantity;
  const visibleRelated = relatedProducts;

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block"><Navbar /></div>

      <main className="pt-0 md:pt-24">
        {/* ═══════ MOBILE ═══════ */}
        <div className="md:hidden pb-24">
          {/* Floating header */}
          <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 safe-area-top">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center shadow-lg border border-border/10">
              <span className="material-symbols-outlined text-foreground text-xl">arrow_back</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center shadow-lg border border-border/10">
              <span className="material-symbols-outlined text-foreground text-xl">ios_share</span>
            </button>
          </div>

          {/* Image carousel — full-bleed, swipeable */}
          <div
            className="relative w-full aspect-square bg-surface-container overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={images[currentImage] || "/placeholder.svg"}
                alt={product.name}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Image counter pill */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-foreground/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`rounded-full transition-all duration-300 ${i === currentImage ? "w-6 h-2 bg-background" : "w-2 h-2 bg-background/40"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product info card */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {product.categories?.name && (
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{product.categories.name}</span>
                )}
                <h1 className="text-2xl font-headline font-extrabold tracking-tight mt-1 leading-tight">{product.name}</h1>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-headline font-extrabold text-foreground">{formatPrice(product.price)}</div>
                <div className="text-xs text-on-surface-variant">{product.unit}</div>
              </div>
            </div>

            {/* Stock + delivery info */}
            <div className="flex items-center gap-3 mt-3">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/[0.12] px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  {product.stock > 10 ? "En stock" : `Plus que ${product.stock}`}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive bg-destructive/10 px-2.5 py-1 rounded-full">
                  Rupture de stock
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">local_shipping</span>
                Livraison disponible
              </span>
            </div>
          </div>

          {/* Quantity selector — compact, left-aligned */}
          <div className="px-5 py-3">
            <div className="inline-flex items-center bg-surface-container rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-l-xl hover:bg-background transition-colors"
              >
                <span className="material-symbols-outlined text-base text-on-surface-variant">remove</span>
              </button>
              <span className="w-10 text-center font-headline font-extrabold text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-background border border-border shadow-sm"
              >
                <span className="material-symbols-outlined text-base text-foreground">add</span>
              </button>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="px-5 py-3">
              <h3 className="font-headline font-bold text-sm mb-1.5">À propos</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="h-2 bg-surface-container my-1" />

          {/* Related products — multiple horizontal rows */}
          {relatedProducts.length > 0 && (
            <div className="py-5 space-y-5">
              <div>
                <h3 className="font-headline font-extrabold text-lg mb-4 px-5">Vous aimerez aussi</h3>
                <div className="flex gap-3 overflow-x-auto px-5 scrollbar-hide snap-x snap-mandatory pb-1 scroll-px-5">
                  {visibleRelated.slice(0, 10).map((p, i) => (
                    <div key={p.id} className="shrink-0 w-[28vw] snap-start">
                      <ProductCard product={p} onAddToCart={handleAddRelated} formatPrice={(n) => n.toLocaleString("fr-FR")} index={i} />
                    </div>
                  ))}
                </div>
              </div>

              {visibleRelated.length > 10 && (
                <div>
                  <h3 className="font-headline font-extrabold text-lg mb-4 px-5">Souvent achetés ensemble</h3>
                  <div className="flex gap-3 overflow-x-auto px-5 scrollbar-hide snap-x snap-mandatory pb-1 scroll-px-5">
                    {visibleRelated.slice(10, 20).map((p, i) => (
                      <div key={p.id} className="shrink-0 w-[28vw] snap-start">
                        <ProductCard product={p} onAddToCart={handleAddRelated} formatPrice={(n) => n.toLocaleString("fr-FR")} index={i} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {visibleRelated.length > 20 && (
                <div>
                  <h3 className="font-headline font-extrabold text-lg mb-4 px-5">Découvrir plus</h3>
                  <div className="flex gap-3 overflow-x-auto px-5 scrollbar-hide snap-x snap-mandatory pb-1 scroll-px-5">
                    {visibleRelated.slice(20, 30).map((p, i) => (
                      <div key={p.id} className="shrink-0 w-[28vw] snap-start">
                        <ProductCard product={p} onAddToCart={handleAddRelated} formatPrice={(n) => n.toLocaleString("fr-FR")} index={i} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sticky bottom bar */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/20 px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full bg-foreground text-white py-4 rounded-2xl font-headline font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.97] transition-transform disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-lg">shopping_basket</span>
              Ajouter {quantity > 1 ? `(${quantity})` : ""} · {formatPrice(totalPrice)}
            </button>
          </div>
        </div>

        {/* ═══════ DESKTOP ═══════ */}
        <div className="hidden md:block">
          {/* Breadcrumb */}
          <div className="px-6 md:px-12 max-w-[1440px] mx-auto py-4">
            <nav className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
              <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <Link to="/marche" className="hover:text-primary transition-colors">Marché</Link>
              {product.categories?.name && (
                <>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                  <Link to={`/marche?cat=${product.category_id}`} className="hover:text-primary transition-colors">{product.categories.name}</Link>
                </>
              )}
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
            </nav>
          </div>

          {/* Product section */}
          <section className="px-6 md:px-12 max-w-[1440px] mx-auto pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">

              {/* Left — Images */}
              <div>
                {/* Main image */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative rounded-2xl overflow-hidden bg-surface-container aspect-[4/3] mb-3"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage}
                      src={images[currentImage] || "/placeholder.svg"}
                      alt={product.name}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Nav arrows on image */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImage((c) => Math.max(0, c - 1))}
                        disabled={currentImage === 0}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg border border-border/10 disabled:opacity-0 transition-opacity hover:bg-background"
                      >
                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                      </button>
                      <button
                        onClick={() => setCurrentImage((c) => Math.min(images.length - 1, c + 1))}
                        disabled={currentImage === images.length - 1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg border border-border/10 disabled:opacity-0 transition-opacity hover:bg-background"
                      >
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                      </button>
                    </>
                  )}

                  {/* Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-foreground/60 text-background text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {currentImage + 1} / {images.length}
                    </div>
                  )}
                </motion.div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${i === currentImage ? "border-primary ring-2 ring-primary/20 scale-[1.02]" : "border-transparent opacity-60 hover:opacity-90"}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right — Sticky info card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className=""
              >
                <div className="bg-background border border-border/30 rounded-2xl p-6 shadow-sm">
                  {/* Category */}
                  {product.categories?.name && (
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{product.categories.name}</span>
                  )}

                  <h1 className="text-3xl font-headline font-extrabold tracking-tight mt-2 mb-1">{product.name}</h1>
                  <p className="text-sm text-on-surface-variant mb-4">{product.unit}</p>

                  {/* Price */}
                  <div className="text-3xl font-headline font-extrabold mb-5">{formatPrice(product.price)}</div>

                  {/* Stock badge */}
                  <div className="flex items-center gap-3 mb-5">
                    {product.stock > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/[0.12] px-3 py-1.5 rounded-full">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {product.stock > 10 ? "En stock" : `Plus que ${product.stock} restants`}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive bg-destructive/10 px-3 py-1.5 rounded-full">
                        Rupture de stock
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">local_shipping</span>
                      Livraison
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center bg-surface-container rounded-xl">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 flex items-center justify-center rounded-l-xl hover:bg-background transition-colors">
                        <span className="material-symbols-outlined text-lg">remove</span>
                      </button>
                      <span className="w-12 text-center font-headline font-extrabold">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 flex items-center justify-center rounded-r-xl hover:bg-background transition-colors">
                        <span className="material-symbols-outlined text-lg">add</span>
                      </button>
                    </div>
                    <div className="text-sm text-on-surface-variant">
                      Total: <span className="font-bold text-foreground">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="w-full bg-foreground text-white py-4 rounded-2xl font-headline font-bold text-[15px] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-lg">shopping_basket</span>
                    Ajouter au panier
                  </button>

                  {/* Divider */}
                  <div className="h-px bg-border/30 my-5" />

                  {/* Description */}
                  {product.description && (
                    <div>
                      <h3 className="font-headline font-bold text-sm mb-2">À propos du produit</h3>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{product.description}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section className="py-12 px-6 md:px-12 max-w-[1440px] mx-auto border-t border-border/20">
              <h2 className="text-2xl font-headline font-extrabold tracking-tight mb-6">Vous aimerez aussi</h2>
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {visibleRelated.map((p, i) => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddRelated} formatPrice={(n) => n.toLocaleString("fr-FR")} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
    </div>
  );
};

export default ProductDetail;
