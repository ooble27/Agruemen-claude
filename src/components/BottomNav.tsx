import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const HIDDEN_PATHS = ["/auth", "/checkout", "/confirmation", "/admin"];

const BottomNav = () => {
  const location = useLocation();
  const { totalItems, setIsOpen } = useCart();
  const { user, isAdmin } = useAuth();

  if (!user) return null;
  if (HIDDEN_PATHS.some(p => location.pathname === p || location.pathname.startsWith(p + "/"))) return null;

  const profilePath = isAdmin ? "/admin" : "/mon-compte";

  const isActive = (href: string) => {
    if (href === "__cart__") return false;
    if (href === profilePath) return location.pathname === "/mon-compte" || location.pathname === "/admin";
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  const items = [
    { label: "Marché", icon: "storefront", href: "/marche" },
    { label: "Panier", icon: "shopping_bag", href: "__cart__" },
    { label: "Profil", icon: "person", href: profilePath },
  ];

  return (
    <>
      <div className="h-20 md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border/25"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around px-6 py-2">
          {items.map((item) => {
            const isCart = item.href === "__cart__";
            const active = isActive(item.href);

            const content = (
              <div className="flex flex-col items-center gap-1 py-1.5 px-4 relative">
                <div className="relative">
                  <span
                    className={`material-symbols-outlined text-[22px] leading-none block transition-colors duration-150 ${
                      active ? "text-foreground" : "text-on-surface-variant/45"
                    }`}
                    style={{
                      fontVariationSettings: active ? "'FILL' 1, 'wght' 600" : "'wght' 300",
                    }}
                  >
                    {item.icon}
                  </span>
                  {isCart && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] bg-red-500 text-white text-[8px] font-bold rounded-sm flex items-center justify-center leading-none px-0.5">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </div>
                <span
                  className={`font-headline text-[9px] font-bold leading-none transition-colors duration-150 ${
                    active ? "text-foreground" : "text-on-surface-variant/40"
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-foreground" />
                )}
              </div>
            );

            if (isCart) {
              return (
                <button key="cart" onClick={() => setIsOpen(true)} className="outline-none">
                  {content}
                </button>
              );
            }

            return (
              <Link key={item.href} to={item.href} className="outline-none">
                {content}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
