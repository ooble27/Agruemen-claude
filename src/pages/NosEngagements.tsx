import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const ENGAGEMENTS = [
  { num: "01", title: "Prix d'achat équitables", desc: "Nous achetons aux producteurs partenaires à des prix garantis et fixés à l'avance — au moins 2× supérieurs aux prix du marché traditionnel. Pas de fluctuations, pas d'impayés, jamais.", icon: "balance", color: "text-amber-400" },
  { num: "02", title: "Zéro pesticide cachée", desc: "Chaque lot est contrôlé par notre équipe terrain avant expédition. Les producteurs sous label « Certifié Mamakaasa » s'engagent à respecter une liste d'intrants autorisés et à soumettre leurs pratiques à un audit annuel.", icon: "eco", color: "text-emerald-400" },
  { num: "03", title: "Traçabilité totale", desc: "Du champ à votre porte, chaque produit est tracé. Vous pouvez scanner le QR code sur votre commande pour voir le nom du producteur, sa région, la date de récolte et le parcours de livraison.", icon: "qr_code_scanner", color: "text-blue-400" },
  { num: "04", title: "Livraison carbone neutre", desc: "Nous compensons 100% des émissions CO₂ de notre flotte de livraison via notre partenariat avec l'initiative de reboisement Senvert. Chaque commande plantait en moyenne 0,3 arbre en 2025.", icon: "forest", color: "text-lime-400" },
  { num: "05", title: "Fonds jeunes agriculteurs", desc: "1% de chaque commande est reversé au Fonds Mamakaasa pour la formation des jeunes agriculteurs (18-30 ans). En 2025, 48 jeunes ont été formés aux techniques agroécologiques grâce à ce fonds.", icon: "school", color: "text-purple-400" },
  { num: "06", title: "Parité femmes-hommes", desc: "42% de nos producteurs partenaires sont des femmes — contre 23% en moyenne dans le secteur agricole sénégalais. Nous favorisons activement le recrutement de productrices dans chaque région.", icon: "diversity_3", color: "text-rose-400" },
];

const IMPACT = [
  { value: "340+", label: "Fournisseurs partenaires", sub: "dont 42% de femmes" },
  { value: "−35%", label: "Pertes post-récolte", sub: "évitées grâce à notre logistique" },
  { value: "+40%", label: "Revenus fournisseurs", sub: "en moyenne dès la 1ère année" },
  { value: "48", label: "Jeunes formés en 2025", sub: "via le Fonds Mamakaasa" },
  { value: "0,3", label: "Arbre planté par commande", sub: "via Senvert" },
  { value: "14", label: "Régions couvertes", sub: "sur 14 régions du Sénégal" },
];

const NosEngagements = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <LandingNavbar />

      {/* ── HERO PLEIN ÉCRAN ── */}
      <section className="relative min-h-screen flex items-end bg-[#0a0a0a] overflow-hidden">
        <motion.img
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&h=1000&fit=crop&auto=format"
          alt="Agriculture durable"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />

        <div className="relative z-10 w-full px-6 md:px-14 pb-16 pt-40">
          <div className="mx-auto max-w-[1200px]">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
              <h1
                className="font-headline font-black text-white tracking-[-0.045em] leading-[0.88] mb-6"
                style={{ fontSize: "clamp(3rem, 7vw, 7rem)" }}
              >
                Des engagements<br />concrets.<br />
                <span className="text-emerald-400">Pas des promesses.</span>
              </h1>
              <p className="font-body text-white/50 text-lg leading-relaxed max-w-lg">
                Chez Mamakaasa, chaque décision business est évaluée à l'aune de son impact sur les producteurs, les consommateurs et l'environnement.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MANIFESTE ── */}
      <section className="py-24 px-6 md:px-14 border-b border-border/20">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 items-start">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-4">Notre position</p>
            <div className="w-10 h-px bg-foreground/20 mb-0" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <p className="font-headline font-black text-foreground tracking-tight leading-[1.05] mb-8" style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}>
              "La rentabilité et l'impact social ne sont pas des objectifs contradictoires. Chez Mamakaasa, ils sont inseparables."
            </p>
            <p className="font-body text-base text-on-surface-variant leading-relaxed">
              Nous refusons le narratif qui présente les entreprises à impact comme moins performantes que les entreprises classiques. Notre preuve : des producteurs mieux payés qui produisent plus, des consommateurs satisfaits qui commandent plus souvent, une plateforme qui croît de 140% par an.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── ENGAGEMENTS — liste éditoriale ── */}
      <section className="py-20 px-6 md:px-14">
        <div className="mx-auto max-w-[1200px]">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3">Nos 6 engagements</p>
            <h2 className="font-headline font-black text-foreground tracking-tighter leading-none" style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}>
              Ce que nous<br />promettons.
            </h2>
          </motion.div>

          <div className="space-y-0">
            {ENGAGEMENTS.map((e, i) => (
              <motion.div
                key={e.num}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group grid grid-cols-[56px_1fr] md:grid-cols-[80px_220px_1fr] gap-6 md:gap-10 py-8 border-b border-border/10 items-start"
              >
                <span className="font-headline font-black text-foreground/12 group-hover:text-foreground/25 transition-colors text-2xl pt-1">{e.num}</span>
                <div className="flex items-start gap-3 md:border-l md:border-border/15 md:pl-8">
                  <span className={`material-symbols-outlined text-xl mt-0.5 shrink-0 ${e.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{e.icon}</span>
                  <h3 className="font-headline font-extrabold text-foreground text-xl tracking-tight">{e.title}</h3>
                </div>
                <p className="col-span-1 col-start-2 md:col-start-auto font-body text-sm text-on-surface-variant leading-relaxed pt-1">{e.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT EN CHIFFRES — fond sombre ── */}
      <section className="bg-[#0a0a0a] py-24 px-6 md:px-14 relative overflow-hidden">
        <div className="pointer-events-none select-none absolute right-0 bottom-0 font-headline font-black text-[280px] leading-none text-white/[0.02] translate-x-[8%] translate-y-[15%]">AG</div>
        <div className="relative mx-auto max-w-[1200px]">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">Rapport d'impact 2025</p>
            <h2 className="font-headline font-black text-white tracking-tighter leading-none" style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}>
              Les chiffres<br />parlent.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-0 divide-x divide-y divide-white/6">
            {IMPACT.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-8"
              >
                <p className="font-headline font-black text-white tracking-tighter" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>{s.value}</p>
                <p className="font-headline font-bold text-white/60 text-sm mt-1">{s.label}</p>
                <p className="font-body text-xs text-white/30 mt-1">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMAGE pleine largeur ── */}
      <div className="mx-6 md:mx-14 my-20 rounded-3xl overflow-hidden" style={{ height: "clamp(240px, 35vw, 480px)" }}>
        <motion.img
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1600&h=700&fit=crop&auto=format"
          alt="Agriculture sénégalaise"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── CTA ── */}
      <section className="px-6 md:px-14 py-20">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-headline font-black text-foreground tracking-tighter leading-none" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}>
              Rejoignez un<br />écosystème<br />responsable.
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-wrap gap-4 lg:justify-end">
            <Link to="/marche" className="inline-flex items-center gap-2 bg-foreground text-white font-headline font-bold text-sm px-7 py-4 rounded-xl">
              <span className="material-symbols-outlined text-sm">storefront</span>
              Explorer le marché
            </Link>
            <Link to="/qui-sommes-nous" className="inline-flex items-center gap-2 border border-border/40 text-on-surface-variant font-headline font-bold text-sm px-7 py-4 rounded-xl">
              Notre histoire
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NosEngagements;
