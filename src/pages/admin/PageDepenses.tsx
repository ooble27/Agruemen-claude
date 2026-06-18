import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Expense = {
  id: string; category: string; description: string; amount: number;
  expense_date: string; supplier: string | null; notes: string | null; created_at: string;
};

const fp = (n: number) => n.toLocaleString("fr-FR") + " FCFA";
const fd = (s: string) => new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const CATS = [
  { key: "achats_produits", label: "Achats produits",    color: "#3b82f6", icon: "inventory_2" },
  { key: "logistique",      label: "Logistique",         color: "#8b5cf6", icon: "local_shipping" },
  { key: "marketing",       label: "Marketing / Pub",    color: "#ec4899", icon: "campaign" },
  { key: "salaires",        label: "Salaires",           color: "#f59e0b", icon: "payments" },
  { key: "charges",         label: "Charges fixes",      color: "#6b7280", icon: "receipt_long" },
  { key: "autre",           label: "Autre",              color: "#9ca3af", icon: "more_horiz" },
] as const;
type CatKey = typeof CATS[number]["key"];

const EMPTY_FORM = {
  category:     "achats_produits" as CatKey,
  description:  "",
  amount:       "",
  expense_date: new Date().toISOString().slice(0, 10),
  supplier:     "",
  notes:        "",
};

export default function PageDepenses() {
  const { user }  = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [form,    setForm]      = useState({ ...EMPTY_FORM });
  const [saving,  setSaving]    = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchExpenses = async () => {
    const { data } = await supabase.from("expenses").select("*").order("expense_date", { ascending: false });
    if (data) setExpenses(data as Expense[]);
    setLoading(false);
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleSave = async () => {
    const amount = parseInt(form.amount);
    if (!form.description.trim()) { toast.error("La description est requise"); return; }
    if (!form.amount || isNaN(amount) || amount <= 0) { toast.error("Montant invalide"); return; }
    setSaving(true);
    const { error } = await supabase.from("expenses").insert({
      category:     form.category,
      description:  form.description.trim(),
      amount,
      expense_date: form.expense_date,
      supplier:     form.supplier.trim() || null,
      notes:        form.notes.trim() || null,
      created_by:   user?.id,
    });
    setSaving(false);
    if (error) { toast.error("Erreur: " + error.message); return; }
    toast.success("Dépense enregistrée");
    setForm({ ...EMPTY_FORM });
    setShowForm(false);
    fetchExpenses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette dépense ?")) return;
    setDeleting(id);
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (!error) { setExpenses(es => es.filter(e => e.id !== id)); toast.success("Supprimée"); }
    else toast.error("Erreur suppression");
    setDeleting(null);
  };

  const filtered   = filterCat === "all" ? expenses : expenses.filter(e => e.category === filterCat);
  const totalAll   = expenses.reduce((s, e) => s + e.amount, 0);
  const thisMonth  = expenses
    .filter(e => e.expense_date.slice(0, 7) === new Date().toISOString().slice(0, 7))
    .reduce((s, e) => s + e.amount, 0);

  const pieData = useMemo(() => CATS.map(c => ({
    name:  c.label,
    value: expenses.filter(e => e.category === c.key).reduce((s, e) => s + e.amount, 0),
    color: c.color,
  })).filter(d => d.value > 0), [expenses]);

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-headline font-black text-base text-gray-900">Achats & Dépenses</p>
        <button onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-[13px] font-semibold hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[15px]">{showForm ? "close" : "add"}</span>
          {showForm ? "Annuler" : "Nouvelle dépense"}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { label: "Total toutes dépenses", value: fp(totalAll),    icon: "account_balance",  note: `${expenses.length} entrée${expenses.length !== 1 ? "s" : ""}` },
          { label: "Dépenses ce mois",      value: fp(thisMonth),   icon: "calendar_month",   note: new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) },
          { label: "Catégories utilisées",  value: pieData.length,  icon: "category",         note: `sur ${CATS.length} disponibles` },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] leading-tight">{k.label}</p>
              <span className="material-symbols-outlined text-[16px] text-gray-300" style={{ fontVariationSettings: "'FILL' 1" }}>{k.icon}</span>
            </div>
            <p className="font-headline font-black text-lg text-gray-900">{k.value}</p>
            <p className="text-[11px] text-gray-400 mt-1">{k.note}</p>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="font-headline font-black text-sm text-gray-900 mb-4">Nouvelle dépense / achat</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Catégorie</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as CatKey }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200">
                {CATS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>

            <div className="sm:col-span-1 lg:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Description *</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Ex: Achat mangues Ziguinchor" maxLength={200}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200"/>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Montant (FCFA) *</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="Ex: 75 000" min="1"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200"/>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Date</label>
              <input type="date" value={form.expense_date} onChange={e => setForm(f => ({ ...f, expense_date: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200"/>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Fournisseur</label>
              <input value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))}
                placeholder="Ex: Marché Sandaga" maxLength={100}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200"/>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Notes</label>
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Informations supplémentaires..." maxLength={300}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200"/>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-[13px] font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Chart + list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {pieData.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="font-headline font-black text-sm text-gray-900 mb-1">Répartition</p>
            <p className="text-[11px] text-gray-400 mb-2">par type de dépense</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={2}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
                </Pie>
                <Tooltip formatter={(v: number) => fp(v)} contentStyle={{ borderRadius: 10, fontSize: 12 }}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }}/>
                  <span className="text-[11px] text-gray-500 flex-1 truncate">{d.name}</span>
                  <span className="text-[11px] font-bold text-gray-700">
                    {totalAll > 0 ? Math.round(d.value / totalAll * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`${pieData.length > 0 ? "lg:col-span-2" : "lg:col-span-3"} bg-white rounded-xl border border-gray-200 overflow-hidden`}>
          <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-3">
            <p className="font-headline font-black text-sm text-gray-900 flex-1">Liste des dépenses</p>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 outline-none bg-white">
              <option value="all">Toutes catégories</option>
              {CATS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>

          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">Chargement…</div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <span className="material-symbols-outlined text-4xl text-gray-200 block mb-2">receipt</span>
                <p className="text-sm text-gray-400">Aucune dépense enregistrée</p>
                <button onClick={() => setShowForm(true)} className="mt-3 text-[12px] font-semibold text-gray-500 underline">
                  Ajouter une dépense
                </button>
              </div>
            ) : (
              filtered.map(e => {
                const cat = CATS.find(c => c.key === e.category);
                return (
                  <div key={e.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50/50 group transition-colors">
                    <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center" style={{ background: (cat?.color ?? "#9ca3af") + "18" }}>
                      <span className="material-symbols-outlined text-[15px]" style={{ color: cat?.color ?? "#9ca3af", fontVariationSettings: "'FILL' 1" }}>
                        {cat?.icon ?? "receipt"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-800 truncate">{e.description}</p>
                      <div className="flex items-center flex-wrap gap-2 mt-0.5">
                        <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ background: (cat?.color ?? "#9ca3af") + "18", color: cat?.color ?? "#9ca3af" }}>
                          {cat?.label ?? e.category}
                        </span>
                        <span className="text-[11px] text-gray-400">{fd(e.expense_date)}</span>
                        {e.supplier && <span className="text-[11px] text-gray-400">· {e.supplier}</span>}
                      </div>
                      {e.notes && <p className="text-[11px] text-gray-400 mt-0.5 truncate italic">{e.notes}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[14px] font-black text-red-500">− {fp(e.amount)}</p>
                    </div>
                    <button onClick={() => handleDelete(e.id)} disabled={deleting === e.id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
          {filtered.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 flex justify-between">
              <span className="text-[11px] text-gray-400">{filtered.length} entrée{filtered.length !== 1 ? "s" : ""}</span>
              <span className="text-[11px] font-bold text-red-500">
                Total: − {fp(filtered.reduce((s, e) => s + e.amount, 0))}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
