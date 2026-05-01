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
    <>
      {/* Safe area spacer */}
      <div className="h-[72px] md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Gradient fade at top */}
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />

        <div className="bg-background border-t border-border/30 px-2 pt-2 pb-2">
          <div className="flex items-start justify-around max-w-sm mx-auto">
            {NAV_ITEMS.map((item) => {
              const isCart = item.path === "__cart__";
              const isProfile = item.path === "__profile__";
              const active = isActive(item.path);
              const href = isProfile ? profilePath : item.path;

              const inner = (
                <div className="flex flex-col items-center gap-1 relative w-14">
                  {/* Active indicator bar at top */}
                  <motion.div
                    animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-foreground origin-center"
                  />

                  {/* Cart: special pill */}
                  {isCart ? (
                    <div className="relative">
                      <motion.div
                        animate={{
                          backgroundColor: active ? "hsl(var(--foreground))" : "transparent",
                        }}
                        transition={{ duration: 0.2 }}
                        className="w-12 h-10 rounded-md flex items-center justify-center"
                      >
                        <span
                          className={`material-symbols-outlined text-[22px] transition-colors duration-200 ${
                            active ? "text-white" : "text-on-surface-variant/70"
                          }`}
                          style={{ fontVariationSettings: active ? "'FILL' 1" : "'wght' 400" }}
                        >
                          {item.icon}
                        </span>
                      </motion.div>
                      {totalItems > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-sm flex items-center justify-center leading-none px-1 z-10"
                        >
                          {totalItems > 9 ? "9+" : totalItems}
                        </motion.span>
                      )}
                    </div>
                  ) : (
                    <div className={`w-12 h-10 rounded-md flex items-center justify-center transition-colors duration-200 ${active ? "bg-foreground/6" : ""}`}>
                      <span
                        className={`material-symbols-outlined text-[22px] transition-colors duration-200 ${
                          active ? "text-foreground" : "text-on-surface-variant/55"
                        }`}
                        style={{ fontVariationSettings: active ? "'FILL' 1, 'wght' 600" : "'wght' 300" }}
                      >
                        {item.icon}
                      </span>
                    </div>
                  )}

                  {/* Label */}
                  <span
                    className={`font-headline text-[9px] font-bold tracking-wide leading-none transition-colors duration-200 ${
                      active ? "text-foreground" : "text-on-surface-variant/40"
                    }`}
                  >
                    {item.label}
                  </span>
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
    </>
  );
};

export default BottomNav;
