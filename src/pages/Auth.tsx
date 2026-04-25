import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  const { signUp, signIn, isAdmin } = useAuth();
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

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left visual panel */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-primary/30" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="text-3xl font-headline font-extrabold text-white tracking-tighter">
            Agrumen
          </Link>
          <div>
            <h2 className="text-4xl lg:text-5xl font-headline font-extrabold text-white tracking-tighter leading-[0.95] mb-4">
              Du champ<br />à votre table.
            </h2>
            <p className="text-white/60 text-lg font-body max-w-md">
              Produits frais, locaux et sans intermédiaires. Rejoignez la communauté Agrumen.
            </p>
          </div>
          <div className="flex items-center gap-6">
            {["eco", "verified", "local_shipping"].map(icon => (
              <div key={icon} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-lg">{icon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="md:hidden px-6 pt-6 pb-2 flex items-center justify-between">
          <Link to="/" className="text-2xl font-headline font-extrabold text-foreground tracking-tighter">
            Agrumen
          </Link>
          <Link to="/" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter">
                {isLogin ? "Bon retour !" : "Créer un compte"}
              </h1>
              <p className="text-on-surface-variant text-sm mt-2 font-body">
                {isLogin ? "Connectez-vous pour accéder au marché" : "Rejoignez la communauté Agrumen"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">
                    Nom complet
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">person</span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface-container-lowest border border-border/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      placeholder="Prénom et Nom"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">
                  Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface-container-lowest border border-border/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block">
                  Mot de passe
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">lock</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-surface-container-lowest border border-border/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-full font-headline font-extrabold text-base hover:scale-[0.97] active:scale-95 transition-transform disabled:opacity-50 shadow-lg mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    Chargement...
                  </span>
                ) : isLogin ? "Se connecter" : "Créer mon compte"}
              </button>
            </form>

            <p className="text-center text-sm text-on-surface-variant mt-8">
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
              <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-bold ml-1 hover:underline">
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
