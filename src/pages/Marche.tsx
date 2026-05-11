import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
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
import PromoCarousel from "@/components/PromoCarousel";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react";

type Product = MarketProduct;

const SORT_OPTIONS = [
  { value: "default",    label: "Défaut" },
  { value: "price_asc",  label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "new",        label: "Nouveautés" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const GRID_CLS = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4";

/* ── Loading skeleton ── */
const LoadingSkeleton = () => (
  <div className={GRID_CLS}>
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="aspect-square rounded-xl" />
        <Skeleton className="h-2.5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ))}
  </div>
);

/* ── Section header ── */
const SectionHeader = ({
  title, icon, count,
}: { title: string; icon?: string | null; count?: number }) => (
  <div className="flex items-center gap-2.5 mb-4">
    {icon && (
      <span
        className="material-symbols-outlined text-[20px] text-primary"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
    )}
    <h2 className="text-[15px] font-bold text-foreground">{title}</h2>
    {count !== undefined && (
      <Badge variant="secondary" className="text-[11px] font-medium h-5 px-2">
        {count}
      </Badge>
    )}
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
            return (
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime()
            );
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
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Navbar />

      <main style={{ paddingTop: "var(--navbar-h)" }}>

        {/* ── Sticky top bar ── */}
        <div
          className="sticky z-20 bg-background border-b border-border/50"
          style={{ top: "var(--navbar-h)" }}
        >
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3 space-y-2.5">

            {/* Search + Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder={`Mangues, tomates, bissap${firstName ? `, ${firstName}` : ""}…`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9 h-10 rounded-full bg-muted border-transparent focus-visible:border-border focus-visible:bg-background transition-all"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <Button
                variant={showFilters || hasFilters ? "default" : "outline"}
                className="h-10 px-4 rounded-full gap-2 shrink-0 text-sm font-semibold"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filtres</span>
                {hasFilters && (
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                )}
              </Button>
            </div>

            {/* Category chips */}
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
              <Button
                variant={!selectedCategoryKey ? "default" : "ghost"}
                size="sm"
                className="rounded-full h-8 px-4 shrink-0 text-xs font-semibold"
                onClick={() => handleCategoryChange(null)}
              >
                Tout voir
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={isCategorySelected(cat) ? "default" : "ghost"}
                  size="sm"
                  className="rounded-full h-8 px-4 shrink-0 text-xs font-semibold"
                  onClick={() =>
                    handleCategoryChange(isCategorySelected(cat) ? null : cat.id)
                  }
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-6 pb-10">

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
                <Card className="border-border/60 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row gap-6">

                      {/* Sort */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">
                          Trier par
                        </p>
                        <Select
                          value={sortBy}
                          onValueChange={(v) => setSortBy(v as SortValue)}
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SORT_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator orientation="vertical" className="hidden sm:block self-stretch" />

                      {/* Price */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">
                          Prix max —{" "}
                          <span className="text-foreground normal-case tracking-normal font-bold">
                            {priceMax.toLocaleString("fr-FR")} FCFA
                          </span>
                        </p>
                        <Slider
                          min={500}
                          max={50000}
                          step={500}
                          value={[priceMax]}
                          onValueChange={([v]) => setPriceMax(v)}
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                          <span>500 FCFA</span>
                          <span>50 000 FCFA</span>
                        </div>
                      </div>
                    </div>

                    {hasFilters && (
                      <>
                        <Separator className="my-3" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5 -ml-2"
                          onClick={() => { setSortBy("default"); setPriceMax(50000); }}
                        >
                          <RotateCcw className="h-3 w-3" />
                          Réinitialiser les filtres
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results header (filtering mode) */}
          {isFiltering && (
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-bold">
                  {selectedCategoryLabel ||
                    (searchQuery ? `"${searchQuery}"` : "Résultats")}
                </h1>
                <Badge variant="secondary" className="text-xs font-medium">
                  {filtered.length} produit{filtered.length !== 1 ? "s" : ""}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground gap-1.5"
                onClick={() => { handleCategoryChange(null); setSearchQuery(""); }}
              >
                <X className="h-3.5 w-3.5" />
                Effacer
              </Button>
            </div>
          )}

          {/* ── Products ── */}
          {loading ? (
            <LoadingSkeleton />
          ) : isFiltering ? (
            filtered.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
                  <Search className="h-7 w-7 text-muted-foreground/30" />
                </div>
                <h3 className="text-lg font-bold mb-2">Aucun résultat</h3>
                <p className="text-sm text-muted-foreground max-w-xs mb-6">
                  {searchQuery
                    ? `Aucun produit pour "${searchQuery}".`
                    : "Aucun produit dans cette catégorie pour le moment."}
                </p>
                <Button onClick={() => { handleCategoryChange(null); setSearchQuery(""); }}>
                  Voir tous les produits
                </Button>
              </div>
            ) : (
              /* Filtered grid */
              <div className={GRID_CLS}>
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
            /* Browse mode */
            <div className="space-y-0">

              {/* Promo carousel */}
              <div className="mb-8">
                <PromoCarousel />
              </div>

              {/* Populaires */}
              <div className="mb-10">
                <SectionHeader
                  title="Populaires"
                  icon="local_fire_department"
                  count={Math.min(products.length, 10)}
                />
                <div className={GRID_CLS}>
                  {products.slice(0, 10).map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      formatPrice={formatPrice}
                      index={i}
                    />
                  ))}
                </div>
              </div>

              {/* Per-category sections */}
              {categoryGroups.map((group) => (
                <div key={group.label} className="mb-10">
                  <Separator className="mb-8" />
                  <SectionHeader
                    title={group.label}
                    icon={group.icon}
                    count={group.products.length}
                  />
                  <div className={GRID_CLS}>
                    {group.products.map((product, i) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        formatPrice={formatPrice}
                        index={i}
                      />
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
