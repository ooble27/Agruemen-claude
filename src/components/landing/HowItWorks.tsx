import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import illustSelection from "@/assets/illust-selection.png";
import illustAgriculture from "@/assets/illust-agriculture.png";
import illustTracability from "@/assets/illust-tracability.png";
import illustBio from "@/assets/illust-bio.png";

const services = [
  {
    tag: "Sélection",
    title: "Produits Triés sur le Volet",
    desc: "Chaque produit est sélectionné directement auprès de nos producteurs partenaires pour garantir fraîcheur et qualité.",
    image: illustSelection,
  },
  {
    tag: "Agriculture",
    title: "Agriculture Responsable",
    desc: "Nous collaborons avec des producteurs qui pratiquent une agriculture respectueuse de la terre et des saisons.",
    image: illustAgriculture,
  },
  {
    tag: "Traçabilité",
    title: "Du Champ à Votre Table",
    desc: "Suivez le parcours de chaque produit, de la récolte jusqu'à votre porte, en toute transparence.",
    image: illustTracability,
  },
  {
    tag: "Bio & Local",
    title: "Produits 100% Naturels",
    desc: "Zéro pesticide, zéro intermédiaire. Des produits cultivés naturellement par nos partenaires locaux.",
    image: illustBio,
  },
];

const HowItWorks = () => {
  return (
    <section className="px-4 md:px-8 max-w-[1200px] mx-auto py-20 md:py-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-headline font-extrabold tracking-[-0.03em] leading-[1.05]">
            Notre Solution Agricole
            <br />
            <span className="text-on-surface-variant">Booste la Qualité</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-sm"
        >
          <p className="text-sm text-on-surface-variant font-body leading-relaxed mb-4">
            Découvrez nos catégories les plus populaires et les plus demandées par nos clients.
          </p>
          <Link
            to="/marche"
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-headline font-bold hover:bg-primary/20 transition-colors"
          >
            Voir Tout
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </motion.div>
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {services.map((service, i) => (
          <motion.div
            key={service.tag}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="group"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-primary/5 flex items-center justify-center p-4">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-md"
                loading="lazy"
                width={400}
                height={300}
              />
            </div>
            <span className="inline-block text-[11px] font-headline font-bold tracking-[0.15em] uppercase text-primary mb-2">
              {service.tag}
            </span>
            <h3 className="text-base font-headline font-bold mb-1">{service.title}</h3>
            <p className="text-xs text-on-surface-variant font-body leading-relaxed">
              {service.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 md:mt-28 h-px bg-outline-variant" />
    </section>
  );
};

export default HowItWorks;
