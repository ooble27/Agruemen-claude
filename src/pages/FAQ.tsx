import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=360&h=480&fit=crop&auto=format", alt: "Marché", rot: -4 },
  { src: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=360&h=480&fit=crop&auto=format", alt: "Légumes", rot: 3 },
  { src: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=360&h=480&fit=crop&auto=format", alt: "Ananas", rot: -1 },
];

const FAQ_DATA = [
  {
    category: "Commandes",
    icon: "receipt_long",
    questions: [
      {
        q: "Comment passer une commande ?",
        a: "Parcourez le Marché, ajoutez vos produits au panier, puis validez votre commande en renseignant votre adresse de livraison et en choisissant votre mode de paiement (Wave ou Orange Money). Vous recevrez une confirmation immédiatement.",
      },
      {
        q: "Puis-je modifier ma commande après validation ?",
        a: "Une fois la commande confirmée et le paiement traité, il n'est plus possible de la modifier. Si vous constatez une erreur, contactez notre support dans les 30 minutes suivant la commande et nous ferons notre possible pour vous aider.",
      },
      {
        q: "Comment annuler une commande ?",
        a: "Vous pouvez annuler une commande tant qu'elle est en statut « En attente ». Rendez-vous dans « Mes Commandes », sélectionnez la commande et contactez le support. Le remboursement est effectué sous 48h.",
      },
      {
        q: "Puis-je commander sans créer un compte ?",
        a: "Non, un compte est nécessaire pour passer une commande afin de vous permettre de suivre vos livraisons et consulter votre historique. La création est rapide et gratuite.",
      },
    ],
  },
  {
    category: "Livraison",
    icon: "local_shipping",
    questions: [
      {
        q: "Quelles sont les zones de livraison ?",
        a: "Agrumen livre actuellement à Dakar et dans sa banlieue (Pikine, Guédiawaye, Rufisque). Nous travaillons à étendre notre couverture à d'autres villes du Sénégal. Les zones disponibles sont affichées lors du checkout.",
      },
      {
        q: "Quel est le délai de livraison ?",
        a: "Les commandes passées avant 12h sont livrées le même jour avant 20h. Les commandes passées après 12h sont livrées le lendemain matin. Le délai exact est confirmé dans votre email de confirmation.",
      },
      {
        q: "La livraison est-elle gratuite ?",
        a: "Oui, la livraison est offerte sur toutes vos commandes, sans minimum d'achat. C'est notre engagement pour rendre les produits frais accessibles à tous.",
      },
      {
        q: "Que faire si ma commande n'arrive pas ?",
        a: "Si votre commande n'est pas livrée dans le créneau prévu, contactez notre support via la page Contact ou par téléphone au +1 418 261 9091. Nous localisons votre livraison et vous tenons informé en temps réel.",
      },
    ],
  },
  {
    category: "Paiement",
    icon: "payments",
    questions: [
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Nous acceptons Wave et Orange Money. Ces solutions de paiement mobile sont les plus utilisées au Sénégal et permettent une transaction rapide et sécurisée directement depuis votre téléphone.",
      },
      {
        q: "Mon paiement est-il sécurisé ?",
        a: "Oui, tous les paiements sont traités directement par Wave et Orange Money via leurs propres systèmes sécurisés. Agrumen ne stocke aucune information bancaire ou de carte.",
      },
      {
        q: "Comment suis-je remboursé en cas de problème ?",
        a: "En cas d'annulation ou de produit défectueux, le remboursement est effectué sur le même moyen de paiement (Wave ou Orange Money) dans un délai de 24 à 48 heures ouvrées.",
      },
    ],
  },
  {
    category: "Produits",
    icon: "eco",
    questions: [
      {
        q: "Les produits sont-ils vraiment frais ?",
        a: "Oui. Nos produits sont récoltés dans les 24 à 48 heures précédant la livraison, directement chez les producteurs partenaires. Nous imposons des standards de qualité stricts et contrôlons chaque lot.",
      },
      {
        q: "D'où viennent les produits ?",
        a: "Tous nos produits proviennent de producteurs sénégalais vérifiés, répartis dans 14 régions du pays. Chaque produit affiche le nom et la localisation du producteur pour une transparence totale.",
      },
      {
        q: "Que faire si un produit reçu est abîmé ?",
        a: "Prenez une photo du produit et contactez notre support dans les 24h suivant la livraison. Après vérification, nous vous remboursons ou vous renvoyons le produit sans frais supplémentaires.",
      },
    ],
  },
  {
    category: "Compte",
    icon: "person",
    questions: [
      {
        q: "Comment créer un compte ?",
        a: "Cliquez sur « Commencer » ou « Connexion » dans la barre de navigation, puis sélectionnez « Créer un compte ». Renseignez votre nom, email et mot de passe. Un email de vérification vous sera envoyé.",
      },
      {
        q: "Comment modifier mes informations personnelles ?",
        a: "Rendez-vous dans « Mon Compte » → section Profil. Vous pouvez y modifier votre nom, numéro de téléphone et adresse de livraison par défaut.",
      },
      {
        q: "Comment supprimer mon compte ?",
        a: "Contactez notre support à hello@agrumen.sn en précisant votre demande. La suppression est effectuée sous 72h et toutes vos données personnelles sont effacées conformément à notre politique de confidentialité.",
      },
    ],
  },
];

const AccordionItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/20 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="font-headline text-sm font-bold text-foreground leading-snug">{q}</span>
        <span
          className="material-symbols-outlined text-on-surface-variant text-lg shrink-0 mt-0.5 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          expand_more
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-on-surface-variant leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const displayed = activeCategory
    ? FAQ_DATA.filter(d => d.category === activeCategory)
    : FAQ_DATA;

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
                <span className="font-headline text-[11px] font-bold text-white/70 uppercase tracking-widest">Centre d'aide</span>
              </div>
              <h1
                className="font-headline font-black text-white tracking-[-0.045em] leading-[0.9] mb-5"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
              >
                Questions<br />fréquentes.
              </h1>
              <p className="font-body text-white/50 text-lg leading-relaxed max-w-sm mb-8">
                Trouvez rapidement les réponses à vos questions sur les commandes, la livraison et votre compte.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 font-headline text-sm font-bold text-white border border-white/20 rounded-full px-5 py-2.5">
                <span className="material-symbols-outlined text-sm">mail</span>
                Poser une question
              </Link>
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

        {/* ── Filter tabs + FAQ ── */}
        <section className="py-20 px-6 md:px-8">
          <div className="mx-auto max-w-[900px]">

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-12">
              <button
                onClick={() => setActiveCategory(null)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-headline text-xs font-bold transition-all ${
                  activeCategory === null ? "bg-foreground text-white" : "border border-border/40 text-on-surface-variant"
                }`}
              >
                Toutes
              </button>
              {FAQ_DATA.map(d => (
                <button
                  key={d.category}
                  onClick={() => setActiveCategory(activeCategory === d.category ? null : d.category)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-headline text-xs font-bold transition-all ${
                    activeCategory === d.category ? "bg-foreground text-white" : "border border-border/40 text-on-surface-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{d.icon}</span>
                  {d.category}
                </button>
              ))}
            </div>

            {/* FAQ groups */}
            <div className="space-y-10">
              {displayed.map((group, gi) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.06 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-white text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{group.icon}</span>
                    </div>
                    <h2 className="font-headline font-extrabold text-lg tracking-tight text-foreground">{group.category}</h2>
                  </div>
                  <div className="rounded-2xl border border-border/30 bg-surface-container-lowest px-6">
                    {group.questions.map(item => (
                      <AccordionItem key={item.q} q={item.q} a={item.a} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA bottom */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 rounded-2xl bg-[#0a0a0a] p-8 text-center relative overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
              <span className="material-symbols-outlined text-emerald-400 text-3xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
              <h3 className="font-headline font-extrabold text-xl text-white mb-2">Vous n'avez pas trouvé votre réponse ?</h3>
              <p className="font-body text-sm text-white/50 mb-6">Notre équipe est disponible du lundi au samedi, de 7h à 20h.</p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-foreground px-6 py-3 rounded-full font-headline font-bold text-sm"
              >
                <span className="material-symbols-outlined text-base">mail</span>
                Nous contacter
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default FAQ;
