import { motion } from "framer-motion";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const VIDEOS = [
  { id: "O_MxUNMXgSA", label: "Carotte", emoji: "🥕" },
  { id: "hlmdDVyiMq8", label: "Piment", emoji: "🌶️" },
  { id: "GfdXwXbSPMw", label: "Poivron", emoji: "🫑" },
  { id: "UqN0-Il-V84", label: "Pomme de terre", emoji: "🥔" },
  { id: "A-LxG_Q0uxE", label: "Chou", emoji: "🥬" },
  { id: "HRhVO1lDkRA", label: "Aubergine", emoji: "🍆" },
  { id: "10tY_qaCxAM", label: "Oignon", emoji: "🧅" },
  { id: "Sxo9VsEkzk4", label: "Tomate", emoji: "🍅" },
];

const Ressources = () => {
  return (
    <div className="relative min-h-screen bg-white">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: "radial-gradient(circle, #dde3ec 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      <div className="relative z-[1]">
        <LandingNavbar />

        {/* ── Hero ── */}
        <section className="bg-[#0a0a0a] overflow-hidden">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 pt-36 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3.5 py-1.5 mb-6">
                <span className="material-symbols-outlined text-emerald-400 text-sm">play_circle</span>
                <span className="font-headline text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Ressources ANCAR</span>
              </div>
              <h1
                className="font-headline font-black text-white tracking-[-0.04em] leading-[0.92] mb-5"
                style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)" }}
              >
                Produire mieux,<br />local et durable.
              </h1>
              <p className="font-body text-white/50 text-lg leading-relaxed max-w-lg mb-4">
                L'ANCAR met à disposition des capsules vidéo gratuites pour accompagner les producteurs maraîchers sénégalais.
              </p>
              <p className="font-body text-white/35 text-sm leading-relaxed max-w-md">
                Carotte, piment, poivron, pomme de terre, chou, aubergine, oignon ou tomate — des conseils simples et pratiques directement sur votre téléphone.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Vidéos ── */}
        <section className="mx-auto max-w-[1200px] px-4 md:px-8 py-16 md:py-20">
          <div className="mb-10">
            <h2 className="font-headline font-black text-foreground text-2xl md:text-3xl tracking-tight mb-1">
              Capsules vidéo
            </h2>
            <p className="font-body text-on-surface-variant text-sm">
              Cliquez sur une vidéo pour la lire directement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VIDEOS.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl overflow-hidden border border-border/12 bg-white shadow-sm"
              >
                <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={`${video.label} — ANCAR`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
                <div className="px-4 py-3 flex items-center gap-2.5">
                  <span className="text-xl leading-none">{video.emoji}</span>
                  <span className="font-headline font-bold text-foreground text-sm">{video.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA partage ── */}
        <section className="mx-auto max-w-[1200px] px-4 md:px-8 pb-20">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-7 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-emerald-600 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>share</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-headline font-bold text-emerald-900 text-base mb-0.5">
                Partagez avec les producteurs de votre entourage
              </p>
              <p className="font-body text-emerald-700/70 text-sm">
                Ces ressources sont gratuites et disponibles pour tous. Plus on les partage, plus on produit mieux ensemble.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Ressources;
