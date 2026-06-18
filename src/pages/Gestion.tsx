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

type Op = {
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

/* ── Seed data ── */
const SEED: Op[] = [
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

function loadOps(): Op[] {
  try {
    const raw = localStorage.getItem(OPS_STORE_KEY);
    if (raw) {
      const arr = JSON.parse(raw) as Op[];
      if (Array.isArray(arr) && arr.length > 0)
        return [...arr].sort((a, b) => (a.operation_number ?? 999) - (b.operation_number ?? 999));
    }
  } catch { /* */ }
  localStorage.setItem(OPS_STORE_KEY, JSON.stringify(SEED));
  return SEED;
}

function persistOps(ops: Op[]) {
  localStorage.setItem(OPS_STORE_KEY, JSON.stringify(ops));
}

const fmtF  = (n: number) => n.toLocaleString("fr-FR") + " FCFA";
const fmtFc = (n: number) => n.toLocaleString("fr-FR") + " F";
const fmtD  = (s: string | null) =>
  s ? new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : null;

const EMOJIS = ["🥭","🧅","🍈","🍊","🥬","🌾","🌶️","🥔","🍌","🍋","🥝","🍉","🌿","📦"];
const UNITS  = ["KG","SACS","BASSINES","BALLES","CAISSES","BOÎTES","UNITÉS","TONNES"];

const BLANK = {
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

/* ══════════════════════════════════════════
   PIN SCREEN
══════════════════════════════════════════ */
export default function Gestion() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [code,   setCode]   = useState("");
  const [shake,  setShake]  = useState(false);

  const tryLogin = () => {
    if (code.toUpperCase().trim() === ACCESS_CODE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
    } else {
      setShake(true);
      setCode("");
      setTimeout(() => setShake(false), 600);
    }
  };

  if (!authed) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[360px]"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
          {/* Logo strip */}
          <div className="bg-gray-950 px-8 py-6 flex items-center justify-center border-b border-white/5">
            <img src="/logo-mamakaasa.png" alt="Mamakaasa" className="h-9 object-contain" />
          </div>

          <div className="px-7 pt-6 pb-7">
            <p className="text-[13px] text-gray-400 text-center mb-6">
              Plateforme de gestion interne
            </p>

            <motion.div animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.4 }}>
              <input
                type="password"
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyDown={e => e.key === "Enter" && tryLogin()}
                placeholder="Code d'accès"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-center font-mono text-[15px] tracking-widest text-gray-900 outline-none focus:border-gray-400 focus:bg-white transition-all mb-3"
              />
            </motion.div>

            <button
              onClick={tryLogin}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-[14px] font-semibold hover:bg-gray-800 active:scale-[0.99] transition-all"
            >
              Accéder
            </button>

            <Link to="/" className="block mt-4 text-[12px] text-gray-400 hover:text-gray-600 text-center transition-colors">
              ← Retour
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return <Dashboard />;
}

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */
function Dashboard() {
  const [ops,        setOps]        = useState<Op[]>(() => loadOps());
  const [showForm,   setShowForm]   = useState(false);
  const [editOp,     setEditOp]     = useState<Op | null>(null);
  const [form,       setForm]       = useState({ ...BLANK });
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState<string | null>(null);
  const [synced,     setSynced]     = useState<boolean | null>(null);
  const [capital,    setCapital]    = useState(() => {
    const s = localStorage.getItem(CAPITAL_KEY);
    return s ? parseInt(s) : DEFAULT_CAPITAL;
  });
  const [editCap,  setEditCap]  = useState(false);
  const [tempCap,  setTempCap]  = useState("");

  /* Background Supabase sync */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("operations").select("*")
        .order("operation_number", { ascending: true, nullsFirst: false });

      if (error) { setSynced(false); return; }
      setSynced(true);

      if (data && data.length > 0) {
        const fetched = data as Op[];
        setOps(fetched);
        persistOps(fetched);
      } else {
        const payload = SEED.map(({ id: _i, created_at: _c, ...r }) => r);
        await supabase.from("operations").insert(payload);
        const { data: d2 } = await supabase.from("operations").select("*")
          .order("operation_number", { ascending: true, nullsFirst: false });
        if (d2?.length) { setOps(d2 as Op[]); persistOps(d2 as Op[]); }
      }
    })();
  }, []);

  /* Auto-profit */
  useEffect(() => {
    if (!form.manual_profit) {
      const v = (parseInt(form.total_sale) || 0) - (parseInt(form.purchase_amount) || 0) - (parseInt(form.transport_amount) || 0);
      setForm(f => ({ ...f, net_profit: v.toString() }));
    }
  }, [form.total_sale, form.purchase_amount, form.transport_amount, form.manual_profit]);

  /* Auto to_collect */
  useEffect(() => {
    const v = Math.max(0, (parseInt(form.total_sale) || 0) - (parseInt(form.collected_amount) || 0));
    setForm(f => ({ ...f, to_collect_amount: v.toString() }));
  }, [form.total_sale, form.collected_amount]);

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
      purchase_amount:   parseInt(form.purchase_amount)   || 0,
      transport_amount:  parseInt(form.transport_amount)  || 0,
      total_sale:        parseInt(form.total_sale)        || 0,
      collected_amount:  parseInt(form.collected_amount)  || 0,
      to_collect_amount: parseInt(form.to_collect_amount) || 0,
      net_profit:        parseInt(form.net_profit)        || 0,
      notes:             form.notes.trim() || null,
      status:            (parseInt(form.to_collect_amount) || 0) > 0 ? "partial" : "completed",
    };

    setSaving(true);
    if (editOp) {
      const updated: Op = { ...editOp, ...payload };
      const next = ops.map(o => o.id === editOp.id ? updated : o);
      setOps(next); persistOps(next);
      if (synced) await supabase.from("operations").update({ ...payload, updated_at: now }).eq("id", editOp.id);
      toast.success("Opération modifiée");
    } else {
      const tmpId = crypto.randomUUID();
      const newOp: Op = { id: tmpId, ...payload, created_at: now };
      const next = [...ops, newOp].sort((a, b) => (a.operation_number ?? 999) - (b.operation_number ?? 999));
      setOps(next); persistOps(next);
      if (synced) {
        const { data } = await supabase.from("operations").insert(payload).select().single();
        if (data) {
          const fixed = next.map(o => o.id === tmpId ? (data as Op) : o);
          setOps(fixed); persistOps(fixed);
        }
      }
      toast.success("Opération ajoutée");
    }
    setSaving(false);
    setForm({ ...BLANK });
    setShowForm(false);
    setEditOp(null);
  };

  const handleEdit = (op: Op) => {
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
    if (!confirm("Supprimer cette opération ?")) return;
    setDeleting(id);
    const next = ops.filter(o => o.id !== id);
    setOps(next); persistOps(next);
    if (synced) await supabase.from("operations").delete().eq("id", id);
    toast.success("Supprimée");
    setDeleting(null);
  };

  const totals = useMemo(() => ({
    benefice:   ops.reduce((s, o) => s + o.net_profit,           0),
    aEncaisser: ops.reduce((s, o) => s + o.to_collect_amount,    0),
    couts:      ops.reduce((s, o) => s + o.purchase_amount + o.transport_amount, 0),
    ventes:     ops.reduce((s, o) => s + o.total_sale,           0),
    encaisse:   ops.reduce((s, o) => s + o.collected_amount,     0),
  }), [ops]);

  const saveCap = (v: number) => {
    setCapital(v); localStorage.setItem(CAPITAL_KEY, v.toString()); setEditCap(false);
  };

  /* Shared input/label class */
  const inp = "w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 placeholder:text-gray-300 transition-colors";
  const lbl = "block text-[11px] font-semibold text-gray-400 uppercase tracking-[0.07em] mb-1.5";

  /* Live preview values */
  const previewCost    = (parseInt(form.purchase_amount) || 0) + (parseInt(form.transport_amount) || 0);
  const previewProfit  = (parseInt(form.total_sale) || 0) - previewCost;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <img src="/logo-mamakaasa.png" alt="Mamakaasa" className="h-7 object-contain shrink-0" />

          <div className="w-px h-4 bg-gray-200 mx-1" />

          <span className="text-[12px] font-medium text-gray-400 hidden sm:block tracking-wide">
            Gestion des opérations
          </span>

          {synced === true  && <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Synchronisé</span>}
          {synced === false && <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Hors ligne</span>}

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => { setEditOp(null); setForm({ ...BLANK }); setShowForm(v => !v); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-[12.5px] font-medium hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[13px]">{showForm && !editOp ? "close" : "add"}</span>
              <span className="hidden sm:inline">{showForm && !editOp ? "Annuler" : "Nouvelle opération"}</span>
            </button>
            <Link to="/"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">home</span>
            </Link>
            <button
              onClick={() => { sessionStorage.removeItem(SESSION_KEY); window.location.reload(); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">

        {/* ── Metric cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard
            label="Bénéfice net"
            value={fmtF(totals.benefice)}
            sub={`${ops.length} opération${ops.length !== 1 ? "s" : ""}`}
            accent="green"
          />
          <MetricCard
            label="Capital actuel"
            value={fmtF(capital + totals.benefice)}
            sub={`départ : ${fmtF(capital)}`}
          />
          <MetricCard
            label="À encaisser"
            value={fmtF(totals.aEncaisser)}
            sub="montant restant dû"
            accent={totals.aEncaisser > 0 ? "amber" : undefined}
          />
          <MetricCard
            label="Total ventes"
            value={fmtF(totals.ventes)}
            sub={`encaissé : ${fmtF(totals.encaisse)}`}
          />
        </div>

        {/* ── Dark summary strip ── */}
        <div className="bg-gray-950 rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-4">
          {/* Capital editable */}
          <div>
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-1">Capital de départ</p>
            {editCap ? (
              <div className="flex items-center gap-2">
                <input
                  type="number" value={tempCap} autoFocus
                  onChange={e => setTempCap(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveCap(parseInt(tempCap) || DEFAULT_CAPITAL)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm font-semibold outline-none w-36"
                />
                <button onClick={() => saveCap(parseInt(tempCap) || DEFAULT_CAPITAL)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[12px] font-semibold">OK</button>
                <button onClick={() => setEditCap(false)} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">✕</button>
              </div>
            ) : (
              <button onClick={() => { setTempCap(capital.toString()); setEditCap(true); }}
                className="flex items-center gap-2 group">
                <span className="font-headline font-black text-xl text-white">{fmtF(capital)}</span>
                <span className="material-symbols-outlined text-[13px] text-gray-600 group-hover:text-gray-400 transition-colors">edit</span>
              </button>
            )}
          </div>

          {/* Breakdown */}
          <div className="flex gap-6 sm:gap-8">
            <div className="text-right">
              <p className="text-[10px] text-gray-600 mb-0.5">Coûts totaux</p>
              <p className="font-semibold text-[15px] text-gray-300">−{fmtF(totals.couts)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-600 mb-0.5">Encaissé</p>
              <p className="font-semibold text-[15px] text-gray-300">{fmtF(totals.encaisse)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-600 mb-0.5">Bénéfice net</p>
              <p className="font-headline font-black text-xl text-emerald-400">{fmtF(totals.benefice)}</p>
            </div>
          </div>
        </div>

        {/* ── Form ── */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-xl border border-gray-200"
            >
              {/* Form header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <p className="text-[13px] font-semibold text-gray-900">
                  {editOp ? `Modifier l'opération #${editOp.operation_number ?? "?"}` : "Nouvelle opération"}
                </p>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditOp(null); setForm({ ...BLANK }); }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              <div className="p-5 space-y-5">

                {/* Section 1 — Identification */}
                <div>
                  <p className={lbl}>Identification</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">N° opération</label>
                      <input type="number" value={form.operation_number} min="1" placeholder="5"
                        onChange={e => setForm(f => ({ ...f, operation_number: e.target.value }))}
                        className={inp} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-gray-400 mb-1">Produit *</label>
                      <input value={form.product_name} placeholder="Mangue, Oignons, Madd…"
                        onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))}
                        className={inp} />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Date</label>
                      <input type="date" value={form.operation_date}
                        onChange={e => setForm(f => ({ ...f, operation_date: e.target.value }))}
                        className={inp} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    {/* Emoji picker */}
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Icône</label>
                      <div className="flex gap-1.5 flex-wrap">
                        {EMOJIS.map(e => (
                          <button key={e} type="button"
                            onClick={() => setForm(f => ({ ...f, product_emoji: e }))}
                            className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${
                              form.product_emoji === e
                                ? "bg-gray-900 shadow-sm"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                          >{e}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Lieu</label>
                      <input value={form.location} placeholder="DIOUROU, Thiès…"
                        onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                        className={inp} />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Quantité</label>
                      <div className="flex">
                        <input type="number" value={form.quantity} placeholder="300" min="0"
                          onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                          className="flex-1 w-0 px-3 py-2.5 rounded-l-lg border border-r-0 border-gray-200 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 placeholder:text-gray-300 transition-colors" />
                        <select value={form.quantity_unit}
                          onChange={e => setForm(f => ({ ...f, quantity_unit: e.target.value }))}
                          className="px-2 py-2.5 rounded-r-lg border border-gray-200 bg-white text-[12px] text-gray-600 outline-none shrink-0 focus:border-gray-400 transition-colors">
                          {UNITS.map(u => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2 — Coûts */}
                <div>
                  <p className={lbl}>Coûts</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Montant achat (FCFA) *</label>
                      <input type="number" value={form.purchase_amount} placeholder="48 000" min="0"
                        onChange={e => setForm(f => ({ ...f, purchase_amount: e.target.value }))}
                        className={inp} />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Transport (FCFA)</label>
                      <input type="number" value={form.transport_amount} placeholder="22 000" min="0"
                        onChange={e => setForm(f => ({ ...f, transport_amount: e.target.value }))}
                        className={inp} />
                    </div>
                  </div>
                </div>

                {/* Section 3 — Vente */}
                <div>
                  <p className={lbl}>Vente & Encaissement</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Total vente (FCFA)</label>
                      <input type="number" value={form.total_sale} placeholder="90 000" min="0"
                        onChange={e => setForm(f => ({ ...f, total_sale: e.target.value }))}
                        className={inp} />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Déjà encaissé (FCFA)</label>
                      <input type="number" value={form.collected_amount} placeholder="90 000" min="0"
                        onChange={e => setForm(f => ({ ...f, collected_amount: e.target.value }))}
                        className={inp} />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Reste à encaisser</label>
                      <input type="number" value={form.to_collect_amount} readOnly
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-100 bg-gray-50 text-[13px] text-gray-400 outline-none cursor-default" />
                    </div>
                  </div>
                </div>

                {/* Live profit preview */}
                {(parseInt(form.purchase_amount) > 0 || parseInt(form.total_sale) > 0) && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-4 text-[12px] text-gray-400 flex-wrap">
                      <span>Vente <strong className="text-gray-700">{fmtFc(parseInt(form.total_sale) || 0)}</strong></span>
                      <span className="text-gray-300">−</span>
                      <span>Coûts <strong className="text-gray-700">{fmtFc(previewCost)}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!form.manual_profit && (
                        <span className="text-[11px] text-gray-400">Bénéfice estimé</span>
                      )}
                      {form.manual_profit ? (
                        <div className="flex items-center gap-2">
                          <input type="number" value={form.net_profit}
                            onChange={e => setForm(f => ({ ...f, net_profit: e.target.value }))}
                            className="w-32 px-2 py-1 rounded-md border border-gray-200 bg-white text-[13px] font-semibold text-gray-900 outline-none focus:border-gray-400" />
                          <button type="button" onClick={() => setForm(f => ({ ...f, manual_profit: false }))}
                            className="text-[10px] text-gray-400 hover:text-gray-600 underline whitespace-nowrap">
                            Auto
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`font-headline font-black text-[16px] ${previewProfit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {previewProfit >= 0 ? "+" : ""}{fmtFc(previewProfit)}
                          </span>
                          <button type="button" onClick={() => setForm(f => ({ ...f, manual_profit: true }))}
                            className="text-[10px] text-gray-400 hover:text-gray-600 underline whitespace-nowrap">
                            Modifier
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Notes / Détails</label>
                  <textarea value={form.notes} rows={2} maxLength={600}
                    placeholder="9 sacs × 22 000 FCFA, 270 FCFA/kg → 38 800 FCFA…"
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 placeholder:text-gray-300 transition-colors resize-none" />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={handleSave} disabled={saving}
                    className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50">
                    {saving ? "Enregistrement…" : editOp ? "Enregistrer" : "Ajouter l'opération"}
                  </button>
                  <button type="button"
                    onClick={() => { setShowForm(false); setEditOp(null); setForm({ ...BLANK }); }}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Operations list ── */}
        <div>
          {/* List header */}
          {ops.length > 0 && (
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {ops.length} opération{ops.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          <div className="space-y-2">
            {ops.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-gray-200 block mb-3">inventory_2</span>
                <p className="text-[13px] text-gray-400 mb-3">Aucune opération enregistrée</p>
                <button onClick={() => setShowForm(true)}
                  className="text-[12px] font-semibold text-gray-900 underline underline-offset-2">
                  Créer la première
                </button>
              </div>
            ) : (
              ops.map(op => (
                <OpCard
                  key={op.id}
                  op={op}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  deleting={deleting}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Footer totals ── */}
        {ops.length > 0 && (
          <div className="bg-gray-950 rounded-xl px-5 py-4">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
              Récapitulatif global
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {[
                { label: "Achats + Transport", value: `−${fmtF(totals.couts)}`,   c: "text-gray-300" },
                { label: "Total ventes",        value: fmtF(totals.ventes),        c: "text-gray-300" },
                { label: "Encaissé",            value: fmtF(totals.encaisse),      c: "text-gray-300" },
                { label: "À encaisser",         value: fmtF(totals.aEncaisser),    c: totals.aEncaisser > 0 ? "text-amber-400" : "text-gray-500" },
              ].map(k => (
                <div key={k.label}>
                  <p className="text-[10px] text-gray-600 mb-0.5">{k.label}</p>
                  <p className={`font-semibold text-[14px] ${k.c}`}>{k.value}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-4 flex items-end justify-between flex-wrap gap-3">
              <div>
                <p className="text-[10px] text-gray-600 mb-0.5">Capital de départ</p>
                <p className="font-semibold text-[15px] text-gray-400">{fmtF(capital)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-600 mb-0.5">Bénéfice total net</p>
                <p className="font-headline font-black text-3xl text-emerald-400">{fmtF(totals.benefice)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Metric card ── */
function MetricCard({
  label, value, sub, accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "green" | "amber";
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.07em] mb-2 leading-tight">
        {label}
      </p>
      <p className={`font-headline font-black text-[17px] leading-tight ${
        accent === "green" ? "text-emerald-600" :
        accent === "amber" ? "text-amber-600"   :
        "text-gray-900"
      }`}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

/* ── Operation card ── */
function OpCard({
  op, onEdit, onDelete, deleting,
}: {
  op: Op;
  onEdit: (o: Op) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
}) {
  const [open, setOpen] = useState(false);
  const isPartial = op.to_collect_amount > 0;
  const cost = op.purchase_amount + op.transport_amount;
  const date = fmtD(op.operation_date);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

      {/* Row */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors select-none"
        onClick={() => setOpen(v => !v)}
      >
        {/* Emoji */}
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0">
          {op.product_emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {op.operation_number != null && (
              <span className="text-[10px] font-bold text-gray-400">#{op.operation_number}</span>
            )}
            <span className="text-[13px] font-semibold text-gray-900">{op.product_name}</span>
            {op.location && (
              <span className="text-[11px] text-gray-400 hidden sm:inline">· {op.location}</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {date && <span className="text-[11px] text-gray-400">{date}</span>}
            {op.quantity && <span className="text-[11px] text-gray-400">{op.quantity} {op.quantity_unit}</span>}
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
              isPartial
                ? "bg-amber-50 text-amber-700"
                : "bg-gray-100 text-gray-500"
            }`}>
              {isPartial ? "Partiel" : "Soldé"}
            </span>
          </div>
        </div>

        {/* Profit */}
        <div className="text-right shrink-0">
          <p className={`font-headline font-black text-[17px] leading-tight ${
            op.net_profit >= 0 ? "text-emerald-600" : "text-red-500"
          }`}>
            {op.net_profit >= 0 ? "+" : ""}
            {op.net_profit.toLocaleString("fr-FR")} F
          </p>
        </div>

        <span className={`material-symbols-outlined text-gray-300 text-[18px] transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </div>

      {/* Expanded */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-4 py-4 space-y-3">

              {/* Financial grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Achat",        value: op.purchase_amount  },
                  { label: "Transport",    value: op.transport_amount },
                  { label: "Total vente",  value: op.total_sale       },
                  { label: "Coût total",   value: cost                },
                ].map(k => (
                  <div key={k.label} className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <p className="text-[10px] text-gray-400 mb-0.5">{k.label}</p>
                    <p className="text-[13px] font-semibold text-gray-700">
                      {k.value.toLocaleString("fr-FR")} F
                    </p>
                  </div>
                ))}
              </div>

              {/* Encaissement row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-emerald-50 rounded-lg px-3 py-2.5 flex items-center gap-2">
                  <span className="text-emerald-500 text-[13px]">✓</span>
                  <div>
                    <p className="text-[10px] text-emerald-600 font-medium">Encaissé</p>
                    <p className="text-[13px] font-semibold text-emerald-700">
                      {op.collected_amount.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                </div>
                {isPartial ? (
                  <div className="bg-amber-50 rounded-lg px-3 py-2.5 flex items-center gap-2">
                    <span className="text-amber-500 text-[13px]">○</span>
                    <div>
                      <p className="text-[10px] text-amber-600 font-medium">Reste à encaisser</p>
                      <p className="text-[13px] font-semibold text-amber-700">
                        {op.to_collect_amount.toLocaleString("fr-FR")} FCFA
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5 flex items-center gap-2">
                    <span className="text-gray-400 text-[13px]">✓</span>
                    <p className="text-[12px] text-gray-400">Paiement complet</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {op.notes && (
                <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] text-gray-400 mb-1">Détails</p>
                  <p className="text-[12px] text-gray-600 leading-relaxed whitespace-pre-wrap">{op.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-1">
                <button onClick={() => onEdit(op)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[13px]">edit</span>
                  Modifier
                </button>
                <button onClick={() => onDelete(op.id)} disabled={deleting === op.id}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-100 text-[12px] font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40">
                  <span className="material-symbols-outlined text-[13px]">delete</span>
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
