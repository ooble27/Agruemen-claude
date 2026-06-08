import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const ABOUT_LINKS = [
  { label: "Qui sommes-nous",  href: "/qui-sommes-nous",    icon: "info",               desc: "Notre histoire & équipe" },
  { label: "Notre Mission",    href: "/notre-mission",       icon: "eco",                desc: "Pourquoi Mamakaasa existe" },
  { label: "Nos Engagements",  href: "/nos-engagements",     icon: "volunteer_activism", desc: "Impact & durabilité" },
  { label: "Blog",             href: "/blog",                icon: "article",            desc: "Agrobusiness & agriculture" },
  { label: "Carrières",        href: "/carrieres",           icon: "work",               desc: "Rejoindre l'équipe" },
];

const LandingNavbar = () => {
  const { user, isAdmin } = useAuth();
  const [scrolled, setScrolled]     = useState(false);
  const [aboutOpen, setAboutOpen]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const aboutRef   = useRef<HTMLDivElement>(null);
  const location   = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setAboutOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node))
        setAboutOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <nav
        className="fixed top-0 z-[60] w-full bg-white transition-shadow duration-200"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          borderBottom: "1px solid #f0ede6",
          boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
        }}
      >
        <div
          className="mx-auto flex max-w-[1200px] items-center justify-between px-5 md:px-8"
          style={{ height: 66 }}
        >

          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <img
              src="/logo-mamakaasa.png"
              alt="Mamakaasa"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-0.5 md:flex">

            <Link
              to="/marche"
              className={`px-4 py-2 rounded-lg font-headline text-[13.5px] font-semibold transition-colors ${
                isActive("/marche")
                  ? "bg-[#0A0A0A] text-white"
                  : "text-[#5a5a54] hover:bg-[#f5f2eb] hover:text-[#0A0A0A]"
              }`}
            >
              Marché
            </Link>

            {/* Dropdown À propos */}
            <div ref={aboutRef} className="relative">
              <button
                onClick={() => setAboutOpen(o => !o)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-headline text-[13.5px] font-semibold transition-colors ${
                  aboutOpen || ABOUT_LINKS.some(l => isActive(l.href))
                    ? "bg-[#0A0A0A] text-white"
                    : "text-[#5a5a54] hover:bg-[#f5f2eb] hover:text-[#0A0A0A]"
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
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-0 top-full mt-3 w-72 bg-white rounded-xl overflow-hidden z-50"
                    style={{
                      border: "1px solid #f0ede6",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.10)",
                    }}
                  >
                    <div className="px-4 pt-3.5 pb-2.5 border-b border-[#f0ede6]">
                      <p className="font-headline text-[9px] font-bold uppercase tracking-[0.2em] text-[#9a9a92]">
                        Découvrir Mamakaasa
                      </p>
                    </div>
                    <div className="p-2">
                      {ABOUT_LINKS.map(link => (
                        <Link
                          key={link.href}
                          to={link.href}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${
                            isActive(link.href)
                              ? "bg-[#f5f2eb] text-[#0A0A0A]"
                              : "text-[#5a5a54] hover:bg-[#f5f2eb] hover:text-[#0A0A0A]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#f5f2eb] flex items-center justify-center shrink-0">
                              <span
                                className="material-symbols-outlined text-[15px] text-[#0A0A0A]/50 group-hover:text-emerald-600 transition-colors"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                {link.icon}
                              </span>
                            </div>
                            <div>
                              <p className="font-headline text-[13px] font-bold leading-tight">{link.label}</p>
                              <p className="font-body text-[11px] text-[#9a9a92] mt-0.5">{link.desc}</p>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-[13px] text-[#c5c2ba] group-hover:text-[#0A0A0A]/40 transition-colors">
                            chevron_right
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="px-3 py-2.5 border-t border-[#f0ede6] bg-[#faf8f4]">
                      <Link
                        to="/devenir-partenaire"
                        className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors"
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
              className={`px-4 py-2 rounded-lg font-headline text-[13.5px] font-semibold transition-colors ${
                isActive("/devenir-partenaire")
                  ? "bg-[#0A0A0A] text-white"
                  : "text-[#5a5a54] hover:bg-[#f5f2eb] hover:text-[#0A0A0A]"
              }`}
            >
              Devenir partenaire
            </Link>

            <Link
              to="/faq"
              className={`px-4 py-2 rounded-lg font-headline text-[13.5px] font-semibold transition-colors ${
                isActive("/faq")
                  ? "bg-[#0A0A0A] text-white"
                  : "text-[#5a5a54] hover:bg-[#f5f2eb] hover:text-[#0A0A0A]"
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
                className="rounded-xl px-4 py-2 font-headline text-[13.5px] font-bold text-white transition-opacity hover:opacity-85"
                style={{ background: "#0A0A0A" }}
              >
                Mon Compte
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="hidden px-4 py-2 font-headline text-[13.5px] font-semibold text-[#5a5a54] transition-colors hover:text-[#0A0A0A] sm:block"
                >
                  Connexion
                </Link>
                <Link
                  to="/auth"
                  className="rounded-lg px-5 py-2 font-headline text-[13.5px] font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: "#10b981" }}
                >
                  Commencer
                </Link>
              </>
            )}

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-[#5a5a54] hover:bg-[#f5f2eb] transition-colors"
            >
              <span className="material-symbols-outlined text-xl">{mobileOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/25 z-[55] md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-4 right-4 z-[58] md:hidden bg-white rounded-2xl overflow-hidden"
              style={{
                top: "calc(env(safe-area-inset-top, 0px) + 74px)",
                border: "1px solid #f0ede6",
                boxShadow: "0 20px 60px rgba(0,0,0,0.14)",
              }}
            >
              <div className="p-3">
                <p className="font-headline text-[9px] font-bold uppercase tracking-[0.2em] text-[#9a9a92] px-2 pb-2">Navigation</p>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { label: "Marché",            href: "/marche",              icon: "storefront" },
                    { label: "Devenir partenaire", href: "/devenir-partenaire",  icon: "agriculture" },
                    { label: "Blog",              href: "/blog",                icon: "article" },
                    { label: "FAQ",               href: "/faq",                 icon: "help" },
                    { label: "Contact",           href: "/contact",             icon: "mail" },
                  ].map(item => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center gap-2.5 px-3 py-3 rounded-xl transition-colors ${
                        isActive(item.href)
                          ? "bg-[#0A0A0A] text-white"
                          : "text-[#5a5a54] hover:bg-[#f5f2eb] hover:text-[#0A0A0A]"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[17px] shrink-0 ${isActive(item.href) ? "text-white" : "text-[#0A0A0A]/30"}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {item.icon}
                      </span>
                      <span className="font-headline text-[13px] font-bold">{item.label}</span>
                    </Link>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-[#f0ede6]">
                  <p className="font-headline text-[9px] font-bold uppercase tracking-[0.2em] text-[#9a9a92] px-2 pb-2">À propos</p>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { label: "Qui sommes-nous",  href: "/qui-sommes-nous",  icon: "info" },
                      { label: "Notre Mission",     href: "/notre-mission",    icon: "eco" },
                      { label: "Nos Engagements",   href: "/nos-engagements",  icon: "volunteer_activism" },
                      { label: "Carrières",         href: "/carrieres",        icon: "work" },
                    ].map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center gap-2.5 px-3 py-3 rounded-xl transition-colors ${
                          isActive(item.href)
                            ? "bg-[#0A0A0A] text-white"
                            : "text-[#5a5a54] hover:bg-[#f5f2eb] hover:text-[#0A0A0A]"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[17px] shrink-0 ${isActive(item.href) ? "text-white" : "text-[#0A0A0A]/30"}`}
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

              <div className="border-t border-[#f0ede6] p-3">
                {user ? (
                  <Link
                    to={isAdmin ? "/admin" : "/mon-compte"}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-headline font-bold text-sm text-white"
                    style={{ background: "#0A0A0A" }}
                  >
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                    Mon Compte
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-headline font-bold text-sm text-white"
                    style={{ background: "#10b981" }}
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
