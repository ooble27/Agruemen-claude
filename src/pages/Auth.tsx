import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=320&h=420&fit=crop&auto=format", alt: "Mangues", rot: -5 },
  { src: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=320&h=420&fit=crop&auto=format", alt: "Ananas", rot: 3 },
  { src: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=320&h=420&fit=crop&auto=format", alt: "Pastèque", rot: -2 },
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success("Connexion réussie !");
        navigate(email.toLowerCase() === "mohalaval4@gmail.com" ? "/admin" : "/marche");
      } else {
        await signUp(email, password, fullName);
        toast.success("Compte créé ! Vérifiez votre email pour confirmer.");
      }
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (login: boolean) => {
    setIsLogin(login);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return (
    <div className="min-h-screen flex">

      {/* ══ Left: Visual panel — desktop only ══ */}
      <div
        className="hidden lg:flex lg:w-[48%] relative overflow-hidden"
        style={{
          background: "#FAFAF7",
          backgroundImage: "radial-gradient(circle, #dde3ec 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        {/* Gradient fades */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 30% 20%, rgba(0,0,0,0.02) 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-56"
          style={{ background: "linear-gradient(to top, #FAFAF7 20%, transparent)" }} />

        <div className="relative z-10 flex flex-col h-full p-12">

          {/* Logo */}
          <Link to="/">
            <img src="/logo-mamakaasa.png" alt="Mamakaasa" className="h-16 w-auto" />
          </Link>

          {/* Center text */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-headline font-black text-foreground tracking-[-0.045em] leading-[0.9] mb-5"
              style={{ fontSize: "clamp(2.8rem, 5vw, 4.2rem)" }}
            >
              Du Champ<br />à Votre Table.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="font-body text-on-surface-variant text-base leading-relaxed max-w-xs mb-8"
            >
              Produits frais, locaux et sans intermédiaires. Rejoignez la communauté Mamakaasa.
            </motion.p>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="space-y-2 mb-12"
            >
              {[
                "500+ producteurs partenaires",
                "14 régions du Sénégal",
                "Livraison en 24h à Dakar",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-body text-sm text-on-surface-variant">{t}</span>
                </div>
              ))}
            </motion.div>

            {/* Inclined photos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="flex items-end gap-3"
            >
              {PHOTOS.map((img, i) => (
                <div
                  key={img.alt}
                  className="overflow-hidden rounded-xl border border-black/10"
                  style={{
                    width: 148,
                    height: 195,
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

          <p className="font-body text-[11px] text-on-surface-variant/40">© 2025 Mamakaasa · Dakar, Sénégal</p>
        </div>
      </div>

      {/* ══ Right: Form panel ══ */}
      <div className="flex-1 flex flex-col bg-white">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-8 pb-4">
          <Link to="/" className="font-headline font-extrabold text-xl text-foreground tracking-tighter">
            Mamakaasa
          </Link>
          <Link to="/" className="w-9 h-9 rounded-md bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">close</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >

            {/* Desktop logo */}
            <div className="hidden lg:block mb-10">
              <Link to="/">
                <img src="/logo-mamakaasa.png" alt="Mamakaasa" className="h-16 w-auto" />
              </Link>
            </div>

            {/* Tab switcher */}
            <div className="flex bg-surface-container rounded-md p-1 mb-8">
              <button
                type="button"
                onClick={() => switchMode(true)}
                className={`flex-1 py-2.5 rounded-md font-headline text-sm font-bold transition-all duration-200 ${
                  isLogin ? "bg-foreground text-white" : "text-on-surface-variant"
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => switchMode(false)}
                className={`flex-1 py-2.5 rounded-md font-headline text-sm font-bold transition-all duration-200 ${
                  !isLogin ? "bg-foreground text-white" : "text-on-surface-variant"
                }`}
              >
                Créer un compte
              </button>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h1 className="font-headline font-extrabold text-2xl tracking-tighter">
                {isLogin ? "Bon retour !" : "Rejoindre Mamakaasa"}
              </h1>
              <p className="font-body text-on-surface-variant text-sm mt-1">
                {isLogin
                  ? "Connectez-vous pour accéder au marché"
                  : "Créez votre compte en quelques secondes"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    key="fullname"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <label className="text-[11px] font-headline font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 block">
                      Nom complet
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[18px]">person</span>
                      <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="Prénom et Nom"
                        required={!isLogin}
                        className="w-full pl-11 pr-4 py-3.5 rounded-md bg-surface-container-lowest border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-[11px] font-headline font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 block">
                  Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[18px]">mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-md bg-surface-container-lowest border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-headline font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 block">
                  Mot de passe
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[18px]">lock</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-11 pr-12 py-3.5 rounded-md bg-surface-container-lowest border border-border/40 font-body text-sm outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-foreground text-white py-4 rounded-md font-headline font-extrabold text-base active:scale-[0.98] transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    Chargement...
                  </>
                ) : isLogin ? "Se connecter" : "Créer mon compte"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/20 text-center">
              <Link
                to="/marche"
                className="inline-flex items-center gap-1.5 font-headline text-sm font-semibold text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                Continuer sans compte
              </Link>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
