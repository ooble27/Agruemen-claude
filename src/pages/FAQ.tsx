import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const FAQ_DATA = [
  {
    category: "Commandes",
    icon: "receipt_long",
    color: "text-amber-400",
    questions: [
      { q: "Comment passer une commande ?", a: "Parcourez le Marché, ajoutez vos produits au panier, puis validez votre commande en renseignant votre adresse de livraison et en choisissant votre mode de paiement (Wave ou Orange Money). Vous recevrez une confirmation immédiatement." },
      { q: "Puis-je modifier ma commande après validation ?", a: "Une fois la commande confirmée et le paiement traité, il n'est plus possible de la modifier. Si vous constatez une erreur, contactez notre support dans les 30 minutes suivant la commande et nous ferons notre possible pour vous aider." },
      { q: "Comment annuler une commande ?", a: "Vous pouvez annuler une commande tant qu'elle est en statut « En attente ». Rendez-vous dans « Mes Commandes », sélectionnez la commande et contactez le support. Le remboursement est effectué sous 48h." },
      { q: "Puis-je commander sans créer un compte ?", a: "Non, un compte est nécessaire pour passer une commande afin de vous permettre de suivre vos livraisons et consulter votre historique. La création est rapide et gratuite." },
    ],
  },
  {
    category: "Livraison",
    icon: "local_shipping",
    color: "text-blue-400",
    questions: [
      { q: "Quelles sont les zones de livraison ?", a: "Agrumen livre actuellement à Dakar et dans sa banlieue (Pikine, Guédiawaye, Rufisque). Nous travaillons à étendre notre couverture à d'autres villes du Sénégal. Les zones disponibles sont affichées lors du checkout." },
      { q: "Quel est le délai de livraison ?", a: "Les commandes passées avant 12h sont livrées le même jour avant 20h. Les commandes passées après 12h sont livrées le lendemain matin. Le délai exact est confirmé dans votre email de confirmation." },
      { q: "La livraison est-elle gratuite ?", a: "Oui, la livraison est offerte sur toutes vos commandes, sans minimum d'achat. C'est notre engagement pour rendre les produits frais accessibles à tous." },
      { q: "Que faire si ma commande n'arrive pas ?", a: "Si votre commande n'est pas livrée dans le créneau prévu, contactez notre support via la page Contact ou par téléphone au +1 418 261 9091. Nous localisons votre livraison et vous tenons informé en temps réel." },
    ],
  },
  {
    category: "Paiement",
    icon: "payments",
    color: "text-emerald-400",
    questions: [
      { q: "Quels modes de paiement acceptez-vous ?", a: "Nous acceptons Wave et Orange Money. Ces solutions de paiement mobile sont les plus utilisées au Sénégal et permettent une transaction rapide et sécurisée directement depuis votre téléphone." },
      { q: "Mon paiement est-il sécurisé ?", a: "Oui, tous les paiements sont traités directement par Wave et Orange Money via leurs propres systèmes sécurisés. Agrumen ne stocke aucune information bancaire ou de carte." },
      { q: "Comment suis-je remboursé en cas de problème ?", a: "En cas d'annulation ou de produit défectueux, le remboursement est effectué sur le même moyen de paiement (Wave ou Orange Money) dans un délai de 24 à 48 heures ouvrées." },
    ],
  },
  {
    category: "Produits",
    icon: "eco",
    color: "text-lime-400",
    questions: [
      { q: "Les produits sont-ils vraiment frais ?", a: "Oui. Nos produits sont récoltés dans les 24 à 48 heures précédant la livraison, directement chez les producteurs partenaires. Nous imposons des standards de qualité stricts et contrôlons chaque lot." },
      { q: "D'où viennent les produits ?", a: "Tous nos produits proviennent de producteurs sénégalais vérifiés, répartis dans 14 régions du pays. Chaque produit affiche le nom et la localisation du producteur pour une transparence totale." },
      { q: "Que faire si un produit reçu est abîmé ?", a: "Prenez une photo du produit et contactez notre support dans les 24h suivant la livraison. Après vérification, nous vous remboursons ou vous renvoyons le produit sans frais supplémentaires." },
    ],
  },
  {
    category: "Compte",
    icon: "person",
    color: "text-purple-400",
    questions: [
      { q: "Comment créer un compte ?", a: "Cliquez sur « Commencer » dans la barre de navigation, puis renseignez votre nom, email et mot de passe. Un email de vérification vous sera envoyé." },
      { q: "Comment modifier mes informations personnelles ?", a: "Rendez-vous dans « Mon Compte » → section Profil. Vous pouvez y modifier votre nom, numéro de téléphone et adresse de livraison par défaut." },
      { q: "Comment supprimer mon compte ?", a: "Contactez notre support à hello@agrumen.sn en précisant votre demande. La suppression est effectuée sous 72h et toutes vos données personnelles sont effacées conformément à notre politique de confidentialité." },
    ],
  },
];

const AccordionItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/8 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-6 py-6 text-left group"
      >
        <span className="font-headline font-bold text-white text-base leading-snug group-hover:text-emerald-400 transition-colors duration-200">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="material-symbols-outlined text-white/30 text-xl shrink-0 mt-0.5"
        >
          add
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-white/50 leading-relaxed pb-6 pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [active, setActive] = useState("Commandes");
  const group = FAQ_DATA.find(g => g.category === active) || FAQ_DATA[0];
  const totalQ = FAQ_DATA.reduce((acc, g) => acc + g.questions.length, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <LandingNavbar />

      {/* ── HERO ── */}
      <section className="px-6 md:px-14 pt-36 pb-20 border-b border-white/8">
        <div className="mx-auto max-w-[1200px]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-3.5 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-headline text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">{totalQ} questions répondues</span>
            </div>
            <h1
              className="font-headline font-black text-white tracking-[-0.045em] leading-[0.88]"
              style={{ fontSize: "clamp(4rem, 9vw, 9rem)" }}
            >
              Questions<br />fréquentes.
            </h1>
            <p className="font-body text-white/40 text-lg mt-6 max-w-md">
              Tout ce que vous voulez savoir sur les commandes, la livraison, les paiements et votre compte.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ PRINCIPALE — sidebar + accordéon ── */}
      <section className="px-6 md:px-14 py-16">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">

          {/* Sidebar catégories */}
          <div className="lg:sticky lg:top-24 self-start space-y-1">
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 mb-4">Catégories</p>
            {FAQ_DATA.map(g => (
              <button
                key={g.category}
                onClick={() => setActive(g.category)}
                className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  active === g.category ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-base ${active === g.category ? g.color : "text-white/25"}`} style={{ fontVariationSettings: "'FILL' 1" }}>{g.icon}</span>
                  <span className="font-headline font-bold text-sm">{g.category}</span>
                </div>
                <span className="font-headline text-[10px] text-white/25">{g.questions.length}</span>
              </button>
            ))}

            <div className="mt-8 pt-8 border-t border-white/8">
              <p className="font-headline text-[10px] font-bold uppercase tracking-[0.18em] text-white/20 mb-3">Pas de réponse ?</p>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white/8 border border-white/10 text-white font-headline font-bold text-xs px-4 py-2.5 rounded-xl w-full justify-center">
                <span className="material-symbols-outlined text-sm">mail</span>
                Nous contacter
              </Link>
            </div>
          </div>

          {/* Accordéon questions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center">
                  <span className={`material-symbols-outlined text-lg ${group.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{group.icon}</span>
                </div>
                <h2 className="font-headline font-extrabold text-xl text-white">{group.category}</h2>
              </div>
              <div>
                {group.questions.map(item => (
                  <AccordionItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA BAS ── */}
      <section className="px-6 md:px-14 py-20 border-t border-white/8">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white/5 border border-white/10 p-8 flex flex-col gap-4"
          >
            <span className="material-symbols-outlined text-emerald-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
            <h3 className="font-headline font-extrabold text-white text-xl">Parler à un agent</h3>
            <p className="font-body text-sm text-white/45 leading-relaxed">Notre équipe est disponible du lundi au samedi de 7h à 20h pour répondre à toutes vos questions.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-foreground font-headline font-bold text-sm px-6 py-3 rounded-full w-fit mt-auto">
              <span className="material-symbols-outlined text-sm">mail</span>
              Nous contacter
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-8 flex flex-col gap-4"
          >
            <span className="material-symbols-outlined text-emerald-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            <h3 className="font-headline font-extrabold text-white text-xl">Vous êtes producteur ?</h3>
            <p className="font-body text-sm text-white/45 leading-relaxed">Rejoignez les 340+ agriculteurs qui vendent directement sur Agrumen. Inscription gratuite, sans engagement.</p>
            <Link to="/devenir-partenaire" className="inline-flex items-center gap-2 bg-emerald-500 text-white font-headline font-bold text-sm px-6 py-3 rounded-full w-fit mt-auto">
              <span className="material-symbols-outlined text-sm">agriculture</span>
              Devenir partenaire
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
