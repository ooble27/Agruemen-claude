import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { path: "/marche", icon: "storefront", label: "Marché" },
  { path: "__cart__", icon: "shopping_cart", label: "Panier" },
  { path: "__profile__", icon: "person", label: "Profil" },
];

const BottomNav = () => {
  const location = useLocation();
  const { totalItems, setIsOpen } = useCart();
  const { user, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  if (location.pathname === "/" || location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/produit/")) return null;

  const getProfilePath = () => (user ? (isAdmin ? "/admin" : "/mon-compte") : "/auth");
  const isProfileActive = isActive("/mon-compte") || isActive("/auth") || isActive("/admin");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-5 mb-2 safe-area-bottom">
        <div className="flex items-center justify-around bg-foreground rounded-xl px-3 py-2.5">
          {navItems.map((item) => {
            const isCart = item.path === "__cart__";
            const isProfile = item.path === "__profile__";
            const active = isCart ? false : isProfile ? isProfileActive : isActive(item.path);
            const href = isCart ? "#" : isProfile ? getProfilePath() : item.path;

            const content = (
              <div className="relative flex items-center justify-center">
                <motion.div
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                    active ? "bg-background" : ""
                  }`}
                  whileTap={{ scale: 0.93 }}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      active ? "text-foreground" : "text-background/60"
                    }`}
                    style={active ? { fontVariationSettings: "'FILL' 1, 'wght' 600" } : { fontVariationSettings: "'wght' 400" }}
                  >
                    {item.icon}
                  </span>
                  {active && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      className="text-[12px] font-headline font-bold text-foreground overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.div>
                {isCart && totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1 w-[18px] h-[18px] bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center z-20"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </div>
            );

            if (isCart) {
              return (
                <button key={item.path} onClick={() => setIsOpen(true)} className="outline-none">
                  {content}
                </button>
              );
            }

            return (
              <Link key={item.path} to={href} className="outline-none">
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
