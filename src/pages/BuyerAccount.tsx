import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { MOCK_PRODUCTS } from "@/data/marketplaceMocks";
import waveLogo from "@/assets/wave-logo.png";
import orangeMoneyLogo from "@/assets/orange-money-logo.png";
import { toast } from "sonner";
import type { Order } from "@/types/database";

type ActiveNav = "overview" | "orders" | "profile" | "addresses" | "wishlist";

const statusLabels: Record<string, { label: string; icon: string; color: string }> = {
  pending:   { label: "En attente",     icon: "schedule",       color: "bg-amber-50 text-amber-600 border border-amber-200" },
  confirmed: { label: "Confirmée",      icon: "check_circle",   color: "bg-emerald-50 text-emerald-600 border border-emerald-200" },
  preparing: { label: "En préparation", icon: "package_2",      color: "bg-blue-50 text-blue-600 border border-blue-200" },
  shipped:   { label: "En livraison",   icon: "local_shipping", color: "bg-indigo-50 text-indigo-600 border border-indigo-200" },
  delivered: { label: "Livrée",         icon: "verified",       color: "bg-primary-container text-primary-container-foreground border border-primary/20" },
  cancelled: { label: "Annulée",        icon: "cancel",         color: "bg-red-50 text-red-600 border border-red-200" },
};

const BuyerAccount = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [activeNav, setActiveNav]         = useState<ActiveNav>("overview");
  const [orders, setOrders]               = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const avatarInputRef                    = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl]         = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");
  const [city, setCity]         = useState("");
  const [address, setAddress]   = useState("");
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setCity(profile.city || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("address, avatar_url").eq("user_id", user.id).single()
      .then(({ data }) => {
        if (data) {
          setAddress(data.address || "");
          if (data.avatar_url) setAvatarUrl(data.avatar_url);
        }
      });
    supabase.from("orders").select("*").eq("buyer_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setOrders(data); setLoadingOrders(false); });
  }, [user]);

  const formatPrice = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({ full_name: fullName, phone, city, address }).eq("user_id", user.id);
      if (error) throw error;
      toast.success("Profil mis à jour !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    const ext  = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadErr) { toast.error("Erreur upload photo"); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("user_id", user.id);
    setAvatarUrl(urlData.publicUrl);
    toast.success("Photo de profil mise à jour !");
  };

  if (authLoading || !user) return null;

  const pendingCount   = orders.filter((o) => ["pending", "confirmed", "preparing"].includes(o.status)).length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const totalSpent     = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const recentOrders   = orders.slice(0, 3);
  const wishlistCount  = wishlist.length;
  const initial        = (profile?.full_name || user.email || "U").charAt(0).toUpperCase();

  const inputCls = "w-full bg-surface-container rounded-md px-4 py-3.5 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/15 focus:bg-white transition-all border border-transparent focus:border-border/30";

  const navItems: { id: ActiveNav; icon: string; label: string }[] = [
    { id: "overview",   icon: "dashboard",    label: "Aperçu" },
    { id: "orders",     icon: "receipt_long", label: "Commandes" },
    { id: "wishlist",   icon: "favorite",     label: "Favoris" },
    { id: "profile",    icon: "person",       label: "Profil" },
    { id: "addresses",  icon: "location_on",  label: "Adresses" },
  ];

  const sectionTitles: Record<ActiveNav, string> = {
    overview: "Mon Compte",
    orders: "Mes Commandes",
    wishlist: "Mes Favoris",
    profile: "Mon Profil",
    addresses: "Mes Adresses",
  };

  /* ─── Menu row component (iOS-style) ─── */
  const MenuRow = ({
    icon, label, sub, badge, onClick, danger = false,
  }: { icon: string; label: string; sub?: string; badge?: number | string; onClick: () => void; danger?: boolean }) => (
    <button
      onClick={onClick}
      className="flex items-center w-full px-5 py-4 bg-white border-b border-border/10 last:border-0 cursor-pointer active:bg-surface-container transition-colors"
    >
      <div className={`w-9 h-9 rounded-md flex items-center justify-center mr-4 shrink-0 ${danger ? "bg-red-50" : "bg-surface-container"}`}>
        <span
          className={`material-symbols-outlined text-[18px] ${danger ? "text-red-500" : "text-foreground/60"}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className={`font-headline font-bold text-sm ${danger ? "text-red-500" : "text-foreground"}`}>{label}</p>
        {sub && <p className="font-body text-xs text-on-surface-variant mt-0.5">{sub}</p>}
      </div>
      {badge !== undefined && badge !== 0 && (
        <span className="bg-foreground text-white text-[10px] font-bold px-2 py-0.5 rounded-full mr-2 shrink-0">
          {badge}
        </span>
      )}
      {!danger && (
        <span className="material-symbols-outlined text-on-surface-variant/30 text-xl shrink-0">chevron_right</span>
      )}
    </button>
  );

  /* ─── Section block header ─── */
  const SectionHeader = ({ title }: { title: string }) => (
    <p className="font-headline text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/50 px-5 pt-6 pb-2">
      {title}
    </p>
  );

  /* ─────────────── SECTION RENDERERS ─────────────── */

  const renderOverview = () => (
    <div className="pb-24 lg:pb-8">
      {/* Profile block — mobile only */}
      <div className="lg:hidden">
        <div className="flex items-center gap-4 px-5 py-5 bg-white border-b border-border/10">
          <button
            onClick={() => avatarInputRef.current?.click()}
            className="relative w-16 h-16 rounded-md overflow-hidden bg-foreground flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Modifier la photo"
          >
            {avatarUrl
              ? <img src={avatarUrl} alt="Profil" className="w-full h-full object-cover" />
              : <span className="font-headline font-black text-2xl text-white">{initial}</span>
            }
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
            </div>
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-headline font-black text-lg truncate">{profile?.full_name || "Mon Compte"}</p>
            <p className="font-body text-xs text-on-surface-variant truncate mt-0.5">{user.email}</p>
            <span className="inline-block mt-1.5 font-headline text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant bg-surface-container px-2 py-0.5">
              Acheteur
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 border-b border-border/10">
          {[
            { label: "Commandes", value: String(orders.length) },
            { label: "En cours",  value: String(pendingCount) },
            { label: "Livrées",   value: String(deliveredCount) },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center py-4 bg-white border-r border-border/10 last:border-0">
              <span className="font-headline font-black text-2xl">{s.value}</span>
              <span className="font-body text-[10px] text-on-surface-variant mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Total dépensé */}
        {totalSpent > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 bg-foreground/[0.03] border-b border-border/10">
            <span className="font-body text-xs text-on-surface-variant">Total dépensé</span>
            <span className="font-headline font-extrabold text-sm">{formatPrice(totalSpent)}</span>
          </div>
        )}

        {/* Menu navigation */}
        <SectionHeader title="Mes achats" />
        <div className="bg-white border-t border-border/10">
          <MenuRow
            icon="receipt_long"
            label="Mes Commandes"
            sub={pendingCount > 0 ? `${pendingCount} en cours` : `${orders.length} commandes`}
            badge={pendingCount}
            onClick={() => setActiveNav("orders")}
          />
          <MenuRow
            icon="favorite"
            label="Mes Favoris"
            sub={`${wishlistCount} produit${wishlistCount !== 1 ? "s" : ""} sauvegardé${wishlistCount !== 1 ? "s" : ""}`}
            badge={wishlistCount}
            onClick={() => setActiveNav("wishlist")}
          />
        </div>

        <SectionHeader title="Mon profil" />
        <div className="bg-white border-t border-border/10">
          <MenuRow
            icon="person"
            label="Mes Informations"
            sub="Nom, téléphone, ville"
            onClick={() => setActiveNav("profile")}
          />
          <MenuRow
            icon="location_on"
            label="Mes Adresses"
            sub="Adresse de livraison"
            onClick={() => setActiveNav("addresses")}
          />
        </div>

        <SectionHeader title="Paramètres" />
        <div className="bg-white border-t border-border/10">
          <MenuRow
            icon="logout"
            label="Déconnexion"
            onClick={() => { signOut(); navigate("/"); }}
            danger
          />
        </div>
      </div>

      {/* Desktop overview */}
      <div className="hidden lg:block space-y-6 mt-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: "payments",      label: "Total dépensé", value: formatPrice(totalSpent), accent: true },
            { icon: "receipt_long",  label: "Commandes",     value: String(orders.length),   accent: false },
            { icon: "hourglass_top", label: "En cours",      value: String(pendingCount),    accent: false },
            { icon: "verified",      label: "Livrées",        value: String(deliveredCount),  accent: false },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className={`rounded-md p-5 flex flex-col gap-3 ${
                stat.accent ? "bg-primary-container" : "bg-surface-container-lowest border border-border/20"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-lg ${stat.accent ? "text-primary-container-foreground/60" : "text-on-surface-variant/60"}`}>
                  {stat.icon}
                </span>
                <span className={`font-headline text-[10px] font-bold uppercase tracking-[0.15em] ${stat.accent ? "text-primary-container-foreground/60" : "text-on-surface-variant"}`}>
                  {stat.label}
                </span>
              </div>
              <div className={`font-headline font-black text-xl md:text-2xl tracking-tight ${stat.accent ? "text-primary-container-foreground" : "text-foreground"}`}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-md border border-border/20 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/15">
              <h3 className="font-headline font-extrabold text-base">Commandes récentes</h3>
              <button onClick={() => setActiveNav("orders")} className="font-headline text-xs font-bold text-on-surface-variant hover:text-foreground transition-colors cursor-pointer">
                Voir tout →
              </button>
            </div>
            {loadingOrders ? (
              <div className="py-12 flex justify-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant animate-spin">progress_activity</span>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-12 text-center px-6">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 block mb-3">shopping_bag</span>
                <p className="font-headline font-bold text-sm mb-1">Aucune commande</p>
                <Link to="/marche" className="inline-block bg-foreground text-white px-5 py-2.5 rounded-md font-headline font-bold text-xs hover:opacity-90 transition-opacity mt-2">
                  Explorer le Marché
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border/10">
                {recentOrders.map((order) => {
                  const s = statusLabels[order.status] || statusLabels.pending;
                  return (
                    <div key={order.id} className="flex items-center justify-between gap-3 px-5 py-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-headline text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">#{order.id.slice(0, 8)}</p>
                        <p className="font-headline font-extrabold text-base mt-0.5">{formatPrice(order.total)}</p>
                        <p className="font-body text-xs text-on-surface-variant">
                          {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${s.color}`}>
                        <span className="material-symbols-outlined text-[12px]">{s.icon}</span>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-headline font-extrabold text-base">Actions rapides</h3>
            {[
              { label: "Explorer le Marché",  sub: "Produits frais locaux",    icon: "storefront",   action: () => navigate("/marche") },
              { label: "Modifier mon Profil",  sub: "Infos & préférences",      icon: "edit",         action: () => setActiveNav("profile") },
              { label: "Photo de profil",      sub: "Personnaliser le compte",  icon: "photo_camera", action: () => avatarInputRef.current?.click() },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="flex items-center gap-4 bg-surface-container-lowest border border-border/20 rounded-md p-4 hover:bg-surface-container transition-colors cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-md bg-surface-container-high flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant">{item.icon}</span>
                </div>
                <div>
                  <p className="font-headline font-bold text-sm">{item.label}</p>
                  <p className="font-body text-xs text-on-surface-variant">{item.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-3 px-4 lg:px-0 pt-4 pb-24 lg:pb-8">
      {loadingOrders ? (
        <div className="py-16 flex justify-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-spin">progress_activity</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-md border border-border/20">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 block mb-3">receipt_long</span>
          <p className="font-headline font-bold text-base mb-1">Aucune commande</p>
          <p className="font-body text-on-surface-variant text-sm mb-5">Vos commandes apparaîtront ici.</p>
          <Link to="/marche" className="inline-block bg-foreground text-white px-6 py-3 rounded-md font-headline font-bold text-sm hover:opacity-90 transition-opacity">
            Découvrir le Marché
          </Link>
        </div>
      ) : (
        orders.map((order, i) => {
          const s = statusLabels[order.status] || statusLabels.pending;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white border border-border/20 rounded-md p-5"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <p className="font-headline text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    Commande #{order.id.slice(0, 8)}
                  </p>
                  <p className="font-headline font-extrabold text-xl mt-1">{formatPrice(order.total)}</p>
                  <p className="font-body text-sm text-on-surface-variant mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <span className={`self-start px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${s.color}`}>
                  <span className="material-symbols-outlined text-sm">{s.icon}</span>
                  {s.label}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 font-body text-sm text-on-surface-variant">
                {order.payment_method && (
                  <span className="flex items-center gap-1.5">
                    <img src={order.payment_method === "wave" ? waveLogo : orangeMoneyLogo} alt="" className="w-4 h-4 rounded-sm object-cover" />
                    {order.payment_method === "wave" ? "Wave" : "Orange Money"}
                  </span>
                )}
                {order.shipping_city && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    {order.shipping_city}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="px-4 lg:px-0 pt-4 pb-24 lg:pb-8 max-w-lg">
      <div className="bg-white rounded-md border border-border/20 p-6 space-y-4">
        <div>
          <label className="font-headline text-[10px] font-bold text-on-surface-variant mb-1.5 block uppercase tracking-wider">Nom complet</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="font-headline text-[10px] font-bold text-on-surface-variant mb-1.5 block uppercase tracking-wider">Email</label>
          <input value={user.email || ""} disabled className={`${inputCls} opacity-50 cursor-not-allowed`} />
        </div>
        <div>
          <label className="font-headline text-[10px] font-bold text-on-surface-variant mb-1.5 block uppercase tracking-wider">Téléphone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="77 000 00 00" type="tel" className={inputCls} />
        </div>
        <div>
          <label className="font-headline text-[10px] font-bold text-on-surface-variant mb-1.5 block uppercase tracking-wider">Ville</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dakar" className={inputCls} />
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-full bg-foreground text-white py-3.5 rounded-md font-headline font-extrabold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer mt-2"
        >
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>
    </div>
  );

  const renderAddresses = () => (
    <div className="px-4 lg:px-0 pt-4 pb-24 lg:pb-8 max-w-lg">
      <div className="bg-white rounded-md border border-border/20 p-6 space-y-4">
        <div>
          <label className="font-headline text-[10px] font-bold text-on-surface-variant mb-1.5 block uppercase tracking-wider">Adresse principale</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="Votre adresse complète de livraison"
            className={`${inputCls} resize-none`}
          />
        </div>
        <div>
          <label className="font-headline text-[10px] font-bold text-on-surface-variant mb-1.5 block uppercase tracking-wider">Ville</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dakar" className={inputCls} />
        </div>
        <div>
          <label className="font-headline text-[10px] font-bold text-on-surface-variant mb-1.5 block uppercase tracking-wider">Téléphone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="77 000 00 00" type="tel" className={inputCls} />
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-full bg-foreground text-white py-3.5 rounded-md font-headline font-extrabold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer mt-2"
        >
          {saving ? "Enregistrement..." : "Enregistrer l'adresse"}
        </button>
      </div>
    </div>
  );

  const renderWishlist = () => {
    const wishlistProducts = MOCK_PRODUCTS.filter((p) => wishlist.includes(p.id));
    return (
      <div className="px-4 lg:px-0 pt-4 pb-24 lg:pb-8">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-md border border-border/20">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 block mb-4">favorite_border</span>
            <p className="font-headline font-bold text-base mb-1">Aucun favori</p>
            <p className="font-body text-on-surface-variant text-sm mb-5">Cliquez sur le ♡ pour sauvegarder</p>
            <Link to="/marche" className="inline-flex items-center gap-2 bg-foreground text-white px-6 py-3 rounded-md font-headline font-bold text-sm hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-lg">storefront</span>
              Explorer le Marché
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="bg-white border border-border/20 rounded-md overflow-hidden group">
                <Link to={`/produit/${product.id}`} className="block relative aspect-square overflow-hidden">
                  <img src={product.image_url || ""} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button
                    onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-md bg-white/90 flex items-center justify-center shadow-sm cursor-pointer"
                    aria-label="Retirer des favoris"
                  >
                    <span className="material-symbols-outlined text-red-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </button>
                </Link>
                <div className="p-3">
                  <p className="font-headline text-sm font-bold truncate">{product.name}</p>
                  <p className="font-headline text-base font-extrabold text-foreground mt-0.5">
                    {product.price.toLocaleString("fr-FR")}{" "}
                    <span className="text-xs font-normal text-on-surface-variant">FCFA</span>
                  </p>
                  <button
                    onClick={() => {
                      addItem({ id: product.id, name: product.name, price: product.price.toLocaleString("fr-FR") + " FCFA", priceNum: product.price, unit: product.unit, image: product.image_url || "", farmer: product.shops?.name || "Agrumen", shopId: product.shop_id });
                      toast.success(`${product.name} ajouté au panier`);
                    }}
                    className="mt-2 w-full py-2 rounded-md bg-foreground/8 text-foreground font-headline text-xs font-bold hover:bg-foreground hover:text-white transition-all cursor-pointer"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeNav) {
      case "orders":    return renderOrders();
      case "wishlist":  return renderWishlist();
      case "profile":   return renderProfile();
      case "addresses": return renderAddresses();
      default:          return renderOverview();
    }
  };

  const currentNavLabel = sectionTitles[activeNav];

  return (
    <div className="min-h-screen bg-surface-container font-body">

      {/* ── Desktop sidebar ── */}
      <aside
        className="fixed left-0 top-0 h-screen w-64 bg-background hidden lg:flex flex-col p-6 gap-6 z-40 border-r border-border/25"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1.5rem)" }}
      >
        {/* Avatar + name */}
        <div className="flex items-center gap-3 px-1">
          <button
            onClick={() => avatarInputRef.current?.click()}
            className="relative w-11 h-11 rounded-md overflow-hidden bg-surface-container-high flex items-center justify-center group shrink-0 cursor-pointer"
            aria-label="Changer la photo de profil"
          >
            {avatarUrl
              ? <img src={avatarUrl} alt="Profil" className="w-full h-full object-cover" />
              : <span className="font-headline font-black text-lg text-on-surface-variant">{initial}</span>
            }
            <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
            </div>
          </button>
          <div className="min-w-0">
            <p className="font-headline font-extrabold text-sm truncate">{profile?.full_name || "Mon Compte"}</p>
            <span className="font-headline text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Acheteur</span>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5 flex-grow">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md font-headline font-bold text-sm transition-all duration-150 cursor-pointer ${
                activeNav === item.id
                  ? "bg-foreground text-white shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-foreground"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${activeNav === item.id ? "text-white" : ""}`}
                style={{ fontVariationSettings: activeNav === item.id ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => { signOut(); navigate("/"); }}
          className="flex items-center gap-3 px-4 py-3 text-destructive font-headline font-bold text-sm hover:bg-destructive/8 rounded-md transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          Déconnexion
        </button>
      </aside>

      {/* ── Main content ── */}
      <main className="lg:ml-64 min-h-screen">

        {/* Desktop top header */}
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl px-6 md:px-10 py-4 border-b border-border/20 hidden lg:flex items-center justify-between">
          <h2 className="font-headline font-bold text-lg text-foreground">{currentNavLabel}</h2>
          <Link to="/marche" className="flex items-center gap-2 text-sm font-headline font-bold text-on-surface-variant hover:text-foreground transition-colors">
            <span className="material-symbols-outlined text-lg">storefront</span>
            Marché
          </Link>
        </header>

        {/* Desktop page title */}
        <div className="hidden lg:block px-6 md:px-10 pt-8 pb-2">
          <h1 className="font-headline font-black text-3xl tracking-tight">
            {activeNav === "overview"
              ? `Bonjour, ${profile?.full_name?.split(" ")[0] || "vous"}`
              : currentNavLabel}
          </h1>
        </div>

        {/* Desktop content */}
        <div className="hidden lg:block px-5 md:px-10">
          {renderContent()}
        </div>

        {/* ── Mobile layout ── */}
        <div className="lg:hidden">
          {/* Mobile sticky header */}
          <div
            className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border/15 flex items-center gap-3 px-4"
            style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)", paddingBottom: "12px" }}
          >
            {activeNav !== "overview" ? (
              <button
                onClick={() => setActiveNav("overview")}
                className="w-9 h-9 flex items-center justify-center rounded-md border border-border/30 bg-white cursor-pointer shrink-0"
                aria-label="Retour"
              >
                <span className="material-symbols-outlined text-[18px] text-foreground">arrow_back</span>
              </button>
            ) : (
              <div className="w-9 h-9 shrink-0" />
            )}
            <h1 className="font-headline font-black text-lg flex-1 tracking-tight">{currentNavLabel}</h1>
            {activeNav === "overview" && (
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="w-9 h-9 rounded-md overflow-hidden bg-foreground flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Photo de profil"
              >
                {avatarUrl
                  ? <img src={avatarUrl} alt="Profil" className="w-full h-full object-cover" />
                  : <span className="font-headline font-black text-sm text-white">{initial}</span>
                }
              </button>
            )}
          </div>

          {/* Mobile content with animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNav}
              initial={{ opacity: 0, x: activeNav === "overview" ? -12 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Hidden file input */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); }}
      />
    </div>
  );
};

export default BuyerAccount;
