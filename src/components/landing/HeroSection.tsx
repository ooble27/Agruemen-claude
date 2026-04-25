import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const previewCategories = [
  { label: "Fruits", emoji: "🍋", bg: "#FEF9C3" },
  { label: "Légumes", emoji: "🥦", bg: "#DCFCE7" },
  { label: "Céréales", emoji: "🌾", bg: "#FEF3C7" },
  { label: "Bio & Local", emoji: "🌿", bg: "#D1FAE5" },
  { label: "Épices", emoji: "🌶️", bg: "#FEE2E2" },
  { label: "Racines", emoji: "🥕", bg: "#FFEDD5" },
];

const avatarColors = ["#22c55e", "#f59e0b", "#3b82f6"];
const avatarLetters = ["A", "M", "F"];

const HeroSection = () => {
  return (
    <section className="min-h-[100svh] flex items-center overflow-hidden bg-[#f9f6f1] px-4 md:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-[1200px] py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ── Left: Content ── */}
          <div>
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/40 bg-white px-4 py-1.5 shadow-sm"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="font-headline text-xs font-semibold text-foreground">
                500+ Producteurs Partenaires
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-5 font-headline text-[3rem] font-black leading-[1.05] tracking-[-0.03em] text-foreground md:text-[4rem] lg:text-[4.5rem]"
            >
              Du Champ<br />
              à Votre Table.
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 max-w-[480px] font-body text-base leading-relaxed text-on-surface-variant md:text-lg"
            >
              Achetez directement aux producteurs sénégalais. Des produits frais, 100% naturels, livrés chez vous en moins de 24h.
            </motion.p>

            {/* Checkmarks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-10 space-y-3"
            >
              {[
                "Aucun intermédiaire — prix producteur direct",
                "Produits frais récoltés le matin même",
                "Livraison partout à Dakar en moins de 24h",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground">
                    <span className="material-symbols-outlined text-[13px] text-white">check</span>
                  </div>
                  <span className="font-body text-sm text-foreground">{item}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA + social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-start gap-5 sm:flex-row sm:items-center"
            >
              <Link
                to="/marche"
                className="flex items-center gap-2 rounded-md bg-foreground px-8 py-4 font-headline text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                Explorer le Marché
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {avatarLetters.map((letter, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f9f6f1] text-xs font-bold text-white"
                      style={{ backgroundColor: avatarColors[i] }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="font-body text-xs text-on-surface-variant">
                  <span className="font-bold text-foreground">10 000+</span> commandes livrées
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── Right: App preview card ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:flex lg:justify-end"
          >
            <div className="w-full max-w-[340px] rounded-2xl bg-white p-6 shadow-xl">
              {/* Card header */}
              <div className="mb-5 flex items-center justify-between">
                <p className="font-headline text-lg font-black text-foreground">Votre Marché</p>
                <span className="rounded-full bg-surface-container px-3 py-1 font-headline text-xs font-medium text-on-surface-variant">
                  Aujourd'hui
                </span>
              </div>

              {/* Category chips */}
              <div className="mb-5 grid grid-cols-2 gap-3">
                {previewCategories.map((cat, i) => (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.07 }}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl p-3.5 transition-transform hover:scale-105"
                    style={{ backgroundColor: cat.bg }}
                  >
                    <span className="text-xl">{cat.emoji}</span>
                    <span className="font-headline text-sm font-bold text-foreground">{cat.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Build order card */}
              <div className="flex items-center gap-4 rounded-xl bg-[#f0f7ef] p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <span className="material-symbols-outlined text-xl text-foreground">shopping_basket</span>
                </div>
                <div>
                  <p className="font-headline text-sm font-bold text-foreground">Construire ma Commande</p>
                  <p className="mt-0.5 font-body text-xs text-on-surface-variant">Fruits, légumes, céréales au choix.</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
