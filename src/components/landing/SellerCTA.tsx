import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import deliveryMoto from "@/assets/delivery-moto.png";

const features = [
  { n: "01", icon: "smartphone",     title: "Commandez depuis votre téléphone",          sub: "En quelques clics, partout, à tout moment." },
  { n: "02", icon: "payments",       title: "Payez avec Wave, Orange Money ou carte",    sub: "Modes de paiement locaux et sécurisés." },
  { n: "03", icon: "local_shipping", title: "Livraison partout à Dakar en moins de 24h", sub: "Nos équipes approvisionnent chaque matin pour vous livrer frais." },
  { n: "04", icon: "verified",       title: "Qualité sélectionnée, traçabilité garantie",  sub: "Chaque produit est contrôlé avant d'être livré chez vous." },
];

const SellerCTA = () => {
  return (
    <section className="mx-auto max-w-[1200px] space-y-16 px-4 py-16 md:px-8">

      {/* ─── "C'est quoi Mamakaasa ?" — manifeste éditorial ─── */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">

        {/* Left — headline manifeste */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col justify-center"
        >
          <span className="mb-5 block font-headline text-xs font-bold uppercase tracking-[0.25em] text-on-surface-variant">
            // C'est quoi Mamakaasa ?
          </span>

          <h2 className="mb-6 font-headline text-4xl font-black leading-[1.05] tracking-[-0.04em] text-foreground md:text-5xl lg:text-[3.4rem]">
            Le marché sénégalais{" "}
            <em className="not-italic text-on-surface-variant">dans votre poche.</em>
          </h2>

          <p className="mb-8 max-w-md font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
            Mamakaasa sélectionne et vous livre les meilleurs produits agricoles du Sénégal. Fruits, légumes, céréales — 100% frais, directement à votre porte.
          </p>

          <Link
            to="/auth"
            className="inline-flex w-fit items-center gap-2 rounded-md bg-foreground px-7 py-3.5 font-headline text-sm font-bold text-white transition-opacity hover:opacity-85"
          >
            Commencer maintenant
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </motion.div>

        {/* Right — feature table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex flex-col justify-center divide-y divide-black/8"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.n}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i + 0.2 }}
              className="group flex items-start gap-5 py-5 first:pt-0 last:pb-0"
            >
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-black/10 bg-white/80 transition-colors group-hover:bg-foreground">
                <span className="material-symbols-outlined text-lg text-foreground transition-colors group-hover:text-white">
                  {f.icon}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="font-headline text-[15px] font-bold text-foreground">{f.title}</p>
                <p className="mt-0.5 font-body text-xs text-on-surface-variant">{f.sub}</p>
              </div>

              {/* Number */}
              <span className="shrink-0 font-headline text-xs font-bold text-foreground/20">{f.n}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* ─── Delivery — dark bg with moto (inchangé) ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-3xl bg-inverse-surface"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/4 rounded-full bg-primary-container/8 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/4 translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="grid grid-cols-1 items-center lg:grid-cols-2">
          <div className="relative z-10 p-8 md:p-14 lg:p-16">
            <span className="mb-6 inline-block h-0.5 w-12 bg-primary-container" />
            <h3 className="mb-4 font-headline text-2xl font-extrabold leading-[1.1] tracking-tight text-surface md:text-4xl lg:text-5xl">
              Faites-vous<br />
              livrer <span className="text-primary-container">partout.</span>
            </h3>
            <p className="mb-8 max-w-md font-body text-sm leading-relaxed text-inverse-on-surface md:text-base">
              Nos livreurs parcourent tout Dakar pour vous apporter la fraîcheur directement à votre porte. Rapide, fiable, et toujours dans les temps.
            </p>
            <div className="mb-8 flex gap-6">
              {[
                { icon: "schedule", label: "Livraison en 24h" },
                { icon: "location_on", label: "Tout Dakar" },
                { icon: "eco", label: "Emballage éco" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary-container">{item.icon}</span>
                  <span className="font-headline text-[11px] font-medium text-inverse-on-surface">{item.label}</span>
                </div>
              ))}
            </div>
            <Link
              to="/marche"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-container px-7 py-3.5 font-headline text-sm font-bold text-primary-container-foreground transition-transform hover:scale-[0.97]"
            >
              Commander Maintenant
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>

          <div className="relative flex items-center justify-center p-6 lg:justify-start lg:p-10 lg:pl-0">
            <motion.img
              src={deliveryMoto}
              alt="Livraison à moto"
              className="h-auto w-full max-w-[520px] drop-shadow-2xl lg:max-w-[620px]"
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
