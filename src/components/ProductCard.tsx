import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useWishlist } from "@/contexts/WishlistContext";
import { Plus, Heart, Leaf } from "lucide-react";

interface ProductCardProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  image_url: string | null;
  stock: number;
  categories?: { name: string; icon: string | null } | null;
  shops?: { name: string; seller_id: string } | null;
}

interface ProductCardProps {
  product: ProductCardProduct;
  onAddToCart: (product: any, e: React.MouseEvent) => void;
  formatPrice: (n: number) => string;
  index?: number;
}

const ProductCard = ({ product, onAddToCart, formatPrice, index = 0 }: ProductCardProps) => {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const outOfStock = product.stock <= 0;
  const wishlisted = isWishlisted(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="group rounded-2xl overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 border border-border/20 hover:border-border/40 hover:-translate-y-0.5">
        <Link to={`/produit/${product.id}`} className="block">

          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06] ${
                  outOfStock ? "opacity-50" : ""
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Leaf className="h-10 w-10 text-muted-foreground/20" />
              </div>
            )}

            {outOfStock && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <span className="bg-white text-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-border/30">
                  Rupture
                </span>
              </div>
            )}

            {/* Wishlist */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all ${
                wishlisted ? "bg-red-50 text-red-500" : "bg-white/90 text-muted-foreground hover:text-red-400"
              }`}
            >
              <Heart className="h-3.5 w-3.5" fill={wishlisted ? "currentColor" : "none"} />
            </button>

            {/* Desktop hover add */}
            {!outOfStock && (
              <div className="absolute bottom-2.5 right-2.5 hidden md:block opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 transition-all duration-200">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(product, e); }}
                  className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3.5 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="font-semibold text-[13px] leading-snug line-clamp-2 text-foreground mb-0.5">
              {product.name}
            </p>
            {product.shops?.name && (
              <p className="text-[11px] text-muted-foreground truncate mb-2.5">
                {product.shops.name}
              </p>
            )}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-sm text-primary">{formatPrice(product.price)}</span>
                <span className="text-[10px] text-muted-foreground">FCFA/{product.unit}</span>
              </div>
              {/* Mobile: always visible */}
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(product, e); }}
                disabled={outOfStock}
                className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center md:hidden shrink-0 disabled:opacity-30 hover:bg-primary/90 active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
