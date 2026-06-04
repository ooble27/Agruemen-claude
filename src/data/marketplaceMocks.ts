import type { Category, Product as BaseProduct } from "@/types/database";

export type MarketProduct = BaseProduct & {
  shops: { name: string; seller_id: string } | null;
  categories: { name: string; icon: string | null } | null;
};

export type MockSellerProfile = {
  full_name: string;
  avatar_url: string | null;
  city: string | null;
  phone: string | null;
};

export type MockShopInfo = {
  name: string;
  seller_id: string;
  city: string | null;
  phone: string | null;
  location: string | null;
};

export type MockProduct = MarketProduct & {
  mockImages: string[];
  mockSellerProfile: MockSellerProfile;
  mockShop: MockShopInfo;
};

const normalizeCategoryValue = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

export const getCategoryKey = (value?: string | null) => {
  if (!value) return null;
  const normalized = normalizeCategoryValue(value).replace(/^cat-/, "");
  if (normalized.includes("fruit")) return "fruits";
  if (normalized.includes("legume")) return "legumes";
  if (normalized.includes("cereale") || normalized.includes("grain")) return "cereales";
  if (normalized.includes("tubercule")) return "tubercules";
  if (normalized.includes("epice") || normalized.includes("condiment")) return "epices";
  return normalized;
};

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-fruits", name: "Fruits", icon: "park", created_at: "" },
  { id: "cat-legumes", name: "Légumes", icon: "nutrition", created_at: "" },
  { id: "cat-cereales", name: "Céréales", icon: "grain", created_at: "" },
  { id: "cat-epices", name: "Épices & Condiments", icon: "local_fire_department", created_at: "" },
];

const MOCK_SELLERS: MockSellerProfile[] = [
  { full_name: "Mamakaasa Dakar", avatar_url: null, city: "Dakar", phone: "+221 77 000 00 00" },
  { full_name: "Mamakaasa Thiès", avatar_url: null, city: "Thiès", phone: "+221 78 111 11 11" },
  { full_name: "Mamakaasa Casamance", avatar_url: null, city: "Ziguinchor", phone: "+221 76 222 22 22" },
  { full_name: "Mamakaasa Nord", avatar_url: null, city: "Saint-Louis", phone: "+221 77 333 33 33" },
];

const MOCK_SHOPS: MockShopInfo[] = [
  { name: "Mamakaasa — Dakar", seller_id: "mamakaasa-1", city: "Dakar", phone: "+221 77 000 00 00", location: "Marché central, Dakar" },
  { name: "Mamakaasa — Thiès", seller_id: "mamakaasa-2", city: "Thiès", phone: "+221 78 111 11 11", location: "Route de Thiès" },
  { name: "Mamakaasa — Casamance", seller_id: "mamakaasa-3", city: "Ziguinchor", phone: "+221 76 222 22 22", location: "Ziguinchor centre" },
  { name: "Mamakaasa — Nord", seller_id: "mamakaasa-4", city: "Saint-Louis", phone: "+221 77 333 33 33", location: "Saint-Louis Sor" },
];

const createMockProduct = ({
  id, name, price, unit, categoryId, imageUrl, extraImages = [], description, stock = 24, sellerIdx = 0,
}: {
  id: string; name: string; price: number; unit: string; categoryId: string;
  imageUrl: string; extraImages?: string[]; description: string; stock?: number; sellerIdx?: number;
}): MockProduct => {
  const category = MOCK_CATEGORIES.find((item) => item.id === categoryId);
  const seller = MOCK_SELLERS[sellerIdx % MOCK_SELLERS.length];
  const shop = MOCK_SHOPS[sellerIdx % MOCK_SHOPS.length];
  return {
    id, name, price, unit,
    category_id: categoryId,
    shop_id: "mamakaasa-shop",
    image_url: imageUrl,
    description,
    stock,
    is_active: true,
    created_at: "",
    updated_at: "",
    shops: { name: shop.name, seller_id: shop.seller_id },
    categories: category ? { name: category.name, icon: category.icon } : null,
    mockImages: extraImages.length > 0 ? [imageUrl, ...extraImages] : [imageUrl],
    mockSellerProfile: seller,
    mockShop: shop,
  };
};

export const MOCK_PRODUCTS: MockProduct[] = [
  // ═══════════════ FRUITS ═══════════════
  createMockProduct({
    id: "m1", name: "Mangues Kent", price: 1500, unit: "le kg", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Mangues Kent sucrées de Casamance, chair fondante et juteuse. Idéales pour les smoothies, salades de fruits et desserts maison. Récoltées à maturité optimale.", stock: 22, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m2", name: "Banane Plantain", price: 500, unit: "le kg", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Banane plantain ferme et généreuse, parfaite pour l'alloco, les grillades ou une cuisson au four. Riche en glucides et vitamines.", stock: 35, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m3", name: "Pastèque", price: 1800, unit: "la pièce", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Pastèque fraîche et désaltérante, chair rouge sucrée et croquante. Sélectionnée pour sa taille généreuse, idéale pour les grandes tablées.", stock: 12, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m4", name: "Ananas Victoria", price: 1200, unit: "la pièce", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Ananas Victoria parfumé et bien sucré, moins acide que les autres variétés. Excellent nature, en jus ou grillé avec un filet de miel.", stock: 14, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m5", name: "Papaye", price: 800, unit: "la pièce", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Papaye mûre au goût doux et parfumé, riche en vitamines A et C. Parfaite au petit-déjeuner avec du citron vert ou en salade de fruits.", stock: 16, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m6", name: "Oranges", price: 700, unit: "le kg", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1547514701-42782101795e?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Oranges juteuses récoltées à maturité complète. Riches en vitamine C, parfaites pour jus maison, pâtisseries et consommation nature.", stock: 30, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m7", name: "Citron", price: 350, unit: "le kg", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Citron frais et juteux, indispensable pour marinades, sauces, bissap frais et boissons fraîches.", stock: 28, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m9", name: "Banane Douce", price: 350, unit: "le kg", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=600&h=600&fit=crop&auto=format",
    description: "Petites bananes douces et sucrées, idéales pour les enfants, smoothies et desserts rapides. Naturellement riches en potassium.", stock: 32, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m10", name: "Pomme Verte", price: 1000, unit: "le kg", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Pommes vertes croquantes avec une légère acidité rafraîchissante. Idéales pour snacks, tartes et salades de fruits croquantes.", stock: 20, sellerIdx: 3,
  }),
  createMockProduct({
    id: "m10b", name: "Fruit de la Passion", price: 1800, unit: "le kg", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1604495772376-9657f0035eb5?w=600&h=600&fit=crop&auto=format",
    description: "Fruit de la passion acidulé et intensément parfumé. Parfait pour jus, cocktails, vinaigrettes et pâtisseries exotiques.", stock: 9, sellerIdx: 2,
  }),

  // ═══════════════ LÉGUMES ═══════════════
  createMockProduct({
    id: "m12", name: "Oignons", price: 350, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1587049693270-e6518bb2e71f?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Oignons de cuisson polyvalents et parfumés. Base incontournable de la cuisine sénégalaise pour sauces, yassa, thiéboudiène et grillades.", stock: 45, sellerIdx: 3,
  }),
  createMockProduct({
    id: "m13", name: "Piment Rouge", price: 600, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Piment rouge vif pour relever sauces, braisés et marinades. Intensité modérée à forte selon la quantité. Séchable pour conservation.", stock: 22, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m15", name: "Gombo", price: 450, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=600&h=600&fit=crop&auto=format",
    description: "Gombo tendre et bien frais pour sauces onctueuses, soupes et plats traditionnels sénégalais. Riche en fibres et vitamines.", stock: 18, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m16", name: "Carotte", price: 180, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Carottes douces et fermes, riches en bêta-carotène. Idéales pour jus, salades râpées, potages et cuissons lentes.", stock: 26, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m17", name: "Poivron / Simbad", price: 175, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1592441379333-cb8bbce7e2c1?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Poivrons rouges, jaunes et verts croquants. Parfaits pour sauces colorées, farces, salades et sautés rapides.", stock: 17, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m18", name: "Oignons", price: 350, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Concombre frais et croquant, très hydratant. Excellent en salade, sandwichs, gaspacho ou infusé dans l'eau fraîche.", stock: 20, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m19c", name: "Laitue", price: 250, unit: "la pièce", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&h=600&fit=crop&auto=format",
    description: "Laitue fraîche et bien pommée, feuilles croquantes. Idéale pour salades composées, wraps et sandwichs.", stock: 22, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m19d", name: "Persil / Coriandre", price: 300, unit: "la botte", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1506073881649-4e23be3e9ed0?w=600&h=600&fit=crop&auto=format",
    description: "Persil frais et aromatique, récolté le matin même. Indispensable pour garnir, assaisonner et décorer vos plats.", stock: 35, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m19e", name: "Chou Pomme", price: 350, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&h=600&fit=crop&auto=format",
    description: "Chou vert tendre et feuillu pour potages, sautés et accompagnements nutritifs. Riche en vitamines K et C.", stock: 19, sellerIdx: 2,
  }),

  // ─── Légumes supplémentaires (prix marché 03/06/2026) ───
  createMockProduct({
    id: "mv1", name: "Tomate Cobra", price: 260, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&h=600&fit=crop&auto=format",
    extraImages: ["https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=600&h=600&fit=crop&auto=format"],
    description: "Tomate Cobra fraîche, sac de 35 kg. Idéale pour sauces, thiéboudiène et plats mijotés.", stock: 30, sellerIdx: 0,
  }),
  createMockProduct({
    id: "mv2", name: "Tomate Ndiambe", price: 200, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=600&fit=crop&auto=format",
    description: "Tomate Ndiambe locale, ferme et parfumée. Sac de 35 kg, idéale pour jus et cuisine.", stock: 20, sellerIdx: 1,
  }),
  createMockProduct({
    id: "mv3", name: "Aubergine", price: 90, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1619472032094-eadb7ec6e4e3?w=600&h=600&fit=crop&auto=format",
    extraImages: ["https://images.unsplash.com/photo-1473593516076-3cd7527a2e63?w=600&h=600&fit=crop&auto=format"],
    description: "Aubergine fraîche en sac de 40–50 kg. Parfaite pour les sauces et plats mijotés traditionnels.", stock: 25, sellerIdx: 2,
  }),
  createMockProduct({
    id: "mv4", name: "Navet", price: 115, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1659261175192-5867be9c8484?w=600&h=600&fit=crop&auto=format",
    description: "Navet ordinaire frais, sac de 70 kg. Base du thiéboudiène et des plats en sauce.", stock: 30, sellerIdx: 0,
  }),
  createMockProduct({
    id: "mv5", name: "Pomme de Terre Locale", price: 340, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop&auto=format",
    extraImages: ["https://images.unsplash.com/photo-1508313880080-c4bef0730395?w=600&h=600&fit=crop&auto=format"],
    description: "Pomme de terre locale, sac de 25 kg. Sortie chambre froide, ferme et savoureuse.", stock: 20, sellerIdx: 1,
  }),
  createMockProduct({
    id: "mv6", name: "Pomme de Terre Rouge", price: 350, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1624897082742-c8c12fd5e5b0?w=600&h=600&fit=crop&auto=format",
    description: "Pomme de terre rouge importée, sac de 25 kg. Chair ferme, sortie chambre froide.", stock: 18, sellerIdx: 0,
  }),
  createMockProduct({
    id: "mv7", name: "Oignon Vert", price: 200, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=600&h=600&fit=crop&auto=format",
    description: "Oignon vert frais (nottò / fasse), vendu au kg. Parfait pour sauces et garnitures.", stock: 25, sellerIdx: 2,
  }),
  createMockProduct({
    id: "mv8", name: "Thioukly", price: 550, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=600&fit=crop&auto=format",
    description: "Thioukly frais, légume feuille local très apprécié en cuisine sénégalaise.", stock: 15, sellerIdx: 1,
  }),
  createMockProduct({
    id: "mv9", name: "Patate Wallo", price: 240, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1596097559115-1d43a35e5a89?w=600&h=600&fit=crop&auto=format",
    description: "Patate douce du Walo, sac de 75 kg. Chair fondante, riche et sucrée naturellement.", stock: 20, sellerIdx: 3,
  }),
  createMockProduct({
    id: "mv10", name: "Ñambi Wallo", price: 295, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1566842600175-97dca489844f?w=600&h=600&fit=crop&auto=format",
    description: "Ñambi du Walo, sac de 75 kg. Légume local très nutritif, base de nombreux plats traditionnels.", stock: 15, sellerIdx: 3,
  }),

  // ═══════════════ CÉRÉALES ═══════════════
  createMockProduct({
    id: "m21", name: "Riz Brisé", price: 500, unit: "le kg", categoryId: "cat-cereales",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1536304993881-460e32f50f09?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Riz brisé calibré de qualité supérieure pour thiéboudiène, riz au gras et plats du quotidien. Cuisson homogène et texture légère.", stock: 60, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m22", name: "Mil", price: 400, unit: "le kg", categoryId: "cat-cereales",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Mil local pour bouillies nourrissantes, couscous sénégalais et recettes traditionnelles. Riche en fer, magnésium et fibres.", stock: 42, sellerIdx: 3,
  }),
  createMockProduct({
    id: "m23", name: "Maïs", price: 350, unit: "le kg", categoryId: "cat-cereales",
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1601312283160-c76710690aca?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Maïs sec polyvalent pour grillades sur braise, farine maison et préparations traditionnelles. Source d'énergie naturelle.", stock: 38, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m24", name: "Fonio", price: 900, unit: "le kg", categoryId: "cat-cereales",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop&auto=format",
    description: "Fonio, la céréale ancestrale d'Afrique de l'Ouest. Sans gluten, riche en acides aminés essentiels. Cuit rapidement, texture légère et délicate.", stock: 18, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m26", name: "Sorgho", price: 450, unit: "le kg", categoryId: "cat-cereales",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=600&fit=crop&auto=format",
    description: "Sorgho traditionnel pour bouillie, couscous local et boissons fermentées artisanales. Résistant et nutritif.", stock: 30, sellerIdx: 3,
  }),

  // ═══════════════ ÉPICES & CONDIMENTS ═══════════════
  createMockProduct({
    id: "m41", name: "Gingembre Frais", price: 1500, unit: "le kg", categoryId: "cat-epices",
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1573414404571-a42cf6441617?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Gingembre frais puissant et aromatique. Indispensable pour jus détox, marinades, thé au gingembre et cuisine du quotidien. Racines charnues et juteuses.", stock: 15, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m42", name: "Curcuma", price: 3000, unit: "le kg", categoryId: "cat-epices",
    imageUrl: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1607198179219-cd8b835fdda7?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Curcuma frais ou séché aux propriétés anti-inflammatoires. Pour assaisonnements dorés, infusions bien-être et plats colorés.", stock: 10, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m43", name: "Piment de Cayenne", price: 2500, unit: "le kg", categoryId: "cat-epices",
    imageUrl: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&h=600&fit=crop&auto=format",
    description: "Piment de Cayenne séché et moulu, puissant et aromatique. Pour sauces piquantes, marinades et assaisonnements intenses.", stock: 12, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m46", name: "Noix de Muscade", price: 6000, unit: "le kg", categoryId: "cat-epices",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop&auto=format",
    description: "Noix de muscade entière à râper fraîchement pour gratins, béchamel et boissons chaudes. Arôme puissant et chaleureux.", stock: 6, sellerIdx: 1,
  }),
];

export const buildMarketCategories = (dbCategories: Category[]) => {
  const categoriesByKey = new Map<string, Category>();
  [...dbCategories, ...MOCK_CATEGORIES].forEach((category) => {
    const key = getCategoryKey(category.name) ?? category.id;
    if (!categoriesByKey.has(key)) categoriesByKey.set(key, category);
  });
  return Array.from(categoriesByKey.values());
};

export const findMockProduct = (id?: string | null) =>
  MOCK_PRODUCTS.find((product) => product.id === id) ?? null;

export const getMockRelatedProducts = (product: MockProduct, limit = 6) => {
  const categoryKey = getCategoryKey(product.categories?.name ?? product.category_id);
  return MOCK_PRODUCTS.filter((candidate) => {
    if (candidate.id === product.id) return false;
    return getCategoryKey(candidate.categories?.name ?? candidate.category_id) === categoryKey;
  }).slice(0, limit);
};

export const groupByCategory = (products: MarketProduct[]) => {
  const groups = new Map<string, { label: string; icon: string | null; products: MarketProduct[] }>();
  products.forEach((p) => {
    const key = getCategoryKey(p.categories?.name ?? p.category_id) ?? "autres";
    if (!groups.has(key)) {
      groups.set(key, { label: p.categories?.name ?? "Autres", icon: p.categories?.icon ?? null, products: [] });
    }
    groups.get(key)!.products.push(p);
  });
  return Array.from(groups.values());
};
