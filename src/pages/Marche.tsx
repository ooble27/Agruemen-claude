import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { buildMarketCategories, getCategoryKey, groupByCategory, MOCK_PRODUCTS, type MarketProduct } from "@/data/marketplaceMocks";
import type { Category } from "@/types/database";
import ProductCard from "@/components/ProductCard";
import PromoCarousel from "@/components/PromoCarousel";
import HorizontalProductRow from "@/components/HorizontalProductRow";

type Product = MarketProduct;

const SORT_OPTIONS = [
  { value: "default",    label: "Défaut",          icon: "sort" },
  { value: "price_asc",  label: "Prix croissant",  icon: "arrow_upward" },
  { value: "price_desc", label: "Prix décroissant", icon: "arrow_downward" },
  { value: "new",        label: "Nouveautés",      icon: "new_releases" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const Marche = () => {
  const { addItem } = useCart();
  const { profile } = useAuth();
  const [dbProducts, setDbProducts]     = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [loading, setLoading]           = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory                = searchParams.get("cat");
  const [searchQuery, setSearchQuery]   = useState("");
  const [sortBy, setSortBy]             = useState<SortValue>("default");
  const [showFilters, setShowFilters]   = useState(false);
  const [priceMax, setPriceMax]         = useState(50000);

  const handleCategoryChange = (catId: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (catId) next.set("cat", catId);
      else next.delete("cat");
      return next;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const [prodRes, catRes] = await Promise.all([
        supabase.from("products").select("*, shops(name, seller_id), categories(name, icon)").eq("is_active", true).order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
      ]);
      if (prodRes.data) setDbProducts(prodRes.data as Product[]);
      if (catRes.data) setDbCategories(catRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const products = useMemo(() => {
    const dbIds = new Set(dbProducts.map((p) => p.id));
    return [...dbProducts, ...MOCK_PRODUCTS.filter((m) => !dbIds.has(m.id))];
  }, [dbProducts]);

  const categories = useMemo(() => buildMarketCategories(dbCategories), [dbCategories]);

  const categoryKeyById = useMemo(
    () => new Map(categories.map((c) => [c.id, getCategoryKey(c.name) ?? c.id])),
    [categories]
  );

  const selectedCategoryKey = useMemo(() => {
    if (!selectedCategory) return null;
    return categoryKeyById.get(selectedCategory) ?? getCategoryKey(selectedCategory);
  }, [selectedCategory, categoryKeyById]);

  const selectedCategoryLabel = useMemo(() => {
    if (!selectedCategoryKey) return null;
    return categories.find((c) => (getCategoryKey(c.name) ?? c.id) === selectedCategoryKey)?.name ?? "Catégorie";
  }, [categories, selectedCategoryKey]);

  const isCategorySelected = (cat: Category) =>
    selectedCategoryKey === (getCategoryKey(cat.name) ?? cat.id);

  const filtered = useMemo(() => products
    .filter((p) => {
      const pCatKey =
        getCategoryKey(p.categories?.name) ??
        (p.category_id ? categoryKeyById.get(p.category_id) ?? getCategoryKey(p.category_id) : null);
      return (
        (!selectedCategoryKey || pCatKey === selectedCategoryKey) &&
        (!searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        p.price <= priceMax
      );
    })
    .sort((a, b) => {
      if (sortBy === "price_asc")  return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "new")        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      return 0;
    }),
  [products, selectedCategoryKey, searchQuery, priceMax, sortBy, categoryKeyById]);

  const categoryGroups = useMemo(() => groupByCategory(products), [products]);
  const isFiltering    = !!selectedCategoryKey || !!searchQuery;
  const hasFilters     = sortBy !== "default" || priceMax !== 50000;

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price.toLocaleString("fr-FR") + " FCFA",
      priceNum: product.price,
      unit: product.unit,
      image: product.image_url || "/placeholder.svg",
      farmer: product.shops?.name || "Producteur",
      shopId: product.shop_id,
    });
    toast.success(`${product.name} ajouté au panier`);
  };

  const formatPrice = (n: number) => n.toLocaleString("fr-FR");
  const firstName   = profile?.full_name?.split(" ")[0];

  /* ── Category chip — adapts mobile/desktop ── */
  const CatChip = ({
    icon, label, active, onClick,
  }: { icon: string; label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex flex-col md:flex-row items-center gap-1.5 md:gap-2.5 shrink-0 cursor-pointer"
    >
      <div
        className={`w-14 h-14 md:w-10 md:h-10 rounded-2xl md:rounded-xl flex items-center justify-center transition-all duration-200 ${
          active ? "bg-foreground shadow-md" : "bg-surface-container hover:bg-surface-container-high"
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] md:text-[18px] ${active ? "text-white" : "text-foreground/50"}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <span
        className={`font-headline text-[10px] md:text-[12px] font-bold text-center md:text-left leading-tight max-w-[64px] md:max-w-[96px] line-clamp-2 ${
          active ? "text-foreground" : "text-on-surface-variant"
        }`}
      >
        {label}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0" style={{ touchAction: "manipulation" }}>
      <Navbar />

      <main style={{ paddingTop: "var(--navbar-h)" }}>

        {/* ── Sticky search + filter strip ── */}
        <div
          className="sticky z-30 bg-background/95 backdrop-blur-xl border-b border-border/15"
          style={{ top: "var(--navbar-h)" }}
        >
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3 flex items-center gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/45 text-[18px] pointer-events-none">
                search
              </span>
              <input
                type="search"
                placeholder={`Mangues, tomates, bissap${firstName ? `, ${firstName}` : ""}…`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-10 rounded-full bg-surface-container border border-transparent font-body text-sm focus:outline-none focus:border-foreground/25 focus:bg-white transition-all placeholder:text-on-surface-variant/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-11 min-w-[44px] px-4 rounded-full font-headline text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                showFilters || hasFilters
                  ? "bg-foreground text-white shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span className="hidden sm:inline">Filtres</span>
              {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-white/80" />}
            </button>
          </div>
        </div>

        {/* ── Main content area ── */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-5 pb-8">

          {/* ── Category chips — horizontal scroll on all screens ── */}
          <div className="mb-5 -mx-4 md:mx-0 px-4 md:px-0">
            <div className="flex gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-hide">
              <CatChip
                icon="apps"
                label="Tout"
                active={!selectedCategoryKey}
                onClick={() => handleCategoryChange(null)}
              />
              {categories.map((cat) => (
                <CatChip
                  key={cat.id}
                  icon={cat.icon || "eco"}
                  label={cat.name}
                  active={isCategorySelected(cat)}
                  onClick={() => handleCategoryChange(isCategorySelected(cat) ? null : cat.id)}
                />
              ))}
            </div>
          </div>

          {/* ── Filter panel — all screens ── */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-border/25 rounded-2xl p-4 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <p className="font-headline text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/60 mb-2">
                        Trier par
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setSortBy(opt.value)}
                            className={`px-3 py-1.5 rounded-lg font-headline text-xs font-bold transition-colors cursor-pointer ${
                              sortBy === opt.value
                                ? "bg-foreground text-white"
                                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-headline text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/60 mb-2">
                        Prix max —{" "}
                        <span className="text-foreground normal-case tracking-normal">
                          {priceMax.toLocaleString("fr-FR")} FCFA
                        </span>
                      </p>
                      <input
                        type="range" min={500} max={50000} step={500}
                        value={priceMax}
                        onChange={(e) => setPriceMax(Number(e.target.value))}
                        className="w-full accent-foreground"
                      />
                      <div className="flex justify-between font-body text-[10px] text-on-surface-variant/50 mt-1">
                        <span>500 FCFA</span><span>50 000 FCFA</span>
                      </div>
                    </div>
                  </div>
                  {hasFilters && (
                    <button
                      onClick={() => { setSortBy("default"); setPriceMax(50000); }}
                      className="flex items-center gap-1.5 text-xs font-headline font-bold text-on-surface-variant hover:text-foreground transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                      Réinitialiser
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Promo carousel */}
          {!isFiltering && (
            <div className="mb-6">
              <PromoCarousel />
            </div>
          )}

          {/* Section header */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <h1 className="font-headline font-black text-xl tracking-tight leading-tight">
                {isFiltering
                  ? selectedCategoryLabel || (searchQuery ? `"${searchQuery}"` : "Résultats")
                  : firstName ? `Bonjour, ${firstName}` : "Produits frais"}
              </h1>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">
                {isFiltering
                  ? `${filtered.length} résultat${filtered.length !== 1 ? "s" : ""}`
                  : `${products.length} produits disponibles`}
              </p>
            </div>
            {isFiltering && (
              <button
                onClick={() => { handleCategoryChange(null); setSearchQuery(""); }}
                className="flex items-center gap-1 text-xs font-headline font-bold text-on-surface-variant hover:text-foreground transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
                Effacer
              </button>
            )}
          </div>

          {/* ── Products ── */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square rounded-xl bg-surface-container mb-2.5" />
                  <div className="h-3.5 bg-surface-container rounded-lg w-3/4 mb-1.5" />
                  <div className="h-3 bg-surface-container rounded-lg w-1/2 mb-2" />
                  <div className="h-4 bg-surface-container rounded-lg w-2/3" />
                </div>
              ))}
            </div>
          ) : isFiltering ? (
            filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">search_off</span>
                </div>
                <p className="font-headline font-black text-xl mb-2 tracking-tight">Aucun résultat</p>
                <p className="font-body text-sm text-on-surface-variant max-w-xs mb-6">
                  {searchQuery
                    ? `Aucun produit pour "${searchQuery}".`
                    : "Aucun produit dans cette catégorie."}
                </p>
                <button
                  onClick={() => { handleCategoryChange(null); setSearchQuery(""); }}
                  className="px-6 py-3 rounded-lg bg-foreground text-white font-headline font-bold text-sm cursor-pointer"
                >
                  Voir tous les produits
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                {filtered.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    formatPrice={formatPrice}
                    index={i}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="space-y-8 -mx-4 md:mx-0">
              <HorizontalProductRow
                title="Populaires"
                icon="local_fire_department"
                products={products.slice(0, 10)}
                onAddToCart={handleAddToCart}
                formatPrice={formatPrice}
              />
              {categoryGroups.map((group) => (
                <HorizontalProductRow
                  key={group.label}
                  title={group.label}
                  icon={group.icon}
                  products={group.products}
                  onAddToCart={handleAddToCart}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Marche;