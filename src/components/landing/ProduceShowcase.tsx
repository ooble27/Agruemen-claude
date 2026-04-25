import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import illustFarmerWoman from "@/assets/illust-farmer-woman.png";
import illustProduceFlatlay from "@/assets/illust-produce-flatlay.png";

const ProduceShowcase = () => {
  return (
    <section className="py-20 md:py-32 px-4 md:px-8 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Illustrations grid */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3 rounded-3xl overflow-hidden aspect-[3/4] bg-primary/5 flex items-center justify-center p-4">
              <img
                src={illustFarmerWoman}
                alt="Agricultrice sénégalaise"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-700 drop-shadow-lg"
                loading="lazy"
                width={896}
                height={1200}
              />
            </div>
            <div className="col-span-2 rounded-3xl overflow-hidden aspect-[2/3] mt-12 bg-primary/5 flex items-center justify-center p-3">
              <img
                src={illustProduceFlatlay}
                alt="Produits frais du marché"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-700 drop-shadow-md"
                loading="lazy"
                width={1200}
                height={896}
              />
            </div>
          </div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3 border border-border/20"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-container-foreground text-lg">verified</span>
            </div>
            <div>
              <div className="text-sm font-headline font-bold">100% Naturel</div>
              <div className="text-xs text-on-surface-variant">Sans pesticides chimiques</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-primary font-headline font-bold text-xs uppercase tracking-[0.2em]">Nos Produits</span>
          <h2 className="text-3xl md:text-5xl font-headline font-extrabold tracking-tight mt-3 mb-6">
            La fraîcheur
            <br />
            <span className="text-primary">à l'état pur.</span>
          </h2>
          <p className="text-on-surface-variant font-body text-base leading-relaxed mb-8 max-w-md">
            Fruits tropicaux, légumes de saison, herbes aromatiques — chaque produit est cultivé avec soin par nos agriculteurs partenaires dans les Niayes, la Casamance et la vallée du fleuve Sénégal.
          </p>

          <div className="space-y-4 mb-10">
            {[
              { icon: "eco", text: "Agriculture biologique et durable" },
              { icon: "location_on", text: "Traçabilité du champ à la table" },
              { icon: "favorite", text: "Prix justes pour les producteurs" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-base">{item.icon}</span>
                </div>
                <span className="text-sm font-body">{item.text}</span>
              </div>
            ))}
          </div>

          <Link
            to="/marche"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full font-headline font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Voir les produits
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProduceShowcase;
