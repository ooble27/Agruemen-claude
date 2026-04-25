import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const formatPrice = (n: number) => n.toLocaleString("fr-FR");

const FEATURED = [
  {
    id: "m1",   name: "Mangues Kent",    price: 1500, unit: "le kg",    shop: "Agrumen — Casamance", category: "Fruits",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "m3",   name: "Pastèque",        price: 1800, unit: "la pièce", shop: "Agrumen — Dakar",     category: "Fruits",
    image: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "m4",   name: "Ananas Victoria", price: 1200, unit: "la pièce", shop: "Agrumen — Casamance", category: "Fruits",
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "m5",   name: "Papaye",          price: 800,  unit: "la pièce", shop: "Agrumen — Thiès",     category: "Fruits",
    image: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "car",  name: "Carottes",        price: 600,  unit: "le kg",    shop: "Agrumen — Dakar",     category: "Légumes",
    image: "https://images.unsplash.com/photo-1446292532430-3e76f6ab6444?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "m11",  name: "Tomate Fraîche",  price: 400,  unit: "le kg",    shop: "Agrumen — Dakar",     category: "Légumes",
    image: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "m12",  name: "Oignons",         price: 350,  unit: "le kg",    shop: "Agrumen — Nord",      category: "Légumes",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "m13",  name: "Piment Rouge",    price: 600,  unit: "le kg",    shop: "Agrumen — Casamance", category: "Épices",
    image: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&h=600&fit=crop&auto=format",
  },
];

const MissionSection = () => {
  return (
    <section id="produits" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-2 block font-headline text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
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
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link
              to="/marche"
              className="flex items-center gap-1.5 rounded-md border border-black/15 bg-white/80 px-5 py-2.5 font-headline text-sm font-bold text-foreground backdrop-blur-sm transition-colors hover:border-black/30"
            >
              Voir tout
              <span className="material-symbols-outlined text-base">arrow_forward</span>
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
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <Link
                to={`/produit/${product.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-40 overflow-hidden sm:h-48">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-0.5 font-headline text-[10px] font-bold text-foreground backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3.5 md:p-4">
                  <h3 className="font-headline text-sm font-bold leading-tight text-foreground md:text-base">
                    {product.name}
                  </h3>
                  <p className="font-body text-[11px] text-on-surface-variant md:text-xs">
                    {product.shop}
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
