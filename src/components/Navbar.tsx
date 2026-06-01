import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { buildMarketCategories } from "@/data/marketplaceMocks";
import type { Category } from "@/types/database";

const MamakaasaLogo = () => (
  <img src="/logo-mamakaasa.png" alt="Mamakaasa" style={{ height: 40, width: 'auto', display: 'block' }} />
);

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
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
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
      <nav
        className="fixed top-0 w-full z-50 safe-area-top bg-white transition-shadow duration-200"
        style={{
          borderBottom: '1px solid #f0ede6',
          boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.07)' : 'none',
        }}
      >
        <div className="flex items-center px-5 md:px-8 lg:px-10 max-w-[1440px] mx-auto w-full gap-3" style={{ height: 60 }}>

          <Link to="/" className="shrink-0 mr-4">
            <MamakaasaLogo />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            <div ref={marcheRef} className="relative" onMouseEnter={handleMarcheEnter} onMouseLeave={handleMarcheLeave}>
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors"
                style={{
                  color: isActive("/marche") || marcheOpen ? '#0A0A0A' : '#5a5a54',
                  background: isActive("/marche") || marcheOpen ? '#f5f2eb' : 'transparent',
                }}
                onClick={() => setMarcheOpen(!marcheOpen)}
              >
                Marché
                <motion.span
                  animate={{ rotate: marcheOpen ? 180 : 0 }}
                  transition={{ duration: 0.15 }}
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
                    transition={{ duration: 0.14 }}
                    className="absolute left-0 top-full mt-2 bg-white rounded-xl overflow-hidden z-50"
                    style={{ width: 420, boxShadow: '0 12px 32px rgba(10,10,10,0.10)', border: '1px solid hsl(60 5% 92%)' }}
                    onMouseEnter={handleMarcheEnter}
                    onMouseLeave={handleMarcheLeave}
                  >
                    <div className="flex">
                      <div className="flex-1 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant px-2 pb-2">Catégories</p>
                        <div className="grid grid-cols-2 gap-0.5">
                          {displayCategories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/marche?cat=${cat.id}`}
                              onClick={() => setMarcheOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors hover:bg-surface-container"
                            >
                              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[14px] text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>
                                  {cat.icon || "eco"}
                                </span>
                              </div>
                              <p className="text-[13px] font-medium text-foreground">{cat.name}</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="w-36 bg-surface-container-low p-3 border-l border-border/40">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant px-2 pb-2">Explorer</p>
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
                              className="px-2 py-2 rounded-lg text-[13px] font-medium text-on-surface-variant hover:text-foreground hover:bg-surface-container transition-colors"
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
                className="px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors"
                style={{
                  color: isActive("/mon-compte") || isActive("/admin") ? '#0A0A0A' : '#5a5a54',
                  background: isActive("/mon-compte") || isActive("/admin") ? '#f5f2eb' : 'transparent',
                }}
              >
                Mon Compte
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Notifications */}
            {user && (
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-foreground hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#F07800' }}/>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl overflow-hidden z-50"
                      style={{ boxShadow: '0 12px 32px rgba(10,10,10,0.10)', border: '1px solid hsl(60 5% 92%)' }}
                    >
                      <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
                        <span className="font-headline text-sm font-bold">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs font-medium text-on-surface-variant hover:text-foreground">
                            Tout marquer lu
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-12 text-center">
                            <span className="material-symbols-outlined text-3xl text-on-surface-variant/20 block mb-2">notifications_none</span>
                            <p className="text-sm text-on-surface-variant/50">Aucune notification</p>
                          </div>
                        ) : notifications.map(n => (
                          <button
                            key={n.id}
                            onClick={() => { markRead(n.id); if (n.order_id) navigate("/mes-commandes"); setNotifOpen(false); }}
                            className="w-full text-left px-4 py-3 hover:bg-surface-container transition-colors border-b border-border/10 last:border-0"
                          >
                            <p className="text-xs font-semibold text-foreground">{n.title}</p>
                            <p className="text-xs text-on-surface-variant mt-0.5">{n.body}</p>
                            <p className="text-[10px] text-on-surface-variant/50 mt-1">
                              {new Date(n.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Desktop profile */}
            {user && (
              <div ref={profileRef} className="relative hidden md:block">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface-container transition-colors"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0A0A0A' }}>
                    {(user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <motion.span
                    animate={{ rotate: profileOpen ? 180 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="material-symbols-outlined text-[14px] text-on-surface-variant"
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
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl overflow-hidden z-50"
                      style={{ boxShadow: '0 12px 32px rgba(10,10,10,0.10)', border: '1px solid hsl(60 5% 92%)' }}
                    >
                      <div className="px-4 py-3 border-b border-border/40">
                        <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">{isAdmin ? "Administrateur" : "Acheteur"}</p>
                      </div>
                      <div className="py-1">
                        <Link to={accountPath} className="flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-medium text-on-surface-variant hover:text-foreground hover:bg-surface-container transition-colors">
                          <span className="material-symbols-outlined text-[16px]">person</span> Mon Compte
                        </Link>
                        {!isAdmin && (
                          <Link to="/mes-commandes" className="flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-medium text-on-surface-variant hover:text-foreground hover:bg-surface-container transition-colors">
                            <span className="material-symbols-outlined text-[16px]">receipt_long</span> Mes Commandes
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-border/40 py-1">
                        <button
                          onClick={() => { signOut(); setProfileOpen(false); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-[13.5px] font-medium text-destructive hover:bg-destructive/5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">logout</span> Déconnexion
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Desktop auth buttons */}
            {!user && (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/auth" className="px-3.5 py-2 rounded-lg text-[13.5px] font-medium text-on-surface-variant hover:text-foreground hover:bg-surface-container transition-colors">
                  Connexion
                </Link>
                <Link to="/auth" className="px-4 py-2 rounded-lg text-[13.5px] font-medium text-white transition-opacity hover:opacity-90" style={{ background: '#0A0A0A' }}>
                  Commencer
                </Link>
              </div>
            )}

            {/* Cart button */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-white text-[13.5px] font-medium relative transition-opacity hover:opacity-90"
              style={{ background: '#0A0A0A' }}
            >
              <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
              <span className="hidden sm:inline">Panier</span>
              {totalItems > 0 && (
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md min-w-[18px] text-center leading-tight" style={{ background: '#F07800' }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
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
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-4 right-4 z-50 md:hidden bg-white rounded-xl overflow-hidden"
              style={{ top: "calc(env(safe-area-inset-top, 0px) + 68px)", boxShadow: '0 12px 32px rgba(10,10,10,0.14)', border: '1px solid hsl(60 5% 92%)' }}
            >
              <div className="flex flex-col max-h-[80vh] overflow-y-auto">
                {user && (
                  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: '#0A0A0A' }}>
                      {(user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                      <p className="text-[11px] text-on-surface-variant">{isAdmin ? "Administrateur" : "Acheteur"}</p>
                    </div>
                  </div>
                )}
                <div className="p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant/50 px-2 pb-2">Navigation</p>
                  <div className="flex flex-col gap-0.5">
                    {[
                      { label: "Marché", href: "/marche", icon: "storefront" },
                      { label: "Nouveautés", href: "/marche?sort=new", icon: "new_releases" },
                    ].map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-on-surface-variant hover:text-foreground hover:bg-surface-container"
                      >
                        <span className="material-symbols-outlined text-[17px]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                        <span className="text-[13.5px] font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  {displayCategories.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/40">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant/50 px-2 pb-2">Catégories</p>
                      <div className="grid grid-cols-2 gap-0.5">
                        {displayCategories.map(cat => (
                          <Link
                            key={cat.id}
                            to={`/marche?cat=${cat.id}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon || "eco"}</span>
                            <span className="text-[13px] font-medium truncate">{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-t border-border/40 p-3">
                  {user ? (
                    <div className="flex flex-col gap-1.5">
                      <Link to={accountPath} onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: '#0A0A0A' }}>
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                        Mon Compte
                      </Link>
                      <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex items-center justify-center gap-2 py-2.5 text-on-surface-variant/60 font-medium text-xs">
                        <span className="material-symbols-outlined text-sm">logout</span> Déconnexion
                      </button>
                    </div>
                  ) : (
                    <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex items-center justify-center py-3 rounded-xl text-white font-semibold text-sm" style={{ background: '#0A0A0A' }}>
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
