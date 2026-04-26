import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";
import { MOCK_PRODUCTS } from "@/data/marketplaceMocks";

const ADMIN_EMAIL = "Mohalaval4@gmail.com";

type Order = {
  id: string; created_at: string; total: number; status: string;
  payment_method: string | null; payment_status: string;
  shipping_address: string | null; shipping_city: string | null;
  phone: string | null; buyer_id: string;
};
type OrderItem = { id: string; quantity: number; unit_price: number; products: { name: string; image_url: string | null } | null };
type Product = { id: string; name: string; price: number; unit: string; stock: number; description: string | null; image_url: string | null; category_id: string | null; is_active: boolean; created_at: string; categories: { name: string } | null };
type Category = { id: string; name: string; icon: string | null; created_at: string };
type Profile = { user_id: string; full_name: string | null; city: string | null; phone: string | null; created_at: string; role: string | null };
type Page = "overview" | "orders" | "products" | "categories" | "users" | "analytics";

const STATUS = {
  pending:   { label: "En attente",   icon: "schedule",        color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",   dot: "bg-amber-400",   bar: "bg-amber-400" },
  confirmed: { label: "Confirmée",    icon: "check_circle",    color: "text-sky-600",     bg: "bg-sky-50",     border: "border-sky-200",     dot: "bg-sky-500",     bar: "bg-sky-500" },
  preparing: { label: "En prépa.",    icon: "inventory_2",     color: "text-orange-600",  bg: "bg-orange-50",  border: "border-orange-200",  dot: "bg-orange-500",  bar: "bg-orange-500" },
  shipped:   { label: "En livraison", icon: "local_shipping",  color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200",    dot: "bg-blue-500",    bar: "bg-blue-500" },
  delivered: { label: "Livrée",       icon: "done_all",        color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", bar: "bg-emerald-500" },
  cancelled: { label: "Annulée",      icon: "cancel",          color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200",     dot: "bg-red-400",     bar: "bg-red-400" },
} as const;

const NAV_SECTIONS = [
  { label: "Menu", items: [
    { page: "overview" as Page,   icon: "space_dashboard", label: "Tableau de bord" },
    { page: "analytics" as Page,  icon: "bar_chart",       label: "Analytiques" },
  ]},
  { label: "Catalogue", items: [
    { page: "products" as Page,   icon: "storefront",      label: "Produits" },
    { page: "categories" as Page, icon: "category",        label: "Catégories" },
  ]},
  { label: "Gestion", items: [
    { page: "orders" as Page,     icon: "receipt_long",    label: "Commandes" },
    { page: "users" as Page,      icon: "group",           label: "Acheteurs" },
  ]},
];

const fp = (n: number) => n.toLocaleString("fr-FR") + " FCFA";
const fd = (s: string) => new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

/* ─── MAIN ─── */
export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  useEffect(() => { if (!loading && (!user || !isAdmin)) navigate("/"); }, [loading, user, isAdmin]);
  useEffect(() => {
    if (isAdmin) supabase.from("orders").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setOrders(data as Order[]); setLoadingOrders(false); });
  }, [isAdmin]);

  const stats = useMemo(() => ({
    total: orders.length,
    revenue: orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    pending: orders.filter(o => o.status === "pending").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    today: orders.filter(o => o.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10)).length,
  }), [orders]);

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#E8EAED]">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* ══════ SIDEBAR — floating card ══════ */}
      <aside className={`
        fixed z-50 flex flex-col bg-white transition-transform duration-300 ease-out
        top-0 left-0 bottom-0 w-[260px]
        lg:top-3 lg:left-3 lg:bottom-3 lg:w-[224px] lg:rounded-2xl lg:shadow-md lg:border lg:border-gray-100/80
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-gray-100 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <div className="min-w-0">
            <p className="font-headline font-black text-gray-900 text-[13px] leading-none">Agrumen</p>
            <p className="font-body text-[9px] text-gray-400 mt-0.5">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-gray-400 text-base">close</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5">
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              <p className="px-3 mb-1.5 font-body text-[9px] font-semibold text-gray-400 uppercase tracking-[0.15em]">{section.label}</p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const active = page === item.page;
                  return (
                    <button key={item.page} onClick={() => { setPage(item.page); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-headline text-[12.5px] font-semibold transition-all duration-150 ${
                        active ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                      }`}>
                      <span className="material-symbols-outlined text-[17px]" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.page === "orders" && stats.pending > 0 && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                          {stats.pending}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div>
            <p className="px-3 mb-1.5 font-body text-[9px] font-semibold text-gray-400 uppercase tracking-[0.15em]">Plateforme</p>
            <div className="space-y-0.5">
              {[
                { to: "/marche", icon: "storefront", label: "Voir le Marché" },
                { to: "/", icon: "home", label: "Accueil" },
              ].map(l => (
                <Link key={l.to} to={l.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-headline text-[12.5px] font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
                  <span className="material-symbols-outlined text-[17px]">{l.icon}</span>
                  {l.label}
                  <span className="material-symbols-outlined text-[10px] ml-auto text-gray-300">open_in_new</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="px-2.5 pb-4 shrink-0">
          <button onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-headline text-[12.5px] font-semibold text-red-500 hover:bg-red-50 transition-all w-full">
            <span className="material-symbols-outlined text-[17px]">logout</span>
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* ══════ MAIN AREA (header + content) ══════ */}
      <div className="lg:ml-[239px] flex flex-col min-h-screen p-3 gap-3">

        {/* ══════ HEADER — floating card ══════ */}
        <header className="sticky top-3 z-40 bg-white rounded-2xl shadow-sm border border-gray-100/80 flex items-center h-14 px-4 gap-3 shrink-0">

          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0">
            <span className="material-symbols-outlined text-gray-500 text-lg">menu</span>
          </button>

          <div className="flex-1 max-w-sm">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
              <input placeholder="Rechercher..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 border-none font-body text-sm outline-none focus:ring-2 focus:ring-gray-200 transition-all" />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <button onClick={() => setPage("orders")}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined text-gray-400 text-lg">notifications</span>
              {stats.pending > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center font-headline text-xs font-black text-white shrink-0">
                {(user.email || "A")[0].toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="font-headline text-[11px] font-bold text-gray-800 leading-none">Administrateur</p>
                <p className="font-body text-[10px] text-gray-400 mt-0.5 truncate max-w-[110px]">{user.email?.split("@")[0]}</p>
              </div>
            </div>
          </div>
        </header>

        {/* ══════ PAGE CONTENT ══════ */}
        <main className="flex-1 pb-6">
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
              {page === "overview"   && <OverviewPage stats={stats} orders={orders} loadingOrders={loadingOrders} setPage={setPage} />}
              {page === "orders"     && <OrdersPage orders={orders} setOrders={setOrders} loadingOrders={loadingOrders} />}
              {page === "products"   && <ProductsPage />}
              {page === "categories" && <CategoriesPage />}
              {page === "users"      && <UsersPage />}
              {page === "analytics"  && <AnalyticsPage orders={orders} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   OVERVIEW PAGE — Finexy style
══════════════════════════════════════════════ */
function OverviewPage({ stats, orders, loadingOrders, setPage }: { stats: any; orders: Order[]; loadingOrders: boolean; setPage: (p: Page) => void }) {

  const last7 = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const date = d.toISOString().slice(0, 10);
    return {
      label: d.toLocaleDateString("fr-FR", { weekday: "short" }),
      rev: orders.filter(o => o.created_at.slice(0, 10) === date && o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
      count: orders.filter(o => o.created_at.slice(0, 10) === date).length,
    };
  }), [orders]);

  const monthlyData = useMemo(() => Array.from({ length: 8 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (7 - i));
    const m = d.toISOString().slice(0, 7);
    return {
      label: d.toLocaleDateString("fr-FR", { month: "short" }),
      profit: orders.filter(o => o.created_at.slice(0, 7) === m && o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
      loss: orders.filter(o => o.created_at.slice(0, 7) === m && o.status === "cancelled").reduce((s, o) => s + o.total, 0),
    };
  }), [orders]);

  const prevMonth = useMemo(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    const m = d.toISOString().slice(0, 7);
    return {
      total: orders.filter(o => o.created_at.slice(0, 7) === m).length,
      revenue: orders.filter(o => o.created_at.slice(0, 7) === m && o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    };
  }, [orders]);

  const thisMonth = useMemo(() => {
    const m = new Date().toISOString().slice(0, 7);
    return {
      total: orders.filter(o => o.created_at.slice(0, 7) === m).length,
      revenue: orders.filter(o => o.created_at.slice(0, 7) === m && o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    };
  }, [orders]);

  const trend = (curr: number, prev: number) => {
    if (!prev) return null;
    const pct = Math.round(((curr - prev) / prev) * 100);
    return { pct, up: pct >= 0 };
  };

  const kpis = [
    { label: "Total Commandes",    value: stats.total,       prev: `Mois dernier : ${prevMonth.total}`,        icon: "shopping_cart",  trend: trend(thisMonth.total, prevMonth.total) },
    { label: "Nouveaux Acheteurs", value: "—",               prev: "Inscriptions ce mois",                     icon: "group",          trend: null },
    { label: "En attente",         value: stats.pending,     prev: "Commandes à traiter",                      icon: "schedule",       trend: null },
    { label: "Revenus Total",      value: fp(stats.revenue), prev: `Mois dernier : ${fp(prevMonth.revenue)}`,  icon: "payments",       trend: trend(thisMonth.revenue, prevMonth.revenue) },
  ];

  const maxRev = Math.max(...last7.map(d => d.rev), 1);
  const maxRevBar = Math.max(maxRev, 30000);
  const yLabels = ["30k", "25k", "20k", "15k", "10k", "5k", "0"];

  const maxBarIdx = last7.reduce((best, d, i) => d.rev > last7[best].rev ? i : best, 0);

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Vue d'ensemble</h1>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <span className="material-symbols-outlined text-gray-400 text-base">calendar_today</span>
          <span className="font-body text-sm text-gray-600 hidden sm:block">
            {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          <span className="material-symbols-outlined text-gray-400 text-base">expand_more</span>
        </div>
      </div>

      {/* KPI Cards — plain icon, no colored badge */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <p className="font-body text-sm text-gray-500">{k.label}</p>
              {/* Plain outline icon — no colored badge */}
              <span className="material-symbols-outlined text-gray-300 text-2xl">{k.icon}</span>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <p className="font-headline text-2xl md:text-3xl font-black text-gray-900 leading-none">{k.value}</p>
              {k.trend && (
                <span className={`inline-flex items-center gap-0.5 text-[11px] font-headline font-bold px-1.5 py-0.5 rounded-lg mb-0.5 ${k.trend.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                  {k.trend.up ? "↑" : "↓"} {Math.abs(k.trend.pct)}%
                </span>
              )}
            </div>
            <p className="font-body text-xs text-gray-400">{k.prev}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Revenue analytics — Finexy pill bar chart */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-base font-extrabold text-gray-900">Revenus analytiques</h2>
            <button className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-1.5 font-headline text-xs font-bold text-gray-600 hover:border-gray-300 transition-colors">
              Cette semaine
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>
          </div>

          {/* Y-axis + bars */}
          <div className="flex gap-3">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between shrink-0 pb-6" style={{ height: 180 }}>
              {yLabels.map(l => (
                <span key={l} className="font-body text-[9px] text-gray-300 leading-none text-right">{l}</span>
              ))}
            </div>

            {/* Bars */}
            <div className="flex-1 flex items-end gap-2 pb-6 relative" style={{ height: 180 }}>
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 pb-6 flex flex-col justify-between pointer-events-none">
                {yLabels.map((_, i) => (
                  <div key={i} className="w-full h-px bg-gray-100" />
                ))}
              </div>

              {last7.map((d, i) => {
                const pct = d.rev / maxRevBar;
                const height = Math.max(pct * 130, d.rev > 0 ? 14 : 5);
                const isHighest = i === maxBarIdx && d.rev > 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                    {/* Tooltip above highest bar */}
                    {isHighest && (
                      <div className="absolute z-20" style={{ bottom: `${height + 14}px` }}>
                        <div className="bg-gray-900 text-white text-[10px] font-headline font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg relative">
                          {d.rev >= 1000 ? `${(d.rev / 1000).toFixed(0)}k` : d.rev} FCFA
                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                            style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #111827" }} />
                        </div>
                      </div>
                    )}

                    {/* Bar */}
                    <div className="w-full flex items-end justify-center" style={{ height: 130 }}>
                      <div
                        className="relative w-full max-w-[44px] rounded-full overflow-hidden group-hover:opacity-80 transition-opacity cursor-pointer"
                        style={{ height: `${height}px` }}>
                        <div className="absolute inset-0 bg-gray-900" />
                        <div className="absolute inset-0" style={{
                          backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.18) 4px, rgba(255,255,255,0.18) 8px)"
                        }} />
                      </div>
                    </div>
                    <span className="font-body text-[10px] text-gray-400">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Total Income panel */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-headline text-base font-extrabold text-gray-900 mb-0.5">Revenu total</h2>
          <p className="font-body text-xs text-gray-400 mb-4">Évolution du chiffre d'affaires sur 8 mois</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
              <span className="font-body text-xs text-gray-500">Revenus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              <span className="font-body text-xs text-gray-500">Annulés</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={monthlyData} barSize={9} barGap={2} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 11 }}
                formatter={(v: number, name: string) => [fp(v), name === "profit" ? "Revenus" : "Annulés"]}
              />
              <Bar dataKey="profit" fill="#111827" radius={[4, 4, 0, 0]} />
              <Bar dataKey="loss" fill="#9ca3af" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders table — Finexy style with checkbox + Client */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-headline text-base font-extrabold text-gray-900">Commandes récentes</h2>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
              <input placeholder="Rechercher..." className="pl-9 pr-4 py-2 rounded-xl bg-gray-100 border-none font-body text-xs outline-none w-36 focus:w-48 transition-all" />
            </div>
            <button onClick={() => setPage("orders")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 font-headline text-xs font-bold text-gray-500 hover:border-gray-300 transition-colors">
              <span className="material-symbols-outlined text-sm">swap_vert</span>
              Trier par
            </button>
          </div>
        </div>

        {loadingOrders ? (
          <div className="p-5 space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : orders.length === 0 ? (
          <div className="py-14 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-200 block mb-2">inbox</span>
            <p className="font-body text-sm text-gray-400">Aucune commande</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 w-10">
                  <input type="checkbox" className="rounded border-gray-300 w-3.5 h-3.5 cursor-pointer" />
                </th>
                <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400">N° Commande</th>
                <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden md:table-cell">Client</th>
                <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden lg:table-cell">Ville</th>
                <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400">Statut</th>
                <th className="text-right px-5 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 8).map(order => {
                const st = STATUS[order.status as keyof typeof STATUS] ?? STATUS.pending;
                return (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <input type="checkbox" className="rounded border-gray-300 w-3.5 h-3.5 cursor-pointer" />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-headline text-sm font-bold text-gray-800">#{order.id.slice(0, 8).toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="font-body text-sm text-gray-500">{fd(order.created_at)}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="font-body text-sm text-gray-500">{order.phone ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="font-body text-sm text-gray-500">{order.shipping_city ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center text-[10px] font-headline font-bold px-2.5 py-1 rounded-full border ${st.bg} ${st.color} ${st.border}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-headline text-sm font-black text-primary">{fp(order.total)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ORDERS PAGE
══════════════════════════════════════════════ */
function OrdersPage({ orders, setOrders, loadingOrders }: { orders: Order[]; setOrders: React.Dispatch<React.SetStateAction<Order[]>>; loadingOrders: boolean }) {
  const [selected, setSelected] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchItems = async (id: string) => {
    setLoadingItems(true);
    const { data } = await supabase.from("order_items").select("*, products(name, image_url)").eq("order_id", id);
    if (data) setOrderItems(data as OrderItem[]);
    setLoadingItems(false);
  };

  const selectOrder = (o: Order) => {
    if (selected?.id === o.id) { setSelected(null); setOrderItems([]); return; }
    setSelected(o); fetchItems(o.id);
  };

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) toast.error("Erreur mise à jour");
    else {
      toast.success("Statut mis à jour");
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      if (selected?.id === orderId) setSelected(p => p ? { ...p, status } : null);
    }
    setUpdatingId(null);
  };

  const filtered = orders.filter(o => {
    const ms = filter === "all" || o.status === filter;
    const mq = !search || o.id.toLowerCase().includes(search) || (o.phone || "").includes(search) || (o.shipping_city || "").toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-extrabold tracking-tight text-gray-900">Commandes</h1>
          <p className="font-body text-sm text-gray-400 mt-0.5">{orders.length} commande{orders.length !== 1 ? "s" : ""} au total</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ID, ville, téléphone..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        {[{ key: "all", label: "Toutes", count: orders.length }, ...Object.entries(STATUS).map(([k, v]) => ({ key: k, label: v.label, count: orders.filter(o => o.status === k).length }))].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-headline text-xs font-bold whitespace-nowrap transition-all ${
              filter === t.key ? "bg-gray-900 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
            }`}>
            {t.label}
            {t.count > 0 && <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${filter === t.key ? "bg-white/25" : "bg-gray-100 text-gray-400"}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-2">
          {loadingOrders ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-white border border-gray-100" />)
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">inbox</span>
              <p className="font-headline font-bold text-gray-400">Aucune commande</p>
            </div>
          ) : filtered.map(order => {
            const st = STATUS[order.status as keyof typeof STATUS] ?? STATUS.pending;
            const isSel = selected?.id === order.id;
            return (
              <button key={order.id} onClick={() => selectOrder(order)}
                className={`w-full text-left rounded-xl border bg-white p-4 transition-all hover:shadow-md ${isSel ? "border-gray-900 ring-2 ring-gray-900/10 shadow-md" : "border-gray-200 hover:border-gray-300"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${st.dot}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-headline text-sm font-black text-gray-800">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className={`text-[10px] font-bold font-headline border rounded-full px-2 py-0.5 ${st.bg} ${st.color} ${st.border}`}>{st.label}</span>
                    </div>
                    <p className="font-body text-xs text-gray-400 truncate">{order.shipping_city} · {order.phone} · {(order.payment_method || "").toUpperCase()}</p>
                    <p className="font-body text-[10px] text-gray-300">{fd(order.created_at)}</p>
                  </div>
                  <p className="font-headline text-base font-black text-primary shrink-0">{fp(order.total)}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="sticky top-24 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-headline text-sm font-extrabold text-gray-800">#{selected.id.slice(0, 8).toUpperCase()}</p>
                    <p className="font-body text-xs text-gray-400">{fd(selected.created_at)}</p>
                  </div>
                  <button onClick={() => { setSelected(null); setOrderItems([]); }} className="w-8 h-8 rounded-xl hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-gray-400 text-base">close</span>
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  {[
                    { icon: "location_on", label: "Adresse", value: `${selected.shipping_address ?? "—"}, ${selected.shipping_city ?? "—"}` },
                    { icon: "phone", label: "Téléphone", value: selected.phone ?? "—" },
                    { icon: "payments", label: "Paiement", value: `${(selected.payment_method ?? "—").toUpperCase()} · ${selected.payment_status}` },
                    { icon: "paid", label: "Total", value: fp(selected.total) },
                  ].map(row => (
                    <div key={row.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-500 text-[15px]">{row.icon}</span>
                      </div>
                      <div>
                        <p className="font-headline text-[9px] font-bold uppercase tracking-wider text-gray-400">{row.label}</p>
                        <p className="font-body text-sm text-gray-700">{row.value}</p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Articles</p>
                    {loadingItems ? (
                      <div className="space-y-2">{[1, 2].map(i => <div key={i} className="h-10 animate-pulse rounded-xl bg-gray-100" />)}</div>
                    ) : orderItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3 mb-2">
                        <img src={item.products?.image_url || "/placeholder.svg"} alt="" className="w-9 h-9 rounded-xl object-cover border border-gray-100" onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-headline text-xs font-semibold text-gray-700 truncate">{item.products?.name}</p>
                          <p className="font-body text-[10px] text-gray-400">{item.quantity} × {item.unit_price.toLocaleString("fr-FR")} FCFA</p>
                        </div>
                        <p className="font-headline text-xs font-bold text-gray-700">{fp(item.quantity * item.unit_price)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Changer le statut</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(STATUS).map(([key, val]) => (
                        <button key={key} disabled={selected.status === key || updatingId === selected.id}
                          onClick={() => updateStatus(selected.id, key)}
                          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 font-headline text-[11px] font-bold transition-all ${
                            selected.status === key ? `${val.bg} ${val.color} ${val.border}` : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 disabled:opacity-40"
                          }`}>
                          <span className="material-symbols-outlined text-[13px]">{updatingId === selected.id ? "progress_activity" : val.icon}</span>
                          {val.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-xl border border-dashed border-gray-200 py-20 text-center">
                <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">touch_app</span>
                <p className="font-headline font-bold text-gray-400">Sélectionne une commande</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PRODUCTS PAGE
══════════════════════════════════════════════ */
const UNITS = ["le kg", "la pièce", "la botte", "le litre", "le sachet", "la boîte", "le paquet", "les 100g"];
const EMPTY = { name: "", price: "", unit: "le kg", stock: "", description: "", image_url: "", category_id: "", is_active: true };

function ProductsPage() {
  const { user } = useAuth();
  const [shopId, setShopId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const imgRef = useRef<HTMLInputElement>(null);

  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]).then(([pr, cr]) => {
      if (pr.data) setDbProducts(pr.data as Product[]);
      if (cr.data) setCategories(cr.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user?.id) {
      supabase.from("shops").select("id").eq("seller_id", user.id).maybeSingle()
        .then(({ data }) => { if (data) setShopId(data.id); });
    }
  }, [user?.id]);

  const products = useMemo(() => {
    const dbIds = new Set(dbProducts.map(p => p.id));
    const mocks = MOCK_PRODUCTS.filter(m => !dbIds.has(m.id)).map(m => ({
      ...m,
      categories: m.categories ? { name: m.categories.name } : null,
    } as Product));
    return [...dbProducts, ...mocks];
  }, [dbProducts]);

  const isMock = (p: Product) => p.id.startsWith("m");

  const filtered = products.filter(p => (!search || p.name.toLowerCase().includes(search.toLowerCase())) && (catFilter === "all" || p.category_id === catFilter));

  const openAdd = () => { setForm({ ...EMPTY, category_id: categories[0]?.id || "" }); setEditProduct(null); setShowForm(true); };
  const openEdit = (p: Product) => { setForm({ name: p.name, price: String(p.price), unit: p.unit, stock: String(p.stock ?? ""), description: p.description || "", image_url: p.image_url || "", category_id: p.category_id || "", is_active: p.is_active }); setEditProduct(p); setShowForm(true); };
  const f = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const folder = shopId ?? user?.id ?? "admin";
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) {
      toast.error("Upload échoué : " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    f("image_url", data.publicUrl);
    toast.success("Image uploadée !");
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) { toast.error("Nom et prix requis"); return; }
    setSaving(true);
    const payload: any = { name: form.name.trim(), price: parseFloat(form.price), unit: form.unit, stock: parseInt(form.stock) || 0, description: form.description || null, image_url: form.image_url || null, category_id: form.category_id || null, is_active: form.is_active };
    if (editProduct) {
      const { error } = await supabase.from("products").update(payload).eq("id", editProduct.id);
      if (error) { toast.error("Erreur mise à jour"); }
      else { const cat = categories.find(c => c.id === form.category_id); setDbProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...payload, categories: cat ? { name: cat.name } : null } : p)); toast.success("Produit mis à jour !"); setShowForm(false); }
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select("*, categories(name)").single();
      if (error) { toast.error("Erreur création"); }
      else { setDbProducts(prev => [data as Product, ...prev]); toast.success("Produit créé !"); setShowForm(false); }
    }
    setSaving(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("products").update({ is_active: !current }).eq("id", id);
    setDbProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p));
    toast.success(current ? "Désactivé" : "Activé");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error("Erreur suppression"); }
    else { setDbProducts(prev => prev.filter(p => p.id !== id)); toast.success("Produit supprimé"); }
    setDeleteConfirm(null);
  };

  const Modal = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-headline text-base font-extrabold text-gray-900">{editProduct ? "Modifier le produit" : "Nouveau produit"}</h2>
            <p className="font-body text-xs text-gray-400">{editProduct ? "Modifier les informations" : "Remplissez les champs"}</p>
          </div>
          <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-gray-400 text-lg">close</span>
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Photo du produit</label>
            <div className="flex gap-4 items-start">
              <div onClick={() => imgRef.current?.click()} className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all overflow-hidden">
                {form.image_url ? <img src={form.image_url} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-3xl text-gray-300">add_photo_alternate</span>}
              </div>
              <div className="flex-1 space-y-2">
                <input type="text" placeholder="URL de l'image" value={form.image_url} onChange={e => f("image_url", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" />
                <button type="button" onClick={() => imgRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-gray-600 font-headline text-xs font-bold hover:bg-gray-200 disabled:opacity-50 transition-colors">
                  <span className="material-symbols-outlined text-sm">{uploading ? "progress_activity" : "upload"}</span>
                  {uploading ? "Upload..." : "Télécharger"}
                </button>
                <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
              </div>
            </div>
          </div>
          <div>
            <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Nom <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={e => f("name", e.target.value)} placeholder="Ex : Mangues Kent"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Prix FCFA *", key: "price", type: "number", placeholder: "1500" },
              { label: "Stock", key: "stock", type: "number", placeholder: "50" },
            ].map(field => (
              <div key={field.key}>
                <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{field.label}</label>
                <input type={field.type} value={(form as any)[field.key]} onChange={e => f(field.key, e.target.value)} placeholder={field.placeholder}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
            ))}
            <div>
              <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Unité</label>
              <div className="relative">
                <select value={form.unit} onChange={e => f("unit", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-body text-sm outline-none focus:border-primary transition-all">
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-gray-400">expand_more</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Catégorie</label>
            <div className="relative">
              <select value={form.category_id} onChange={e => f("category_id", e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-body text-sm outline-none focus:border-primary transition-all">
                <option value="">Aucune catégorie</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-gray-400">expand_more</span>
            </div>
          </div>
          <div>
            <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
            <textarea value={form.description} onChange={e => f("description", e.target.value)} rows={3} placeholder="Description du produit..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 resize-none transition-all" />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
            <div>
              <p className="font-headline text-sm font-bold text-gray-800">Produit visible</p>
              <p className="font-body text-xs text-gray-400">Affiché sur le Marché</p>
            </div>
            <button type="button" onClick={() => f("is_active", !form.is_active)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${form.is_active ? "bg-primary" : "bg-gray-300"}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200 ${form.is_active ? "left-7" : "left-1"}`} />
            </button>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-gray-200 font-headline text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">Annuler</button>
            <button onClick={handleSave} disabled={saving || !form.name || !form.price}
              className="flex-1 py-3 rounded-lg bg-gray-900 text-white font-headline text-sm font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
              {saving && <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>}
              {saving ? "Enregistrement..." : editProduct ? "Mettre à jour" : "Créer le produit"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const DeleteModal = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-6 w-80 text-center">
        <div className="w-14 h-14 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-red-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
        </div>
        <h3 className="font-headline font-extrabold text-base mb-1 text-gray-900">Supprimer ce produit ?</h3>
        <p className="font-body text-sm text-gray-400 mb-6">Cette action est irréversible.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 font-headline text-sm font-bold text-gray-500">Annuler</button>
          <button onClick={() => handleDelete(deleteConfirm!)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-headline text-sm font-bold hover:bg-red-600 transition-colors">Supprimer</button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-extrabold tracking-tight text-gray-900">Produits</h1>
          <p className="font-body text-sm text-gray-400 mt-0.5">{products.length} produit{products.length !== 1 ? "s" : ""} en catalogue</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-1">
            {(["grid", "table"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${view === v ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-600"}`}>
                <span className="material-symbols-outlined text-[17px]">{v === "grid" ? "grid_view" : "table_rows"}</span>
              </button>
            ))}
          </div>
          <button onClick={openAdd} className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2.5 rounded-lg font-headline text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span className="hidden sm:inline">Nouveau produit</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          <button onClick={() => setCatFilter("all")} className={`shrink-0 px-3.5 py-2 rounded-lg font-headline text-xs font-bold transition-all ${catFilter === "all" ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500"}`}>Tous</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setCatFilter(catFilter === c.id ? "all" : c.id)}
              className={`shrink-0 px-3.5 py-2 rounded-lg font-headline text-xs font-bold transition-all ${catFilter === c.id ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>{showForm && <Modal />}</AnimatePresence>
      <AnimatePresence>{deleteConfirm && <DeleteModal />}</AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-xl bg-white border border-gray-100" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">inventory_2</span>
          <p className="font-headline font-bold text-gray-400 mb-1">{search ? "Aucun résultat" : "Aucun produit"}</p>
          {!search && <button onClick={openAdd} className="mt-3 inline-flex items-center gap-1.5 bg-gray-900 text-white px-5 py-2.5 rounded-lg font-headline text-sm font-bold hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-base">add</span>Premier produit
          </button>}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(p => (
            <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:border-gray-300">
              <div className="relative aspect-square bg-gray-100">
                <img src={p.image_url || "/placeholder.svg"} alt={p.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!isMock(p) && <>
                    <button onClick={() => openEdit(p)} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-gray-700 text-base">edit</span>
                    </button>
                    <button onClick={() => setDeleteConfirm(p.id)} className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-white text-base">delete</span>
                    </button>
                  </>}
                </div>
                {isMock(p) && <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-[9px] font-headline font-bold px-2 py-0.5 rounded-lg">Démo</div>}
                {!isMock(p) && !p.is_active && <div className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-headline font-bold px-2 py-0.5 rounded-lg">Inactif</div>}
                {(p.stock ?? 0) === 0 && <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-headline font-bold px-2 py-0.5 rounded-lg">Rupture</div>}
              </div>
              <div className="p-3">
                <p className="font-headline text-[12px] font-bold text-gray-800 truncate">{p.name}</p>
                <p className="font-body text-[10px] text-gray-400 truncate">{p.categories?.name ?? "—"}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="font-headline text-sm font-extrabold text-gray-900">{p.price.toLocaleString("fr-FR")}<span className="text-[9px] text-gray-400 font-normal ml-0.5">FCFA</span></p>
                  {isMock(p) ? (
                    <span className="text-[9px] font-headline font-bold px-2 py-0.5 rounded-lg border bg-gray-50 text-gray-400 border-gray-200">Démo</span>
                  ) : (
                    <button onClick={() => toggleActive(p.id, p.is_active)}
                      className={`text-[9px] font-headline font-bold px-2 py-0.5 rounded-lg border ${p.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-400 border-gray-200"}`}>
                      {p.is_active ? "Actif" : "Off"}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${(p.stock ?? 0) === 0 ? "bg-red-400" : (p.stock ?? 0) < 10 ? "bg-amber-400" : "bg-emerald-400"}`}
                      style={{ width: `${Math.min(((p.stock ?? 0) / 100) * 100, 100)}%` }} />
                  </div>
                  <span className="font-body text-[9px] text-gray-400">{p.stock ?? 0}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Produit", "Catégorie", "Prix", "Stock", "Statut", ""].map((h, i) => (
                  <th key={i} className={`text-left px-${i === 0 ? 5 : 4} py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 ${i === 1 ? "hidden md:table-cell" : ""} ${i === 3 ? "hidden sm:table-cell" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.image_url || "/placeholder.svg"} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-gray-100" onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                      <span className="font-headline text-sm font-semibold text-gray-800 truncate max-w-[140px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell"><span className="font-body text-xs text-gray-400">{p.categories?.name ?? "—"}</span></td>
                  <td className="px-4 py-3.5"><span className="font-headline text-sm font-bold text-gray-800">{p.price.toLocaleString("fr-FR")}</span><span className="block font-body text-[10px] text-gray-400">{p.unit}</span></td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 font-headline text-[10px] font-bold border ${(p.stock ?? 0) === 0 ? "bg-red-50 text-red-600 border-red-100" : (p.stock ?? 0) < 10 ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}>{p.stock ?? 0}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    {isMock(p) ? (
                      <span className="rounded-lg px-2.5 py-1 font-headline text-[10px] font-bold border bg-gray-50 text-gray-400 border-gray-100">Démo</span>
                    ) : (
                      <button onClick={() => toggleActive(p.id, p.is_active)} className={`rounded-lg px-2.5 py-1 font-headline text-[10px] font-bold border transition-all ${p.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-gray-50 text-gray-400 border-gray-100"}`}>{p.is_active ? "Actif" : "Inactif"}</button>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {!isMock(p) && (
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"><span className="material-symbols-outlined text-[15px]">edit</span></button>
                        <button onClick={() => setDeleteConfirm(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[15px]">delete</span></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   CATEGORIES PAGE
══════════════════════════════════════════════ */
const ICONS = ["park", "nutrition", "grain", "compost", "local_fire_department", "eco", "spa", "grass", "water_drop", "forest", "agriculture", "set_meal", "breakfast_dining", "grocery"];

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", icon: "eco" });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { supabase.from("categories").select("*").order("name").then(({ data }) => { if (data) setCategories(data); setLoading(false); }); }, []);

  const openAdd = () => { setForm({ name: "", icon: "eco" }); setEditCat(null); setShowForm(true); };
  const openEdit = (c: Category) => { setForm({ name: c.name, icon: c.icon || "eco" }); setEditCat(c); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Nom requis"); return; }
    setSaving(true);
    const payload = { name: form.name.trim(), icon: form.icon };
    if (editCat) {
      const { error } = await supabase.from("categories").update(payload).eq("id", editCat.id);
      if (error) toast.error("Erreur"); else { setCategories(prev => prev.map(c => c.id === editCat.id ? { ...c, ...payload } : c)); toast.success("Catégorie mise à jour !"); setShowForm(false); }
    } else {
      const { data, error } = await supabase.from("categories").insert(payload).select().single();
      if (error) toast.error("Erreur"); else { setCategories(prev => [...prev, data]); toast.success("Catégorie créée !"); setShowForm(false); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error("Erreur — des produits utilisent cette catégorie"); else { setCategories(prev => prev.filter(c => c.id !== id)); toast.success("Supprimée"); }
    setDeleteConfirm(null);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-extrabold tracking-tight text-gray-900">Catégories</h1>
          <p className="font-body text-sm text-gray-400 mt-0.5">{categories.length} catégorie{categories.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2.5 rounded-lg font-headline text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[17px]">add</span>
          Nouvelle catégorie
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()} className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-headline text-base font-extrabold text-gray-900">{editCat ? "Modifier" : "Nouvelle catégorie"}</h2>
                <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center"><span className="material-symbols-outlined text-gray-400 text-lg">close</span></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Nom <span className="text-red-500">*</span></label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex : Légumes racines"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
                <div>
                  <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Icône</label>
                  <div className="grid grid-cols-7 gap-1.5 mb-3">
                    {ICONS.map(ic => (
                      <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${form.icon === ic ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                        <span className="material-symbols-outlined text-lg" style={form.icon === ic ? { fontVariationSettings: "'FILL' 1" } : {}}>{ic}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <span className="material-symbols-outlined text-gray-700 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{form.icon || "category"}</span>
                  <p className="font-headline text-sm font-bold text-gray-700">{form.name || "Aperçu"}</p>
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-gray-200 font-headline text-sm font-bold text-gray-500 hover:bg-gray-50">Annuler</button>
                  <button onClick={handleSave} disabled={saving || !form.name}
                    className="flex-1 py-3 rounded-lg bg-gray-900 text-white font-headline text-sm font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                    {saving && <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>}
                    {editCat ? "Mettre à jour" : "Créer"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl p-6 w-80 text-center">
              <div className="w-14 h-14 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
              </div>
              <h3 className="font-headline font-extrabold text-base mb-1 text-gray-900">Supprimer ?</h3>
              <p className="font-body text-sm text-gray-400 mb-6">Les produits liés ne seront pas affectés.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 font-headline text-sm font-bold text-gray-500">Annuler</button>
                <button onClick={() => handleDelete(deleteConfirm!)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-headline text-sm font-bold hover:bg-red-600">Supprimer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-white border border-gray-100" />)}</div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">category</span>
          <p className="font-headline font-bold text-gray-400 mb-3">Aucune catégorie</p>
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-5 py-2.5 rounded-lg font-headline text-sm font-bold hover:bg-gray-800 transition-colors"><span className="material-symbols-outlined text-base">add</span>Créer</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map(cat => (
            <motion.div key={cat.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="group bg-white rounded-xl border border-gray-200 p-5 flex flex-col items-center gap-3 hover:shadow-md hover:border-gray-300 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/8 flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-700 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon || "category"}</span>
              </div>
              <p className="font-headline text-sm font-extrabold text-gray-800 text-center">{cat.name}</p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(cat)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-white transition-all"><span className="material-symbols-outlined text-[14px]">edit</span></button>
                <button onClick={() => setDeleteConfirm(cat.id)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white transition-all"><span className="material-symbols-outlined text-[14px]">delete</span></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   USERS PAGE
══════════════════════════════════════════════ */
function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const colors = ["bg-sky-100 text-sky-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700", "bg-orange-100 text-orange-700"];

  useEffect(() => { supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setUsers(data as Profile[]); setLoading(false); }); }, []);

  const filtered = users.filter(u => !search || (u.full_name || "").toLowerCase().includes(search.toLowerCase()) || (u.city || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-extrabold tracking-tight text-gray-900">Acheteurs</h1>
          <p className="font-body text-sm text-gray-400 mt-0.5">{users.length} compte{users.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="relative max-w-sm mb-5">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, ville..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400">Acheteur</th>
              <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:table-cell">Ville</th>
              <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden md:table-cell">Téléphone</th>
              <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400">Inscrit le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={4} className="px-5 py-3.5"><div className="h-10 animate-pulse rounded-xl bg-gray-100" /></td></tr>)
            : filtered.length === 0 ? <tr><td colSpan={4} className="py-16 text-center"><span className="material-symbols-outlined text-4xl text-gray-200 block mb-2">group</span><p className="font-headline font-bold text-gray-400">Aucun acheteur</p></td></tr>
            : filtered.map(u => (
              <tr key={u.user_id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-headline text-sm font-black shrink-0 ${colors[u.user_id.charCodeAt(0) % colors.length]}`}>
                      {(u.full_name || "?")[0].toUpperCase()}
                    </div>
                    <p className="font-headline text-sm font-semibold text-gray-800">{u.full_name || "Sans nom"}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell"><span className="font-body text-sm text-gray-500">{u.city ?? "—"}</span></td>
                <td className="px-4 py-3.5 hidden md:table-cell"><span className="font-body text-sm text-gray-500">{u.phone ?? "—"}</span></td>
                <td className="px-4 py-3.5"><span className="font-body text-xs text-gray-400">{u.created_at ? fd(u.created_at) : "—"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ANALYTICS PAGE
══════════════════════════════════════════════ */
function AnalyticsPage({ orders }: { orders: Order[] }) {
  const last30 = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    const date = d.toISOString().slice(0, 10);
    return {
      label: i % 5 === 0 ? d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "",
      rev: orders.filter(o => o.created_at.slice(0, 10) === date && o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
      count: orders.filter(o => o.created_at.slice(0, 10) === date).length,
    };
  }), [orders]);

  const last7 = last30.slice(-7);
  const active = orders.filter(o => o.status !== "cancelled");
  const avgOrder = active.length ? Math.round(active.reduce((s, o) => s + o.total, 0) / active.length) : 0;
  const deliveryRate = orders.length ? Math.round(orders.filter(o => o.status === "delivered").length / orders.length * 100) : 0;
  const cancelRate = orders.length ? Math.round(orders.filter(o => o.status === "cancelled").length / orders.length * 100) : 0;

  const byCity = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach(o => { if (o.shipping_city) map.set(o.shipping_city, (map.get(o.shipping_city) || 0) + 1); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([city, count]) => ({ city, count }));
  }, [orders]);

  const kpis = [
    { label: "Revenu total",    value: fp(active.reduce((s, o) => s + o.total, 0)), icon: "payments",       iconBg: "bg-emerald-100 text-emerald-600" },
    { label: "Panier moyen",    value: fp(avgOrder),                                 icon: "shopping_cart",  iconBg: "bg-sky-100 text-sky-600" },
    { label: "Taux livraison",  value: `${deliveryRate}%`,                           icon: "local_shipping", iconBg: "bg-blue-100 text-blue-600" },
    { label: "Taux annulation", value: `${cancelRate}%`,                             icon: "cancel",         iconBg: "bg-red-100 text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-extrabold tracking-tight text-gray-900">Analytiques</h1>
        <p className="font-body text-sm text-gray-400 mt-0.5">Performances de la plateforme</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <p className="font-body text-sm text-gray-500">{k.label}</p>
              <span className="material-symbols-outlined text-gray-300 text-2xl">{k.icon}</span>
            </div>
            <p className="font-headline text-2xl font-black text-gray-900">{k.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-headline text-base font-extrabold text-gray-900 mb-1">Revenus — 30 jours</h2>
        <p className="font-body text-xs text-gray-400 mb-5">Chiffre d'affaires quotidien hors annulations</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={last30} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#111827" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#111827" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 11 }} formatter={(v: number) => [fp(v), "Revenu"]} />
            <Area type="monotone" dataKey="rev" stroke="#111827" strokeWidth={2.5} fill="url(#ag)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-headline text-sm font-extrabold text-gray-900 mb-1">Statuts</h2>
          <p className="font-body text-xs text-gray-400 mb-5">{orders.length} commandes</p>
          <div className="space-y-3.5">
            {Object.entries(STATUS).map(([key, val]) => {
              const count = orders.filter(o => o.status === key).length;
              const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${val.dot}`} /><span className="font-body text-xs text-gray-600">{val.label}</span></div>
                    <span className="font-headline text-xs font-bold text-gray-700">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${val.bar}`} style={{ width: `${pct}%`, transition: "width 0.7s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-headline text-sm font-extrabold text-gray-900 mb-1">Top villes</h2>
          <p className="font-body text-xs text-gray-400 mb-5">Commandes par localité</p>
          {byCity.length === 0 ? <p className="font-body text-sm text-gray-300 text-center py-8">Aucune donnée</p> : (
            <div className="space-y-3">
              {byCity.map((c, i) => (
                <div key={c.city} className="flex items-center gap-3">
                  <span className="font-headline text-[11px] font-black text-gray-300 w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-headline text-xs font-bold text-gray-700 truncate">{c.city}</span>
                      <span className="font-headline text-xs font-bold text-gray-800 ml-2">{c.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-gray-600" style={{ width: `${(c.count / byCity[0].count) * 100}%`, transition: "width 0.7s" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-headline text-sm font-extrabold text-gray-900 mb-1">Commandes</h2>
          <p className="font-body text-xs text-gray-400 mb-4">7 derniers jours</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={last7} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barSize={24}>
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [v, "Commandes"]} />
              <Bar dataKey="count" fill="#111827" radius={[6, 6, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-sky-400" /><span className="font-body text-xs text-gray-500">Wave</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400" /><span className="font-body text-xs text-gray-500">Orange Money</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
