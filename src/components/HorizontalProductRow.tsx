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
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.65 : el.clientWidth * 0.65, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 md:px-12 mb-3">
        <div className="flex items-center gap-2">
          {icon && (
            <span
              className="material-symbols-outlined text-[18px] text-foreground/40"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {icon}
            </span>
          )}
          <h2 className="font-headline font-black text-base md:text-[17px] tracking-tight">{title}</h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex w-7 h-7 rounded-sm bg-surface-container items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-on-surface-variant">chevron_left</span>
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex w-7 h-7 rounded-sm bg-surface-container items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-on-surface-variant">chevron_right</span>
          </button>
          {linkTo ? (
            <Link
              to={linkTo}
              className="flex items-center gap-0.5 font-headline text-[11px] font-bold text-on-surface-variant hover:text-foreground transition-colors"
            >
              Voir tout
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          ) : (
            <span className="font-headline text-[11px] font-bold text-on-surface-variant/40">
              {products.length} produit{products.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-5 md:px-12 scrollbar-hide snap-x snap-mandatory pb-1 scroll-px-5 md:scroll-px-12"
      >
        {products.map((product, i) => (
          <div key={product.id} className="shrink-0 w-[44vw] md:w-[185px] lg:w-[195px] snap-start">
            <ProductCard product={product} onAddToCart={onAddToCart} formatPrice={formatPrice} index={i} />
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default HorizontalProductRow;
