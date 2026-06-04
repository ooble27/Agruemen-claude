import { motion } from "framer-motion";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const VIDEOS = [
  { id: "O_MxUNMXgSA", label: "Carotte", emoji: "🥕", desc: "Techniques de semis, d'arrosage, d'entretien et de récolte de la carotte maraîchère." },
  { id: "hlmdDVyiMq8", label: "Piment", emoji: "🌶️", desc: "Guide complet pour une production de piment saine, résistante et productive en conditions locales." },
  { id: "GfdXwXbSPMw", label: "Poivron", emoji: "🫑", desc: "Conseils pratiques pour maîtriser la culture du poivron : variétés, sol, irrigation et récolte." },
  { id: "UqN0-Il-V84", label: "Pomme de terre", emoji: "🥔", desc: "De la plantation à la conservation : toutes les étapes clés pour réussir la pomme de terre." },
  { id: "A-LxG_Q0uxE", label: "Chou", emoji: "🥬", desc: "Maîtriser la culture du chou pomme : préparation du sol, transplantation, traitements et coupe." },
  { id: "HRhVO1lDkRA", label: "Aubergine", emoji: "🍆", desc: "Produire des aubergines saines et abondantes : choix des plants, irrigation et lutte contre les ravageurs." },
  { id: "10tY_qaCxAM", label: "Oignon", emoji: "🧅", desc: "De la pépinière à la récolte : maîtriser toutes les étapes de la production de l'oignon local." },
  { id: "Sxo9VsEkzk4", label: "Tomate", emoji: "🍅", desc: "Techniques avancées pour une tomate de qualité : tuteurage, taille, fertilisation et protection." },
];

const Ressources = () => {
  return (
    <div className="relative min-h-screen" style={{ background: "#F5F5F2" }}>
      <LandingNavbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: "#0a0a0a" }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&h=600&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, #0a0a0a 45%, transparent 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0a0a 0%, transparent 55%)" }} />
        </div>

        <div className="relative mx-auto max-w-[1200px] px-6 md:px-8 pt-40 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2.5 border border-white/10 rounded-lg px-4 py-2 mb-7" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span className="font-headline text-[9px] font-bold text-white/35 uppercase tracking-[0.22em]">En partenariat avec</span>
              <span className="w-px h-3 bg-white/12" />
              <span className="font-headline text-[11px] font-black text-white/75 uppercase tracking-widest">ANCAR</span>
            </div>

            <h1
              className="font-headline font-black text-white leading-[0.92] tracking-[-0.04em] mb-5"
              style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)" }}
            >
              Capsules vidéo<br />
              <span style={{ color: "#4ade80" }}>pour producteurs.</span>
            </h1>
            <p className="font-body text-white/50 text-[1.05rem] leading-relaxed">
              L'ANCAR propose des vidéos gratuites pour accompagner les maraîchers sénégalais. Conseils simples, pratiques, accessibles depuis tout téléphone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Liste vidéos ── */}
      <section className="mx-auto max-w-[1200px] px-4 md:px-8 py-14 md:py-20">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1.5">ANCAR · 2024</p>
            <h2 className="font-headline font-black text-foreground text-2xl md:text-3xl tracking-tight">
              8 cultures couvertes
            </h2>
          </div>
          <a
            href="https://youtube.com/@agencenationaleduconseilag8179?feature=shared"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-headline font-bold text-sm text-white transition-opacity hover:opacity-88"
            style={{ background: "#16a34a" }}
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>smart_display</span>
            Chaîne ANCAR
          </a>
        </div>

        {/* 2-col grid desktop / 1-col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VIDEOS.map((video, i) => (
            <motion.a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: i * 0.05 }}
              className="group flex gap-0 rounded-2xl overflow-hidden bg-white border border-black/[0.07] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Thumbnail */}
              <div className="relative shrink-0 overflow-hidden" style={{ width: 168, aspectRatio: "4/3" }}>
                <img
                  src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors" />
                {/* Play */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200"
                    style={{ background: "rgba(255,255,255,0.90)" }}
                  >
                    <span
                      className="material-symbols-outlined text-[20px] leading-none"
                      style={{ color: "#0a0a0a", fontVariationSettings: "'FILL' 1", marginLeft: "2px" }}
                    >
                      play_arrow
                    </span>
                  </div>
                </div>
                {/* Number */}
                <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
                  <span className="font-headline font-black text-white text-[10px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-center px-5 py-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg leading-none">{video.emoji}</span>
                  <p className="font-headline font-black text-foreground text-base tracking-tight">{video.label}</p>
                </div>
                <p className="font-body text-on-surface-variant text-[12px] leading-relaxed line-clamp-2 mb-3">
                  {video.desc}
                </p>
                <div className="flex items-center gap-1 font-headline font-bold text-[11px] transition-colors" style={{ color: "#16a34a" }}>
                  <span>Regarder sur YouTube</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-[1200px] px-4 md:px-8 pb-20">
        <div
          className="relative rounded-2xl overflow-hidden px-8 py-10 md:px-12 md:py-14 flex flex-col sm:flex-row items-start sm:items-center gap-8"
          style={{ background: "#0a0a0a" }}
        >
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          />
          <div className="relative flex-1 min-w-0">
            <p className="font-headline font-black text-white text-xl md:text-2xl tracking-tight mb-2">
              Partagez avec les producteurs de votre entourage.
            </p>
            <p className="font-body text-white/45 text-sm leading-relaxed max-w-md">
              Ces ressources sont gratuites et disponibles pour tous. Plus on partage, plus on produit mieux — ensemble.
            </p>
          </div>
          <a
            href="https://youtube.com/@agencenationaleduconseilag8179?feature=shared"
            target="_blank"
            rel="noopener noreferrer"
            className="relative shrink-0 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-headline font-black text-sm text-white transition-opacity hover:opacity-88"
            style={{ background: "#16a34a" }}
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
            Voir la chaîne ANCAR
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Ressources;
