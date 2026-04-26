import { motion } from "framer-motion";

const products = [
  { emoji: "🥭", name: "Mangues Kent" },
  { emoji: "🍅", name: "Tomate Mboro" },
  { emoji: "🌺", name: "Bissap Rouge" },
  { emoji: "🍉", name: "Pastèque" },
  { emoji: "🍋", name: "Citron Vert" },
  { emoji: "🌶️", name: "Piment Kaani" },
  { emoji: "🫛", name: "Gombo" },
  { emoji: "🍠", name: "Igname" },
  { emoji: "🍌", name: "Banane Plantain" },
  { emoji: "🍍", name: "Ananas Victoria" },
  { emoji: "🍈", name: "Papaye" },
  { emoji: "🧅", name: "Oignon de Podor" },
  { emoji: "🌾", name: "Mil Souna" },
  { emoji: "🥜", name: "Arachide" },
  { emoji: "🌿", name: "Gingembre" },
  { emoji: "🌳", name: "Baobab" },
  { emoji: "🥥", name: "Ditakh" },
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
      <div className="relative flex overflow-hidden border-y border-black/8 bg-black/[0.015] py-3">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white/60 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white/60 to-transparent" />
        <div className="flex animate-marquee gap-6 pr-6 will-change-transform">
          {doubled.map((product, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-2 font-headline text-[12px] font-semibold text-on-surface-variant"
            >
              <span className="text-base">{product.emoji}</span>
              {product.name}
              <span className="ml-2 h-1 w-1 shrink-0 rounded-full bg-foreground/20" />
            </span>
          ))}
        </div>
      </div>

      {/* Stats — padding réduit */}
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-8 md:py-16">
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
