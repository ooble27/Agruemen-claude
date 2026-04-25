import { motion } from "framer-motion";

const products = [
  "Mangues Kent", "Tomate Mboro", "Bissap Rouge", "Pastèque",
  "Citron Vert", "Piment Kaani", "Gombo", "Igname", "Banane Plantain",
  "Ananas Victoria", "Papaye", "Oignon de Podor", "Manioc Frais",
  "Mil Souna", "Arachide", "Gingembre", "Baobab", "Ditakh",
];

const stats = [
  { value: "500+", label: "Producteurs Partenaires", sub: "répartis dans 14 régions" },
  { value: "10K+", label: "Commandes Livrées",       sub: "depuis le lancement" },
  { value: "0",    label: "Intermédiaire",            sub: "direct producteur → vous" },
  { value: "<24h", label: "Champ → Votre Porte",     sub: "partout à Dakar" },
];

const TrustBar = () => {
  const doubled = [...products, ...products];

  return (
    <section className="bg-white/60 backdrop-blur-sm">

      {/* Marquee */}
      <div className="relative flex overflow-hidden border-y border-black/8 bg-black/[0.02] py-3.5">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white/60 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white/60 to-transparent" />
        <div className="flex animate-marquee gap-8 pr-8 will-change-transform">
          {doubled.map((product, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-2.5 font-headline text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant"
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
              {product}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-[1200px] px-4 py-20 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`flex flex-col gap-1 md:px-8 ${
                i < stats.length - 1 ? "md:border-r md:border-black/10" : ""
              }`}
            >
              <span className="font-headline text-4xl font-black tracking-[-0.04em] text-foreground md:text-5xl">
                {stat.value}
              </span>
              <span className="font-headline text-sm font-bold text-foreground">{stat.label}</span>
              <span className="font-body text-xs text-on-surface-variant">{stat.sub}</span>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default TrustBar;
