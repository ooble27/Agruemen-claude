import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      <Navbar />
      <main className="pt-24 pb-24 px-4 md:px-12 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* Success header */}
          <div className="flex flex-col items-center text-center pt-8 pb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.15 }}
              className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6"
            >
              <span
                className="material-symbols-outlined text-5xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </motion.div>
            <h1 className="text-3xl font-headline font-extrabold tracking-tighter mb-2">
              Commande confirmée !
            </h1>
            <p className="text-on-surface-variant font-body max-w-sm">
              Merci pour votre confiance. Nous préparons votre commande avec soin.
            </p>
            <div className="mt-4 bg-surface-container rounded-full px-4 py-1.5">
              <span className="text-xs font-headline font-bold text-on-surface-variant tracking-widest uppercase">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Delivery info */}
          <div className="bg-primary/[0.05] border border-primary/20 rounded-lg p-5 mb-4 flex items-start gap-4">
            <span
              className="material-symbols-outlined text-primary text-2xl mt-0.5 shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_shipping
            </span>
            <div>
              <p className="font-headline font-bold text-sm mb-0.5">Livraison à {order.shipping_city}</p>
              <p className="font-body text-xs text-on-surface-variant">{order.shipping_address}</p>
              <p className="font-body text-xs text-on-surface-variant mt-1.5">
                Livraison estimée :{" "}
                <strong className="text-foreground">aujourd'hui avant 20h</strong>
              </p>
            </div>
          </div>

          {/* Order items */}
          <div className="bg-card rounded-lg border border-border/30 overflow-hidden mb-4">
            <div className="px-5 py-4 border-b border-border/20 bg-surface-container-lowest">
              <h2 className="font-headline text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">shopping_basket</span>
                Articles commandés
              </h2>
            </div>
            <div className="divide-y divide-border/10">
              {items.length > 0 ? items.map(item => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <img
                    src={item.products?.image_url || "/placeholder.svg"}
                    alt={item.products?.name}
                    className="w-14 h-14 rounded-md object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-headline text-sm font-semibold truncate">{item.products?.name}</p>
                    <p className="font-body text-xs text-on-surface-variant">
                      {item.quantity} × {item.unit_price?.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                  <span className="font-headline text-sm font-bold whitespace-nowrap">
                    {formatPrice(item.unit_price * item.quantity)}
                  </span>
                </div>
              )) : (
                <div className="px-5 py-8 text-center text-on-surface-variant text-sm">
                  Récapitulatif disponible dans vos commandes
                </div>
              )}
            </div>
            <div className="border-t border-border/20 bg-surface-container-lowest px-5 py-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-body text-on-surface-variant">Livraison</span>
                <span className="font-headline font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                  Gratuite
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-border/20 pt-3">
                <span className="font-headline font-extrabold">Total</span>
                <span className="font-headline text-xl font-extrabold text-primary">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Status tracker */}
          <div className="bg-card rounded-lg border border-border/30 p-5 mb-6">
            <p className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
              Suivi de commande
            </p>
            <div className="flex items-center gap-0">
              {["Reçue", "Confirmée", "Préparation", "Livraison", "Livrée"].map((label, i) => (
                <div key={label} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${i === 0 ? "border-primary bg-primary" : "border-border/40 bg-white"}`}>
                      {i === 0
                        ? <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        : <div className="w-2 h-2 rounded-full bg-border/40" />
                      }
                    </div>
                    <span className={`text-[9px] font-headline font-bold text-center leading-tight ${i === 0 ? "text-primary" : "text-on-surface-variant/50"}`}>
                      {label}
                    </span>
                  </div>
                  {i < 4 && (
                    <div className="flex-1 h-px bg-border/30 mb-4 mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/mes-commandes"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary rounded-lg font-headline font-bold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              Suivre ma commande
            </Link>
            <Link
              to="/marche"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-surface-container rounded-lg font-headline font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              Continuer les achats
            </Link>
          </div>

        </motion.div>
      </main>
    </div>
  );
};

export default OrderConfirmation;
