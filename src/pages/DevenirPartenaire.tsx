import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=360&h=480&fit=crop&auto=format", alt: "Champ agricole", rot: -4 },
  { src: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=360&h=480&fit=crop&auto=format", alt: "Producteur", rot: 3 },
  { src: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=360&h=480&fit=crop&auto=format", alt: "Récolte", rot: -1 },
];

const BENEFITS = [
  {
    icon: "storefront",
    title: "Accès à des milliers d'acheteurs",
    desc: "Vendez directement à des consommateurs dakarois sans intermédiaire. Votre marché s'étend instantanément à toute l'agglomération.",
  },
  {
    icon: "payments",
    title: "Paiements rapides & sécurisés",
    desc: "Recevez votre argent via Wave ou Orange Money dans les 48h suivant la livraison. Aucun risque d'impayé.",
  },
  {
    icon: "trending_up",
    title: "Revenus en hausse",
    desc: "Nos producteurs partenaires constatent en moyenne +40% de revenus dès le premier trimestre grâce à des prix équitables fixés par eux-mêmes.",
  },
  {
    icon: "support_agent",
    title: "Accompagnement dédié",
    desc: "Un agent Mamakaasa vous accompagne dans la création de votre profil, la mise en ligne de vos produits et le suivi de vos premières commandes.",
  },
  {
    icon: "local_shipping",
    title: "Logistique prise en charge",
    desc: "Nous gérons la collecte, le transport et la livraison. Vous vous concentrez sur la production, on s'occupe du reste.",
  },
  {
    icon: "verified",
    title: "Label Producteur Vérifié",
    desc: "Votre profil est certifié Mamakaasa, ce qui renforce la confiance des acheteurs et augmente votre taux de conversion.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Soumettez votre candidature",
    desc: "Remplissez le formulaire ci-dessous avec vos informations et le type de produits que vous cultivez. L'étude est gratuite et sans engagement.",
  },
  {
    num: "02",
    title: "Validation & visite terrain",
    desc: "Notre équipe analyse votre dossier sous 5 jours ouvrés. Un agent peut se déplacer pour valider la qualité de votre exploitation.",
  },
  {
    num: "03",
    title: "Mise en ligne & premières ventes",
    desc: "Votre profil producteur est créé, vos produits mis en ligne. Vous commencez à recevoir des commandes dès la semaine suivante.",
  },
];

const REQUIREMENTS = [
  { icon: "agriculture", text: "Être producteur ou agriculteur actif au Sénégal" },
  { icon: "location_on", text: "Exploitation localisée dans une des 14 régions couvertes" },
  { icon: "eco", text: "Produits frais : fruits, légumes, céréales, produits laitiers ou de la mer" },
  { icon: "fact_check", text: "Capacité de production régulière (au moins 2 fois/semaine)" },
  { icon: "phone_android", text: "Disposer d'un numéro Wave ou Orange Money actif" },
];

const STATS = [
  { value: "340+", label: "Producteurs partenaires" },
  { value: "14", label: "Régions couvertes" },
  { value: "48h", label: "Délai de paiement" },
  { value: "+40%", label: "Revenus moyens en plus" },
];

const DevenirPartenaire = () => {
  const [form, setForm] = useState({
    name: "", phone: "", region: "", products: "", surface: "", message: "",
  });
  const [sending, setSending] = useState(false);

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1400));
    toast.success("Candidature envoyée ! Notre équipe vous contacte sous 5 jours ouvrés.");
    setForm({ name: "", phone: "", region: "", products: "", surface: "", message: "" });
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
                <span className="font-headline text-[11px] font-bold text-white/70 uppercase tracking-widest">Programme Partenaire</span>
              </div>
              <h1
                className="font-headline font-black text-white tracking-[-0.045em] leading-[0.9] mb-5"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
              >
                Vendez vos<br />récoltes sur<br />Mamakaasa.
              </h1>
              <p className="font-body text-white/50 text-lg leading-relaxed max-w-sm mb-8">
                Rejoignez 340+ producteurs sénégalais qui vendent directement aux consommateurs. Pas d'intermédiaire, des revenus équitables.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#candidature" className="inline-flex items-center gap-2 bg-emerald-500 text-white font-headline text-sm font-bold rounded-xl px-6 py-3">
                  <span className="material-symbols-outlined text-sm">agriculture</span>
                  Déposer ma candidature
                </a>
                <a href="#comment" className="inline-flex items-center gap-2 border border-white/20 text-white/70 font-headline text-sm font-bold rounded-xl px-6 py-3">
                  Comment ça marche
                </a>
              </div>
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

        {/* ── Stats ── */}
        <section className="border-b border-border/20">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <p className="font-headline font-black text-foreground tracking-tighter" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>{s.value}</p>
                <p className="font-body text-sm text-on-surface-variant mt-1">{s.label}</p>
              </motion.div>
            ))}
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
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Pourquoi Mamakaasa</p>
              <h2 className="font-headline font-black text-foreground tracking-tighter" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Ce que vous gagnez<br />en rejoignant la plateforme.
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {BENEFITS.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border border-border/30 bg-surface-container-lowest p-6"
                >
                  <div className="w-11 h-11 rounded-xl bg-foreground flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
                  </div>
                  <h3 className="font-headline font-extrabold text-base text-foreground mb-2">{b.title}</h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comment ça marche ── */}
        <section id="comment" className="py-20 px-6 md:px-8 bg-[#0a0a0a] relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          <div className="relative mx-auto max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14 text-center"
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-3">Processus</p>
              <h2 className="font-headline font-black text-white tracking-tighter" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                3 étapes pour commencer<br />à vendre.
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative rounded-2xl border border-white/8 bg-white/[0.03] p-8"
                >
                  <p className="font-headline font-black text-white/[0.06] text-7xl leading-none mb-4 select-none">{s.num}</p>
                  <h3 className="font-headline font-extrabold text-lg text-white mb-3">{s.title}</h3>
                  <p className="font-body text-sm text-white/50 leading-relaxed">{s.desc}</p>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <span className="material-symbols-outlined text-white/20 text-2xl">arrow_forward</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Conditions ── */}
        <section className="py-20 px-6 md:px-8">
          <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Critères d'éligibilité</p>
              <h2 className="font-headline font-black text-foreground tracking-tighter mb-8" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>
                Qui peut rejoindre<br />Mamakaasa ?
              </h2>
              <div className="space-y-4">
                {REQUIREMENTS.map((r) => (
                  <div key={r.text} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-foreground/6 border border-border/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-foreground text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{r.icon}</span>
                    </div>
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed pt-2.5">{r.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-[#0a0a0a] p-8 relative overflow-hidden"
            >
              <div className="pointer-events-none select-none absolute -bottom-8 -right-4 font-headline font-black text-[160px] leading-none text-white/[0.03]">AG</div>
              <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
              <div className="relative z-10">
                <span className="material-symbols-outlined text-emerald-400 text-3xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <h3 className="font-headline font-extrabold text-xl text-white mb-3">Candidature 100% gratuite</h3>
                <p className="font-body text-sm text-white/50 leading-relaxed mb-6">
                  Aucun frais d'inscription. Mamakaasa prélève une commission uniquement sur les ventes réalisées. Si vous ne vendez pas, vous ne payez rien.
                </p>
                <div className="space-y-3">
                  {["Aucun frais d'inscription", "Commission seulement sur les ventes", "Pas de contrat longue durée", "Résiliation libre à tout moment"].map(item => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="font-body text-sm text-white/65">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Formulaire candidature ── */}
        <section id="candidature" className="py-20 px-6 md:px-8 bg-surface-container-lowest/50 border-t border-border/20">
          <div className="mx-auto max-w-[800px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Candidature</p>
              <h2 className="font-headline font-black text-foreground tracking-tighter mb-3" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>
                Rejoignez la famille Mamakaasa
              </h2>
              <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto">
                Remplissez ce formulaire et notre équipe vous recontacte sous 5 jours ouvrés pour un entretien téléphonique.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border/30 bg-white p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Nom complet</label>
                  <input
                    type="text" required value={form.name} onChange={e => f("name", e.target.value)}
                    placeholder="Votre nom et prénom"
                    className="w-full px-4 py-3.5 rounded-xl bg-surface-container-lowest border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
                  />
                </div>
                <div>
                  <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Téléphone (Wave / OM)</label>
                  <input
                    type="tel" required value={form.phone} onChange={e => f("phone", e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full px-4 py-3.5 rounded-xl bg-surface-container-lowest border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Région</label>
                  <div className="relative">
                    <select
                      required value={form.region} onChange={e => f("region", e.target.value)}
                      className="w-full appearance-none px-4 py-3.5 rounded-xl bg-surface-container-lowest border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
                    >
                      <option value="">Sélectionnez votre région</option>
                      {["Dakar", "Thiès", "Diourbel", "Fatick", "Kaolack", "Kaffrine", "Saint-Louis", "Louga", "Matam", "Tambacounda", "Kédougou", "Kolda", "Sédhiou", "Ziguinchor"].map(r => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">expand_more</span>
                  </div>
                </div>
                <div>
                  <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Surface d'exploitation</label>
                  <div className="relative">
                    <select
                      value={form.surface} onChange={e => f("surface", e.target.value)}
                      className="w-full appearance-none px-4 py-3.5 rounded-xl bg-surface-container-lowest border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
                    >
                      <option value="">Sélectionnez</option>
                      <option>Moins de 1 hectare</option>
                      <option>1 – 5 hectares</option>
                      <option>5 – 20 hectares</option>
                      <option>Plus de 20 hectares</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">expand_more</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Type de produits cultivés</label>
                <input
                  type="text" required value={form.products} onChange={e => f("products", e.target.value)}
                  placeholder="Ex. : tomates, oignons, mangues, mil..."
                  className="w-full px-4 py-3.5 rounded-xl bg-surface-container-lowest border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
                />
              </div>
              <div>
                <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Message (optionnel)</label>
                <textarea
                  value={form.message} onChange={e => f("message", e.target.value)}
                  rows={4} placeholder="Parlez-nous de votre exploitation, vos volumes de production, vos projets..."
                  className="w-full px-4 py-3.5 rounded-md bg-surface-container-lowest border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 resize-none transition-all"
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
              <p className="font-body text-xs text-on-surface-variant/60 text-center">
                En soumettant ce formulaire, vous acceptez d'être contacté par l'équipe Mamakaasa.
                Candidature gratuite, sans engagement.
              </p>
            </motion.form>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="py-20 px-6 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-[#0a0a0a] p-10 text-center relative overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
              <span className="material-symbols-outlined text-emerald-400 text-4xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
              <h3 className="font-headline font-black text-white tracking-tighter mb-3" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
                Une question avant de postuler ?
              </h3>
              <p className="font-body text-white/50 text-sm mb-8 max-w-md mx-auto">
                Notre équipe partenariat est disponible du lundi au samedi de 7h à 20h pour répondre à toutes vos questions.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-foreground px-6 py-3 rounded-xl font-headline font-bold text-sm">
                  <span className="material-symbols-outlined text-base">mail</span>
                  Nous contacter
                </Link>
                <a href="#candidature" className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-xl font-headline font-bold text-sm">
                  <span className="material-symbols-outlined text-base">agriculture</span>
                  Déposer ma candidature
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

export default DevenirPartenaire;
