import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { MarketProduct } from "@/data/marketplaceMocks";
import ProductCard from "@/components/ProductCard";

interface HorizontalProductRowProps {
  title: string;
  icon?: string | null;
  products: MarketProduct[];
  onAddToCart: (product: MarketProduct, e: React.MouseEvent) => void;
  formatPrice: (n: number) => string;
  linkTo?: string;
}

const HorizontalProductRow = ({ title, icon, products, onAddToCart, formatPrice, linkTo }: HorizontalProductRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className=""
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 md:px-12 mb-3">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="material-symbols-outlined text-primary text-lg">{icon}</span>
          )}
          <h2 className="font-headline font-extrabold text-base md:text-lg">{title}</h2>
          <span className="text-xs text-on-surface-variant font-medium">({products.length})</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Desktop arrows */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex w-8 h-8 rounded-lg bg-surface-container items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-on-surface-variant">chevron_left</span>
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex w-8 h-8 rounded-lg bg-surface-container items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-on-surface-variant">chevron_right</span>
          </button>
          {linkTo && (
            <Link to={linkTo} className="text-xs font-headline font-bold text-primary hover:underline">
              Voir tout
            </Link>
          )}
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-5 md:px-12 scrollbar-hide snap-x snap-mandatory pb-1 scroll-px-5 md:scroll-px-12"
      >
        {products.map((product, i) => (
          <div key={product.id} className="shrink-0 w-[30vw] md:w-[180px] lg:w-[190px] snap-start">
            <ProductCard product={product} onAddToCart={onAddToCart} formatPrice={formatPrice} index={i} />
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default HorizontalProductRow;
