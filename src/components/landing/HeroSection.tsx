import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-white px-4 text-center">

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Radial glow top-center */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,0,0,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Bottom fade into next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-5xl pt-28 pb-16">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 shadow-sm"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="font-headline text-[13px] font-semibold text-foreground">
            La première plateforme agro-digitale du Sénégal
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-7 font-headline font-black leading-[0.95] tracking-[-0.04em] text-foreground"
          style={{ fontSize: "clamp(3.2rem, 8vw, 7rem)" }}
        >
          Du Champ<br />
          à Votre Table.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-10 max-w-xl font-body text-lg leading-relaxed text-on-surface-variant md:text-xl"
        >
          Achetez directement aux producteurs sénégalais. Frais, naturel,&nbsp;
          <span className="font-semibold text-foreground">sans intermédiaire</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/marche"
            className="flex items-center gap-2 rounded-md bg-foreground px-8 py-4 font-headline text-base font-bold text-white transition-opacity hover:opacity-85"
          >
            Explorer le Marché
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
          <a
            href="#comment"
            className="flex items-center gap-2 rounded-md border border-border/60 bg-white px-8 py-4 font-headline text-base font-bold text-foreground transition-colors hover:border-foreground/30 hover:bg-surface-container/30"
          >
            Comment ça marche
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-on-surface-variant"
        >
          {[
            "500+ producteurs partenaires",
            "14 régions couvertes",
            "Livraison en 24h à Dakar",
          ].map((item) => (
            <span key={item} className="flex items-center gap-2 font-body">
              <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
              {item}
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
