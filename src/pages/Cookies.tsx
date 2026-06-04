import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const COOKIES = [
  {
    type: "Essentiels",
    icon: "lock",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    required: true,
    desc: "Indispensables au fonctionnement de la plateforme. Sans eux, certaines fonctionnalités (panier, authentification, commandes) ne peuvent pas fonctionner.",
    examples: ["Session utilisateur", "Authentification Supabase", "Préférences panier", "Jeton CSRF"],
  },
  {
    type: "Analytiques",
    icon: "bar_chart",
    color: "text-sky-600 bg-sky-50 border-sky-200",
    required: false,
    desc: "Nous aident à comprendre comment les visiteurs utilisent Mamakaasa afin d'améliorer notre service. Ces données sont anonymisées.",
    examples: ["Pages visitées", "Durée de visite", "Source de trafic", "Actions effectuées"],
  },
  {
    type: "Fonctionnels",
    icon: "settings",
    color: "text-purple-600 bg-purple-50 border-purple-200",
    required: false,
    desc: "Permettent de mémoriser vos préférences pour personnaliser votre expérience sur la plateforme.",
    examples: ["Langue préférée", "Ville de livraison", "Filtres de recherche"],
  },
];

const SECTIONS = [
  {
    title: "Qu'est-ce qu'un cookie ?",
    content: `Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, smartphone, tablette) lorsque vous visitez un site web. Il permet au site de mémoriser vos actions et préférences sur une période donnée, afin que vous n'ayez pas à les re-saisir à chaque visite.

Les cookies peuvent être de session (supprimés à la fermeture du navigateur) ou persistants (conservés pendant une durée définie).`,
  },
  {
    title: "Comment gérer vos cookies ?",
    content: `Vous pouvez contrôler et supprimer les cookies via les paramètres de votre navigateur :

• Chrome : Paramètres → Confidentialité et sécurité → Cookies
• Firefox : Options → Vie privée et sécurité → Cookies
• Safari : Préférences → Confidentialité → Cookies
• Edge : Paramètres → Confidentialité → Cookies

Attention : désactiver certains cookies peut affecter le fonctionnement de la plateforme, notamment la connexion à votre compte et la gestion du panier.`,
  },
  {
    title: "Durée de conservation",
    content: `• Cookies essentiels : durée de session ou jusqu'à 30 jours
• Cookies analytiques : jusqu'à 13 mois
• Cookies fonctionnels : jusqu'à 12 mois

Vous pouvez à tout moment effacer les cookies stockés depuis les paramètres de votre navigateur.`,
  },
  {
    title: "Mise à jour de cette politique",
    content: `Cette politique de cookies peut être mise à jour pour refléter les évolutions de notre utilisation des cookies ou les exigences légales. Nous vous en informerons via la plateforme.

Dernière mise à jour : Janvier 2025`,
  },
];

const Cookies = () => (
  <div className="relative min-h-screen bg-white">
    <div className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundImage: "radial-gradient(circle, #dde3ec 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
    <div className="relative z-[1]">
      <LandingNavbar />

      {/* Hero */}
      <section className="bg-[#0a0a0a] pt-36 pb-16 px-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-[900px]">
          <h1 className="font-headline font-black text-white tracking-[-0.04em] leading-[0.92] mb-4"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
            Politique<br />de Cookies
          </h1>
          <p className="font-body text-white/40 text-base">Dernière mise à jour : Janvier 2025 · Mamakaasa Sénégal</p>
        </motion.div>
      </section>

      {/* Cookie types */}
      <section className="py-20 px-6 md:px-8">
        <div className="mx-auto max-w-[900px]">

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="font-headline font-extrabold text-2xl tracking-tighter text-foreground mb-2">Types de cookies utilisés</h2>
            <p className="font-body text-sm text-on-surface-variant">Mamakaasa utilise trois catégories de cookies, détaillées ci-dessous.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {COOKIES.map((c, i) => (
              <motion.div key={c.type}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-5 rounded-xl border border-border/30 bg-surface-container-lowest">
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-headline font-bold border ${c.color}`}>
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
                    {c.type}
                  </div>
                  {c.required && (
                    <span className="font-headline text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Requis</span>
                  )}
                </div>
                <p className="font-body text-xs text-on-surface-variant leading-relaxed mb-4">{c.desc}</p>
                <div className="space-y-1">
                  {c.examples.map(ex => (
                    <div key={ex} className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-on-surface-variant/30 shrink-0" />
                      <span className="font-body text-[11px] text-on-surface-variant/70">{ex}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Text sections */}
          <div className="space-y-10">
            {SECTIONS.map((s, i) => (
              <motion.div key={s.title}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <h2 className="font-headline font-extrabold text-lg text-foreground mb-3 tracking-tight">{s.title}</h2>
                <div className="font-body text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{s.content}</div>
              </motion.div>
            ))}
          </div>

          <div className="pt-10 border-t border-border/20 flex flex-wrap gap-3 mt-10">
            <Link to="/confidentialite" className="inline-flex items-center gap-1.5 font-headline text-sm font-bold text-foreground border border-border/40 rounded-full px-4 py-2">
              <span className="material-symbols-outlined text-sm">shield</span>Confidentialité
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-1.5 font-headline text-sm font-bold text-foreground border border-border/40 rounded-full px-4 py-2">
              <span className="material-symbols-outlined text-sm">mail</span>Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  </div>
);

export default Cookies;
