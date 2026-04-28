import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=360&h=480&fit=crop&auto=format", alt: "Agriculteur sénégalais", rot: -3 },
  { src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=360&h=480&fit=crop&auto=format", alt: "Champ de culture", rot: 2 },
  { src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=360&h=480&fit=crop&auto=format", alt: "Marché local", rot: -1 },
];

const VALUES = [
  { icon: "eco", title: "Durabilité", desc: "Nous favorisons des pratiques agricoles respectueuses de l'environnement et des saisons." },
  { icon: "handshake", title: "Équité", desc: "Les producteurs reçoivent une rémunération juste, sans intermédiaires qui captent la valeur." },
  { icon: "verified", title: "Transparence", desc: "Chaque produit est traçable : vous savez d'où il vient et qui l'a cultivé." },
  { icon: "people", title: "Communauté", desc: "Agrumen est un lien direct entre consommateurs et agriculteurs du Sénégal." },
  { icon: "local_shipping", title: "Accessibilité", desc: "Des produits frais livrés rapidement, accessibles à tous dans les zones desservies." },
  { icon: "trending_up", title: "Croissance", desc: "Nous aidons les agriculteurs à développer leur activité grâce à des outils modernes." },
];

const STATS = [
  { value: "500+", label: "Producteurs partenaires" },
  { value: "14", label: "Régions du Sénégal" },
  { value: "24h", label: "Délai de livraison Dakar" },
  { value: "100%", label: "Produits locaux" },
];

const NotreMission = () => {
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
                <span className="font-headline text-[11px] font-bold text-white/70 uppercase tracking-widest">Notre Mission</span>
              </div>
              <h1
                className="font-headline font-black text-white tracking-[-0.045em] leading-[0.9] mb-5"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
              >
                Pour une<br />agriculture juste.
              </h1>
              <p className="font-body text-white/50 text-lg leading-relaxed max-w-sm">
                Agrumen connecte directement producteurs et consommateurs sénégalais pour un avenir alimentaire plus équitable.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="shrink-0 flex items-end gap-3 lg:gap-4 lg:pr-6"
            >
              {PHOTOS.map((img, i) => (
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

        {/* ── Story ── */}
        <section className="py-24 px-6 md:px-8 bg-white">
          <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-4">Notre Histoire</p>
              <h2
                className="font-headline font-black text-foreground tracking-[-0.04em] leading-[0.93] mb-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                Né d'un constat simple.
              </h2>
              <div className="space-y-4 font-body text-on-surface-variant leading-relaxed">
                <p>
                  Au Sénégal, les agriculteurs produisent des fruits et légumes d'une qualité exceptionnelle.
                  Pourtant, entre le champ et la table, la chaîne d'intermédiaires réduit leurs revenus et
                  augmente les prix pour le consommateur.
                </p>
                <p>
                  Agrumen est né pour changer ça. En créant un lien direct entre producteurs vérifiés et
                  acheteurs, nous redonnons de la valeur à ceux qui cultivent, et de la fraîcheur à ceux
                  qui consomment.
                </p>
                <p>
                  Aujourd'hui, nous sommes présents dans <strong className="text-foreground">14 régions du Sénégal</strong>,
                  avec plus de <strong className="text-foreground">500 producteurs partenaires</strong> qui font
                  confiance à notre plateforme pour développer leur activité.
                </p>
              </div>
              <Link
                to="/marche"
                className="inline-flex items-center gap-2 mt-8 bg-foreground text-white px-6 py-3.5 rounded-md font-headline font-bold text-sm"
              >
                Explorer le Marché
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              {STATS.map((s, i) => (
                <div key={s.label} className={`p-6 rounded-xl border border-border/30 bg-surface-container-lowest ${i === 1 ? "mt-6" : ""} ${i === 2 ? "-mt-6" : ""}`}>
                  <p className="font-headline font-black text-4xl text-foreground tracking-tighter mb-1">{s.value}</p>
                  <p className="font-body text-sm text-on-surface-variant leading-tight">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="py-24 px-6 md:px-8 bg-[#0a0a0a]">
          <div className="mx-auto max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14"
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Nos Valeurs</p>
              <h2
                className="font-headline font-black text-white tracking-[-0.04em] leading-[0.93]"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Ce qui nous guide.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="p-6 rounded-xl border border-white/8 bg-white/3"
                >
                  <div className="w-10 h-10 rounded-md bg-white/8 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-emerald-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{v.icon}</span>
                  </div>
                  <h3 className="font-headline font-bold text-white text-base mb-2">{v.title}</h3>
                  <p className="font-body text-sm text-white/45 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Join CTA ── */}
        <section className="py-20 px-6 md:px-8 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2
              className="font-headline font-black text-foreground tracking-[-0.04em] leading-[0.93] mb-5"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Rejoignez le mouvement.
            </h2>
            <p className="font-body text-on-surface-variant text-lg leading-relaxed mb-8">
              Que vous soyez acheteur ou producteur, Agrumen est construit pour vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/marche" className="flex items-center gap-2 justify-center bg-foreground text-white px-8 py-4 rounded-md font-headline font-bold text-sm">
                <span className="material-symbols-outlined text-base">storefront</span>
                Explorer le Marché
              </Link>
              <Link to="/contact" className="flex items-center gap-2 justify-center border border-border/40 bg-white px-8 py-4 rounded-md font-headline font-bold text-sm text-foreground">
                <span className="material-symbols-outlined text-base">mail</span>
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default NotreMission;
