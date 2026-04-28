import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const ABOUT_LINKS = [
  { label: "Qui sommes-nous", href: "/qui-sommes-nous", icon: "info", desc: "Notre histoire & équipe" },
  { label: "Notre Mission", href: "/notre-mission", icon: "eco", desc: "Pourquoi Agrumen existe" },
  { label: "Nos Engagements", href: "/nos-engagements", icon: "volunteer_activism", desc: "Impact & durabilité" },
  { label: "Blog", href: "/blog", icon: "article", desc: "Agrobusiness & agriculture" },
  { label: "Carrières", href: "/carrieres", icon: "work", desc: "Rejoindre l'équipe" },
];

const LandingNavbar = () => {
  const { user, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setAboutOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) setAboutOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 z-[60] w-full"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-4 mt-4 md:mx-8">
          <div
            className={`mx-auto flex max-w-[1200px] items-center justify-between rounded-xl border px-5 py-3 transition-all duration-300 md:px-8 ${
              scrolled
                ? "border-border/70 bg-background/95 shadow-md backdrop-blur-xl"
                : "border-border/40 bg-background/80 shadow-sm backdrop-blur-md"
            }`}
          >
            <Link to="/" className="font-headline text-lg font-black tracking-tighter text-foreground">
              Agrumen
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-0.5 md:flex">
              <Link
                to="/marche"
                className={`rounded-lg px-4 py-2 font-headline text-[13px] font-bold transition-all ${
                  isActive("/marche") ? "text-foreground bg-foreground/6" : "text-on-surface-variant hover:text-foreground hover:bg-surface-container-lowest"
                }`}
              >
                Marché
              </Link>

              {/* Dropdown À propos */}
              <div ref={aboutRef} className="relative">
                <button
                  onClick={() => setAboutOpen(o => !o)}
                  className={`rounded-lg px-4 py-2 font-headline text-[13px] font-bold transition-all flex items-center gap-1 ${
                    aboutOpen || ABOUT_LINKS.some(l => isActive(l.href)) ? "text-foreground bg-foreground/6" : "text-on-surface-variant hover:text-foreground hover:bg-surface-container-lowest"
                  }`}
                >
                  À propos
                  <motion.span
                    animate={{ rotate: aboutOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="material-symbols-outlined text-[15px]"
                  >
                    expand_more
                  </motion.span>
                </button>

                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 top-full mt-3 w-64 bg-card rounded-xl border border-border/50 shadow-[0_20px_48px_rgba(0,0,0,0.14)] overflow-hidden z-50"
                    >
                      <div className="p-2">
                        {ABOUT_LINKS.map(link => (
                          <Link
                            key={link.href}
                            to={link.href}
                            className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                              isActive(link.href) ? "bg-foreground/5" : "hover:bg-surface-container-lowest"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-foreground/6 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-foreground/10 transition-colors">
                              <span className="material-symbols-outlined text-foreground/60 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{link.icon}</span>
                            </div>
                            <div>
                              <p className="font-headline text-[13px] font-bold text-foreground leading-tight">{link.label}</p>
                              <p className="font-body text-[11px] text-on-surface-variant mt-0.5">{link.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/devenir-partenaire"
                className={`rounded-lg px-4 py-2 font-headline text-[13px] font-bold transition-all ${
                  isActive("/devenir-partenaire") ? "text-foreground bg-foreground/6" : "text-on-surface-variant hover:text-foreground hover:bg-surface-container-lowest"
                }`}
              >
                Devenir partenaire
              </Link>

              <Link
                to="/faq"
                className={`rounded-lg px-4 py-2 font-headline text-[13px] font-bold transition-all ${
                  isActive("/faq") ? "text-foreground bg-foreground/6" : "text-on-surface-variant hover:text-foreground hover:bg-surface-container-lowest"
                }`}
              >
                FAQ
              </Link>
            </div>

            {/* Droite */}
            <div className="flex items-center gap-2">
              {user ? (
                <Link
                  to={isAdmin ? "/admin" : "/mon-compte"}
                  className="rounded-xl bg-foreground px-5 py-2.5 font-headline text-[13px] font-bold text-white transition-colors hover:opacity-90"
                >
                  Mon Compte
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="hidden px-4 py-2.5 font-headline text-[13px] font-medium text-on-surface-variant transition-colors hover:text-foreground sm:block"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/auth"
                    className="rounded-xl bg-foreground px-5 py-2.5 font-headline text-[13px] font-bold text-white transition-colors hover:opacity-90"
                  >
                    Commencer
                  </Link>
                </>
              )}

              {/* Burger mobile */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-xl">{mobileOpen ? "close" : "menu"}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[55] md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="fixed left-4 right-4 z-[58] md:hidden bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
              style={{ top: "calc(env(safe-area-inset-top, 0px) + 76px)" }}
            >
              <div className="flex flex-col p-3 gap-1">
                {[
                  { label: "Marché", href: "/marche", icon: "storefront" },
                  { label: "Blog", href: "/blog", icon: "article" },
                  { label: "Devenir partenaire", href: "/devenir-partenaire", icon: "agriculture" },
                  { label: "Qui sommes-nous", href: "/qui-sommes-nous", icon: "info" },
                  { label: "Notre Mission", href: "/notre-mission", icon: "eco" },
                  { label: "Nos Engagements", href: "/nos-engagements", icon: "volunteer_activism" },
                  { label: "FAQ", href: "/faq", icon: "help" },
                  { label: "Contact", href: "/contact", icon: "mail" },
                  { label: "Carrières", href: "/carrieres", icon: "work" },
                ].map(item => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-headline text-sm font-bold text-on-surface-variant hover:text-foreground hover:bg-surface-container-lowest transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg text-foreground/40">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-border/20 mt-1 pt-2">
                  {user ? (
                    <Link to={isAdmin ? "/admin" : "/mon-compte"} className="flex items-center justify-center py-3 rounded-xl bg-foreground text-white font-headline font-bold text-sm">
                      Mon Compte
                    </Link>
                  ) : (
                    <Link to="/auth" className="flex items-center justify-center py-3 rounded-xl bg-foreground text-white font-headline font-bold text-sm">
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

export default LandingNavbar;
