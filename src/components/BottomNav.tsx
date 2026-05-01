import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const HIDDEN_PATHS = ["/auth", "/checkout", "/confirmation", "/admin"];

const BottomNav = () => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  if (!user) return null;
  if (HIDDEN_PATHS.some(p => location.pathname === p || location.pathname.startsWith(p + "/"))) return null;

  const profilePath = isAdmin ? "/admin" : "/mon-compte";

  const items = [
    { label: "Accueil", icon: "home", href: "/" },
    { label: "Marché", icon: "storefront", href: "/marche" },
    { label: "Compte", icon: "person", href: profilePath },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href === profilePath) return location.pathname === "/mon-compte" || location.pathname === "/admin";
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Spacer to prevent content hiding behind nav */}
      <div className="h-24 md:hidden" />

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-end justify-center gap-3 px-8 pb-5">
          {items.map((item, i) => {
            const active = isActive(item.href);
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1"
              >
                <Link
                  to={item.href}
                  className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-foreground shadow-[0_4px_24px_rgba(0,0,0,0.22)]"
                      : "bg-background/90 backdrop-blur-xl border border-border/30 shadow-sm"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] leading-none transition-colors duration-200 ${
                      active ? "text-white" : "text-on-surface-variant/60"
                    }`}
                    style={{
                      fontVariationSettings: active
                        ? "'FILL' 1, 'wght' 600"
                        : "'wght' 300",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`font-headline text-[10px] font-bold leading-none transition-colors duration-200 ${
                      active ? "text-white/90" : "text-on-surface-variant/50"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
