import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PRODUCT_STRIP = [
  { src: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=400&fit=crop&auto=format", alt: "Mangues" },
  { src: "https://images.unsplash.com/photo-1446292532430-3e76f6ab6444?w=300&h=400&fit=crop&auto=format", alt: "Carottes" },
  { src: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=300&h=400&fit=crop&auto=format", alt: "Pastèque" },
  { src: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300&h=400&fit=crop&auto=format", alt: "Ananas" },
  { src: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=300&h=400&fit=crop&auto=format", alt: "Tomate" },
  { src: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=300&h=400&fit=crop&auto=format", alt: "Citron" },
];

const ROTATIONS = [-3, 2, -2, 3, -1, 2];

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-0 text-center">

      {/* Radial glow top */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,0,0,0.03) 0%, transparent 70%)" }}
      />

      {/* Bottom fade to merge with next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="font-headline text-[13px] font-semibold text-foreground">
            La première plateforme agro-digitale du Sénégal
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6 font-headline font-black leading-[0.93] tracking-[-0.045em] text-foreground"
          style={{ fontSize: "clamp(3.4rem, 9vw, 8rem)" }}
        >
          Du Champ<br />
          à Votre Table.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-9 max-w-lg font-body text-lg leading-relaxed text-on-surface-variant md:text-xl"
        >
          Achetez directement aux producteurs sénégalais.
          Frais, naturel, <span className="font-semibold text-foreground">sans intermédiaire</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/marche"
            className="flex items-center gap-2 rounded-md bg-foreground px-8 py-4 font-headline text-base font-bold text-white shadow-md transition-opacity hover:opacity-85"
          >
            Explorer le Marché
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
          <a
            href="#comment"
            className="flex items-center gap-2 rounded-md border border-black/15 bg-white/80 px-8 py-4 font-headline text-base font-bold text-foreground backdrop-blur-sm transition-colors hover:border-black/30"
          >
            Comment ça marche
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2"
        >
          {[
            "500+ producteurs partenaires",
            "14 régions du Sénégal",
            "Livraison en 24h à Dakar",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5 font-body text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-emerald-500 text-[15px]">check_circle</span>
              {item}
            </span>
          ))}
        </motion.div>

        {/* Product image strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-14 flex items-end justify-center gap-3 pb-0"
        >
          {PRODUCT_STRIP.map((img, i) => (
            <div
              key={img.alt}
              className="hidden overflow-hidden rounded-xl border border-white/60 shadow-md sm:block"
              style={{
                width: "clamp(88px, 9vw, 130px)",
                height: "clamp(110px, 12vw, 170px)",
                transform: `rotate(${ROTATIONS[i]}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
