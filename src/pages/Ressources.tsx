import { motion } from "framer-motion";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const VIDEOS = [
  { id: "O_MxUNMXgSA", label: "Carotte", emoji: "🥕", desc: "Techniques de culture, arrosage et récolte de la carotte." },
  { id: "hlmdDVyiMq8", label: "Piment", emoji: "🌶️", desc: "Guide complet pour une production de piment saine et productive." },
  { id: "GfdXwXbSPMw", label: "Poivron", emoji: "🫑", desc: "Conseils pratiques pour cultiver le poivron en conditions locales." },
  { id: "UqN0-Il-V84", label: "Pomme de terre", emoji: "🥔", desc: "Plantation, entretien et conservation de la pomme de terre." },
  { id: "A-LxG_Q0uxE", label: "Chou", emoji: "🥬", desc: "Maîtriser la culture du chou : variétés, sol et traitements." },
  { id: "HRhVO1lDkRA", label: "Aubergine", emoji: "🍆", desc: "Produire des aubergines saines et abondantes toute la saison." },
  { id: "10tY_qaCxAM", label: "Oignon", emoji: "🧅", desc: "De la semence à la récolte : toutes les étapes de l'oignon." },
  { id: "Sxo9VsEkzk4", label: "Tomate", emoji: "🍅", desc: "Techniques avancées pour une tomate de qualité et résistante." },
];

const Ressources = () => {
  return (
    <div className="relative min-h-screen" style={{ background: "#F5F5F2" }}>
      <LandingNavbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: "#0a0a0a" }}>
        {/* Background farm photo */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&h=700&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0a0a0a 40%, transparent 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0a0a 0%, transparent 60%)" }} />
        </div>

        <div className="relative mx-auto max-w-[1200px] px-6 md:px-8 pt-40 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            {/* Partnership badge */}
            <div className="inline-flex items-center gap-2.5 border border-white/12 rounded-full px-4 py-2 mb-8" style={{ background: "rgba(255,255,255,0.05)" }}>
              <span className="font-headline text-[10px] font-bold text-white/40 uppercase tracking-widest">En partenariat avec</span>
              <span className="w-px h-3 bg-white/15" />
              <span className="font-headline text-[11px] font-black text-white/80 uppercase tracking-wider">ANCAR</span>
            </div>

            <h1
              className="font-headline font-black text-white leading-[0.92] tracking-[-0.04em] mb-6"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5.2rem)" }}
            >
              Produire mieux,<br />
              <span style={{ color: "#4ade80" }}>local et durable.</span>
            </h1>
            <p className="font-body text-white/55 text-lg leading-relaxed max-w-lg">
              L'ANCAR met à disposition des capsules vidéo gratuites pour accompagner les producteurs maraîchers sénégalais — directement sur votre téléphone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Grille vidéos ── */}
      <section className="mx-auto max-w-[1200px] px-6 md:px-8 pb-16 md:pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-headline font-black text-foreground text-2xl md:text-[1.75rem] tracking-tight leading-tight">
              Capsules vidéo
            </h2>
            <p className="font-body text-on-surface-variant text-sm mt-1">
              8 cultures · Cliquez pour regarder sur YouTube
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            <span className="font-body text-xs">Ouvre YouTube</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VIDEOS.map((video, i) => (
            <motion.a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.055 }}
              className="group rounded-2xl overflow-hidden bg-white border border-black/[0.06] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                  src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200"
                    style={{ background: "rgba(255,255,255,0.92)" }}
                  >
                    <span
                      className="material-symbols-outlined text-[22px] leading-none"
                      style={{ color: "#0a0a0a", fontVariationSettings: "'FILL' 1", marginLeft: "2px" }}
                    >
                      play_arrow
                    </span>
                  </div>
                </div>
                {/* Number badge */}
                <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="font-headline font-black text-white text-[10px]">{i + 1}</span>
                </div>
              </div>

              {/* Label */}
              <div className="px-4 py-3.5 flex items-center gap-2.5">
                <span className="text-[18px] leading-none">{video.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-headline font-bold text-foreground text-sm">{video.label}</p>
                  <p className="font-body text-on-surface-variant text-[11px] leading-snug mt-0.5 line-clamp-1">{video.desc}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── CTA partage ── */}
      <section className="mx-auto max-w-[1200px] px-6 md:px-8 pb-24">
        <div
          className="relative rounded-3xl overflow-hidden px-8 py-12 md:px-14 md:py-16 flex flex-col md:flex-row items-start md:items-center gap-8"
          style={{ background: "#0a0a0a" }}
        >
          {/* Background subtle pattern */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
          />
          <div className="relative flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/20 rounded-full px-3 py-1.5 mb-5">
              <span className="material-symbols-outlined text-emerald-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
              <span className="font-headline text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Pour les producteurs</span>
            </div>
            <h3
              className="font-headline font-black text-white tracking-tight leading-tight mb-3"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
            >
              Partagez ces ressources<br />autour de vous.
            </h3>
            <p className="font-body text-white/50 text-base leading-relaxed max-w-md">
              Ces capsules vidéo sont gratuites et disponibles pour tous les producteurs. Plus on les partage, plus on produit mieux — ensemble.
            </p>
          </div>
          <div className="relative shrink-0 flex flex-col gap-3">
            <a
              href="https://youtube.com/@agencenationaleduconseilag8179?feature=shared"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 font-headline font-black text-sm text-[#0a0a0a] transition-opacity hover:opacity-88"
              style={{ background: "#ffffff" }}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
              Chaîne ANCAR
            </a>
            <p className="font-body text-white/25 text-[11px] text-center">Voir toutes les vidéos</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Ressources;
