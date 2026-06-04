import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=280&h=360&fit=crop&auto=format", alt: "Mangues",   rot: -4 },
  { src: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=280&h=360&fit=crop&auto=format", alt: "Ananas",    rot: 3  },
  { src: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=280&h=360&fit=crop&auto=format", alt: "Pastèque", rot: -1.5 },
];

const TRUST = [
  { icon: "local_shipping", text: "Livraison en 24h à Dakar" },
  { icon: "eco",            text: "100 % produits locaux" },
  { icon: "verified",       text: "Qualité contrôlée" },
];

const Auth = () => {
  const [isLogin, setIsLogin]           = useState(true);
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [fullName, setFullName]         = useState("");
  const [loading, setLoading]           = useState(false);
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
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ══ Left panel — desktop only ══ */}
      <div className="hidden lg:flex lg:w-[46%] shrink-0 flex-col bg-white relative overflow-hidden"
        style={{ borderRight: "1px solid #f0ede6" }}
      >
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, #dde3ec 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

        <div className="relative z-10 flex flex-col h-full px-12 py-12">
          <Link to="/" className="shrink-0">
            <img src="/logo-mamakaasa.png" alt="Mamakaasa" className="h-12 w-auto" />
          </Link>

          <div className="flex-1 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <h2 className="font-headline font-black text-[#0A0A0A] tracking-[-0.045em] leading-[0.9] mb-5"
                style={{ fontSize: "clamp(2.6rem, 4vw, 3.8rem)" }}>
                Du Champ<br />à Votre<br />
                <span style={{ color: "#10b981" }}>Table.</span>
              </h2>

              <p className="font-body text-[#5a5a54] text-[15px] leading-relaxed max-w-xs mb-10">
                Mamakaasa livre des produits frais, sélectionnés directement auprès de 340 fournisseurs sénégalais.
              </p>

              <div className="space-y-3 mb-12">
                {TRUST.map((t) => (
                  <div key={t.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f5f2eb] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[15px]"
                        style={{ color: "#10b981", fontVariationSettings: "'FILL' 1" }}>{t.icon}</span>
                    </div>
                    <span className="font-body text-sm text-[#5a5a54]">{t.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }} className="flex items-end gap-3">
              {PHOTOS.map((img) => (
                <div key={img.alt} className="overflow-hidden rounded-xl border border-white/10 shrink-0"
                  style={{ width: 120, height: 158, transform: `rotate(${img.rot}deg)`, transformOrigin: "bottom center" }}>
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="eager" />
                </div>
              ))}
            </motion.div>
          </div>

          <p className="font-body text-[11px] text-[#9a9a92] mt-10">© 2025 Mamakaasa · Dakar, Sénégal</p>
        </div>
      </div>

      {/* ══ Right panel / Mobile full screen ══ */}
      <div className="flex-1 flex flex-col bg-white">

        {/* Mobile hero */}
        <div className="lg:hidden relative overflow-hidden" style={{ background: '#0F1F15' }}>
          <div className="absolute inset-0"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(16,185,129,0.18) 0%, transparent 55%)" }} />
          <div className="relative z-10 px-6 pt-14 pb-8 flex flex-col">
            <div className="flex items-center justify-between">
              <Link to="/">
                <img src="/logo-mamakaasa.png" alt="Mamakaasa" className="h-10 w-auto" />
              </Link>
              <Link to="/marche"
                className="flex items-center gap-1.5 font-headline text-[12px] font-semibold"
                style={{ color: 'rgba(255,255,255,0.75)' }}>
                <span className="material-symbols-outlined text-[14px]">storefront</span>
                Marché
              </Link>
            </div>
            <div className="mt-6">
              <h1 className="font-headline font-black text-white tracking-tight leading-tight"
                style={{ fontSize: "1.9rem" }}>
                {isLogin ? "Bon retour" : "Rejoignez-nous"}
              </h1>
              <p className="font-body text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {isLogin ? "Connectez-vous pour commander." : "Créez votre compte gratuitement."}
              </p>
            </div>
          </div>
        </div>

        {/* Form container */}
        <div className="flex-1 flex flex-col lg:items-center lg:justify-center px-6 py-8 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-[420px]"
          >

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center justify-between mb-10">
              <Link to="/" className="flex items-center gap-2 text-[#5a5a54] hover:text-[#0A0A0A] transition-colors">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span className="font-headline text-[13px] font-semibold">Accueil</span>
              </Link>
              <Link to="/marche"
                className="font-headline text-[13px] font-semibold text-[#5a5a54] hover:text-[#0A0A0A] transition-colors flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">storefront</span>
                Explorer sans compte
              </Link>
            </div>

            {/* Desktop heading */}
            <div className="hidden lg:block mb-8">
              <h1 className="font-headline font-black text-[#0A0A0A] tracking-tighter mb-1.5"
                style={{ fontSize: "clamp(1.7rem, 4vw, 2.1rem)" }}>
                {isLogin ? "Bon retour" : "Créer un compte"}
              </h1>
              <p className="font-body text-[#5a5a54] text-[14px]">
                {isLogin ? "Connectez-vous pour accéder au marché." : "Rejoignez Mamakaasa en quelques secondes."}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex mb-7 rounded-xl p-1 gap-1" style={{ background: "#f5f2eb" }}>
              {[
                { label: "Connexion",      login: true  },
                { label: "Créer un compte", login: false },
              ].map(({ label, login }) => (
                <button key={label} type="button" onClick={() => switchMode(login)}
                  className="flex-1 py-2.5 rounded-lg font-headline text-[13.5px] font-bold transition-all duration-200"
                  style={{
                    background: isLogin === login ? "#0A0A0A" : "transparent",
                    color: isLogin === login ? "#fff" : "#5a5a54",
                    boxShadow: isLogin === login ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence initial={false}>
                {!isLogin && (
                  <motion.div key="fullname"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
                    className="overflow-hidden">
                    <label className="block font-headline text-[11px] font-bold uppercase tracking-[0.14em] text-[#5a5a54] mb-1.5">
                      Nom complet
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A0A0A]/30 text-[18px]">person</span>
                      <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                        placeholder="Prénom et Nom" required={!isLogin}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl font-body text-sm text-[#0A0A0A] outline-none transition-all"
                        style={{ background: "#faf8f4", border: "1.5px solid #e8e4da" }}
                        onFocus={e => { e.currentTarget.style.border = "1.5px solid #10b981"; e.currentTarget.style.background = "#fff"; }}
                        onBlur={e => { e.currentTarget.style.border = "1.5px solid #e8e4da"; e.currentTarget.style.background = "#faf8f4"; }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block font-headline text-[11px] font-bold uppercase tracking-[0.14em] text-[#5a5a54] mb-1.5">
                  Adresse email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A0A0A]/30 text-[18px]">mail</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com" required autoComplete="email"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl font-body text-sm text-[#0A0A0A] outline-none transition-all"
                    style={{ background: "#faf8f4", border: "1.5px solid #e8e4da" }}
                    onFocus={e => { e.currentTarget.style.border = "1.5px solid #10b981"; e.currentTarget.style.background = "#fff"; }}
                    onBlur={e => { e.currentTarget.style.border = "1.5px solid #e8e4da"; e.currentTarget.style.background = "#faf8f4"; }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-headline text-[11px] font-bold uppercase tracking-[0.14em] text-[#5a5a54]">
                    Mot de passe
                  </label>
                  {isLogin && (
                    <span className="font-body text-[12px] text-[#5a5a54] cursor-pointer hover:text-[#0A0A0A] transition-colors">
                      Mot de passe oublié ?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A0A0A]/30 text-[18px]">lock</span>
                  <input type={showPassword ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    required minLength={6} autoComplete={isLogin ? "current-password" : "new-password"}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl font-body text-sm text-[#0A0A0A] outline-none transition-all"
                    style={{ background: "#faf8f4", border: "1.5px solid #e8e4da" }}
                    onFocus={e => { e.currentTarget.style.border = "1.5px solid #10b981"; e.currentTarget.style.background = "#fff"; }}
                    onBlur={e => { e.currentTarget.style.border = "1.5px solid #e8e4da"; e.currentTarget.style.background = "#faf8f4"; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0A0A0A]/30 hover:text-[#0A0A0A]/60 transition-colors" tabIndex={-1}>
                    <span className="material-symbols-outlined text-[18px]">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                {!isLogin && <p className="font-body text-[11px] text-[#9a9a92] mt-1.5">Minimum 6 caractères</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl font-headline font-extrabold text-[15px] text-white mt-2 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                style={{ background: "#10b981", boxShadow: "0 4px 20px rgba(16,185,129,0.28)" }}>
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    Chargement…
                  </>
                ) : isLogin ? (
                  <>Se connecter <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
                ) : (
                  <>Créer mon compte <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
                )}
              </button>
            </form>

            <div className="mt-7 pt-6 border-t flex items-center justify-center gap-2" style={{ borderColor: "#f0ede6" }}>
              <span className="material-symbols-outlined text-[#9a9a92] text-[16px]">storefront</span>
              <Link to="/marche"
                className="font-headline text-[13px] font-semibold text-[#5a5a54] hover:text-[#0A0A0A] transition-colors">
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
