import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ADMIN_EMAIL = "Mohalaval4@gmail.com";

type Order = {
  id: string;
  created_at: string;
  total: number;
  status: string;
  payment_method: string | null;
  payment_status: string;
  shipping_address: string | null;
  shipping_city: string | null;
  phone: string | null;
  buyer_id: string;
};

type Page = "overview" | "orders" | "products" | "users" | "analytics";

const STATUS_LABELS: Record<string, { label: string; color: string; icon: string; dot: string; bar: string }> = {
  pending:   { label: "En attente",   color: "bg-amber-50 text-amber-700 border-amber-200",    icon: "schedule",       dot: "bg-amber-400",  bar: "bg-amber-400" },
  confirmed: { label: "Confirmée",    color: "bg-blue-50 text-blue-700 border-blue-200",       icon: "check_circle",   dot: "bg-blue-500",   bar: "bg-blue-500" },
  preparing: { label: "En prépa.",    color: "bg-violet-50 text-violet-700 border-violet-200", icon: "inventory_2",    dot: "bg-violet-500", bar: "bg-violet-500" },
  shipped:   { label: "En livraison", color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: "local_shipping", dot: "bg-indigo-500", bar: "bg-indigo-500" },
  delivered: { label: "Livrée",       color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "done_all",   dot: "bg-emerald-500",bar: "bg-emerald-500" },
  cancelled: { label: "Annulée",      color: "bg-red-50 text-red-700 border-red-200",          icon: "cancel",         dot: "bg-red-400",    bar: "bg-red-400" },
};

const SIDEBAR_ITEMS: { page: Page; icon: string; label: string }[] = [
  { page: "overview",   icon: "dashboard",    label: "Vue d'ensemble" },
  { page: "orders",     icon: "receipt_long", label: "Commandes" },
  { page: "products",   icon: "eco",          label: "Produits" },
  { page: "users",      icon: "group",        label: "Acheteurs" },
  { page: "analytics",  icon: "bar_chart",    label: "Analytiques" },
];

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const isAdminUser = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    if (!loading && (!user || !isAdminUser)) navigate("/");
  }, [loading, user, isAdminUser]);

  useEffect(() => {
    if (isAdminUser) fetchOrders();
  }, [isAdminUser]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
    setLoadingOrders(false);
  };

  const formatPrice = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

  const stats = {
    total: orders.length,
    revenue: orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    pending: orders.filter(o => o.status === "pending").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    todayOrders: orders.filter(o => o.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10)).length,
  };

  if (loading || !user || !isAdminUser) return null;

  const pageTitle = SIDEBAR_ITEMS.find(i => i.page === page)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-[#111827] flex flex-col z-50 transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <div>
            <span className="font-headline text-white font-extrabold text-sm tracking-tight">Agrumen</span>
            <span className="block font-body text-[9px] text-white/35 uppercase tracking-[0.2em]">Console Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/50 hover:text-white">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-2 pt-1 font-body text-[9px] font-semibold text-white/25 uppercase tracking-[0.18em]">
            Navigation
          </p>
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.page}
              onClick={() => { setPage(item.page); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-headline text-[13px] font-semibold transition-all ${
                page === item.page
                  ? "bg-primary text-white"
                  : "text-white/55 hover:text-white hover:bg-white/6"
              }`}
            >
              <span className="material-symbols-outlined text-[17px]" style={page === item.page ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
              {item.label}
              {item.page === "orders" && stats.pending > 0 && (
                <span className="ml-auto bg-amber-400 text-[#111] text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {stats.pending}
                </span>
              )}
            </button>
          ))}

          <div className="border-t border-white/8 my-3 mx-1" />
          <p className="px-3 pb-2 font-body text-[9px] font-semibold text-white/25 uppercase tracking-[0.18em]">
            Plateforme
          </p>

          {[
            { to: "/marche", icon: "storefront", label: "Voir le Marché" },
            { to: "/mes-commandes", icon: "local_shipping", label: "Suivi commandes" },
            { to: "/", icon: "home", label: "Page d'accueil" },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md font-headline text-[13px] font-semibold text-white/45 hover:text-white hover:bg-white/6 transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">{link.icon}</span>
              {link.label}
              <span className="material-symbols-outlined text-[12px] ml-auto text-white/20">open_in_new</span>
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-white/8 px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/25 flex items-center justify-center text-primary font-black text-xs shrink-0">
              {(user.email || "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-headline text-[12px] font-bold text-white truncate">Administrateur</p>
              <p className="font-body text-[10px] text-white/35 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-60">

        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200/80">
          <div className="flex items-center gap-4 px-6 h-14">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-500 text-[20px]">menu</span>
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-gray-400 font-body text-xs">Admin</span>
              <span className="material-symbols-outlined text-gray-300 text-[14px]">chevron_right</span>
              <span className="font-headline font-bold text-gray-800 text-sm">{pageTitle}</span>
            </div>

            {/* Right */}
            <div className="ml-auto flex items-center gap-2">
              <Link
                to="/marche"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/8 text-primary font-headline text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <span className="material-symbols-outlined text-[15px]">storefront</span>
                Voir le Marché
              </Link>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gray-50 border border-gray-200">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-body text-[11px] text-gray-500">En ligne</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
            >
              {page === "overview"  && <OverviewPage stats={stats} orders={orders} formatPrice={formatPrice} loadingOrders={loadingOrders} setPage={setPage} />}
              {page === "orders"    && <OrdersPage orders={orders} setOrders={setOrders} formatPrice={formatPrice} loadingOrders={loadingOrders} />}
              {page === "products"  && <ProductsPage />}
              {page === "users"     && <UsersPage />}
              {page === "analytics" && <AnalyticsPage orders={orders} formatPrice={formatPrice} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   OVERVIEW PAGE
══════════════════════════════════════════ */
const OverviewPage = ({ stats, orders, formatPrice, loadingOrders, setPage }: any) => {
  const recentOrders = orders.slice(0, 6);

  const kpis = [
    { label: "Commandes totales", value: stats.total,                icon: "receipt_long",   accent: "border-l-blue-500",   iconBg: "bg-blue-50 text-blue-600" },
    { label: "Revenus générés",   value: formatPrice(stats.revenue), icon: "payments",       accent: "border-l-emerald-500",iconBg: "bg-emerald-50 text-emerald-600" },
    { label: "En attente",        value: stats.pending,              icon: "schedule",       accent: "border-l-amber-500",  iconBg: "bg-amber-50 text-amber-600" },
    { label: "Livrées",           value: stats.delivered,            icon: "done_all",       accent: "border-l-violet-500", iconBg: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-headline text-xl font-extrabold tracking-tight text-gray-900">
          Tableau de bord
        </h1>
        <p className="font-body text-sm text-gray-400 mt-0.5">
          {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white rounded-xl border border-gray-200 border-l-4 ${kpi.accent} p-5 shadow-sm hover:shadow transition-shadow`}
          >
            <div className={`w-9 h-9 rounded-lg ${kpi.iconBg} flex items-center justify-center mb-3`}>
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{kpi.icon}</span>
            </div>
            <div className="font-headline text-2xl font-black text-gray-900 leading-none">{kpi.value}</div>
            <div className="font-body text-xs text-gray-400 mt-1.5">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-headline text-xs font-extrabold uppercase tracking-[0.12em] text-gray-400 mb-3">Actions rapides</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Commandes", icon: "receipt_long", style: "bg-primary text-primary-foreground hover:opacity-90", action: () => setPage("orders") },
            { label: "Ajouter produit", icon: "add_box", style: "bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary", action: () => setPage("products") },
            { label: "Voir le Marché", icon: "storefront", style: "bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary", href: "/marche" },
            { label: "Acheteurs", icon: "group", style: "bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary", action: () => setPage("users") },
          ].map(qa =>
            qa.href ? (
              <Link key={qa.label} to={qa.href} className={`flex flex-col items-center gap-2 px-4 py-4 rounded-lg font-headline text-xs font-bold transition-all text-center ${qa.style}`}>
                <span className="material-symbols-outlined text-xl">{qa.icon}</span>
                {qa.label}
              </Link>
            ) : (
              <button key={qa.label} onClick={qa.action} className={`flex flex-col items-center gap-2 px-4 py-4 rounded-lg font-headline text-xs font-bold transition-all text-center ${qa.style}`}>
                <span className="material-symbols-outlined text-xl">{qa.icon}</span>
                {qa.label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-headline text-sm font-bold text-gray-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
            Commandes récentes
          </h2>
          <button onClick={() => setPage("orders")} className="font-headline text-xs font-bold text-primary hover:underline">
            Tout voir
          </button>
        </div>
        {loadingOrders ? (
          <div className="p-5 space-y-2.5">{[1,2,3].map(i => <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />)}</div>
        ) : recentOrders.length === 0 ? (
          <div className="py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-200 block mb-2">inbox</span>
            <p className="font-body text-sm text-gray-400">Aucune commande pour l'instant</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order: Order) => {
              const st = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;
              return (
                <div key={order.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/70 transition-colors">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
                  <div className="min-w-0 flex-1">
                    <span className="font-headline text-xs font-bold text-gray-800">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className="ml-2 font-body text-xs text-gray-400">{order.shipping_city} · {order.phone}</span>
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1 rounded border px-2 py-0.5 font-headline text-[10px] font-bold ${st.color}`}>
                    {st.label}
                  </span>
                  <span className="font-headline text-sm font-black text-primary shrink-0">
                    {order.total.toLocaleString("fr-FR")} <span className="text-gray-400 font-normal text-[10px]">FCFA</span>
                  </span>
                  <span className="font-body text-[11px] text-gray-300 shrink-0 hidden md:block">
                    {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Platform links */}
      <div>
        <h2 className="font-headline text-xs font-extrabold uppercase tracking-[0.12em] text-gray-400 mb-3">Accès rapide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { to: "/marche",        icon: "storefront",     label: "Marché",           desc: "Voir les produits" },
            { to: "/mes-commandes", icon: "local_shipping", label: "Suivi livraisons", desc: "Statuts des commandes" },
            { to: "/",              icon: "home",           label: "Landing page",     desc: "Page d'accueil publique" },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/40 hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-all">
                <span className="material-symbols-outlined text-gray-400 text-[17px] group-hover:text-white transition-colors">{link.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-headline text-sm font-bold text-gray-800">{link.label}</p>
                <p className="font-body text-xs text-gray-400 truncate">{link.desc}</p>
              </div>
              <span className="material-symbols-outlined text-gray-200 text-[16px] group-hover:text-primary transition-colors">arrow_forward</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   ORDERS PAGE
══════════════════════════════════════════ */
const OrdersPage = ({ orders, setOrders, formatPrice, loadingOrders }: any) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
      toast.error("Erreur lors de la mise à jour");
    } else {
      toast.success("Statut mis à jour");
      setOrders((prev: Order[]) => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder((prev: Order | null) => prev ? { ...prev, status: newStatus } : null);
    }
    setUpdatingId(null);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const filtered = orders.filter((o: Order) => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch = !search || o.id.includes(search.toLowerCase()) || (o.phone || "").includes(search) || (o.shipping_city || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const tabs = [
    { key: "all",       label: `Toutes (${orders.length})` },
    { key: "pending",   label: `En attente (${orders.filter((o: Order) => o.status === "pending").length})` },
    { key: "confirmed", label: "Confirmées" },
    { key: "preparing", label: "En prépa." },
    { key: "shipped",   label: "En livraison" },
    { key: "delivered", label: "Livrées" },
    { key: "cancelled", label: "Annulées" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-headline text-xl font-extrabold text-gray-900">Commandes</h1>
          <p className="font-body text-sm text-gray-400">{orders.length} commande{orders.length !== 1 ? "s" : ""} au total</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ID, ville, téléphone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilterStatus(t.key)}
            className={`shrink-0 px-3 py-1.5 rounded-md font-headline text-[11px] font-bold whitespace-nowrap transition-all ${
              filterStatus === t.key
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* List */}
        <div className="lg:col-span-3 space-y-2">
          {loadingOrders ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-white border border-gray-100" />)
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">inbox</span>
              <p className="font-headline font-bold text-gray-400">Aucune commande</p>
            </div>
          ) : filtered.map((order: Order) => {
            const st = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;
            return (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                className={`w-full text-left rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow ${
                  selectedOrder?.id === order.id ? "border-primary ring-1 ring-primary/20" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                      <span className="font-headline text-xs font-black text-gray-800">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-headline text-[10px] font-bold ${st.color}`}>
                        <span className="material-symbols-outlined text-[10px]">{st.icon}</span>
                        {st.label}
                      </span>
                    </div>
                    <p className="font-body text-xs text-gray-400 truncate">
                      {order.shipping_city} · {order.phone} · {order.payment_method?.toUpperCase()}
                    </p>
                    <p className="font-body text-[11px] text-gray-300">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="font-headline text-base font-black text-primary shrink-0">{formatPrice(order.total)}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="sticky top-20 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-3.5 flex items-center justify-between">
                  <div>
                    <h3 className="font-headline text-sm font-extrabold text-gray-800">#{selectedOrder.id.slice(0, 8).toUpperCase()}</h3>
                    <p className="font-body text-xs text-gray-400">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <span className="material-symbols-outlined text-gray-400 text-[15px]">close</span>
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  {[
                    { icon: "location_on", label: "Adresse", value: `${selectedOrder.shipping_address}, ${selectedOrder.shipping_city}` },
                    { icon: "phone",       label: "Téléphone", value: selectedOrder.phone ?? "—" },
                    { icon: "payments",    label: "Paiement", value: `${selectedOrder.payment_method?.toUpperCase()} · ${selectedOrder.payment_status}` },
                    { icon: "receipt",     label: "Total",   value: formatPrice(selectedOrder.total) },
                  ].map(row => (
                    <div key={row.label} className="flex items-start gap-3">
                      <div className="w-7 h-7 shrink-0 rounded-md bg-primary/8 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[14px]">{row.icon}</span>
                      </div>
                      <div>
                        <p className="font-headline text-[9px] font-bold uppercase tracking-wider text-gray-400">{row.label}</p>
                        <p className="font-body text-sm text-gray-800">{row.value}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Modifier le statut</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(STATUS_LABELS).map(([key, val]) => (
                        <button
                          key={key}
                          disabled={selectedOrder.status === key || updatingId === selectedOrder.id}
                          onClick={() => updateOrderStatus(selectedOrder.id, key)}
                          className={`flex items-center gap-1.5 rounded-md border px-3 py-2 font-headline text-[11px] font-bold transition-all disabled:cursor-not-allowed ${
                            selectedOrder.status === key
                              ? `${val.color} border-current`
                              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 disabled:opacity-40"
                          }`}
                        >
                          {updatingId === selectedOrder.id
                            ? <span className="material-symbols-outlined animate-spin text-[13px]">progress_activity</span>
                            : <span className="material-symbols-outlined text-[13px]">{val.icon}</span>
                          }
                          {val.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl border border-dashed border-gray-200 py-20 text-center"
              >
                <span className="material-symbols-outlined text-4xl text-gray-200 block mb-3">touch_app</span>
                <p className="font-headline font-bold text-gray-400">Sélectionne une commande</p>
                <p className="font-body text-xs text-gray-300 mt-1">pour voir les détails et modifier le statut</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   PRODUCTS PAGE
══════════════════════════════════════════ */
const UNITS = ["kg", "g", "pièce", "botte", "litre", "sachet", "boîte", "paquet"];
const emptyForm = { name: "", price: "", unit: "kg", stock: "", description: "", image_url: "", category_id: "", is_active: true };

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const imgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]).then(([prodRes, catRes]) => {
      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setForm({ ...emptyForm, category_id: categories[0]?.id || "" });
    setEditProduct(null);
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setForm({ name: p.name, price: String(p.price), unit: p.unit, stock: String(p.stock), description: p.description || "", image_url: p.image_url || "", category_id: p.category_id || "", is_active: p.is_active });
    setEditProduct(p);
    setShowForm(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) { toast.error("Erreur upload — vérifiez le bucket Supabase"); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm(prev => ({ ...prev, image_url: urlData.publicUrl }));
    setUploading(false);
    toast.success("Image uploadée !");
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) { toast.error("Nom et prix requis"); return; }
    setSaving(true);
    const productData: any = {
      name: form.name.trim(), price: parseFloat(form.price), unit: form.unit,
      stock: parseInt(form.stock) || 0, description: form.description || null,
      image_url: form.image_url || null, category_id: form.category_id || null, is_active: form.is_active,
    };
    if (editProduct) {
      const { error } = await supabase.from("products").update(productData).eq("id", editProduct.id);
      if (error) { toast.error("Erreur mise à jour"); }
      else {
        toast.success("Produit mis à jour !");
        const cat = categories.find(c => c.id === form.category_id);
        setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...productData, categories: cat ? { name: cat.name } : null } : p));
        setShowForm(false);
      }
    } else {
      const { data, error } = await supabase.from("products").insert(productData).select("*, categories(name)").single();
      if (error) { toast.error("Erreur création"); }
      else { toast.success("Produit créé !"); setProducts(prev => [data, ...prev]); setShowForm(false); }
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
    else { toast.success("Produit supprimé"); setProducts(prev => prev.filter(p => p.id !== id)); }
    setDeleteConfirm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-headline text-xl font-extrabold text-gray-900">Produits</h1>
          <p className="font-body text-sm text-gray-400">{products.length} produit{products.length !== 1 ? "s" : ""} en catalogue</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-headline text-sm font-bold hover:opacity-90 transition-opacity shadow-sm">
          <span className="material-symbols-outlined text-[17px]">add</span>
          Nouveau produit
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-5">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
        <input type="text" placeholder="Rechercher un produit..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
      </div>

      {/* Product form modal — overlay is the flex container for perfect centering */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl max-h-[88vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-100"
            >
              {/* Modal header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="font-headline text-base font-extrabold text-gray-900">{editProduct ? "Modifier le produit" : "Ajouter un produit"}</h2>
                  <p className="font-body text-xs text-gray-400 mt-0.5">{editProduct ? "Mettez à jour les informations" : "Remplissez les champs ci-dessous"}</p>
                </div>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <span className="material-symbols-outlined text-gray-400 text-[18px]">close</span>
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Image */}
                <div>
                  <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Image du produit</label>
                  <div className="flex gap-3 items-start">
                    <div
                      onClick={() => imgInputRef.current?.click()}
                      className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 cursor-pointer hover:border-primary hover:bg-primary/4 transition-all overflow-hidden"
                    >
                      {form.image_url
                        ? <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                        : <span className="material-symbols-outlined text-2xl text-gray-300">add_photo_alternate</span>
                      }
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="URL de l'image (Unsplash, etc.)"
                        value={form.image_url}
                        onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => imgInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 font-headline text-xs font-bold hover:bg-gray-200 disabled:opacity-50 transition-colors"
                      >
                        {uploading
                          ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                          : <span className="material-symbols-outlined text-sm">upload</span>
                        }
                        {uploading ? "En cours..." : "Télécharger un fichier"}
                      </button>
                      <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Nom du produit <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Ex : Mangues Kent bio"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>

                {/* Price + Unit + Stock */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Prix (FCFA) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                      placeholder="1500"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Stock</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                      placeholder="100"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Unité</label>
                    <div className="relative">
                      <select
                        value={form.unit}
                        onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                        className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-body text-sm outline-none focus:border-primary"
                      >
                        {UNITS.map(u => <option key={u}>{u}</option>)}
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[15px] text-gray-400">expand_more</span>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Catégorie</label>
                  <div className="relative">
                    <select
                      value={form.category_id}
                      onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-body text-sm outline-none focus:border-primary"
                    >
                      <option value="">Aucune catégorie</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[15px] text-gray-400">expand_more</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={3}
                    placeholder="Description du produit..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-body text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 resize-none transition-all"
                  />
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between rounded-lg bg-gray-50 border border-gray-100 px-4 py-3">
                  <div>
                    <p className="font-headline text-sm font-bold text-gray-800">Produit actif</p>
                    <p className="font-body text-xs text-gray-400">Visible sur le Marché</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? "bg-primary" : "bg-gray-200"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.is_active ? "left-6" : "left-1"}`} />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 rounded-lg border border-gray-200 font-headline text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !form.name || !form.price}
                    className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-headline text-sm font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity"
                  >
                    {saving
                      ? <span className="material-symbols-outlined animate-spin text-[17px]">progress_activity</span>
                      : <span className="material-symbols-outlined text-[17px]">save</span>
                    }
                    {editProduct ? "Mettre à jour" : "Créer le produit"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl p-6 w-80 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
              </div>
              <h3 className="font-headline font-extrabold text-base mb-1 text-gray-900">Supprimer ce produit ?</h3>
              <p className="font-body text-sm text-gray-400 mb-5">Cette action est irréversible.</p>
              <div className="flex gap-2.5">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-lg border border-gray-200 font-headline text-sm font-bold text-gray-500 hover:bg-gray-50">Annuler</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-headline text-sm font-bold hover:bg-red-600 transition-colors">Supprimer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400">Produit</th>
              <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden md:table-cell">Catégorie</th>
              <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400">Prix</th>
              <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:table-cell">Stock</th>
              <th className="text-left px-4 py-3 font-headline text-[10px] font-bold uppercase tracking-widest text-gray-400">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-5 py-3.5"><div className="h-10 animate-pulse rounded-lg bg-gray-100" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <span className="material-symbols-outlined text-4xl text-gray-200 block mb-3">inventory_2</span>
                  <p className="font-headline font-bold text-gray-400">{search ? "Aucun résultat" : "Aucun produit"}</p>
                  {!search && (
                    <button onClick={openAdd} className="mt-3 inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-headline text-sm font-bold">
                      <span className="material-symbols-outlined text-[15px]">add</span>Premier produit
                    </button>
                  )}
                </td>
              </tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image_url || "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=60&h=60&fit=crop"}
                      alt={p.name}
                      className="w-9 h-9 rounded-md object-cover shrink-0 border border-gray-100"
                    />
                    <span className="font-headline text-sm font-semibold text-gray-800 truncate max-w-[160px]">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <span className="font-body text-xs text-gray-400">{p.categories?.name ?? "—"}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="font-headline text-sm font-bold text-gray-800">{p.price?.toLocaleString("fr-FR")}</span>
                  <span className="block font-body text-[10px] text-gray-400">FCFA/{p.unit}</span>
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <span className={`inline-flex items-center rounded px-2 py-0.5 font-headline text-[10px] font-bold border ${(p.stock || 0) > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                    {p.stock || 0}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => toggleActive(p.id, p.is_active)}
                    className={`rounded px-2.5 py-1 font-headline text-[10px] font-bold border transition-all ${p.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100" : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"}`}
                  >
                    {p.is_active ? "Actif" : "Inactif"}
                  </button>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                      <span className="material-symbols-outlined text-[15px]">edit</span>
                    </button>
                    <button onClick={() => setDeleteConfirm(p.id)} className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   USERS PAGE
══════════════════════════════════════════ */
const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setUsers(data); setLoading(false); });
  }, []);

  const filtered = users.filter(u =>
    !search || (u.full_name || "").toLowerCase().includes(search.toLowerCase()) || (u.city || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-headline text-xl font-extrabold text-gray-900">Acheteurs</h1>
          <p className="font-body text-sm text-gray-400">{users.length} compte{users.length !== 1 ? "s" : ""} enregistré{users.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="relative max-w-sm mb-5">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
        <input
          type="text"
          placeholder="Nom, ville..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white font-body text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
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
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={4} className="px-5 py-3.5"><div className="h-10 animate-pulse rounded-lg bg-gray-100" /></td></tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="py-16 text-center">
                <span className="material-symbols-outlined text-4xl text-gray-200 block mb-3">group</span>
                <p className="font-headline font-bold text-gray-400">Aucun acheteur</p>
              </td></tr>
            ) : filtered.map(u => (
              <tr key={u.user_id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-headline text-sm font-black text-primary shrink-0">
                      {(u.full_name || "?").charAt(0).toUpperCase()}
                    </div>
                    <span className="font-headline text-sm font-semibold text-gray-800">{u.full_name || "Sans nom"}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <span className="font-body text-sm text-gray-400">{u.city ?? "—"}</span>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <span className="font-body text-sm text-gray-400">{u.phone ?? "—"}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="font-body text-xs text-gray-300">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   ANALYTICS PAGE
══════════════════════════════════════════ */
const AnalyticsPage = ({ orders, formatPrice }: { orders: Order[]; formatPrice: (n: number) => string }) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { label: d.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit" }), date: d.toISOString().slice(0, 10) };
  });

  const revenueByDay = last7Days.map(({ label, date }) => ({
    label,
    revenue: orders.filter(o => o.created_at.slice(0, 10) === date && o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    count: orders.filter(o => o.created_at.slice(0, 10) === date).length,
  }));

  const maxRevenue = Math.max(...revenueByDay.map(d => d.revenue), 1);

  const byStatus = Object.entries({
    pending:   orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    shipped:   orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  });

  const activeOrders = orders.filter(o => o.status !== "cancelled");
  const avgOrder = activeOrders.length > 0 ? activeOrders.reduce((s, o) => s + o.total, 0) / activeOrders.length : 0;
  const deliveryRate = orders.length > 0 ? Math.round(orders.filter(o => o.status === "delivered").length / orders.length * 100) : 0;
  const cancelRate = orders.length > 0 ? Math.round(orders.filter(o => o.status === "cancelled").length / orders.length * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-xl font-extrabold text-gray-900">Analytiques</h1>
        <p className="font-body text-sm text-gray-400">Performances de la plateforme</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Revenu total",    value: formatPrice(activeOrders.reduce((s, o) => s + o.total, 0)), icon: "payments",       left: "border-l-emerald-500", ibg: "bg-emerald-50 text-emerald-600" },
          { label: "Panier moyen",    value: formatPrice(Math.round(avgOrder)),                           icon: "shopping_cart",  left: "border-l-blue-500",    ibg: "bg-blue-50 text-blue-600" },
          { label: "Taux livraison",  value: `${deliveryRate}%`,                                         icon: "local_shipping", left: "border-l-violet-500",  ibg: "bg-violet-50 text-violet-600" },
          { label: "Taux annulation", value: `${cancelRate}%`,                                           icon: "cancel",         left: "border-l-red-400",     ibg: "bg-red-50 text-red-500" },
        ].map(kpi => (
          <div key={kpi.label} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${kpi.left} p-5 shadow-sm`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${kpi.ibg}`}>
              <span className="material-symbols-outlined text-[17px]" style={{ fontVariationSettings: "'FILL' 1" }}>{kpi.icon}</span>
            </div>
            <div className="font-headline text-xl font-black text-gray-900">{kpi.value}</div>
            <div className="font-body text-xs text-gray-400 mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue bar chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-headline text-sm font-extrabold text-gray-800 mb-0.5">Revenus — 7 derniers jours</h3>
          <p className="font-body text-xs text-gray-400 mb-6">Chiffre d'affaires journalier (hors annulations)</p>
          <div className="flex items-end gap-2.5 h-40">
            {revenueByDay.map(d => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
                {d.revenue > 0 && (
                  <span className="font-headline text-[9px] font-bold text-gray-400">
                    {d.revenue >= 1000 ? `${Math.round(d.revenue / 1000)}k` : d.revenue}
                  </span>
                )}
                <div
                  className="w-full rounded-t transition-all duration-700"
                  style={{
                    height: `${Math.max((d.revenue / maxRevenue) * 130, d.revenue > 0 ? 6 : 2)}px`,
                    background: d.revenue > 0 ? "hsl(var(--primary))" : "#e5e7eb",
                  }}
                />
                <span className="font-body text-[8px] text-gray-400 text-center leading-tight">{d.label}</span>
                {d.count > 0 && <span className="font-headline text-[8px] text-primary font-bold">{d.count}</span>}
              </div>
            ))}
          </div>
          {revenueByDay.every(d => d.revenue === 0) && (
            <p className="text-center text-xs text-gray-300 mt-2">Aucune commande cette semaine</p>
          )}
        </div>

        {/* Status distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-headline text-sm font-extrabold text-gray-800 mb-0.5">Répartition par statut</h3>
          <p className="font-body text-xs text-gray-400 mb-5">{orders.length} commande{orders.length !== 1 ? "s" : ""} au total</p>
          <div className="space-y-4">
            {byStatus.map(([status, count]) => {
              const st = STATUS_LABELS[status];
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${st.dot}`} />
                      <span className="font-body text-xs text-gray-500">{st.label}</span>
                    </div>
                    <span className="font-headline text-xs font-bold text-gray-700">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${st.bar}`}
                      style={{ width: orders.length > 0 ? `${(count / orders.length) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
