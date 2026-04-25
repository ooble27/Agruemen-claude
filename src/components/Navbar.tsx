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
      <nav className="fixed top-0 w-full z-50 bg-card border-b border-border/20 safe-area-top">
        <div className="flex items-center px-5 md:px-8 lg:px-10 py-2.5 max-w-[1440px] mx-auto w-full gap-1">
          {/* Logo */}
          <Link to="/" className="text-xl font-black tracking-tighter text-foreground font-headline shrink-0 mr-6">
            Agrumen
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {/* Marché mega-menu */}
            <div ref={marcheRef} className="relative" onMouseEnter={handleMarcheEnter} onMouseLeave={handleMarcheLeave}>
              <button
                className={`flex items-center gap-1 px-3.5 py-2 rounded-md text-[13px] font-bold transition-all duration-150 ${
                  isActive("/marche") || marcheOpen
                    ? "text-primary-container-foreground bg-primary-container/20"
                    : "text-on-surface-variant hover:text-foreground hover:bg-surface-container/50"
                }`}
                onClick={() => setMarcheOpen(!marcheOpen)}
              >
                Marché
                <span className="material-symbols-outlined text-[15px] transition-transform duration-200" style={{ transform: marcheOpen ? "rotate(180deg)" : "none" }}>
                  expand_more
                </span>
              </button>

              <AnimatePresence>
                {marcheOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-0 top-full mt-2 bg-card rounded-md border border-border/60 shadow-[0_18px_44px_hsl(var(--foreground)/0.14)] overflow-hidden z-50"
                    style={{ width: "520px" }}
                    onMouseEnter={handleMarcheEnter}
                    onMouseLeave={handleMarcheLeave}
                  >
                    <div className="flex">
                      <div className="flex-1 p-4">
                        <div className="text-[10px] font-semibold text-on-surface-variant/60 uppercase tracking-[0.12em] mb-2.5 px-2">Catégories</div>
                        <div className="grid grid-cols-2 gap-0.5">
                          {displayCategories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/marche?cat=${cat.id}`}
                              onClick={() => setMarcheOpen(false)}
                              className="flex items-start gap-3 px-3 py-3 rounded-lg transition-colors group hover:bg-surface-container/50"
                            >
                              <div className="w-8 h-8 rounded-md bg-surface-container flex items-center justify-center shrink-0 group-hover:bg-primary-container/40 transition-colors">
                                <span className="material-symbols-outlined text-base text-on-surface-variant group-hover:text-primary transition-colors">
                                  {cat.icon || "eco"}
                                </span>
                              </div>
                              <div>
                                <div className="text-[13px] font-medium text-foreground leading-tight">{cat.name}</div>
                                <div className="text-[11px] text-on-surface-variant/70 mt-0.5">Produits frais</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="w-44 bg-surface-container/20 p-4 border-l border-border/20">
                        <div className="text-[10px] font-semibold text-on-surface-variant/60 uppercase tracking-[0.12em] mb-2.5 px-2">Explorer</div>
                        <div className="flex flex-col gap-0.5">
                          <Link to="/marche" onClick={() => setMarcheOpen(false)} className="px-3 py-2.5 rounded-md text-[13px] font-medium text-on-surface-variant hover:text-foreground hover:bg-surface-container/50 transition-colors">
                            Tous les produits
                          </Link>
                          <Link to="/marche?sort=new" onClick={() => setMarcheOpen(false)} className="px-3 py-2.5 rounded-md text-[13px] font-medium text-on-surface-variant hover:text-foreground hover:bg-surface-container/50 transition-colors">
                            Nouveautés
                          </Link>
                          <Link to="/marche?sort=popular" onClick={() => setMarcheOpen(false)} className="px-3 py-2.5 rounded-md text-[13px] font-medium text-on-surface-variant hover:text-foreground hover:bg-surface-container/50 transition-colors">
                            Populaires
                          </Link>
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
                className={`px-3.5 py-2 rounded-md text-[13px] font-bold transition-all duration-150 ${
                  isActive("/mon-compte") || isActive("/admin")
                    ? "text-primary-container-foreground bg-primary-container/20"
                    : "text-on-surface-variant hover:text-foreground hover:bg-surface-container/50"
                }`}
              >
                Mon Compte
              </Link>
            )}

            {user && isAdmin && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-md text-[13px] font-bold transition-all duration-150 ${
                  isActive("/admin")
                    ? "text-primary-container-foreground bg-primary-container/20"
                    : "text-on-surface-variant hover:text-foreground hover:bg-surface-container/50"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 ml-auto">

            {/* Notifications bell */}
            {user && (
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen && unreadCount > 0) {} }}
                  className="relative w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-foreground hover:bg-surface-container/50 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-card rounded-md border border-border/60 shadow-[0_12px_36px_rgba(0,0,0,0.14)] overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-border/20 flex items-center justify-between">
                        <span className="font-headline text-sm font-extrabold">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="font-headline text-xs font-bold text-primary hover:underline">
                            Tout marquer lu
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-border/10">
                        {notifications.length === 0 ? (
                          <div className="py-12 text-center">
                            <span className="material-symbols-outlined text-3xl text-on-surface-variant/30 block mb-2">notifications_none</span>
                            <p className="font-body text-sm text-on-surface-variant/60">Aucune notification</p>
                          </div>
                        ) : notifications.map(n => (
                          <button
                            key={n.id}
                            onClick={() => { markRead(n.id); if (n.order_id) navigate("/mes-commandes"); setNotifOpen(false); }}
                            className={`w-full text-left px-4 py-3 hover:bg-surface-container/50 transition-colors ${!n.read ? "bg-primary/[0.03]" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                              <div className={!n.read ? "" : "pl-5"}>
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
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-foreground hover:bg-surface-container/50 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">shopping_bag</span>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-1.5">
              {user ? (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-on-surface-variant hover:text-foreground hover:bg-surface-container/50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center text-primary-container-foreground text-xs font-bold">
                      {(user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="material-symbols-outlined text-[15px] transition-transform duration-200" style={{ transform: profileOpen ? "rotate(180deg)" : "none" }}>
                      expand_more
                    </span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-card rounded-md border border-border/60 shadow-[0_12px_36px_rgba(0,0,0,0.14)] overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-border/20">
                          <div className="text-sm font-semibold text-foreground truncate">{user.email}</div>
                          <div className="text-[11px] text-on-surface-variant mt-0.5">
                            {isAdmin ? "Administrateur" : "Acheteur"}
                          </div>
                        </div>
                        <div className="py-1">
                          <Link to={accountPath} className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-on-surface-variant hover:text-foreground hover:bg-surface-container/50 transition-colors">
                            <span className="material-symbols-outlined text-lg">person</span>
                            Mon Compte
                          </Link>
                          {!isAdmin && (
                            <Link to="/mes-commandes" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-on-surface-variant hover:text-foreground hover:bg-surface-container/50 transition-colors">
                              <span className="material-symbols-outlined text-lg">receipt_long</span>
                              Mes Commandes
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-border/20 py-1">
                          <button
                            onClick={() => { signOut(); setProfileOpen(false); }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-destructive hover:bg-destructive/5 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">logout</span>
                            Déconnexion
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link to="/auth" className="px-3.5 py-2 rounded-md text-[13px] font-medium text-on-surface-variant hover:text-foreground hover:bg-surface-container/50 transition-colors">
                    Connexion
                  </Link>
                  <Link to="/auth" className="px-4 py-2 rounded-md bg-foreground text-white text-[13px] font-semibold hover:opacity-90 transition-opacity">
                    Commencer
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container/50 transition-colors"
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
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[49px] left-0 right-0 z-50 md:hidden bg-card border-b border-border/60 shadow-xl"
            >
              <div className="flex flex-col px-5 py-4 gap-0.5 max-h-[80vh] overflow-y-auto">
                {user && (
                  <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-surface-container/40 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary-container-foreground font-bold">
                      {(user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{user.email}</div>
                      <div className="text-[11px] text-on-surface-variant">{isAdmin ? "Administrateur" : "Acheteur"}</div>
                    </div>
                  </div>
                )}

                <Link to="/marche" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-[13px] font-medium text-on-surface-variant hover:text-foreground hover:bg-surface-container/50 transition-colors">
                  <span className="material-symbols-outlined text-lg">storefront</span>
                  Tous les produits
                </Link>

                <div className="text-[10px] font-semibold text-on-surface-variant/60 uppercase tracking-[0.12em] mt-3 mb-1.5 px-4">Catégories</div>
                <div className="grid grid-cols-2 gap-0.5 mb-2">
                  {displayCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/marche?cat=${cat.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-on-surface-variant hover:text-foreground hover:bg-surface-container/50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">{cat.icon || "eco"}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>

                {user && (
                  <div className="border-t border-border/20 mt-1 pt-2">
                    <Link to={accountPath} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium text-on-surface-variant hover:text-foreground hover:bg-surface-container/50 transition-colors">
                      <span className="material-symbols-outlined text-lg">person</span>
                      Mon Compte
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium text-on-surface-variant hover:text-foreground hover:bg-surface-container/50 transition-colors">
                        <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                        Administration
                      </Link>
                    )}
                    {!isAdmin && (
                      <Link to="/mes-commandes" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium text-on-surface-variant hover:text-foreground hover:bg-surface-container/50 transition-colors">
                        <span className="material-symbols-outlined text-lg">receipt_long</span>
                        Mes Commandes
                      </Link>
                    )}
                  </div>
                )}

                <div className="border-t border-border/20 mt-2 pt-2">
                  {user ? (
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-[13px] font-medium text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Déconnexion
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex items-center justify-center py-3 rounded-md text-[13px] font-semibold text-on-surface-variant hover:bg-surface-container/50 transition-colors border border-border/30">
                        Connexion
                      </Link>
                      <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex items-center justify-center py-3 rounded-md bg-foreground text-white text-[13px] font-semibold hover:opacity-90 transition-opacity">
                        Commencer gratuitement
                      </Link>
                    </div>
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
