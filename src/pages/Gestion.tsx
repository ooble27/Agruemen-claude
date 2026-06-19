import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const ACCESS_CODE     = "MAMAKAASA2026";
const SESSION_KEY     = "mgmt_auth_v1";
const CAPITAL_KEY     = "mgmt_capital_v1";
const OPS_KEY         = "mgmt_ops_v1";
const DEFAULT_CAPITAL = 900_000;

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type View = "dashboard" | "operations" | "finances";

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

/* ─────────────────────────────────────────
   Seed data
───────────────────────────────────────── */
const SEED: Op[] = [
  { id: "op-001", operation_number: 1, product_name: "Mangue", product_emoji: "🥭", location: "DIOUROU (Tabaski)", operation_date: null, quantity: 300, quantity_unit: "KG", purchase_amount: 48000, transport_amount: 22000, total_sale: 90000, collected_amount: 90000, to_collect_amount: 0, net_profit: 30000, status: "completed", notes: "12 bassines × 4 000 FCFA = 48 000 FCFA achat • 300 FCFA/KG × 300 KG = 90 000 FCFA vente", created_at: "2026-06-01T00:00:00Z" },
  { id: "op-002", operation_number: 2, product_name: "Mangue", product_emoji: "🥭", location: "DIOUROU", operation_date: null, quantity: 315, quantity_unit: "KG", purchase_amount: 22000, transport_amount: 18000, total_sale: 55900, collected_amount: 30000, to_collect_amount: 25900, net_profit: 15900, status: "partial", notes: "9 sacs de mangue = 22 000 FCFA achat • Vente : 270 FCFA/KG → 38 800 FCFA + 100 FCFA/KG → 17 100 FCFA", created_at: "2026-06-05T00:00:00Z" },
  { id: "op-003", operation_number: 3, product_name: "Oignons verts", product_emoji: "🧅", location: null, operation_date: null, quantity: null, quantity_unit: "KG", purchase_amount: 75000, transport_amount: 40000, total_sale: 130000, collected_amount: 91500, to_collect_amount: 38500, net_profit: 15000, status: "partial", notes: "10 balles = 75 000 FCFA achat • Transport : 16 000 + 21 000 + 3 000 = 40 000 FCFA • Encaissé : 91 500 FCFA • Reste : 16 500 + 10 000 + 12 000 = 38 500 FCFA", created_at: "2026-06-10T00:00:00Z" },
  { id: "op-004", operation_number: 4, product_name: "Madd", product_emoji: "🍈", location: null, operation_date: "2026-06-14", quantity: null, quantity_unit: "KG", purchase_amount: 32000, transport_amount: 0, total_sale: 56000, collected_amount: 56000, to_collect_amount: 0, net_profit: 24000, status: "completed", notes: "4 sacs × 8 000 FCFA = 32 000 FCFA achat • 4 sacs × 14 000 FCFA = 56 000 FCFA vente", created_at: "2026-06-14T00:00:00Z" },
];

/* ─────────────────────────────────────────
   Storage helpers
───────────────────────────────────────── */
function loadOps(): Op[] {
  try {
    const raw = localStorage.getItem(OPS_KEY);
    if (raw) {
      const arr = JSON.parse(raw) as Op[];
      if (Array.isArray(arr) && arr.length > 0)
        return [...arr].sort((a, b) => (a.operation_number ?? 999) - (b.operation_number ?? 999));
    }
  } catch { /* */ }
  localStorage.setItem(OPS_KEY, JSON.stringify(SEED));
  return SEED;
}

function persistOps(ops: Op[]) {
  localStorage.setItem(OPS_KEY, JSON.stringify(ops));
}

/* ─────────────────────────────────────────
   Formatters
───────────────────────────────────────── */
const fF = (n: number) => n.toLocaleString("fr-FR") + " FCFA";
const fD = (s: string | null) =>
  s ? new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : null;
const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const EMOJIS = ["🥭","🧅","🍈","🍊","🥬","🌾","🌶️","🥔","🍌","🍋","🥝","🍉","🌿","📦"];
const UNITS  = ["KG","SACS","BASSINES","BALLES","CAISSES","BOÎTES","UNITÉS","TONNES"];

const BLANK = {
  operation_number: "", product_name: "", product_emoji: "📦",
  location: "", operation_date: new Date().toISOString().slice(0, 10),
  quantity: "", quantity_unit: "KG",
  purchase_amount: "", transport_amount: "0",
  total_sale: "", collected_amount: "",
  to_collect_amount: "0", net_profit: "",
  notes: "", manual_profit: false as boolean,
};

/* ═══════════════════════════════════════════
   PIN SCREEN
═══════════════════════════════════════════ */
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
      setTimeout(() => setShake(false), 500);
    }
  };

  if (!authed) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="w-full max-w-[340px]"
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          <div className="bg-gray-950 flex items-center justify-center py-7 border-b border-white/5">
            <img src="/logo-mamakaasa.png" alt="Mamakaasa" className="h-9 object-contain" />
          </div>
          <div className="px-7 py-7">
            <p className="text-[12px] text-gray-400 text-center mb-5">Espace de gestion interne</p>
            <motion.input
              animate={shake ? { x: [0, -10, 10, -7, 7, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
              type="password"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && tryLogin()}
              placeholder="Code d'accès"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-center font-mono text-[15px] tracking-[0.25em] text-gray-900 outline-none focus:border-gray-400 focus:bg-white transition-all mb-3"
            />
            <button
              onClick={tryLogin}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-800 transition-colors"
            >
              Accéder
            </button>
            <Link to="/" className="block mt-4 text-[11px] text-gray-400 hover:text-gray-500 text-center transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return <GestionApp />;
}

/* ═══════════════════════════════════════════
   MAIN APP SHELL
═══════════════════════════════════════════ */
function GestionApp() {
  const [view,     setView]     = useState<View>("dashboard");
  const [ops,      setOps]      = useState<Op[]>(() => loadOps());
  const [synced,   setSynced]   = useState<boolean | null>(null);
  const [capital,  setCapital]  = useState(() => {
    const s = localStorage.getItem(CAPITAL_KEY);
    return s ? parseInt(s) : DEFAULT_CAPITAL;
  });

  /* Background Supabase sync — localStorage is always source of truth */
  useEffect(() => {
    (async () => {
      const { error } = await supabase.from("operations").select("id").limit(1);
      if (error) { setSynced(false); return; }
      setSynced(true);
      /* If table is empty, seed it with local data so Supabase stays in sync */
      const { data: existing } = await supabase.from("operations").select("id");
      if (!existing || existing.length === 0) {
        const localOps = loadOps();
        const payload = localOps.map(({ id: _i, created_at: _c, ...r }) => r);
        await supabase.from("operations").insert(payload);
      }
      /* Never overwrite local ops with Supabase — local is always fresh */
    })();
  }, []);

  const saveCapital = (v: number) => {
    setCapital(v);
    localStorage.setItem(CAPITAL_KEY, v.toString());
  };

  const totals = useMemo(() => {
    const beneficeTotal   = ops.reduce((s, o) => s + o.net_profit, 0);
    const aEncaisser      = ops.reduce((s, o) => s + o.to_collect_amount, 0);
    const encaisse        = ops.reduce((s, o) => s + o.collected_amount, 0);
    const ventes          = ops.reduce((s, o) => s + o.total_sale, 0);
    const couts           = ops.reduce((s, o) => s + o.purchase_amount + o.transport_amount, 0);
    /* Bénéfice au prorata de ce qui est réellement encaissé
       Quand collected_amount = total_sale → bénéfice plein comptabilisé */
    const beneficeEncaisse = ops.reduce((s, o) => {
      if (o.total_sale === 0) return s + o.net_profit;
      return s + Math.round((o.collected_amount / o.total_sale) * o.net_profit);
    }, 0);
    return { beneficeTotal, beneficeEncaisse, aEncaisser, encaisse, ventes, couts };
  }, [ops]);

  /* Functional updates — évite les bugs de fermeture (stale closure) */
  const addOp = (op: Op) => {
    setOps(prev => {
      const next = [...prev, op].sort((a,b)=>(a.operation_number??999)-(b.operation_number??999));
      persistOps(next);
      return next;
    });
  };
  const updateOp = (op: Op) => {
    setOps(prev => {
      const next = prev.map(o => o.id === op.id ? op : o);
      persistOps(next);
      return next;
    });
  };
  const deleteOp = async (id: string) => {
    setOps(prev => {
      const next = prev.filter(o => o.id !== id);
      persistOps(next);
      return next;
    });
    if (synced) await supabase.from("operations").delete().eq("id", id);
  };

  const NAV: { id: View; icon: string; label: string }[] = [
    { id: "dashboard",  icon: "home",      label: "Tableau de bord" },
    { id: "operations", icon: "list_alt",  label: "Opérations"      },
    { id: "finances",   icon: "bar_chart", label: "Finances"         },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      {/* ── Top header (always visible) ── */}
      <header className="shrink-0 bg-white border-b border-gray-200 h-12 flex items-center px-4 gap-3 z-30">
        <img src="/logo-mamakaasa.png" alt="Mamakaasa" className="h-6 object-contain shrink-0" />
        <div className="w-px h-4 bg-gray-200" />
        <span className="text-[12px] text-gray-400 hidden sm:block">
          {NAV.find(n => n.id === view)?.label}
        </span>
        {synced === true  && <span className="ml-1 text-[10px] font-medium text-gray-400 hidden sm:block">· Synchronisé</span>}
        {synced === false && <span className="ml-1 text-[10px] font-medium text-gray-400 hidden sm:block">· Mode local</span>}
        <div className="ml-auto flex items-center gap-1">
          <Link to="/" className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-[17px]">home</span>
          </Link>
          <button
            onClick={() => { sessionStorage.removeItem(SESSION_KEY); window.location.reload(); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">logout</span>
          </button>
        </div>
      </header>

      {/* ── Body (sidebar + content) ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar — desktop only */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 bg-gray-950 border-r border-white/5">
          <nav className="flex-1 px-2 pt-4 space-y-0.5">
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => setView(n.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-[12.5px] font-medium transition-colors ${
                  view === n.id
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: view === n.id ? "'FILL' 1" : "'FILL' 0" }}>
                  {n.icon}
                </span>
                {n.label}
              </button>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-white/5">
            <p className="text-[10px] text-gray-700 truncate">Mamakaasa · Gestion interne</p>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Mobile tabs */}
          <div className="md:hidden shrink-0 bg-white border-b border-gray-200 flex">
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => setView(n.id)}
                className={`flex-1 py-2.5 text-[11px] font-semibold flex flex-col items-center gap-0.5 transition-colors ${
                  view === n.id ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-400"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: view === n.id ? "'FILL' 1" : "'FILL' 0" }}>
                  {n.icon}
                </span>
                {n.label}
              </button>
            ))}
          </div>

          {/* Scrollable page content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {view === "dashboard" && (
                  <DashboardView
                    ops={ops}
                    totals={totals}
                    capital={capital}
                    onGoToOps={() => setView("operations")}
                  />
                )}
                {view === "operations" && (
                  <OperationsView
                    ops={ops}
                    synced={synced}
                    onAdd={addOp}
                    onUpdate={updateOp}
                    onDelete={deleteOp}
                  />
                )}
                {view === "finances" && (
                  <FinancesView
                    ops={ops}
                    totals={totals}
                    capital={capital}
                    onSaveCapital={saveCapital}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION 1 — TABLEAU DE BORD
═══════════════════════════════════════════ */
function DashboardView({ ops, totals, capital, onGoToOps }: {
  ops: Op[];
  totals: { benefice: number; aEncaisser: number; couts: number; ventes: number; encaisse: number };
  capital: number;
  onGoToOps: () => void;
}) {
  const recent = ops.slice(-3).reverse();

  return (
    <div className="p-5 md:p-7 max-w-3xl space-y-6">

      {/* Greeting */}
      <div>
        <h1 className="text-[20px] font-headline font-black text-gray-900">Tableau de bord</h1>
        <p className="text-[12px] text-gray-400 mt-0.5 capitalize">{today}</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Bénéfice encaissé"
          value={fF(totals.beneficeEncaisse)}
          sub="sur montants reçus"
          green
        />
        <MetricCard
          label="Capital disponible"
          value={fF(capital + totals.beneficeEncaisse)}
          sub={`départ : ${fF(capital)}`}
        />
        <MetricCard
          label="À encaisser"
          value={fF(totals.aEncaisser)}
          sub={totals.aEncaisser > 0 ? "montants en attente" : "tout encaissé ✓"}
          amber={totals.aEncaisser > 0}
        />
        <MetricCard
          label="Bénéfice total projeté"
          value={fF(totals.beneficeTotal)}
          sub={`${ops.length} opération${ops.length !== 1 ? "s" : ""}`}
        />
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-semibold text-gray-900">Activité récente</h2>
          <button onClick={onGoToOps} className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors">
            Voir tout →
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {recent.length === 0 ? (
            <div className="px-4 py-8 text-center text-[12px] text-gray-400">
              Aucune opération
            </div>
          ) : (
            recent.map(op => (
              <div key={op.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-xl shrink-0">{op.product_emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900">
                    {op.operation_number ? `#${op.operation_number} · ` : ""}{op.product_name}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {op.location ?? "—"}{fD(op.operation_date) ? ` · ${fD(op.operation_date)}` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-[14px] font-bold ${op.net_profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {op.net_profit >= 0 ? "+" : ""}{op.net_profit.toLocaleString("fr-FR")} F
                  </p>
                  <p className={`text-[10px] ${op.to_collect_amount > 0 ? "text-amber-600" : "text-gray-400"}`}>
                    {op.to_collect_amount > 0 ? "Partiel" : "Soldé"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Summary strip */}
      <div className="bg-gray-950 rounded-xl p-5">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">Résumé financier</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Coûts totaux",         value: fF(totals.couts),           dim: true },
            { label: "Total ventes",          value: fF(totals.ventes),          dim: false },
            { label: "Bénéfice encaissé",     value: fF(totals.beneficeEncaisse), green: true },
            { label: "Bénéfice total projeté",value: fF(totals.beneficeTotal),   dim: false },
          ].map(k => (
            <div key={k.label}>
              <p className="text-[10px] text-gray-600 mb-0.5">{k.label}</p>
              <p className={`text-[15px] font-bold ${k.green ? "text-emerald-400" : k.dim ? "text-gray-500" : "text-gray-200"}`}>
                {k.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick action */}
      <button
        onClick={onGoToOps}
        className="w-full py-3 rounded-xl border border-gray-200 bg-white text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Gérer les opérations →
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION 2 — OPÉRATIONS
═══════════════════════════════════════════ */
function OperationsView({ ops, synced, onAdd, onUpdate, onDelete }: {
  ops: Op[];
  synced: boolean | null;
  onAdd: (op: Op) => void;
  onUpdate: (op: Op) => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editOp,   setEditOp]   = useState<Op | null>(null);
  const [form,     setForm]     = useState({ ...BLANK });
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  /* Auto-profit */
  useEffect(() => {
    if (!form.manual_profit) {
      const v = (parseInt(form.total_sale)||0) - (parseInt(form.purchase_amount)||0) - (parseInt(form.transport_amount)||0);
      setForm(f => ({ ...f, net_profit: v.toString() }));
    }
  }, [form.total_sale, form.purchase_amount, form.transport_amount, form.manual_profit]);

  /* Auto to_collect */
  useEffect(() => {
    const v = Math.max(0, (parseInt(form.total_sale)||0) - (parseInt(form.collected_amount)||0));
    setForm(f => ({ ...f, to_collect_amount: v.toString() }));
  }, [form.total_sale, form.collected_amount]);

  const openNew = () => { setEditOp(null); setForm({ ...BLANK }); setShowForm(true); };
  const openEdit = (op: Op) => {
    setForm({
      operation_number: op.operation_number?.toString() ?? "",
      product_name: op.product_name, product_emoji: op.product_emoji,
      location: op.location ?? "", operation_date: op.operation_date ?? new Date().toISOString().slice(0,10),
      quantity: op.quantity?.toString() ?? "", quantity_unit: op.quantity_unit,
      purchase_amount: op.purchase_amount.toString(), transport_amount: op.transport_amount.toString(),
      total_sale: op.total_sale.toString(), collected_amount: op.collected_amount.toString(),
      to_collect_amount: op.to_collect_amount.toString(), net_profit: op.net_profit.toString(),
      notes: op.notes ?? "", manual_profit: true,
    });
    setEditOp(op);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const cancel = () => { setShowForm(false); setEditOp(null); setForm({ ...BLANK }); };

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
      status:            (parseInt(form.to_collect_amount)||0) > 0 ? "partial" : "completed",
    };

    setSaving(true);
    if (editOp) {
      const updated: Op = { ...editOp, ...payload };
      onUpdate(updated);
      if (synced) await supabase.from("operations").update({ ...payload, updated_at: now }).eq("id", editOp.id);
      toast.success("Opération modifiée");
    } else {
      const tmpId = crypto.randomUUID();
      const newOp: Op = { id: tmpId, ...payload, created_at: now };
      onAdd(newOp);
      if (synced) {
        const { data } = await supabase.from("operations").insert(payload).select().single();
        if (data) onUpdate({ ...(data as Op) });
      }
      toast.success("Opération ajoutée");
    }
    setSaving(false);
    cancel();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette opération ?")) return;
    setDeleting(id);
    await onDelete(id);
    toast.success("Supprimée");
    setDeleting(null);
  };

  const inp = "w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 placeholder:text-gray-300 transition-colors";
  const lbl = "block text-[11px] font-semibold text-gray-400 uppercase tracking-[0.06em] mb-1.5";

  return (
    <div className="p-5 md:p-7 max-w-3xl space-y-4">

      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-headline font-black text-gray-900">Opérations</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">{ops.length} opération{ops.length !== 1 ? "s" : ""} enregistrée{ops.length !== 1 ? "s" : ""}</p>
        </div>
        {!showForm && (
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-[12.5px] font-semibold hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            <span className="hidden sm:inline">Nouvelle</span>
          </button>
        )}
      </div>

      {/* ── Form ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-xl border border-gray-200"
          >
            {/* Form title bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <p className="text-[14px] font-semibold text-gray-900">
                {editOp ? `Modifier · Opération #${editOp.operation_number ?? "?"}` : "Nouvelle opération"}
              </p>
              <button onClick={cancel} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-5">

              {/* Identification */}
              <div>
                <p className={lbl}>Identification</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">N° opération</label>
                    <input type="number" value={form.operation_number} placeholder="5" min="1"
                      onChange={e => setForm(f=>({...f,operation_number:e.target.value}))} className={inp} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-gray-400 mb-1">Produit *</label>
                    <input value={form.product_name} placeholder="Mangue, Oignons, Madd…"
                      onChange={e => setForm(f=>({...f,product_name:e.target.value}))} className={inp} />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Date</label>
                    <input type="date" value={form.operation_date}
                      onChange={e => setForm(f=>({...f,operation_date:e.target.value}))} className={inp} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Icône</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {EMOJIS.map(e => (
                        <button key={e} type="button" onClick={() => setForm(f=>({...f,product_emoji:e}))}
                          className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${form.product_emoji===e?"bg-gray-900":"bg-gray-100 hover:bg-gray-200"}`}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Lieu</label>
                    <input value={form.location} placeholder="DIOUROU, Thiès…"
                      onChange={e => setForm(f=>({...f,location:e.target.value}))} className={inp} />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Quantité</label>
                    <div className="flex">
                      <input type="number" value={form.quantity} placeholder="300" min="0"
                        onChange={e => setForm(f=>({...f,quantity:e.target.value}))}
                        className="flex-1 w-0 px-3 py-2.5 rounded-l-lg border border-r-0 border-gray-200 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 placeholder:text-gray-300 transition-colors" />
                      <select value={form.quantity_unit} onChange={e => setForm(f=>({...f,quantity_unit:e.target.value}))}
                        className="px-2 py-2.5 rounded-r-lg border border-gray-200 bg-white text-[12px] text-gray-600 outline-none focus:border-gray-400 transition-colors shrink-0">
                        {UNITS.map(u=><option key={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coûts */}
              <div>
                <p className={lbl}>Coûts</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Montant achat (FCFA) *</label>
                    <input type="number" value={form.purchase_amount} placeholder="48 000" min="0"
                      onChange={e => setForm(f=>({...f,purchase_amount:e.target.value}))} className={inp} />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Transport (FCFA)</label>
                    <input type="number" value={form.transport_amount} placeholder="22 000" min="0"
                      onChange={e => setForm(f=>({...f,transport_amount:e.target.value}))} className={inp} />
                  </div>
                </div>
              </div>

              {/* Vente */}
              <div>
                <p className={lbl}>Vente & Encaissement</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Total vente (FCFA)</label>
                    <input type="number" value={form.total_sale} placeholder="90 000" min="0"
                      onChange={e => setForm(f=>({...f,total_sale:e.target.value}))} className={inp} />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Encaissé (FCFA)</label>
                    <input type="number" value={form.collected_amount} placeholder="90 000" min="0"
                      onChange={e => setForm(f=>({...f,collected_amount:e.target.value}))} className={inp} />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Reste à encaisser</label>
                    <input type="number" value={form.to_collect_amount} readOnly
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-100 bg-gray-50 text-[13px] text-gray-400 outline-none cursor-default" />
                  </div>
                </div>
              </div>

              {/* Profit preview */}
              {(parseInt(form.purchase_amount)>0 || parseInt(form.total_sale)>0) && (() => {
                const cost   = (parseInt(form.purchase_amount)||0) + (parseInt(form.transport_amount)||0);
                const profit = (parseInt(form.total_sale)||0) - cost;
                return (
                  <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 flex-wrap">
                    <p className="text-[11.5px] text-gray-500">
                      {(parseInt(form.total_sale)||0).toLocaleString("fr-FR")} F − {cost.toLocaleString("fr-FR")} F (coûts)
                    </p>
                    {form.manual_profit ? (
                      <div className="flex items-center gap-2">
                        <input type="number" value={form.net_profit}
                          onChange={e => setForm(f=>({...f,net_profit:e.target.value}))}
                          className="w-32 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[13px] font-semibold text-gray-900 outline-none focus:border-gray-400 transition-colors" />
                        <button type="button" onClick={() => setForm(f=>({...f,manual_profit:false}))}
                          className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">Auto</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`text-[15px] font-bold ${profit>=0?"text-emerald-600":"text-red-500"}`}>
                          = {profit>=0?"+":""}{profit.toLocaleString("fr-FR")} F
                        </span>
                        <button type="button" onClick={() => setForm(f=>({...f,manual_profit:true}))}
                          className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">Modifier</button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Notes */}
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Notes / Détails</label>
                <textarea value={form.notes} rows={2} maxLength={600}
                  placeholder="Détails de l'opération…"
                  onChange={e => setForm(f=>({...f,notes:e.target.value}))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 placeholder:text-gray-300 transition-colors resize-none" />
              </div>

              {/* Save / Cancel */}
              <div className="flex gap-2">
                <button type="button" onClick={handleSave} disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {saving ? "Enregistrement…" : editOp ? "Enregistrer" : "Ajouter l'opération"}
                </button>
                <button type="button" onClick={cancel}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Operations list ── */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
        {ops.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-200 block mb-2">inventory_2</span>
            <p className="text-[13px] text-gray-400 mb-3">Aucune opération</p>
            <button onClick={openNew} className="text-[12px] font-semibold text-gray-900 underline underline-offset-2">
              Créer la première
            </button>
          </div>
        ) : (
          ops.map(op => (
            <OpRow
              key={op.id}
              op={op}
              onEdit={openEdit}
              onDelete={handleDelete}
              deleting={deleting}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ── Operation row (expandable) ── */
function OpRow({ op, onEdit, onDelete, deleting }: {
  op: Op;
  onEdit: (o: Op) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
}) {
  const [open, setOpen] = useState(false);
  const isPartial = op.to_collect_amount > 0;
  const date = fD(op.operation_date);

  return (
    <div>
      {/* Summary row */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors select-none"
        onClick={() => setOpen(v => !v)}
      >
        <span className="text-xl shrink-0">{op.product_emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {op.operation_number != null && (
              <span className="text-[10px] font-bold text-gray-300">#{op.operation_number}</span>
            )}
            <span className="text-[13px] font-medium text-gray-900">{op.product_name}</span>
            {op.location && (
              <span className="text-[11px] text-gray-400 hidden sm:block">· {op.location}</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {date && <span className="text-[11px] text-gray-400">{date}</span>}
            {op.quantity && <span className="text-[11px] text-gray-400">{op.quantity} {op.quantity_unit}</span>}
            <span className={`text-[10px] font-medium ${isPartial ? "text-amber-600" : "text-gray-400"}`}>
              {isPartial ? "En attente" : "Soldé"}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0 mr-1">
          <p className={`text-[14px] font-bold ${op.net_profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {op.net_profit >= 0 ? "+" : ""}{op.net_profit.toLocaleString("fr-FR")} F
          </p>
        </div>
        <span className={`material-symbols-outlined text-gray-300 text-[18px] transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </div>

      {/* Detail panel */}
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
            <div className="bg-gray-50 border-t border-gray-100 px-4 py-4 space-y-3">

              {/* Financial grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Achat",       value: op.purchase_amount  },
                  { label: "Transport",   value: op.transport_amount },
                  { label: "Total vente", value: op.total_sale       },
                  { label: "Coût total",  value: op.purchase_amount + op.transport_amount },
                ].map(k => (
                  <div key={k.label} className="bg-white rounded-lg px-3 py-2.5 border border-gray-200">
                    <p className="text-[10px] text-gray-400 mb-0.5">{k.label}</p>
                    <p className="text-[13px] font-semibold text-gray-700">
                      {k.value.toLocaleString("fr-FR")} F
                    </p>
                  </div>
                ))}
              </div>

              {/* Encaissement */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg px-3 py-2.5 border border-gray-200">
                  <p className="text-[10px] text-gray-400 mb-0.5">Encaissé</p>
                  <p className="text-[13px] font-semibold text-emerald-600">
                    {op.collected_amount.toLocaleString("fr-FR")} F
                  </p>
                </div>
                <div className="bg-white rounded-lg px-3 py-2.5 border border-gray-200">
                  <p className="text-[10px] text-gray-400 mb-0.5">Reste à encaisser</p>
                  <p className={`text-[13px] font-semibold ${op.to_collect_amount > 0 ? "text-amber-600" : "text-gray-400"}`}>
                    {op.to_collect_amount > 0 ? `${op.to_collect_amount.toLocaleString("fr-FR")} F` : "—"}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {op.notes && (
                <div className="bg-white rounded-lg px-3 py-2.5 border border-gray-200">
                  <p className="text-[10px] text-gray-400 mb-1">Notes</p>
                  <p className="text-[12px] text-gray-600 leading-relaxed whitespace-pre-wrap">{op.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => onEdit(op)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[13px]">edit</span> Modifier
                </button>
                <button onClick={() => onDelete(op.id)} disabled={deleting === op.id}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[12px] font-medium text-red-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors disabled:opacity-40">
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

/* ═══════════════════════════════════════════
   SECTION 3 — FINANCES
═══════════════════════════════════════════ */
function FinancesView({ ops, totals, capital, onSaveCapital }: {
  ops: Op[];
  totals: { beneficeTotal: number; beneficeEncaisse: number; aEncaisser: number; couts: number; ventes: number; encaisse: number };
  capital: number;
  onSaveCapital: (v: number) => void;
}) {
  const [editCap,  setEditCap]  = useState(false);
  const [tempCap,  setTempCap]  = useState("");

  const saveCap = () => {
    const v = parseInt(tempCap) || DEFAULT_CAPITAL;
    onSaveCapital(v);
    setEditCap(false);
  };

  return (
    <div className="p-5 md:p-7 max-w-3xl space-y-6">

      <div>
        <h1 className="text-[20px] font-headline font-black text-gray-900">Finances</h1>
        <p className="text-[12px] text-gray-400 mt-0.5">Récapitulatif financier des opérations</p>
      </div>

      {/* Capital */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.07em] mb-4">Capital</p>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Capital de départ</p>
            {editCap ? (
              <div className="flex items-center gap-2">
                <input type="number" value={tempCap} autoFocus
                  onChange={e => setTempCap(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveCap()}
                  className="w-40 px-3 py-2 rounded-lg border border-gray-300 bg-white text-[14px] font-semibold text-gray-900 outline-none focus:border-gray-500 transition-colors" />
                <button onClick={saveCap} className="px-3 py-2 rounded-lg bg-gray-900 text-white text-[12px] font-semibold">OK</button>
                <button onClick={() => setEditCap(false)} className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors">Annuler</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-[22px] font-headline font-black text-gray-900">{fF(capital)}</p>
                <button onClick={() => { setTempCap(capital.toString()); setEditCap(true); }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </button>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-400 mb-1">Capital disponible</p>
            <p className="text-[22px] font-headline font-black text-emerald-600">{fF(capital + totals.beneficeEncaisse)}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">projeté : {fF(capital + totals.beneficeTotal)}</p>
          </div>
        </div>
      </div>

      {/* Financial summary table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.07em]">Résumé financier</p>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { label: "Total achats",           value: totals.couts - ops.reduce((s,o)=>s+o.transport_amount,0), neutral: true },
            { label: "Total transport",        value: ops.reduce((s,o)=>s+o.transport_amount,0),               neutral: true },
            { label: "Total coûts",            value: totals.couts,                                            neutral: true, bold: true },
            { label: "Total ventes",           value: totals.ventes,                                           neutral: false },
            { label: "Total encaissé",         value: totals.encaisse,                                         neutral: false },
            { label: "Reste à encaisser",      value: totals.aEncaisser,                                       amber: true },
            { label: "Bénéfice encaissé",      value: totals.beneficeEncaisse,                                 green: true, bold: true },
            { label: "Bénéfice total projeté", value: totals.beneficeTotal,                                    neutral: false },
          ].map(k => (
            <div key={k.label} className="flex items-center justify-between px-5 py-3">
              <p className={`text-[13px] ${k.bold ? "font-semibold text-gray-900" : "text-gray-600"}`}>{k.label}</p>
              <p className={`text-[13px] ${
                k.green ? "font-bold text-emerald-600" :
                k.amber ? "font-semibold text-amber-600" :
                k.bold  ? "font-semibold text-gray-900" :
                "text-gray-700"
              }`}>
                {k.neutral ? "−" : ""}{k.value.toLocaleString("fr-FR")} F
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Per operation table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.07em]">Détail par opération</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-gray-100">
                {["#","Produit","Achat","Transport","Vente","Encaissé","Reste","Bénéfice"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ops.map(op => (
                <tr key={op.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 text-gray-400">{op.operation_number ?? "—"}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                    {op.product_emoji} {op.product_name}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{op.purchase_amount.toLocaleString("fr-FR")} F</td>
                  <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{op.transport_amount.toLocaleString("fr-FR")} F</td>
                  <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{op.total_sale.toLocaleString("fr-FR")} F</td>
                  <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{op.collected_amount.toLocaleString("fr-FR")} F</td>
                  <td className={`px-4 py-2.5 whitespace-nowrap ${op.to_collect_amount > 0 ? "text-amber-600 font-medium" : "text-gray-400"}`}>
                    {op.to_collect_amount > 0 ? `${op.to_collect_amount.toLocaleString("fr-FR")} F` : "—"}
                  </td>
                  <td className={`px-4 py-2.5 font-bold whitespace-nowrap ${op.net_profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {op.net_profit >= 0 ? "+" : ""}{op.net_profit.toLocaleString("fr-FR")} F
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Shared: Metric card
───────────────────────────────────────── */
function MetricCard({ label, value, sub, green, amber }: {
  label: string;
  value: string;
  sub?: string;
  green?: boolean;
  amber?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.06em] mb-2 leading-tight">{label}</p>
      <p className={`font-headline font-black text-[17px] leading-tight ${
        green ? "text-emerald-600" : amber ? "text-amber-600" : "text-gray-900"
      }`}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
