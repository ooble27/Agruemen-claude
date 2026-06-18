import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Product = {
  id: string; name: string; price: number; unit: string; stock: number;
  is_active: boolean; image_url: string | null;
  categories: { name: string } | null;
};

const fp = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

export default function PageStock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filterCat,  setFilterCat]  = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [search,   setSearch]   = useState("");
  const [editId,   setEditId]   = useState<string | null>(null);
  const [editStock, setEditStock] = useState("");
  const [saving,   setSaving]   = useState(false);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*, categories(name)").order("name");
    if (data) setProducts(data as Product[]);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const categories = useMemo(() =>
    [...new Set(products.map(p => p.categories?.name).filter(Boolean))] as string[],
    [products]
  );

  const stockLevel = (s: number): "rupture" | "critique" | "faible" | "normal" | "bon" =>
    s === 0 ? "rupture" : s < 5 ? "critique" : s < 20 ? "faible" : s < 100 ? "normal" : "bon";

  const stockColor = (s: number) =>
    s === 0 ? "#ef4444" : s < 5 ? "#dc2626" : s < 20 ? "#f59e0b" : s < 100 ? "#3b82f6" : "#10b981";

  const stockLevelLabel: Record<string, string> = {
    rupture: "Rupture", critique: "Critique", faible: "Faible", normal: "Normal", bon: "Bon",
  };

  const filtered = products
    .filter(p => filterCat === "all" || p.categories?.name === filterCat)
    .filter(p => filterLevel === "all" || stockLevel(p.stock) === filterLevel)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const totalValue  = products.reduce((s, p) => s + p.price * p.stock, 0);
  const outOfStock  = products.filter(p => p.stock === 0).length;
  const critical    = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const lowStock    = products.filter(p => p.stock >= 5 && p.stock < 20).length;
  const activeCount = products.filter(p => p.is_active).length;

  const handleUpdateStock = async (id: string) => {
    const val = parseInt(editStock);
    if (isNaN(val) || val < 0) { toast.error("Stock invalide"); return; }
    setSaving(true);
    const { error } = await supabase.from("products").update({ stock: val, updated_at: new Date().toISOString() }).eq("id", id);
    setSaving(false);
    if (error) { toast.error("Erreur: " + error.message); return; }
    setProducts(ps => ps.map(p => p.id === id ? { ...p, stock: val } : p));
    setEditId(null);
    toast.success("Stock mis à jour");
  };

  return (
    <div className="space-y-4">
      <p className="font-headline font-black text-base text-gray-900">Gestion des Stocks</p>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Valeur totale stock",   value: fp(totalValue), icon: "inventory_2",          color: "#10b981", bg: "#ecfdf5" },
          { label: "Produits actifs",        value: activeCount,    icon: "check_circle",          color: "#3b82f6", bg: "#eff6ff" },
          { label: "Stock faible (<20)",     value: lowStock,       icon: "warning",               color: "#f59e0b", bg: "#fffbeb" },
          { label: "Rupture ou critique",    value: outOfStock + critical, icon: "remove_shopping_cart", color: "#ef4444", bg: "#fef2f2" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] leading-tight">{k.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: k.bg }}>
                <span className="material-symbols-outlined text-[16px]" style={{ color: k.color, fontVariationSettings: "'FILL' 1" }}>{k.icon}</span>
              </div>
            </div>
            <p className="font-headline font-black text-xl text-gray-900">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      {(outOfStock + critical) > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-red-500 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          <p className="text-[13px] text-red-700 font-medium">
            {outOfStock > 0 && <><strong>{outOfStock} produit{outOfStock > 1 ? "s" : ""} en rupture de stock</strong>. </>}
            {critical > 0  && <><strong>{critical} produit{critical > 1 ? "s" : ""} en stock critique</strong> (&lt; 5 unités).</>}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-3 flex-wrap">
          <p className="font-headline font-black text-sm text-gray-900 flex-1">Inventaire</p>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[15px]">search</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Chercher un produit…"
                className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-gray-600 outline-none w-44 focus:ring-2 focus:ring-gray-100"/>
            </div>
            <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 outline-none bg-white">
              <option value="all">Tous niveaux</option>
              <option value="rupture">Rupture</option>
              <option value="critique">Critique</option>
              <option value="faible">Faible</option>
              <option value="normal">Normal</option>
              <option value="bon">Bon</option>
            </select>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 outline-none bg-white">
              <option value="all">Toutes catégories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Produit","Catégorie","Prix unitaire","Stock","Niveau","Valeur stock","Modifier"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Chargement…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Aucun produit trouvé</td></tr>
              ) : filtered.map(p => {
                const level  = stockLevel(p.stock);
                const color  = stockColor(p.stock);
                const isEdit = editId === p.id;
                const maxBar = 100;
                const barPct = Math.min(100, Math.round((p.stock / maxBar) * 100));
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-9 h-9 rounded-lg object-cover shrink-0"/>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px] text-gray-400">image</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-gray-800 truncate">{p.name}</p>
                          <p className="text-[11px] text-gray-400">{p.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-gray-500">{p.categories?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-gray-700">{fp(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className="text-[15px] font-black" style={{ color }}>{p.stock}</span>
                      <span className="text-[11px] text-gray-400 ml-1">u.</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
                          <div className="h-full rounded-full transition-all" style={{ width: barPct + "%", background: color }}/>
                        </div>
                        <span className="text-[10.5px] font-semibold whitespace-nowrap" style={{ color }}>{stockLevelLabel[level]}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-bold text-gray-700">{fp(p.price * p.stock)}</td>
                    <td className="px-4 py-3">
                      {isEdit ? (
                        <div className="flex items-center gap-1.5">
                          <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)}
                            className="w-16 px-2 py-1 rounded-lg border border-gray-300 text-[12px] text-center outline-none focus:ring-2 focus:ring-gray-200"
                            min="0" autoFocus
                            onKeyDown={e => { if (e.key === "Enter") handleUpdateStock(p.id); if (e.key === "Escape") setEditId(null); }}/>
                          <button onClick={() => handleUpdateStock(p.id)} disabled={saving}
                            className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-50">
                            <span className="material-symbols-outlined text-[13px]">check</span>
                          </button>
                          <button onClick={() => setEditId(null)}
                            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <span className="material-symbols-outlined text-[13px] text-gray-400">close</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditId(p.id); setEditStock(p.stock.toString()); }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                          <span className="material-symbols-outlined text-[13px]">edit</span>
                          Modifier
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">{filtered.length} produit{filtered.length !== 1 ? "s" : ""} affichés</span>
          <span className="text-[11px] font-bold text-gray-600">
            Valeur: {fp(filtered.reduce((s, p) => s + p.price * p.stock, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}
