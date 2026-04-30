import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-4 mb-4">
        <div className="flex items-end justify-around bg-[#111111] border border-white/[0.07] rounded-2xl px-2 py-3 shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
          {NAV_ITEMS.map((item) => {
            const isCart = item.path === "__cart__";
            const isProfile = item.path === "__profile__";
            const active = isActive(item.path);
            const href = isProfile ? profilePath : item.path;

            const inner = (
              <div className="flex flex-col items-center gap-1.5 relative px-3">
                {/* Cart special button */}
                {isCart ? (
                  <div className="relative">
                    <motion.div
                      animate={{ backgroundColor: active ? "#10b981" : "rgba(255,255,255,0.07)" }}
                      transition={{ duration: 0.2 }}
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                    >
                      <span
                        className={`material-symbols-outlined text-[22px] transition-colors duration-200 ${active ? "text-white" : "text-white/40"}`}
                        style={{ fontVariationSettings: active ? "'FILL' 1" : "'wght' 300" }}
                      >
                        {item.icon}
                      </span>
                    </motion.div>
                    {totalItems > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-[17px] h-[17px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none z-10"
                      >
                        {totalItems > 9 ? "9+" : totalItems}
                      </motion.span>
                    )}
                  </div>
                ) : (
                  <span
                    className={`material-symbols-outlined text-[24px] transition-all duration-200 ${active ? "text-emerald-400" : "text-white/30"}`}
                    style={{ fontVariationSettings: active ? "'FILL' 1, 'wght' 600" : "'wght' 300" }}
                  >
                    {item.icon}
                  </span>
                )}

                {/* Label — visible for all items, dimmed when inactive */}
                <span
                  className={`font-headline text-[9px] font-bold tracking-wide leading-none transition-colors duration-200 ${active ? "text-white/80" : "text-white/25"}`}
                >
                  {item.label}
                </span>

                {/* Active indicator dot */}
                {active && !isCart && (
                  <motion.span
                    layoutId="bottomnav-dot"
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
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
