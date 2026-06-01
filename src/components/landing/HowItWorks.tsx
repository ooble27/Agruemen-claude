import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const steps = [
  {
    n: "01",
    icon: "storefront",
    title: "Explorez le Marché",
    desc: "Parcourez des centaines de produits frais sélectionnés et livrés par Mamakaasa depuis tout le Sénégal.",
  },
  {
    n: "02",
    icon: "shopping_cart",
    title: "Composez votre Panier",
    desc: "Choisissez vos fruits, légumes, céréales et payez avec Wave, Orange Money ou carte bancaire.",
  },
  {
    n: "03",
    icon: "local_shipping",
    title: "Recevez chez Vous",
    desc: "Livraison directe à votre porte, partout à Dakar, en moins de 24 heures après commande.",
  },
];

const HowItWorks = () => {
  return (
    <section id="comment" className="pt-6 pb-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="mb-3 block font-headline text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            Simple comme bonjour
          </span>
          <h2 className="font-headline text-3xl font-extrabold tracking-[-0.03em] text-foreground md:text-5xl lg:text-6xl">
            Comment ça<br />
            <span className="text-on-surface-variant">marche ?</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.55 }}
              className="relative overflow-hidden rounded-2xl border border-black/8 bg-white/80 p-7 backdrop-blur-sm"
            >
              <span className="pointer-events-none absolute right-5 top-4 select-none font-headline text-[5rem] font-black leading-none text-foreground/[0.05]">
                {step.n}
              </span>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-foreground">
                <span className="material-symbols-outlined text-xl text-white">{step.icon}</span>
              </div>
              <h3 className="mb-2 font-headline text-lg font-bold text-foreground">{step.title}</h3>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <Link
            to="/auth"
            className="flex items-center gap-2 rounded-md border border-black/15 bg-white/80 px-7 py-3.5 font-headline text-sm font-bold text-foreground backdrop-blur-sm transition-colors hover:border-black/30"
          >
            Créer un compte gratuitement
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorks;
