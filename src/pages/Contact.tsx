import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/Footer";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=360&h=480&fit=crop&auto=format", alt: "Légumes frais", rot: -4 },
  { src: "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=360&h=480&fit=crop&auto=format", alt: "Marché", rot: 2 },
  { src: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=360&h=480&fit=crop&auto=format", alt: "Mangues", rot: -2 },
];

const CONTACT_INFO = [
  { icon: "location_on", label: "Adresse", value: "Dakar, Sénégal", sub: "Quartier Plateau" },
  { icon: "mail", label: "Email", value: "hello@agrumen.sn", sub: "Réponse sous 24h" },
  { icon: "schedule", label: "Horaires", value: "Lun – Sam", sub: "7h00 – 20h00" },
  { icon: "phone", label: "Téléphone", value: "+221 77 000 00 00", sub: "Support acheteurs" },
];

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
    <div className="relative min-h-screen bg-white">
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: "radial-gradient(circle, #dde3ec 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="relative z-[1]">
        <LandingNavbar />

        {/* ── Hero ── */}
        <section className="bg-[#0a0a0a] overflow-hidden">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 pt-36 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 min-w-0"
            >
              <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-3.5 py-1.5 mb-6">
                <span className="material-symbols-outlined text-emerald-400 text-sm">fiber_manual_record</span>
                <span className="font-headline text-[11px] font-bold text-white/70 uppercase tracking-widest">Contactez-nous</span>
              </div>
              <h1
                className="font-headline font-black text-white tracking-[-0.045em] leading-[0.9] mb-5"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
              >
                On est là<br />pour vous.
              </h1>
              <p className="font-body text-white/50 text-lg leading-relaxed max-w-sm mb-10">
                Une question, un problème avec une commande, ou envie de rejoindre l'équipe ?
                Écrivez-nous.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Acheteurs", "Producteurs", "Presse", "Partenariats"].map(tag => (
                  <span key={tag} className="font-headline text-xs font-bold text-white/40 border border-white/10 rounded-full px-3.5 py-1.5">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Photos side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="shrink-0 flex items-end gap-3 lg:gap-4 lg:pr-6"
            >
              {PHOTOS.map((img, i) => (
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

        {/* ── Contact form + info ── */}
        <section className="py-20 px-6 md:px-8">
          <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              <h2 className="font-headline font-extrabold text-2xl tracking-tighter text-foreground mb-1">Envoyez-nous un message</h2>
              <p className="font-body text-on-surface-variant text-sm mb-8">Nous répondons dans les 24 heures ouvrées.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Nom complet</label>
                    <input
                      type="text" required value={form.name} onChange={e => f("name", e.target.value)}
                      placeholder="Votre nom"
                      className="w-full px-4 py-3.5 rounded-md bg-surface-container-lowest border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Email</label>
                    <input
                      type="email" required value={form.email} onChange={e => f("email", e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3.5 rounded-md bg-surface-container-lowest border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Sujet</label>
                  <div className="relative">
                    <select
                      value={form.subject} onChange={e => f("subject", e.target.value)} required
                      className="w-full appearance-none px-4 py-3.5 rounded-md bg-surface-container-lowest border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option>Problème avec ma commande</option>
                      <option>Question sur la livraison</option>
                      <option>Devenir producteur partenaire</option>
                      <option>Presse & médias</option>
                      <option>Partenariat commercial</option>
                      <option>Autre</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">expand_more</span>
                  </div>
                </div>
                <div>
                  <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Message</label>
                  <textarea
                    required value={form.message} onChange={e => f("message", e.target.value)}
                    rows={6} placeholder="Décrivez votre demande en détail..."
                    className="w-full px-4 py-3.5 rounded-md bg-surface-container-lowest border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 resize-none transition-all"
                  />
                </div>
                <button
                  type="submit" disabled={sending}
                  className="flex items-center gap-2 bg-foreground text-white px-8 py-4 rounded-md font-headline font-bold text-sm disabled:opacity-50 transition-all"
                >
                  {sending ? (
                    <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span>Envoi en cours...</>
                  ) : (
                    <><span className="material-symbols-outlined text-base">send</span>Envoyer le message</>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <h2 className="font-headline font-extrabold text-2xl tracking-tighter text-foreground mb-1">Informations</h2>
              <p className="font-body text-on-surface-variant text-sm mb-8">Plusieurs façons de nous joindre.</p>

              <div className="space-y-4">
                {CONTACT_INFO.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-lowest border border-border/30"
                  >
                    <div className="w-10 h-10 rounded-md bg-foreground/5 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-foreground text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-0.5">{item.label}</p>
                      <p className="font-headline text-sm font-bold text-foreground">{item.value}</p>
                      <p className="font-body text-xs text-on-surface-variant mt-0.5">{item.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Dark card */}
              <div className="mt-6 p-6 rounded-xl bg-[#0a0a0a] text-white">
                <span className="material-symbols-outlined text-emerald-400 text-2xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
                <p className="font-headline font-bold text-base mb-1">Support acheteurs</p>
                <p className="font-body text-sm text-white/50 mb-4 leading-relaxed">
                  Pour toute question urgente concernant une commande en cours.
                </p>
                <Link to="/mes-commandes" className="inline-flex items-center gap-1.5 font-headline text-xs font-bold text-white border border-white/20 rounded-full px-4 py-2">
                  <span className="material-symbols-outlined text-sm">receipt_long</span>
                  Mes commandes
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Contact;
