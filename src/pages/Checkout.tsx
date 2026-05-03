import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import waveLogo from "@/assets/wave-logo.png";
import orangeMoneyLogo from "@/assets/orange-money-logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const CITIES = ["Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack", "Touba", "Rufisque", "Mbour", "Diourbel", "Tambacounda"];

const PROMO_CODES: Record<string, { discount: number; type: "percent" | "fixed"; label: string }> = {
  "AGRUMEN10": { discount: 10, type: "percent", label: "−10%" },
  "FRESH20":   { discount: 20, type: "percent", label: "−20%" },
  "BIENVENUE": { discount: 15, type: "percent", label: "−15%" },
  "LIVRAISON": { discount: 500, type: "fixed",   label: "−500 FCFA" },
};

const steps = [
  { id: 1, label: "Livraison", icon: "local_shipping" },
  { id: 2, label: "Paiement", icon: "payments" },
  { id: 3, label: "Confirmation", icon: "check_circle" },
];

const Checkout = () => {
  const { user, loading: authLoading, profile } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dakar");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wave");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [promoInput, setPromoInput] = useState("");
  const [promoCode, setPromoCode] = useState<null | { discount: number; type: "percent" | "fixed"; label: string; code: string }>(null);
  const [promoError, setPromoError] = useState("");

  const formatPrice = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

  const discount = promoCode
    ? promoCode.type === "percent"
      ? Math.round(totalPrice * promoCode.discount / 100)
      : promoCode.discount
    : 0;

  const finalTotal = Math.max(0, totalPrice - discount);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (!authLoading && items.length === 0) navigate("/");
  }, [authLoading, user, items.length]);

  useEffect(() => {
    if (profile?.phone) setPhone(profile.phone);
    if (profile?.city) setCity(profile.city);
  }, [profile]);

  if (authLoading || !user || items.length === 0) return null;

  const applyPromo = () => {
    setPromoError("");
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const found = PROMO_CODES[code];
    if (found) {
      setPromoCode({ ...found, code });
      toast.success(`Code "${code}" appliqué — ${found.label} !`);
    } else {
      setPromoError("Code invalide ou expiré");
    }
  };

  const handleOrder = async () => {
    setLoading(true);
    try {
      const { data: order, error: orderErr } = await supabase.from("orders").insert({
        buyer_id: user.id,
        total: finalTotal,
        shipping_address: address,
        shipping_city: city,
        phone,
        payment_method: paymentMethod,
      }).select().single();
      if (orderErr) throw orderErr;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        shop_id: item.shopId,
        quantity: item.quantity,
        unit_price: item.priceNum,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      clearCart();
      navigate(`/confirmation?order_id=${order.id}`);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la commande");
    } finally {
      setLoading(false);
    }
  };

  const [recapOpen, setRecapOpen] = useState(true);

  const canProceedStep1 = address.trim().length > 0 && phone.trim().length > 0;

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      <Navbar />

      <main className="pb-32 md:pb-12" style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 80px)" }}>
        <div className="mx-auto max-w-screen-xl px-4 md:px-8 lg:px-16">

          {/* Header */}
          <div className="flex items-center gap-4 py-4">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-border/40 bg-white shadow-sm transition-all hover:border-border hover:shadow-md"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">arrow_back</span>
            </button>
            <div>
              <h1 className="font-headline text-2xl font-extrabold tracking-tight">Finaliser la commande</h1>
              <p className="mt-0.5 font-body text-sm text-on-surface-variant">Étape {step} sur 3</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="mb-10 flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-sm border-2 transition-all duration-300 ${
                    s.id < step
                      ? "border-foreground bg-foreground text-white"
                      : s.id === step
                      ? "border-foreground bg-white text-foreground shadow-[0_0_0_4px_hsl(var(--foreground)/0.08)]"
                      : "border-border/40 bg-white text-on-surface-variant/50"
                  }`}>
                    {s.id < step
                      ? <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      : <span className="font-headline text-sm font-black">{s.id}</span>
                    }
                  </div>
                  <span className={`font-headline text-[11px] font-bold uppercase tracking-widest ${s.id <= step ? "text-foreground" : "text-on-surface-variant/50"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="mx-2 mb-5 h-px flex-1 transition-all duration-500" style={{ background: step > s.id ? "hsl(var(--foreground))" : "hsl(var(--border))" }} />
                )}
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

            {/* Left: Steps — static */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">

                {/* Step 1: Livraison */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.22 }}>
                    <div className="overflow-hidden rounded-sm border border-border/30 bg-white shadow-sm">
                      <div className="border-b border-border/20 bg-surface-container-lowest px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-foreground/8">
                            <span className="material-symbols-outlined text-foreground text-[18px]">local_shipping</span>
                          </div>
                          <div>
                            <h2 className="font-headline text-base font-extrabold">Adresse de livraison</h2>
                            <p className="font-body text-xs text-on-surface-variant">Dakar et environs · sous 24h</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-5 p-6">
                        <div>
                          <label className="mb-2 block font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                            Adresse complète
                          </label>
                          <input
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="Ex : Sacré Cœur 3, Villa 123"
                            className="w-full rounded-sm border border-border/40 bg-surface-container-lowest px-4 py-3.5 font-body text-sm outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-foreground focus:ring-2 focus:ring-foreground/10"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="mb-2 block font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Ville</label>
                            <div className="relative">
                              <select
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                className="w-full appearance-none rounded-sm border border-border/40 bg-surface-container-lowest px-4 py-3.5 font-body text-sm outline-none transition-all focus:border-foreground focus:ring-2 focus:ring-foreground/10"
                              >
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                              <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">expand_more</span>
                            </div>
                          </div>
                          <div>
                            <label className="mb-2 block font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Téléphone</label>
                            <input
                              value={phone}
                              onChange={e => setPhone(e.target.value)}
                              placeholder="77 000 00 00"
                              type="tel"
                              className="w-full rounded-sm border border-border/40 bg-surface-container-lowest px-4 py-3.5 font-body text-sm outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-foreground focus:ring-2 focus:ring-foreground/10"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-sm bg-surface-container px-4 py-3">
                          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">schedule</span>
                          <p className="font-body text-xs text-on-surface-variant">
                            Livraison estimée :{" "}
                            <strong className="text-foreground">aujourd'hui avant 20h</strong> pour les commandes passées avant 14h.
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm bg-foreground py-4 font-headline text-base font-extrabold text-white shadow-sm transition-all hover:opacity-90 hover:scale-[0.99] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                    >
                      Continuer vers le paiement
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Paiement */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.22 }}>
                    <div className="overflow-hidden rounded-sm border border-border/30 bg-white shadow-sm">
                      <div className="border-b border-border/20 bg-surface-container-lowest px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-foreground/8">
                            <span className="material-symbols-outlined text-foreground text-[18px]">payments</span>
                          </div>
                          <div>
                            <h2 className="font-headline text-base font-extrabold">Mode de paiement</h2>
                            <p className="font-body text-xs text-on-surface-variant">Paiement mobile sécurisé</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4 p-6">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: "wave", label: "Wave", logo: waveLogo, color: "from-blue-50 to-indigo-50", borderActive: "border-blue-400", badge: "Recommandé" },
                            { id: "orange_money", label: "Orange Money", logo: orangeMoneyLogo, color: "from-orange-50 to-amber-50", borderActive: "border-orange-400", badge: null },
                          ].map(method => (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => setPaymentMethod(method.id)}
                              className={`relative flex flex-col items-center gap-3 rounded-sm border-2 p-5 text-left transition-all duration-200 ${
                                paymentMethod === method.id
                                  ? `${method.borderActive} bg-gradient-to-br ${method.color} shadow-md`
                                  : "border-border/30 bg-white hover:border-border hover:shadow-sm"
                              }`}
                            >
                              {method.badge && (
                                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-sm bg-foreground px-2.5 py-0.5">
                                  <span className="font-headline text-[9px] font-bold uppercase tracking-wider text-white">{method.badge}</span>
                                </div>
                              )}
                              {paymentMethod === method.id && (
                                <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                                  <span className="material-symbols-outlined text-[13px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                                </div>
                              )}
                              <img src={method.logo} alt={method.label} className="h-12 w-12 rounded-md object-cover" />
                              <span className="font-headline text-sm font-bold">{method.label}</span>
                            </button>
                          ))}
                        </div>

                        {/* Promo code */}
                        <div className="rounded-sm border border-border/30 bg-surface-container-lowest p-4">
                          <p className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">local_offer</span>
                            Code promo
                          </p>
                          {promoCode ? (
                            <div className="flex items-center justify-between bg-foreground/[0.05] border border-foreground/20 rounded-sm px-4 py-2.5">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-foreground text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                <div>
                                  <span className="font-headline text-sm font-bold text-foreground">{promoCode.code}</span>
                                  <span className="ml-2 font-body text-xs text-on-surface-variant">{promoCode.label} appliqué</span>
                                </div>
                              </div>
                              <button
                                onClick={() => { setPromoCode(null); setPromoInput(""); }}
                                className="font-headline text-xs font-bold text-destructive hover:underline"
                              >
                                Retirer
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col xs:flex-row gap-2">
                              <input
                                value={promoInput}
                                onChange={e => { setPromoInput(e.target.value); setPromoError(""); }}
                                onKeyDown={e => e.key === "Enter" && applyPromo()}
                                placeholder="Ex: AGRUMEN10"
                                className="flex-1 rounded-sm border border-border/40 bg-white px-3.5 py-3 font-headline text-sm font-bold uppercase tracking-widest outline-none transition-all placeholder:text-on-surface-variant/40 placeholder:normal-case focus:border-foreground focus:ring-2 focus:ring-foreground/10"
                              />
                              <button
                                onClick={applyPromo}
                                className="w-full xs:w-auto px-5 py-3 rounded-sm bg-foreground text-white font-headline text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
                              >
                                Appliquer
                              </button>
                            </div>
                          )}
                          {promoError && (
                            <p className="mt-2 font-body text-xs text-destructive flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">error</span>
                              {promoError}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-3 rounded-sm border border-border/30 bg-surface-container p-4">
                          <span className="material-symbols-outlined shrink-0 text-on-surface-variant text-[18px] mt-0.5">info</span>
                          <p className="font-body text-xs leading-relaxed text-on-surface-variant">
                            Après confirmation, vous recevrez une notification{" "}
                            <strong className="text-foreground">{paymentMethod === "wave" ? "Wave" : "Orange Money"}</strong>{" "}
                            pour valider le paiement de{" "}
                            <strong className="text-foreground">{formatPrice(finalTotal)}</strong>.
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(3)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm bg-foreground py-4 font-headline text-base font-extrabold text-white shadow-sm transition-all hover:opacity-90 hover:scale-[0.99] active:scale-[0.97]"
                    >
                      Vérifier la commande
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                  </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.22 }} className="space-y-4">
                    <div className="flex items-start gap-4 rounded-sm border border-border/30 bg-white p-5 shadow-sm">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-foreground/8">
                        <span className="material-symbols-outlined text-foreground text-[18px]">location_on</span>
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">Livraison</span>
                          <button onClick={() => setStep(1)} className="font-headline text-xs font-bold text-foreground hover:underline">Modifier</button>
                        </div>
                        <p className="font-headline font-semibold text-sm">{address}</p>
                        <p className="font-body text-xs text-on-surface-variant">{city} · {phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-sm border border-border/30 bg-white p-5 shadow-sm">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-foreground/8">
                        <span className="material-symbols-outlined text-foreground text-[18px]">payments</span>
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">Paiement</span>
                          <button onClick={() => setStep(2)} className="font-headline text-xs font-bold text-foreground hover:underline">Modifier</button>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <img src={paymentMethod === "wave" ? waveLogo : orangeMoneyLogo} alt={paymentMethod} className="h-8 w-8 rounded-sm object-cover" />
                          <span className="font-headline text-sm font-semibold">
                            {paymentMethod === "wave" ? "Wave" : "Orange Money"}
                          </span>
                        </div>
                        {promoCode && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-foreground text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_offer</span>
                            <span className="font-headline text-xs font-bold text-foreground">{promoCode.code} — {promoCode.label}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-sm border border-border/30 bg-white shadow-sm">
                      <div className="border-b border-border/20 px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-foreground text-[18px]">shopping_basket</span>
                          <h3 className="font-headline text-sm font-bold">
                            Articles <span className="text-on-surface-variant">({items.length})</span>
                          </h3>
                        </div>
                      </div>
                      <div className="divide-y divide-border/20 max-h-[240px] overflow-y-auto">
                        {items.map(item => (
                          <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                            <img src={item.image} alt={item.name} className="h-14 w-14 shrink-0 rounded-sm object-cover" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-headline text-sm font-semibold">{item.name}</p>
                              <p className="font-body text-xs text-on-surface-variant">Qté : {item.quantity}</p>
                            </div>
                            <span className="font-headline text-sm font-bold whitespace-nowrap">
                              {formatPrice(item.priceNum * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleOrder}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-3 rounded-sm bg-foreground py-5 font-headline text-lg font-extrabold text-white shadow-sm transition-all hover:opacity-90 hover:scale-[0.99] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    >
                      {loading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[22px]">progress_activity</span>
                          Traitement en cours…
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_basket</span>
                          Confirmer · {formatPrice(finalTotal)}
                        </>
                      )}
                    </button>

                    <p className="text-center font-body text-xs text-on-surface-variant">
                      En confirmant, vous acceptez nos{" "}
                      <Link to="/" className="text-foreground hover:underline">conditions générales</Link>.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Récapitulatif — sticky with collapsible items */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="sticky top-20 overflow-hidden rounded-sm border border-border/30 bg-white shadow-sm">
                <div className="bg-surface-container-lowest px-5 py-4">
                  <h2 className="flex items-center gap-2 font-headline text-sm font-extrabold">
                    <span className="material-symbols-outlined text-foreground text-[18px]">receipt_long</span>
                    Récapitulatif
                  </h2>
                </div>

                {/* Dropdown toggle */}
                <button
                  onClick={() => setRecapOpen(!recapOpen)}
                  className="w-full flex items-center justify-between border-y border-border/20 px-5 py-3 hover:bg-surface-container-lowest transition-colors"
                >
                  <span className="font-body text-sm text-on-surface-variant">
                    {items.length} article{items.length > 1 ? "s" : ""} · {formatPrice(totalPrice)}
                  </span>
                  <span
                    className="material-symbols-outlined text-on-surface-variant text-[18px] transition-transform duration-200"
                    style={{ transform: recapOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    expand_more
                  </span>
                </button>

                {/* Items — collapsible, scrollable */}
                {recapOpen && (
                  <div className="divide-y divide-border/10 px-5 max-h-[280px] overflow-y-auto border-b border-border/20">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3 py-4">
                        <img src={item.image} alt={item.name} className="h-14 w-14 shrink-0 rounded-sm object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-headline text-sm font-semibold">{item.name}</p>
                          <p className="font-body text-xs text-on-surface-variant">{item.farmer}</p>
                          <p className="mt-0.5 font-body text-xs text-on-surface-variant">× {item.quantity}</p>
                        </div>
                        <span className="font-headline text-sm font-bold whitespace-nowrap">
                          {formatPrice(item.priceNum * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Totals — always visible */}
                <div className="bg-surface-container-lowest px-5 py-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-body text-on-surface-variant">Sous-total</span>
                    <span className="font-headline font-bold">{formatPrice(totalPrice)}</span>
                  </div>
                  {promoCode && (
                    <div className="flex justify-between text-sm">
                      <span className="font-body text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-foreground text-[14px]">local_offer</span>
                        {promoCode.code}
                      </span>
                      <span className="font-headline font-bold text-foreground">−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="font-body text-on-surface-variant">Livraison</span>
                    <span className="flex items-center gap-1 font-headline font-bold text-foreground">
                      <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                      Gratuite
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/20 pt-3">
                    <span className="font-headline font-extrabold">Total</span>
                    <span className="font-headline text-xl font-extrabold">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1.5 border-t border-border/10 px-5 py-4">
                  <span className="material-symbols-outlined text-on-surface-variant/60 text-[16px]">lock</span>
                  <span className="font-body text-[11px] text-on-surface-variant/60">Paiement 100% sécurisé</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile sticky bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/30 bg-white/90 px-4 backdrop-blur-xl lg:hidden" style={{ paddingTop: "12px", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-xs text-on-surface-variant">{items.length} article{items.length > 1 ? "s" : ""}</p>
              <p className="font-headline text-lg font-extrabold">{formatPrice(finalTotal)}</p>
            </div>
            <div className="flex items-center gap-1.5 font-headline text-xs font-bold text-foreground">
              <span className="material-symbols-outlined text-[15px]">local_shipping</span>
              Livraison gratuite
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
