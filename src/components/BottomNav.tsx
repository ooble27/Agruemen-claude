import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const HIDDEN_PATHS = ["/auth", "/checkout", "/confirmation", "/admin", "/produit"];

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
      <div
        className="fixed z-50 md:hidden"
        style={{
          bottom: 'max(calc(env(safe-area-inset-bottom, 0px) + 12px), 16px)',
          left: 16,
          right: 16,
        }}
      >
        <nav
          className="flex items-center rounded-2xl px-1.5 py-1.5"
          style={{
            background: 'rgba(10,10,10,0.92)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 12px 32px rgba(10,10,10,0.22)',
          }}
        >
          {items.map((item) => {
            const isCart = item.href === "__cart__";
            const active = isActive(item.href);

            const inner = (
              <div
                className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors"
                style={{ background: active ? 'rgba(255,255,255,0.10)' : 'transparent' }}
              >
                <div className="relative">
                  <span
                    className="material-symbols-outlined text-[20px] leading-none block"
                    style={{
                      color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                      fontVariationSettings: active ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 300",
                    }}
                  >
                    {item.icon}
                  </span>
                  {isCart && totalItems > 0 && (
                    <span
                      className="absolute -top-1 -right-2 min-w-[14px] h-[14px] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-1"
                      style={{ background: '#10b981' }}
                    >
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: active ? '#fff' : 'rgba(255,255,255,0.45)' }}
                >
                  {item.label}
                </span>
              </div>
            );

            if (isCart) {
              return (
                <button key="cart" onClick={() => setIsOpen(true)} className="flex-1 flex">
                  {inner}
                </button>
              );
            }

            return (
              <Link key={item.href} to={item.href} className="flex-1 flex">
                {inner}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default BottomNav;
