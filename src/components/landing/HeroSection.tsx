import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const floatingTags = [
  { label: "Mangue Kent", price: "1 250", region: "Casamance", top: "8%", left: "6%", rotate: -8, delay: 0.2 },
  { label: "Bissap rouge", price: "900", region: "Thiès", top: "18%", right: "8%", rotate: 6, delay: 0.4 },
  { label: "Citron vert", price: "650", region: "Ziguinchor", top: "62%", left: "4%", rotate: 5, delay: 0.6 },
  { label: "Tomate Mboro", price: "1 100", region: "Niayes", top: "70%", right: "6%", rotate: -7, delay: 0.8 },
  { label: "Baobab", price: "2 100", region: "Tamba", top: "40%", left: "2%", rotate: -3, delay: 1.0 },
  { label: "Manioc frais", price: "550", region: "Sédhiou", top: "48%", right: "3%", rotate: 4, delay: 1.2 },
];

const HeroSection = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-background">
      {/* Grille en papier millimétré */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Tampon "FRAIS" rotatif en haut à droite */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{ scale: { duration: 0.8, delay: 1.4 }, rotate: { duration: 40, repeat: Infinity, ease: "linear" } }}
        className="pointer-events-none absolute right-4 top-24 z-30 h-28 w-28 sm:right-10 sm:top-28 md:h-40 md:w-40 lg:right-16"
      >
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <path id="circlePath" d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
          </defs>
          <text className="fill-primary font-headline text-[18px] font-extrabold uppercase tracking-[0.3em]">
            <textPath href="#circlePath">RÉCOLTÉ CE MATIN · LIVRÉ AUJOURD'HUI · </textPath>
          </text>
          <circle cx="100" cy="100" r="32" className="fill-primary-container" />
          <text x="100" y="108" textAnchor="middle" className="fill-primary font-headline text-[22px] font-black">
            FRAIS
          </text>
        </svg>
      </motion.div>

      {/* Étiquettes flottantes */}
      {floatingTags.map((tag, i) => (
        <motion.div
          key={tag.label}
          initial={{ opacity: 0, y: 20, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: tag.rotate }}
          transition={{ duration: 0.7, delay: tag.delay, ease: "easeOut" }}
          whileHover={{ rotate: 0, scale: 1.05, zIndex: 40 }}
          className="absolute z-20 hidden md:block"
          style={{
            top: tag.top,
            left: (tag as { left?: string }).left,
            right: (tag as { right?: string }).right,
          }}
        >
          <div className="relative">
            {/* Trou + ficelle */}
            <div className="absolute left-1/2 top-2 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-foreground" />
            <div className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-foreground" />
            <div
              className="mt-3 border-2 border-foreground bg-card px-4 py-2.5 shadow-[3px_3px_0_hsl(var(--foreground))]"
              style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%, 0 25%)" }}
            >
              <p className="font-headline text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
                {tag.region}
              </p>
              <p className="font-headline text-base font-extrabold leading-tight text-foreground">
                {tag.label}
              </p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-headline text-lg font-black text-primary tabular-nums">{tag.price}</span>
                <span className="font-body text-[10px] font-bold uppercase text-on-surface-variant">CFA/kg</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Contenu central */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-5 pb-20 pt-28 sm:px-8 lg:pt-32">
        {/* Date manuscrite + horloge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center gap-4 font-headline text-xs font-bold uppercase tracking-[0.3em] text-on-surface-variant sm:text-sm"
        >
          <div className="relative h-10 w-10 rounded-full border-2 border-foreground bg-card">
            {/* Aiguille heures */}
            <div
              className="absolute left-1/2 top-1/2 h-[6px] w-[2px] origin-bottom -translate-x-1/2 -translate-y-full bg-foreground"
              style={{ transform: `translate(-50%, -100%) rotate(${hours * 30 + minutes * 0.5}deg)`, transformOrigin: "50% 100%" }}
            />
            {/* Aiguille minutes */}
            <div
              className="absolute left-1/2 top-1/2 h-[10px] w-[1.5px] origin-bottom -translate-x-1/2 -translate-y-full bg-foreground"
              style={{ transform: `translate(-50%, -100%) rotate(${minutes * 6}deg)`, transformOrigin: "50% 100%" }}
            />
            {/* Aiguille secondes */}
            <div
              className="absolute left-1/2 top-1/2 h-[12px] w-[1px] origin-bottom -translate-x-1/2 -translate-y-full bg-primary"
              style={{ transform: `translate(-50%, -100%) rotate(${seconds * 6}deg)`, transformOrigin: "50% 100%" }}
            />
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground" />
          </div>
          <span className="hidden sm:inline">Carnet du maraîcher · Édition du jour</span>
          <span className="sm:hidden">Carnet · Aujourd'hui</span>
        </motion.div>

        {/* Titre découpé / mixte */}
        <div className="relative w-full text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-headline font-black uppercase leading-[0.85] tracking-[-0.04em] text-foreground"
          >
            <motion.span
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="block text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem]"
            >
              Du Champ
            </motion.span>

            {/* Mot avec effet "tampon" + ruban */}
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5, type: "spring", damping: 12 }}
              className="relative my-3 inline-block sm:my-4"
            >
              <span className="relative z-10 inline-block bg-primary px-4 py-1 italic text-primary-foreground sm:px-6 sm:py-2 text-[2.8rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7rem]">
                à votre
              </span>
              {/* Coin replié */}
              <span
                className="absolute -right-2 -top-2 h-6 w-6 bg-primary-container sm:h-8 sm:w-8"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
              />
            </motion.span>

            <motion.span
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
              className="block text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem]"
            >
              Table<span className="text-primary">.</span>
            </motion.span>
          </motion.h1>
        </div>

        {/* Sous-titre + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
          className="mt-8 flex max-w-2xl flex-col items-center gap-6 text-center sm:mt-10"
        >
          <p className="font-body text-base text-on-surface-variant sm:text-lg">
            Achetés <span className="font-semibold text-foreground">directement aux producteurs sénégalais</span>,
            <br className="hidden sm:block" />
            triés à la main, livrés chez vous le jour-même.
          </p>

          {/* Reçu CTA */}
          <div className="relative inline-block">
            <div
              className="border-2 border-foreground bg-card p-1.5 shadow-[6px_6px_0_hsl(var(--primary))]"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
              }}
            >
              <Link
                to="/marche"
                className="flex items-center gap-3 rounded-none bg-foreground px-6 py-4 font-headline text-sm font-black uppercase tracking-[0.15em] text-white transition-all hover:bg-primary sm:px-8 sm:text-base"
              >
                <span className="material-symbols-outlined text-xl text-primary-container">storefront</span>
                Ouvrir le marché
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </Link>
            </div>
            <span className="mt-2 block text-center font-body text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant">
              · Livraison Dakar dès 1 500 CFA ·
            </span>
          </div>
        </motion.div>

        {/* Bandeau bas : bilan du jour */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t-2 border-dashed border-foreground/30 pt-6 sm:mt-16"
        >
          {[
            { value: "127", label: "Producteurs" },
            { value: "14", label: "Régions" },
            { value: "0", label: "Intermédiaire" },
            { value: "<24h", label: "Champ → Porte" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="font-headline text-2xl font-black text-primary tabular-nums sm:text-3xl">
                {stat.value}
              </span>
              <span className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant sm:text-xs">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
