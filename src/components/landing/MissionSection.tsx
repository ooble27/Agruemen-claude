import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: "storefront",
    title: "Explorez le Marché",
    desc: "Parcourez des centaines de produits frais directement issus de nos producteurs partenaires à travers tout le Sénégal.",
  },
  {
    number: "02",
    icon: "shopping_cart",
    title: "Composez votre Panier",
    desc: "Choisissez vos fruits, légumes, céréales et plus. Payez en toute sécurité avec Wave, Orange Money ou carte bancaire.",
  },
  {
    number: "03",
    icon: "local_shipping",
    title: "Recevez chez Vous",
    desc: "Vos produits frais sont livrés directement à votre porte partout à Dakar en moins de 24 heures.",
  },
];

const MissionSection = () => {
  return (
    <section id="comment" className="bg-[#f9f6f1] py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 md:mb-20"
        >
          <span className="mb-4 block font-headline text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Simple comme bonjour
          </span>
          <h2 className="max-w-2xl font-headline text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground md:text-5xl lg:text-6xl">
            Comment ça<br />
            <span className="text-on-surface-variant">marche ?</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="rounded-2xl bg-white p-7"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground">
                  <span className="material-symbols-outlined text-xl text-white">{step.icon}</span>
                </div>
                <span className="font-headline text-5xl font-black leading-none text-foreground/[0.06]">
                  {step.number}
                </span>
              </div>
              <h3 className="mb-2 font-headline text-lg font-bold text-foreground">{step.title}</h3>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant">{step.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default MissionSection;
