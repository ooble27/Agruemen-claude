import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=360&h=480&fit=crop&auto=format", alt: "Récolte", rot: -4 },
  { src: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=360&h=480&fit=crop&auto=format", alt: "Producteur", rot: 3 },
  { src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=360&h=480&fit=crop&auto=format", alt: "Agriculture", rot: -2 },
];

const REGIONS = ["Toutes", "Dakar", "Thiès", "Saint-Louis", "Kaolack", "Diourbel", "Ziguinchor", "Tambacounda"];

const PRODUCERS = [
  {
    name: "Ousmane Diop",
    region: "Thiès",
    specialty: "Tomates · Poivrons · Piments",
    since: "2023",
    rating: 4.9,
    orders: 1240,
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
    badge: "Top fournisseur",
    desc: "Exploitation maraîchère de 3 hectares à Mbour. Spécialisé en culture sous serre pour garantir la fraîcheur toute l'année.",
  },
  {
    name: "Fatou Ba",
    region: "Kaolack",
    specialty: "Mil · Sorgho · Arachides",
    since: "2023",
    rating: 4.8,
    orders: 890,
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&auto=format",
    badge: "Certifiée bio",
    desc: "Agricultrice engagée dans l'agroécologie. Ses céréales locales sont cultivées sans pesticides dans la région du Sine Saloum.",
  },
  {
    name: "Ibrahima Ndiaye",
    region: "Saint-Louis",
    specialty: "Riz · Oignons · Carottes",
    since: "2024",
    rating: 4.7,
    orders: 620,
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format",
    badge: null,
    desc: "Producteur dans le Delta du Sénégal, profitant de la fertilité des terres irrigées par le fleuve pour cultiver riz et légumes.",
  },
  {
    name: "Rokhaya Sarr",
    region: "Ziguinchor",
    specialty: "Mangues · Bananes · Papayes",
    since: "2024",
    rating: 4.9,
    orders: 780,
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format",
    badge: "Top fournisseur",
    desc: "Arboricultrice en Casamance, région aux conditions climatiques idéales pour les fruits tropicaux. Livraison express depuis Ziguinchor.",
  },
  {
    name: "Mamadou Fall",
    region: "Thiès",
    specialty: "Patates douces · Manioc",
    since: "2023",
    rating: 4.6,
    orders: 510,
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format",
    badge: null,
    desc: "Producteur de tubercules dans la région de Thiès. Ses patates douces orange sont reconnues pour leur richesse en bêta-carotène.",
  },
  {
    name: "Aïssatou Diallo",
    region: "Dakar",
    specialty: "Légumes feuilles · Herbes aromatiques",
    since: "2024",
    rating: 4.8,
    orders: 430,
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format",
    badge: "Certifiée bio",
    desc: "Pionnière du maraîchage urbain à Dakar. Produit des légumes feuilles et herbes aromatiques sur 800m² en pleine ville.",
  },
  {
    name: "Seydou Cissé",
    region: "Diourbel",
    specialty: "Arachides · Sésame · Niébé",
    since: "2023",
    rating: 4.7,
    orders: 670,
    img: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=200&h=200&fit=crop&auto=format",
    badge: null,
    desc: "Agriculteur traditionnel dans le bassin arachidier. Ses légumineuses sont cultivées selon des méthodes ancestrales transmises depuis trois générations.",
  },
  {
    name: "Ndéye Mbaye",
    region: "Saint-Louis",
    specialty: "Gombo · Aubergines · Piments",
    since: "2024",
    rating: 4.9,
    orders: 390,
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format",
    badge: "Nouveau",
    desc: "Jeune agricultrice formée par Mamakaasa. Son exploitation maraîchère à Richard Toll produit des légumes de grande qualité grâce à l'irrigation contrôlée.",
  },
  {
    name: "Alioune Seck",
    region: "Tambacounda",
    specialty: "Mangues · Anacarde · Citrons",
    since: "2024",
    rating: 4.6,
    orders: 320,
    img: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&h=200&fit=crop&auto=format",
    badge: null,
    desc: "Arboriculteur dans l'est du Sénégal, zone réputée pour la qualité exceptionnelle de ses mangues. Récolte de juin à août.",
  },
];

const STATS = [
  { value: "340+", label: "Producteurs actifs" },
  { value: "14", label: "Régions couvertes" },
  { value: "100%", label: "Sénégalais vérifiés" },
  { value: "48h", label: "Du champ à votre porte" },
];

const NosProducteurs = () => {
  const [activeRegion, setActiveRegion] = useState("Toutes");

  const filtered = activeRegion === "Toutes"
    ? PRODUCERS
    : PRODUCERS.filter(p => p.region === activeRegion);

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
                <span className="font-headline text-[11px] font-bold text-white/70 uppercase tracking-widest">Nos Producteurs</span>
              </div>
              <h1
                className="font-headline font-black text-white tracking-[-0.045em] leading-[0.9] mb-5"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
              >
                340 visages<br />derrière<br />vos repas.
              </h1>
              <p className="font-body text-white/50 text-lg leading-relaxed max-w-sm mb-8">
                Rencontrez les agriculteurs sénégalais qui cultivent avec passion pour que votre assiette soit pleine de saveurs authentiques.
              </p>
              <Link to="/devenir-partenaire" className="inline-flex items-center gap-2 bg-emerald-500 text-white font-headline text-sm font-bold rounded-full px-6 py-3">
                <span className="material-symbols-outlined text-sm">agriculture</span>
                Devenir producteur partenaire
              </Link>
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
                <p className="font-headline font-black text-foreground tracking-tighter" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>{s.value}</p>
                <p className="font-body text-sm text-on-surface-variant mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Grille producteurs ── */}
        <section className="py-16 px-6 md:px-8">
          <div className="mx-auto max-w-[1200px]">

            {/* Filtres région */}
            <div className="flex flex-wrap gap-2 mb-10">
              {REGIONS.map(region => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-headline text-xs font-bold transition-all ${
                    activeRegion === region ? "bg-foreground text-white" : "border border-border/40 text-on-surface-variant"
                  }`}
                >
                  {region !== "Toutes" && <span className="material-symbols-outlined text-[13px]">location_on</span>}
                  {region}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((producer, i) => (
                <motion.div
                  key={producer.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-border/30 bg-surface-container-lowest overflow-hidden group"
                >
                  <div className="relative h-44 overflow-hidden bg-foreground/5">
                    <img
                      src={producer.img}
                      alt={producer.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    {producer.badge && (
                      <span className={`absolute top-3 right-3 font-headline text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        producer.badge === "Certifiée bio" || producer.badge === "Certifié bio"
                          ? "bg-emerald-500 text-white"
                          : producer.badge === "Nouveau"
                          ? "bg-blue-500 text-white"
                          : "bg-amber-400 text-amber-900"
                      }`}>
                        {producer.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-headline font-extrabold text-base text-foreground">{producer.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="material-symbols-outlined text-[12px] text-on-surface-variant/60">location_on</span>
                          <p className="font-body text-xs text-on-surface-variant">{producer.region} · depuis {producer.since}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-headline text-xs font-bold text-foreground">{producer.rating}</span>
                      </div>
                    </div>
                    <p className="font-body text-xs text-on-surface-variant leading-relaxed mb-3">{producer.desc}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-border/20">
                      <span className="font-headline text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">{producer.specialty.split("·")[0].trim()}</span>
                      <span className="font-body text-[11px] text-on-surface-variant">{producer.orders.toLocaleString()} commandes</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 block mb-3">agriculture</span>
                <p className="font-body text-sm text-on-surface-variant">Aucun producteur dans cette région pour l'instant.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA devenir partenaire ── */}
        <section className="py-16 px-6 md:px-8 border-t border-border/20">
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
                Vous êtes producteur au Sénégal ?
              </h3>
              <p className="font-body text-white/50 text-sm mb-8 max-w-md mx-auto">
                Rejoignez les 340 fournisseurs qui approvisionnent Mamakaasa chaque semaine. Candidature gratuite, prix garantis.
              </p>
              <Link
                to="/devenir-partenaire"
                className="inline-flex items-center gap-2 bg-white text-foreground px-8 py-4 rounded-full font-headline font-bold text-sm"
              >
                <span className="material-symbols-outlined text-base">agriculture</span>
                Devenir partenaire Mamakaasa
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default NosProducteurs;
