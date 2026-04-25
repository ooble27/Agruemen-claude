import { motion } from "framer-motion";
import illustFarmerField from "@/assets/illust-farmer-field.png";
import illustSeedlings from "@/assets/illust-seedlings.png";
import illustBio from "@/assets/illust-bio.png";
import illustSelection from "@/assets/illust-selection.png";
import illustTeamFarming from "@/assets/illust-team-farming.png";
import illustFarmerWoman from "@/assets/illust-farmer-woman.png";

const ValuesSection = () => {
  return (
    <section id="valeurs" className="px-4 md:px-8 max-w-[1200px] mx-auto py-20 md:py-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-12 md:mb-16"
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-headline font-extrabold tracking-[-0.03em] leading-[1.05] max-w-2xl">
          Collaborez & Apprenez
          <br />
          <span className="text-on-surface-variant">de Nos Experts</span>
        </h2>
      </motion.div>

      {/* Masonry-like illustration grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Tall left */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="sm:col-span-1 md:row-span-2"
        >
          <div className="relative w-full aspect-[4/3] sm:aspect-[3/4] md:aspect-auto md:h-full md:min-h-[450px] rounded-2xl overflow-hidden group bg-primary/5 flex items-center justify-center p-4">
            <img
              src={illustFarmerField}
              alt="Nos producteurs"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-lg"
              loading="lazy"
              width={896}
              height={1200}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/40 to-transparent">
              <span className="text-xs font-headline font-bold text-white/90 tracking-wider uppercase">Nos Producteurs</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group bg-primary/5 flex items-center justify-center p-4">
            <img
              src={illustSeedlings}
              alt="Croissance des plants"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-md"
              loading="lazy"
              width={400}
              height={300}
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/40 to-transparent">
              <span className="text-[10px] font-headline font-bold text-white/90 tracking-wider uppercase">Pépinière</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group bg-primary/5 flex items-center justify-center p-4">
            <img
              src={illustBio}
              alt="Produits bio"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-md"
              loading="lazy"
              width={400}
              height={300}
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/40 to-transparent">
              <span className="text-[10px] font-headline font-bold text-white/90 tracking-wider uppercase">Bio & Naturel</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group bg-primary/5 flex items-center justify-center p-4">
            <img
              src={illustSelection}
              alt="Sélection des produits"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-md"
              loading="lazy"
              width={400}
              height={300}
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/40 to-transparent">
              <span className="text-[10px] font-headline font-bold text-white/90 tracking-wider uppercase">Sélection</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="sm:col-span-2 md:col-span-2"
        >
          <div className="relative aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden group bg-primary/5 flex items-center justify-center p-6">
            <img
              src={illustTeamFarming}
              alt="Notre équipe"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-md"
              loading="lazy"
              width={1264}
              height={848}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-5 py-2.5 flex items-center gap-2 shadow-lg">
                <span className="material-symbols-outlined text-primary text-xl">play_arrow</span>
                <span className="text-xs font-headline font-bold">Découvrir Notre Mission</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group bg-primary/5 flex items-center justify-center p-4">
            <img
              src={illustFarmerWoman}
              alt="Agricultrice"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-md"
              loading="lazy"
              width={896}
              height={1200}
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/40 to-transparent">
              <span className="text-[10px] font-headline font-bold text-white/90 tracking-wider uppercase">Nos Agricultrices</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-20 md:mt-28 h-px bg-outline-variant" />
    </section>
  );
};

export default ValuesSection;
