import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    title: "1. Objet",
    content: `Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Mamakaasa (site web et application mobile) par tout utilisateur, qu'il soit acheteur ou visiteur.

En utilisant la plateforme, vous acceptez sans réserve ces conditions. Si vous n'acceptez pas ces CGU, veuillez cesser d'utiliser notre service.`,
  },
  {
    title: "2. Description du service",
    content: `Mamakaasa est une entreprise de distribution alimentaire. La plateforme permet :
• La consultation et la commande de produits frais (fruits, légumes, céréales, produits du terroir)
• La livraison à domicile dans les zones desservies
• La gestion de compte acheteur (historique, favoris, profil)

Mamakaasa s'approvisionne directement auprès de producteurs sénégalais partenaires, puis vend et livre les produits à ses clients. Mamakaasa est le vendeur unique sur la plateforme.`,
  },
  {
    title: "3. Inscription et compte",
    content: `La création d'un compte est gratuite et facultative pour consulter la plateforme, mais obligatoire pour passer une commande. L'utilisateur s'engage à :
• Fournir des informations exactes et à jour
• Maintenir la confidentialité de ses identifiants
• Informer immédiatement Mamakaasa de toute utilisation non autorisée de son compte

Un seul compte par personne est autorisé. Mamakaasa se réserve le droit de suspendre tout compte en cas d'utilisation frauduleuse.`,
  },
  {
    title: "4. Commandes et paiement",
    content: `Les prix sont affichés en FCFA TTC. Le paiement s'effectue en ligne via les solutions mobiles proposées (Wave, Orange Money) au moment de la commande.

La commande est confirmée après validation du paiement. En cas d'indisponibilité d'un produit après confirmation, l'acheteur est remboursé intégralement dans les 48 heures.

Mamakaasa se réserve le droit d'annuler toute commande suspecte ou frauduleuse.`,
  },
  {
    title: "5. Livraison",
    content: `Les délais et zones de livraison sont indiqués sur la plateforme au moment de la commande. Les créneaux de livraison estimés sont fournis à titre indicatif. En cas de retard significatif, l'acheteur est informé.

La responsabilité de la livraison est transférée à l'acheteur à la réception de la commande. En cas de problème à la livraison, le support Mamakaasa est disponible via la page Contact.`,
  },
  {
    title: "6. Retours et remboursements",
    content: `Si un produit reçu est défectueux, avarié ou ne correspond pas à la commande, l'acheteur dispose de 24 heures après la livraison pour signaler le problème via l'application ou le service client.

Après vérification, Mamakaasa procède au remplacement ou au remboursement du produit concerné dans un délai de 48 heures ouvrées. Les frais de livraison sont remboursés uniquement en cas d'erreur de notre part.`,
  },
  {
    title: "7. Comportement des utilisateurs",
    content: `L'utilisateur s'engage à utiliser la plateforme de manière licite et à ne pas :
• Publier de fausses évaluations ou informations
• Tenter d'usurper l'identité de Mamakaasa ou de ses équipes
• Utiliser la plateforme à des fins frauduleuses ou illégales
• Porter atteinte à l'infrastructure technique d'Mamakaasa

Tout manquement peut entraîner la suspension ou la résiliation du compte.`,
  },
  {
    title: "8. Propriété intellectuelle",
    content: `L'ensemble des éléments de la plateforme (logo, design, textes, photos, fonctionnalités) sont la propriété exclusive d'Mamakaasa et sont protégés par les droits de propriété intellectuelle applicables.

Toute reproduction, représentation ou utilisation sans autorisation préalable écrite d'Mamakaasa est interdite.`,
  },
  {
    title: "9. Limitation de responsabilité",
    content: `Mamakaasa met tout en œuvre pour garantir la disponibilité et la qualité de son service mais ne saurait être tenu responsable des interruptions temporaires, des erreurs techniques ou des dommages indirects liés à l'utilisation de la plateforme.

La responsabilité d'Mamakaasa est limitée au montant de la commande concernée.`,
  },
  {
    title: "10. Modification des CGU",
    content: `Mamakaasa se réserve le droit de modifier ces CGU à tout moment. Les utilisateurs sont informés par email ou via la plateforme. La poursuite de l'utilisation du service après modification vaut acceptation des nouvelles conditions.

Dernière mise à jour : Janvier 2025`,
  },
];

const CGU = () => (
  <div className="relative min-h-screen bg-white">
    <div className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundImage: "radial-gradient(circle, #dde3ec 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
    <div className="relative z-[1]">
      <LandingNavbar />

      <section className="bg-[#0a0a0a] pt-36 pb-16 px-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-[900px]">
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-3.5 py-1.5 mb-6">
            <span className="material-symbols-outlined text-white/40 text-sm">gavel</span>
            <span className="font-headline text-[11px] font-bold text-white/60 uppercase tracking-widest">Légal</span>
          </div>
          <h1 className="font-headline font-black text-white tracking-[-0.04em] leading-[0.92] mb-4"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
            Conditions Générales<br />d'Utilisation
          </h1>
          <p className="font-body text-white/40 text-base">Dernière mise à jour : Janvier 2025 · Mamakaasa Sénégal</p>
        </motion.div>
      </section>

      <section className="py-20 px-6 md:px-8">
        <div className="mx-auto max-w-[900px]">
          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="lg:w-56 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-1">
                <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-3">Sommaire</p>
                {SECTIONS.map(s => (
                  <a key={s.title} href={`#${s.title.replace(/\s+/g, "-")}`}
                    className="block font-body text-xs text-on-surface-variant py-1 leading-tight">{s.title}</a>
                ))}
              </div>
            </aside>

            <article className="flex-1 min-w-0 space-y-10">
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-border/30">
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  En utilisant la plateforme Mamakaasa, vous acceptez les présentes conditions générales d'utilisation.
                  Veuillez les lire attentivement avant de passer votre première commande.
                </p>
              </div>

              {SECTIONS.map((s, i) => (
                <motion.div key={s.title} id={s.title.replace(/\s+/g, "-")}
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                  <h2 className="font-headline font-extrabold text-lg text-foreground mb-3 tracking-tight">{s.title}</h2>
                  <div className="font-body text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{s.content}</div>
                </motion.div>
              ))}

              <div className="pt-6 border-t border-border/20 flex flex-wrap gap-3">
                <Link to="/contact" className="inline-flex items-center gap-1.5 font-headline text-sm font-bold text-foreground border border-border/40 rounded-full px-4 py-2">
                  <span className="material-symbols-outlined text-sm">mail</span>Nous contacter
                </Link>
                <Link to="/confidentialite" className="inline-flex items-center gap-1.5 font-headline text-sm font-bold text-foreground border border-border/40 rounded-full px-4 py-2">
                  <span className="material-symbols-outlined text-sm">shield</span>Confidentialité
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  </div>
);

export default CGU;
