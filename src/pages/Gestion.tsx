import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ══════ CONSTANTS ══════ */
const ACCESS_CODE   = "MAMAKAASA2026";
const SESSION_KEY   = "mgmt_auth_v1";
const CAPITAL_KEY   = "mgmt_capital_v1";
const DEFAULT_CAPITAL = 900_000;

const SETUP_SQL = `-- Créer la table des opérations
CREATE TABLE IF NOT EXISTS public.operations (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_number  INTEGER,
  product_name      TEXT        NOT NULL,
  product_emoji     TEXT        NOT NULL DEFAULT '📦',
  location          TEXT,
  operation_date    DATE,
  quantity          DECIMAL,
  quantity_unit     TEXT        NOT NULL DEFAULT 'KG',
  purchase_amount   INTEGER     NOT NULL DEFAULT 0,
  transport_amount  INTEGER     NOT NULL DEFAULT 0,
  total_sale        INTEGER     NOT NULL DEFAULT 0,
  collected_amount  INTEGER     NOT NULL DEFAULT 0,
  to_collect_amount INTEGER     NOT NULL DEFAULT 0,
  net_profit        INTEGER     NOT NULL DEFAULT 0,
  notes             TEXT,
  status            TEXT        NOT NULL DEFAULT 'completed',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.operations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public full access operations" ON public.operations;
CREATE POLICY "Public full access operations" ON public.operations FOR ALL USING (true) WITH CHECK (true);

-- Insérer les 4 opérations réelles
INSERT INTO public.operations
  (operation_number,product_name,product_emoji,location,operation_date,
   quantity,quantity_unit,purchase_amount,transport_amount,
   total_sale,collected_amount,to_collect_amount,net_profit,status,notes)
VALUES
  (1,'Mangue','🥭','DIOUROU (Tabaski)',NULL,
   300,'KG',48000,22000,90000,90000,0,30000,'completed',
   '12 bassines × 4 000 FCFA = 48 000 FCFA • Vente : 300 FCFA/KG × 300 KG = 90 000 FCFA'),
  (2,'Mangue','🥭','DIOUROU',NULL,
   315,'KG',22000,18000,55900,30000,25900,15900,'partial',
   '9 sacs de mangue = 22 000 FCFA • Vente : 270 FCFA/kg → 38 800 FCFA + 100 FCFA/kg → 17 100 FCFA • Encaissé : 30 000 FCFA / Reste : 25 900 FCFA'),
  (3,'Oignons verts','🧅',NULL,NULL,
   NULL,'KG',75000,40000,130000,91500,38500,15000,'partial',
   '10 balles = 75 000 FCFA • Transport : 16 000 + 21 000 + 3 000 = 40 000 FCFA • Encaissé : 91 500 FCFA • À encaisser : 16 500 + 10 000 + 12 000 = 38 500 FCFA'),
  (4,'Madd','🍈',NULL,'2026-06-14',
   NULL,'KG',32000,0,56000,56000,0,24000,'completed',
   '4 sacs × 8 000 FCFA = 32 000 FCFA achat • 4 sacs × 14 000 FCFA = 56 000 FCFA vente');`;

/* ══════ TYPES ══════ */
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

/* ══════ HELPERS ══════ */
const fp  = (n: number) => n.toLocaleString("fr-FR") + " FCFA";
const fpc = (n: number) => n.toLocaleString("fr-FR") + " F";
const fd  = (s: string | null) =>
  s ? new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : null;

const EMOJIS = ["🥭","🧅","🍈","🍊","🥬","🌾","🌶️","🥔","🍌","🍋","🥝","🍉","🌿","🫑","🫒","📦"];
const UNITS  = ["KG","SACS","BASSINES","BALLES","CAISSES","BOÎTES","TONNES","UNITÉS"];

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
  to_collect_amount:"",
  net_profit:       "",
  notes:            "",
  manual_profit:    false as boolean,
};

/* ══════════════════════════════════════════
   ROOT — PIN GATE
══════════════════════════════════════════ */
export default function Gestion() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [code,   setCode]   = useState("");
  const [shake,  setShake]  = useState(false);

  const handleLogin = () => {
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
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-5">
          <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
        </div>
        <h1 className="font-headline font-black text-2xl text-gray-900 mb-1">Gestion Interne</h1>
        <p className="text-sm text-gray-400 mb-7">Mamakaasa — Espace équipe</p>
        <motion.div animate={shake ? { x: [-8,8,-8,8,0] } : {}} transition={{ duration: 0.4 }}>
          <input
            type="password"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Code d'accès"
            autoFocus
            className={`w-full px-4 py-3.5 rounded-xl border-2 text-center font-headline font-bold text-lg tracking-[0.3em] outline-none transition-colors mb-3 ${
              shake ? "border-red-400 bg-red-50 text-red-600" : "border-gray-200 bg-gray-50 text-gray-900 focus:border-gray-900"
            }`}
          />
        </motion.div>
        {shake && <p className="text-sm text-red-500 mb-3 -mt-1">Code incorrect.</p>}
        <button onClick={handleLogin}
          className="w-full py-3.5 rounded-xl bg-gray-900 text-white font-headline font-bold text-base hover:opacity-90 transition-opacity">
          Accéder →
        </button>
        <Link to="/" className="block mt-5 text-[12px] text-gray-400 hover:text-gray-600 transition-colors">← Retour à l'accueil</Link>
      </motion.div>
    </div>
  );

  return <GestionDashboard />;
}

/* ══════════════════════════════════════════
   SETUP SCREEN — shown when table missing
══════════════════════════════════════════ */
function SetupScreen({ onRetry }: { onRetry: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(SETUP_SQL).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-start justify-center pt-10 px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4 flex gap-3">
          <span className="material-symbols-outlined text-amber-500 text-2xl shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          <div>
            <p className="font-headline font-black text-amber-900 text-sm">Base de données non configurée</p>
            <p className="text-sm text-amber-700 mt-1">
              La table "opérations" n'existe pas encore dans Supabase. Suis les 3 étapes ci-dessous pour l'activer en 2 minutes.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5">
          <p className="font-headline font-black text-gray-900 text-base">Configuration — 3 étapes</p>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-[12px] font-black shrink-0 mt-0.5">1</div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Ouvre le tableau de bord Supabase</p>
                <p className="text-[12px] text-gray-500 mt-0.5">Va sur <strong>supabase.com</strong> → ton projet → <strong>SQL Editor</strong></p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-[12px] font-black shrink-0 mt-0.5">2</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm mb-2">Copie ce SQL et colle-le dans l'éditeur</p>
                <div className="bg-gray-900 rounded-xl p-3 relative">
                  <pre className="text-[10px] text-gray-300 overflow-x-auto leading-relaxed" style={{ maxHeight: 180 }}>
                    {SETUP_SQL.slice(0, 400)}…
                  </pre>
                  <button onClick={copy}
                    className={`absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      copied ? "bg-emerald-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                    }`}>
                    <span className="material-symbols-outlined text-[13px]">{copied ? "check" : "content_copy"}</span>
                    {copied ? "Copié !" : "Copier le SQL"}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-[12px] font-black shrink-0 mt-0.5">3</div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Clique sur "Run" dans Supabase, puis</p>
                <button onClick={onRetry}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-[13px] font-bold hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined text-[15px]">refresh</span>
                  Actualiser la page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════ */
function GestionDashboard() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [tableError, setTableError] = useState(false);
  const [showForm,   setShowForm]   = useState(false);
  const [editOp,     setEditOp]     = useState<Operation | null>(null);
  const [form,       setForm]       = useState({ ...EMPTY_FORM });
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState<string | null>(null);
  const [capital,    setCapital]    = useState<number>(() => {
    const s = localStorage.getItem(CAPITAL_KEY);
    return s ? parseInt(s) : DEFAULT_CAPITAL;
  });
  const [editCapital, setEditCapital] = useState(false);
  const [tempCapital, setTempCapital] = useState("");

  const fetchOps = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("operations")
      .select("*")
      .order("operation_number", { ascending: true, nullsFirst: false });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("does not exist") || msg.includes("relation") || msg.includes("42p01")) {
        setTableError(true);
      } else {
        toast.error("Erreur: " + error.message);
      }
      setLoading(false);
      return;
    }
    setTableError(false);
    if (data) setOperations(data as Operation[]);
    setLoading(false);
  };

  useEffect(() => { fetchOps(); }, []);

  /* ── Auto-calculate profit (when not manual) ── */
  useEffect(() => {
    if (!form.manual_profit) {
      const profit =
        (parseInt(form.total_sale)       || 0) -
        (parseInt(form.purchase_amount)  || 0) -
        (parseInt(form.transport_amount) || 0);
      setForm(f => ({ ...f, net_profit: profit.toString() }));
    }
  }, [form.total_sale, form.purchase_amount, form.transport_amount, form.manual_profit]);

  /* ── Auto-calculate to_collect ── */
  useEffect(() => {
    const toCollect = Math.max(
      0,
      (parseInt(form.total_sale)       || 0) -
      (parseInt(form.collected_amount) || 0)
    );
    setForm(f => ({ ...f, to_collect_amount: toCollect.toString() }));
  }, [form.total_sale, form.collected_amount]);

  if (tableError) return <SetupScreen onRetry={fetchOps} />;

  /* ── CRUD ── */
  const handleSave = async () => {
    if (!form.product_name.trim()) { toast.error("Le nom du produit est requis"); return; }
    if (form.purchase_amount === "") { toast.error("Montant d'achat requis"); return; }

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
    const { error } = editOp
      ? await supabase.from("operations").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editOp.id)
      : await supabase.from("operations").insert(payload);
    setSaving(false);

    if (error) { toast.error("Erreur: " + error.message); return; }
    toast.success(editOp ? "Opération modifiée ✓" : "Opération ajoutée ✓");
    resetForm();
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
    else toast.error("Erreur: " + error.message);
    setDeleting(null);
  };

  const resetForm = () => { setForm({ ...EMPTY_FORM }); setShowForm(false); setEditOp(null); };
  const saveCapital = (val: number) => {
    setCapital(val); localStorage.setItem(CAPITAL_KEY, val.toString()); setEditCapital(false);
  };

  /* ── Totals ── */
  const T = useMemo(() => ({
    benefice:   operations.reduce((s, o) => s + o.net_profit, 0),
    encaisser:  operations.reduce((s, o) => s + o.to_collect_amount, 0),
    achats:     operations.reduce((s, o) => s + o.purchase_amount + o.transport_amount, 0),
    ventes:     operations.reduce((s, o) => s + o.total_sale, 0),
    encaisse:   operations.reduce((s, o) => s + o.collected_amount, 0),
  }), [operations]);

  const capitalActuel = capital + T.benefice;

  /* ── Form preview ── */
  const previewProfit = form.manual_profit
    ? (parseInt(form.net_profit) || 0)
    : (parseInt(form.total_sale) || 0) - (parseInt(form.purchase_amount) || 0) - (parseInt(form.transport_amount) || 0);
  const previewToCollect = Math.max(0, (parseInt(form.total_sale) || 0) - (parseInt(form.collected_amount) || 0));

  /* ════════════════════════════════
     RENDER
  ════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#F0F2F5]">

      {/* ─── Header ─── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <div>
            <p className="font-headline font-black text-gray-900 text-[13px] leading-none">Mamakaasa</p>
            <p className="font-body text-[9px] text-gray-400 mt-0.5">Gestion des Opérations</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => { if (showForm && !editOp) { resetForm(); } else { setEditOp(null); setForm({ ...EMPTY_FORM }); setShowForm(true); } }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-[13px] font-semibold hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-[15px]">{showForm && !editOp ? "close" : "add"}</span>
              <span className="hidden sm:inline">{showForm && !editOp ? "Fermer" : "Nouvelle opération"}</span>
            </button>
            <Link to="/" className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined text-[17px]">home</span>
            </Link>
            <button onClick={() => { sessionStorage.removeItem(SESSION_KEY); window.location.reload(); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors" title="Déconnexion">
              <span className="material-symbols-outlined text-[17px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5 space-y-4">

        {/* ─── KPI Grid ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Bénéfice net réalisé", value: fp(T.benefice),  icon: "trending_up",            color: "#10b981", bg: "#ecfdf5", textColor: "text-emerald-600" },
            { label: "Capital actuel",        value: fp(capitalActuel), icon: "account_balance_wallet", color: "#3b82f6", bg: "#eff6ff", textColor: "text-gray-900" },
            { label: "À encaisser",           value: fp(T.encaisser), icon: "hourglass_empty",         color: "#f59e0b", bg: "#fffbeb", textColor: T.encaisser > 0 ? "text-amber-600" : "text-gray-900" },
            { label: "Opérations",            value: operations.length, icon: "list_alt",              color: "#6b7280", bg: "#f9fafb", textColor: "text-gray-900" },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] leading-tight">{k.label}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: k.bg }}>
                  <span className="material-symbols-outlined text-[15px]" style={{ color: k.color, fontVariationSettings: "'FILL' 1" }}>{k.icon}</span>
                </div>
              </div>
              <p className={`font-headline font-black text-xl ${k.textColor}`}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* ─── Capital Banner ─── */}
        <div className="bg-gray-900 rounded-xl p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[9.5px] font-semibold text-gray-500 uppercase tracking-[0.16em] mb-1">Capital de départ</p>
              {editCapital ? (
                <div className="flex items-center gap-2">
                  <input type="number" value={tempCapital} onChange={e => setTempCapital(e.target.value)} autoFocus
                    onKeyDown={e => { if (e.key === "Enter") saveCapital(parseInt(tempCapital) || DEFAULT_CAPITAL); if (e.key === "Escape") setEditCapital(false); }}
                    className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-base font-bold outline-none w-48 focus:border-white/40" />
                  <button onClick={() => saveCapital(parseInt(tempCapital) || DEFAULT_CAPITAL)}
                    className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-[12px] font-bold hover:bg-emerald-400 transition-colors">Sauver</button>
                  <button onClick={() => setEditCapital(false)}
                    className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20">✕</button>
                </div>
              ) : (
                <button onClick={() => { setTempCapital(capital.toString()); setEditCapital(true); }}
                  className="flex items-center gap-2 group">
                  <p className="font-headline font-black text-2xl text-white">{fp(capital)}</p>
                  <span className="material-symbols-outlined text-[13px] text-gray-600 group-hover:text-gray-400 transition-colors">edit</span>
                </button>
              )}
            </div>
            <div className="text-right">
              <p className="text-[9.5px] font-semibold text-gray-500 uppercase tracking-[0.16em] mb-1">Capital + Bénéfices</p>
              <p className="font-headline font-black text-2xl text-emerald-400">{fp(capitalActuel)}</p>
              <p className="text-[11px] text-gray-600 mt-0.5">{fp(capital)} + {fpc(T.benefice)}</p>
            </div>
          </div>
        </div>

        {/* ─── Add / Edit Form ─── */}
        <AnimatePresence>
          {showForm && (
            <motion.div key="form" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden">

              {/* Form header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-headline font-black text-gray-900 text-sm">
                    {editOp ? `Modifier — Opération N°${editOp.operation_number ?? "?"}` : "Nouvelle opération commerciale"}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Remplis les champs ci-dessous</p>
                </div>
                {/* Live preview badge */}
                {(parseInt(form.purchase_amount) > 0 || parseInt(form.total_sale) > 0) && (
                  <div className={`px-3 py-1.5 rounded-xl text-[12px] font-black ${previewProfit >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                    {previewProfit >= 0 ? "+" : ""}{fpc(previewProfit)}
                  </div>
                )}
              </div>

              <div className="p-5 space-y-5">

                {/* ── Section 1 : Identification ── */}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Identification</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">N° Opération</label>
                      <input type="number" value={form.operation_number} onChange={e => setForm(f => ({ ...f, operation_number: e.target.value }))}
                        placeholder="5" min="1"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Produit *</label>
                      <input value={form.product_name} onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))}
                        placeholder="Ex: Mangue, Oignons, Madd…"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Date</label>
                      <input type="date" value={form.operation_date} onChange={e => setForm(f => ({ ...f, operation_date: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Icône du produit</label>
                      <div className="flex gap-1.5 flex-wrap p-2 bg-gray-50 rounded-xl border border-gray-200">
                        {EMOJIS.map(e => (
                          <button key={e} onClick={() => setForm(f => ({ ...f, product_emoji: e }))}
                            className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${form.product_emoji === e ? "bg-gray-900 scale-105 shadow-sm" : "hover:bg-gray-200"}`}>
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-rows-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Lieu d'approvisionnement</label>
                        <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                          placeholder="Ex: DIOUROU, Marché Thiès…"
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Quantité</label>
                        <div className="flex">
                          <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                            placeholder="300" min="0"
                            className="flex-1 w-0 px-3 py-2.5 rounded-l-xl border border-r-0 border-gray-200 text-[13px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-900/10" />
                          <select value={form.quantity_unit} onChange={e => setForm(f => ({ ...f, quantity_unit: e.target.value }))}
                            className="px-2 py-2.5 rounded-r-xl border border-gray-200 text-[12px] bg-gray-50 outline-none font-medium text-gray-600">
                            {UNITS.map(u => <option key={u}>{u}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section 2 : Coûts ── */}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Coûts d'achat</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-red-50 rounded-xl p-3">
                      <label className="block text-[11px] font-semibold text-red-600 mb-1.5">
                        <span className="material-symbols-outlined text-[13px] align-middle mr-1">shopping_bag</span>
                        Montant achat (FCFA) *
                      </label>
                      <input type="number" value={form.purchase_amount} onChange={e => setForm(f => ({ ...f, purchase_amount: e.target.value }))}
                        placeholder="Ex: 48 000" min="0"
                        className="w-full px-3 py-2.5 rounded-xl border border-red-200 text-[14px] font-bold bg-white outline-none focus:ring-2 focus:ring-red-200" />
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3">
                      <label className="block text-[11px] font-semibold text-amber-600 mb-1.5">
                        <span className="material-symbols-outlined text-[13px] align-middle mr-1">local_shipping</span>
                        Transport (FCFA)
                      </label>
                      <input type="number" value={form.transport_amount} onChange={e => setForm(f => ({ ...f, transport_amount: e.target.value }))}
                        placeholder="Ex: 22 000" min="0"
                        className="w-full px-3 py-2.5 rounded-xl border border-amber-200 text-[14px] font-bold bg-white outline-none focus:ring-2 focus:ring-amber-200" />
                    </div>
                  </div>
                  {(parseInt(form.purchase_amount) > 0 || parseInt(form.transport_amount) > 0) && (
                    <div className="mt-2 px-3 py-2 bg-gray-100 rounded-xl flex justify-between items-center">
                      <span className="text-[11px] text-gray-500">Coût total</span>
                      <span className="text-[13px] font-black text-gray-700">
                        {fpc((parseInt(form.purchase_amount) || 0) + (parseInt(form.transport_amount) || 0))}
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Section 3 : Vente & Encaissement ── */}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Vente & Encaissement</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-blue-50 rounded-xl p-3">
                      <label className="block text-[11px] font-semibold text-blue-700 mb-1.5">
                        <span className="material-symbols-outlined text-[13px] align-middle mr-1">payments</span>
                        Total vente (FCFA)
                      </label>
                      <input type="number" value={form.total_sale} onChange={e => setForm(f => ({ ...f, total_sale: e.target.value }))}
                        placeholder="Ex: 90 000" min="0"
                        className="w-full px-3 py-2.5 rounded-xl border border-blue-200 text-[14px] font-bold bg-white outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3">
                      <label className="block text-[11px] font-semibold text-emerald-700 mb-1.5">
                        <span className="material-symbols-outlined text-[13px] align-middle mr-1">check_circle</span>
                        Déjà encaissé (FCFA)
                      </label>
                      <input type="number" value={form.collected_amount} onChange={e => setForm(f => ({ ...f, collected_amount: e.target.value }))}
                        placeholder="Ex: 90 000" min="0"
                        className="w-full px-3 py-2.5 rounded-xl border border-emerald-200 text-[14px] font-bold bg-white outline-none focus:ring-2 focus:ring-emerald-200" />
                    </div>
                    <div className={`rounded-xl p-3 ${previewToCollect > 0 ? "bg-orange-50" : "bg-gray-50"}`}>
                      <label className={`block text-[11px] font-semibold mb-1.5 ${previewToCollect > 0 ? "text-orange-600" : "text-gray-500"}`}>
                        <span className="material-symbols-outlined text-[13px] align-middle mr-1">hourglass_empty</span>
                        Reste à encaisser
                      </label>
                      <p className={`px-3 py-2.5 rounded-xl text-[14px] font-black ${previewToCollect > 0 ? "text-orange-700" : "text-gray-500"}`}>
                        {fpc(previewToCollect)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Section 4 : Bénéfice + Notes ── */}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Résultat & Notes</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className={`rounded-xl p-3 ${previewProfit >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
                      <label className={`flex items-center gap-2 text-[11px] font-semibold mb-1.5 ${previewProfit >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                        <span className="material-symbols-outlined text-[13px]">trending_up</span>
                        Bénéfice net (FCFA)
                        <button
                          onClick={() => setForm(f => ({ ...f, manual_profit: !f.manual_profit }))}
                          className={`ml-auto text-[9.5px] px-2 py-0.5 rounded-full font-black transition-colors ${form.manual_profit ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-600"}`}>
                          {form.manual_profit ? "MANUEL" : "AUTO"}
                        </button>
                      </label>
                      <input
                        type="number"
                        value={form.net_profit}
                        onChange={e => setForm(f => ({ ...f, net_profit: e.target.value, manual_profit: true }))}
                        className={`w-full px-3 py-2.5 rounded-xl border text-[16px] font-black outline-none focus:ring-2 ${
                          previewProfit >= 0
                            ? "border-emerald-200 text-emerald-700 bg-white focus:ring-emerald-200"
                            : "border-red-200 text-red-600 bg-white focus:ring-red-200"
                        } ${!form.manual_profit ? "cursor-default opacity-80" : ""}`}
                        readOnly={!form.manual_profit}
                      />
                      {!form.manual_profit && (
                        <p className="text-[10px] text-gray-400 mt-1">Calculé : vente − achat − transport</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">
                        <span className="material-symbols-outlined text-[13px] align-middle mr-1">notes</span>
                        Notes & détails de l'opération
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        placeholder="Ex: 9 sacs × 22 000 FCFA &#10;270 FCFA/kg → 38 800 FCFA&#10;Reste à encaisser : Modou (10 000), Fatou (12 000)…"
                        rows={4}
                        maxLength={600}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[12.5px] bg-gray-50 outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1 border-t border-gray-100">
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white text-[13px] font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
                    <span className="material-symbols-outlined text-[16px]">{saving ? "hourglass_empty" : editOp ? "save" : "add_circle"}</span>
                    {saving ? "Enregistrement…" : editOp ? "Enregistrer les modifications" : "Ajouter l'opération"}
                  </button>
                  <button onClick={resetForm}
                    className="px-5 py-3 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Operations ─── */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <span className="material-symbols-outlined text-3xl text-gray-300 block mb-2 animate-spin">refresh</span>
              <p className="text-sm text-gray-400">Chargement…</p>
            </div>
          ) : operations.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">list_alt</span>
              <p className="font-headline font-black text-gray-700 text-sm">Aucune opération enregistrée</p>
              <p className="text-[12px] text-gray-400 mt-1 mb-4">Ajoute ta première opération commerciale</p>
              <button onClick={() => { setForm({ ...EMPTY_FORM }); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-[13px] font-bold hover:opacity-90 transition-opacity">
                + Nouvelle opération
              </button>
            </div>
          ) : (
            operations.map(op => (
              <OperationCard key={op.id} op={op} onEdit={handleEdit} onDelete={handleDelete} deleting={deleting} />
            ))
          )}
        </div>

        {/* ─── Summary ─── */}
        {operations.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-4 sm:p-5">
            <p className="text-[9.5px] font-semibold text-gray-500 uppercase tracking-[0.16em] mb-3">
              Récapitulatif — {operations.length} opération{operations.length > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Total achats & transport", value: fp(T.achats),   color: "text-red-400" },
                { label: "Total ventes",             value: fp(T.ventes),   color: "text-white" },
                { label: "Encaissé",                 value: fp(T.encaisse), color: "text-sky-400" },
                { label: "À encaisser",              value: fp(T.encaisser),color: "text-amber-400" },
              ].map(k => (
                <div key={k.label}>
                  <p className="text-[10px] text-gray-500 mb-0.5">{k.label}</p>
                  <p className={`font-headline font-black text-base ${k.color}`}>{k.value}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] text-gray-500 mb-0.5">Capital de départ</p>
                <p className="font-headline font-black text-xl text-white">{fp(capital)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 mb-0.5">🎯 Bénéfice total net réalisé</p>
                <p className={`font-headline font-black text-3xl ${T.benefice >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {T.benefice >= 0 ? "+" : ""}{fp(T.benefice)}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════
   OPERATION CARD
══════════════════════════════════════════ */
function OperationCard({ op, onEdit, onDelete, deleting }: {
  op: Operation;
  onEdit: (o: Operation) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
}) {
  const [expanded, setExpanded] = useState(true);
  const isPartial   = op.to_collect_amount > 0;
  const costTotal   = op.purchase_amount + op.transport_amount;
  const profitColor = op.net_profit >= 0 ? "text-emerald-600" : "text-red-500";

  return (
    <div className={`bg-white rounded-xl border overflow-hidden ${isPartial ? "border-amber-300" : "border-gray-200"}`}>

      {/* ── Header row ── */}
      <div className="p-4 cursor-pointer select-none" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${isPartial ? "bg-amber-50" : "bg-gray-100"}`}>
            {op.product_emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              {op.operation_number != null && (
                <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  #{op.operation_number}
                </span>
              )}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPartial ? "bg-amber-100 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                {isPartial ? "⏳ En cours" : "✅ Clôturé"}
              </span>
            </div>
            <p className="font-headline font-black text-[15px] text-gray-900">{op.product_emoji} {op.product_name}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
              {op.location       && <span className="text-[11px] text-gray-400">📍 {op.location}</span>}
              {op.operation_date && <span className="text-[11px] text-gray-400">🗓️ {fd(op.operation_date)}</span>}
              {op.quantity       && <span className="text-[11px] text-gray-400">⚖️ {op.quantity} {op.quantity_unit}</span>}
            </div>
          </div>
          <div className="text-right shrink-0 mr-1">
            <p className="text-[10px] text-gray-400 mb-0.5">Bénéfice net</p>
            <p className={`font-headline font-black text-xl ${profitColor}`}>
              {op.net_profit >= 0 ? "+" : ""}{op.net_profit.toLocaleString("fr-FR")} F
            </p>
          </div>
          <span className={`material-symbols-outlined text-gray-300 text-[20px] shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </div>
      </div>

      {/* ── Detail ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">

              {/* Cost/sale grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Achat",       value: op.purchase_amount,  color: "#ef4444", bg: "#fef2f2",  icon: "shopping_bag" },
                  { label: "Transport",   value: op.transport_amount, color: "#f59e0b", bg: "#fffbeb",  icon: "local_shipping" },
                  { label: "Coût total",  value: costTotal,           color: "#6b7280", bg: "#f9fafb",  icon: "calculate" },
                  { label: "Total vente", value: op.total_sale,       color: "#3b82f6", bg: "#eff6ff",  icon: "payments" },
                ].map(k => (
                  <div key={k.label} className="rounded-xl p-3" style={{ background: k.bg }}>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[12px]" style={{ color: k.color }}>{ k.icon }</span>
                      <p className="text-[10px] font-medium" style={{ color: k.color }}>{k.label}</p>
                    </div>
                    <p className="font-headline font-bold text-sm" style={{ color: k.color }}>
                      {k.value.toLocaleString("fr-FR")} F
                    </p>
                  </div>
                ))}
              </div>

              {/* Encaissement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <p className="text-[10.5px] text-emerald-600 font-semibold">✅ Encaissé</p>
                  <p className="font-headline font-black text-lg text-emerald-700 mt-0.5">
                    {op.collected_amount.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
                {op.to_collect_amount > 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-[10.5px] text-amber-600 font-semibold">⏳ Reste à encaisser</p>
                    <p className="font-headline font-black text-lg text-amber-700 mt-0.5">
                      {op.to_collect_amount.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10.5px] text-gray-400 font-semibold">Encaissement</p>
                    <p className="font-headline font-black text-lg text-gray-300 mt-0.5">Tout encaissé ✓</p>
                  </div>
                )}
              </div>

              {/* Bénéfice highlight */}
              <div className={`rounded-xl p-3 border ${op.net_profit >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                <p className={`text-[10.5px] font-semibold ${op.net_profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {op.net_profit >= 0 ? "✅ Bénéfice net" : "⚠️ Déficit"}
                </p>
                <p className={`font-headline font-black text-xl mt-0.5 ${profitColor}`}>
                  {op.net_profit >= 0 ? "+" : ""}{op.net_profit.toLocaleString("fr-FR")} FCFA
                </p>
              </div>

              {/* Notes */}
              {op.notes && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10.5px] text-gray-400 font-semibold mb-1.5">📝 Détails</p>
                  <p className="text-[12.5px] text-gray-600 whitespace-pre-wrap leading-relaxed">{op.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button onClick={() => onEdit(op)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  Modifier
                </button>
                <button onClick={() => onDelete(op.id)} disabled={deleting === op.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-100 text-[12px] font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
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
