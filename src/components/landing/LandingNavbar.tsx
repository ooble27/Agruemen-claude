import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const LandingNavbar = () => {
  const { user, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 z-[60] w-full"
    >
      <div className="mx-4 mt-4 md:mx-8">
        <div
          className={`mx-auto flex max-w-[1200px] items-center justify-between rounded-xl border px-5 py-3 transition-all duration-300 md:px-8 ${
            scrolled
              ? "border-border/70 bg-background/92 shadow-lg backdrop-blur-xl"
              : "border-border/60 bg-background/82 shadow-sm backdrop-blur-xl"
          }`}
        >
          <Link to="/" className="font-headline text-lg font-black tracking-tighter text-foreground transition-colors">
            Agrumen
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {[
              { label: "Marché", href: "/marche" },
              { label: "Notre mission", href: "#mission" },
              { label: "Nos valeurs", href: "#valeurs" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-xl px-4 py-2 font-headline text-[13px] font-medium text-on-surface-variant transition-all hover:bg-surface-container-lowest hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <Link
                to={isAdmin ? "/admin" : "/mon-compte"}
                className="rounded-xl bg-primary px-5 py-2.5 font-headline text-[13px] font-bold text-primary-foreground transition-colors hover:opacity-90"
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
                  className="rounded-xl bg-primary px-5 py-2.5 font-headline text-[13px] font-bold text-primary-foreground transition-colors hover:opacity-90"
                >
                  Commencer
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default LandingNavbar;
