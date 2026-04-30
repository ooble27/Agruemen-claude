import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    toast.success("Message envoyé ! Nous vous répondons dans les 24h.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <LandingNavbar />

      {/* ── HERO SPLIT — typographie géante ── */}
      <section className="bg-[#0a0a0a] min-h-screen flex flex-col lg:flex-row overflow-hidden">

        {/* Panneau gauche : "Parlons." + info éditoriale */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between w-full lg:w-1/2 px-8 md:px-14 pt-36 pb-14 border-r border-white/6"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-3.5 py-1.5 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-headline text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Disponibles Lun–Sam · 7h–20h</span>
            </div>

            <h1
              className="font-headline font-black text-white tracking-[-0.05em] leading-[0.85] mb-10"
              style={{ fontSize: "clamp(4.5rem, 10vw, 10rem)" }}
            >
              Par-<br />lons.
            </h1>

            <p className="font-body text-white/40 text-lg leading-relaxed max-w-xs">
              Une question, un problème de commande, une envie de rejoindre l'équipe ? On vous répond dans les 24h.
            </p>
          </div>

          {/* Info contacts éditoriaux */}
          <div className="mt-14 space-y-0 divide-y divide-white/8">
            {[
              { label: "Email", value: "hello@agrumen.sn", icon: "mail" },
              { label: "Téléphone", value: "+1 418 261 9091", icon: "phone" },
              { label: "Adresse", value: "Dakar, Plateau · Sénégal", icon: "location_on" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-5 group">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-white/25 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  <div>
                    <p className="font-headline text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">{item.label}</p>
                    <p className="font-headline font-bold text-white text-sm mt-0.5">{item.value}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-white/15 text-base">arrow_forward</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-10 flex flex-wrap gap-2">
            {["Acheteurs", "Producteurs", "Presse", "Partenariats", "Carrières"].map(tag => (
              <span key={tag} className="font-headline text-[10px] font-bold text-white/30 border border-white/10 rounded-full px-3 py-1.5">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Panneau droit : formulaire */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-14 py-16 lg:py-24"
        >
          <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">Écrivez-nous</p>
          <h2 className="font-headline font-black text-white text-3xl tracking-tight mb-8">Envoyez un message.</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-headline text-[10px] font-bold uppercase tracking-[0.16em] text-white/30 mb-2 block">Nom complet</label>
                <input
                  type="text" required value={form.name} onChange={e => f("name", e.target.value)}
                  placeholder="Votre nom"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/6 border border-white/10 font-body text-sm text-white placeholder-white/25 outline-none focus:border-white/30 focus:bg-white/8 transition-all"
                />
              </div>
              <div>
                <label className="font-headline text-[10px] font-bold uppercase tracking-[0.16em] text-white/30 mb-2 block">Email</label>
                <input
                  type="email" required value={form.email} onChange={e => f("email", e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/6 border border-white/10 font-body text-sm text-white placeholder-white/25 outline-none focus:border-white/30 focus:bg-white/8 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="font-headline text-[10px] font-bold uppercase tracking-[0.16em] text-white/30 mb-2 block">Sujet</label>
              <div className="relative">
                <select
                  required value={form.subject} onChange={e => f("subject", e.target.value)}
                  className="w-full appearance-none px-4 py-3.5 rounded-xl bg-white/6 border border-white/10 font-body text-sm text-white outline-none focus:border-white/30 transition-all"
                >
                  <option value="" className="bg-[#0a0a0a]">Sélectionnez un sujet</option>
                  <option className="bg-[#0a0a0a]">Problème avec ma commande</option>
                  <option className="bg-[#0a0a0a]">Question sur la livraison</option>
                  <option className="bg-[#0a0a0a]">Devenir producteur partenaire</option>
                  <option className="bg-[#0a0a0a]">Presse & médias</option>
                  <option className="bg-[#0a0a0a]">Partenariat commercial</option>
                  <option className="bg-[#0a0a0a]">Carrières</option>
                  <option className="bg-[#0a0a0a]">Autre</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-lg">expand_more</span>
              </div>
            </div>
            <div>
              <label className="font-headline text-[10px] font-bold uppercase tracking-[0.16em] text-white/30 mb-2 block">Message</label>
              <textarea
                required value={form.message} onChange={e => f("message", e.target.value)}
                rows={5} placeholder="Décrivez votre demande..."
                className="w-full px-4 py-3.5 rounded-xl bg-white/6 border border-white/10 font-body text-sm text-white placeholder-white/25 outline-none focus:border-white/30 focus:bg-white/8 resize-none transition-all"
              />
            </div>
            <button
              type="submit" disabled={sending}
              className="w-full flex items-center justify-center gap-2 bg-white text-foreground px-8 py-4 rounded-xl font-headline font-bold text-sm disabled:opacity-50 transition-all"
            >
              {sending
                ? <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span>Envoi...</>
                : <><span className="material-symbols-outlined text-base">send</span>Envoyer le message</>
              }
            </button>
            <p className="font-body text-xs text-white/25 text-center">Réponse garantie dans les 24 heures ouvrées.</p>
          </form>
        </motion.div>
      </section>

      {/* ── STRIP SOMBRE avec chiffres ── */}
      <section className="bg-white border-b border-border/20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-14 py-14 grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border/20">
          {[
            { val: "< 24h", label: "Temps de réponse moyen", icon: "schedule" },
            { val: "7j/7", label: "Support disponible en saison haute", icon: "support_agent" },
            { val: "98%", label: "Taux de satisfaction client", icon: "star" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-5 px-8 py-8 first:pl-0 last:pr-0"
            >
              <span className="material-symbols-outlined text-foreground/15 text-3xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              <div>
                <p className="font-headline font-black text-foreground tracking-tighter text-4xl">{s.val}</p>
                <p className="font-body text-sm text-on-surface-variant mt-1">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA FAQ ── */}
      <section className="py-20 px-6 md:px-14">
        <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">Besoin d'une réponse rapide ?</p>
            <h2 className="font-headline font-black text-foreground tracking-tight text-3xl">Consultez notre FAQ.</h2>
          </div>
          <Link to="/faq" className="inline-flex items-center gap-2 bg-foreground text-white font-headline font-bold text-sm px-7 py-4 rounded-xl">
            <span className="material-symbols-outlined text-sm">help</span>
            Voir la FAQ
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
