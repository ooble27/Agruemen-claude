import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ACCESS_CODE = "MAMAKAASA2026";
const SESSION_KEY = "mgmt_auth_v1";
const CAPITAL_KEY = "mgmt_capital_v1";
const DEFAULT_CAPITAL = 900_000;

type Operation = {
  id: string;
  operation_number: number | null;
  product_name: string;
  product_emoji: string;
  location: string | null;
  operation_date: string | null;
  quantity: number | null;
  quantity_unit: string;
  purchase_amount: number;
  transport_amount: number;
  total_sale: number;
  collected_amount: number;
  to_collect_amount: number;
  net_profit: number;
  notes: string | null;
  status: string;
  created_at: string;
};

const fp = (n: number) => n.toLocaleString("fr-FR") + " FCFA";
const fd = (s: string | null) =>
  s ? new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const EMOJIS = ["🥭","🧅","🍈","🍊","🥬","🌾","🌶️","🥔","🍌","🍋","🥝","🍉","🌿","📦"];
const UNITS  = ["KG","SACS","BASSINES","BALLES","CAISSES","BOÎTES","UNITÉS","TONNES"];

const EMPTY_FORM = {
  operation_number: "",
  product_name: "",
  product_emoji: "📦",
  location: "",
  operation_date: new Date().toISOString().slice(0, 10),
  quantity: "",
  quantity_unit: "KG",
  purchase_amount: "",
  transport_amount: "0",
  total_sale: "",
  collected_amount: "",
  to_collect_amount: "",
  net_profit: "",
  notes: "",
  manual_profit: false as boolean,
};

/* ═══════════════════════════════════════════
   ENTRY POINT — PIN gate
═══════════════════════════════════════════ */
export default function Gestion() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [code,   setCode]   = useState("");
  const [error,  setError]  = useState(false);

  const handleLogin = () => {
    if (code.toUpperCase().trim() === ACCESS_CODE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
    } else {
      setError(true);
      setCode("");
      setTimeout(() => setError(false), 2500);
    }
  };

  if (!authed) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-white rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-5">
          <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
        </div>
        <h1 className="font-headline font-black text-2xl text-gray-900 mb-1">Gestion Interne</h1>
        <p className="text-sm text-gray-400 mb-7">Mamakaasa — Espace équipe</p>
        <input
          type="password"
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          placeholder="Code d'accès"
          autoFocus
          className={`w-full px-4 py-3.5 rounded-xl border-2 text-center font-headline font-bold text-lg tracking-[0.3em] outline-none transition-all mb-3 ${
            error ? "border-red-400 bg-red-50 text-red-600 placeholder:text-red-300" : "border-gray-200 bg-gray-50 text-gray-900 focus:border-gray-900"
          }`}
        />
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-sm text-red-500 mb-3">Code incorrect. Réessayez.</motion.p>
          )}
        </AnimatePresence>
        <button onClick={handleLogin}
          className="w-full py-3.5 rounded-xl bg-gray-900 text-white font-headline font-bold text-base hover:opacity-90 transition-opacity">
          Accéder →
        </button>
        <Link to="/" className="block mt-5 text-[12px] text-gray-400 hover:text-gray-600 transition-colors">
          ← Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  );

  return <GestionDashboard />;
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════ */
function GestionDashboard() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editOp,     setEditOp]     = useState<Operation | null>(null);
  const [form,       setForm]       = useState({ ...EMPTY_FORM });
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState<string | null>(null);
  const [capital,    setCapital]    = useState<number>(() => {
    const saved = localStorage.getItem(CAPITAL_KEY);
    return saved ? parseInt(saved) : DEFAULT_CAPITAL;
  });
  const [editCapital,  setEditCapital]  = useState(false);
  const [tempCapital,  setTempCapital]  = useState("");

  const fetchOps = async () => {
    const { data, error } = await supabase.from("operations").select("*").order("operation_number", { ascending: true, nullsFirst: false });
    if (data) setOperations(data as Operation[]);
    if (error) toast.error("Erreur chargement: " + error.message);
    setLoading(false);
  };

  useEffect(() => { fetchOps(); }, []);

  /* Auto-calculate profit */
  useEffect(() => {
    if (!form.manual_profit) {
      const profit = (parseInt(form.total_sale) || 0) - (parseInt(form.purchase_amount) || 0) - (parseInt(form.transport_amount) || 0);
      setForm(f => ({ ...f, net_profit: profit.toString() }));
    }
  }, [form.total_sale, form.purchase_amount, form.transport_amount, form.manual_profit]);

  /* Auto-calculate to_collect */
  useEffect(() => {
    const toCollect = Math.max(0, (parseInt(form.total_sale) || 0) - (parseInt(form.collected_amount) || 0));
    setForm(f => ({ ...f, to_collect_amount: toCollect.toString() }));
  }, [form.total_sale, form.collected_amount]);

  const handleSave = async () => {
    if (!form.product_name.trim()) { toast.error("Nom du produit requis"); return; }
    if (form.purchase_amount === "" || parseInt(form.purchase_amount) < 0) { toast.error("Montant d'achat invalide"); return; }

    const payload = {
      operation_number:  form.operation_number ? parseInt(form.operation_number) : null,
      product_name:      form.product_name.trim(),
      product_emoji:     form.product_emoji,
      location:          form.location.trim() || null,
      operation_date:    form.operation_date || null,
      quantity:          form.quantity ? parseFloat(form.quantity) : null,
      quantity_unit:     form.quantity_unit,
      purchase_amount:   parseInt(form.purchase_amount) || 0,
      transport_amount:  parseInt(form.transport_amount) || 0,
      total_sale:        parseInt(form.total_sale) || 0,
      collected_amount:  parseInt(form.collected_amount) || 0,
      to_collect_amount: parseInt(form.to_collect_amount) || 0,
      net_profit:        parseInt(form.net_profit) || 0,
      notes:             form.notes.trim() || null,
      status:            (parseInt(form.to_collect_amount) || 0) > 0 ? "partial" : "completed",
    };

    setSaving(true);
    const { error } = editOp
      ? await supabase.from("operations").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editOp.id)
      : await supabase.from("operations").insert(payload);
    setSaving(false);

    if (error) { toast.error("Erreur: " + error.message); return; }
    toast.success(editOp ? "Opération modifiée ✓" : "Opération ajoutée ✓");
    setForm({ ...EMPTY_FORM });
    setShowForm(false);
    setEditOp(null);
    fetchOps();
  };

  const handleEdit = (op: Operation) => {
    setForm({
      operation_number:  op.operation_number?.toString() ?? "",
      product_name:      op.product_name,
      product_emoji:     op.product_emoji,
      location:          op.location ?? "",
      operation_date:    op.operation_date ?? new Date().toISOString().slice(0, 10),
      quantity:          op.quantity?.toString() ?? "",
      quantity_unit:     op.quantity_unit,
      purchase_amount:   op.purchase_amount.toString(),
      transport_amount:  op.transport_amount.toString(),
      total_sale:        op.total_sale.toString(),
      collected_amount:  op.collected_amount.toString(),
      to_collect_amount: op.to_collect_amount.toString(),
      net_profit:        op.net_profit.toString(),
      notes:             op.notes ?? "",
      manual_profit:     true,
    });
    setEditOp(op);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette opération définitivement ?")) return;
    setDeleting(id);
    const { error } = await supabase.from("operations").delete().eq("id", id);
    if (!error) { setOperations(os => os.filter(o => o.id !== id)); toast.success("Supprimée"); }
    else toast.error("Erreur suppression");
    setDeleting(null);
  };

  const saveCapital = (val: number) => {
    setCapital(val);
    localStorage.setItem(CAPITAL_KEY, val.toString());
    setEditCapital(false);
  };

  const totals = useMemo(() => ({
    benefice:     operations.reduce((s, o) => s + o.net_profit, 0),
    aEncaisser:   operations.reduce((s, o) => s + o.to_collect_amount, 0),
    totalAchat:   operations.reduce((s, o) => s + o.purchase_amount + o.transport_amount, 0),
    totalVente:   operations.reduce((s, o) => s + o.total_sale, 0),
    encaisse:     operations.reduce((s, o) => s + o.collected_amount, 0),
  }), [operations]);

  const capitalActuel = capital + totals.benefice;

  return (
    <div className="min-h-screen bg-[#F0F2F5]">

      {/* ─── Header ─── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <div className="min-w-0">
            <p className="font-headline font-black text-gray-900 text-[13px] leading-none">Mamakaasa</p>
            <p className="font-body text-[9px] text-gray-400 mt-0.5">Gestion des Opérations</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => { setEditOp(null); setForm({ ...EMPTY_FORM }); setShowForm(f => !f); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-[13px] font-semibold hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-[15px]">{showForm && !editOp ? "close" : "add"}</span>
              <span className="hidden sm:inline">{showForm && !editOp ? "Annuler" : "Nouvelle opération"}</span>
            </button>
            <Link to="/" className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors" title="Accueil">
              <span className="material-symbols-outlined text-[17px]">home</span>
            </Link>
            <button onClick={() => { sessionStorage.removeItem(SESSION_KEY); window.location.reload(); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors" title="Se déconnecter">
              <span className="material-symbols-outlined text-[17px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5 space-y-4">

        {/* ─── KPI cards ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Bénéfice net réalisé", value: fp(totals.benefice),   icon: "trending_up",            color: "#10b981", bg: "#ecfdf5" },
            { label: "Capital actuel",        value: fp(capitalActuel),     icon: "account_balance_wallet", color: "#3b82f6", bg: "#eff6ff" },
            { label: "À encaisser",           value: fp(totals.aEncaisser), icon: "hourglass_empty",        color: "#f59e0b", bg: "#fffbeb" },
            { label: "Opérations",            value: operations.length,     icon: "list_alt",               color: "#6b7280", bg: "#f9fafb" },
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

        {/* ─── Capital banner ─── */}
        <div className="bg-gray-900 rounded-xl p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-1">Capital de départ</p>
              {editCapital ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number" value={tempCapital} onChange={e => setTempCapital(e.target.value)}
                    autoFocus onKeyDown={e => { if (e.key === "Enter") saveCapital(parseInt(tempCapital) || DEFAULT_CAPITAL); }}
                    className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-base font-bold outline-none w-44" />
                  <button onClick={() => saveCapital(parseInt(tempCapital) || DEFAULT_CAPITAL)}
                    className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-[12px] font-bold">OK</button>
                  <button onClick={() => setEditCapital(false)}
                    className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center">✕</button>
                </div>
              ) : (
                <button onClick={() => { setTempCapital(capital.toString()); setEditCapital(true); }}
                  className="flex items-center gap-2 group">
                  <p className="font-headline font-black text-2xl text-white">{fp(capital)}</p>
                  <span className="material-symbols-outlined text-[14px] text-gray-600 group-hover:text-gray-400 transition-colors">edit</span>
                </button>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-1">Capital + Bénéfices</p>
              <p className="font-headline font-black text-2xl text-emerald-400">{fp(capitalActuel)}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {fp(capital)} + {fp(totals.benefice)}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Add / Edit form ─── */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="font-headline font-black text-sm text-gray-900 mb-4">
                {editOp ? `Modifier — Opération N°${editOp.operation_number ?? "?"}` : "Nouvelle opération"}
              </p>

              <div className="space-y-3">

                {/* Line 1: N°, produit, lieu, date */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5">N° opération</label>
                    <input type="number" value={form.operation_number} onChange={e => setForm(f => ({ ...f, operation_number: e.target.value }))}
                      placeholder="5" min="1"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5">Produit *</label>
                    <input value={form.product_name} onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))}
                      placeholder="Ex: Mangue, Oignons, Madd…"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200" />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5">Date</label>
                    <input type="date" value={form.operation_date} onChange={e => setForm(f => ({ ...f, operation_date: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200" />
                  </div>
                </div>

                {/* Emoji picker + lieu + qty */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5">Icône</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {EMOJIS.map(e => (
                        <button key={e} onClick={() => setForm(f => ({ ...f, product_emoji: e }))}
                          className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${form.product_emoji === e ? "bg-gray-900 scale-105" : "bg-gray-100 hover:bg-gray-200"}`}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5">Lieu d'approvisionnement</label>
                    <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                      placeholder="Ex: DIOUROU, Thiès…"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200" />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5">Quantité</label>
                    <div className="flex">
                      <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                        placeholder="300" min="0"
                        className="flex-1 w-0 px-3 py-2.5 rounded-l-xl border border-r-0 border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200" />
                      <select value={form.quantity_unit} onChange={e => setForm(f => ({ ...f, quantity_unit: e.target.value }))}
                        className="px-2 py-2.5 rounded-r-xl border border-gray-200 text-[12px] bg-gray-50 outline-none shrink-0">
                        {UNITS.map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Costs */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5">Montant achat (FCFA) *</label>
                    <input type="number" value={form.purchase_amount} onChange={e => setForm(f => ({ ...f, purchase_amount: e.target.value }))}
                      placeholder="Ex: 48 000" min="0"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200" />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5">Transport (FCFA)</label>
                    <input type="number" value={form.transport_amount} onChange={e => setForm(f => ({ ...f, transport_amount: e.target.value }))}
                      placeholder="Ex: 22 000" min="0"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200" />
                  </div>
                </div>

                {/* Sales */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5">Total vente (FCFA)</label>
                    <input type="number" value={form.total_sale} onChange={e => setForm(f => ({ ...f, total_sale: e.target.value }))}
                      placeholder="Ex: 90 000" min="0"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200" />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5">Déjà encaissé (FCFA)</label>
                    <input type="number" value={form.collected_amount} onChange={e => setForm(f => ({ ...f, collected_amount: e.target.value }))}
                      placeholder="Ex: 90 000" min="0"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200" />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5">Reste à encaisser</label>
                    <input type="number" value={form.to_collect_amount}
                      onChange={e => setForm(f => ({ ...f, to_collect_amount: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-100 text-gray-500 outline-none" readOnly />
                  </div>
                </div>

                {/* Profit + notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-2 text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5">
                      Bénéfice net (FCFA)
                      <button
                        onClick={() => setForm(f => ({ ...f, manual_profit: !f.manual_profit }))}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${form.manual_profit ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {form.manual_profit ? "Manuel" : "Auto"}
                      </button>
                    </label>
                    <input
                      type="number"
                      value={form.net_profit}
                      onChange={e => setForm(f => ({ ...f, net_profit: e.target.value, manual_profit: true }))}
                      className={`w-full px-3 py-2.5 rounded-xl border text-[13px] font-bold outline-none focus:ring-2 focus:ring-gray-200 ${
                        form.manual_profit ? "border-gray-900 bg-white text-gray-900" : "border-gray-200 bg-gray-100 text-gray-500 cursor-default"
                      }`}
                      readOnly={!form.manual_profit}
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5">Notes / Détails de l'opération</label>
                    <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Ex: 9 sacs × 22 000 FCFA, 270 FCFA/kg → 38 800…" maxLength={500}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200" />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button onClick={handleSave} disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-[13px] font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
                    {saving ? "Enregistrement…" : editOp ? "Enregistrer les modifications" : "Ajouter l'opération"}
                  </button>
                  <button onClick={() => { setShowForm(false); setEditOp(null); setForm({ ...EMPTY_FORM }); }}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Operations list ─── */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">Chargement…</div>
          ) : operations.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">list_alt</span>
              <p className="text-sm text-gray-400">Aucune opération enregistrée</p>
              <button onClick={() => setShowForm(true)} className="mt-3 text-[12px] font-semibold text-gray-900 underline">
                Ajouter la première opération
              </button>
            </div>
          ) : (
            operations.map(op => (
              <OperationCard key={op.id} op={op} onEdit={handleEdit} onDelete={handleDelete} deleting={deleting} />
            ))
          )}
        </div>

        {/* ─── Summary footer ─── */}
        {operations.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-4 sm:p-5">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">
              Récapitulatif — {operations.length} opération{operations.length > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-[11px] text-gray-500 mb-0.5">Total achats + transport</p>
                <p className="font-headline font-black text-lg text-red-400">− {fp(totals.totalAchat)}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-0.5">Total ventes</p>
                <p className="font-headline font-black text-lg text-white">{fp(totals.totalVente)}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-0.5">Déjà encaissé</p>
                <p className="font-headline font-black text-lg text-sky-400">{fp(totals.encaisse)}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-0.5">À encaisser</p>
                <p className="font-headline font-black text-lg text-amber-400">{fp(totals.aEncaisser)}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-gray-500">Capital de départ</p>
                <p className="font-headline font-black text-xl text-white">{fp(capital)}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-500">🎯 Bénéfice total net réalisé</p>
                <p className="font-headline font-black text-3xl text-emerald-400">{fp(totals.benefice)}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════
   OPERATION CARD — expandable
═══════════════════════════════════════════ */
function OperationCard({ op, onEdit, onDelete, deleting }: {
  op: Operation;
  onEdit: (o: Operation) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const totalCost = op.purchase_amount + op.transport_amount;
  const isPartial = op.to_collect_amount > 0;

  return (
    <div className={`bg-white rounded-xl border overflow-hidden transition-all ${isPartial ? "border-amber-200" : "border-gray-200"}`}>

      {/* ── Summary row ── */}
      <div className="p-4 cursor-pointer select-none" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">
            {op.product_emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              {op.operation_number != null && (
                <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Opération #{op.operation_number}
                </span>
              )}
              {isPartial && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Encaissement partiel
                </span>
              )}
            </div>
            <p className="font-headline font-black text-[15px] text-gray-900">{op.product_emoji} {op.product_name}</p>
            <div className="flex items-center gap-3 text-[11.5px] text-gray-400 mt-0.5 flex-wrap">
              {op.location      && <span>📍 {op.location}</span>}
              {op.operation_date && <span>🗓️ {fd(op.operation_date)}</span>}
              {op.quantity      && <span>⚖️ {op.quantity} {op.quantity_unit}</span>}
            </div>
          </div>
          <div className="text-right shrink-0 mr-1">
            <p className="text-[10.5px] text-gray-400 mb-0.5">Bénéfice net</p>
            <p className={`font-headline font-black text-xl ${op.net_profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {op.net_profit >= 0 ? "+" : ""}{op.net_profit.toLocaleString("fr-FR")} F
            </p>
          </div>
          <span className={`material-symbols-outlined text-gray-300 text-[20px] transition-transform duration-200 shrink-0 ${expanded ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </div>
      </div>

      {/* ── Detail panel ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-gray-100 pt-3">

              {/* Cost/Sale grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
                {[
                  { label: "Achat",       value: op.purchase_amount,  color: "#ef4444", icon: "shopping_bag" },
                  { label: "Transport",   value: op.transport_amount, color: "#f59e0b", icon: "local_shipping" },
                  { label: "Total vente", value: op.total_sale,       color: "#3b82f6", icon: "payments" },
                  { label: "Coût total",  value: totalCost,           color: "#6b7280", icon: "calculate" },
                ].map(k => (
                  <div key={k.label} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-[13px]" style={{ color: k.color }}>{ k.icon }</span>
                      <p className="text-[10.5px] text-gray-400 font-medium">{k.label}</p>
                    </div>
                    <p className="font-headline font-bold text-sm" style={{ color: k.color }}>
                      {k.value.toLocaleString("fr-FR")} F
                    </p>
                  </div>
                ))}
              </div>

              {/* Encaissement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <p className="text-[10.5px] text-emerald-600 font-semibold mb-0.5">✅ Déjà encaissé</p>
                  <p className="font-headline font-black text-base text-emerald-700">
                    {op.collected_amount.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
                {op.to_collect_amount > 0 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <p className="text-[10.5px] text-amber-600 font-semibold mb-0.5">⏳ Reste à encaisser</p>
                    <p className="font-headline font-black text-base text-amber-700">
                      {op.to_collect_amount.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {op.notes && (
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <p className="text-[10.5px] text-gray-400 font-semibold mb-1">📝 Détails</p>
                  <p className="text-[12.5px] text-gray-600 whitespace-pre-wrap leading-relaxed">{op.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <button onClick={() => onEdit(op)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  Modifier
                </button>
                <button onClick={() => onDelete(op.id)} disabled={deleting === op.id}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-100 text-[12px] font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                  {deleting === op.id ? "…" : "Supprimer"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
