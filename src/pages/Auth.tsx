import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";

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

      {/* Left: Visual panel — desktop only */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-[#0b1c0d]">
        {/* Decorative orbs */}
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-emerald-700/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-[380px] h-[380px] rounded-full bg-emerald-900/35 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-lime-800/20 blur-2xl pointer-events-none" />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        {/* Thin diagonal lines accent */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "24px 24px" }}
        />

        {/* Big decorative leaf icon */}
        <div className="absolute bottom-16 right-10 opacity-[0.07] pointer-events-none select-none">
          <span className="material-symbols-outlined text-white" style={{ fontSize: "240px", fontVariationSettings: "'FILL' 1" }}>eco</span>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
          <Link to="/" className="font-headline font-extrabold text-2xl text-white tracking-tighter">
            Agrumen
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-md px-3 py-1.5 mb-6">
              <span className="material-symbols-outlined text-emerald-400 text-[14px]">fiber_manual_record</span>
              <span className="font-headline text-[11px] font-bold text-white/80 uppercase tracking-widest">Plateforme agricole</span>
            </div>
            <h2 className="font-headline font-extrabold text-5xl text-white tracking-tighter leading-[0.92] mb-5">
              Du champ<br />à votre table.
            </h2>
            <p className="font-body text-white/55 text-base leading-relaxed max-w-xs mb-10">
              Produits frais, locaux et sans intermédiaires. Rejoignez la communauté Agrumen.
            </p>
            <div className="space-y-3">
              {[
                { icon: "eco", label: "100% produits locaux", sub: "Directement des producteurs" },
                { icon: "verified", label: "Agriculteurs vérifiés", sub: "Qualité garantie" },
                { icon: "local_shipping", label: "Livraison le jour même", sub: "Partout à Dakar" },
              ].map(f => (
                <div key={f.icon} className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-md bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                  </div>
                  <div>
                    <p className="font-headline text-sm font-bold text-white/90">{f.label}</p>
                    <p className="font-body text-[11px] text-white/40">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="font-body text-[11px] text-white/20">© 2025 Agrumen · Dakar, Sénégal</p>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="flex-1 flex flex-col bg-white">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-8 pb-4">
          <Link to="/" className="font-headline font-extrabold text-xl text-foreground tracking-tighter">
            Agrumen
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
              <Link to="/" className="font-headline font-extrabold text-2xl text-foreground tracking-tighter">
                Agrumen
              </Link>
            </div>

            {/* Tab switcher */}
            <div className="flex bg-surface-container rounded-md p-1 mb-8">
              <button
                type="button"
                onClick={() => switchMode(true)}
                className={`flex-1 py-2.5 rounded-md font-headline text-sm font-bold transition-all duration-200 ${
                  isLogin
                    ? "bg-foreground text-white shadow-sm"
                    : "text-on-surface-variant hover:text-foreground"
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => switchMode(false)}
                className={`flex-1 py-2.5 rounded-md font-headline text-sm font-bold transition-all duration-200 ${
                  !isLogin
                    ? "bg-foreground text-white shadow-sm"
                    : "text-on-surface-variant hover:text-foreground"
                }`}
              >
                Créer un compte
              </button>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h1 className="font-headline font-extrabold text-2xl tracking-tighter">
                {isLogin ? "Bon retour !" : "Rejoindre Agrumen"}
              </h1>
              <p className="font-body text-on-surface-variant text-sm mt-1">
                {isLogin
                  ? "Connectez-vous pour accéder au marché"
                  : "Créez votre compte en quelques secondes"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full name — register only */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    key="fullname"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
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

              {/* Email */}
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

              {/* Password */}
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-foreground text-white py-4 rounded-md font-headline font-extrabold text-base hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    Chargement...
                  </>
                ) : isLogin ? "Se connecter" : "Créer mon compte"}
              </button>
            </form>

            {/* Continue without account */}
            <div className="mt-8 pt-6 border-t border-border/20 text-center">
              <Link
                to="/marche"
                className="inline-flex items-center gap-1.5 font-headline text-sm font-semibold text-on-surface-variant hover:text-foreground transition-colors"
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
