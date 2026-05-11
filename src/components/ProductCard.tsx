import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useWishlist } from "@/contexts/WishlistContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Card className="group overflow-hidden border border-border/60 hover:border-border hover:shadow-md transition-all duration-200 bg-card rounded-xl">
        <Link to={`/produit/${product.id}`} className="block">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted rounded-t-xl">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${
                  outOfStock ? "opacity-50 grayscale-[20%]" : ""
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Leaf className="h-10 w-10 text-muted-foreground/20" />
              </div>
            )}

            {outOfStock && (
              <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
                <span className="bg-background/95 text-foreground text-[10px] font-semibold px-2.5 py-1 rounded-full border border-border/50">
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
              className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-sm ${
                wishlisted
                  ? "bg-white text-red-500"
                  : "bg-white/80 text-muted-foreground hover:text-red-400"
              }`}
            >
              <Heart
                className="h-3.5 w-3.5"
                fill={wishlisted ? "currentColor" : "none"}
              />
            </button>

            {/* Desktop hover add button */}
            {!outOfStock && (
              <div className="absolute bottom-2 right-2 hidden md:block opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                <Button
                  size="sm"
                  className="h-8 px-3 text-xs shadow-md gap-1.5 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAddToCart(product, e);
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter
                </Button>
              </div>
            )}
          </div>

          {/* Info */}
          <CardContent className="p-3">
            {product.categories?.name && (
              <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wide mb-1">
                {product.categories.name}
              </p>
            )}
            <p className="font-semibold text-[13px] leading-snug line-clamp-2 text-foreground mb-0.5">
              {product.name}
            </p>
            {product.shops?.name && (
              <p className="text-[11px] text-muted-foreground truncate mb-2.5">
                {product.shops.name}
              </p>
            )}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="font-bold text-sm text-foreground">
                  {formatPrice(product.price)}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  FCFA/{product.unit}
                </span>
              </div>
              {/* Mobile: always visible add */}
              <Button
                size="icon"
                className="h-7 w-7 md:hidden shrink-0 rounded-full"
                disabled={outOfStock}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart(product, e);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
