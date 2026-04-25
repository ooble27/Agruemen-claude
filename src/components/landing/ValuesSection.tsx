import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const categories = [
  { label: "Fruits",           emoji: "🍋", bg: "#FEF9C3", color: "#713F12", href: "/marche?cat=cat-fruits" },
  { label: "Légumes",          emoji: "🥦", bg: "#DCFCE7", color: "#14532D", href: "/marche?cat=cat-legumes" },
  { label: "Céréales",         emoji: "🌾", bg: "#FEF3C7", color: "#78350F", href: "/marche?cat=cat-cereales" },
  { label: "Tubercules",       emoji: "🥕", bg: "#FFEDD5", color: "#7C2D12", href: "/marche?cat=cat-tubercules" },
  { label: "Épices",           emoji: "🌶️", bg: "#FEE2E2", color: "#7F1D1D", href: "/marche?cat=cat-epices" },
  { label: "Bio & Local",      emoji: "🌿", bg: "#D1FAE5", color: "#064E3B", href: "/marche" },
  { label: "Volaille",         emoji: "🐔", bg: "#F3E8FF", color: "#4A044E", href: "/marche" },
  { label: "Produits Laitiers",emoji: "🥛", bg: "#E0F2FE", color: "#0C4A6E", href: "/marche" },
];

const ValuesSection = () => {
  return (
    <section id="categories" className="bg-[#f8f8f6] py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">

        {/* Header */}
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-3 block font-headline text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              Pour tous les goûts
            </span>
            <h2 className="font-headline text-3xl font-extrabold tracking-[-0.03em] text-foreground md:text-4xl lg:text-5xl">
              La façon la plus simple<br />
              <span className="text-on-surface-variant">d'acheter frais.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="shrink-0"
          >
            <Link
              to="/marche"
              className="flex items-center gap-1.5 rounded-md bg-foreground px-6 py-3 font-headline text-sm font-bold text-white transition-opacity hover:opacity-85"
            >
              Voir tout le marché
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </motion.div>
        </div>

        {/* Category chips */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link
                to={cat.href}
                className="flex items-center gap-3 rounded-xl p-4 transition-all hover:scale-[1.03] hover:opacity-90 active:scale-[0.97] md:p-5"
                style={{ backgroundColor: cat.bg }}
              >
                <span className="text-2xl md:text-3xl">{cat.emoji}</span>
                <span
                  className="font-headline text-sm font-bold md:text-base"
                  style={{ color: cat.color }}
                >
                  {cat.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Subtitle note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center font-body text-sm text-on-surface-variant"
        >
          Achetez facilement pour tous vos besoins — 100% naturel, tracé de la récolte à votre porte.{" "}
          <Link to="/marche" className="font-bold text-foreground underline underline-offset-2">
            Découvrir maintenant →
          </Link>
        </motion.p>

      </div>
    </section>
  );
};

export default ValuesSection;
