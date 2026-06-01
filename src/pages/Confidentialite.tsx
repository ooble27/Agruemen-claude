import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    title: "1. Données collectées",
    content: `Mamakaasa collecte les données que vous nous fournissez directement lors de la création de votre compte (nom, email, numéro de téléphone, adresse de livraison) ainsi que les données générées par votre utilisation de la plateforme (historique des commandes, préférences, interactions).

Nous collectons également des données techniques non-personnelles : adresse IP, type de navigateur, pages visitées et durée de visite, à des fins d'amélioration du service.`,
  },
  {
    title: "2. Utilisation des données",
    content: `Vos données sont utilisées exclusivement pour :
• Traiter et livrer vos commandes
• Gérer votre compte et vous authentifier
• Vous envoyer des confirmations et mises à jour de commande
• Améliorer notre plateforme et personnaliser votre expérience
• Vous contacter en cas de problème lié à votre commande
• Respecter nos obligations légales et fiscales

Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers à des fins commerciales.`,
  },
  {
    title: "3. Partage des données",
    content: `Vos données peuvent être partagées avec :
• Les producteurs partenaires : uniquement les informations nécessaires à la préparation et la livraison de votre commande (nom, adresse, téléphone)
• Les prestataires de paiement (Wave, Orange Money) : pour traiter vos transactions de manière sécurisée
• Les services de livraison partenaires : pour organiser la livraison de vos commandes

Ces tiers sont contractuellement tenus de protéger vos données et de ne les utiliser qu'aux fins spécifiées.`,
  },
  {
    title: "4. Conservation des données",
    content: `Vos données personnelles sont conservées aussi longtemps que votre compte est actif. En cas de fermeture de compte, vos données sont supprimées ou anonymisées dans un délai de 30 jours, sauf obligations légales contraires (données fiscales et comptables conservées 10 ans).

Les données de commande sont conservées 3 ans à des fins de traçabilité et de service client.`,
  },
  {
    title: "5. Vos droits",
    content: `Conformément aux lois applicables sur la protection des données, vous disposez des droits suivants :
• Droit d'accès : consulter les données que nous détenons sur vous
• Droit de rectification : corriger toute information inexacte
• Droit à l'effacement : supprimer votre compte et vos données
• Droit à la portabilité : exporter vos données dans un format lisible
• Droit d'opposition : refuser certains traitements de vos données

Pour exercer ces droits, contactez-nous à privacy@mamakaasa.sn ou via la page Contact.`,
  },
  {
    title: "6. Sécurité",
    content: `Mamakaasa met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement des données en transit (HTTPS/TLS), authentification sécurisée, accès limité aux données sensibles.

Bien que nous fassions tout notre possible pour protéger vos informations, aucun système de sécurité n'est infaillible. En cas de violation de données, nous vous en informerons conformément aux obligations légales.`,
  },
  {
    title: "7. Cookies",
    content: `Mamakaasa utilise des cookies pour améliorer votre expérience. Consultez notre Politique de cookies pour en savoir plus sur les types de cookies utilisés et comment les gérer.`,
  },
  {
    title: "8. Contact",
    content: `Pour toute question relative à cette politique de confidentialité ou à vos données personnelles :

Email : privacy@mamakaasa.sn
Adresse : Mamakaasa Sénégal, Dakar, Sénégal
Téléphone : +221 77 000 00 00

Dernière mise à jour : Janvier 2025`,
  },
];

const Confidentialite = () => (
  <div className="relative min-h-screen bg-white">
    <div className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundImage: "radial-gradient(circle, #dde3ec 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
    <div className="relative z-[1]">
      <LandingNavbar />

      {/* Hero */}
      <section className="bg-[#0a0a0a] pt-36 pb-16 px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-[900px]"
        >
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-3.5 py-1.5 mb-6">
            <span className="material-symbols-outlined text-white/40 text-sm">shield</span>
            <span className="font-headline text-[11px] font-bold text-white/60 uppercase tracking-widest">Légal</span>
          </div>
          <h1 className="font-headline font-black text-white tracking-[-0.04em] leading-[0.92] mb-4"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
            Politique de<br />Confidentialité
          </h1>
          <p className="font-body text-white/40 text-base">
            Dernière mise à jour : Janvier 2025 · Mamakaasa Sénégal
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 md:px-8">
        <div className="mx-auto max-w-[900px]">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* TOC */}
            <aside className="lg:w-56 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-1">
                <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-3">Sommaire</p>
                {SECTIONS.map(s => (
                  <a key={s.title} href={`#${s.title.replace(/\s+/g, "-")}`}
                    className="block font-body text-xs text-on-surface-variant py-1 leading-tight">
                    {s.title}
                  </a>
                ))}
              </div>
            </aside>

            {/* Article */}
            <article className="flex-1 min-w-0 space-y-10">
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-border/30">
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  Chez Mamakaasa, nous prenons la protection de vos données personnelles très au sérieux.
                  Cette politique explique quelles données nous collectons, comment nous les utilisons
                  et quels sont vos droits.
                </p>
              </div>

              {SECTIONS.map((s, i) => (
                <motion.div
                  key={s.title}
                  id={s.title.replace(/\s+/g, "-")}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <h2 className="font-headline font-extrabold text-lg text-foreground mb-3 tracking-tight">{s.title}</h2>
                  <div className="font-body text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{s.content}</div>
                </motion.div>
              ))}

              <div className="pt-6 border-t border-border/20 flex flex-wrap gap-3">
                <Link to="/contact" className="inline-flex items-center gap-1.5 font-headline text-sm font-bold text-foreground border border-border/40 rounded-full px-4 py-2">
                  <span className="material-symbols-outlined text-sm">mail</span>Nous contacter
                </Link>
                <Link to="/cookies" className="inline-flex items-center gap-1.5 font-headline text-sm font-bold text-foreground border border-border/40 rounded-full px-4 py-2">
                  <span className="material-symbols-outlined text-sm">cookie</span>Politique cookies
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

export default Confidentialite;
