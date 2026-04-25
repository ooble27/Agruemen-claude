import { motion } from "framer-motion";

const values = [
  {
    icon: "handshake",
    title: "Direct Producteur",
    desc: "Zéro intermédiaire entre le producteur et vous. Chaque centime va directement à l'agriculteur.",
    bg: "#DCFCE7",
    color: "#14532D",
  },
  {
    icon: "eco",
    title: "100% Naturel",
    desc: "Pas de pesticides, pas d'additifs. Des produits cultivés selon les méthodes traditionnelles sénégalaises.",
    bg: "#D1FAE5",
    color: "#064E3B",
  },
  {
    icon: "verified",
    title: "Traçabilité Totale",
    desc: "Connaissez l'origine exacte de chaque produit : le producteur, la région, la date de récolte.",
    bg: "#E0F2FE",
    color: "#0C4A6E",
  },
  {
    icon: "payments",
    title: "Paiement Flexible",
    desc: "Payez avec Wave, Orange Money, Free Money ou carte bancaire. Simple, rapide et sécurisé.",
    bg: "#FEF3C7",
    color: "#78350F",
  },
];

const ValuesSection = () => {
  return (
    <section id="valeurs" className="bg-[#f9f6f1] py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 md:mb-20"
        >
          <span className="mb-4 block font-headline text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Pourquoi Agrumen
          </span>
          <h2 className="max-w-2xl font-headline text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground md:text-5xl lg:text-6xl">
            Fait pour vous,<br />
            <span className="text-on-surface-variant">pensé pour eux.</span>
          </h2>
        </motion.div>

        {/* Value cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="rounded-2xl bg-white p-7"
            >
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: v.bg }}
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ color: v.color }}
                >
                  {v.icon}
                </span>
              </div>
              <h3 className="mb-2 font-headline text-base font-bold text-foreground">{v.title}</h3>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant">{v.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ValuesSection;
