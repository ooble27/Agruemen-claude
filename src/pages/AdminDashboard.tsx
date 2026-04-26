import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";

const ADMIN_EMAIL = "Mohalaval4@gmail.com";

type Order = {
  id: string; created_at: string; total: number; status: string;
  payment_method: string | null; payment_status: string;
  shipping_address: string | null; shipping_city: string | null;
  phone: string | null; buyer_id: string;
};
type OrderItem = {
  id: string; quantity: number; unit_price: number;
  products: { name: string; image_url: string | null } | null;
};
type Product = {
  id: string; name: string; price: number; unit: string; stock: number;
  description: string | null; image_url: string | null; category_id: string | null;
  is_active: boolean; created_at: string;
  categories: { name: string } | null;
};
type Category = { id: string; name: string; icon: string | null; created_at: string };
type Profile = { user_id: string; full_name: string | null; city: string | null; phone: string | null; created_at: string; role: string | null };

type Page = "overview" | "orders" | "products" | "categories" | "users" | "analytics";

const STATUS = {
  pending:   { label: "En attente",   icon: "schedule",       dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border-amber-200",   bar: "bg-amber-400" },
  confirmed: { label: "Confirmée",    icon: "check_circle",   dot: "bg-sky-500",     badge: "bg-sky-50 text-sky-700 border-sky-200",         bar: "bg-sky-500" },
  preparing: { label: "En prépa.",    icon: "inventory_2",    dot: "bg-violet-500",  badge: "bg-violet-50 text-violet-700 border-violet-200", bar: "bg-violet-500" },
  shipped:   { label: "En livraison", icon: "local_shipping",  dot: "bg-indigo-500",  badge: "bg-indigo-50 text-indigo-700 border-indigo-200", bar: "bg-indigo-500" },
  delivered: { label: "Livrée",       icon: "done_all",       dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", bar: "bg-emerald-500" },
  cancelled: { label: "Annulée",      icon: "cancel",         dot: "bg-red-400",     badge: "bg-red-50 text-red-700 border-red-200",         bar: "bg-red-400" },
} as const;

const NAV: { page: Page; icon: string; label: string }[] = [
  { page: "overview",    icon: "space_dashboard", label: "Vue d'ensemble" },
  { page: "orders",      icon: "receipt_long",    label: "Commandes" },
  { page: "products",    icon: "storefront",      label: "Produits" },
  { page: "categories",  icon: "category",        label: "Catégories" },
  { page: "users",       icon: "group",           label: "Acheteurs" },
  { page: "analytics",   icon: "bar_chart",       label: "Analytiques" },
];

const fp = (n: number) => n.toLocaleString("fr-FR") + " FCFA";
const fd = (s: string) => new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

/* ─────────────────────────────── MAIN ─────────────────────────────── */
export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => { if (!loading && (!user || !isAdmin)) navigate("/"); }, [loading, user, isAdmin]);
  useEffect(() => { if (isAdmin) supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setOrders(data as Order[]); setLoadingOrders(false); }); }, [isAdmin]);

  const stats = useMemo(() => ({
    total: orders.length,
    revenue: orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    pending: orders.filter(o => o.status === "pending").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    today: orders.filter(o => o.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10)).length,
  }), [orders]);

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-body">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className={`fixed top-0 left-0 h-full w-[220px] bg-[#0D0D0D] flex flex-col z-50 transition-transform duration-300 ease-out
        lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06]" style={{ paddingTop: "env(safe-area-inset-top)" }}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[17px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <div className="min-w-0">
            <p className="font-headline font-extrabold text-white text-[13px] tracking-tight leading-none">Agrumen</p>
            <p className="font-body text-[9px] text-white/30 uppercase tracking-[0.15em] mt-0.5">Admin Console</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/30 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-0.5">
          <p className="px-3 pb-2 font-body text-[9px] font-semibold text-white/20 uppercase tracking-[0.18em]">Menu</p>
          {NAV.map(item => {
            const active = page === item.page;
            return (
              <button key={item.page} onClick={() => { setPage(item.page); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-headline font-semibold transition-all duration-150 ${
                  active ? "bg-white/10 text-white" : "text-white/40 hover:text-white/80 hover:bg-white/5"
                }`}>
                <span className="material-symbols-outlined text-[17px]" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.page === "orders" && stats.pending > 0 && (
                  <span className="bg-amber-400 text-[#0D0D0D] text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                    {stats.pending}
                  </span>
                )}
              </button>
            );
          })}

          <div className="my-3 mx-2 border-t border-white/[0.06]" />
          <p className="px-3 pb-2 font-body text-[9px] font-semibold text-white/20 uppercase tracking-[0.18em]">Plateforme</p>
          {[
            { to: "/marche", icon: "storefront", label: "Voir le Marché" },
            { to: "/", icon: "home", label: "Page d'accueil" },
          ].map(l => (
            <Link key={l.to} to={l.to}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-headline text-[13px] font-semibold text-white/35 hover:text-white/70 hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined text-[17px]">{l.icon}</span>
              {l.label}
              <span className="material-symbols-outlined text-[11px] ml-auto text-white/15">open_in_new</span>
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-white/[0.06] px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-headline text-xs font-black text-primary shrink-0">
              {(user.email || "A")[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-headline text-[12px] font-bold text-white/80 truncate leading-none">Administrateur</p>
              <p className="font-body text-[10px] text-white/25 truncate mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <div className="flex-1 flex flex-col lg:ml-[220px] min-h-screen">

        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80" style={{ paddingTop: "env(safe-area-inset-top)" }}>
          <div className="flex items-center gap-3 px-5 h-14">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-slate-500 text-xl">menu</span>
            </button>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="font-body text-slate-400 text-xs">Admin</span>
              <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
              <span className="font-headline font-bold text-slate-800 text-sm">
                {NAV.find(n => n.page === page)?.label}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {stats.pending > 0 && (
                <button onClick={() => setPage("orders")}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-headline text-xs font-bold hover:bg-amber-100 transition-colors">
                  <span className="material-symbols-outlined text-sm">notifications_active</span>
                  {stats.pending} en attente
                </button>
              )}
              <Link to="/marche"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/8 text-primary font-headline text-xs font-bold hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined text-sm">storefront</span>
                Marché
              </Link>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-body text-[11px] text-slate-500">En ligne</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-5 md:p-7 max-w-[1400px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
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
   OVERVIEW PAGE
══════════════════════════════════════════════ */
function OverviewPage({ stats, orders, loadingOrders, setPage }: { stats: any; orders: Order[]; loadingOrders: boolean; setPage: (p: Page) => void }) {

  const last7 = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const date = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("fr-FR", { weekday: "short" });
    const rev = orders.filter(o => o.created_at.slice(0, 10) === date && o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
    const count = orders.filter(o => o.created_at.slice(0, 10) === date).length;
    return { label, rev, count };
  }), [orders]);

  const kpis = [
    { label: "Commandes",    value: stats.total,          sub: `+${stats.today} aujourd'hui`, icon: "receipt_long",   accent: "text-sky-600",     bg: "bg-sky-50",     border: "border-sky-100" },
    { label: "Revenus",      value: fp(stats.revenue),    sub: "hors annulations",             icon: "payments",       accent: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "En attente",   value: stats.pending,        sub: "à traiter",                    icon: "schedule",       accent: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-100" },
    { label: "Livrées",      value: stats.delivered,      sub: "commandes livrées",            icon: "done_all",       accent: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-extrabold tracking-tight text-slate-900">Bonjour 👋</h1>
          <p className="font-body text-sm text-slate-400 mt-0.5">{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${k.bg} border ${k.border} flex items-center justify-center mb-4`}>
              <span className={`material-symbols-outlined text-xl ${k.accent}`} style={{ fontVariationSettings: "'FILL' 1" }}>{k.icon}</span>
            </div>
            <p className="font-headline text-2xl font-black text-slate-900 leading-none">{k.value}</p>
            <p className="font-headline text-xs font-bold text-slate-500 mt-1">{k.label}</p>
            <p className="font-body text-[11px] text-slate-400 mt-0.5">{k.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-headline text-sm font-extrabold text-slate-800">Revenus — 7 jours</h2>
              <p className="font-body text-xs text-slate-400 mt-0.5">Chiffre d'affaires quotidien</p>
            </div>
            <span className="font-headline text-xs font-bold text-primary bg-primary/8 px-2.5 py-1 rounded-full">
              {fp(last7.reduce((s, d) => s + d.rev, 0))}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={last7} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "inherit" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 11, fontFamily: "inherit" }}
                formatter={(v: number) => [fp(v), "Revenu"]}
              />
              <Area type="monotone" dataKey="rev" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
          <h2 className="font-headline text-sm font-extrabold text-slate-800 mb-4">Actions rapides</h2>
          <div className="flex-1 grid grid-cols-2 gap-2.5">
            {[
              { label: "Commandes", icon: "receipt_long", action: () => setPage("orders"), primary: true },
              { label: "Nouveau produit", icon: "add_box", action: () => setPage("products") },
              { label: "Catégories", icon: "category", action: () => setPage("categories") },
              { label: "Acheteurs", icon: "group", action: () => setPage("users") },
            ].map(qa => (
              <button key={qa.label} onClick={qa.action}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl p-3.5 font-headline text-xs font-bold transition-all ${
                  qa.primary ? "bg-primary text-white hover:opacity-90" : "bg-slate-50 border border-slate-200 text-slate-600 hover:border-primary/30 hover:text-primary hover:bg-primary/4"
                }`}>
                <span className="material-symbols-outlined text-xl">{qa.icon}</span>
                {qa.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-headline text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[17px]" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
            Commandes récentes
          </h2>
          <button onClick={() => setPage("orders")} className="font-headline text-xs font-bold text-primary hover:underline">Tout voir →</button>
        </div>
        {loadingOrders ? (
          <div className="p-5 space-y-2.5">{[1,2,3,4].map(i => <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />)}</div>
        ) : orders.length === 0 ? (
          <div className="py-14 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-200 block mb-2">inbox</span>
            <p className="font-body text-sm text-slate-400">Aucune commande</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {orders.slice(0, 8).map(order => {
              const st = STATUS[order.status as keyof typeof STATUS] ?? STATUS.pending;
              return (
                <div key={order.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                  <div className="min-w-0 flex-1">
                    <span className="font-headline text-[12px] font-bold text-slate-800">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className="ml-2 font-body text-xs text-slate-400">{order.shipping_city} · {order.phone}</span>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold font-headline border rounded-full px-2.5 py-0.5 ${st.badge}`}>{st.label}</span>
                  <span className="font-headline text-sm font-black text-primary shrink-0">{fp(order.total)}</span>
                  <span className="hidden md:block font-body text-[11px] text-slate-300 shrink-0">{fd(order.created_at)}</span>
                </div>
              );
            })}
          </div>
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

  const fetchItems = async (orderId: string) => {
    setLoadingItems(true);
    const { data } = await supabase.from("order_items").select("*, products(name, image_url)").eq("order_id", orderId);
    if (data) setOrderItems(data as OrderItem[]);
    setLoadingItems(false);
  };

  const selectOrder = (order: Order) => {
    if (selected?.id === order.id) { setSelected(null); setOrderItems([]); return; }
    setSelected(order);
    fetchItems(order.id);
  };

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) toast.error("Erreur mise à jour");
    else {
      toast.success("Statut mis à jour");
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status } : null);
    }
    setUpdatingId(null);
  };

  const filtered = orders.filter(o => {
    const ms = filter === "all" || o.status === filter;
    const mq = !search || o.id.toLowerCase().includes(search) || (o.phone || "").includes(search) || (o.shipping_city || "").toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  const tabs = [
    { key: "all", label: "Toutes", count: orders.length },
    ...Object.entries(STATUS).map(([key, val]) => ({ key, label: val.label, count: orders.filter(o => o.status === key).length })),
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-extrabold tracking-tight text-slate-900">Commandes</h1>
          <p className="font-body text-sm text-slate-400 mt-0.5">{orders.length} commande{orders.length !== 1 ? "s" : ""} au total</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-4">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ID, ville, téléphone..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-headline text-[11px] font-bold whitespace-nowrap transition-all ${
              filter === t.key ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
            }`}>
            {t.label}
            {t.count > 0 && <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${filter === t.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* List */}
        <div className="lg:col-span-3 space-y-2">
          {loadingOrders ? (
            Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-white border border-slate-100" />)
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-200 block mb-3">inbox</span>
              <p className="font-headline font-bold text-slate-400">Aucune commande</p>
            </div>
          ) : filtered.map(order => {
            const st = STATUS[order.status as keyof typeof STATUS] ?? STATUS.pending;
            const isSel = selected?.id === order.id;
            return (
              <button key={order.id} onClick={() => selectOrder(order)}
                className={`w-full text-left rounded-2xl border bg-white p-4 transition-all hover:shadow-md ${isSel ? "border-primary ring-2 ring-primary/15 shadow-md" : "border-slate-200 hover:border-slate-300"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${st.dot}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-headline text-xs font-black text-slate-800">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className={`text-[10px] font-bold font-headline border rounded-full px-2 py-0.5 ${st.badge}`}>{st.label}</span>
                    </div>
                    <p className="font-body text-xs text-slate-400 truncate">{order.shipping_city} · {order.phone} · {(order.payment_method || "").toUpperCase()}</p>
                    <p className="font-body text-[10px] text-slate-300">{fd(order.created_at)}</p>
                  </div>
                  <p className="font-headline text-base font-black text-primary shrink-0">{fp(order.total)}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                className="sticky top-20 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Panel header */}
                <div className="bg-slate-50/80 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-headline text-xs font-extrabold text-slate-800">#{selected.id.slice(0, 8).toUpperCase()}</p>
                    <p className="font-body text-[11px] text-slate-400 mt-0.5">{fd(selected.created_at)}</p>
                  </div>
                  <button onClick={() => { setSelected(null); setOrderItems([]); }} className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-slate-400 text-base">close</span>
                  </button>
                </div>

                <div className="p-5 space-y-5">
                  {/* Info rows */}
                  {[
                    { icon: "location_on", label: "Adresse", value: `${selected.shipping_address ?? "—"}, ${selected.shipping_city ?? "—"}` },
                    { icon: "phone",       label: "Téléphone", value: selected.phone ?? "—" },
                    { icon: "payments",    label: "Paiement", value: `${(selected.payment_method ?? "—").toUpperCase()} · ${selected.payment_status}` },
                    { icon: "paid",        label: "Total", value: fp(selected.total) },
                  ].map(row => (
                    <div key={row.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 shrink-0 rounded-lg bg-primary/8 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[15px]">{row.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-headline text-[9px] font-bold uppercase tracking-wider text-slate-400">{row.label}</p>
                        <p className="font-body text-sm text-slate-700 break-words">{row.value}</p>
                      </div>
                    </div>
                  ))}

                  {/* Order items */}
                  <div className="border-t border-slate-100 pt-4">
                    <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Articles commandés</p>
                    {loadingItems ? (
                      <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />)}</div>
                    ) : orderItems.length === 0 ? (
                      <p className="font-body text-xs text-slate-300">Aucun article</p>
                    ) : (
                      <div className="space-y-2">
                        {orderItems.map(item => (
                          <div key={item.id} className="flex items-center gap-3">
                            <img src={item.products?.image_url || "/placeholder.svg"} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-100" />
                            <div className="min-w-0 flex-1">
                              <p className="font-headline text-xs font-semibold text-slate-700 truncate">{item.products?.name}</p>
                              <p className="font-body text-[10px] text-slate-400">{item.quantity} × {item.unit_price.toLocaleString("fr-FR")} FCFA</p>
                            </div>
                            <p className="font-headline text-xs font-bold text-slate-700 shrink-0">{fp(item.quantity * item.unit_price)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Status change */}
                  <div className="border-t border-slate-100 pt-4">
                    <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Modifier le statut</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(STATUS).map(([key, val]) => (
                        <button key={key} disabled={selected.status === key || updatingId === selected.id}
                          onClick={() => updateStatus(selected.id, key)}
                          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 font-headline text-[11px] font-bold transition-all ${
                            selected.status === key ? `${val.badge}` : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 disabled:opacity-40"
                          }`}>
                          <span className="material-symbols-outlined text-[13px]">
                            {updatingId === selected.id ? "progress_activity" : val.icon}
                          </span>
                          {val.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-dashed border-slate-200 py-20 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-200 block mb-3">touch_app</span>
                <p className="font-headline font-bold text-slate-400">Sélectionne une commande</p>
                <p className="font-body text-xs text-slate-300 mt-1">pour voir les détails</p>
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
const EMPTY_FORM = { name: "", price: "", unit: "le kg", stock: "", description: "", image_url: "", category_id: "", is_active: true };

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const imgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]).then(([pr, cr]) => {
      if (pr.data) setProducts(pr.data as Product[]);
      if (cr.data) setCategories(cr.data);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p => {
    const mq = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const mc = catFilter === "all" || p.category_id === catFilter;
    return mq && mc;
  });

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, category_id: categories[0]?.id || "" });
    setEditProduct(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({ name: p.name, price: String(p.price), unit: p.unit, stock: String(p.stock ?? ""), description: p.description || "", image_url: p.image_url || "", category_id: p.category_id || "", is_active: p.is_active });
    setEditProduct(p);
    setShowForm(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) { toast.error("Erreur upload image"); setUploading(false); return; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm(f => ({ ...f, image_url: data.publicUrl }));
    toast.success("Image uploadée !");
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) { toast.error("Nom et prix requis"); return; }
    setSaving(true);
    const payload: any = {
      name: form.name.trim(), price: parseFloat(form.price), unit: form.unit,
      stock: parseInt(form.stock) || 0, description: form.description || null,
      image_url: form.image_url || null, category_id: form.category_id || null, is_active: form.is_active,
    };
    if (editProduct) {
      const { error } = await supabase.from("products").update(payload).eq("id", editProduct.id);
      if (error) { toast.error("Erreur mise à jour"); }
      else {
        const cat = categories.find(c => c.id === form.category_id);
        setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...payload, categories: cat ? { name: cat.name } : null } : p));
        toast.success("Produit mis à jour !");
        setShowForm(false);
      }
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select("*, categories(name)").single();
      if (error) { toast.error("Erreur création produit"); }
      else { setProducts(prev => [data as Product, ...prev]); toast.success("Produit créé !"); setShowForm(false); }
    }
    setSaving(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("products").update({ is_active: !current }).eq("id", id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p));
    toast.success(current ? "Produit désactivé" : "Produit activé");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error("Erreur suppression"); }
    else { setProducts(prev => prev.filter(p => p.id !== id)); toast.success("Produit supprimé"); }
    setDeleteConfirm(null);
  };

  const f = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-extrabold tracking-tight text-slate-900">Produits</h1>
          <p className="font-body text-sm text-slate-400 mt-0.5">{products.length} produit{products.length !== 1 ? "s" : ""} en catalogue</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-1">
            {(["grid", "table"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${view === v ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}>
                <span className="material-symbols-outlined text-[17px]">{v === "grid" ? "grid_view" : "table_rows"}</span>
              </button>
            ))}
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-xl font-headline text-sm font-bold hover:opacity-90 transition-opacity shadow-sm">
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span className="hidden sm:inline">Nouveau produit</span>
            <span className="sm:hidden">Ajouter</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          <button onClick={() => setCatFilter("all")}
            className={`shrink-0 px-3 py-1.5 rounded-lg font-headline text-xs font-bold transition-all ${catFilter === "all" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-500"}`}>
            Tous ({products.length})
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setCatFilter(catFilter === c.id ? "all" : c.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg font-headline text-xs font-bold transition-all ${catFilter === c.id ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-100">
              {/* Modal header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="font-headline text-base font-extrabold text-slate-900">{editProduct ? "Modifier le produit" : "Nouveau produit"}</h2>
                  <p className="font-body text-xs text-slate-400 mt-0.5">{editProduct ? "Mettez à jour les informations" : "Remplissez les champs ci-dessous"}</p>
                </div>
                <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors">
                  <span className="material-symbols-outlined text-slate-400 text-lg">close</span>
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Image section */}
                <div>
                  <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Photo du produit</label>
                  <div className="flex gap-4 items-start">
                    <div onClick={() => imgRef.current?.click()}
                      className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 cursor-pointer hover:border-primary hover:bg-primary/4 transition-all overflow-hidden">
                      {form.image_url
                        ? <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                        : <span className="material-symbols-outlined text-3xl text-slate-300">add_photo_alternate</span>
                      }
                    </div>
                    <div className="flex-1 space-y-2.5">
                      <input type="text" placeholder="URL de l'image (Unsplash, etc.)" value={form.image_url} onChange={e => f("image_url", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" />
                      <button type="button" onClick={() => imgRef.current?.click()} disabled={uploading}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-600 font-headline text-xs font-bold hover:bg-slate-200 disabled:opacity-50 transition-colors">
                        <span className="material-symbols-outlined text-sm">{uploading ? "progress_activity" : "upload"}</span>
                        {uploading ? "Upload en cours..." : "Télécharger une image"}
                      </button>
                      <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Nom du produit <span className="text-red-500">*</span></label>
                  <input type="text" value={form.name} onChange={e => f("name", e.target.value)} placeholder="Ex : Mangues Kent"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>

                {/* Price / Stock / Unit */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Prix FCFA <span className="text-red-500">*</span></label>
                    <input type="number" value={form.price} onChange={e => f("price", e.target.value)} placeholder="1500"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" />
                  </div>
                  <div>
                    <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Stock</label>
                    <input type="number" value={form.stock} onChange={e => f("stock", e.target.value)} placeholder="50"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" />
                  </div>
                  <div>
                    <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Unité</label>
                    <div className="relative">
                      <select value={form.unit} onChange={e => f("unit", e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-body text-sm outline-none focus:border-primary transition-all">
                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-400">expand_more</span>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Catégorie</label>
                  <div className="relative">
                    <select value={form.category_id} onChange={e => f("category_id", e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-body text-sm outline-none focus:border-primary transition-all">
                      <option value="">Aucune catégorie</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-400">expand_more</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Description</label>
                  <textarea value={form.description} onChange={e => f("description", e.target.value)} rows={3} placeholder="Description du produit..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 resize-none transition-all" />
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                  <div>
                    <p className="font-headline text-sm font-bold text-slate-800">Produit visible</p>
                    <p className="font-body text-xs text-slate-400">Affiché sur le Marché</p>
                  </div>
                  <button type="button" onClick={() => f("is_active", !form.is_active)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${form.is_active ? "bg-primary" : "bg-slate-300"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200 ${form.is_active ? "left-7" : "left-1"}`} />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 font-headline text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                    Annuler
                  </button>
                  <button onClick={handleSave} disabled={saving || !form.name || !form.price}
                    className="flex-1 py-3 rounded-xl bg-primary text-white font-headline text-sm font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity">
                    {saving && <span className="material-symbols-outlined animate-spin text-[17px]">progress_activity</span>}
                    {saving ? "Enregistrement..." : editProduct ? "Mettre à jour" : "Créer le produit"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
              </div>
              <h3 className="font-headline font-extrabold text-base mb-1 text-slate-900">Supprimer ce produit ?</h3>
              <p className="font-body text-sm text-slate-400 mb-6">Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-headline text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">Annuler</button>
                <button onClick={() => handleDelete(deleteConfirm!)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-headline text-sm font-bold hover:bg-red-600 transition-colors">Supprimer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products display */}
      {loading ? (
        <div className={view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" : "space-y-2"}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`animate-pulse rounded-2xl bg-white border border-slate-100 ${view === "grid" ? "aspect-square" : "h-16"}`} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-200 block mb-3">inventory_2</span>
          <p className="font-headline font-bold text-slate-400 mb-1">{search ? "Aucun résultat" : "Aucun produit"}</p>
          {!search && <button onClick={openAdd} className="mt-3 inline-flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-xl font-headline text-sm font-bold hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-base">add</span>Premier produit
          </button>}
        </div>
      ) : view === "grid" ? (
        /* ── GRID VIEW ── */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(p => (
            <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-slate-300">
              <div className="relative aspect-square bg-slate-100">
                <img src={p.image_url || "/placeholder.svg"} alt={p.name}
                  className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(p)} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-slate-700 text-base">edit</span>
                  </button>
                  <button onClick={() => setDeleteConfirm(p.id)} className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-white text-base">delete</span>
                  </button>
                </div>
                {!p.is_active && (
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-headline font-bold px-2 py-0.5 rounded-full">Inactif</div>
                )}
                {(p.stock ?? 0) === 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-headline font-bold px-2 py-0.5 rounded-full">Rupture</div>
                )}
              </div>
              <div className="p-3">
                <p className="font-headline text-[12px] font-bold text-slate-800 truncate leading-tight">{p.name}</p>
                <p className="font-body text-[10px] text-slate-400 mt-0.5 truncate">{p.categories?.name ?? "—"}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="font-headline text-sm font-extrabold text-primary">{p.price.toLocaleString("fr-FR")}<span className="text-[9px] text-slate-400 font-normal ml-0.5">FCFA</span></p>
                  <button onClick={() => toggleActive(p.id, p.is_active)}
                    className={`text-[9px] font-headline font-bold px-2 py-0.5 rounded-full border transition-all ${p.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                    {p.is_active ? "Actif" : "Off"}
                  </button>
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${(p.stock ?? 0) === 0 ? "bg-red-400" : (p.stock ?? 0) < 10 ? "bg-amber-400" : "bg-emerald-400"}`}
                      style={{ width: `${Math.min(((p.stock ?? 0) / 100) * 100, 100)}%` }} />
                  </div>
                  <span className="font-body text-[9px] text-slate-400">{p.stock ?? 0}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* ── TABLE VIEW ── */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left px-5 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400">Produit</th>
                <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden md:table-cell">Catégorie</th>
                <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400">Prix</th>
                <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden sm:table-cell">Stock</th>
                <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.image_url || "/placeholder.svg"} alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-100"
                        onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                      <span className="font-headline text-sm font-semibold text-slate-800 truncate max-w-[140px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="font-body text-xs text-slate-400">{p.categories?.name ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-headline text-sm font-bold text-slate-800">{p.price.toLocaleString("fr-FR")}</span>
                    <span className="block font-body text-[10px] text-slate-400">{p.unit}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 font-headline text-[10px] font-bold border ${
                      (p.stock ?? 0) === 0 ? "bg-red-50 text-red-600 border-red-100" : (p.stock ?? 0) < 10 ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}>{p.stock ?? 0} unités</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => toggleActive(p.id, p.is_active)}
                      className={`rounded-lg px-2.5 py-1 font-headline text-[10px] font-bold border transition-all ${
                        p.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                      }`}>{p.is_active ? "Actif" : "Inactif"}</button>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                      </button>
                      <button onClick={() => setDeleteConfirm(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </div>
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
const ICON_SUGGESTIONS = ["park", "nutrition", "grain", "compost", "local_fire_department", "eco", "spa", "grass", "water_drop", "forest", "agriculture", "set_meal", "breakfast_dining", "grocery"];

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", icon: "eco" });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => { if (data) setCategories(data); setLoading(false); });
  }, []);

  const openAdd = () => { setForm({ name: "", icon: "eco" }); setEditCat(null); setShowForm(true); };
  const openEdit = (c: Category) => { setForm({ name: c.name, icon: c.icon || "eco" }); setEditCat(c); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Nom requis"); return; }
    setSaving(true);
    const payload = { name: form.name.trim(), icon: form.icon };
    if (editCat) {
      const { error } = await supabase.from("categories").update(payload).eq("id", editCat.id);
      if (error) toast.error("Erreur mise à jour");
      else { setCategories(prev => prev.map(c => c.id === editCat.id ? { ...c, ...payload } : c)); toast.success("Catégorie mise à jour !"); setShowForm(false); }
    } else {
      const { data, error } = await supabase.from("categories").insert(payload).select().single();
      if (error) toast.error("Erreur création");
      else { setCategories(prev => [...prev, data]); toast.success("Catégorie créée !"); setShowForm(false); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error("Erreur suppression — des produits utilisent peut-être cette catégorie");
    else { setCategories(prev => prev.filter(c => c.id !== id)); toast.success("Catégorie supprimée"); }
    setDeleteConfirm(null);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-extrabold tracking-tight text-slate-900">Catégories</h1>
          <p className="font-body text-sm text-slate-400 mt-0.5">{categories.length} catégorie{categories.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-xl font-headline text-sm font-bold hover:opacity-90 transition-opacity shadow-sm">
          <span className="material-symbols-outlined text-[17px]">add</span>
          Nouvelle catégorie
        </button>
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()} className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-headline text-base font-extrabold text-slate-900">{editCat ? "Modifier" : "Nouvelle catégorie"}</h2>
                <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-slate-400 text-lg">close</span>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Nom <span className="text-red-500">*</span></label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex : Légumes racines"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
                <div>
                  <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Icône Material</label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {ICON_SUGGESTIONS.map(ic => (
                      <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${form.icon === ic ? "bg-primary text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                        <span className="material-symbols-outlined text-lg" style={form.icon === ic ? { fontVariationSettings: "'FILL' 1" } : {}}>{ic}</span>
                      </button>
                    ))}
                  </div>
                  <input type="text" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="Nom de l'icône Material"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-body text-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{form.icon || "category"}</span>
                  <p className="font-headline text-sm font-bold text-slate-700">{form.name || "Aperçu de la catégorie"}</p>
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-headline text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">Annuler</button>
                  <button onClick={handleSave} disabled={saving || !form.name}
                    className="flex-1 py-3 rounded-xl bg-primary text-white font-headline text-sm font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity">
                    {saving && <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>}
                    {editCat ? "Mettre à jour" : "Créer"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
              </div>
              <h3 className="font-headline font-extrabold text-base mb-1 text-slate-900">Supprimer cette catégorie ?</h3>
              <p className="font-body text-sm text-slate-400 mb-6">Les produits liés ne seront pas supprimés.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-headline text-sm font-bold text-slate-500">Annuler</button>
                <button onClick={() => handleDelete(deleteConfirm!)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-headline text-sm font-bold hover:bg-red-600 transition-colors">Supprimer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-white border border-slate-100" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-200 block mb-3">category</span>
          <p className="font-headline font-bold text-slate-400 mb-3">Aucune catégorie</p>
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-xl font-headline text-sm font-bold">
            <span className="material-symbols-outlined text-base">add</span>Créer une catégorie
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map(cat => (
            <motion.div key={cat.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="group bg-white rounded-2xl border border-slate-200 p-5 flex flex-col items-center gap-3 hover:shadow-md hover:border-slate-300 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon || "category"}</span>
              </div>
              <p className="font-headline text-sm font-extrabold text-slate-800 text-center">{cat.name}</p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(cat)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all">
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </button>
                <button onClick={() => setDeleteConfirm(cat.id)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-all">
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                </button>
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

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setUsers(data as Profile[]); setLoading(false); });
  }, []);

  const filtered = users.filter(u =>
    !search || (u.full_name || "").toLowerCase().includes(search.toLowerCase()) || (u.city || "").toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name: string | null) => (name || "?")[0].toUpperCase();
  const colors = ["bg-sky-100 text-sky-700", "bg-violet-100 text-violet-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700"];
  const colorFor = (id: string) => colors[id.charCodeAt(0) % colors.length];

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-extrabold tracking-tight text-slate-900">Acheteurs</h1>
          <p className="font-body text-sm text-slate-400 mt-0.5">{users.length} compte{users.length !== 1 ? "s" : ""} enregistré{users.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="relative max-w-sm mb-5">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, ville..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="text-left px-5 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400">Acheteur</th>
              <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden sm:table-cell">Ville</th>
              <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden md:table-cell">Téléphone</th>
              <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400">Inscrit le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}><td colSpan={4} className="px-5 py-3.5"><div className="h-10 animate-pulse rounded-xl bg-slate-100" /></td></tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="py-16 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-200 block mb-2">group</span>
                <p className="font-headline font-bold text-slate-400">Aucun acheteur</p>
              </td></tr>
            ) : filtered.map(u => (
              <tr key={u.user_id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-headline text-sm font-black shrink-0 ${colorFor(u.user_id)}`}>
                      {initials(u.full_name)}
                    </div>
                    <div>
                      <p className="font-headline text-sm font-semibold text-slate-800">{u.full_name || "Sans nom"}</p>
                      <p className="font-body text-[10px] text-slate-400">{u.role || "acheteur"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <span className="font-body text-sm text-slate-500">{u.city ?? "—"}</span>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <span className="font-body text-sm text-slate-500">{u.phone ?? "—"}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="font-body text-xs text-slate-400">{u.created_at ? fd(u.created_at) : "—"}</span>
                </td>
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
    const label = i % 7 === 0 ? d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "";
    const rev = orders.filter(o => o.created_at.slice(0, 10) === date && o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
    const count = orders.filter(o => o.created_at.slice(0, 10) === date).length;
    return { label, date, rev, count };
  }), [orders]);

  const active = orders.filter(o => o.status !== "cancelled");
  const avgOrder = active.length ? Math.round(active.reduce((s, o) => s + o.total, 0) / active.length) : 0;
  const deliveryRate = orders.length ? Math.round(orders.filter(o => o.status === "delivered").length / orders.length * 100) : 0;
  const cancelRate = orders.length ? Math.round(orders.filter(o => o.status === "cancelled").length / orders.length * 100) : 0;

  const byCity = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach(o => { if (o.shipping_city) map.set(o.shipping_city, (map.get(o.shipping_city) || 0) + 1); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([city, count]) => ({ city, count }));
  }, [orders]);

  const byStatus = Object.entries(STATUS).map(([key, val]) => ({
    label: val.label, count: orders.filter(o => o.status === key).length, bar: val.bar, dot: val.dot,
  }));

  const byPayment = useMemo(() => {
    const wave = orders.filter(o => o.payment_method === "wave").length;
    const om = orders.filter(o => o.payment_method === "orange_money").length;
    return [{ label: "Wave", count: wave }, { label: "Orange Money", count: om }];
  }, [orders]);

  const kpis = [
    { label: "Revenu total",     value: fp(active.reduce((s, o) => s + o.total, 0)), icon: "payments",       accent: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Panier moyen",     value: fp(avgOrder),                                 icon: "shopping_cart",  accent: "text-sky-600",     bg: "bg-sky-50",     border: "border-sky-100" },
    { label: "Taux de livraison",value: `${deliveryRate}%`,                           icon: "local_shipping", accent: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-100" },
    { label: "Taux d'annulation",value: `${cancelRate}%`,                             icon: "cancel",         accent: "text-red-500",     bg: "bg-red-50",     border: "border-red-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-extrabold tracking-tight text-slate-900">Analytiques</h1>
        <p className="font-body text-sm text-slate-400 mt-0.5">Performances de la plateforme Agrumen</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${k.bg} border ${k.border} flex items-center justify-center mb-4`}>
              <span className={`material-symbols-outlined text-xl ${k.accent}`} style={{ fontVariationSettings: "'FILL' 1" }}>{k.icon}</span>
            </div>
            <p className="font-headline text-xl font-black text-slate-900">{k.value}</p>
            <p className="font-body text-xs text-slate-400 mt-1">{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart 30 days */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-headline text-sm font-extrabold text-slate-800">Revenus — 30 derniers jours</h2>
            <p className="font-body text-xs text-slate-400 mt-0.5">Chiffre d'affaires quotidien hors annulations</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={last30} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#94a3b8", fontFamily: "inherit" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 11, fontFamily: "inherit" }}
              formatter={(v: number) => [fp(v), "Revenu"]} labelFormatter={() => ""} />
            <Area type="monotone" dataKey="rev" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#areaGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Status distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-headline text-sm font-extrabold text-slate-800 mb-1">Répartition statuts</h2>
          <p className="font-body text-xs text-slate-400 mb-5">{orders.length} commandes au total</p>
          <div className="space-y-4">
            {byStatus.map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                    <span className="font-body text-xs text-slate-500">{s.label}</span>
                  </div>
                  <span className="font-headline text-xs font-bold text-slate-700">{s.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${s.bar}`}
                    style={{ width: orders.length ? `${(s.count / orders.length) * 100}%` : "0%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top cities */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-headline text-sm font-extrabold text-slate-800 mb-1">Top villes</h2>
          <p className="font-body text-xs text-slate-400 mb-5">Commandes par localité</p>
          {byCity.length === 0 ? (
            <p className="font-body text-sm text-slate-300 text-center py-8">Aucune donnée</p>
          ) : (
            <div className="space-y-3">
              {byCity.map((c, i) => (
                <div key={c.city} className="flex items-center gap-3">
                  <span className="font-headline text-[11px] font-black text-slate-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-headline text-xs font-bold text-slate-700 truncate">{c.city}</span>
                      <span className="font-headline text-xs font-bold text-primary ml-2">{c.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-primary/60 transition-all duration-700"
                        style={{ width: `${(c.count / byCity[0].count) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment methods */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-headline text-sm font-extrabold text-slate-800 mb-1">Moyens de paiement</h2>
          <p className="font-body text-xs text-slate-400 mb-5">Répartition Wave vs Orange Money</p>
          <div className="space-y-4">
            {byPayment.map((p, i) => (
              <div key={p.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-sky-400" : "bg-orange-400"}`} />
                    <span className="font-body text-xs text-slate-500">{p.label}</span>
                  </div>
                  <span className="font-headline text-xs font-bold text-slate-700">{p.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${i === 0 ? "bg-sky-400" : "bg-orange-400"}`}
                    style={{ width: orders.length ? `${(p.count / orders.length) * 100}%` : "0%" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Orders count bar chart */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Commandes / jour (7j)</p>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={last30.slice(-7)} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barSize={20}>
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#94a3b8", fontFamily: "inherit" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [v, "Commandes"]} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
