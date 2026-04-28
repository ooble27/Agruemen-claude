import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=360&h=480&fit=crop&auto=format", alt: "Agriculture", rot: -3 },
  { src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=360&h=480&fit=crop&auto=format", alt: "Récolte", rot: 4 },
  { src: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=360&h=480&fit=crop&auto=format", alt: "Producteur", rot: -2 },
];

const CATEGORIES = ["Tous", "Agrobusiness", "Techniques agricoles", "Nutrition", "Producteurs", "Marché & économie"];

const ARTICLES = [
  {
    id: 1,
    category: "Agrobusiness",
    title: "L'agrobusiness au Sénégal : un secteur en pleine mutation",
    excerpt: "Le secteur agricole sénégalais représente 17% du PIB et emploie plus de la moitié de la population active. Découvrez comment la digitalisation transforme les chaînes de valeur et crée de nouvelles opportunités pour les producteurs.",
    author: "Équipe Agrumen",
    date: "24 avril 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=450&fit=crop&auto=format",
    featured: true,
  },
  {
    id: 2,
    category: "Techniques agricoles",
    title: "Maraîchage urbain à Dakar : cultiver en ville, c'est possible",
    excerpt: "De plus en plus de Dakarois se lancent dans le maraîchage urbain pour produire leurs propres légumes. Techniques de culture en bac, choix des variétés, gestion de l'eau — tout ce qu'il faut savoir pour démarrer.",
    author: "Aminata Diallo",
    date: "20 avril 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=450&fit=crop&auto=format",
  },
  {
    id: 3,
    category: "Marché & économie",
    title: "Prix des légumes à Dakar : comprendre les fluctuations saisonnières",
    excerpt: "Les prix des tomates, oignons et piments varient considérablement selon les saisons. Analyse des facteurs qui influencent le marché et conseils pour acheter au meilleur prix tout au long de l'année.",
    author: "Moussa Sow",
    date: "15 avril 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=450&fit=crop&auto=format",
  },
  {
    id: 4,
    category: "Producteurs",
    title: "Portrait : Fatou Ba, maraîchère à Thiès qui vend sur Agrumen",
    excerpt: "Rencontre avec Fatou Ba, 38 ans, productrice de tomates et d'aubergines dans la région de Thiès. Depuis qu'elle a rejoint Agrumen, ses revenus ont augmenté de 45% et elle a embauché deux employés supplémentaires.",
    author: "Équipe Agrumen",
    date: "10 avril 2026",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=450&fit=crop&auto=format",
  },
  {
    id: 5,
    category: "Nutrition",
    title: "Les super-aliments sénégalais que vous ignorez peut-être",
    excerpt: "Le baobab, le moringa, le fonio, le sésame... Le Sénégal regorge d'aliments aux propriétés nutritionnelles exceptionnelles. Guide complet de ces trésors locaux et comment les intégrer dans votre alimentation quotidienne.",
    author: "Dr. Khadija Ndiaye",
    date: "5 avril 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&h=450&fit=crop&auto=format",
  },
  {
    id: 6,
    category: "Techniques agricoles",
    title: "La chaîne du froid : comment préserver la fraîcheur des produits agricoles",
    excerpt: "En Afrique subsaharienne, 30 à 40% des pertes post-récolte sont dues à une mauvaise gestion de la température. Solutions pratiques pour les producteurs sénégalais : stockage, transport, conditionnement.",
    author: "Ibrahim Thiaw",
    date: "1 avril 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=800&h=450&fit=crop&auto=format",
  },
  {
    id: 7,
    category: "Agrobusiness",
    title: "Financement agricole au Sénégal : quelles options pour les petits producteurs ?",
    excerpt: "Microfinance, crédits agricoles, subventions de l'État, financement participatif — tour d'horizon des solutions disponibles pour les exploitants qui veulent investir et développer leur activité.",
    author: "Équipe Agrumen",
    date: "28 mars 2026",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=450&fit=crop&auto=format",
  },
  {
    id: 8,
    category: "Nutrition",
    title: "Manger local et de saison : les bénéfices pour la santé et l'environnement",
    excerpt: "Consommer des produits locaux et de saison réduit l'empreinte carbone, soutient les agriculteurs sénégalais et apporte une meilleure qualité nutritionnelle. Calendrier des fruits et légumes de saison au Sénégal.",
    author: "Dr. Khadija Ndiaye",
    date: "22 mars 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&h=450&fit=crop&auto=format",
  },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const featured = ARTICLES.find(a => a.featured);
  const rest = ARTICLES.filter(a => !a.featured);

  const filtered = activeCategory === "Tous"
    ? rest
    : rest.filter(a => a.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-white">
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: "radial-gradient(circle, #dde3ec 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="relative z-[1]">
        <LandingNavbar />

        {/* ── Hero ── */}
        <section className="bg-[#0a0a0a] overflow-hidden">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 pt-36 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 min-w-0"
            >
              <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-3.5 py-1.5 mb-6">
                <span className="material-symbols-outlined text-emerald-400 text-sm">fiber_manual_record</span>
                <span className="font-headline text-[11px] font-bold text-white/70 uppercase tracking-widest">Le Blog Agrumen</span>
              </div>
              <h1
                className="font-headline font-black text-white tracking-[-0.045em] leading-[0.9] mb-5"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
              >
                Agriculture,<br />nutrition &<br />agrobusiness.
              </h1>
              <p className="font-body text-white/50 text-lg leading-relaxed max-w-sm mb-8">
                Conseils pratiques, portraits de producteurs, analyses de marché et tendances pour mieux comprendre le monde agricole sénégalais.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Agrobusiness", "Nutrition", "Producteurs"].map(tag => (
                  <span key={tag} className="font-headline text-xs font-bold text-white/40 border border-white/10 rounded-full px-3.5 py-1.5">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="shrink-0 flex items-end gap-3 lg:gap-4 lg:pr-6"
            >
              {PHOTOS.map((img) => (
                <div
                  key={img.alt}
                  className="overflow-hidden rounded-xl border border-white/10"
                  style={{
                    width: "clamp(90px, 14vw, 155px)",
                    height: "clamp(120px, 18vw, 205px)",
                    transform: `rotate(${img.rot}deg)`,
                    transformOrigin: "bottom center",
                    flexShrink: 0,
                  }}
                >
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="eager" />
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Article à la une ── */}
        {featured && (
          <section className="py-16 px-6 md:px-8 border-b border-border/20">
            <div className="mx-auto max-w-[1200px]">
              <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-6">À la une</p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group rounded-2xl overflow-hidden border border-border/30 bg-surface-container-lowest grid grid-cols-1 lg:grid-cols-2"
              >
                <div className="aspect-[16/9] lg:aspect-auto overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <span className="inline-flex items-center gap-1.5 font-headline text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 w-fit mb-4">
                    {featured.category}
                  </span>
                  <h2 className="font-headline font-extrabold text-foreground tracking-tight leading-tight mb-4" style={{ fontSize: "clamp(1.3rem, 2.5vw, 2rem)" }}>
                    {featured.title}
                  </h2>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {featured.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-headline text-xs font-bold text-foreground">{featured.author}</p>
                      <p className="font-body text-xs text-on-surface-variant">{featured.date} · {featured.readTime} de lecture</p>
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 bg-foreground text-white font-headline font-bold text-sm px-6 py-3 rounded-full w-fit">
                    <span>Lire l'article</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ── Grille articles ── */}
        <section className="py-16 px-6 md:px-8">
          <div className="mx-auto max-w-[1200px]">

            {/* Filtres catégories */}
            <div className="flex flex-wrap gap-2 mb-10">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-headline text-xs font-bold transition-all ${
                    activeCategory === cat ? "bg-foreground text-white" : "border border-border/40 text-on-surface-variant"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grille */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article, i) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="group rounded-2xl overflow-hidden border border-border/30 bg-surface-container-lowest flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="inline-flex items-center font-headline text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5 w-fit mb-3">
                      {article.category}
                    </span>
                    <h3 className="font-headline font-extrabold text-base text-foreground leading-snug tracking-tight mb-3 flex-1">
                      {article.title}
                    </h3>
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-5 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-border/20">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {article.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-headline text-[10px] font-bold text-foreground leading-none">{article.author}</p>
                          <p className="font-body text-[10px] text-on-surface-variant mt-0.5">{article.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-on-surface-variant/60">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span className="font-body text-[11px]">{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 block mb-3">article</span>
                <p className="font-body text-sm text-on-surface-variant">Aucun article dans cette catégorie pour l'instant.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Newsletter ── */}
        <section className="py-16 px-6 md:px-8 border-t border-border/20">
          <div className="mx-auto max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-[#0a0a0a] p-10 relative overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1 text-center lg:text-left">
                  <span className="material-symbols-outlined text-emerald-400 text-3xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                  <h3 className="font-headline font-extrabold text-2xl text-white tracking-tight mb-2">
                    Restez informé de l'actualité agricole
                  </h3>
                  <p className="font-body text-sm text-white/50">
                    Recevez nos meilleurs articles chaque semaine directement dans votre boîte mail.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-[420px]">
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="flex-1 px-4 py-3 rounded-md bg-white/8 border border-white/10 font-body text-sm text-white placeholder-white/30 outline-none focus:border-white/30 transition-all"
                  />
                  <button className="px-6 py-3 bg-white text-foreground font-headline font-bold text-sm rounded-md whitespace-nowrap">
                    S'abonner
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA partenaire ── */}
        <section className="py-16 px-6 md:px-8">
          <div className="mx-auto max-w-[1200px] text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Vous êtes producteur ?</p>
              <h3 className="font-headline font-black text-foreground tracking-tighter mb-4" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
                Rejoignez la plateforme et vendez vos récoltes.
              </h3>
              <Link
                to="/devenir-partenaire"
                className="inline-flex items-center gap-2 bg-foreground text-white px-8 py-4 rounded-full font-headline font-bold text-sm"
              >
                <span className="material-symbols-outlined text-base">agriculture</span>
                Devenir partenaire
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Blog;
