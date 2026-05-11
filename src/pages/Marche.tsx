import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { buildMarketCategories, getCategoryKey, MOCK_PRODUCTS, type MarketProduct } from "@/data/marketplaceMocks";
import type { Category } from "@/types/database";
import ProductCard from "@/components/ProductCard";

type Product = MarketProduct;
type SortValue = "default" | "price_asc" | "price_desc" | "new";

const CATEGORY_COLORS: Record<string, string> = {
  fruits: '#E84A1F',
  legumes: '#16A34A',
  cereales: '#CA8A04',
  tubercules: '#A16207',
  epices: '#DC2626',
  herbes: '#65A30D',
};

const Marche = () => {
  const { addItem } = useCart();
  const { profile } = useAuth();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("cat");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortValue>("default");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
        (!searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "new") return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      return 0;
    }),
  [products, selectedCategoryKey, searchQuery, sortBy, categoryKeyById]);

  const isFiltering = !!selectedCategoryKey || !!searchQuery;

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

  const getCatProductCount = (cat: Category) => {
    const catKey = getCategoryKey(cat.name) ?? cat.id;
    return products.filter(p => {
      const pKey = getCategoryKey(p.categories?.name) ?? (p.category_id ? categoryKeyById.get(p.category_id) ?? getCategoryKey(p.category_id) : null);
      return pKey === catKey;
    }).length;
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-2xl mb-2.5" style={{ background: 'hsl(60 5% 94%)' }} />
          <div className="h-3.5 rounded-lg w-1/2 mb-1" style={{ background: 'hsl(60 5% 94%)' }} />
          <div className="h-3 rounded-lg w-3/4" style={{ background: 'hsl(60 5% 94%)' }} />
        </div>
      ))}
    </div>
  );

  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <div className="min-h-screen pb-24 md:pb-0" style={{ background: 'hsl(60 5% 96%)' }}>
      <Navbar />

      <main style={{ paddingTop: "var(--navbar-h)" }}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
          <div className="flex gap-6 items-start">

            {/* ── Sidebar (desktop only) ── */}
            <aside
              className="hidden md:block w-[220px] shrink-0 sticky"
              style={{ top: 'calc(var(--navbar-h) + 20px)' }}
            >
              {/* Categories card */}
              <div className="bg-white rounded-xl border p-3 mb-3" style={{ borderColor: 'hsl(60 5% 92%)' }}>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant px-2 pb-2">Catégories</p>
                <nav className="flex flex-col gap-0.5">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors w-full"
                    style={{
                      background: !selectedCategoryKey ? 'hsl(60 5% 94%)' : 'transparent',
                      color: !selectedCategoryKey ? '#0A0A0A' : '#8A8A85',
                      fontWeight: !selectedCategoryKey ? 600 : 500,
                    }}
                  >
                    <span className="material-symbols-outlined text-[15px] shrink-0" style={{ fontVariationSettings: "'FILL' 1", color: !selectedCategoryKey ? '#0A0A0A' : '#8A8A85' }}>apps</span>
                    <span className="flex-1 text-[13px]">Tous les produits</span>
                    <span className="text-[11px]" style={{ color: 'hsl(60 2% 54%)' }}>{products.length}</span>
                  </button>
                  {categories.map((cat) => {
                    const active = isCategorySelected(cat);
                    const catKey = getCategoryKey(cat.name) ?? cat.id;
                    const count = getCatProductCount(cat);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(active ? null : cat.id)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors w-full"
                        style={{
                          background: active ? 'hsl(60 5% 94%)' : 'transparent',
                          color: active ? '#0A0A0A' : '#8A8A85',
                          fontWeight: active ? 600 : 500,
                        }}
                      >
                        <span
                          className="material-symbols-outlined text-[15px] shrink-0"
                          style={{
                            fontVariationSettings: "'FILL' 1",
                            color: active ? (CATEGORY_COLORS[catKey] || '#0A0A0A') : 'hsl(60 2% 54%)',
                          }}
                        >
                          {cat.icon || "eco"}
                        </span>
                        <span className="flex-1 text-[13px] truncate">{cat.name}</span>
                        <span className="text-[11px]" style={{ color: 'hsl(60 2% 54%)' }}>{count}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sort card */}
              <div className="bg-white rounded-xl border p-3" style={{ borderColor: 'hsl(60 5% 92%)' }}>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant px-2 pb-2">Trier par</p>
                <div className="flex flex-col gap-0.5">
                  {([
                    { value: "default", label: "Par défaut" },
                    { value: "price_asc", label: "Prix croissant" },
                    { value: "price_desc", label: "Prix décroissant" },
                    { value: "new", label: "Nouveautés" },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors w-full text-[13px]"
                      style={{
                        background: sortBy === opt.value ? 'hsl(60 5% 94%)' : 'transparent',
                        color: sortBy === opt.value ? '#0A0A0A' : '#8A8A85',
                        fontWeight: sortBy === opt.value ? 600 : 500,
                      }}
                    >
                      {sortBy === opt.value && <span className="w-1 h-1 rounded-full shrink-0" style={{ background: '#E84A1F' }}/>}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0">

              {/* Mobile: horizontal category chips */}
              <div className="md:hidden mb-4 -mx-4 px-4">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all"
                    style={{
                      background: !selectedCategoryKey ? '#0A0A0A' : 'white',
                      color: !selectedCategoryKey ? 'white' : '#8A8A85',
                      border: '1px solid hsl(60 5% 92%)',
                    }}
                  >
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>apps</span>
                    Tout
                  </button>
                  {categories.map((cat) => {
                    const active = isCategorySelected(cat);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(active ? null : cat.id)}
                        className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all"
                        style={{
                          background: active ? '#0A0A0A' : 'white',
                          color: active ? 'white' : '#8A8A85',
                          border: '1px solid hsl(60 5% 92%)',
                        }}
                      >
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon || "eco"}</span>
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search bar + mobile filter toggle */}
              <div className="flex gap-2 items-center mb-5">
                <div
                  className="flex-1 flex items-center px-4 py-0 rounded-full"
                  style={{ background: 'white', border: '1px solid hsl(60 5% 92%)', boxShadow: '0 1px 2px rgba(10,10,10,0.04)' }}
                >
                  <span className="material-symbols-outlined text-[17px] mr-2.5" style={{ color: 'hsl(60 2% 54%)' }}>search</span>
                  <input
                    type="search"
                    placeholder={`Mangue, tomate, mil…${firstName ? ` ${firstName}` : ''}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 py-2.5 bg-transparent text-[13.5px] outline-none font-body"
                    style={{ color: '#0A0A0A' }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="ml-1" style={{ color: 'hsl(60 2% 54%)' }}>
                      <span className="material-symbols-outlined text-[15px]">close</span>
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="md:hidden flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[13px] font-medium shrink-0"
                  style={{
                    background: sortBy !== 'default' ? '#0A0A0A' : 'white',
                    color: sortBy !== 'default' ? 'white' : '#8A8A85',
                    border: '1px solid hsl(60 5% 92%)',
                  }}
                >
                  <span className="material-symbols-outlined text-[15px]">tune</span>
                </button>
              </div>

              {/* Mobile filter panel */}
              <AnimatePresence>
                {mobileFilterOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden md:hidden mb-4"
                  >
                    <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'hsl(60 5% 92%)' }}>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant mb-2">Trier par</p>
                      <div className="flex flex-wrap gap-2">
                        {([
                          { value: "default", label: "Défaut" },
                          { value: "price_asc", label: "Prix ↑" },
                          { value: "price_desc", label: "Prix ↓" },
                          { value: "new", label: "Nouveautés" },
                        ] as const).map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => { setSortBy(opt.value); setMobileFilterOpen(false); }}
                            className="px-3 py-1.5 rounded-full text-[12.5px] font-medium"
                            style={{
                              background: sortBy === opt.value ? '#0A0A0A' : 'hsl(60 5% 94%)',
                              color: sortBy === opt.value ? 'white' : '#8A8A85',
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Page header */}
              <div className="flex items-end justify-between mb-5">
                <div>
                  <h1 className="font-headline font-bold text-[22px] tracking-tight leading-tight" style={{ color: '#0A0A0A' }}>
                    {selectedCategoryLabel || (searchQuery ? `« ${searchQuery} »` : (firstName ? `Bonjour, ${firstName}` : "Tous les produits"))}
                  </h1>
                  <p className="text-[13px] mt-1" style={{ color: 'hsl(60 2% 54%)' }}>
                    {loading ? "Chargement…" : `${filtered.length} produit${filtered.length !== 1 ? "s" : ""} disponible${filtered.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
                {isFiltering && (
                  <button
                    onClick={() => { handleCategoryChange(null); setSearchQuery(""); }}
                    className="flex items-center gap-1 text-[12.5px] font-medium hover:text-foreground transition-colors"
                    style={{ color: 'hsl(60 2% 54%)' }}
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                    Effacer
                  </button>
                )}
              </div>

              {/* Products */}
              {loading ? (
                <LoadingSkeleton />
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'hsl(60 5% 94%)' }}>
                    <span className="material-symbols-outlined text-3xl" style={{ color: 'hsl(60 2% 54% / 0.4)' }}>search_off</span>
                  </div>
                  <p className="font-headline font-bold text-lg mb-2">Aucun résultat</p>
                  <p className="text-[13.5px] max-w-xs mb-5" style={{ color: 'hsl(60 2% 54%)' }}>
                    {searchQuery ? `Aucun produit pour « ${searchQuery} ».` : "Aucun produit dans cette catégorie."}
                  </p>
                  <button
                    onClick={() => { handleCategoryChange(null); setSearchQuery(""); }}
                    className="px-5 py-2.5 rounded-xl text-[13.5px] font-medium text-white"
                    style={{ background: '#0A0A0A' }}
                  >
                    Voir tous les produits
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
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
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Marche;
