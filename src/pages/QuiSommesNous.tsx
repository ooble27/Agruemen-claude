import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const TEAM = [
  { name: "Ibrahima Sow", role: "Co-fondateur & CEO", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=720&fit=crop&auto=format" },
  { name: "Fatou Diallo", role: "Co-fondatrice & CPO", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=720&fit=crop&auto=format" },
  { name: "Moussa Ba", role: "CTO", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=720&fit=crop&auto=format" },
  { name: "Aminata Ndiaye", role: "Head of Partnerships", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=720&fit=crop&auto=format" },
  { name: "Omar Sarr", role: "Head of Operations", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=720&fit=crop&auto=format" },
  { name: "Khadija Fall", role: "Head of Marketing", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=720&fit=crop&auto=format" },
];

const TIMELINE = [
  { year: "2022", title: "L'idée naît", desc: "Deux entrepreneurs dakarois constatent que les producteurs sénégalais perdent 35% de leurs récoltes faute de débouchés. L'idée d'Agrumen prend forme dans un garage à Plateau." },
  { year: "2023", title: "Lancement à Dakar", desc: "6 producteurs pionniers rejoignent la plateforme. Dès le premier mois, 120 livraisons sont effectuées dans Dakar. Le bouche-à-oreille fait le reste." },
  { year: "2024", title: "Expansion nationale", desc: "Agrumen s'étend à Thiès, Diourbel, Kaolack et Saint-Louis. 120 producteurs partenaires, 4 500 commandes mensuelles et une équipe terrain de 18 agents." },
  { year: "2025", title: "Plateforme leader", desc: "340+ producteurs dans 14 régions. 12 000 commandes par mois. Lancement du programme de microfinancement agricole avec nos partenaires bancaires." },
  { year: "2026", title: "Demain", desc: "Agrumen est la première marketplace agro-alimentaire du Sénégal. Expansion prévue vers la Côte d'Ivoire et le Mali avant fin 2026." },
];

const VALUES = [
  { num: "01", title: "Équité", desc: "Des prix fixés par les producteurs eux-mêmes. Pas d'intermédiaires entre le champ et votre table." },
  { num: "02", title: "Transparence", desc: "Chaque produit affiche le nom, la région et la date de récolte du producteur. Rien n'est caché." },
  { num: "03", title: "Durabilité", desc: "Nous soutenons les pratiques agroécologiques et réduisons les pertes post-récolte de 35%." },
  { num: "04", title: "Communauté", desc: "Un réseau vivant de producteurs, consommateurs et agents qui se soutiennent mutuellement." },
  { num: "05", title: "Innovation", desc: "La technologie au service du réel : paiement mobile, suivi en temps réel, logistique optimisée." },
  { num: "06", title: "Impact social", desc: "1% de chaque commande est reversé au Fonds Agrumen pour former les jeunes agriculteurs." },
];

const TICKER_ITEMS = ["ÉQUITÉ", "FRAÎCHEUR", "SÉNÉGAL", "TRANSPARENCE", "DURABILITÉ", "IMPACT", "14 RÉGIONS", "340+ PRODUCTEURS", "ÉQUITÉ", "FRAÎCHEUR", "SÉNÉGAL", "TRANSPARENCE", "DURABILITÉ", "IMPACT"];

const QuiSommesNous = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <LandingNavbar />

      {/* ── HERO — split cinématique ── */}
      <section ref={heroRef} className="relative min-h-screen bg-[#0a0a0a] flex flex-col lg:flex-row overflow-hidden">

        {/* Panneau gauche — texte */}
        <div className="relative z-10 flex flex-col justify-end lg:justify-center w-full lg:w-1/2 px-8 md:px-14 pt-40 lg:pt-32 pb-16 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-3.5 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-headline text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Fondée à Dakar · 2022</span>
            </div>

            <h1 className="font-headline font-black text-white leading-[0.88] tracking-[-0.04em] mb-8"
              style={{ fontSize: "clamp(3.2rem, 6.5vw, 6rem)" }}>
              Nés à<br />Dakar.<br />
              <span className="text-emerald-400">Enracinés</span><br />
              au Sénégal.
            </h1>

            <p className="font-body text-white/45 text-lg leading-relaxed max-w-xs mb-10">
              Agrumen connecte directement les producteurs sénégalais aux consommateurs. Pas d'intermédiaire. Des revenus justes. Des produits vrais.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/marche" className="inline-flex items-center gap-2 bg-white text-foreground font-headline text-sm font-bold rounded-full px-6 py-3.5">
                <span className="material-symbols-outlined text-sm">storefront</span>
                Explorer le marché
              </Link>
              <Link to="/devenir-partenaire" className="inline-flex items-center gap-2 border border-white/20 text-white/70 font-headline text-sm font-bold rounded-full px-6 py-3.5">
                Devenir partenaire
              </Link>
            </div>
          </motion.div>

          {/* Stats strip en bas */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 lg:mt-20 grid grid-cols-3 gap-0 border-t border-white/8 pt-8"
          >
            {[
              { v: "340+", l: "Producteurs" },
              { v: "14", l: "Régions" },
              { v: "12K+", l: "Commandes/mois" },
            ].map((s, i) => (
              <div key={s.l} className={`${i > 0 ? "border-l border-white/8 pl-6" : ""}`}>
                <p className="font-headline font-black text-white tracking-tighter text-3xl">{s.v}</p>
                <p className="font-body text-xs text-white/35 mt-1">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Panneau droit — image parallaxe */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full lg:w-1/2 h-72 lg:h-auto overflow-hidden"
        >
          <motion.img
            style={{ y: imgY }}
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=1600&fit=crop&auto=format"
            alt="Champs agricoles sénégalais"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent lg:from-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 to-transparent lg:hidden" />

          {/* Badge flottant */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 max-w-[220px]"
          >
            <p className="font-headline font-black text-white text-3xl">98%</p>
            <p className="font-body text-sm text-white/60 mt-1">de clients satisfaits</p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-emerald-500 py-3.5 overflow-hidden">
        <div
          className="flex gap-8 whitespace-nowrap"
          style={{ animation: "ticker 28s linear infinite" }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="font-headline text-xs font-black text-white/90 tracking-[0.18em] uppercase shrink-0 flex items-center gap-8">
              {item}
              <span className="text-white/40">·</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ── MANIFESTE ── */}
      <section className="py-24 px-6 md:px-14 lg:px-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant mb-4">Notre manifeste</p>
              <div className="w-10 h-px bg-foreground/20" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <p className="font-headline font-black text-foreground tracking-tight leading-[1.05] mb-10"
                style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)" }}>
                "Nous croyons que chaque agriculteur sénégalais mérite d'être payé à la juste valeur de son travail. Pas un centime de moins."
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <p className="font-body text-base text-on-surface-variant leading-relaxed">
                  Au Sénégal, un producteur reçoit en moyenne 3 à 4 fois moins que ce que le consommateur paye. La différence est absorbée par des intermédiaires sans valeur ajoutée. Agrumen court-circuite cette chaîne.
                </p>
                <p className="font-body text-base text-on-surface-variant leading-relaxed">
                  En connectant directement producteurs et consommateurs, nous restituons aux agriculteurs la valeur de leur travail — et nous offrons aux familles dakaroises des produits plus frais, plus traçables, moins chers.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── IMAGE PLEINE LARGEUR ── */}
      <div className="mx-6 md:mx-14 lg:mx-24 mb-24 rounded-3xl overflow-hidden" style={{ height: "clamp(260px, 40vw, 520px)" }}>
        <motion.img
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&h=700&fit=crop&auto=format"
          alt="Producteur sénégalais"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── TIMELINE ── */}
      <section className="px-6 md:px-14 lg:px-24 pb-24">
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-14 border-b border-border/20 pb-8"
          >
            <h2 className="font-headline font-black text-foreground tracking-tighter leading-none"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}>
              Notre<br />parcours.
            </h2>
            <p className="font-body text-sm text-on-surface-variant max-w-xs text-right hidden md:block">
              De l'idée née à Dakar en 2022 à la première marketplace agricole du Sénégal.
            </p>
          </motion.div>

          <div className="space-y-0">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group grid grid-cols-[80px_1fr] md:grid-cols-[140px_1fr_1fr] gap-6 md:gap-10 py-8 border-b border-border/10 items-start"
              >
                <div>
                  <span className="font-headline font-black text-foreground/20 group-hover:text-foreground/40 transition-colors duration-300"
                    style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
                    {item.year}
                  </span>
                </div>
                <div className="md:border-l md:border-border/20 md:pl-8">
                  <p className="font-headline font-extrabold text-foreground text-xl mb-1">{item.title}</p>
                </div>
                <p className="col-span-1 col-start-2 md:col-start-auto font-body text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP SOMBRE ── */}
      <section className="bg-[#0a0a0a] py-20 px-6 md:px-14 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
        <div className="pointer-events-none select-none absolute right-0 bottom-0 font-headline font-black text-[220px] leading-none text-white/[0.025] translate-x-[10%] translate-y-[15%]">AG</div>
        <div className="relative mx-auto max-w-[1200px] grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/8">
          {[
            { value: "340+", label: "Producteurs actifs" },
            { value: "14", label: "Régions couvertes" },
            { value: "12K+", label: "Commandes / mois" },
            { value: "98%", label: "Taux de satisfaction" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
              className="px-8 py-4 first:pl-0"
            >
              <p className="font-headline font-black text-white tracking-tighter"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
                {s.value}
              </p>
              <p className="font-body text-sm text-white/35 mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ÉQUIPE ── */}
      <section className="py-24 px-6 md:px-14 lg:px-24">
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant mb-3">L'équipe fondatrice</p>
            <h2 className="font-headline font-black text-foreground tracking-tighter leading-none"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}>
              Les visages<br />d'Agrumen.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl mb-3"
                  style={{ aspectRatio: "3/4" }}>
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="font-headline font-bold text-sm text-foreground leading-tight">{member.name}</p>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">{member.role}</p>
              </motion.div>
            ))}
          </div>

          {/* Citation */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 rounded-3xl bg-surface-container-lowest border border-border/20 p-8 md:p-12 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-12 items-center"
          >
            <span className="font-headline font-black text-foreground/10 select-none" style={{ fontSize: "7rem", lineHeight: 1 }}>"</span>
            <div>
              <p className="font-headline font-bold text-foreground text-xl md:text-2xl leading-snug mb-4">
                En rejoignant Agrumen, j'ai doublé mon revenu en 6 mois. Mes tomates partent directement chez les consommateurs à Dakar, sans passer par personne.
              </p>
              <p className="font-body text-sm text-on-surface-variant">— Ousmane D., maraîcher à Thiès · partenaire depuis 2023</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── VALEURS — liste éditoriale ── */}
      <section className="bg-[#0a0a0a] py-24 px-6 md:px-14 lg:px-24">
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400 mb-3">Ce en quoi nous croyons</p>
            <h2 className="font-headline font-black text-white tracking-tighter leading-none"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}>
              Nos valeurs.
            </h2>
          </motion.div>

          <div className="space-y-0">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group grid grid-cols-[48px_1fr] md:grid-cols-[80px_260px_1fr] gap-6 md:gap-10 py-7 border-b border-white/8 items-start cursor-default"
              >
                <span className="font-headline font-black text-white/15 group-hover:text-white/30 transition-colors duration-300 text-2xl pt-1">{v.num}</span>
                <h3 className="font-headline font-extrabold text-white text-2xl md:text-3xl tracking-tight group-hover:text-emerald-400 transition-colors duration-300">{v.title}</h3>
                <p className="col-span-1 col-start-2 md:col-start-auto font-body text-sm text-white/45 leading-relaxed pt-1.5">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL — split ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
        {/* Panneau sombre — texte */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white px-10 md:px-16 py-20 flex flex-col justify-center"
        >
          <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant mb-6">Rejoignez l'aventure</p>
          <h2 className="font-headline font-black text-foreground tracking-tighter leading-none mb-8"
            style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}>
            Une place pour<br />chacun chez<br />Agrumen.
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/marche" className="inline-flex items-center gap-2 bg-foreground text-white font-headline font-bold text-sm rounded-full px-6 py-3.5">
              <span className="material-symbols-outlined text-sm">storefront</span>
              Explorer le marché
            </Link>
            <Link to="/devenir-partenaire" className="inline-flex items-center gap-2 border border-border/40 text-on-surface-variant font-headline font-bold text-sm rounded-full px-6 py-3.5">
              Devenir partenaire
            </Link>
          </div>
        </motion.div>

        {/* Panneau image */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden min-h-[320px]"
        >
          <img
            src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&h=900&fit=crop&auto=format"
            alt="Agriculture sénégalaise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-headline text-xs font-bold text-white/80">Dakar · Sénégal · Depuis 2022</span>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default QuiSommesNous;
