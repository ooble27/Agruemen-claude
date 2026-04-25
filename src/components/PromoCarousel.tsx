import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import watermelonImg from "@/assets/watermelon-promo.webp";
import papayaImg from "@/assets/papaya-promo.webp";
import vegetablesImg from "@/assets/vegetables-promo.webp";
import fruitsPromo from "@/assets/fruits-promo.webp";
import spicesImg from "@/assets/spices-promo.webp";
import deliveryImg from "@/assets/delivery-moto.png";

const banners = [
  {
    id: 1,
    bg: "bg-gradient-to-br from-[hsl(30,90%,55%)] to-[hsl(20,85%,48%)]",
    badge: "Saison 🍊",
    title: "Papayes & Mangues\ndu Terroir",
    cta: "Découvrir",
    link: "/marche?cat=fruits",
    image: papayaImg,
  },
  {
    id: 2,
    bg: "bg-gradient-to-br from-[hsl(150,45%,40%)] to-[hsl(160,50%,32%)]",
    badge: "Frais 🍉",
    title: "Pastèques\nJuteuses",
    cta: "Voir les fruits",
    link: "/marche?cat=fruits",
    image: watermelonImg,
  },
  {
    id: 3,
    bg: "bg-gradient-to-br from-[hsl(45,90%,52%)] to-[hsl(38,85%,45%)]",
    badgeColor: "bg-[hsl(30,60%,30%)]/80 text-white",
    titleColor: "text-[hsl(30,50%,15%)]",
    badge: "Promo 🔥",
    title: "Légumes Frais\nChaque Jour",
    cta: "Commander",
    link: "/marche?cat=legumes",
    image: vegetablesImg,
  },
  {
    id: 4,
    bg: "bg-gradient-to-br from-[hsl(78,50%,45%)] to-[hsl(85,45%,38%)]",
    badge: "Panier 🧺",
    title: "Produits Frais\ndu Marché",
    cta: "Voir tout",
    link: "/marche",
    image: fruitsPromo,
  },
  {
    id: 5,
    bg: "bg-gradient-to-br from-[hsl(355,65%,50%)] to-[hsl(340,60%,42%)]",
    badge: "Nouveau 🌶️",
    title: "Piments &\nÉpices Locales",
    cta: "Explorer",
    link: "/marche",
    image: spicesImg,
  },
  {
    id: 6,
    bg: "bg-inverse-surface",
    badge: "Livraison 🚚",
    title: "Livré Chez Vous\nen 24h",
    cta: "Commander",
    link: "/marche",
    image: deliveryImg,
    titleColor: "",
    badgeColor: "bg-primary-container/20 text-primary-container",
    ctaColor: "text-primary-container bg-primary-container/15",
  },
];

const PromoCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const itemWidth = el.firstElementChild?.clientWidth ?? 1;
    const gap = 12;
    const index = Math.round(scrollLeft / (itemWidth + gap));
    setActiveIndex(Math.min(index, banners.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const itemWidth = el.firstElementChild?.clientWidth ?? 0;
    const gap = 12;
    el.scrollTo({ left: index * (itemWidth + gap), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1"
      >
        {banners.map((banner, i) => {
          const isDelivery = banner.id === 6;
          const isLight = !!banner.titleColor && !isDelivery;
          return (
            <Link
              key={banner.id}
              to={banner.link}
              className={`shrink-0 w-[85%] md:w-[45%] lg:w-[30%] snap-start relative ${banner.bg} rounded-lg p-4 md:p-6 flex items-center overflow-hidden min-h-[120px] md:min-h-[180px] lg:min-h-[160px] group`}
            >
              <div className="flex-1 relative z-10">
                <span className={`inline-block ${banner.badgeColor || "bg-white/20 backdrop-blur-sm text-white"} text-[10px] md:text-xs font-bold uppercase px-2.5 py-1 rounded mb-2`}>
                  {banner.badge}
                </span>
                <h3 className={`${isDelivery ? "text-surface" : isLight ? banner.titleColor : "text-white"} font-headline font-bold text-base md:text-xl leading-tight mb-2 whitespace-pre-line`}>
                  {banner.title}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 ${banner.ctaColor || (isLight ? "text-[hsl(30,50%,15%)] bg-[hsl(30,60%,30%)]/15" : "text-white bg-white/20")} text-xs font-semibold px-3 py-1.5 rounded-md group-hover:opacity-80 transition-opacity`}
                >
                  {banner.cta}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
              <img
                src={banner.image}
                alt=""
                className={`${banner.id === 6 ? "w-40 md:w-52 lg:w-64 h-28 md:h-40 lg:h-52 -mr-1 -mb-3" : "w-28 md:w-40 lg:w-44 h-28 md:h-40 lg:h-44 -mr-2 -mb-4"} object-contain -mt-2 relative z-10 drop-shadow-lg`}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                width={512}
                height={512}
              />
            </Link>
          );
        })}
      </div>

      {/* Scroll indicator dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-6 bg-foreground" : "w-1.5 bg-foreground/20"
            }`}
            aria-label={`Bannière ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoCarousel;
