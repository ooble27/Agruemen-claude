import { motion } from "framer-motion";

const products = [
  "Mangue Kent", "Tomate Mboro", "Bissap Rouge", "Pastèque",
  "Citron Vert", "Piment Kaani", "Gombo", "Igname", "Banane Plantain",
  "Ananas Victoria", "Papaye", "Oignon de Podor", "Manioc Frais",
  "Mil Souna", "Arachide", "Gingembre", "Baobab", "Ditakh",
];

const stats = [
  { value: "500+", label: "Producteurs Partenaires" },
  { value: "14", label: "Régions du Sénégal" },
  { value: "10K+", label: "Commandes Livrées" },
  { value: "24h", label: "Champ → Votre Porte" },
];

const TrustBar = () => {
  const doubled = [...products, ...products];

  return (
    <section className="bg-background py-20">
      {/* Marquee */}
      <div className="relative flex overflow-hidden border-y border-border/40 bg-surface-container/20 py-4">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="flex animate-marquee gap-10 pr-10 will-change-transform">
          {doubled.map((product, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-3 font-headline text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
              {product}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto mt-16 max-w-[1200px] px-4 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center md:text-left"
            >
              <div className="font-headline text-4xl font-black tracking-[-0.04em] text-foreground md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-1.5 font-headline text-sm font-medium text-on-surface-variant">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
