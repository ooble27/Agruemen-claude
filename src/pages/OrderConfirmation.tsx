import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/auth");
    else if (!orderId) navigate("/marche");
  }, [authLoading, user, orderId]);

  useEffect(() => {
    if (!orderId || !user) return;
    Promise.all([
      supabase.from("orders").select("*").eq("id", orderId).eq("buyer_id", user.id).single(),
      supabase.from("order_items").select("*, products(name, image_url, unit)").eq("order_id", orderId),
    ]).then(([orderRes, itemsRes]) => {
      if (orderRes.data) setOrder(orderRes.data);
      if (itemsRes.data) setItems(itemsRes.data);
      setLoading(false);
    });
  }, [orderId, user]);

  const formatPrice = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-white/20 animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!order) return null;

  const STATUS_STEPS = ["Reçue", "Confirmée", "Préparation", "Livraison", "Livrée"];

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO DARK ── */}
      <section className="bg-[#0a0a0a] relative overflow-hidden">
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />

        <div className="relative z-10 px-6 md:px-14 pt-20 pb-16 max-w-2xl mx-auto text-center">
          {/* Animated check */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-sm bg-white/8 border border-white/12 mb-8"
          >
            <span
              className="material-symbols-outlined text-5xl text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 mb-3">
              Commande confirmée
            </p>
            <h1
              className="font-headline font-black text-white tracking-tighter leading-[0.92] mb-4"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
            >
              Merci pour<br />votre commande.
            </h1>
            <p className="font-body text-white/45 text-sm mb-6">
              Nous préparons votre commande avec soin. Vous serez notifié à chaque étape.
            </p>

            {/* Order ID badge */}
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 rounded-sm px-4 py-2">
              <span className="material-symbols-outlined text-white/40 text-[14px]">tag</span>
              <span className="font-headline text-xs font-bold text-white/60 tracking-[0.15em] uppercase">
                {order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <main className="px-5 md:px-8 max-w-2xl mx-auto py-10 space-y-4">

        {/* Delivery info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-sm border border-border/25 bg-background overflow-hidden"
        >
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border/15">
            <div className="w-8 h-8 rounded-sm bg-foreground/8 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-foreground text-[16px]">local_shipping</span>
            </div>
            <h2 className="font-headline font-black text-sm tracking-tight">Livraison</h2>
          </div>
          <div className="px-5 py-4">
            <p className="font-headline font-bold text-sm text-foreground">{order.shipping_address}</p>
            <p className="font-body text-xs text-on-surface-variant mt-0.5">{order.shipping_city} · {order.phone}</p>
            <div className="mt-3 flex items-center gap-2 bg-surface-container rounded-sm px-3 py-2">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant/60">schedule</span>
              <p className="font-body text-xs text-on-surface-variant">
                Livraison estimée :{" "}
                <strong className="text-foreground font-headline">aujourd'hui avant 20h</strong>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Status tracker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-sm border border-border/25 bg-background px-5 py-5"
        >
          <p className="font-headline text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50 mb-4">
            Suivi de commande
          </p>
          <div className="flex items-center">
            {STATUS_STEPS.map((label, i) => (
              <div key={label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className={`w-7 h-7 rounded-sm flex items-center justify-center border-2 transition-all ${
                    i === 0 ? "border-foreground bg-foreground" : "border-border/30 bg-background"
                  }`}>
                    {i === 0 ? (
                      <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-border/40" />
                    )}
                  </div>
                  <span className={`text-[9px] font-headline font-bold text-center leading-tight ${
                    i === 0 ? "text-foreground" : "text-on-surface-variant/40"
                  }`}>
                    {label}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className="flex-1 h-px mb-4 mx-1" style={{ background: i === 0 ? "hsl(var(--foreground))" : "hsl(var(--border) / 0.3)" }} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order items */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="rounded-sm border border-border/25 bg-background overflow-hidden"
        >
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border/15">
            <div className="w-8 h-8 rounded-sm bg-foreground/8 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-foreground text-[16px]">shopping_basket</span>
            </div>
            <h2 className="font-headline font-black text-sm tracking-tight">
              Articles commandés
            </h2>
          </div>

          <div className="divide-y divide-border/10">
            {items.length > 0 ? items.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                <img
                  src={item.products?.image_url || "/placeholder.svg"}
                  alt={item.products?.name}
                  className="w-14 h-14 rounded-sm object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-headline text-sm font-bold truncate">{item.products?.name}</p>
                  <p className="font-body text-xs text-on-surface-variant">
                    {item.quantity} × {item.unit_price?.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
                <span className="font-headline text-sm font-black whitespace-nowrap">
                  {formatPrice(item.unit_price * item.quantity)}
                </span>
              </div>
            )) : (
              <div className="px-5 py-8 text-center">
                <p className="font-body text-sm text-on-surface-variant/60">Récapitulatif disponible dans vos commandes.</p>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="border-t border-border/15 bg-surface-container/30 px-5 py-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-body text-on-surface-variant">Livraison</span>
              <span className="font-headline font-bold text-emerald-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                Gratuite
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border/15 pt-3">
              <span className="font-headline font-black text-lg">Total</span>
              <span className="font-headline font-black text-xl">{formatPrice(order.total)}</span>
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-3 pt-2"
        >
          <Link
            to="/mes-commandes"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-foreground text-white rounded-sm font-headline font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            Suivre ma commande
          </Link>
          <Link
            to="/marche"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-border/30 text-on-surface-variant rounded-sm font-headline font-bold text-sm hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            Continuer les achats
          </Link>
        </motion.div>

      </main>
    </div>
  );
};

export default OrderConfirmation;
