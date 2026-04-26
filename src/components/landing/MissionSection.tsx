import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MOCK_PRODUCTS } from "@/data/marketplaceMocks";

const formatPrice = (n: number) => n.toLocaleString("fr-FR");

const FEATURED_IDS = ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m13"];
const FEATURED = FEATURED_IDS
  .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
  .filter((p): p is NonNullable<typeof p> => !!p);

const MissionSection = () => {
  return (
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

        {/* Grid */}
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
                className="group flex flex-col overflow-hidden rounded-xl border border-black/8 bg-white transition-shadow hover:shadow-md sm:rounded-2xl"
              >
                {/* Image :
                    Mobile  → portrait aspect-[4/5], card plus haute et jolie
                    sm+     → h-48 fixe (design original desktop/tablette) */}
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-container sm:aspect-auto sm:h-48">
                  <img
                    src={product.image_url ?? ""}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {product.categories && (
                    <span className="absolute left-2 top-2 rounded-md bg-white/90 px-1.5 py-0.5 font-headline text-[10px] font-bold text-foreground backdrop-blur-sm sm:left-3 sm:top-3">
                      {product.categories.name}
                    </span>
                  )}
                </div>

                {/* Info
                    Mobile  → prix en haut (order-first), nom en dessous
                    sm+     → nom en haut, shop, puis prix en bas (order-last + mt-auto) */}
                <div className="flex flex-1 flex-col p-2.5 sm:gap-1 sm:p-3.5 md:p-4">

                  {/* Prix — mobile: affiché en premier ; desktop: poussé en bas */}
                  <div className="order-first sm:order-last sm:mt-auto sm:pt-2.5">
                    <span className="font-headline font-black text-foreground" style={{ fontSize: "clamp(0.85rem, 2.5vw, 1.125rem)" }}>
                      {formatPrice(product.price)}{" "}
                    </span>
                    <span className="font-body text-[10px] text-on-surface-variant">
                      CFA / {product.unit}
                    </span>
                  </div>

                  {/* Nom */}
                  <h3 className="order-2 mt-1 line-clamp-2 font-headline text-xs font-bold leading-tight text-foreground sm:order-first sm:mt-0 sm:text-sm md:text-base">
                    {product.name}
                  </h3>

                  {/* Shop — desktop/tablette seulement */}
                  <p className="order-3 hidden font-body text-[11px] text-on-surface-variant sm:block md:text-xs">
                    {product.shops?.name ?? "Agrumen"}
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
