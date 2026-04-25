import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import deliveryMoto from "@/assets/delivery-moto.png";

const SellerCTA = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 max-w-[1200px] mx-auto space-y-20 md:space-y-28">

      {/* ─── SECTION 1: What is Agrumen — editorial bold text ─── */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-20"
        >
          <span className="text-xs font-headline font-semibold tracking-[0.2em] uppercase text-on-surface-variant mb-6 block">
            //C'est quoi Agrumen ?
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-[4.5rem] font-headline font-extrabold tracking-[-0.04em] leading-[1.08] max-w-4xl">
            La première plateforme digitale{" "}
            <span className="text-primary">d'agrobusiness</span>{" "}
            au Sénégal.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl font-body leading-relaxed text-on-surface-variant"
          >
            Agrumen est une plateforme qui vous permet d'acheter des produits agricoles frais, 100% naturels, directement depuis votre téléphone. Des fruits, des légumes, des céréales — livrés chez vous en un clic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {[
              { icon: "smartphone", text: "Commandez en quelques clics depuis votre téléphone" },
              { icon: "payments", text: "Payez avec Wave, Orange Money ou carte bancaire" },
              { icon: "local_shipping", text: "Faites-vous livrer partout à Dakar en moins de 24h" },
              { icon: "verified", text: "Chaque produit est tracé de la récolte à votre porte" },
            ].map((item, i) => (
              <motion.div
                key={item.icon}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i + 0.3 }}
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined text-primary text-lg group-hover:text-primary-container-foreground transition-colors">
                    {item.icon}
                  </span>
                </div>
                <p className="text-sm font-body text-on-surface-variant leading-relaxed pt-2">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>

      {/* ─── SECTION 2: Delivery — dark bg with moto illustration ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-inverse-surface rounded-3xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary-container/8 -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-primary/5 translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          {/* Left — text */}
          <div className="relative z-10 p-8 md:p-14 lg:p-16">
            <span className="inline-block w-12 h-0.5 bg-primary-container mb-6" />
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-headline font-extrabold tracking-tight text-surface mb-4 leading-[1.1]">
              Faites-vous
              <br />
              livrer <span className="text-primary-container">partout.</span>
            </h3>
            <p className="text-sm md:text-base text-inverse-on-surface mb-8 leading-relaxed max-w-md font-body">
              Nos livreurs parcourent tout Dakar pour vous apporter la fraîcheur directement à votre porte. Rapide, fiable, et toujours dans les temps.
            </p>

            <div className="flex gap-6 mb-8">
              {[
                { icon: "schedule", label: "Livraison en 24h" },
                { icon: "location_on", label: "Tout Dakar" },
                { icon: "eco", label: "Emballage éco" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container text-lg">{item.icon}</span>
                  <span className="text-[11px] text-inverse-on-surface font-headline font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <Link
              to="/marche"
              className="inline-flex items-center gap-2 bg-primary-container text-primary-container-foreground px-7 py-3.5 rounded-full font-headline font-bold text-sm hover:scale-[0.97] transition-transform w-fit"
            >
              Commander Maintenant
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>

          {/* Right — moto illustration */}
          <div className="relative flex items-center justify-center lg:justify-start p-6 lg:p-10 lg:pl-0">
            <motion.img
              src={deliveryMoto}
              alt="Livraison à moto"
              className="w-full max-w-[520px] lg:max-w-[620px] h-auto drop-shadow-2xl"
              loading="lazy"
              width={1376}
              height={768}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SellerCTA;
