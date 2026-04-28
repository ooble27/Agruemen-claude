import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { path: "/", icon: "home", label: "Accueil" },
  { path: "/marche", icon: "storefront", label: "Marché" },
  { path: "__cart__", icon: "shopping_bag", label: "Panier" },
  { path: "/mes-commandes", icon: "receipt_long", label: "Commandes" },
  { path: "__profile__", icon: "person", label: "Profil" },
];

const HIDDEN_PATHS = ["/auth", "/checkout", "/confirmation", "/admin"];

const BottomNav = () => {
  const location = useLocation();
  const { totalItems, setIsOpen } = useCart();
  const { user, isAdmin } = useAuth();

  if (!user) return null;
  if (HIDDEN_PATHS.some(p => location.pathname === p || location.pathname.startsWith(p + "/"))) return null;

  const profilePath = isAdmin ? "/admin" : "/mon-compte";

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path === "__profile__") return location.pathname === "/mon-compte" || location.pathname === "/admin";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-3 mb-3">
        <div className="flex items-center justify-around bg-card/95 backdrop-blur-xl border border-border/30 rounded-2xl px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          {NAV_ITEMS.map((item) => {
            const isCart = item.path === "__cart__";
            const isProfile = item.path === "__profile__";
            const active = isActive(item.path);
            const href = isProfile ? profilePath : item.path;

            const inner = (
              <div className="relative flex flex-col items-center justify-center w-14 py-1">
                <AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="bottomnav-pill"
                      className="absolute inset-0 bg-foreground rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                </AnimatePresence>
                <span
                  className={`relative material-symbols-outlined text-[22px] transition-colors duration-150 ${active ? "text-white" : "text-on-surface-variant/60"}`}
                  style={{ fontVariationSettings: active ? "'FILL' 1, 'wght' 600" : "'wght' 300" }}
                >
                  {item.icon}
                </span>
                <span className={`relative font-headline text-[9px] font-bold mt-0.5 tracking-wide transition-colors duration-150 ${active ? "text-white" : "text-on-surface-variant/50"}`}>
                  {item.label}
                </span>
                {isCart && totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 right-0.5 w-[16px] h-[16px] bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center z-20 leading-none"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </motion.span>
                )}
              </div>
            );

            if (isCart) {
              return (
                <button key="cart" onClick={() => setIsOpen(true)} className="outline-none">
                  {inner}
                </button>
              );
            }

            return (
              <Link key={item.path} to={href} className="outline-none">
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
