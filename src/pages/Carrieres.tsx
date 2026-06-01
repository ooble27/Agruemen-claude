import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=360&h=480&fit=crop&auto=format", alt: "Équipe", rot: -4 },
  { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=360&h=480&fit=crop&auto=format", alt: "Bureau", rot: 3 },
  { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=360&h=480&fit=crop&auto=format", alt: "Collaboration", rot: -1 },
];

const PERKS = [
  { icon: "payments", title: "Salaire compétitif", desc: "Rémunération au-dessus du marché sénégalais avec révision annuelle systématique." },
  { icon: "health_and_safety", title: "Couverture santé", desc: "Assurance maladie complète pour vous et votre famille dès le premier jour." },
  { icon: "school", title: "Formation continue", desc: "Budget formation annuel de 300 000 FCFA + accès à des cours en ligne illimités." },
  { icon: "home_work", title: "Flex & remote", desc: "3 jours en présentiel, 2 jours à distance. Horaires flexibles selon votre poste." },
  { icon: "restaurant", title: "Repas offerts", desc: "Déjeuner quotidien pris en charge avec des produits frais de nos partenaires producteurs." },
  { icon: "volunteer_activism", title: "Impact réel", desc: "Chaque jour, votre travail améliore la vie de centaines de producteurs et de familles sénégalaises." },
];

const JOBS = [
  {
    id: 1,
    title: "Développeur Full-Stack (React / Node.js)",
    department: "Tech",
    location: "Dakar · Hybride",
    type: "CDI",
    level: "Mid-Senior",
    desc: "Vous rejoindrez notre équipe produit pour développer de nouvelles fonctionnalités sur la plateforme de distribution et l'app mobile. Stack : React, TypeScript, Supabase, React Native.",
    missions: [
      "Développer et maintenir les fonctionnalités frontend et backend",
      "Participer aux code reviews et améliorer la qualité du code",
      "Collaborer avec le design pour implémenter des interfaces fluides",
      "Contribuer à l'architecture technique de la plateforme",
    ],
    skills: ["React", "TypeScript", "Node.js", "SQL", "Git"],
  },
  {
    id: 2,
    title: "Agent de liaison Producteurs",
    department: "Partenariats",
    location: "Thiès / Saint-Louis · Terrain",
    type: "CDI",
    level: "Junior-Mid",
    desc: "Vous serez le visage d'Mamakaasa sur le terrain. Votre mission : identifier, recruter et accompagner les producteurs partenaires dans les régions de Thiès et Saint-Louis.",
    missions: [
      "Prospecter et recruter de nouveaux producteurs partenaires",
      "Former les producteurs à l'utilisation de la plateforme",
      "Assurer le suivi de la qualité des produits et des livraisons",
      "Être l'interlocuteur de confiance des producteurs",
    ],
    skills: ["Wolof / Pulaar", "Terrain", "Relation client", "Autonomie"],
  },
  {
    id: 3,
    title: "Responsable Marketing Digital",
    department: "Marketing",
    location: "Dakar · Hybride",
    type: "CDI",
    level: "Mid-Senior",
    desc: "Vous définirez et exécuterez la stratégie marketing d'Mamakaasa pour accélérer l'acquisition d'acheteurs et la notoriété de la marque au Sénégal et en Afrique de l'Ouest.",
    missions: [
      "Définir et piloter la stratégie de content marketing et social media",
      "Gérer les campagnes d'acquisition payantes (Meta, Google)",
      "Analyser les performances et optimiser le funnel d'acquisition",
      "Collaborer avec l'équipe produit sur le growth marketing",
    ],
    skills: ["SEO/SEM", "Meta Ads", "Analytics", "Content", "Branding"],
  },
  {
    id: 4,
    title: "Chauffeur-Livreur (Dakar)",
    department: "Logistique",
    location: "Dakar · Présentiel",
    type: "CDI",
    level: "Junior",
    desc: "Vous assurerez la collecte chez les producteurs et la livraison des commandes aux acheteurs dakarois. Camionnette fournie, permis B requis.",
    missions: [
      "Collecter les commandes chez les producteurs partenaires",
      "Livrer les commandes aux acheteurs dans les délais prévus",
      "Assurer la qualité et l'intégrité des produits lors du transport",
      "Maintenir la camionnette en bon état",
    ],
    skills: ["Permis B", "Connaissance de Dakar", "Ponctualité", "Wave/OM"],
  },
];

const DEPT_COLORS: Record<string, string> = {
  Tech: "bg-blue-50 text-blue-700 border-blue-200",
  Partenariats: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Marketing: "bg-purple-50 text-purple-700 border-purple-200",
  Logistique: "bg-amber-50 text-amber-700 border-amber-200",
};

const Carrieres = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", jobId: "", message: "" });
  const [sending, setSending] = useState(false);

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1400));
    const job = JOBS.find(j => j.id === Number(form.jobId));
    toast.success(`Candidature envoyée pour "${job?.title}". Nous vous répondons sous 5 jours !`);
    setForm({ name: "", email: "", jobId: "", message: "" });
    setSending(false);
  };

  return (
    <div className="relative min-h-screen bg-white">
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: "radial-gradient(circle, #dde3ec 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="relative z-[1]">
        <LandingNavbar />

        {/* ── Hero ── */}
        <section className="bg-[#0a0a0a] overflow-hidden">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 pt-36 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 min-w-0"
            >
              <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-3.5 py-1.5 mb-6">
                <span className="material-symbols-outlined text-emerald-400 text-sm">fiber_manual_record</span>
                <span className="font-headline text-[11px] font-bold text-white/70 uppercase tracking-widest">Carrières</span>
              </div>
              <h1
                className="font-headline font-black text-white tracking-[-0.045em] leading-[0.9] mb-5"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
              >
                Construisons<br />l'avenir de<br />l'agriculture.
              </h1>
              <p className="font-body text-white/50 text-lg leading-relaxed max-w-sm mb-8">
                Rejoignez une équipe passionnée qui réinvente la chaîne alimentaire au Sénégal. {JOBS.length} postes ouverts.
              </p>
              <a href="#offres" className="inline-flex items-center gap-2 bg-emerald-500 text-white font-headline text-sm font-bold rounded-xl px-6 py-3">
                <span className="material-symbols-outlined text-sm">work</span>
                Voir les offres
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="shrink-0 flex items-end gap-3 lg:gap-4 lg:pr-6"
            >
              {PHOTOS.map((img) => (
                <div
                  key={img.alt}
                  className="overflow-hidden rounded-xl border border-white/10"
                  style={{
                    width: "clamp(90px, 14vw, 155px)",
                    height: "clamp(120px, 18vw, 205px)",
                    transform: `rotate(${img.rot}deg)`,
                    transformOrigin: "bottom center",
                    flexShrink: 0,
                  }}
                >
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="eager" />
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Avantages ── */}
        <section className="py-20 px-6 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Pourquoi nous rejoindre</p>
              <h2 className="font-headline font-black text-foreground tracking-tighter" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Travailler chez Mamakaasa,<br />c'est différent.
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PERKS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border border-border/30 bg-surface-container-lowest p-6"
                >
                  <div className="w-11 h-11 rounded-xl bg-foreground flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{p.icon}</span>
                  </div>
                  <h3 className="font-headline font-extrabold text-base text-foreground mb-2">{p.title}</h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Offres d'emploi ── */}
        <section id="offres" className="py-20 px-6 md:px-8 bg-surface-container-lowest/50 border-t border-border/20">
          <div className="mx-auto max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Postes ouverts</p>
              <h2 className="font-headline font-black text-foreground tracking-tighter" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                {JOBS.length} offres disponibles.
              </h2>
            </motion.div>

            <div className="space-y-4">
              {JOBS.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border border-border/30 bg-white overflow-hidden"
                >
                  <button
                    className="w-full text-left p-6 flex items-start justify-between gap-4"
                    onClick={() => setSelected(selected === job.id ? null : job.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`font-headline text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${DEPT_COLORS[job.department] || ""}`}>{job.department}</span>
                        <span className="font-headline text-[10px] font-bold text-on-surface-variant border border-border/40 rounded-full px-2.5 py-0.5">{job.type}</span>
                        <span className="font-headline text-[10px] font-bold text-on-surface-variant border border-border/40 rounded-full px-2.5 py-0.5">{job.level}</span>
                      </div>
                      <h3 className="font-headline font-extrabold text-base text-foreground">{job.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="material-symbols-outlined text-[13px] text-on-surface-variant/60">location_on</span>
                        <p className="font-body text-xs text-on-surface-variant">{job.location}</p>
                      </div>
                    </div>
                    <span
                      className="material-symbols-outlined text-on-surface-variant text-xl shrink-0 transition-transform duration-200"
                      style={{ transform: selected === job.id ? "rotate(180deg)" : "none" }}
                    >
                      expand_more
                    </span>
                  </button>

                  {selected === job.id && (
                    <div className="px-6 pb-6 border-t border-border/20 pt-5">
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-5">{job.desc}</p>
                      <h4 className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Missions principales</h4>
                      <ul className="space-y-2 mb-5">
                        {job.missions.map(m => (
                          <li key={m} className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-emerald-500 text-base mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            <span className="font-body text-sm text-on-surface-variant">{m}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {job.skills.map(s => (
                          <span key={s} className="font-headline text-[10px] font-bold text-foreground/70 border border-border/40 rounded-full px-3 py-1">{s}</span>
                        ))}
                      </div>
                      <a
                        href="#postuler"
                        onClick={() => setForm(p => ({ ...p, jobId: String(job.id) }))}
                        className="inline-flex items-center gap-2 bg-foreground text-white font-headline font-bold text-sm px-6 py-3 rounded-xl"
                      >
                        <span className="material-symbols-outlined text-sm">send</span>
                        Postuler à ce poste
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Formulaire ── */}
        <section id="postuler" className="py-20 px-6 md:px-8">
          <div className="mx-auto max-w-[700px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Candidature spontanée</p>
              <h2 className="font-headline font-black text-foreground tracking-tighter mb-3" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>
                Envoyez votre candidature
              </h2>
              <p className="font-body text-sm text-on-surface-variant">
                Vous ne trouvez pas le poste idéal ? Envoyez une candidature spontanée. Nous gardons votre profil pour les futures ouvertures.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border/30 bg-surface-container-lowest p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Nom complet</label>
                  <input
                    type="text" required value={form.name} onChange={e => f("name", e.target.value)}
                    placeholder="Votre nom et prénom"
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
                  />
                </div>
                <div>
                  <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Email</label>
                  <input
                    type="email" required value={form.email} onChange={e => f("email", e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Poste visé</label>
                <div className="relative">
                  <select
                    value={form.jobId} onChange={e => f("jobId", e.target.value)} required
                    className="w-full appearance-none px-4 py-3.5 rounded-xl bg-white border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
                  >
                    <option value="">Sélectionnez un poste</option>
                    {JOBS.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                    <option value="0">Candidature spontanée</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">expand_more</span>
                </div>
              </div>
              <div>
                <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Lettre de motivation</label>
                <textarea
                  required value={form.message} onChange={e => f("message", e.target.value)}
                  rows={5} placeholder="Présentez-vous et dites-nous pourquoi vous voulez rejoindre Mamakaasa..."
                  className="w-full px-4 py-3.5 rounded-md bg-white border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 resize-none transition-all"
                />
              </div>
              <button
                type="submit" disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-white px-8 py-4 rounded-xl font-headline font-bold text-sm disabled:opacity-50 transition-all"
              >
                {sending ? (
                  <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span>Envoi en cours...</>
                ) : (
                  <><span className="material-symbols-outlined text-base">send</span>Envoyer ma candidature</>
                )}
              </button>
            </motion.form>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Carrieres;
