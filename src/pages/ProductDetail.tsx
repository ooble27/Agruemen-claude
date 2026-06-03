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
  const uniqueCandidates = candidates.filter((c) => {
    if (c.id === currentProduct.id || seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
  const currentCategory = normalizeCategory(currentProduct.categories?.name);
  const featuredSameCategoryCount = currentCategory === "__uncategorized__" ? 0 : Math.min(4, limit);
  const sameCategory = uniqueCandidates.filter(c => normalizeCategory(c.categories?.name) === currentCategory);
  const otherCategories = uniqueCandidates.filter(c => normalizeCategory(c.categories?.name) !== currentCategory);
  const sameCategoryRotated = rotateItems(sameCategory, getStableOffset(`${currentProduct.id}${currentProduct.name}`));
  const groupedOthers = new Map<string, Product[]>();
  rotateItems(otherCategories, getStableOffset(`${currentProduct.name}${currentProduct.id}`)).forEach(c => {
    const key = normalizeCategory(c.categories?.name);
    const bucket = groupedOthers.get(key) ?? [];
    bucket.push(c);
    groupedOthers.set(key, bucket);
  });
  const curated: Product[] = [];
  const pushUnique = (c: Product) => { if (!curated.some(i => i.id === c.id)) curated.push(c); };
  sameCategoryRotated.slice(0, featuredSameCategoryCount).forEach(pushUnique);
  const buckets = Array.from(groupedOthers.values());
  for (let i = 0; curated.length < limit && buckets.some(b => i < b.length); i++) {
    for (const b of buckets) {
      const c = b[i];
      if (!c) continue;
      pushUnique(c);
      if (curated.length === limit) break;
    }
  }
  if (curated.length < limit) sameCategoryRotated.slice(featuredSameCategoryCount).forEach(c => { if (curated.length < limit) pushUnique(c); });
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

      const { data } = await supabase.from("products").select("*, categories(name, icon)").eq("id", id).single();
      if (!data) { setLoading(false); return; }
      const product = data as Product;
      setProduct(product);

      const { data: shopData } = await supabase.from("shops").select("name, seller_id, city, phone, location").eq("id", product.shop_id).single();
      if (shopData) {
        setShop(shopData);
        const { data: prof } = await supabase.from("profiles").select("full_name, avatar_url, city, phone").eq("user_id", shopData.seller_id).single();
        if (prof) setSellerProfile(prof);
      }

      const { data: prodImages } = await supabase.from("product_images").select("*").eq("product_id", id).order("display_order");
      const imgList: string[] = [];
      if (prodImages && prodImages.length > 0) imgList.push(...prodImages.map((img: ProductImage) => img.image_url));
      if (imgList.length === 0 && product.image_url) imgList.push(product.image_url);
      setImages(imgList);

      const { data: rel } = await supabase.from("products").select("*, categories(name, icon)").eq("is_active", true).neq("id", id).limit(50);
      if (rel) setRelatedProducts(buildRelatedProducts(product, rel as Product[]));

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
      if (diff > 0 && currentImage < images.length - 1) setCurrentImage(c => c + 1);
      if (diff < 0 && currentImage > 0) setCurrentImage(c => c - 1);
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
        farmer: sellerProfile?.full_name || shop?.name || "Mamakaasa",
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
        <main className="pt-32 flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 animate-spin">progress_activity</span>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-24 px-6 text-center max-w-lg mx-auto">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 block mb-6">search_off</span>
          <h1 className="font-headline font-black text-3xl tracking-tighter mb-3">Produit introuvable</h1>
          <p className="text-on-surface-variant mb-8 font-body">Ce produit n'existe pas ou a été retiré.</p>
          <Link
            to="/marche"
            className="inline-flex items-center gap-2 bg-foreground text-white px-7 py-3.5 rounded-sm font-headline font-bold text-sm"
          >
            <span className="material-symbols-outlined text-sm">storefront</span>
            Retour au Marché
          </Link>
        </main>
      </div>
    );
  }

  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block"><Navbar /></div>

      <main className="pt-0 md:pt-24">

        {/* ═══════ MOBILE ═══════ */}
        <div className="md:hidden pb-36">

          {/* Floating top bar */}
          <div className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 py-3" style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}>
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm border border-border/15"
            >
              <span className="material-symbols-outlined text-foreground text-xl">arrow_back</span>
            </button>
          </div>

          {/* Image carousel — full-bleed, swipeable */}
          <div
            className="relative w-full bg-surface-container overflow-hidden"
            style={{ aspectRatio: "4/3", borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={images[currentImage] || "/placeholder.svg"}
                alt={product.name}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-foreground/60 backdrop-blur-sm rounded-sm px-3 py-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`rounded-full transition-all duration-300 ${i === currentImage ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="px-5 pt-5 pb-3">
            {product.categories?.name && (
              <p className="font-headline text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60 mb-1">
                {product.categories.name}
              </p>
            )}
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-headline font-black text-2xl tracking-tighter leading-tight flex-1">
                {product.name}
              </h1>
              <div className="text-right shrink-0 pt-0.5">
                <p className="font-headline font-black text-2xl text-foreground leading-none">{product.price.toLocaleString("fr-FR")}</p>
                <p className="font-body text-[10px] text-on-surface-variant mt-0.5">FCFA / {product.unit}</p>
              </div>
            </div>

            {/* Seller */}
            <div className="flex items-center gap-2 mt-3 mb-3">
              <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
              </div>
              <p className="font-headline text-[12px] font-bold text-foreground">Mamakaasa</p>
            </div>

            {/* Stock + delivery */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold font-headline text-foreground bg-surface-container px-2.5 py-1 rounded-sm">
                  <span className="material-symbols-outlined text-[13px] text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  {product.stock > 10 ? "En stock" : `${product.stock} restants`}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold font-headline text-destructive bg-destructive/8 px-2.5 py-1 rounded-sm">
                  Rupture
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] font-body text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-sm">
                <span className="material-symbols-outlined text-[13px]">local_shipping</span>
                Livraison disponible
              </span>
            </div>
          </div>

          {/* Quantity */}
          <div className="px-5 py-3">
            <div className="inline-flex items-center bg-surface-container rounded-sm border border-border/20">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-high transition-colors rounded-sm"
              >
                <span className="material-symbols-outlined text-base">remove</span>
              </button>
              <span className="w-10 text-center font-headline font-black text-base">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-high transition-colors rounded-sm"
              >
                <span className="material-symbols-outlined text-base">add</span>
              </button>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="px-5 py-3">
              <h3 className="font-headline font-bold text-sm mb-2">À propos du produit</h3>
              <p className="font-body text-sm text-on-surface-variant/80 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="h-px bg-border/15 mx-5 my-2" />

          {/* Related — mobile */}
          {relatedProducts.length > 0 && (
            <div className="py-4 space-y-5">
              {[
                { label: "Vous aimerez aussi", items: relatedProducts.slice(0, 10) },
                ...(relatedProducts.length > 10 ? [{ label: "Souvent achetés ensemble", items: relatedProducts.slice(10, 20) }] : []),
              ].map(section => (
                <div key={section.label}>
                  <h3 className="font-headline font-black text-base tracking-tight px-5 mb-3">{section.label}</h3>
                  <div className="flex gap-3 overflow-x-auto px-5 scrollbar-hide snap-x snap-mandatory pb-1 scroll-px-5">
                    {section.items.map((p, i) => (
                      <div key={p.id} className="shrink-0 w-[42vw] snap-start">
                        <ProductCard product={p} onAddToCart={handleAddRelated} formatPrice={n => n.toLocaleString("fr-FR")} index={i} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sticky bottom bar */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/15 px-5 py-3"
            style={{
              background: '#fff',
              paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
            }}
          >
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full bg-foreground text-white py-3.5 rounded-xl font-headline font-black text-base flex items-center justify-center gap-2 active:scale-[0.97] transition-transform disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-lg">shopping_basket</span>
              Ajouter{quantity > 1 ? ` (${quantity})` : ""} · {formatPrice(totalPrice)}
            </button>
          </div>
        </div>

        {/* ═══════ DESKTOP ═══════ */}
        <div className="hidden md:block">

          {/* Breadcrumb */}
          <div className="px-8 md:px-12 max-w-[1440px] mx-auto py-4">
            <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant font-body">
              <Link to="/" className="hover:text-foreground transition-colors">Accueil</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <Link to="/marche" className="hover:text-foreground transition-colors">Marché</Link>
              {product.categories?.name && (
                <>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                  <Link to={`/marche?cat=${product.category_id}`} className="hover:text-foreground transition-colors">{product.categories.name}</Link>
                </>
              )}
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-foreground font-semibold truncate max-w-[200px]">{product.name}</span>
            </nav>
          </div>

          {/* Product section */}
          <section className="px-8 md:px-12 max-w-[1440px] mx-auto pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">

              {/* Left — Images */}
              <div>
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
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImage(c => Math.max(0, c - 1))}
                        disabled={currentImage === 0}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-sm bg-background/85 backdrop-blur-sm flex items-center justify-center border border-border/20 disabled:opacity-0 transition-opacity hover:bg-background"
                      >
                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                      </button>
                      <button
                        onClick={() => setCurrentImage(c => Math.min(images.length - 1, c + 1))}
                        disabled={currentImage === images.length - 1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-sm bg-background/85 backdrop-blur-sm flex items-center justify-center border border-border/20 disabled:opacity-0 transition-opacity hover:bg-background"
                      >
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                      </button>
                    </>
                  )}

                  {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-foreground/60 text-white text-[11px] font-bold font-headline px-2.5 py-1 rounded-sm backdrop-blur-sm">
                      {currentImage + 1} / {images.length}
                    </div>
                  )}
                </motion.div>

                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                          i === currentImage ? "border-foreground" : "border-transparent opacity-50 hover:opacity-80"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right — Info card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <div className="rounded-2xl border border-border/12 bg-white overflow-hidden">

                  {/* Title + price */}
                  <div className="px-7 pt-7 pb-6">
                    {product.categories?.name && (
                      <span className="block font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant/50 mb-3">
                        {product.categories.name}
                      </span>
                    )}
                    <h1 className="font-headline font-black text-foreground tracking-tighter leading-tight text-[1.6rem] mb-5">
                      {product.name}
                    </h1>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-headline font-black text-4xl text-foreground leading-none">
                        {product.price.toLocaleString("fr-FR")}
                      </span>
                      <span className="font-body text-[12px] text-on-surface-variant">FCFA / {product.unit}</span>
                    </div>
                  </div>

                  <div className="h-px bg-border/10 mx-7" />

                  {/* Badges + seller */}
                  <div className="px-7 py-5 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {product.stock > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-headline text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                          <span className="material-symbols-outlined text-[13px] text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          {product.stock > 10 ? "En stock" : `${product.stock} restants`}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-headline text-destructive bg-destructive/8 px-3 py-1.5 rounded-full">
                          Rupture de stock
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-body text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full">
                        <span className="material-symbols-outlined text-[13px]">local_shipping</span>
                        Livraison gratuite
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-white text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
                      </div>
                      <p className="font-headline text-sm font-semibold text-foreground">Mamakaasa</p>
                    </div>
                  </div>

                  <div className="h-px bg-border/10 mx-7" />

                  {/* Quantity + add to cart + description */}
                  <div className="px-7 py-6 space-y-5">
                    <div>
                      <p className="font-headline text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/55 mb-3">Quantité</p>
                      <div className="flex items-center gap-5">
                        <div className="flex items-center rounded-xl border border-border/25 bg-surface-container overflow-hidden">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-high transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">remove</span>
                          </button>
                          <span className="w-10 text-center font-headline font-black text-base">{quantity}</span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-high transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">add</span>
                          </button>
                        </div>
                        <p className="font-body text-sm text-on-surface-variant">
                          Total :{" "}
                          <span className="font-headline font-black text-foreground">{formatPrice(totalPrice)}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                      className="w-full bg-foreground text-white py-4 rounded-xl font-headline font-black text-base flex items-center justify-center gap-2.5 hover:opacity-88 active:scale-[0.98] transition-all disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-lg">shopping_basket</span>
                      Ajouter au panier
                    </button>

                    {product.description && (
                      <div className="pt-1">
                        <h3 className="font-headline font-bold text-sm mb-2 text-foreground">À propos du produit</h3>
                        <p className="font-body text-sm text-on-surface-variant/80 leading-relaxed">{product.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Related — desktop */}
          {relatedProducts.length > 0 && (
            <section className="py-12 px-8 md:px-12 max-w-[1440px] mx-auto border-t border-border/15">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline font-black text-2xl tracking-tight">Vous aimerez aussi</h2>
                <Link to="/marche" className="font-headline text-sm font-bold text-on-surface-variant hover:text-foreground transition-colors flex items-center gap-1">
                  Voir tout
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {relatedProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddRelated} formatPrice={n => n.toLocaleString("fr-FR")} index={i} />
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
