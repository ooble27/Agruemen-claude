import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

  const handleCheckout = () => {
    setIsOpen(false);
    if (!user) {
      navigate("/auth");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-card flex flex-col p-0">
        <SheetHeader
          className="px-6 pb-4 border-b border-border/20"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1.5rem)" }}
        >
          <div className="flex items-center gap-2">
            <SheetTitle className="font-headline font-black text-xl tracking-tight flex items-center gap-2 flex-1">
              <span className="material-symbols-outlined text-foreground" style={{ fontVariationSettings: "'FILL' 1" }}>
                shopping_bag
              </span>
              Mon Panier
            </SheetTitle>
            {totalItems > 0 && (
              <>
                <span className="text-xs bg-foreground text-white px-2.5 py-1 rounded-sm font-headline font-bold shrink-0">
                  {totalItems} article{totalItems > 1 ? "s" : ""}
                </span>
                <button
                  onClick={clearCart}
                  className="p-1.5 rounded-sm text-on-surface-variant hover:text-destructive hover:bg-surface-container transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </>
            )}
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4">shopping_cart</span>
            <p className="font-headline font-black text-xl tracking-tight mb-2">Panier vide</p>
            <p className="text-on-surface-variant text-sm mb-6">Découvrez nos produits frais du terroir sénégalais.</p>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-foreground text-white px-6 py-3 rounded-sm font-headline font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Explorer le Marché
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable area */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 bg-surface-container-lowest rounded-sm p-3.5 border border-border/20"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-18 h-18 rounded-sm object-cover flex-shrink-0"
                        style={{ width: 72, height: 72 }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-headline font-extrabold text-sm truncate">{item.name}</h4>
                        <p className="text-[11px] text-on-surface-variant/70">{item.farmer}</p>
                        <p className="text-sm font-headline font-bold mt-0.5">{item.price} / {item.unit}</p>

                        <div className="flex items-center justify-between mt-2.5">
                          <div
                            className="flex items-center rounded-full"
                            style={{ background: '#F07800' }}
                          >
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full"
                              style={{ color: '#fff' }}
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {item.quantity === 1 ? 'delete' : 'remove'}
                              </span>
                            </button>
                            <span className="w-6 text-center font-bold text-sm" style={{ color: '#fff' }}>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full"
                              style={{ color: '#fff' }}
                            >
                              <span className="material-symbols-outlined text-[14px]">add</span>
                            </button>
                          </div>
                          <span className="font-headline font-bold text-sm" style={{ color: '#0A0A0A' }}>
                            {(item.priceNum * item.quantity).toLocaleString("fr-FR")} F
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pricing summary */}
              <div className="mt-4 border-t border-border/20 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Sous-total</span>
                  <span className="font-headline font-bold">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Livraison</span>
                  <span className="font-headline font-bold text-emerald-600">Gratuite</span>
                </div>
                <div className="h-px bg-border/30" />
                <div className="flex justify-between">
                  <span className="font-headline font-black text-lg">Total</span>
                  <span className="font-headline font-black text-lg">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Checkout button */}
            <div className="border-t border-border/20 px-4 py-4">
              <button
                onClick={handleCheckout}
                className="w-full bg-foreground text-white py-3.5 rounded-sm font-headline font-extrabold text-base flex items-center justify-center gap-2.5 hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-lg">shopping_cart_checkout</span>
                Commander
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
