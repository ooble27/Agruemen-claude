import { motion } from "framer-motion";
import illustFarmerField from "@/assets/illust-farmer-field.png";

const MissionSection = () => {
  return (
    <section id="mission" className="px-4 md:px-8 max-w-[1200px] mx-auto pb-24 md:pb-40">
      {/* Editorial tag */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <span className="text-xs font-headline font-semibold tracking-[0.2em] uppercase text-on-surface-variant">
          //Notre Héritage
        </span>
      </motion.div>

      {/* Big editorial text */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 md:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-8"
        >
          <h2 className="text-3xl md:text-[2.8rem] lg:text-[3.5rem] font-headline font-extrabold tracking-[-0.03em] leading-[1.15]">
            Agrumen s'engage à créer un avenir plus juste et durable pour l'agriculture.{" "}
            <span className="text-on-surface-variant">
              Nous croyons que le vrai pouvoir appartient à la terre, avec le producteur comme acteur principal.
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-4 flex items-end"
        >
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-primary/5 flex items-center justify-center p-4">
            <img
              src={illustFarmerField}
              alt="Producteur dans son champ"
              className="w-full h-full object-contain drop-shadow-lg"
              loading="lazy"
              width={896}
              height={1200}
            />
          </div>
        </motion.div>
      </div>

      <div className="h-px bg-outline-variant" />
    </section>
  );
};

export default MissionSection;
