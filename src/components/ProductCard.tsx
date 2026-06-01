import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

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
  const { items, updateQuantity } = useCart();
  const cartItem = items.find(i => i.id === product.id);
  const qty = cartItem?.quantity || 0;
  const outOfStock = product.stock <= 0;
  const wishlisted = isWishlisted(product.id);
  const [hover, setHover] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product, e);
  };

  const handleInc = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, qty + 1);
  };

  const handleDec = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, qty - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.3 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.18s cubic-bezier(0.2,0.8,0.2,1)',
      }}
    >
      <Link to={`/produit/${product.id}`} className="block">
        {/* Image */}
        <div
          className="relative aspect-square rounded-2xl overflow-hidden mb-2.5"
          style={{
            background: 'hsl(60 5% 94%)',
            border: '1px solid hsl(60 5% 92%)',
            boxShadow: hover ? '0 4px 16px rgba(10,10,10,0.08)' : '0 1px 2px rgba(10,10,10,0.04)',
            transition: 'box-shadow 0.18s',
          }}
        >
          {product.image_url ? (
            <img
              alt={product.name}
              src={product.image_url}
              className="w-full h-full object-cover"
              style={{
                transform: hover ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 0.4s cubic-bezier(0.2,0.8,0.2,1)',
                opacity: outOfStock ? 0.4 : 1,
              }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl" style={{ color: 'hsl(60 2% 54% / 0.2)' }}>eco</span>
            </div>
          )}

          {outOfStock && (
            <span className="absolute top-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-md leading-tight" style={{ background: '#0A0A0A' }}>
              Rupture
            </span>
          )}

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(6px)',
              boxShadow: '0 1px 4px rgba(10,10,10,0.12)',
            }}
          >
            <span
              className="material-symbols-outlined text-[13px]"
              style={{
                color: wishlisted ? '#F07800' : 'hsl(60 2% 54%)',
                fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              favorite
            </span>
          </button>

          {!outOfStock && (
            <div className="absolute bottom-2 right-2">
              {qty === 0 ? (
                <button
                  onClick={handleAdd}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(6px)',
                    boxShadow: '0 2px 8px rgba(10,10,10,0.14)',
                    border: '1px solid rgba(10,10,10,0.08)',
                  }}
                >
                  <span className="material-symbols-outlined text-[16px]" style={{ color: '#0A0A0A' }}>add</span>
                </button>
              ) : (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center rounded-full px-0.5 py-0.5"
                  style={{ background: '#0A0A0A', boxShadow: '0 2px 8px rgba(10,10,10,0.2)' }}
                >
                  <button onClick={handleDec} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ color: '#fff' }}>
                    <span className="material-symbols-outlined text-[13px]">{qty === 1 ? 'delete' : 'remove'}</span>
                  </button>
                  <span className="text-[12px] font-semibold min-w-[16px] text-center" style={{ color: '#fff' }}>{qty}</span>
                  <button onClick={handleInc} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ color: '#fff' }}>
                    <span className="material-symbols-outlined text-[13px]">add</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-baseline gap-1 mb-0.5">
            <span className="font-headline font-bold text-[14px] tracking-tight" style={{ color: '#0A0A0A' }}>
              {formatPrice(product.price)}
            </span>
            <span className="text-[10.5px] font-body" style={{ color: 'hsl(60 2% 54%)' }}>F · {product.unit}</span>
          </div>
          <p className="font-body text-[13px] leading-snug line-clamp-1" style={{ color: 'rgba(10,10,10,0.75)' }}>
            {product.name}
          </p>
          {product.shops?.name && (
            <p className="font-body text-[10.5px] mt-0.5 truncate" style={{ color: 'hsl(60 2% 54%)' }}>
              {product.shops.name}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
