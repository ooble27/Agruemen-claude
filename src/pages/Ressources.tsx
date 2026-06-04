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

const WHY = [
  { icon: "play_circle",  title: "Vidéos gratuites",   desc: "Toutes les capsules sont en accès libre sur YouTube, accessibles depuis n'importe quel téléphone." },
  { icon: "smartphone",   title: "Pratique & mobile",  desc: "Format court et pédagogique, conçu pour les producteurs sur le terrain." },
  { icon: "eco",          title: "Techniques locales", desc: "Les conseils sont adaptés aux conditions climatiques et agricoles du Sénégal." },
  { icon: "share",        title: "À partager",         desc: "Transmettez ces ressources à vos voisins, groupements ou coopératives agricoles." },
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
              <h1
                className="font-headline font-black text-white leading-[0.92] tracking-[-0.04em] mb-5"
                style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)" }}
              >
                Capsules vidéo<br />
                <span style={{ color: "#4ade80" }}>pour producteurs.</span>
              </h1>
              <p className="font-body text-white/50 text-[1.05rem] leading-relaxed mb-8">
                L'ANCAR propose des vidéos gratuites pour accompagner les maraîchers sénégalais. Conseils simples, pratiques, accessibles depuis tout téléphone.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://youtube.com/@agencenationaleduconseilag8179?feature=shared"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 text-white font-headline text-sm font-bold rounded-xl px-6 py-3"
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>smart_display</span>
                  Voir la chaîne ANCAR
                </a>
                <a href="#videos" className="inline-flex items-center gap-2 border border-white/20 text-white/70 font-headline text-sm font-bold rounded-xl px-6 py-3">
                  Voir les vidéos
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Partenariat strip ── */}
        <section className="border-b border-border/20">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">En partenariat avec</p>
              <p className="font-headline font-black text-foreground text-xl tracking-tight">
                ANCAR — Agence Nationale du Conseil Agricole et Rural
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {["8 vidéos", "Gratuit", "Sénégal"].map((tag) => (
                <span
                  key={tag}
                  className="font-headline font-bold text-xs px-3 py-1.5 rounded-lg border border-border/30 text-on-surface-variant"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pourquoi ces ressources ── */}
        <section className="py-20 px-6 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Pourquoi ces vidéos</p>
              <h2 className="font-headline font-black text-foreground tracking-tighter" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Des ressources pensées<br />pour le terrain.
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {WHY.map((w, i) => (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border border-border/30 bg-surface-container-lowest p-6"
                >
                  <div className="w-11 h-11 rounded-xl bg-foreground flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{w.icon}</span>
                  </div>
                  <h3 className="font-headline font-extrabold text-base text-foreground mb-2">{w.title}</h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">{w.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Vidéos (dark section) ── */}
        <section id="videos" className="py-20 px-6 md:px-8 bg-[#0a0a0a] relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "26px 26px" }}
          />
          <div className="relative mx-auto max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14 text-center"
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-3">Capsules vidéo</p>
              <h2 className="font-headline font-black text-white tracking-tighter" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                8 cultures couvertes<br />en vidéo.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {VIDEOS.map((video, i) => (
                <motion.a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="group rounded-2xl overflow-hidden border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-200 flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.label}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200"
                        style={{ background: "rgba(255,255,255,0.92)" }}
                      >
                        <span
                          className="material-symbols-outlined text-[20px] leading-none"
                          style={{ color: "#0a0a0a", fontVariationSettings: "'FILL' 1", marginLeft: "2px" }}
                        >
                          play_arrow
                        </span>
                      </div>
                    </div>
                    {/* Big decorative number */}
                    <p className="absolute top-1 left-3 font-headline font-black text-white/[0.07] text-5xl leading-none select-none">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg leading-none">{video.emoji}</span>
                      <h3 className="font-headline font-extrabold text-base text-white">{video.label}</h3>
                    </div>
                    <p className="font-body text-sm text-white/45 leading-relaxed line-clamp-2 flex-1">{video.desc}</p>
                    <div className="flex items-center gap-1 mt-4 font-headline font-bold text-[11px] text-emerald-400">
                      <span>Voir sur YouTube</span>
                      <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-6 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-[#0a0a0a] p-10 text-center relative overflow-hidden"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
              />
              <span
                className="material-symbols-outlined text-emerald-400 text-4xl mb-4 block"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                agriculture
              </span>
              <h3
                className="font-headline font-black text-white tracking-tighter mb-3"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
              >
                Partagez avec les producteurs<br />de votre entourage.
              </h3>
              <p className="font-body text-white/50 text-sm mb-8 max-w-md mx-auto">
                Ces ressources sont gratuites et disponibles pour tous. Plus on partage, plus on produit mieux — ensemble.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://youtube.com/@agencenationaleduconseilag8179?feature=shared"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-headline font-bold text-sm"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  Chaîne ANCAR sur YouTube
                </a>
                <a
                  href="#videos"
                  className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-xl font-headline font-bold text-sm"
                >
                  <span className="material-symbols-outlined text-base">smart_display</span>
                  Voir toutes les vidéos
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Ressources;
