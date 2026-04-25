import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import type { Order } from "@/types/database";

const STATUS_FLOW = ["pending", "confirmed", "preparing", "shipped", "delivered"];

const STATUS_META: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  pending:   { label: "En attente",     icon: "schedule",        color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" },
  confirmed: { label: "Confirmée",      icon: "check_circle",    color: "text-blue-600",   bg: "bg-blue-50 border-blue-200" },
  preparing: { label: "En préparation", icon: "inventory_2",     color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  shipped:   { label: "En livraison",   icon: "local_shipping",  color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
  delivered: { label: "Livrée",         icon: "done_all",        color: "text-green-600",  bg: "bg-green-50 border-green-200" },
  cancelled: { label: "Annulée",        icon: "cancel",          color: "text-red-600",    bg: "bg-red-50 border-red-200" },
};

const OrderTimeline = ({ status }: { status: string }) => {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
        <span className="material-symbols-outlined text-red-500 text-lg">cancel</span>
        <span className="font-headline text-xs font-bold text-red-600">Commande annulée</span>
      </div>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(status);

  return (
    <div className="mt-4 pt-4 border-t border-border/20">
      <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
        Suivi
      </p>
      <div className="flex items-start gap-0">
        {STATUS_FLOW.map((step, i) => {
          const meta = STATUS_META[step];
          const done = i <= currentIdx;
          const current = i === currentIdx;
          return (
            <div key={step} className="flex flex-1 flex-col items-center">
              <div className="flex items-center w-full">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  done ? "border-primary bg-primary" : "border-border/30 bg-white"
                } ${current ? "ring-4 ring-primary/15" : ""}`}>
                  {done ? (
                    <span className="material-symbols-outlined text-white text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {current ? meta.icon : "check"}
                    </span>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-border/40" />
                  )}
                </div>
                {i < STATUS_FLOW.length - 1 && (
                  <div className={`h-0.5 flex-1 transition-all duration-500 ${i < currentIdx ? "bg-primary" : "bg-border/20"}`} />
                )}
              </div>
              <span className={`mt-1.5 text-[9px] font-headline font-bold text-center leading-tight ${done ? "text-primary" : "text-on-surface-variant/40"}`}>
                {["Reçue", "Confirmée", "Prépa.", "Livraison", "Livrée"][i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*").eq("buyer_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setOrders(data); setLoading(false); });
  }, [user]);

  const formatPrice = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      <Navbar />
      <main className="pt-24 pb-24 px-4 md:px-12 max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tighter">Mes Commandes</h1>
          {orders.length > 0 && (
            <span className="bg-primary/10 text-primary text-xs font-headline font-bold px-3 py-1 rounded-full">
              {orders.length} commande{orders.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Filter tabs */}
        {orders.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {["all", "pending", "confirmed", "preparing", "shipped", "delivered", "cancelled"].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full font-headline text-[11px] font-bold uppercase tracking-wide transition-all ${
                  filter === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {s === "all" ? `Toutes (${orders.length})` : STATUS_META[s]?.label}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-surface-container" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4 block">receipt_long</span>
            <p className="font-headline font-bold text-lg mb-2">
              {filter === "all" ? "Aucune commande" : "Aucune commande dans cette catégorie"}
            </p>
            <p className="text-on-surface-variant text-sm mb-6">
              {filter === "all" ? "Vos commandes apparaîtront ici." : ""}
            </p>
            <Link
              to="/marche"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-headline font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-lg">storefront</span>
              Découvrir le Marché
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order, i) => {
              const meta = STATUS_META[order.status] ?? STATUS_META.pending;
              const isExpanded = expandedId === order.id;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-2xl border border-border/30 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="w-full text-left p-5 md:p-6"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${meta.bg} ${meta.color}`}>
                            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>{meta.icon}</span>
                            {meta.label}
                          </span>
                        </div>
                        <div className="text-xl md:text-2xl font-headline font-extrabold">{formatPrice(order.total)}</div>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">payments</span>
                            {order.payment_method === "wave" ? "Wave" : "Orange Money"}
                          </span>
                          {order.shipping_city && (
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">location_on</span>
                              {order.shipping_city}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start shrink-0">
                        <span className={`material-symbols-outlined text-on-surface-variant/50 text-lg transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                          expand_more
                        </span>
                      </div>
                    </div>

                    {/* Timeline (always visible if expanded) */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <OrderTimeline status={order.status} />

                          {order.shipping_address && (
                            <div className="mt-4 flex items-start gap-3 text-sm">
                              <span className="material-symbols-outlined text-on-surface-variant text-lg mt-0.5">location_on</span>
                              <div>
                                <p className="font-headline font-semibold text-sm">{order.shipping_address}</p>
                                <p className="text-xs text-on-surface-variant">{order.shipping_city} · {order.phone}</p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
