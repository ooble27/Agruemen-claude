import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const BLOCKS = [
  {
    title: "Éditeur du site",
    rows: [
      ["Société", "Mamakaasa Sénégal"],
      ["Forme juridique", "Société à Responsabilité Limitée (SARL)"],
      ["Siège social", "Dakar, Sénégal"],
      ["Email", "hello@mamakaasa.sn"],
      ["Téléphone", "+1 418 261 9091"],
      ["Directeur de publication", "Équipe Mamakaasa"],
    ],
  },
  {
    title: "Hébergement",
    rows: [
      ["Hébergeur base de données", "Supabase Inc."],
      ["Adresse", "970 Toa Payoh North, Singapour"],
      ["Site", "supabase.com"],
      ["Hébergeur front-end", "Vercel Inc."],
      ["Adresse", "340 Pine Street, San Francisco, CA, USA"],
      ["Site", "vercel.com"],
    ],
  },
  {
    title: "Propriété intellectuelle",
    content: `Le site Mamakaasa et l'ensemble de ses contenus (textes, images, logos, graphismes, icônes, code source) sont protégés par les lois relatives à la propriété intellectuelle en vigueur au Sénégal et à l'international.

Toute reproduction, représentation, modification, publication, transmission ou dénaturation, totale ou partielle, du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit, est interdite, sauf autorisation préalable et écrite d'Mamakaasa.

Le non-respect de cette interdiction constitue une contrefaçon pouvant engager la responsabilité civile et pénale du contrefacteur.`,
  },
  {
    title: "Liens hypertextes",
    content: `La plateforme Mamakaasa peut contenir des liens vers des sites tiers. Ces liens sont fournis à titre informatif. Mamakaasa n'exerce aucun contrôle sur le contenu de ces sites et décline toute responsabilité quant à leurs contenus ou pratiques.

La création de liens hypertextes pointant vers le site Mamakaasa est soumise à l'autorisation préalable de l'éditeur.`,
  },
  {
    title: "Données personnelles",
    content: `Le traitement des données personnelles collectées sur la plateforme est décrit dans notre Politique de Confidentialité. Conformément aux lois applicables sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.

Pour exercer ces droits : privacy@mamakaasa.sn`,
  },
  {
    title: "Cookies",
    content: `L'utilisation des cookies sur la plateforme est décrite dans notre Politique de Cookies. Vous pouvez gérer vos préférences cookies via les paramètres de votre navigateur.`,
  },
  {
    title: "Droit applicable",
    content: `Les présentes mentions légales sont soumises au droit sénégalais. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents de Dakar seront saisis.

Dernière mise à jour : Janvier 2025`,
  },
];

const MentionsLegales = () => (
  <div className="relative min-h-screen bg-white">
    <div className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundImage: "radial-gradient(circle, #dde3ec 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
    <div className="relative z-[1]">
      <LandingNavbar />

      {/* Hero */}
      <section className="bg-[#0a0a0a] pt-36 pb-16 px-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-[900px]">
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-3.5 py-1.5 mb-6">
            <span className="material-symbols-outlined text-white/40 text-sm">article</span>
            <span className="font-headline text-[11px] font-bold text-white/60 uppercase tracking-widest">Légal</span>
          </div>
          <h1 className="font-headline font-black text-white tracking-[-0.04em] leading-[0.92] mb-4"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
            Mentions<br />Légales
          </h1>
          <p className="font-body text-white/40 text-base">Dernière mise à jour : Janvier 2025 · Mamakaasa Sénégal</p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 md:px-8">
        <div className="mx-auto max-w-[900px] space-y-10">
          {BLOCKS.map((block, i) => (
            <motion.div key={block.title}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <h2 className="font-headline font-extrabold text-lg text-foreground mb-4 tracking-tight">{block.title}</h2>

              {block.rows && (
                <div className="rounded-xl border border-border/30 overflow-hidden">
                  {block.rows.map(([label, value], j) => (
                    <div key={label + j} className={`flex flex-col sm:flex-row sm:items-center gap-1 px-5 py-3 ${j % 2 === 0 ? "bg-surface-container-lowest" : "bg-white"}`}>
                      <span className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 sm:w-44 shrink-0">{label}</span>
                      <span className="font-body text-sm text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {block.content && (
                <div className="font-body text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{block.content}</div>
              )}
            </motion.div>
          ))}

          <div className="pt-6 border-t border-border/20 flex flex-wrap gap-3">
            <Link to="/confidentialite" className="inline-flex items-center gap-1.5 font-headline text-sm font-bold text-foreground border border-border/40 rounded-full px-4 py-2">
              <span className="material-symbols-outlined text-sm">shield</span>Confidentialité
            </Link>
            <Link to="/cgu" className="inline-flex items-center gap-1.5 font-headline text-sm font-bold text-foreground border border-border/40 rounded-full px-4 py-2">
              <span className="material-symbols-outlined text-sm">gavel</span>CGU
            </Link>
            <Link to="/cookies" className="inline-flex items-center gap-1.5 font-headline text-sm font-bold text-foreground border border-border/40 rounded-full px-4 py-2">
              <span className="material-symbols-outlined text-sm">cookie</span>Cookies
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  </div>
);

export default MentionsLegales;
