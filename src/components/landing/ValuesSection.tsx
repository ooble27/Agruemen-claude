import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const categories = [
  { label: "Fruits",            emoji: "🍋", border: "#fbbf24", href: "/marche?cat=cat-fruits" },
  { label: "Légumes",           emoji: "🥦", border: "#22c55e", href: "/marche?cat=cat-legumes" },
  { label: "Céréales",          emoji: "🌾", border: "#f59e0b", href: "/marche?cat=cat-cereales" },
  { label: "Tubercules",        emoji: "🥕", border: "#f97316", href: "/marche?cat=cat-tubercules" },
  { label: "Épices",            emoji: "🌶️", border: "#ef4444", href: "/marche" },
  { label: "Bio & Local",       emoji: "🌿", border: "#10b981", href: "/marche" },
  { label: "Volaille",          emoji: "🐔", border: "#a78bfa", href: "/marche" },
  { label: "Produits Laitiers", emoji: "🥛", border: "#60a5fa", href: "/marche" },
];

const row1 = [...categories, ...categories];
const row2 = [...[...categories].reverse(), ...[...categories].reverse()];

const Chip = ({ cat }: { cat: typeof categories[0] }) => (
  <Link
    to={cat.href}
    className="flex shrink-0 items-center gap-3 rounded-full px-6 py-3.5 transition-opacity hover:opacity-75"
    style={{
      border: `1.5px solid ${cat.border}33`,
      backgroundColor: `${cat.border}12`,
    }}
  >
    <span className="text-2xl">{cat.emoji}</span>
    <span className="font-headline text-base font-bold text-white">{cat.label}</span>
  </Link>
);

const ValuesSection = () => {
  return (
    <section id="categories" className="overflow-hidden bg-[#0a0a0a] py-24 md:py-32">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 px-4 text-center md:px-8"
      >
        <span className="mb-4 block font-headline text-xs font-bold uppercase tracking-[0.25em] text-white/30">
          Pour tous les goûts
        </span>
        <h2
          className="font-headline font-black leading-[0.95] tracking-[-0.04em] text-white"
          style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}
        >
          Toutes nos<br />
          Catégories.
        </h2>
        <p className="mx-auto mt-5 max-w-md font-body text-base text-white/40">
          Achetez facilement pour tous vos besoins — des fruits aux épices, 100% naturel.
        </p>
      </motion.div>

      {/* Row 1 — left → */}
      <div className="relative mb-4 flex overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
        <div className="flex animate-marquee gap-3 pr-3 will-change-transform">
          {row1.map((cat, i) => (
            <Chip key={`r1-${i}`} cat={cat} />
          ))}
        </div>
      </div>

      {/* Row 2 — right ← */}
      <div className="relative flex overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
        <div className="flex animate-marquee-reverse gap-3 pr-3 will-change-transform">
          {row2.map((cat, i) => (
            <Chip key={`r2-${i}`} cat={cat} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16 flex justify-center px-4"
      >
        <Link
          to="/marche"
          className="flex items-center gap-2 rounded-md bg-white px-8 py-4 font-headline text-sm font-bold text-foreground transition-opacity hover:opacity-90"
        >
          Voir tout le marché
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </motion.div>

    </section>
  );
};

export default ValuesSection;
