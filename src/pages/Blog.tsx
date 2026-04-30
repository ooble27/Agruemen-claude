import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";
import { ARTICLES } from "@/data/blogArticles";

const CATEGORIES = ["Tous", "Agrobusiness", "Techniques agricoles", "Nutrition", "Producteurs", "Marché & économie"];

const TICKER = ["AGROBUSINESS", "NUTRITION", "SÉNÉGAL", "AGRICULTURE", "PRODUCTEURS", "DURABILITÉ", "ÉCONOMIE", "AGROBUSINESS", "NUTRITION", "SÉNÉGAL", "AGRICULTURE"];

const CATEGORY_COLORS: Record<string, string> = {
  "Agrobusiness": "bg-amber-50 text-amber-700 border-amber-200",
  "Techniques agricoles": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Nutrition": "bg-blue-50 text-blue-700 border-blue-200",
  "Producteurs": "bg-orange-50 text-orange-700 border-orange-200",
  "Marché & économie": "bg-purple-50 text-purple-700 border-purple-200",
};

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const featured = ARTICLES.find(a => a.featured);
  const rest = ARTICLES.filter(a => !a.featured);
  const filtered = activeCategory === "Tous" ? rest : rest.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <LandingNavbar />

      {/* ── HERO = Article à la une (plein écran) ── */}
      {featured && (
        <section className="relative min-h-screen flex items-end overflow-hidden bg-[#0a0a0a]">
          <motion.img
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            src={featured.image}
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

          <div className="relative z-10 w-full px-6 md:px-14 pb-16 pt-40">
            <div className="mx-auto max-w-[1200px]">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">À la une</span>
                  <span className="w-px h-4 bg-white/20" />
                  <span className={`font-headline text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${CATEGORY_COLORS[featured.category] || ""}`}>{featured.category}</span>
                  <span className="font-body text-xs text-white/40">{featured.date} · {featured.readTime} de lecture</span>
                </div>
                <h1
                  className="font-headline font-black text-white tracking-tighter leading-[0.92] mb-6"
                  style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)" }}
                >
                  {featured.title}
                </h1>
                <p className="font-body text-white/60 text-lg leading-relaxed max-w-xl mb-8">{featured.excerpt}</p>
                <Link
                  to={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-3 bg-white text-foreground font-headline font-bold text-sm px-7 py-4 rounded-xl group"
                >
                  Lire l'article
                  <span className="material-symbols-outlined text-base transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2"
          >
            <div className="w-px h-12 bg-white/20 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 right-0 bg-white/60"
                animate={{ height: ["0%", "100%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <span className="font-headline text-[9px] font-bold text-white/30 uppercase tracking-widest" style={{ writingMode: "vertical-lr" }}>Scroll</span>
          </motion.div>
        </section>
      )}

      {/* ── TICKER ── */}
      <div className="bg-[#0a0a0a] border-t border-white/6 py-3.5 overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap" style={{ animation: "ticker 30s linear infinite" }}>
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="font-headline text-xs font-black text-white/25 tracking-[0.2em] uppercase shrink-0 flex items-center gap-8">
              {item} <span className="text-emerald-500/60">·</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ── FILTRES ── */}
      <section className="px-6 md:px-14 py-12 border-b border-border/20">
        <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Le Blog Agrumen</p>
            <h2 className="font-headline font-black text-foreground tracking-tighter text-3xl">Tous les articles.</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-headline text-xs font-bold px-4 py-2 rounded-full transition-all ${
                  activeCategory === cat ? "bg-foreground text-white" : "border border-border/40 text-on-surface-variant"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRILLE ARTICLES — layout mixte ── */}
      <section className="px-6 md:px-14 py-14">
        <div className="mx-auto max-w-[1200px]">
          {filtered.length > 0 ? (
            <>
              {/* Premier article en grand */}
              {filtered[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <Link to={`/blog/${filtered[0].slug}`} className="group grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-border/20 bg-surface-container-lowest">
                    <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
                      <img src={filtered[0].image} alt={filtered[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <span className={`inline-flex font-headline text-[10px] font-bold px-2.5 py-0.5 rounded-full border w-fit mb-4 ${CATEGORY_COLORS[filtered[0].category] || ""}`}>{filtered[0].category}</span>
                      <h3 className="font-headline font-black text-foreground tracking-tight leading-tight mb-4" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>{filtered[0].title}</h3>
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6">{filtered[0].excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {filtered[0].author.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-headline text-xs font-bold text-foreground">{filtered[0].author.name}</p>
                            <p className="font-body text-[10px] text-on-surface-variant">{filtered[0].date} · {filtered[0].readTime}</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-foreground/30 text-xl transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Reste en grille 3 colonnes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.slice(1).map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link to={`/blog/${article.slug}`} className="group block rounded-2xl overflow-hidden border border-border/20 bg-surface-container-lowest h-full">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                      </div>
                      <div className="p-6">
                        <span className={`inline-flex font-headline text-[10px] font-bold px-2.5 py-0.5 rounded-full border mb-3 ${CATEGORY_COLORS[article.category] || ""}`}>{article.category}</span>
                        <h3 className="font-headline font-extrabold text-base text-foreground tracking-tight leading-snug mb-3">{article.title}</h3>
                        <p className="font-body text-xs text-on-surface-variant leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-border/15">
                          <p className="font-body text-[10px] text-on-surface-variant">{article.author.name} · {article.date}</p>
                          <div className="flex items-center gap-1 text-on-surface-variant/50">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span className="font-body text-[10px]">{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-24 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 block mb-4">article</span>
              <p className="font-body text-sm text-on-surface-variant">Aucun article dans cette catégorie.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="px-6 md:px-14 py-20 border-t border-border/20">
        <div className="mx-auto max-w-[1200px]">
          <div className="rounded-3xl bg-[#0a0a0a] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="relative p-10 md:p-14 flex flex-col justify-center">
              <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="relative z-10">
                <span className="material-symbols-outlined text-emerald-400 text-3xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                <h3 className="font-headline font-black text-white tracking-tighter leading-none mb-3" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}>
                  L'actualité agricole<br />dans votre boîte mail.
                </h3>
                <p className="font-body text-sm text-white/45 mb-8 max-w-sm">Nos meilleurs articles, portraits de producteurs et analyses de marché chaque semaine.</p>
                <div className="flex gap-3">
                  <input type="email" placeholder="votre@email.com"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/8 border border-white/10 font-body text-sm text-white placeholder-white/25 outline-none focus:border-white/30 transition-all" />
                  <button className="px-6 py-3 bg-white text-foreground font-headline font-bold text-sm rounded-xl whitespace-nowrap">S'abonner</button>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden hidden lg:block" style={{ minHeight: "320px" }}>
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop&auto=format"
                alt="Agriculture sénégalaise"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA producteur ── */}
      <section className="px-6 md:px-14 py-20">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3">Vous êtes producteur ?</p>
            <h2 className="font-headline font-black text-foreground tracking-tighter leading-none" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}>
              Rejoignez les 340<br />producteurs Agrumen.
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-wrap gap-4 lg:justify-end">
            <Link to="/devenir-partenaire" className="inline-flex items-center gap-2 bg-foreground text-white font-headline font-bold text-sm px-7 py-4 rounded-xl">
              <span className="material-symbols-outlined text-sm">agriculture</span>
              Devenir partenaire
            </Link>
            <Link to="/nos-engagements" className="inline-flex items-center gap-2 border border-border/40 text-on-surface-variant font-headline font-bold text-sm px-7 py-4 rounded-xl">
              Nos engagements
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
