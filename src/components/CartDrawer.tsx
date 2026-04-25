import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalPrice, totalItems, clearCart } = useCart();
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
          className="px-6 pb-4 border-b border-border"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1.5rem)" }}
        >
          <div className="flex items-center gap-3">
            <SheetTitle className="font-headline font-extrabold text-2xl tracking-tight flex items-center gap-2 flex-1">
              <span className="material-symbols-outlined text-foreground">shopping_bag</span>
              Mon Panier
            </SheetTitle>
            {totalItems > 0 && (
              <>
                <span className="text-sm bg-foreground text-white px-3 py-1 rounded-md font-headline font-bold shrink-0">
                  {totalItems} article{totalItems > 1 ? "s" : ""}
                </span>
                <button
                  onClick={clearCart}
                  className="p-1.5 rounded-md text-on-surface-variant hover:text-destructive hover:bg-surface-container transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </>
            )}
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-4">shopping_cart</span>
            <p className="font-headline font-extrabold text-xl mb-2">Panier vide</p>
            <p className="text-on-surface-variant text-sm mb-6">Découvrez nos produits frais du terroir sénégalais.</p>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-foreground text-white px-6 py-3 rounded-md font-headline font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Explorer le Marché
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable area: products + pricing */}
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
                      className="flex gap-3 bg-surface-container-lowest rounded-md p-3.5 border border-border/30"
                    >
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-headline font-extrabold text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-on-surface-variant">{item.farmer}</p>
                        <p className="text-sm font-headline font-bold mt-1">{item.price} / {item.unit}</p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-0 bg-surface-container rounded-full">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
                            >
                              <span className="material-symbols-outlined text-base">remove</span>
                            </button>
                            <span className="w-8 text-center font-headline font-bold text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
                            >
                              <span className="material-symbols-outlined text-base">add</span>
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-on-surface-variant hover:text-destructive transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pricing summary — inside scrollable area */}
              <div className="mt-4 border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Sous-total</span>
                  <span className="font-headline font-bold">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Livraison</span>
                  <span className="font-headline font-bold">Gratuite</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="font-headline font-extrabold text-lg">Total</span>
                  <span className="font-headline font-extrabold text-lg">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Static bottom: Commander button only */}
            <div className="border-t border-border px-4 py-4">
              <button
                onClick={handleCheckout}
                className="w-full bg-foreground text-white py-4 rounded-md font-headline font-extrabold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined">shopping_cart_checkout</span>
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
