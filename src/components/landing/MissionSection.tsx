import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MOCK_PRODUCTS } from "@/data/marketplaceMocks";

const formatPrice = (n: number) => n.toLocaleString("fr-FR");

// IDs avec images Unsplash confirmées, variété fruits + légumes
const FEATURED_IDS = ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m13"];
const FEATURED = FEATURED_IDS
  .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
  .filter((p): p is NonNullable<typeof p> => !!p);

const MissionSection = () => {
  return (
    // pt réduit pour coller aux stats du dessus
    <section id="produits" className="pt-10 pb-16 md:pt-14 md:pb-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-1.5 block font-headline text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              Fraîcheur du jour
            </span>
            <h2 className="font-headline text-2xl font-extrabold tracking-[-0.03em] text-foreground md:text-4xl lg:text-5xl">
              Sur le Marché
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link
              to="/marche"
              className="flex items-center gap-1.5 rounded-md border border-black/15 bg-white/80 px-4 py-2 font-headline text-sm font-bold text-foreground backdrop-blur-sm transition-colors hover:border-black/30"
            >
              Voir tout
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </motion.div>
        </div>

        {/* Grid — style identique au Marché */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {FEATURED.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
            >
              <Link
                to={`/produit/${product.id}`}
                className="group block overflow-hidden rounded-md border border-black/8 bg-white transition-shadow hover:shadow-md"
              >
                {/* Image carrée — identique à ProductCard */}
                <div className="relative aspect-square overflow-hidden bg-surface-container">
                  <img
                    src={product.image_url ?? ""}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Catégorie en badge */}
                  {product.categories && (
                    <span className="absolute left-2 top-2 rounded-md bg-white/90 px-1.5 py-0.5 font-headline text-[10px] font-bold text-foreground backdrop-blur-sm">
                      {product.categories.name}
                    </span>
                  )}
                </div>

                {/* Info — même ordre que ProductCard */}
                <div className="p-2.5 md:p-3">
                  <p className="font-headline text-sm font-extrabold text-foreground md:text-base">
                    {formatPrice(product.price)}{" "}
                    <span className="font-normal text-[10px] text-on-surface-variant md:text-xs">FCFA</span>
                  </p>
                  <p className="mt-0.5 line-clamp-2 font-headline text-xs font-bold leading-tight text-on-surface-variant md:text-sm">
                    {product.name}
                  </p>
                  <p className="mt-0.5 font-body text-[10px] text-on-surface-variant/70 md:text-xs">
                    {product.unit}
                  </p>
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
          className="mt-8 flex justify-center"
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
