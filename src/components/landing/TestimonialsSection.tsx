import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Aminata Diop",
    role: "Acheteuse à Dakar",
    text: "Depuis que j'utilise Agrumen, je ne vais plus au marché. Les produits sont frais, livrés le jour même, et je soutiens directement nos agriculteurs.",
    initials: "AD",
  },
  {
    name: "Moussa Sall",
    role: "Producteur à Thiès",
    text: "Agrumen m'a permis de vendre mes récoltes à un prix juste, sans passer par des intermédiaires. Mes revenus ont augmenté de 40%.",
    initials: "MS",
  },
  {
    name: "Fatou Ndiaye",
    role: "Restauratrice",
    text: "La qualité des produits est exceptionnelle. Mes clients sentent la différence. La livraison est toujours ponctuelle.",
    initials: "FN",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-32 px-4 md:px-8 max-w-[1200px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary font-headline font-bold text-xs uppercase tracking-[0.2em]">Témoignages</span>
        <h2 className="text-3xl md:text-5xl font-headline font-extrabold tracking-tight mt-3">
          Ce qu'ils en disent.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-surface-container-lowest rounded-2xl p-8 border border-border/20 hover:border-primary/20 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-1 mb-5">
              {[...Array(5)].map((_, j) => (
                <span key={j} className="material-symbols-outlined text-primary text-base">star</span>
              ))}
            </div>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-6">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-headline font-bold text-primary">{t.initials}</span>
              </div>
              <div>
                <div className="text-sm font-headline font-bold">{t.name}</div>
                <div className="text-xs text-on-surface-variant">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
