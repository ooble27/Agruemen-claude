import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useWishlist } from "@/contexts/WishlistContext";

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
  const isMock = product.id.startsWith("m");
  const outOfStock = product.stock <= 0;
  const wishlisted = isWishlisted(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link to={`/produit/${product.id}`} className="block group">
        {/* Image */}
        <div className="relative aspect-square rounded-sm overflow-hidden bg-surface-container mb-2.5">
          {product.image_url ? (
            <img
              alt={product.name}
              src={product.image_url}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] ${outOfStock ? "opacity-40" : ""}`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/15">eco</span>
            </div>
          )}

          {/* Top row: badge left, wishlist right */}
          <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
            {outOfStock ? (
              <span className="bg-foreground text-white text-[9px] font-bold font-headline px-2 py-0.5 rounded-sm leading-tight">
                Rupture
              </span>
            ) : (
              <span />
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className={`w-6 h-6 rounded-sm flex items-center justify-center transition-all ${
                wishlisted
                  ? "bg-red-50"
                  : "bg-surface-container-lowest/80 backdrop-blur-sm"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[14px] ${wishlisted ? "text-red-500" : "text-on-surface-variant/50"}`}
                style={{ fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
          </div>

          {/* Add to cart — desktop hover */}
          {!outOfStock && (
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={(e) => onAddToCart(product, e)}
              className="absolute bottom-2 right-2 h-7 px-2.5 rounded-sm bg-foreground text-white hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <span className="material-symbols-outlined text-[12px]">add</span>
              <span className="font-headline font-bold text-[11px]">Ajouter</span>
            </motion.button>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="font-headline font-extrabold text-[13px] md:text-sm leading-snug line-clamp-2 text-foreground mb-0.5">
            {product.name}
          </p>
          {product.shops?.name && (
            <p className="font-body text-[10px] text-on-surface-variant/55 mb-1.5 truncate">
              {product.shops.name}
            </p>
          )}
          <div className="flex items-center justify-between gap-1">
            <div>
              <span className="font-headline font-black text-sm text-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="font-body text-[9px] text-on-surface-variant ml-1">
                FCFA/{product.unit}
              </span>
            </div>
            {/* Mobile: always-visible add button */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={(e) => onAddToCart(product, e)}
              disabled={outOfStock}
              className="w-7 h-7 rounded-sm bg-foreground text-white flex items-center justify-center transition-colors md:hidden disabled:opacity-25 shrink-0"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
