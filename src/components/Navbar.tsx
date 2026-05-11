import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { buildMarketCategories } from "@/data/marketplaceMocks";
import type { Category } from "@/types/database";

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
      <nav className="fixed top-0 w-full z-50 bg-background border-b border-border safe-area-top">
        <div className="flex items-center px-5 md:px-8 lg:px-10 py-2.5 max-w-[1440px] mx-auto w-full gap-1">

          {/* Logo */}
          <Link to="/" className="font-headline font-black text-xl tracking-tighter text-foreground shrink-0 mr-6">
            Agrumen
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">

            {/* Marché mega-menu */}
            <div ref={marcheRef} className="relative" onMouseEnter={handleMarcheEnter} onMouseLeave={handleMarcheLeave}>
              <button
                className={`flex items-center gap-1 px-3.5 py-2 rounded-sm text-[13px] font-bold transition-all duration-150 ${
                  isActive("/marche") || marcheOpen
                    ? "bg-foreground text-white"
                    : "text-on-surface-variant hover:text-foreground hover:bg-surface-container"
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
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.14, ease: "easeOut" }}
                    className="absolute left-0 top-full mt-2.5 bg-background rounded-sm border border-border/50 shadow-[0_16px_40px_rgba(0,0,0,0.12)] overflow-hidden z-50"
                    style={{ width: "480px" }}
                    onMouseEnter={handleMarcheEnter}
                    onMouseLeave={handleMarcheLeave}
                  >
                    <div className="flex">
                      {/* Categories */}
                      <div className="flex-1 p-3">
                        <p className="font-headline text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 px-2 pb-2">
                          Catégories
                        </p>
                        <div className="grid grid-cols-2 gap-0.5">
                          {displayCategories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/marche?cat=${cat.id}`}
                              onClick={() => setMarcheOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors group hover:bg-surface-container"
                            >
                              <div className="w-7 h-7 rounded-sm bg-surface-container flex items-center justify-center shrink-0 group-hover:bg-foreground/8 transition-colors">
                                <span className="material-symbols-outlined text-[15px] text-on-surface-variant/60" style={{ fontVariationSettings: "'FILL' 1" }}>
                                  {cat.icon || "eco"}
                                </span>
                              </div>
                              <div>
                                <p className="font-headline text-[13px] font-bold text-foreground leading-tight">{cat.name}</p>
                                <p className="font-body text-[10px] text-on-surface-variant/60">Produits frais</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Explorer */}
                      <div className="w-40 bg-surface-container/30 p-3 border-l border-border/20">
                        <p className="font-headline text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 px-2 pb-2">
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
                              className="px-2 py-2.5 rounded-sm font-headline text-[13px] font-bold text-on-surface-variant hover:text-foreground hover:bg-surface-container transition-colors"
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
                className={`px-3.5 py-2 rounded-sm text-[13px] font-bold transition-all duration-150 ${
                  isActive("/mon-compte") || isActive("/admin")
                    ? "bg-foreground text-white"
                    : "text-on-surface-variant hover:text-foreground hover:bg-surface-container"
                }`}
              >
                Mon Compte
              </Link>
            )}

            {user && isAdmin && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-sm text-[13px] font-bold transition-all duration-150 ${
                  isActive("/admin")
                    ? "bg-foreground text-white"
                    : "text-on-surface-variant hover:text-foreground hover:bg-surface-container"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 ml-auto">

            {/* Notifications */}
            {user && (
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative w-9 h-9 flex items-center justify-center rounded-sm text-on-surface-variant hover:text-foreground hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] bg-foreground text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-2.5 w-80 bg-background rounded-sm border border-border/50 shadow-[0_16px_40px_rgba(0,0,0,0.12)] overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-border/20 flex items-center justify-between">
                        <span className="font-headline text-sm font-black">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="font-headline text-xs font-bold text-on-surface-variant hover:text-foreground transition-colors">
                            Tout marquer lu
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-border/10">
                        {notifications.length === 0 ? (
                          <div className="py-12 text-center">
                            <span className="material-symbols-outlined text-3xl text-on-surface-variant/20 block mb-2">notifications_none</span>
                            <p className="font-body text-sm text-on-surface-variant/50">Aucune notification</p>
                          </div>
                        ) : notifications.map(n => (
                          <button
                            key={n.id}
                            onClick={() => { markRead(n.id); if (n.order_id) navigate("/mes-commandes"); setNotifOpen(false); }}
                            className={`w-full text-left px-4 py-3 hover:bg-surface-container transition-colors ${!n.read ? "bg-foreground/[0.02]" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 shrink-0" />}
                              <div className={!n.read ? "" : "pl-4"}>
                                <p className="font-headline text-xs font-bold text-foreground">{n.title}</p>
                                <p className="font-body text-xs text-on-surface-variant mt-0.5">{n.body}</p>
                                <p className="font-body text-[10px] text-on-surface-variant/50 mt-1">
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
              className="relative w-9 h-9 flex items-center justify-center rounded-sm text-on-surface-variant hover:text-foreground hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-xl">shopping_bag</span>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] bg-foreground text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Desktop auth / profile */}
            <div className="hidden md:flex items-center gap-1.5">
              {user ? (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-on-surface-variant hover:text-foreground hover:bg-surface-container transition-colors"
                  >
                    <div className="w-7 h-7 rounded-sm bg-foreground flex items-center justify-center text-white text-xs font-bold font-headline">
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
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-full mt-2.5 w-52 bg-background rounded-sm border border-border/50 shadow-[0_16px_40px_rgba(0,0,0,0.12)] overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-border/20">
                          <p className="font-headline text-sm font-bold text-foreground truncate">{user.email}</p>
                          <p className="font-body text-[11px] text-on-surface-variant/60 mt-0.5">
                            {isAdmin ? "Administrateur" : "Acheteur"}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            to={accountPath}
                            className="flex items-center gap-3 px-4 py-2.5 font-headline text-[13px] font-bold text-on-surface-variant hover:text-foreground hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">person</span>
                            Mon Compte
                          </Link>
                          {!isAdmin && (
                            <Link
                              to="/mes-commandes"
                              className="flex items-center gap-3 px-4 py-2.5 font-headline text-[13px] font-bold text-on-surface-variant hover:text-foreground hover:bg-surface-container transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                              Mes Commandes
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-border/20 py-1">
                          <button
                            onClick={() => { signOut(); setProfileOpen(false); }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 font-headline text-[13px] font-bold text-destructive hover:bg-destructive/5 transition-colors"
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
                    className="px-3.5 py-2 rounded-sm text-[13px] font-bold text-on-surface-variant hover:text-foreground hover:bg-surface-container transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/auth"
                    className="px-4 py-2 rounded-sm bg-foreground text-white text-[13px] font-bold hover:opacity-90 transition-opacity"
                  >
                    Commencer
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-sm text-on-surface-variant hover:bg-surface-container transition-colors"
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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-4 right-4 z-50 md:hidden bg-background border border-border/50 rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.18)] overflow-hidden"
              style={{ top: "calc(env(safe-area-inset-top, 0px) + 58px)" }}
            >
              <div className="flex flex-col max-h-[80vh] overflow-y-auto">

                {/* User info */}
                {user && (
                  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/15">
                    <div className="w-9 h-9 rounded-sm bg-foreground flex items-center justify-center text-white font-headline font-bold text-sm shrink-0">
                      {(user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-headline text-sm font-bold text-foreground truncate">{user.email}</p>
                      <p className="font-body text-[11px] text-on-surface-variant/60">{isAdmin ? "Administrateur" : "Acheteur"}</p>
                    </div>
                  </div>
                )}

                {/* Nav links */}
                <div className="p-3">
                  <p className="font-headline text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 px-2 pb-2">Navigation</p>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { label: "Marché", href: "/marche", icon: "storefront" },
                      { label: "Nouveautés", href: "/marche?sort=new", icon: "new_releases" },
                    ].map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-3 rounded-sm transition-colors ${
                          isActive(item.href) ? "bg-foreground text-white" : "text-on-surface-variant hover:bg-surface-container"
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[17px] shrink-0 ${isActive(item.href) ? "text-white" : "text-foreground/40"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                          {item.icon}
                        </span>
                        <span className="font-headline text-[13px] font-bold">{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Categories */}
                  {displayCategories.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/15">
                      <p className="font-headline text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 px-2 pb-2">Catégories</p>
                      <div className="grid grid-cols-2 gap-1">
                        {displayCategories.map(cat => (
                          <Link
                            key={cat.id}
                            to={`/marche?cat=${cat.id}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-3 rounded-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[17px] shrink-0 text-foreground/40" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {cat.icon || "eco"}
                            </span>
                            <span className="font-headline text-[13px] font-bold">{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Auth CTA */}
                <div className="border-t border-border/20 p-3">
                  {user ? (
                    <div className="flex flex-col gap-1.5">
                      <Link
                        to={accountPath}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 py-3 rounded-sm bg-foreground text-white font-headline font-bold text-sm"
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                        Mon Compte
                      </Link>
                      {!isAdmin && (
                        <Link
                          to="/mes-commandes"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-center gap-2 py-3 rounded-sm border border-border/30 text-on-surface-variant font-headline font-bold text-sm"
                        >
                          <span className="material-symbols-outlined text-base">receipt_long</span>
                          Mes Commandes
                        </Link>
                      )}
                      <button
                        onClick={() => { signOut(); setMobileOpen(false); }}
                        className="flex items-center justify-center gap-2 py-2.5 text-on-surface-variant/60 font-headline text-xs font-bold"
                      >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Déconnexion
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 rounded-sm bg-foreground text-white font-headline font-bold text-sm"
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
