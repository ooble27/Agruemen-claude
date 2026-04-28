import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=360&h=480&fit=crop&auto=format", alt: "Producteur", rot: -4 },
  { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=360&h=480&fit=crop&auto=format", alt: "Champ", rot: 3 },
  { src: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=360&h=480&fit=crop&auto=format", alt: "Marché", rot: -1 },
];

const TIMELINE = [
  { year: "2022", title: "L'idée naît", desc: "Deux entrepreneurs dakarois constatent que les producteurs sénégalais perdent 35% de leurs récoltes faute de débouchés. L'idée d'Agrumen prend forme." },
  { year: "2023", title: "Lancement à Dakar", desc: "Les 6 premiers producteurs rejoignent la plateforme. Dès le premier mois, 120 livraisons sont effectuées à Dakar-Plateau et aux Almadies." },
  { year: "2024", title: "Expansion régionale", desc: "Agrumen s'étend à Thiès, Diourbel, Kaolack et Saint-Louis. 120 producteurs partenaires, 4 500 commandes mensuelles." },
  { year: "2025", title: "Plateforme nationale", desc: "340+ producteurs dans 14 régions, 12 000 commandes par mois. Lancement du programme de financement agricole avec nos partenaires." },
  { year: "2026", title: "Aujourd'hui", desc: "Agrumen est la première marketplace agro-alimentaire du Sénégal. Nous préparons notre expansion vers la Côte d'Ivoire et le Mali." },
];

const TEAM = [
  { name: "Ibrahima Sow", role: "Co-fondateur & CEO", region: "Dakar", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format&face" },
  { name: "Fatou Diallo", role: "Co-fondatrice & CPO", region: "Thiès", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop&auto=format" },
  { name: "Moussa Ba", role: "CTO", region: "Dakar", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format" },
  { name: "Aminata Ndiaye", role: "Head of Partnerships", region: "Saint-Louis", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format" },
  { name: "Omar Sarr", role: "Head of Operations", region: "Kaolack", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&auto=format" },
  { name: "Khadija Fall", role: "Head of Marketing", region: "Dakar", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&auto=format" },
];

const STATS = [
  { value: "340+", label: "Producteurs partenaires", icon: "agriculture" },
  { value: "14", label: "Régions couvertes", icon: "map" },
  { value: "12 000+", label: "Commandes par mois", icon: "receipt_long" },
  { value: "98%", label: "Taux de satisfaction", icon: "star" },
];

const VALUES = [
  { icon: "handshake", title: "Équité", desc: "Des prix fixés par les producteurs eux-mêmes. Pas d'intermédiaires qui s'enrichissent entre le champ et votre table." },
  { icon: "eco", title: "Durabilité", desc: "Nous privilégions les pratiques agricoles respectueuses de l'environnement et soutenons la transition agroécologique." },
  { icon: "visibility", title: "Transparence", desc: "Chaque produit indique le nom du producteur, sa région et la date de récolte. Vous savez exactement ce que vous mangez." },
  { icon: "groups", title: "Communauté", desc: "Agrumen n'est pas qu'une app. C'est un réseau de producteurs, de consommateurs et d'agents qui se soutiennent mutuellement." },
  { icon: "bolt", title: "Innovation", desc: "Nous utilisons la technologie pour résoudre des problèmes concrets : paiement mobile, logistique, suivi en temps réel." },
  { icon: "volunteer_activism", title: "Impact social", desc: "Pour chaque commande passée, 1% du montant est reversé au Fonds Agrumen pour la formation des jeunes agriculteurs." },
];

const QuiSommesNous = () => {
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
                <span className="font-headline text-[11px] font-bold text-white/70 uppercase tracking-widest">Notre histoire</span>
              </div>
              <h1
                className="font-headline font-black text-white tracking-[-0.045em] leading-[0.9] mb-5"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
              >
                Du champ à<br />votre table,<br />sans détour.
              </h1>
              <p className="font-body text-white/50 text-lg leading-relaxed max-w-sm mb-8">
                Agrumen est née d'une conviction simple : les meilleurs fruits et légumes du Sénégal méritent une meilleure chaîne de distribution.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/devenir-partenaire" className="inline-flex items-center gap-2 bg-emerald-500 text-white font-headline text-sm font-bold rounded-full px-6 py-3">
                  <span className="material-symbols-outlined text-sm">agriculture</span>
                  Rejoindre la famille
                </Link>
                <Link to="/nos-producteurs" className="inline-flex items-center gap-2 border border-white/20 text-white/70 font-headline text-sm font-bold rounded-full px-6 py-3">
                  Nos producteurs
                </Link>
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
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <span className="material-symbols-outlined text-foreground/20 text-2xl mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                <p className="font-headline font-black text-foreground tracking-tighter" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>{s.value}</p>
                <p className="font-body text-sm text-on-surface-variant mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Notre mission ── */}
        <section className="py-20 px-6 md:px-8">
          <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Notre mission</p>
              <h2 className="font-headline font-black text-foreground tracking-tighter mb-6" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
                Remettre les producteurs au centre de l'économie alimentaire.
              </h2>
              <p className="font-body text-base text-on-surface-variant leading-relaxed mb-5">
                Au Sénégal, un producteur gagne en moyenne 3 à 4 fois moins que ce que le consommateur paye. La différence est absorbée par des intermédiaires sans valeur ajoutée réelle.
              </p>
              <p className="font-body text-base text-on-surface-variant leading-relaxed mb-5">
                Agrumen court-circuite cette chaîne. En connectant directement les producteurs aux consommateurs via une plateforme mobile, nous restituons aux agriculteurs la valeur de leur travail.
              </p>
              <p className="font-body text-base text-on-surface-variant leading-relaxed">
                Pour les acheteurs, c'est la garantie de produits plus frais, plus traçables et moins chers. Pour les producteurs, c'est un revenu plus juste et une demande plus prévisible.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="rounded-2xl bg-[#0a0a0a] p-6 col-span-2 relative overflow-hidden">
                <div className="pointer-events-none select-none absolute -bottom-4 -right-3 font-headline font-black text-[120px] leading-none text-white/[0.03]">AG</div>
                <span className="material-symbols-outlined text-emerald-400 text-2xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                <p className="font-headline text-base font-bold text-white leading-snug">
                  "En rejoignant Agrumen, j'ai doublé mon revenu en 6 mois. Mes tomates partent maintenant directement chez les consommateurs à Dakar."
                </p>
                <p className="font-body text-sm text-white/40 mt-4">— Ousmane D., producteur à Thiès depuis 2023</p>
              </div>
              {[
                { label: "Pertes post-récolte évitées", value: "−35%" },
                { label: "Revenus moyens en hausse", value: "+40%" },
              ].map(item => (
                <div key={item.label} className="rounded-2xl border border-border/30 bg-surface-container-lowest p-6">
                  <p className="font-headline font-black text-foreground tracking-tighter text-3xl">{item.value}</p>
                  <p className="font-body text-sm text-on-surface-variant mt-2 leading-snug">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="py-20 px-6 md:px-8 bg-[#0a0a0a] relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          <div className="relative mx-auto max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-3">Notre parcours</p>
              <h2 className="font-headline font-black text-white tracking-tighter" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                De l'idée à la réalité.
              </h2>
            </motion.div>
            <div className="relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
              <div className="space-y-10">
                {TIMELINE.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative flex items-start gap-8 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className={`hidden md:block md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "text-right pr-10" : "pl-10"}`}>
                      <span className="font-headline font-black text-white/10 text-6xl leading-none">{item.year}</span>
                    </div>
                    <div className="flex-shrink-0 relative z-10 ml-0 md:ml-0">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-[#0a0a0a]">
                        <span className="font-headline text-[10px] font-black text-white">{item.year.slice(2)}</span>
                      </div>
                    </div>
                    <div className={`flex-1 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pl-10" : "md:pr-10"}`}>
                      <p className="font-headline font-black text-white text-lg mb-1">{item.title}</p>
                      <p className="font-body text-sm text-white/50 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Équipe ── */}
        <section className="py-20 px-6 md:px-8">
          <div className="mx-auto max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">L'équipe</p>
              <h2 className="font-headline font-black text-foreground tracking-tighter" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Ceux qui font<br />Agrumen chaque jour.
              </h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {TEAM.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-3 rounded-2xl overflow-hidden border border-border/20">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="font-headline font-bold text-sm text-foreground leading-tight">{member.name}</p>
                  <p className="font-body text-xs text-on-surface-variant mt-0.5">{member.role}</p>
                  <p className="font-body text-[10px] text-on-surface-variant/50 mt-0.5">{member.region}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Valeurs ── */}
        <section className="py-20 px-6 md:px-8 bg-surface-container-lowest/50 border-t border-border/20">
          <div className="mx-auto max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Ce en quoi nous croyons</p>
              <h2 className="font-headline font-black text-foreground tracking-tighter" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Nos valeurs.
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-border/30 bg-white p-6"
                >
                  <div className="w-11 h-11 rounded-xl bg-foreground/6 border border-border/30 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-foreground text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{v.icon}</span>
                  </div>
                  <h3 className="font-headline font-extrabold text-base text-foreground mb-2">{v.title}</h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">{v.desc}</p>
                </motion.div>
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
              className="rounded-2xl bg-[#0a0a0a] p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
              <div className="relative z-10">
                <h3 className="font-headline font-black text-white tracking-tighter mb-3" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
                  Prêt à rejoindre l'aventure Agrumen ?
                </h3>
                <p className="font-body text-white/50 text-sm">Acheteur, producteur ou partenaire — il y a une place pour vous dans notre écosystème.</p>
              </div>
              <div className="relative z-10 flex flex-wrap gap-4 lg:justify-end">
                <Link to="/marche" className="inline-flex items-center gap-2 bg-white text-foreground px-6 py-3 rounded-full font-headline font-bold text-sm">
                  <span className="material-symbols-outlined text-base">storefront</span>
                  Explorer le marché
                </Link>
                <Link to="/devenir-partenaire" className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-full font-headline font-bold text-sm">
                  <span className="material-symbols-outlined text-base">agriculture</span>
                  Devenir partenaire
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default QuiSommesNous;
