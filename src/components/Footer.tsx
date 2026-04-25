import { Link } from "react-router-dom";

const links = {
  Plateforme: [
    { label: "Marché", href: "/marche" },
    { label: "Mon Compte", href: "/mon-compte" },
    { label: "Mes Commandes", href: "/mes-commandes" },
    { label: "Panier", href: "#" },
  ],
  Acheteur: [
    { label: "Comment ça marche", href: "#comment" },
    { label: "Livraison & Zones", href: "#" },
    { label: "Paiement", href: "#" },
    { label: "Wishlist", href: "#" },
  ],
  Société: [
    { label: "Notre Mission", href: "#mission" },
    { label: "Producteurs", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Rejoindre Agrumen", href: "/auth" },
  ],
  Légal: [
    { label: "Confidentialité", href: "#" },
    { label: "CGU", href: "#" },
    { label: "Cookies", href: "#" },
    { label: "Mentions légales", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">

        {/* Top row */}
        <div className="grid grid-cols-1 gap-12 border-b border-white/8 py-14 md:grid-cols-5 md:gap-8">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" className="font-headline text-xl font-black tracking-tighter text-white">
              Agrumen
            </Link>
            <p className="mt-3 font-body text-sm leading-relaxed text-white/40">
              Le marché frais du Sénégal, directement dans votre poche.
            </p>
            <div className="mt-6 space-y-2">
              <p className="flex items-center gap-2 font-body text-xs text-white/30">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                Dakar, Sénégal
              </p>
              <p className="flex items-center gap-2 font-body text-xs text-white/30">
                <span className="material-symbols-outlined text-[14px]">mail</span>
                hello@agrumen.sn
              </p>
              <p className="flex items-center gap-2 font-body text-xs text-white/30">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                Lun–Sam · 7h–20h
              </p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="md:col-span-1">
              <h4 className="mb-5 font-headline text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                {title}
              </h4>
              <ul className="space-y-3.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="font-body text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="font-body text-xs text-white/25">
            © 2025 Agrumen Sénégal · L'Agronome Digital · Dakar, Sénégal
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-3">
            {["Wave", "Orange Money", "Free Money"].map((method) => (
              <span
                key={method}
                className="rounded border border-white/10 bg-white/5 px-2.5 py-1 font-headline text-[10px] font-bold text-white/40"
              >
                {method}
              </span>
            ))}
            <span className="rounded border border-white/10 bg-white/5 px-2.5 py-1 font-headline text-[10px] font-bold text-white/40">
              Visa / MC
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
