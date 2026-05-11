import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  buildMarketCategories, getCategoryKey, groupByCategory,
  MOCK_PRODUCTS, type MarketProduct,
} from "@/data/marketplaceMocks";
import type { Category } from "@/types/database";
import ProductCard from "@/components/ProductCard";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { Search, X, SlidersHorizontal, RotateCcw, Plus } from "lucide-react";

type Product = MarketProduct;

const SORT_OPTIONS = [
  { value: "default",    label: "Défaut" },
  { value: "price_asc",  label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "new",        label: "Nouveautés" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const GRID = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4";

const CATEGORY_STYLE: Record<string, { emoji: string; bg: string; border: string; hover: string }> = {
  fruits:   { emoji: "🥭", bg: "bg-amber-50",   border: "border-amber-200/60",   hover: "hover:bg-amber-100/60" },
  legumes:  { emoji: "🥦", bg: "bg-emerald-50", border: "border-emerald-200/60", hover: "hover:bg-emerald-100/60" },
  cereales: { emoji: "🌾", bg: "bg-yellow-50",  border: "border-yellow-200/60",  hover: "hover:bg-yellow-100/60" },
  epices:   { emoji: "🌶️", bg: "bg-rose-50",    border: "border-rose-200/60",    hover: "hover:bg-rose-100/60" },
};

const DEFAULT_CAT_STYLE = { emoji: "🛒", bg: "bg-violet-50", border: "border-violet-200/60", hover: "hover:bg-violet-100/60" };

const LoadingSkeleton = () => (
  <div className={GRID}>
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="space-y-2.5">
        <Skeleton className="aspect-square rounded-2xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>
);

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
        supabase
          .from("products")
          .select("*, shops(name, seller_id), categories(name, icon)")
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
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
    return (
      categories.find((c) => (getCategoryKey(c.name) ?? c.id) === selectedCategoryKey)
        ?.name ?? "Catégorie"
    );
  }, [categories, selectedCategoryKey]);

  const isCategorySelected = (cat: Category) =>
    selectedCategoryKey === (getCategoryKey(cat.name) ?? cat.id);

  const filtered = useMemo(
    () =>
      products
        .filter((p) => {
          const pCatKey =
            getCategoryKey(p.categories?.name) ??
            (p.category_id
              ? categoryKeyById.get(p.category_id) ?? getCategoryKey(p.category_id)
              : null);
          return (
            (!selectedCategoryKey || pCatKey === selectedCategoryKey) &&
            (!searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
            p.price <= priceMax
          );
        })
        .sort((a, b) => {
          if (sortBy === "price_asc")  return a.price - b.price;
          if (sortBy === "price_desc") return b.price - a.price;
          if (sortBy === "new")
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
          return 0;
        }),
    [products, selectedCategoryKey, searchQuery, priceMax, sortBy, categoryKeyById]
  );

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

  return (
    <div className="min-h-screen bg-[#f8f8f6] pb-24 md:pb-0">
      <Navbar />

      <main style={{ paddingTop: "var(--navbar-h)" }}>

        {/* ── Sticky search + categories ── */}
        <div
          className="sticky z-20 bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          style={{ top: "var(--navbar-h)" }}
        >
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3 space-y-2.5">

            {/* Search + Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder={`Rechercher${firstName ? ` pour ${firstName}` : ""}... mangues, oignons, mil`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-9 h-10 rounded-full bg-muted/70 border-transparent focus-visible:border-border focus-visible:bg-white transition-all text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center hover:bg-muted-foreground/30 transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-10 px-4 rounded-full flex items-center gap-2 text-sm font-semibold shrink-0 transition-all ${
                  showFilters || hasFilters
                    ? "bg-primary text-white shadow-sm"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filtres</span>
                {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />}
              </button>
            </div>

            {/* Category chips */}
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`h-8 px-4 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  !selectedCategoryKey
                    ? "bg-primary text-white shadow-sm"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted"
                }`}
              >
                Tout voir
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(isCategorySelected(cat) ? null : cat.id)}
                  className={`h-8 px-4 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    isCategorySelected(cat)
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted/70 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-5 pb-10">

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden mb-5"
              >
                <div className="bg-white rounded-2xl border border-border/30 p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-3">
                        Trier par
                      </p>
                      <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortValue)}>
                        <SelectTrigger className="h-10 rounded-xl text-sm border-border/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {SORT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-px bg-border/30 hidden sm:block" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-3">
                        Prix max —{" "}
                        <span className="text-foreground normal-case tracking-normal font-bold">
                          {priceMax.toLocaleString("fr-FR")} FCFA
                        </span>
                      </p>
                      <Slider
                        min={500} max={50000} step={500}
                        value={[priceMax]}
                        onValueChange={([v]) => setPriceMax(v)}
                        className="py-1"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                        <span>500 FCFA</span><span>50 000 FCFA</span>
                      </div>
                    </div>
                  </div>
                  {hasFilters && (
                    <div className="mt-4 pt-4 border-t border-border/20">
                      <button
                        onClick={() => { setSortBy("default"); setPriceMax(50000); }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Réinitialiser les filtres
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filtering: results header */}
          {isFiltering && (
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-bold">
                  {selectedCategoryLabel || (searchQuery ? `"${searchQuery}"` : "Résultats")}
                </h1>
                <Badge variant="secondary" className="rounded-full text-xs font-semibold">
                  {filtered.length} produit{filtered.length !== 1 ? "s" : ""}
                </Badge>
              </div>
              <button
                onClick={() => { handleCategoryChange(null); setSearchQuery(""); }}
                className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" /> Effacer
              </button>
            </div>
          )}

          {/* Products */}
          {loading ? (
            <LoadingSkeleton />
          ) : isFiltering ? (
            filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
                  <Search className="h-7 w-7 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-bold mb-2">Aucun résultat</h3>
                <p className="text-sm text-muted-foreground max-w-xs mb-6">
                  {searchQuery
                    ? `Aucun produit trouvé pour « ${searchQuery} ».`
                    : "Aucun produit dans cette catégorie pour le moment."}
                </p>
                <button
                  onClick={() => { handleCategoryChange(null); setSearchQuery(""); }}
                  className="px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  Voir tous les produits
                </button>
              </div>
            ) : (
              <div className={GRID}>
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} formatPrice={formatPrice} index={i} />
                ))}
              </div>
            )
          ) : (
            /* Browse mode */
            <div>

              {/* Hero Banner */}
              <div
                className="relative rounded-3xl overflow-hidden mb-6"
                style={{ background: "linear-gradient(135deg, hsl(142,62%,26%) 0%, hsl(152,55%,20%) 100%)" }}
              >
                <div className="px-6 py-7 md:px-10 md:py-10 relative z-10">
                  <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                    🌱 Produits de saison
                  </span>
                  <h2 className="text-white text-2xl md:text-3xl font-bold leading-snug mb-2">
                    Frais & Local,<br />livré chez vous
                  </h2>
                  <p className="text-white/65 text-sm mb-6 max-w-[260px]">
                    Des producteurs sénégalais sélectionnés avec soin
                  </p>
                  <Link
                    to="/marche"
                    className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors shadow-md"
                  >
                    Explorer le marché →
                  </Link>
                </div>
                {/* Decorative circles */}
                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/[0.04]" />
                <div className="absolute right-8 -bottom-12 w-52 h-52 rounded-full bg-white/[0.04]" />
                <div className="absolute right-20 top-6 w-16 h-16 rounded-full bg-white/[0.06]" />
              </div>

              {/* Category cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {categories.slice(0, 4).map((cat) => {
                  const key = getCategoryKey(cat.name) ?? cat.id;
                  const style = CATEGORY_STYLE[key] ?? DEFAULT_CAT_STYLE;
                  const count = categoryGroups.find((g) => getCategoryKey(g.label) === key)?.products.length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`${style.bg} ${style.border} ${style.hover} border rounded-2xl p-4 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]`}
                    >
                      <span className="text-3xl block mb-3">{style.emoji}</span>
                      <p className="font-bold text-sm text-foreground leading-tight">{cat.name}</p>
                      {count !== undefined && (
                        <p className="text-xs text-muted-foreground mt-1">{count} produits</p>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Populaires */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🔥</span>
                  <h2 className="text-base font-bold">Populaires</h2>
                  <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {Math.min(products.length, 10)}
                  </span>
                </div>
                <div className={GRID}>
                  {products.slice(0, 10).map((p, i) => (
                    <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} formatPrice={formatPrice} index={i} />
                  ))}
                </div>
              </div>

              {/* Per-category sections */}
              {categoryGroups.map((group) => (
                <div key={group.label} className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {group.icon && (
                        <span
                          className="material-symbols-outlined text-[20px] text-primary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {group.icon}
                        </span>
                      )}
                      <h2 className="text-base font-bold">{group.label}</h2>
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {group.products.length}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const cat = categories.find((c) => getCategoryKey(c.name) === getCategoryKey(group.label));
                        if (cat) handleCategoryChange(cat.id);
                      }}
                      className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Voir tout →
                    </button>
                  </div>
                  <div className={GRID}>
                    {group.products.map((p, i) => (
                      <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} formatPrice={formatPrice} index={i} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Marche;
