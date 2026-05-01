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
            className={`mx-auto flex max-w-[1200px] items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-300 md:px-6 ${
              scrolled
                ? "border-border/60 bg-background/96 shadow-lg backdrop-blur-2xl"
                : "border-border/35 bg-background/85 shadow-sm backdrop-blur-lg"
            }`}
          >
            <Link to="/" className="font-headline text-lg font-black tracking-tighter text-foreground">
              Agrumen
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-1 md:flex">
              <Link
                to="/marche"
                className={`px-4 py-2 rounded-md font-headline text-[13px] font-semibold transition-colors ${
                  isActive("/marche")
                    ? "bg-foreground text-white"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-foreground"
                }`}
              >
                Marché
              </Link>

              {/* Dropdown À propos */}
              <div ref={aboutRef} className="relative">
                <button
                  onClick={() => setAboutOpen(o => !o)}
                  className={`px-4 py-2 rounded-md font-headline text-[13px] font-semibold transition-colors flex items-center gap-1 ${
                    aboutOpen || ABOUT_LINKS.some(l => isActive(l.href))
                      ? "bg-foreground text-white"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  À propos
                  <motion.span
                    animate={{ rotate: aboutOpen ? 180 : 0 }}
                    transition={{ duration: 0.18 }}
                    className="material-symbols-outlined text-[14px] leading-none"
                  >
                    expand_more
                  </motion.span>
                </button>

                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.14, ease: "easeOut" }}
                      className="absolute left-0 top-full mt-2.5 w-72 bg-background rounded-2xl border border-border/50 shadow-[0_16px_40px_rgba(0,0,0,0.12)] overflow-hidden z-50"
                    >
                      {/* Dropdown header */}
                      <div className="px-4 pt-4 pb-2.5 border-b border-border/20">
                        <p className="font-headline text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
                          Découvrir Agrumen
                        </p>
                      </div>

                      {/* Links */}
                      <div className="p-2">
                        {ABOUT_LINKS.map(link => (
                          <Link
                            key={link.href}
                            to={link.href}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors group ${
                              isActive(link.href)
                                ? "bg-foreground/8 text-foreground"
                                : "text-on-surface-variant hover:bg-surface-container hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`material-symbols-outlined text-[16px] transition-colors ${
                                  isActive(link.href) ? "text-foreground" : "text-foreground/35 group-hover:text-foreground/60"
                                }`}
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                {link.icon}
                              </span>
                              <div>
                                <p className="font-headline text-[13px] font-bold leading-tight">{link.label}</p>
                                <p className="font-body text-[11px] text-on-surface-variant/70 mt-0.5">{link.desc}</p>
                              </div>
                            </div>
                            <span className="material-symbols-outlined text-[13px] text-foreground/20 group-hover:text-foreground/50 transition-colors">
                              chevron_right
                            </span>
                          </Link>
                        ))}
                      </div>

                      {/* Footer CTA */}
                      <div className="px-3 py-2.5 border-t border-border/20 bg-surface-container-lowest/50">
                        <Link
                          to="/devenir-partenaire"
                          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
                          <span className="font-headline text-[12px] font-bold">Devenir partenaire producteur →</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/devenir-partenaire"
                className={`px-4 py-2 rounded-md font-headline text-[13px] font-semibold transition-colors ${
                  isActive("/devenir-partenaire")
                    ? "bg-foreground text-white"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-foreground"
                }`}
              >
                Devenir partenaire
              </Link>

              <Link
                to="/faq"
                className={`px-4 py-2 rounded-md font-headline text-[13px] font-semibold transition-colors ${
                  isActive("/faq")
                    ? "bg-foreground text-white"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-foreground"
                }`}
              >
                FAQ
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {user ? (
                <Link
                  to={isAdmin ? "/admin" : "/mon-compte"}
                  className="rounded-md bg-foreground px-4 py-2 font-headline text-[13px] font-bold text-white transition-all hover:opacity-85"
                >
                  Mon Compte
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="hidden px-4 py-2 font-headline text-[13px] font-semibold text-on-surface-variant transition-colors hover:text-foreground sm:block"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/auth"
                    className="rounded-md bg-foreground px-4 py-2 font-headline text-[13px] font-bold text-white transition-all hover:opacity-85"
                  >
                    Commencer
                  </Link>
                </>
              )}

              {/* Mobile burger */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container transition-colors"
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55] md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-4 right-4 z-[58] md:hidden bg-background border border-border/50 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] overflow-hidden"
              style={{ top: "calc(env(safe-area-inset-top, 0px) + 78px)" }}
            >
              {/* Section principale */}
              <div className="p-3">
                <p className="font-headline text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 px-2 pb-2">
                  Navigation
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { label: "Marché", href: "/marche", icon: "storefront" },
                    { label: "Devenir partenaire", href: "/devenir-partenaire", icon: "agriculture" },
                    { label: "Blog", href: "/blog", icon: "article" },
                    { label: "FAQ", href: "/faq", icon: "help" },
                    { label: "Contact", href: "/contact", icon: "mail" },
                  ].map(item => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center gap-2.5 px-3 py-3 rounded-md transition-colors ${
                        isActive(item.href)
                          ? "bg-foreground text-white"
                          : "text-on-surface-variant hover:bg-surface-container hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[17px] shrink-0 ${isActive(item.href) ? "text-white" : "text-foreground/40"}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {item.icon}
                      </span>
                      <span className="font-headline text-[13px] font-bold">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* À propos section */}
                <div className="mt-2 pt-2 border-t border-border/15">
                  <p className="font-headline text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 px-2 pb-2">
                    À propos
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { label: "Qui sommes-nous", href: "/qui-sommes-nous", icon: "info" },
                      { label: "Notre Mission", href: "/notre-mission", icon: "eco" },
                      { label: "Nos Engagements", href: "/nos-engagements", icon: "volunteer_activism" },
                      { label: "Carrières", href: "/carrieres", icon: "work" },
                    ].map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center gap-2.5 px-3 py-3 rounded-md transition-colors ${
                          isActive(item.href)
                            ? "bg-foreground text-white"
                            : "text-on-surface-variant hover:bg-surface-container hover:text-foreground"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[17px] shrink-0 ${isActive(item.href) ? "text-white" : "text-foreground/40"}`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {item.icon}
                        </span>
                        <span className="font-headline text-[13px] font-bold">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Auth CTA */}
              <div className="border-t border-border/20 p-3">
                {user ? (
                  <Link
                    to={isAdmin ? "/admin" : "/mon-compte"}
                    className="flex items-center justify-center gap-2 py-3 rounded-md bg-foreground text-white font-headline font-bold text-sm"
                  >
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                    Mon Compte
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center justify-center gap-2 py-3 rounded-md bg-foreground text-white font-headline font-bold text-sm"
                  >
                    Connexion / Commencer
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingNavbar;
