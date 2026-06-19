import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Constants ─── */
const ACCESS_CODE   = "MAMAKAASA2026";
const SESSION_KEY   = "mgmt_auth_v1";
const CAPITAL_KEY   = "mgmt_capital_v1";
const OPS_CACHE_KEY = "mgmt_ops_cache_v1";
const DEFAULT_CAPITAL = 900_000;

/* ─── SQL for first-time setup ─── */
const SQL_SETUP = `CREATE TABLE IF NOT EXISTS public.operations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_number  INTEGER,
  product_name      TEXT NOT NULL,
  product_emoji     TEXT NOT NULL DEFAULT '📦',
  location          TEXT,
  operation_date    DATE,
  quantity          DECIMAL,
  quantity_unit     TEXT NOT NULL DEFAULT 'KG',
  purchase_amount   INTEGER NOT NULL DEFAULT 0,
  transport_amount  INTEGER NOT NULL DEFAULT 0,
  total_sale        INTEGER NOT NULL DEFAULT 0,
  collected_amount  INTEGER NOT NULL DEFAULT 0,
  to_collect_amount INTEGER NOT NULL DEFAULT 0,
  net_profit        INTEGER NOT NULL DEFAULT 0,
  notes             TEXT,
  status            TEXT NOT NULL DEFAULT 'completed',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access operations"
  ON public.operations FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_ops_number
  ON public.operations (operation_number ASC NULLS LAST);`;

/* ─── Types ─── */
type View     = "dashboard" | "operations" | "finances";
type DbStatus = "loading" | "ready" | "setup_needed";

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

type Totals = {
  beneficeTotal: number;
  beneficeEncaisse: number;
  aEncaisser: number;
  encaisse: number;
  ventes: number;
  couts: number;
};

/* ─── Seed — only inserted when DB table is empty ─── */
type SeedOp = Omit<Op, "id" | "created_at">;
const SEED: SeedOp[] = [
  { operation_number: 1, product_name: "Mangue", product_emoji: "🥭", location: "DIOUROU (Tabaski)", operation_date: null, quantity: 300, quantity_unit: "KG", purchase_amount: 48000, transport_amount: 22000, total_sale: 90000, collected_amount: 90000, to_collect_amount: 0, net_profit: 30000, status: "completed", notes: "12 bassines × 4 000 FCFA = 48 000 FCFA achat • 300 FCFA/KG × 300 KG = 90 000 FCFA vente" },
  { operation_number: 2, product_name: "Mangue", product_emoji: "🥭", location: "DIOUROU", operation_date: null, quantity: 315, quantity_unit: "KG", purchase_amount: 22000, transport_amount: 18000, total_sale: 55900, collected_amount: 30000, to_collect_amount: 25900, net_profit: 15900, status: "partial", notes: "9 sacs de mangue = 22 000 FCFA achat" },
  { operation_number: 3, product_name: "Oignons verts", product_emoji: "🧅", location: null, operation_date: null, quantity: null, quantity_unit: "KG", purchase_amount: 75000, transport_amount: 40000, total_sale: 130000, collected_amount: 130000, to_collect_amount: 0, net_profit: 15000, status: "completed", notes: "10 balles = 75 000 FCFA achat • Transport : 16 000 + 21 000 + 3 000 = 40 000 FCFA • Tout encaissé" },
  { operation_number: 4, product_name: "Madd", product_emoji: "🍈", location: null, operation_date: "2026-06-14", quantity: null, quantity_unit: "KG", purchase_amount: 32000, transport_amount: 0, total_sale: 56000, collected_amount: 56000, to_collect_amount: 0, net_profit: 24000, status: "completed", notes: "4 sacs × 8 000 FCFA = 32 000 FCFA achat • 4 sacs × 14 000 FCFA = 56 000 FCFA vente" },
];

/* ─── Helpers ─── */
const fF = (n: number) => n.toLocaleString("fr-FR") + " FCFA";
const fD = (s: string | null) =>
  s ? new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : null;
const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const sortOps = (arr: Op[]) => [...arr].sort((a, b) => (a.operation_number ?? 999) - (b.operation_number ?? 999));

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

/* ═══════════════════════════════════════
   PIN SCREEN
═══════════════════════════════════════ */
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
              animate={shake ? { x: [0,-10,10,-7,7,-3,3,0] } : {}}
              transition={{ duration: 0.4 }}
              type="password"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && tryLogin()}
              placeholder="Code d'accès"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-center font-mono text-[15px] tracking-[0.25em] text-gray-900 outline-none focus:border-gray-400 focus:bg-white transition-all mb-3"
            />
            <button onClick={tryLogin}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-800 transition-colors">
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

/* ═══════════════════════════════════════
   MAIN APP
═══════════════════════════════════════ */
function GestionApp() {
  const [view,     setView]     = useState<View>("dashboard");
  const [dbStatus, setDbStatus] = useState<DbStatus>("loading");
  const [ops,      setOps]      = useState<Op[]>(() => {
    try {
      const raw = localStorage.getItem(OPS_CACHE_KEY);
      if (raw) return sortOps(JSON.parse(raw) as Op[]);
    } catch { /* */ }
    return [];
  });
  const [capital, setCapital] = useState(() => {
    const s = localStorage.getItem(CAPITAL_KEY);
    return s ? parseInt(s) : DEFAULT_CAPITAL;
  });

  useEffect(() => { void initDb(); }, []);

  async function initDb() {
    const { data, error } = await supabase
      .from("operations")
      .select("*")
      .order("operation_number", { ascending: true });

    if (error) {
      setDbStatus("setup_needed");
      return;
    }

    let rows = data as Op[];

    if (rows.length === 0) {
      await supabase.from("operations").insert(SEED);
      const { data: fresh } = await supabase
        .from("operations")
        .select("*")
        .order("operation_number", { ascending: true });
      if (fresh) rows = fresh as Op[];
    }

    const sorted = sortOps(rows);
    setOps(sorted);
    localStorage.setItem(OPS_CACHE_KEY, JSON.stringify(sorted));
    setDbStatus("ready");
  }

  const saveCapital = (v: number) => {
    setCapital(v);
    localStorage.setItem(CAPITAL_KEY, v.toString());
  };

  const totals = useMemo((): Totals => {
    const beneficeTotal    = ops.reduce((s, o) => s + o.net_profit, 0);
    const aEncaisser       = ops.reduce((s, o) => s + o.to_collect_amount, 0);
    const encaisse         = ops.reduce((s, o) => s + o.collected_amount, 0);
    const ventes           = ops.reduce((s, o) => s + o.total_sale, 0);
    const couts            = ops.reduce((s, o) => s + o.purchase_amount + o.transport_amount, 0);
    const beneficeEncaisse = ops.reduce((s, o) => {
      if (o.total_sale === 0) return s + o.net_profit;
      return s + Math.round((o.collected_amount / o.total_sale) * o.net_profit);
    }, 0);
    return { beneficeTotal, beneficeEncaisse, aEncaisser, encaisse, ventes, couts };
  }, [ops]);

  const addOp = async (op: Op): Promise<boolean> => {
    const { id: _id, created_at: _c, ...payload } = op;
    const { data, error } = await supabase.from("operations").insert(payload).select().single();
    if (error) return false;
    setOps(prev => {
      const next = sortOps([...prev, data as Op]);
      localStorage.setItem(OPS_CACHE_KEY, JSON.stringify(next));
      return next;
    });
    return true;
  };

  const updateOp = async (op: Op): Promise<boolean> => {
    const { id, created_at: _c, ...payload } = op;
    const { error } = await supabase
      .from("operations")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return false;
    setOps(prev => {
      const next = prev.map(o => o.id === id ? op : o);
      localStorage.setItem(OPS_CACHE_KEY, JSON.stringify(next));
      return next;
    });
    return true;
  };

  const deleteOp = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("operations").delete().eq("id", id);
    if (error) return false;
    setOps(prev => {
      const next = prev.filter(o => o.id !== id);
      localStorage.setItem(OPS_CACHE_KEY, JSON.stringify(next));
      return next;
    });
    return true;
  };

  const resetOps = async () => {
    if (!confirm("Réinitialiser avec les données initiales ? Toutes vos modifications seront perdues.")) return;
    const ids = ops.map(o => o.id);
    if (ids.length > 0) await supabase.from("operations").delete().in("id", ids);
    await supabase.from("operations").insert(SEED);
    const { data: fresh } = await supabase.from("operations").select("*").order("operation_number", { ascending: true });
    if (fresh) {
      const sorted = sortOps(fresh as Op[]);
      setOps(sorted);
      localStorage.setItem(OPS_CACHE_KEY, JSON.stringify(sorted));
    }
    toast.success("Données réinitialisées");
  };

  const NAV: { id: View; icon: string; label: string }[] = [
    { id: "dashboard",  icon: "home",      label: "Tableau de bord" },
    { id: "operations", icon: "list_alt",  label: "Opérations"      },
    { id: "finances",   icon: "bar_chart", label: "Finances"         },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="shrink-0 bg-white border-b border-gray-200 h-12 flex items-center px-4 gap-3 z-30">
        <img src="/logo-mamakaasa.png" alt="Mamakaasa" className="h-6 object-contain shrink-0" />
        <div className="w-px h-4 bg-gray-200" />
        <span className="text-[12px] text-gray-400 hidden sm:block">
          {NAV.find(n => n.id === view)?.label}
        </span>
        {dbStatus === "ready"        && <span className="ml-1 text-[10px] text-emerald-500 hidden sm:block">· Synchronisé</span>}
        {dbStatus === "setup_needed" && <span className="ml-1 text-[10px] text-amber-500 hidden sm:block">· Configuration requise</span>}
        {dbStatus === "loading"      && <span className="ml-1 text-[10px] text-gray-400 hidden sm:block">· Connexion…</span>}
        <div className="ml-auto flex items-center gap-1">
          <Link to="/" className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-[17px]">home</span>
          </Link>
          <button onClick={() => { sessionStorage.removeItem(SESSION_KEY); window.location.reload(); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-[17px]">logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="hidden md:flex flex-col w-52 shrink-0 bg-gray-950 border-r border-white/5">
          <nav className="flex-1 px-2 pt-4 space-y-0.5">
            {NAV.map(n => (
              <button key={n.id} onClick={() => setView(n.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-[12.5px] font-medium transition-colors ${
                  view === n.id ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}>
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

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="md:hidden shrink-0 bg-white border-b border-gray-200 flex">
            {NAV.map(n => (
              <button key={n.id} onClick={() => setView(n.id)}
                className={`flex-1 py-2.5 text-[11px] font-semibold flex flex-col items-center gap-0.5 transition-colors ${
                  view === n.id ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-400"
                }`}>
                <span className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: view === n.id ? "'FILL' 1" : "'FILL' 0" }}>
                  {n.icon}
                </span>
                {n.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {dbStatus === "setup_needed" ? (
              <SetupScreen />
            ) : dbStatus === "loading" && ops.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-[12px] text-gray-400">Chargement des données…</p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={view}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full">
                  {view === "dashboard" && (
                    <DashboardView ops={ops} totals={totals} capital={capital} onGoToOps={() => setView("operations")} />
                  )}
                  {view === "operations" && (
                    <OperationsView ops={ops} onAdd={addOp} onUpdate={updateOp} onDelete={deleteOp} />
                  )}
                  {view === "finances" && (
                    <FinancesView ops={ops} totals={totals} capital={capital} onSaveCapital={saveCapital} onReset={resetOps} />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Setup screen ─── */
function SetupScreen() {
  const copy = () => { navigator.clipboard?.writeText(SQL_SETUP); toast.success("SQL copié !"); };
  return (
    <div className="p-5 md:p-7 max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-950 px-5 py-4">
          <h2 className="text-white font-semibold text-[14px]">Configuration base de données requise</h2>
          <p className="text-gray-400 text-[12px] mt-1">
            La table <code className="text-gray-300 bg-white/10 px-1 rounded">operations</code> n'existe pas encore dans Supabase.
          </p>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-[13px] text-gray-600">
            Exécutez ce SQL dans <strong>Supabase Dashboard → SQL Editor</strong>, puis rechargez la page :
          </p>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 overflow-x-auto">
            <pre className="text-[11px] text-gray-700 whitespace-pre font-mono leading-relaxed">{SQL_SETUP}</pre>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.location.reload()}
              className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-800 transition-colors">
              Recharger la page
            </button>
            <button onClick={copy}
              className="px-4 py-2.5 rounded-lg border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              Copier le SQL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION 1 — TABLEAU DE BORD
═══════════════════════════════════════ */
function DashboardView({ ops, totals, capital, onGoToOps }: {
  ops: Op[];
  totals: Totals;
  capital: number;
  onGoToOps: () => void;
}) {
  const recent = [...ops].reverse().slice(0, 3);

  return (
    <div className="p-5 md:p-7 max-w-3xl space-y-6">
      <div>
        <h1 className="text-[20px] font-headline font-black text-gray-900">Tableau de bord</h1>
        <p className="text-[12px] text-gray-400 mt-0.5 capitalize">{today}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Bénéfice encaissé"     value={fF(totals.beneficeEncaisse)} sub="sur montants reçus" green />
        <MetricCard label="Capital disponible"     value={fF(capital + totals.beneficeEncaisse)} sub={`départ : ${fF(capital)}`} />
        <MetricCard label="À encaisser"            value={fF(totals.aEncaisser)} sub={totals.aEncaisser > 0 ? "montants en attente" : "tout encaissé ✓"} amber={totals.aEncaisser > 0} />
        <MetricCard label="Bénéfice total projeté" value={fF(totals.beneficeTotal)} sub={`${ops.length} opération${ops.length !== 1 ? "s" : ""}`} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-semibold text-gray-900">Activité récente</h2>
          <button onClick={onGoToOps} className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors">
            Voir tout →
          </button>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {recent.length === 0 ? (
            <div className="px-4 py-8 text-center text-[12px] text-gray-400">Aucune opération</div>
          ) : recent.map(op => (
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
          ))}
        </div>
      </div>

      <div className="bg-gray-950 rounded-xl p-5">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">Résumé financier</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Coûts totaux",          value: fF(totals.couts),            dim: true  },
            { label: "Total ventes",           value: fF(totals.ventes),           dim: false },
            { label: "Bénéfice encaissé",      value: fF(totals.beneficeEncaisse), green: true },
            { label: "Bénéfice total projeté", value: fF(totals.beneficeTotal),    dim: false },
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

      <button onClick={onGoToOps}
        className="w-full py-3 rounded-xl border border-gray-200 bg-white text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
        Gérer les opérations →
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION 2 — OPÉRATIONS
═══════════════════════════════════════ */
function OperationsView({ ops, onAdd, onUpdate, onDelete }: {
  ops: Op[];
  onAdd: (op: Op) => Promise<boolean>;
  onUpdate: (op: Op) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editOp,   setEditOp]   = useState<Op | null>(null);
  const [form,     setForm]     = useState({ ...BLANK });
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!form.manual_profit) {
      const v = (parseInt(form.total_sale)||0) - (parseInt(form.purchase_amount)||0) - (parseInt(form.transport_amount)||0);
      setForm(f => ({ ...f, net_profit: v.toString() }));
    }
  }, [form.total_sale, form.purchase_amount, form.transport_amount, form.manual_profit]);

  useEffect(() => {
    const v = Math.max(0, (parseInt(form.total_sale)||0) - (parseInt(form.collected_amount)||0));
    setForm(f => ({ ...f, to_collect_amount: v.toString() }));
  }, [form.total_sale, form.collected_amount]);

  const openNew  = () => { setEditOp(null); setForm({ ...BLANK }); setShowForm(true); };
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
    const toCollect = parseInt(form.to_collect_amount) || 0;
    const payload = {
      operation_number:  form.operation_number ? parseInt(form.operation_number) : null,
      product_name:      form.product_name.trim(),
      product_emoji:     form.product_emoji,
      location:          form.location.trim() || null,
      operation_date:    form.operation_date || null,
      quantity:          form.quantity ? parseFloat(form.quantity) : null,
      quantity_unit:     form.quantity_unit,
      purchase_amount:   parseInt(form.purchase_amount)  || 0,
      transport_amount:  parseInt(form.transport_amount) || 0,
      total_sale:        parseInt(form.total_sale)       || 0,
      collected_amount:  parseInt(form.collected_amount) || 0,
      to_collect_amount: toCollect,
      net_profit:        parseInt(form.net_profit)       || 0,
      notes:             form.notes.trim() || null,
      status:            toCollect > 0 ? "partial" : "completed",
    };

    setSaving(true);
    let ok: boolean;
    if (editOp) {
      ok = await onUpdate({ ...editOp, ...payload });
      if (ok) toast.success("Opération modifiée");
      else    toast.error("Erreur lors de la modification");
    } else {
      ok = await onAdd({ id: crypto.randomUUID(), ...payload, created_at: now });
      if (ok) toast.success("Opération ajoutée");
      else    toast.error("Erreur lors de l'ajout");
    }
    setSaving(false);
    if (ok) cancel();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette opération ?")) return;
    setDeleting(id);
    const ok = await onDelete(id);
    if (ok) toast.success("Supprimée");
    else    toast.error("Erreur lors de la suppression");
    setDeleting(null);
  };

  const inp = "w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 placeholder:text-gray-300 transition-colors";
  const lbl = "block text-[11px] font-semibold text-gray-400 uppercase tracking-[0.06em] mb-1.5";

  return (
    <div className="p-5 md:p-7 max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-headline font-black text-gray-900">Opérations</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">{ops.length} opération{ops.length !== 1 ? "s" : ""} enregistrée{ops.length !== 1 ? "s" : ""}</p>
        </div>
        {!showForm && (
          <button onClick={openNew}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-[12.5px] font-semibold hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-[14px]">add</span>
            <span className="hidden sm:inline">Nouvelle</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div key="form"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
            className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <p className="text-[14px] font-semibold text-gray-900">
                {editOp ? `Modifier · Opération #${editOp.operation_number ?? "?"}` : "Nouvelle opération"}
              </p>
              <button onClick={cancel} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-5">
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

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Notes / Détails</label>
                <textarea value={form.notes} rows={2} maxLength={600}
                  placeholder="Détails de l'opération…"
                  onChange={e => setForm(f=>({...f,notes:e.target.value}))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 placeholder:text-gray-300 transition-colors resize-none" />
              </div>

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

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
        {ops.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-200 block mb-2">inventory_2</span>
            <p className="text-[13px] text-gray-400 mb-3">Aucune opération</p>
            <button onClick={openNew} className="text-[12px] font-semibold text-gray-900 underline underline-offset-2">
              Créer la première
            </button>
          </div>
        ) : ops.map(op => (
          <OpRow key={op.id} op={op} onEdit={openEdit} onDelete={handleDelete} deleting={deleting} />
        ))}
      </div>
    </div>
  );
}

function OpRow({ op, onEdit, onDelete, deleting }: {
  op: Op;
  onEdit: (o: Op) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
}) {
  const [open, setOpen] = useState(false);
  const isPartial = op.to_collect_amount > 0;

  return (
    <div>
      <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors select-none"
        onClick={() => setOpen(v => !v)}>
        <span className="text-xl shrink-0">{op.product_emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {op.operation_number != null && <span className="text-[10px] font-bold text-gray-300">#{op.operation_number}</span>}
            <span className="text-[13px] font-medium text-gray-900">{op.product_name}</span>
            {op.location && <span className="text-[11px] text-gray-400 hidden sm:block">· {op.location}</span>}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {fD(op.operation_date) && <span className="text-[11px] text-gray-400">{fD(op.operation_date)}</span>}
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

      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body"
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }} className="overflow-hidden">
            <div className="bg-gray-50 border-t border-gray-100 px-4 py-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Achat",       value: op.purchase_amount },
                  { label: "Transport",   value: op.transport_amount },
                  { label: "Total vente", value: op.total_sale },
                  { label: "Coût total",  value: op.purchase_amount + op.transport_amount },
                ].map(k => (
                  <div key={k.label} className="bg-white rounded-lg px-3 py-2.5 border border-gray-200">
                    <p className="text-[10px] text-gray-400 mb-0.5">{k.label}</p>
                    <p className="text-[13px] font-semibold text-gray-700">{k.value.toLocaleString("fr-FR")} F</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg px-3 py-2.5 border border-gray-200">
                  <p className="text-[10px] text-gray-400 mb-0.5">Encaissé</p>
                  <p className="text-[13px] font-semibold text-emerald-600">{op.collected_amount.toLocaleString("fr-FR")} F</p>
                </div>
                <div className="bg-white rounded-lg px-3 py-2.5 border border-gray-200">
                  <p className="text-[10px] text-gray-400 mb-0.5">Reste à encaisser</p>
                  <p className={`text-[13px] font-semibold ${op.to_collect_amount > 0 ? "text-amber-600" : "text-gray-400"}`}>
                    {op.to_collect_amount > 0 ? `${op.to_collect_amount.toLocaleString("fr-FR")} F` : "—"}
                  </p>
                </div>
              </div>
              {op.notes && (
                <div className="bg-white rounded-lg px-3 py-2.5 border border-gray-200">
                  <p className="text-[10px] text-gray-400 mb-1">Notes</p>
                  <p className="text-[12px] text-gray-600 leading-relaxed whitespace-pre-wrap">{op.notes}</p>
                </div>
              )}
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

/* ═══════════════════════════════════════
   SECTION 3 — FINANCES
═══════════════════════════════════════ */
function FinancesView({ ops, totals, capital, onSaveCapital, onReset }: {
  ops: Op[];
  totals: Totals;
  capital: number;
  onSaveCapital: (v: number) => void;
  onReset: () => Promise<void>;
}) {
  const [editCap, setEditCap] = useState(false);
  const [tempCap, setTempCap] = useState("");

  const saveCap = () => {
    const v = parseInt(tempCap) || DEFAULT_CAPITAL;
    onSaveCapital(v);
    setEditCap(false);
  };

  const totalAchats    = ops.reduce((s,o) => s + o.purchase_amount, 0);
  const totalTransport = ops.reduce((s,o) => s + o.transport_amount, 0);

  return (
    <div className="p-5 md:p-7 max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-headline font-black text-gray-900">Finances</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Récapitulatif financier des opérations</p>
        </div>
        <button onClick={onReset}
          className="text-[11px] text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2">
          Réinitialiser les données
        </button>
      </div>

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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.07em]">Résumé financier</p>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { label: "Total achats",           value: totalAchats,              neutral: true  },
            { label: "Total transport",        value: totalTransport,           neutral: true  },
            { label: "Total coûts",            value: totals.couts,             neutral: true, bold: true },
            { label: "Total ventes",           value: totals.ventes,            neutral: false },
            { label: "Total encaissé",         value: totals.encaisse,          neutral: false },
            { label: "Reste à encaisser",      value: totals.aEncaisser,        amber: true    },
            { label: "Bénéfice encaissé",      value: totals.beneficeEncaisse,  green: true, bold: true },
            { label: "Bénéfice total projeté", value: totals.beneficeTotal,     neutral: false },
          ].map(k => (
            <div key={k.label} className="flex items-center justify-between px-5 py-3">
              <p className={`text-[13px] ${k.bold ? "font-semibold text-gray-900" : "text-gray-600"}`}>{k.label}</p>
              <p className={`text-[13px] ${
                k.green   ? "font-bold text-emerald-600" :
                k.amber   ? "font-semibold text-amber-600" :
                k.bold    ? "font-semibold text-gray-900" : "text-gray-700"
              }`}>
                {k.neutral ? "−" : ""}{k.value.toLocaleString("fr-FR")} F
              </p>
            </div>
          ))}
        </div>
      </div>

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
                  <td className="px-4 py-2.5 font-medium text-gray-900 whitespace-nowrap">{op.product_emoji} {op.product_name}</td>
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

/* ─── Metric card ─── */
function MetricCard({ label, value, sub, green, amber }: {
  label: string; value: string; sub?: string; green?: boolean; amber?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.06em] mb-2 leading-tight">{label}</p>
      <p className={`font-headline font-black text-[17px] leading-tight ${green ? "text-emerald-600" : amber ? "text-amber-600" : "text-gray-900"}`}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
