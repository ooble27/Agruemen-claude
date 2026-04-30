import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { useEffect } from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";
import { getArticleBySlug, getRelatedArticles, ARTICLES } from "@/data/blogArticles";
import type { ArticleSection } from "@/data/blogArticles";

const CATEGORY_COLORS: Record<string, string> = {
  "Agrobusiness": "bg-amber-50 text-amber-700 border-amber-200",
  "Techniques agricoles": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Nutrition": "bg-blue-50 text-blue-700 border-blue-200",
  "Producteurs": "bg-orange-50 text-orange-700 border-orange-200",
  "Marché & économie": "bg-purple-50 text-purple-700 border-purple-200",
};

const SectionRenderer = ({ section }: { section: ArticleSection }) => {
  if (section.type === "paragraph") return (
    <p className="font-body text-base md:text-lg text-foreground/80 leading-relaxed mb-6">{section.text}</p>
  );
  if (section.type === "heading") return (
    <h2 className="font-headline font-extrabold text-foreground text-2xl tracking-tight mt-10 mb-4">{section.text}</h2>
  );
  if (section.type === "quote") return (
    <blockquote className="my-10 pl-6 border-l-4 border-emerald-400">
      <p className="font-headline font-bold text-foreground text-xl leading-snug mb-3">"{section.text}"</p>
      {section.author && <cite className="font-body text-sm text-on-surface-variant not-italic">— {section.author}</cite>}
    </blockquote>
  );
  if (section.type === "image") return (
    <figure className="my-10">
      <img src={section.src} alt={section.alt} className="w-full rounded-2xl object-cover" style={{ maxHeight: "480px" }} />
      {section.caption && <figcaption className="font-body text-xs text-on-surface-variant mt-3 text-center italic">{section.caption}</figcaption>}
    </figure>
  );
  if (section.type === "list") return (
    <ul className="my-6 space-y-3">
      {section.items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="material-symbols-outlined text-emerald-500 text-base mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span className="font-body text-base text-foreground/80 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
  return null;
};

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  const article = slug ? getArticleBySlug(slug) : undefined;

  useEffect(() => {
    if (slug && !article) navigate("/blog", { replace: true });
  }, [slug, article, navigate]);

  if (!article) return null;

  const related = getRelatedArticles(article, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Barre de lecture */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-emerald-500 z-[70] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <LandingNavbar />

      {/* ── HERO ARTICLE ── */}
      <section className="relative min-h-[70vh] flex items-end bg-[#0a0a0a] overflow-hidden">
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />

        <div className="relative z-10 w-full px-6 md:px-14 pb-14 pt-40">
          <div className="mx-auto max-w-[900px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <Link to="/blog" className="inline-flex items-center gap-1.5 text-white/50 font-headline text-xs font-bold transition-colors hover:text-white">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Blog
                </Link>
                <span className="text-white/20">/</span>
                <span className={`font-headline text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${CATEGORY_COLORS[article.category] || ""}`}>{article.category}</span>
              </div>
              <h1
                className="font-headline font-black text-white tracking-tighter leading-[0.92] mb-6"
                style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
              >
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white/20 border border-white/20 flex items-center justify-center text-white text-sm font-bold">
                    {article.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-headline text-xs font-bold text-white">{article.author.name}</p>
                    <p className="font-body text-[10px] text-white/45">{article.author.role}</p>
                  </div>
                </div>
                <span className="text-white/20">·</span>
                <p className="font-body text-xs text-white/45">{article.date}</p>
                <span className="text-white/20">·</span>
                <div className="flex items-center gap-1.5 text-white/45">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span className="font-body text-xs">{article.readTime} de lecture</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CONTENU DE L'ARTICLE ── */}
      <section className="px-6 md:px-14 py-16">
        <div className="mx-auto max-w-[720px]">
          {/* Chapeau / extrait en grand */}
          <p className="font-headline font-bold text-foreground text-xl md:text-2xl leading-relaxed mb-10 pb-10 border-b border-border/20">
            {article.excerpt}
          </p>

          {/* Corps de l'article */}
          <div>
            {article.content.map((section, i) => (
              <SectionRenderer key={i} section={section} />
            ))}
          </div>

          {/* Tags et partage */}
          <div className="mt-14 pt-8 border-t border-border/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {[article.category, "Sénégal", "Agriculture"].map(tag => (
                <span key={tag} className="font-headline text-[10px] font-bold text-on-surface-variant border border-border/30 rounded-full px-3 py-1">{tag}</span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant/50">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span className="font-body text-xs">{article.readTime} de lecture</span>
            </div>
          </div>

          {/* Auteur card */}
          <div className="mt-10 rounded-2xl bg-surface-container-lowest border border-border/20 p-6 flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-foreground flex items-center justify-center text-white text-xl font-black shrink-0">
              {article.author.name.charAt(0)}
            </div>
            <div>
              <p className="font-headline font-extrabold text-foreground">{article.author.name}</p>
              <p className="font-body text-sm text-on-surface-variant mb-2">{article.author.role} · Agrumen</p>
              <p className="font-body text-sm text-on-surface-variant/70 leading-relaxed">
                Contributeur régulier du Blog Agrumen, spécialisé dans l'agriculture sénégalaise, l'agrobusiness et le développement des filières locales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTICLES LIÉS ── */}
      {related.length > 0 && (
        <section className="px-6 md:px-14 py-16 border-t border-border/20 bg-surface-container-lowest/40">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-headline font-black text-foreground tracking-tight text-2xl">À lire aussi</h2>
              <Link to="/blog" className="font-headline text-sm font-bold text-on-surface-variant hover:text-foreground transition-colors flex items-center gap-1">
                Tous les articles
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map(a => (
                <Link key={a.id} to={`/blog/${a.slug}`} className="group block rounded-2xl overflow-hidden border border-border/20 bg-white">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={a.image} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                  </div>
                  <div className="p-5">
                    <span className={`inline-flex font-headline text-[10px] font-bold px-2.5 py-0.5 rounded-full border mb-3 ${CATEGORY_COLORS[a.category] || ""}`}>{a.category}</span>
                    <h3 className="font-headline font-extrabold text-sm text-foreground tracking-tight leading-snug mb-2 line-clamp-2">{a.title}</h3>
                    <p className="font-body text-xs text-on-surface-variant">{a.date} · {a.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA bas ── */}
      <section className="px-6 md:px-14 py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="rounded-3xl bg-[#0a0a0a] p-10 text-center relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
            <span className="material-symbols-outlined text-emerald-400 text-3xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
            <h3 className="font-headline font-black text-white tracking-tighter mb-3 text-2xl">Vous êtes producteur au Sénégal ?</h3>
            <p className="font-body text-white/45 text-sm mb-6 max-w-md mx-auto">Rejoignez 340+ producteurs qui vendent directement sur Agrumen. Inscription gratuite.</p>
            <Link to="/devenir-partenaire" className="inline-flex items-center gap-2 bg-white text-foreground font-headline font-bold text-sm px-7 py-3.5 rounded-xl">
              <span className="material-symbols-outlined text-sm">agriculture</span>
              Devenir partenaire
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogArticle;
