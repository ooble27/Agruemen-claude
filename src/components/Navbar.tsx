import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { buildMarketCategories } from "@/data/marketplaceMocks";
import type { Category } from "@/types/database";
import { Leaf } from "lucide-react";

const Navbar = () => {
  const { totalItems, setIsOpen } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [marcheOpen, setMarcheOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const profileRef = useRef<HTMLDivElement>(null);
  const marcheRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const marcheTimeout = useRef<ReturnType<typeof setTimeout>>();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const accountPath = isAdmin ? "/admin" : "/mon-compte";

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => {
      if (data && data.length > 0) setCategories(data);
    });
  }, []);

  const displayCategories = buildMarketCategories(categories);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (marcheRef.current && !marcheRef.current.contains(e.target as Node)) setMarcheOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setMarcheOpen(false);
    setNotifOpen(false);
  }, [location.pathname, location.search]);

  const handleMarcheEnter = () => { clearTimeout(marcheTimeout.current); setMarcheOpen(true); };
  const handleMarcheLeave = () => { marcheTimeout.current = setTimeout(() => setMarcheOpen(false), 150); };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] safe-area-top">
        <div className="flex items-center px-4 md:px-8 lg:px-10 h-16 max-w-[1440px] mx-auto w-full gap-2">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-6">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-[18px] text-foreground tracking-tight leading-none">Agrumen</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">

            {/* Marché mega-menu */}
            <div ref={marcheRef} className="relative" onMouseEnter={handleMarcheEnter} onMouseLeave={handleMarcheLeave}>
              <button
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
                  isActive("/marche") || marcheOpen
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => setMarcheOpen(!marcheOpen)}
              >
                Marché
                <motion.span
                  animate={{ rotate: marcheOpen ? 180 : 0 }}
                  transition={{ duration: 0.18 }}
                  className="material-symbols-outlined text-[14px] leading-none"
                >
                  expand_more
                </motion.span>
              </button>

              <AnimatePresence>
                {marcheOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute left-0 top-full mt-3 bg-white rounded-2xl border border-border/30 shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden z-50"
                    style={{ width: "480px" }}
                    onMouseEnter={handleMarcheEnter}
                    onMouseLeave={handleMarcheLeave}
                  >
                    <div className="flex">
                      <div className="flex-1 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2 pb-3">
                          Catégories
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                          {displayCategories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/marche?cat=${cat.id}`}
                              onClick={() => setMarcheOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group hover:bg-muted"
                            >
                              <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                <span className="material-symbols-outlined text-[16px] text-muted-foreground" style={{ fontVariationSettings: "'FILL' 1" }}>
                                  {cat.icon || "eco"}
                                </span>
                              </div>
                              <div>
                                <p className="text-[13px] font-semibold text-foreground leading-tight">{cat.name}</p>
                                <p className="text-[10px] text-muted-foreground/60">Produits frais</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="w-44 bg-muted/40 p-4 border-l border-border/20">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2 pb-3">
                          Explorer
                        </p>
                        <div className="flex flex-col gap-0.5">
                          {[
                            { label: "Tous les produits", href: "/marche" },
                            { label: "Nouveautés", href: "/marche?sort=new" },
                            { label: "Populaires", href: "/marche?sort=popular" },
                          ].map(item => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setMarcheOpen(false)}
                              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user && (
              <Link
                to={accountPath}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
                  isActive("/mon-compte") || isActive("/admin")
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Mon Compte
              </Link>
            )}

            {user && isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
                  isActive("/admin")
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Notifications */}
            {user && (
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-[17px] h-[17px] bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl border border-border/30 shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden z-50"
                    >
                      <div className="px-4 py-3.5 border-b border-border/20 flex items-center justify-between">
                        <span className="font-bold text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                            Tout marquer lu
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-border/10">
                        {notifications.length === 0 ? (
                          <div className="py-12 text-center">
                            <span className="material-symbols-outlined text-3xl text-muted-foreground/20 block mb-2">notifications_none</span>
                            <p className="text-sm text-muted-foreground/50">Aucune notification</p>
                          </div>
                        ) : notifications.map(n => (
                          <button
                            key={n.id}
                            onClick={() => { markRead(n.id); if (n.order_id) navigate("/mes-commandes"); setNotifOpen(false); }}
                            className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${!n.read ? "bg-primary/[0.03]" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                              <div className={!n.read ? "" : "pl-5"}>
                                <p className="text-xs font-bold text-foreground">{n.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                                <p className="text-[10px] text-muted-foreground/50 mt-1">
                                  {new Date(n.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[17px] h-[17px] bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Desktop auth / profile */}
            <div className="hidden md:flex items-center gap-1.5 ml-1">
              {user ? (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {(user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <motion.span
                      animate={{ rotate: profileOpen ? 180 : 0 }}
                      transition={{ duration: 0.18 }}
                      className="material-symbols-outlined text-[14px] leading-none"
                    >
                      expand_more
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.14 }}
                        className="absolute right-0 top-full mt-3 w-52 bg-white rounded-2xl border border-border/30 shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden z-50"
                      >
                        <div className="px-4 py-3.5 border-b border-border/20">
                          <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{isAdmin ? "Administrateur" : "Acheteur"}</p>
                        </div>
                        <div className="p-1.5">
                          <Link
                            to={accountPath}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">person</span>
                            Mon Compte
                          </Link>
                          {!isAdmin && (
                            <Link
                              to="/mes-commandes"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                              Mes Commandes
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-border/20 p-1.5">
                          <button
                            onClick={() => { signOut(); setProfileOpen(false); }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/5 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            Déconnexion
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/auth"
                    className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Commencer
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined text-xl">{mobileOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-3 right-3 z-50 md:hidden bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.16)] overflow-hidden border border-border/20"
              style={{ top: "calc(env(safe-area-inset-top, 0px) + 68px)" }}
            >
              <div className="flex flex-col max-h-[80vh] overflow-y-auto">

                {user && (
                  <div className="flex items-center gap-3 px-4 py-4 border-b border-border/15 bg-muted/30">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {(user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                      <p className="text-[11px] text-muted-foreground">{isAdmin ? "Administrateur" : "Acheteur"}</p>
                    </div>
                  </div>
                )}

                <div className="p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-2 pb-2.5">Navigation</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Marché", href: "/marche", icon: "storefront" },
                      { label: "Nouveautés", href: "/marche?sort=new", icon: "new_releases" },
                    ].map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-3 rounded-xl transition-colors text-sm font-semibold ${
                          isActive(item.href) ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[17px] shrink-0 ${isActive(item.href) ? "text-white" : "text-muted-foreground/60"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                          {item.icon}
                        </span>
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {displayCategories.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/15">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-2 pb-2.5">Catégories</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {displayCategories.map(cat => (
                          <Link
                            key={cat.id}
                            to={`/marche?cat=${cat.id}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                          >
                            <span className="material-symbols-outlined text-[17px] shrink-0 text-muted-foreground/50" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {cat.icon || "eco"}
                            </span>
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-border/20 p-3 bg-muted/20">
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        to={accountPath}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-semibold text-sm"
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                        Mon Compte
                      </Link>
                      {!isAdmin && (
                        <Link
                          to="/mes-commandes"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border/40 text-muted-foreground font-semibold text-sm"
                        >
                          <span className="material-symbols-outlined text-base">receipt_long</span>
                          Mes Commandes
                        </Link>
                      )}
                      <button
                        onClick={() => { signOut(); setMobileOpen(false); }}
                        className="flex items-center justify-center gap-2 py-2.5 text-muted-foreground/60 font-semibold text-xs"
                      >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Déconnexion
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-semibold text-sm"
                    >
                      Connexion / Commencer
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
