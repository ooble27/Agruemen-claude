import { motion } from "framer-motion";

const products = [
  "Mangue Kent", "Tomate Mboro", "Bissap Rouge", "Pastèque",
  "Citron Vert", "Piment Kaani", "Gombo", "Igname", "Banane Plantain",
  "Ananas Victoria", "Papaye", "Oignon de Podor", "Manioc Frais",
  "Mil Souna", "Arachide", "Gingembre", "Baobab", "Ditakh",
];

const stats = [
  {
    value: "500+",
    label: "Producteurs Partenaires",
    description: "Répartis dans 14 régions du Sénégal",
    icon: "groups",
  },
  {
    value: "10K+",
    label: "Commandes Livrées",
    description: "Depuis le lancement de la plateforme",
    icon: "inventory_2",
  },
  {
    value: "24h",
    label: "Livraison Express",
    description: "Champ → porte, partout à Dakar",
    icon: "local_shipping",
  },
  {
    value: "0",
    label: "Intermédiaire",
    description: "Direct producteur → consommateur",
    icon: "handshake",
  },
];

const TrustBar = () => {
  const doubled = [...products, ...products];

  return (
    <section className="overflow-hidden py-20 md:py-28">

      {/* ── Marquee ── */}
      <div className="relative flex overflow-hidden border-y border-outline-variant/40 bg-primary/[0.04] py-5">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="flex animate-marquee gap-10 pr-10 will-change-transform">
          {doubled.map((product, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-3 font-headline text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {product}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="mx-auto mt-20 max-w-[1200px] px-4 md:mt-28 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 font-headline text-xs font-bold uppercase tracking-[0.25em] text-on-surface-variant"
        >
          // En chiffres
        </motion.p>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group"
            >
              {/* Icon */}
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/[0.10] transition-colors group-hover:bg-primary/[0.18]">
                <span className="material-symbols-outlined text-primary text-[22px]">{stat.icon}</span>
              </div>

              {/* Value */}
              <div className="font-headline text-4xl font-extrabold tracking-[-0.04em] text-foreground md:text-5xl lg:text-6xl">
                {stat.value}
              </div>

              {/* Label */}
              <div className="mt-2 font-headline text-sm font-bold text-foreground">
                {stat.label}
              </div>

              {/* Description */}
              <div className="mt-1 font-body text-xs leading-relaxed text-on-surface-variant">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-20 h-px bg-outline-variant md:mt-28" />
      </div>
    </section>
  );
};

export default TrustBar;
