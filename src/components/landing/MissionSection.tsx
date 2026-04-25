import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MOCK_PRODUCTS } from "@/data/marketplaceMocks";

const FEATURED = MOCK_PRODUCTS.slice(0, 8);

const formatPrice = (n: number) => n.toLocaleString("fr-FR");

const MissionSection = () => {
  return (
    <section id="produits" className="bg-[#f8f8f6] py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-2 block font-headline text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              Fraîcheur du jour
            </span>
            <h2 className="font-headline text-3xl font-extrabold tracking-[-0.03em] text-foreground md:text-4xl lg:text-5xl">
              Sur le Marché
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to="/marche"
              className="flex items-center gap-1.5 rounded-md border border-border/60 bg-white px-5 py-2.5 font-headline text-sm font-bold text-foreground transition-colors hover:border-foreground/30"
            >
              Voir tout
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </motion.div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {FEATURED.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <Link
                to={`/produit/${product.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/30 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden sm:h-48">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Category badge */}
                  {product.categories && (
                    <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-0.5 font-headline text-[10px] font-bold text-foreground backdrop-blur-sm">
                      {product.categories.name}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-1 p-3.5 md:p-4">
                  <h3 className="font-headline text-sm font-bold leading-tight text-foreground md:text-base">
                    {product.name}
                  </h3>
                  <p className="font-body text-[11px] text-on-surface-variant md:text-xs">
                    {product.shops?.name ?? "Agrumen"}
                  </p>
                  <div className="mt-auto pt-2.5">
                    <span className="font-headline text-base font-black text-foreground md:text-lg">
                      {formatPrice(product.price)} CFA
                    </span>
                    <span className="ml-1 font-body text-[11px] text-on-surface-variant">
                      / {product.unit}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex justify-center"
        >
          <Link
            to="/marche"
            className="flex items-center gap-2 rounded-md bg-foreground px-8 py-3.5 font-headline text-sm font-bold text-white transition-opacity hover:opacity-85"
          >
            Voir tous les produits
            <span className="material-symbols-outlined text-base">storefront</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default MissionSection;
