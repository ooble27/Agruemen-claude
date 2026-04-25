import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 max-w-[1200px] mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-primary-container rounded-3xl p-10 md:p-20 lg:p-28 relative overflow-hidden"
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 border-[3px] border-primary-container-foreground rounded-full" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 border-[3px] border-primary-container-foreground rounded-full" />
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-headline font-extrabold text-primary-container-foreground tracking-tight mb-6 leading-[1.05]">
            Mangez Local.
            <br />
            Soutenez nos Héros.
          </h2>
          <p className="text-base md:text-lg text-primary-container-foreground/70 font-body max-w-xl mx-auto mb-10">
            Rejoignez des milliers de Sénégalais qui font le choix de la qualité, de la fraîcheur et de la justice sociale.
          </p>
          <Link
            to="/marche"
            className="inline-flex items-center gap-2 bg-inverse-surface text-surface px-10 py-5 rounded-full font-headline font-bold text-lg hover:scale-[1.03] transition-transform shadow-2xl"
          >
            Explorer le Marché
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default FinalCTA;
