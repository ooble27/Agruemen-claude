import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ACCESS_CODE     = "MAMAKAASA2026";
const SESSION_KEY     = "mgmt_auth_v1";
const CAPITAL_KEY     = "mgmt_capital_v1";
const OPS_STORE_KEY   = "mgmt_ops_v1";
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

/* ── Seed : 4 real operations ── */
const SEED: Operation[] = [
  {
    id: "op-001", operation_number: 1,
    product_name: "Mangue", product_emoji: "🥭",
    location: "DIOUROU (Tabaski)", operation_date: null,
    quantity: 300, quantity_unit: "KG",
    purchase_amount: 48000, transport_amount: 22000,
    total_sale: 90000, collected_amount: 90000, to_collect_amount: 0,
    net_profit: 30000, status: "completed",
    notes: "12 bassines × 4 000 FCFA = 48 000 FCFA achat • 300 FCFA/KG × 300 KG = 90 000 FCFA vente",
    created_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "op-002", operation_number: 2,
    product_name: "Mangue", product_emoji: "🥭",
    location: "DIOUROU", operation_date: null,
    quantity: 315, quantity_unit: "KG",
    purchase_amount: 22000, transport_amount: 18000,
    total_sale: 55900, collected_amount: 30000, to_collect_amount: 25900,
    net_profit: 15900, status: "partial",
    notes: "9 sacs de mangue = 22 000 FCFA achat • Vente : 270 FCFA/KG → 38 800 FCFA + 100 FCFA/KG → 17 100 FCFA",
    created_at: "2026-06-05T00:00:00Z",
  },
  {
    id: "op-003", operation_number: 3,
    product_name: "Oignons verts", product_emoji: "🧅",
    location: null, operation_date: null,
    quantity: null, quantity_unit: "KG",
    purchase_amount: 75000, transport_amount: 40000,
    total_sale: 130000, collected_amount: 91500, to_collect_amount: 38500,
    net_profit: 15000, status: "partial",
    notes: "10 balles = 75 000 FCFA achat • Transport : 16 000 + 21 000 + 3 000 = 40 000 FCFA • Encaissé : 91 500 FCFA • Reste : 16 500 + 10 000 + 12 000 = 38 500 FCFA",
    created_at: "2026-06-10T00:00:00Z",
  },
  {
    id: "op-004", operation_number: 4,
    product_name: "Madd", product_emoji: "🍈",
    location: null, operation_date: "2026-06-14",
    quantity: null, quantity_unit: "KG",
    purchase_amount: 32000, transport_amount: 0,
    total_sale: 56000, collected_amount: 56000, to_collect_amount: 0,
    net_profit: 24000, status: "completed",
    notes: "4 sacs × 8 000 FCFA = 32 000 FCFA achat • 4 sacs × 14 000 FCFA = 56 000 FCFA vente",
    created_at: "2026-06-14T00:00:00Z",
  },
];

/* ── localStorage helpers ── */
function loadOps(): Operation[] {
  try {
    const raw = localStorage.getItem(OPS_STORE_KEY);
    if (raw) {
      const arr = JSON.parse(raw) as Operation[];
      if (Array.isArray(arr) && arr.length > 0)
        return [...arr].sort((a, b) => (a.operation_number ?? 999) - (b.operation_number ?? 999));
    }
  } catch {}
  localStorage.setItem(OPS_STORE_KEY, JSON.stringify(SEED));
  return SEED;
}

function persistOps(ops: Operation[]) {
  localStorage.setItem(OPS_STORE_KEY, JSON.stringify(ops));
}

/* ── Formatters ── */
const fp = (n: number) => n.toLocaleString("fr-FR") + " FCFA";
const fd = (s: string | null) =>
  s ? new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const EMOJIS = ["🥭","🧅","🍈","🍊","🥬","🌾","🌶️","🥔","🍌","🍋","🥝","🍉","🌿","📦"];
const UNITS  = ["KG","SACS","BASSINES","BALLES","CAISSES","BOÎTES","UNITÉS","TONNES"];

const EMPTY_FORM = {
  operation_number: "",
  product_name:     "",
  product_emoji:    "📦",
  location:         "",
  operation_date:   new Date().toISOString().slice(0, 10),
  quantity:         "",
  quantity_unit:    "KG",
  purchase_amount:  "",
  transport_amount: "0",
  total_sale:       "",
  collected_amount: "",
  to_collect_amount:"0",
  net_profit:       "",
  notes:            "",
  manual_profit:    false as boolean,
};

/* ══════════════════════════════════════════════
   PIN GATE
══════════════════════════════════════════════ */
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Dark header with logo */}
        <div className="bg-gray-950 px-6 py-5 flex items-center justify-center">
          <img src="/logo-mamakaasa.png" alt="Mamakaasa" className="h-10 object-contain" />
        </div>

        <div className="px-7 py-6">
          <p className="text-[13px] text-gray-500 text-center mb-6">
            Espace Gestion — Équipe interne
          </p>

          <label className="block text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.1em] mb-2">
            Code d'accès
          </label>
          <input
            type="password"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="••••••••••••"
            autoFocus
            className={`w-full px-4 py-3.5 rounded-xl border-2 text-center font-headline font-bold text-lg tracking-[0.3em] outline-none transition-all mb-4 ${
              error
                ? "border-red-400 bg-red-50 text-red-600 placeholder:text-red-300"
                : "border-gray-200 bg-gray-50 text-gray-900 focus:border-gray-900"
            }`}
          />

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-sm text-red-500 text-center mb-3"
              >
                Code incorrect. Réessayez.
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-gray-900 text-white font-headline font-bold hover:opacity-90 transition-opacity"
          >
            Accéder à la gestion →
          </button>

          <Link to="/" className="block mt-4 text-[12px] text-gray-400 hover:text-gray-600 text-center transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    </div>
  );

  return <GestionDashboard />;
}

/* ══════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════ */
function GestionDashboard() {
  const [operations, setOperations] = useState<Operation[]>(() => loadOps());
  const [showForm,   setShowForm]   = useState(false);
  const [editOp,     setEditOp]     = useState<Operation | null>(null);
  const [form,       setForm]       = useState({ ...EMPTY_FORM });
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState<string | null>(null);
  const [supaSync,   setSupaSync]   = useState<"idle" | "ok" | "offline">("idle");
  const [capital,    setCapital]    = useState<number>(() => {
    const s = localStorage.getItem(CAPITAL_KEY);
    return s ? parseInt(s) : DEFAULT_CAPITAL;
  });
  const [editCapital, setEditCapital] = useState(false);
  const [tempCapital, setTempCapital] = useState("");

  /* ── Supabase background sync ── */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("operations")
        .select("*")
        .order("operation_number", { ascending: true, nullsFirst: false });

      if (error) {
        setSupaSync("offline");
        return;
      }

      setSupaSync("ok");

      if (data && data.length > 0) {
        const ops = data as Operation[];
        setOperations(ops);
        persistOps(ops);
      } else {
        /* Table exists but empty — seed it */
        const seedPayload = SEED.map(({ id: _id, created_at: _ca, ...rest }) => rest);
        await supabase.from("operations").insert(seedPayload);
        const { data: d2 } = await supabase
          .from("operations")
          .select("*")
          .order("operation_number", { ascending: true, nullsFirst: false });
        if (d2 && d2.length > 0) {
          const ops = d2 as Operation[];
          setOperations(ops);
          persistOps(ops);
        }
      }
    })();
  }, []);

  /* ── Auto-calculate profit ── */
  useEffect(() => {
    if (!form.manual_profit) {
      const p = (parseInt(form.total_sale) || 0)
        - (parseInt(form.purchase_amount) || 0)
        - (parseInt(form.transport_amount) || 0);
      setForm(f => ({ ...f, net_profit: p.toString() }));
    }
  }, [form.total_sale, form.purchase_amount, form.transport_amount, form.manual_profit]);

  /* ── Auto-calculate to_collect ── */
  useEffect(() => {
    const tc = Math.max(0,
      (parseInt(form.total_sale) || 0) - (parseInt(form.collected_amount) || 0)
    );
    setForm(f => ({ ...f, to_collect_amount: tc.toString() }));
  }, [form.total_sale, form.collected_amount]);

  /* ── Save (localStorage first, then Supabase) ── */
  const handleSave = async () => {
    if (!form.product_name.trim()) { toast.error("Nom du produit requis"); return; }

    const now = new Date().toISOString();
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

    if (editOp) {
      const updated: Operation = { ...editOp, ...payload };
      const newOps = operations.map(o => o.id === editOp.id ? updated : o);
      setOperations(newOps);
      persistOps(newOps);

      if (supaSync === "ok") {
        const { error } = await supabase
          .from("operations")
          .update({ ...payload, updated_at: now })
          .eq("id", editOp.id);
        if (error) toast.error("Synchro: " + error.message);
      }
      toast.success("Opération modifiée ✓");
    } else {
      const tempId = crypto.randomUUID();
      const newOp: Operation = { id: tempId, ...payload, created_at: now };
      const newOps = [...operations, newOp].sort(
        (a, b) => (a.operation_number ?? 999) - (b.operation_number ?? 999)
      );
      setOperations(newOps);
      persistOps(newOps);

      if (supaSync === "ok") {
        const { data, error } = await supabase.from("operations").insert(payload).select().single();
        if (data) {
          const fixed = newOps.map(o => o.id === tempId ? (data as Operation) : o);
          setOperations(fixed);
          persistOps(fixed);
        }
        if (error) toast.error("Synchro: " + error.message);
      }
      toast.success("Opération ajoutée ✓");
    }

    setSaving(false);
    setForm({ ...EMPTY_FORM });
    setShowForm(false);
    setEditOp(null);
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
    const newOps = operations.filter(o => o.id !== id);
    setOperations(newOps);
    persistOps(newOps);
    if (supaSync === "ok") {
      await supabase.from("operations").delete().eq("id", id);
    }
    toast.success("Opération supprimée");
    setDeleting(null);
  };

  const saveCapital = (val: number) => {
    setCapital(val);
    localStorage.setItem(CAPITAL_KEY, val.toString());
    setEditCapital(false);
  };

  const totals = useMemo(() => ({
    benefice:   operations.reduce((s, o) => s + o.net_profit,        0),
    aEncaisser: operations.reduce((s, o) => s + o.to_collect_amount,  0),
    totalAchat: operations.reduce((s, o) => s + o.purchase_amount + o.transport_amount, 0),
    totalVente: operations.reduce((s, o) => s + o.total_sale,         0),
    encaisse:   operations.reduce((s, o) => s + o.collected_amount,   0),
  }), [operations]);

  const capitalActuel = capital + totals.benefice;

  const inp = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-900/10 transition-all";
  const lbl = "block text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5";

  return (
    <div className="min-h-screen bg-[#F0F2F5]">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <img src="/logo-mamakaasa.png" alt="Mamakaasa" className="h-7 object-contain shrink-0" />
          <div className="w-px h-5 bg-gray-200 mx-1 shrink-0" />
          <p className="text-[12px] font-semibold text-gray-500 hidden sm:block">Gestion des Opérations</p>

          {supaSync === "ok" && (
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
              ● Synchro
            </span>
          )}
          {supaSync === "offline" && (
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
              ● Mode local
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => { setEditOp(null); setForm({ ...EMPTY_FORM }); setShowForm(v => !v); }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gray-900 text-white text-[12.5px] font-semibold hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[14px]">
                {showForm && !editOp ? "close" : "add"}
              </span>
              <span className="hidden sm:inline">{showForm && !editOp ? "Annuler" : "Nouvelle opération"}</span>
            </button>
            <Link to="/"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              title="Accueil"
            >
              <span className="material-symbols-outlined text-[17px]">home</span>
            </Link>
            <button
              onClick={() => { sessionStorage.removeItem(SESSION_KEY); window.location.reload(); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              title="Se déconnecter"
            >
              <span className="material-symbols-outlined text-[17px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-4">

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Bénéfice net réalisé",
              value: fp(totals.benefice),
              sub:   `${operations.length} opération${operations.length > 1 ? "s" : ""}`,
              icon:  "trending_up",
              color: "#10b981",
              bg:    "#ecfdf5",
            },
            {
              label: "Capital actuel",
              value: fp(capitalActuel),
              sub:   `départ : ${fp(capital)}`,
              icon:  "account_balance_wallet",
              color: "#3b82f6",
              bg:    "#eff6ff",
            },
            {
              label: "À encaisser",
              value: fp(totals.aEncaisser),
              sub:   "montant restant dû",
              icon:  "hourglass_empty",
              color: "#f59e0b",
              bg:    "#fffbeb",
            },
            {
              label: "Total ventes",
              value: fp(totals.totalVente),
              sub:   `encaissé : ${fp(totals.encaisse)}`,
              icon:  "payments",
              color: "#8b5cf6",
              bg:    "#f5f3ff",
            },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.06em] leading-tight pr-1">
                  {k.label}
                </p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: k.bg }}>
                  <span className="material-symbols-outlined text-[16px]"
                    style={{ color: k.color, fontVariationSettings: "'FILL' 1" }}>
                    {k.icon}
                  </span>
                </div>
              </div>
              <p className="font-headline font-black text-lg text-gray-900 leading-tight">{k.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Capital / Recap banner ── */}
        <div className="bg-gray-900 rounded-xl p-4 sm:p-5">
          <div className="flex items-start justify-between flex-wrap gap-5">
            {/* Left: capital */}
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-1">
                Capital de départ
              </p>
              {editCapital ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tempCapital}
                    onChange={e => setTempCapital(e.target.value)}
                    autoFocus
                    onKeyDown={e => { if (e.key === "Enter") saveCapital(parseInt(tempCapital) || DEFAULT_CAPITAL); }}
                    className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-base font-bold outline-none w-44"
                  />
                  <button onClick={() => saveCapital(parseInt(tempCapital) || DEFAULT_CAPITAL)}
                    className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-[12px] font-bold">
                    OK
                  </button>
                  <button onClick={() => setEditCapital(false)}
                    className="w-8 h-8 rounded-xl bg-white/10 text-white/70 flex items-center justify-center text-sm">
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setTempCapital(capital.toString()); setEditCapital(true); }}
                  className="flex items-center gap-2 group"
                >
                  <p className="font-headline font-black text-2xl text-white">{fp(capital)}</p>
                  <span className="material-symbols-outlined text-[14px] text-gray-600 group-hover:text-gray-400 transition-colors">
                    edit
                  </span>
                </button>
              )}
            </div>

            {/* Right: breakdown */}
            <div className="flex gap-6 sm:gap-8 flex-wrap">
              <div className="text-right">
                <p className="text-[10px] text-gray-500 mb-0.5">Achats + Transport</p>
                <p className="font-headline font-bold text-base text-red-400">−{fp(totals.totalAchat)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 mb-0.5">Déjà encaissé</p>
                <p className="font-headline font-bold text-base text-sky-400">{fp(totals.encaisse)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 mb-0.5">Capital + Bénéfice</p>
                <p className="font-headline font-black text-xl text-emerald-400">{fp(capitalActuel)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Add / Edit form ── */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Form header */}
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <p className="font-headline font-black text-[13px] text-gray-900">
                  {editOp ? `✏️ Modifier — Opération N°${editOp.operation_number ?? "?"}` : "➕ Nouvelle opération"}
                </p>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditOp(null); setForm({ ...EMPTY_FORM }); }}
                  className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              <div className="p-4 sm:p-5 space-y-4">

                {/* ─ Section 1 : Identification ─ */}
                <div>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.12em] mb-2">Identification</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className={lbl}>N° opération</label>
                      <input
                        type="number"
                        value={form.operation_number}
                        onChange={e => setForm(f => ({ ...f, operation_number: e.target.value }))}
                        placeholder="5" min="1"
                        className={inp}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={lbl}>Produit *</label>
                      <input
                        value={form.product_name}
                        onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))}
                        placeholder="Mangue, Oignons, Madd…"
                        className={inp}
                      />
                    </div>
                    <div>
                      <label className={lbl}>Date</label>
                      <input
                        type="date"
                        value={form.operation_date}
                        onChange={e => setForm(f => ({ ...f, operation_date: e.target.value }))}
                        className={inp}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={lbl}>Icône produit</label>
                      <div className="flex gap-1.5 flex-wrap">
                        {EMOJIS.map(e => (
                          <button key={e} type="button"
                            onClick={() => setForm(f => ({ ...f, product_emoji: e }))}
                            className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                              form.product_emoji === e ? "bg-gray-900 scale-105 shadow" : "bg-gray-100 hover:bg-gray-200"
                            }`}>
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Lieu d'approvisionnement</label>
                      <input
                        value={form.location}
                        onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                        placeholder="DIOUROU, Thiès…"
                        className={inp}
                      />
                    </div>
                    <div>
                      <label className={lbl}>Quantité</label>
                      <div className="flex">
                        <input
                          type="number" value={form.quantity}
                          onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                          placeholder="300" min="0"
                          className="flex-1 w-0 px-3 py-2.5 rounded-l-xl border border-r-0 border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                        />
                        <select
                          value={form.quantity_unit}
                          onChange={e => setForm(f => ({ ...f, quantity_unit: e.target.value }))}
                          className="px-2 py-2.5 rounded-r-xl border border-gray-200 text-[12px] bg-gray-50 outline-none shrink-0"
                        >
                          {UNITS.map(u => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─ Section 2 : Coûts ─ */}
                <div>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.12em] mb-2">Coûts</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`${lbl} text-red-500`}>💸 Montant achat (FCFA) *</label>
                      <input
                        type="number" value={form.purchase_amount}
                        onChange={e => setForm(f => ({ ...f, purchase_amount: e.target.value }))}
                        placeholder="48 000" min="0"
                        className="w-full px-3 py-2.5 rounded-xl border border-red-200 text-[13px] bg-red-50/30 outline-none focus:ring-2 focus:ring-red-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className={`${lbl} text-amber-600`}>🚛 Transport (FCFA)</label>
                      <input
                        type="number" value={form.transport_amount}
                        onChange={e => setForm(f => ({ ...f, transport_amount: e.target.value }))}
                        placeholder="22 000" min="0"
                        className="w-full px-3 py-2.5 rounded-xl border border-amber-200 text-[13px] bg-amber-50/30 outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* ─ Section 3 : Vente & Encaissement ─ */}
                <div>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.12em] mb-2">Vente & Encaissement</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={`${lbl} text-blue-600`}>💰 Total vente (FCFA)</label>
                      <input
                        type="number" value={form.total_sale}
                        onChange={e => setForm(f => ({ ...f, total_sale: e.target.value }))}
                        placeholder="90 000" min="0"
                        className="w-full px-3 py-2.5 rounded-xl border border-blue-200 text-[13px] bg-blue-50/30 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className={`${lbl} text-emerald-600`}>✅ Déjà encaissé (FCFA)</label>
                      <input
                        type="number" value={form.collected_amount}
                        onChange={e => setForm(f => ({ ...f, collected_amount: e.target.value }))}
                        placeholder="90 000" min="0"
                        className="w-full px-3 py-2.5 rounded-xl border border-emerald-200 text-[13px] bg-emerald-50/30 outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className={`${lbl} text-amber-500`}>⏳ Reste à encaisser</label>
                      <input
                        type="number" value={form.to_collect_amount}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-100 text-gray-400 outline-none cursor-default"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* ─ Section 4 : Résultat ─ */}
                <div>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.12em] mb-2">Résultat</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>
                        <span className="text-emerald-600">📈 Bénéfice net (FCFA)</span>
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, manual_profit: !f.manual_profit }))}
                          className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                            form.manual_profit ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {form.manual_profit ? "Manuel" : "Auto"}
                        </button>
                      </label>
                      <input
                        type="number"
                        value={form.net_profit}
                        onChange={e => setForm(f => ({ ...f, net_profit: e.target.value, manual_profit: true }))}
                        readOnly={!form.manual_profit}
                        className={`w-full px-3 py-2.5 rounded-xl border text-[13px] font-bold outline-none focus:ring-2 transition-all ${
                          form.manual_profit
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700 focus:ring-emerald-100"
                            : "border-gray-200 bg-gray-100 text-gray-400 cursor-default"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={lbl}>📝 Notes / Détails de l'opération</label>
                      <textarea
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        placeholder="9 sacs × 22 000 FCFA, 270 FCFA/kg → 38 800 FCFA…"
                        rows={2}
                        maxLength={600}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-900/10 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* ─ Actions ─ */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-[13px] font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {saving ? "Enregistrement…" : editOp ? "Enregistrer les modifications" : "Ajouter l'opération"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditOp(null); setForm({ ...EMPTY_FORM }); }}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Operations list ── */}
        <div className="space-y-3">
          {operations.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">list_alt</span>
              <p className="text-sm text-gray-400">Aucune opération enregistrée</p>
              <button onClick={() => setShowForm(true)} className="mt-3 text-[12px] font-semibold text-gray-900 underline">
                Ajouter la première opération
              </button>
            </div>
          ) : (
            operations.map(op => (
              <OperationCard
                key={op.id}
                op={op}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deleting={deleting}
              />
            ))
          )}
        </div>

        {/* ── Summary footer ── */}
        {operations.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-4 sm:p-5">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">
              Récapitulatif — {operations.length} opération{operations.length > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {[
                { label: "Total achats + transport", value: `−${fp(totals.totalAchat)}`, color: "text-red-400" },
                { label: "Total ventes",             value: fp(totals.totalVente),        color: "text-white" },
                { label: "Déjà encaissé",            value: fp(totals.encaisse),          color: "text-sky-400" },
                { label: "À encaisser",              value: fp(totals.aEncaisser),        color: "text-amber-400" },
              ].map(k => (
                <div key={k.label}>
                  <p className="text-[11px] text-gray-500 mb-0.5">{k.label}</p>
                  <p className={`font-headline font-black text-lg ${k.color}`}>{k.value}</p>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
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

/* ══════════════════════════════════════════════
   OPERATION CARD
══════════════════════════════════════════════ */
function OperationCard({
  op, onEdit, onDelete, deleting,
}: {
  op: Operation;
  onEdit: (o: Operation) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const totalCost = op.purchase_amount + op.transport_amount;
  const isPartial = op.to_collect_amount > 0;

  return (
    <div className={`bg-white rounded-xl border overflow-hidden transition-shadow hover:shadow-md ${
      isPartial ? "border-amber-200" : "border-gray-200"
    }`}>

      {/* ── Summary row (always visible) ── */}
      <div
        className="p-4 cursor-pointer select-none"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-center gap-3">
          {/* Emoji */}
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">
            {op.product_emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              {op.operation_number != null && (
                <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Opération #{op.operation_number}
                </span>
              )}
              {isPartial ? (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                  ⏳ Encaissement partiel
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                  ✅ Soldé
                </span>
              )}
            </div>
            <p className="font-headline font-black text-[15px] text-gray-900">
              {op.product_emoji} {op.product_name}
            </p>
            <div className="flex items-center gap-3 text-[11.5px] text-gray-400 mt-0.5 flex-wrap">
              {op.location       && <span>📍 {op.location}</span>}
              {op.operation_date && <span>🗓️ {fd(op.operation_date)}</span>}
              {op.quantity       && <span>⚖️ {op.quantity} {op.quantity_unit}</span>}
            </div>
          </div>

          {/* Profit */}
          <div className="text-right shrink-0 mr-1">
            <p className="text-[10.5px] text-gray-400 mb-0.5">Bénéfice net</p>
            <p className={`font-headline font-black text-xl ${op.net_profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {op.net_profit >= 0 ? "+" : ""}
              {op.net_profit.toLocaleString("fr-FR")} F
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
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">

              {/* Financials grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: "Achat",       value: op.purchase_amount,  color: "#ef4444", icon: "shopping_bag" },
                  { label: "Transport",   value: op.transport_amount, color: "#f59e0b", icon: "local_shipping" },
                  { label: "Total vente", value: op.total_sale,       color: "#3b82f6", icon: "payments" },
                  { label: "Coût total",  value: totalCost,           color: "#6b7280", icon: "calculate" },
                ].map(k => (
                  <div key={k.label} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-[13px]" style={{ color: k.color }}>
                        {k.icon}
                      </span>
                      <p className="text-[10.5px] text-gray-400 font-medium">{k.label}</p>
                    </div>
                    <p className="font-headline font-bold text-sm" style={{ color: k.color }}>
                      {k.value.toLocaleString("fr-FR")} F
                    </p>
                  </div>
                ))}
              </div>

              {/* Encaissement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <p className="text-[10.5px] text-emerald-600 font-semibold mb-0.5">✅ Déjà encaissé</p>
                  <p className="font-headline font-black text-base text-emerald-700">
                    {op.collected_amount.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
                {op.to_collect_amount > 0 ? (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <p className="text-[10.5px] text-amber-600 font-semibold mb-0.5">⏳ Reste à encaisser</p>
                    <p className="font-headline font-black text-base text-amber-700">
                      {op.to_collect_amount.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <div>
                      <p className="text-[10.5px] text-gray-400 font-semibold">Paiement complet</p>
                      <p className="text-[11px] text-gray-500">Toute la vente est encaissée</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              {op.notes && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10.5px] text-gray-400 font-semibold mb-1">📝 Détails</p>
                  <p className="text-[12.5px] text-gray-600 whitespace-pre-wrap leading-relaxed">{op.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => onEdit(op)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  Modifier
                </button>
                <button
                  onClick={() => onDelete(op.id)}
                  disabled={deleting === op.id}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-100 text-[12px] font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
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
