import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  pending: { label: "En attente", icon: "schedule", color: "bg-tertiary/15 text-tertiary" },
  confirmed: { label: "Confirmée", icon: "check_circle", color: "bg-primary/15 text-primary" },
  preparing: { label: "En préparation", icon: "package_2", color: "bg-primary/15 text-primary" },
  shipped: { label: "En livraison", icon: "local_shipping", color: "bg-primary/20 text-primary" },
  delivered: { label: "Livrée", icon: "verified", color: "bg-primary-container text-primary-container-foreground" },
  cancelled: { label: "Annulée", icon: "cancel", color: "bg-destructive/10 text-destructive" },
};

const BuyerAccount = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<ActiveNav>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Profile edit state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

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
      const { error } = await supabase.from("profiles").update({
        full_name: fullName, phone, city, address,
      }).eq("user_id", user.id);
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
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadErr) { toast.error("Erreur upload photo"); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("user_id", user.id);
    setAvatarUrl(urlData.publicUrl);
    toast.success("Photo de profil mise à jour !");
  };

  if (authLoading || !user) return null;

  const recentOrders = orders.slice(0, 3);
  const pendingCount = orders.filter(o => o.status === "pending" || o.status === "confirmed" || o.status === "preparing").length;
  const deliveredCount = orders.filter(o => o.status === "delivered").length;
  const totalSpent = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  const navItems = [
    { id: "overview" as ActiveNav, icon: "dashboard", label: "Aperçu" },
    { id: "orders" as ActiveNav, icon: "receipt_long", label: "Commandes" },
    { id: "wishlist" as ActiveNav, icon: "favorite", label: "Favoris" },
    { id: "profile" as ActiveNav, icon: "person", label: "Profil" },
    { id: "addresses" as ActiveNav, icon: "location_on", label: "Adresses" },
  ];

  // ====== SECTION RENDERERS ======

  const renderOverview = () => (
    <>
      <div className="mb-10 mt-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Bonjour, {profile?.full_name || "Acheteur"}</h1>
        <p className="text-on-surface-variant mt-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">person</span>
          Compte Acheteur
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
        <div className="bg-primary-container p-5 md:p-7 rounded-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary-container-foreground/60 text-xl">payments</span>
            <span className="text-[9px] md:text-[10px] font-extrabold text-primary-container-foreground/60 uppercase tracking-[0.15em]">Dépensé</span>
          </div>
          <div className="text-xl md:text-3xl font-black text-primary-container-foreground">{formatPrice(totalSpent)}</div>
        </div>
        <div className="bg-surface-container-lowest p-5 md:p-7 rounded-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">receipt_long</span>
            <span className="text-[9px] md:text-[10px] font-extrabold text-on-surface-variant uppercase tracking-[0.15em]">Commandes</span>
          </div>
          <div className="text-xl md:text-3xl font-black text-foreground">{orders.length}</div>
        </div>
        <div className="bg-surface-container-lowest p-5 md:p-7 rounded-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">hourglass_top</span>
            <span className="text-[9px] md:text-[10px] font-extrabold text-on-surface-variant uppercase tracking-[0.15em]">En cours</span>
          </div>
          <div className="text-xl md:text-3xl font-black text-foreground">{pendingCount}</div>
        </div>
        <div className="bg-surface-container-lowest p-5 md:p-7 rounded-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">verified</span>
            <span className="text-[9px] md:text-[10px] font-extrabold text-on-surface-variant uppercase tracking-[0.15em]">Livrées</span>
          </div>
          <div className="text-xl md:text-3xl font-black text-foreground">{deliveredCount}</div>
        </div>
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 md:p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-extrabold">Commandes récentes</h3>
            <button onClick={() => setActiveNav("orders")} className="text-xs font-bold text-primary hover:underline">
              Voir tout →
            </button>
          </div>
          {loadingOrders ? (
            <div className="py-12 text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant animate-spin">progress_activity</span>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-12 text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3">shopping_bag</span>
              <p className="font-headline font-bold text-sm mb-1">Aucune commande</p>
              <p className="text-on-surface-variant text-xs mb-4">Découvrez nos produits frais !</p>
              <Link to="/marche" className="inline-block bg-primary-container text-primary-container-foreground px-5 py-2.5 rounded-full font-bold text-xs hover:scale-95 transition-transform">
                Explorer le Marché
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border/15">
              {recentOrders.map(order => {
                const s = statusLabels[order.status] || statusLabels.pending;
                return (
                  <div key={order.id} className="py-4 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                        #{order.id.slice(0, 8)}
                      </div>
                      <div className="font-headline font-extrabold text-base mt-0.5">{formatPrice(order.total)}</div>
                      <div className="text-xs text-on-surface-variant">
                        {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <span className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${s.color}`}>
                      <span className="material-symbols-outlined text-xs">{s.icon}</span>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-extrabold">Actions Rapides</h3>
          <Link to="/marche" className="w-full flex items-center gap-4 bg-surface-container-lowest p-5 rounded-3xl hover:bg-surface-container-low transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary-container-foreground">storefront</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-sm">Explorer le Marché</div>
              <div className="text-xs text-on-surface-variant">Produits frais locaux</div>
            </div>
          </Link>
          <button onClick={() => setActiveNav("profile")} className="w-full flex items-center gap-4 bg-surface-container-lowest p-5 rounded-3xl hover:bg-surface-container-low transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">edit</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-sm">Modifier mon Profil</div>
              <div className="text-xs text-on-surface-variant">Infos & préférences</div>
            </div>
          </button>
          <button onClick={() => avatarInputRef.current?.click()} className="w-full flex items-center gap-4 bg-surface-container-lowest p-5 rounded-3xl hover:bg-surface-container-low transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">photo_camera</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-sm">Photo de profil</div>
              <div className="text-xs text-on-surface-variant">Personnalisez votre compte</div>
            </div>
          </button>
        </div>
      </div>
    </>
  );

  const renderOrders = () => (
    <>
      <h2 className="text-2xl font-extrabold tracking-tight mb-6 mt-8">Toutes mes commandes</h2>
      {loadingOrders ? (
        <div className="py-16 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-spin">progress_activity</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-3xl">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">receipt_long</span>
          <p className="font-headline font-bold text-base mb-1">Aucune commande</p>
          <p className="text-on-surface-variant text-sm mb-5">Vos commandes apparaîtront ici.</p>
          <Link to="/marche" className="inline-block bg-primary-container text-primary-container-foreground px-6 py-3 rounded-full font-bold text-sm hover:scale-95 transition-transform">
            Découvrir le Marché
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => {
            const s = statusLabels[order.status] || statusLabels.pending;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-surface-container-lowest rounded-3xl p-5"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div>
                    <div className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                      Commande #{order.id.slice(0, 8)}
                    </div>
                    <div className="text-xl font-headline font-extrabold mt-1">{formatPrice(order.total)}</div>
                    <div className="text-sm text-on-surface-variant mt-1">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  </div>
                  <span className={`self-start px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${s.color}`}>
                    <span className="material-symbols-outlined text-sm">{s.icon}</span>
                    {s.label}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
                  {order.payment_method && (
                    <span className="flex items-center gap-1.5">
                      <img
                        src={order.payment_method === "wave" ? waveLogo : orangeMoneyLogo}
                        alt=""
                        className="w-4 h-4 rounded-full object-cover"
                      />
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
          })}
        </div>
      )}
    </>
  );

  const renderProfile = () => (
    <div className="max-w-lg mt-8">
      <h2 className="text-2xl font-extrabold tracking-tight mb-6">Mon Profil</h2>
      <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 space-y-4">
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1.5 block uppercase tracking-wider">Nom complet</label>
          <input
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full bg-surface-container-low rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary-container text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1.5 block uppercase tracking-wider">Email</label>
          <input
            value={user.email || ""}
            disabled
            className="w-full bg-surface-container-low rounded-2xl p-4 text-sm opacity-60 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1.5 block uppercase tracking-wider">Téléphone</label>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="77 000 00 00"
            type="tel"
            className="w-full bg-surface-container-low rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary-container text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1.5 block uppercase tracking-wider">Ville</label>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Dakar"
            className="w-full bg-surface-container-low rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary-container text-sm"
          />
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-full bg-primary-container text-primary-container-foreground py-4 rounded-full font-headline font-extrabold text-sm hover:scale-[0.97] transition-transform disabled:opacity-50 mt-2"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );

  const renderAddresses = () => (
    <div className="max-w-lg mt-8">
      <h2 className="text-2xl font-extrabold tracking-tight mb-6">Mes Adresses</h2>
      <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 space-y-4">
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1.5 block uppercase tracking-wider">Adresse principale</label>
          <textarea
            value={address}
            onChange={e => setAddress(e.target.value)}
            rows={3}
            placeholder="Votre adresse complète de livraison"
            className="w-full bg-surface-container-low rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary-container text-sm resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1.5 block uppercase tracking-wider">Ville</label>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Dakar"
            className="w-full bg-surface-container-low rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary-container text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-on-surface-variant mb-1.5 block uppercase tracking-wider">Téléphone</label>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="77 000 00 00"
            type="tel"
            className="w-full bg-surface-container-low rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary-container text-sm"
          />
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-full bg-primary-container text-primary-container-foreground py-4 rounded-full font-headline font-extrabold text-sm hover:scale-[0.97] transition-transform disabled:opacity-50 mt-2"
        >
          {saving ? "Enregistrement..." : "Enregistrer l'adresse"}
        </button>
      </div>
    </div>
  );

  const renderWishlist = () => {
    const wishlistProducts = MOCK_PRODUCTS.filter(p => wishlist.includes(p.id));
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Mes Favoris</h2>
          <span className="bg-primary/10 text-primary text-xs font-headline font-bold px-3 py-1 rounded-full">
            {wishlistProducts.length} produit{wishlistProducts.length !== 1 ? "s" : ""}
          </span>
        </div>
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-3xl">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">favorite_border</span>
            <p className="font-headline font-bold text-base mb-1">Aucun favori pour l'instant</p>
            <p className="text-on-surface-variant text-sm mb-5">Cliquez sur le ♡ pour sauvegarder des produits</p>
            <Link to="/marche" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-headline font-bold text-sm hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-lg">storefront</span>
              Explorer le Marché
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {wishlistProducts.map(product => (
              <div key={product.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden group">
                <Link to={`/produit/${product.id}`} className="block relative aspect-square overflow-hidden">
                  <img src={product.image_url || ""} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button
                    onClick={e => { e.preventDefault(); toggleWishlist(product.id); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
                  >
                    <span className="material-symbols-outlined text-destructive text-base" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </button>
                </Link>
                <div className="p-3">
                  <p className="font-headline text-sm font-bold truncate">{product.name}</p>
                  <p className="font-headline text-base font-extrabold text-primary mt-0.5">
                    {product.price.toLocaleString("fr-FR")} <span className="text-xs font-normal text-on-surface-variant">FCFA</span>
                  </p>
                  <button
                    onClick={() => {
                      addItem({ id: product.id, name: product.name, price: product.price.toLocaleString("fr-FR") + " FCFA", priceNum: product.price, unit: product.unit, image: product.image_url || "", farmer: product.shops?.name || "Agrumen", shopId: product.shop_id });
                      toast.success(`${product.name} ajouté au panier`);
                    }}
                    className="mt-2 w-full py-2 rounded-xl bg-primary/10 text-primary font-headline text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all"
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
      case "orders": return renderOrders();
      case "wishlist": return renderWishlist();
      case "profile": return renderProfile();
      case "addresses": return renderAddresses();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-background font-body flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`h-screen w-72 fixed left-0 top-0 bg-background font-headline flex flex-col p-8 gap-8 z-50 border-r border-border/30 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 2rem)" }}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground leading-tight">
              {profile?.full_name || "Mon Compte"}
            </h2>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Acheteur</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-grow">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                activeNav === item.id
                  ? "bg-primary-container text-primary-container-foreground shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-foreground"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button onClick={() => { signOut(); navigate("/"); }} className="flex items-center gap-3 px-5 py-3.5 text-destructive font-bold hover:bg-destructive/10 rounded-2xl transition-colors text-sm">
          <span className="material-symbols-outlined text-xl">logout</span>
          Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 flex-1 min-h-screen">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl px-5 md:px-10 py-4 md:py-5 flex items-center justify-between border-b border-border/20 safe-area-top">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-full hover:bg-surface-container">
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <h3 className="text-lg font-headline font-bold text-on-surface-variant">
              {navItems.find(n => n.id === activeNav)?.label || "Mon Compte"}
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/marche" className="hidden md:flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-foreground transition-colors">
              <span className="material-symbols-outlined text-lg">storefront</span>
              Marché
            </Link>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="relative w-10 h-10 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center group"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              )}
              <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
              </div>
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { const file = e.target.files?.[0]; if (file) handleAvatarUpload(file); }}
            />
          </div>
        </header>

        <div className="px-5 md:px-10 pb-12">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default BuyerAccount;
