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
  { id: "cat-tubercules", name: "Tubercules", icon: "compost", created_at: "" },
  { id: "cat-epices", name: "Épices & Condiments", icon: "local_fire_department", created_at: "" },
];

const MOCK_SELLERS: MockSellerProfile[] = [
  { full_name: "Agrumen Dakar", avatar_url: null, city: "Dakar", phone: "+221 77 000 00 00" },
  { full_name: "Agrumen Thiès", avatar_url: null, city: "Thiès", phone: "+221 78 111 11 11" },
  { full_name: "Agrumen Casamance", avatar_url: null, city: "Ziguinchor", phone: "+221 76 222 22 22" },
  { full_name: "Agrumen Nord", avatar_url: null, city: "Saint-Louis", phone: "+221 77 333 33 33" },
];

const MOCK_SHOPS: MockShopInfo[] = [
  { name: "Agrumen — Dakar", seller_id: "agrumen-1", city: "Dakar", phone: "+221 77 000 00 00", location: "Marché central, Dakar" },
  { name: "Agrumen — Thiès", seller_id: "agrumen-2", city: "Thiès", phone: "+221 78 111 11 11", location: "Route de Thiès" },
  { name: "Agrumen — Casamance", seller_id: "agrumen-3", city: "Ziguinchor", phone: "+221 76 222 22 22", location: "Ziguinchor centre" },
  { name: "Agrumen — Nord", seller_id: "agrumen-4", city: "Saint-Louis", phone: "+221 77 333 33 33", location: "Saint-Louis Sor" },
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
    shop_id: "agrumen-shop",
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
    id: "m7", name: "Citron Vert", price: 300, unit: "le kg", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Citron vert intense et aromatique, indispensable pour marinades, sauces, bissap frais et boissons fraîches. Pressé sur vos plats pour rehausser les saveurs.", stock: 28, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m8", name: "Noix de Coco", price: 400, unit: "la pièce", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1629397685944-e8e24b7ad63e?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1596710404694-42d9c9c3d8e5?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Noix de coco fraîche à boire directement ou à râper pour vos plats tropicaux, desserts et laits végétaux maison.", stock: 18, sellerIdx: 2,
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
  createMockProduct({
    id: "m10c", name: "Goyave", price: 600, unit: "le kg", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=600&h=600&fit=crop&auto=format",
    description: "Goyave parfumée à chair rose ou blanche, très appréciée au Sénégal. Riche en vitamine C, excellente nature, en jus ou en confiture maison.", stock: 20, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m10d", name: "Grenade", price: 1400, unit: "la pièce", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1559181567-c3190ca9be5b?w=600&h=600&fit=crop&auto=format",
    description: "Grenade juteuse et antioxydante aux grains rubis éclatants. À déguster nature, en jus vitaminé ou en garniture sur salades et desserts.", stock: 11, sellerIdx: 3,
  }),
  createMockProduct({
    id: "m10e", name: "Mandarine", price: 900, unit: "le kg", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop&auto=format",
    description: "Mandarines douces et faciles à éplucher, idéales pour petits et grands. Parfaites nature ou en jus pour un concentré de vitamine C.", stock: 25, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m10f", name: "Melon Jaune", price: 1200, unit: "la pièce", categoryId: "cat-fruits",
    imageUrl: "https://images.unsplash.com/photo-1571575173927-34bcb73c4b16?w=600&h=600&fit=crop&auto=format",
    description: "Melon jaune sucré et désaltérant, chair fondante et parfumée. Idéal en entrée avec du jambon, en smoothie ou simplement frais au soleil sénégalais.", stock: 8, sellerIdx: 0,
  }),

  // ═══════════════ LÉGUMES ═══════════════
  createMockProduct({
    id: "m11", name: "Tomate Fraîche", price: 400, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Tomates fermes et juteuses des Niayes, idéales pour le thiéboudiène, sauces tomate maison et salades fraîches du quotidien.", stock: 40, sellerIdx: 0,
  }),
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
    id: "m14", name: "Aubergine", price: 450, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1613478881427-1c3607cea46f?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Aubergines charnues et brillantes pour yassa, ragoûts, gratins et cuissons au four. Chair tendre et savoureuse après cuisson.", stock: 20, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m15", name: "Gombo", price: 500, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=600&h=600&fit=crop&auto=format",
    description: "Gombo tendre et bien frais pour sauces onctueuses, soupes et plats traditionnels sénégalais. Riche en fibres et vitamines.", stock: 18, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m16", name: "Carotte", price: 400, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Carottes douces et fermes, riches en bêta-carotène. Idéales pour jus, salades râpées, potages et cuissons lentes.", stock: 26, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m17", name: "Poivron Coloré", price: 550, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1592441379333-cb8bbce7e2c1?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Poivrons rouges, jaunes et verts croquants. Parfaits pour sauces colorées, farces, salades et sautés rapides.", stock: 17, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m18", name: "Concombre", price: 300, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Concombre frais et croquant, très hydratant. Excellent en salade, sandwichs, gaspacho ou infusé dans l'eau fraîche.", stock: 20, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m19", name: "Ail Frais", price: 800, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2571?w=600&h=600&fit=crop&auto=format",
    description: "Ail frais et parfumé, tête bien pleine. Indispensable pour assaisonner sauces, marinades et plats mijotés sénégalais.", stock: 24, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m19b", name: "Haricots Verts", price: 650, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1567375698348-5d9d5ae10c4a?w=600&h=600&fit=crop&auto=format",
    description: "Haricots verts fins et croquants, récoltés jeunes. Parfaits pour accompagner viandes et poissons ou en salade tiède.", stock: 16, sellerIdx: 3,
  }),
  createMockProduct({
    id: "m19c", name: "Laitue", price: 250, unit: "la pièce", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&h=600&fit=crop&auto=format",
    description: "Laitue fraîche et bien pommée, feuilles croquantes. Idéale pour salades composées, wraps et sandwichs.", stock: 22, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m19d", name: "Persil Frais", price: 150, unit: "la botte", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1506073881649-4e23be3e9ed0?w=600&h=600&fit=crop&auto=format",
    description: "Persil frais et aromatique, récolté le matin même. Indispensable pour garnir, assaisonner et décorer vos plats.", stock: 35, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m19e", name: "Chou Vert", price: 350, unit: "la pièce", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&h=600&fit=crop&auto=format",
    description: "Chou vert tendre et feuillu pour potages, sautés et accompagnements nutritifs. Riche en vitamines K et C.", stock: 19, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m19f", name: "Betterave Rouge", price: 450, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&h=600&fit=crop&auto=format",
    description: "Betterave rouge terreuse et sucrée, riche en fer et en antioxydants. Excellente râpée en salade, en jus détox ou rôtie au four.", stock: 14, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m19g", name: "Courgette", price: 500, unit: "le kg", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600&h=600&fit=crop&auto=format",
    description: "Courgettes fermes et légères, idéales pour gratins, ratatouille, sautés rapides et soupes crémeuses. Faibles en calories, riches en eau.", stock: 18, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m19h", name: "Tomates Cerises", price: 700, unit: "la barquette", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=600&h=600&fit=crop&auto=format",
    description: "Tomates cerises sucrées et colorées, parfaites pour salades composées, apéritifs et garnitures. Récoltées en grappes à pleine maturité.", stock: 20, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m19i", name: "Potiron", price: 800, unit: "la pièce", categoryId: "cat-legumes",
    imageUrl: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=600&h=600&fit=crop&auto=format",
    description: "Potiron orangé charnu pour veloutés onctueux, tarte sucrée-salée, risotto et curry savoureux. Longue conservation et saveur douce.", stock: 7, sellerIdx: 2,
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
      "https://images.unsplash.com/photo-1601312283160-c76710690aca?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Mil local pour bouillies nourrissantes, couscous sénégalais et recettes traditionnelles. Riche en fer, magnésium et fibres.", stock: 42, sellerIdx: 3,
  }),
  createMockProduct({
    id: "m23", name: "Maïs", price: 350, unit: "le kg", categoryId: "cat-cereales",
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1490868372926-c18b78c91817?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Maïs sec polyvalent pour grillades sur braise, farine maison et préparations traditionnelles. Source d'énergie naturelle.", stock: 38, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m24", name: "Fonio", price: 900, unit: "le kg", categoryId: "cat-cereales",
    imageUrl: "https://images.unsplash.com/photo-1612548403247-aa2873e9422d?w=600&h=600&fit=crop&auto=format",
    description: "Fonio, la céréale ancestrale d'Afrique de l'Ouest. Sans gluten, riche en acides aminés essentiels. Cuit rapidement, texture légère et délicate.", stock: 18, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m25", name: "Arachide", price: 600, unit: "le kg", categoryId: "cat-cereales",
    imageUrl: "https://images.unsplash.com/photo-1567892320421-2f68a76e5d78?w=600&h=600&fit=crop&auto=format",
    description: "Arachides fraîches du Sénégal pour mafé, sauces, huile artisanale et snacks traditionnels. Base de la gastronomie sénégalaise.", stock: 45, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m26", name: "Sorgho", price: 450, unit: "le kg", categoryId: "cat-cereales",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=600&fit=crop&auto=format",
    description: "Sorgho traditionnel pour bouillie, couscous local et boissons fermentées artisanales. Résistant et nutritif.", stock: 30, sellerIdx: 3,
  }),
  createMockProduct({
    id: "m27", name: "Niébé", price: 550, unit: "le kg", categoryId: "cat-cereales",
    imageUrl: "https://images.unsplash.com/photo-1597551702741-3e9a44e5d16c?w=600&h=600&fit=crop&auto=format",
    description: "Niébé (haricot à œil noir) incontournable de la cuisine sénégalaise. Pour accara croustillants, thiébou niébé, soupes et ragoûts savoureux. Excellente source de protéines végétales.", stock: 35, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m28", name: "Sésame Blanc", price: 1200, unit: "le kg", categoryId: "cat-cereales",
    imageUrl: "https://images.unsplash.com/photo-1614963048223-99b4b9085c44?w=600&h=600&fit=crop&auto=format",
    description: "Graines de sésame blanc pour galettes, pain, confiseries traditionnelles et huile artisanale pressée à froid. Riche en calcium et bonnes graisses.", stock: 22, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m29", name: "Haricots Rouges", price: 650, unit: "le kg", categoryId: "cat-cereales",
    imageUrl: "https://images.unsplash.com/photo-1611244419377-b0a760c19719?w=600&h=600&fit=crop&auto=format",
    description: "Haricots rouges charnus pour ragoûts, chili et soupes consistantes. Riches en protéines et fibres, rassasiants et nourrissants.", stock: 28, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m30", name: "Lentilles Corail", price: 700, unit: "le kg", categoryId: "cat-cereales",
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=600&fit=crop&auto=format",
    description: "Lentilles corail fondantes à cuisson rapide. Parfaites pour dhal, soupes veloutées et purées nutritives. Sans trempage, prêtes en 15 minutes.", stock: 20, sellerIdx: 3,
  }),

  // ═══════════════ TUBERCULES ═══════════════
  createMockProduct({
    id: "m31", name: "Igname", price: 600, unit: "le kg", categoryId: "cat-tubercules",
    imageUrl: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1582515073548-c7f3e6e3a0bc?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Igname de belle taille, charnue et nourrissante. Pour purées veloutées, frites dorées, sauces et grands repas familiaux en semaine.", stock: 22, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m32", name: "Manioc", price: 350, unit: "le kg", categoryId: "cat-tubercules",
    imageUrl: "https://images.unsplash.com/photo-1598512752271-33f913a5af13?w=600&h=600&fit=crop&auto=format",
    description: "Manioc frais à chair blanche et ferme. Pour attiéké, foutou, chips maison et accompagnements traditionnels. Riche en glucides.", stock: 28, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m33", name: "Patate Douce", price: 450, unit: "le kg", categoryId: "cat-tubercules",
    imageUrl: "https://images.unsplash.com/photo-1596097635121-14b63b7a5f14?w=600&h=600&fit=crop&auto=format",
    description: "Patate douce orange, sucrée et crémeuse. Bouillie, en frites au four ou en purée, elle ravit petits et grands. Riche en vitamine A.", stock: 20, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m34", name: "Pomme de Terre", price: 400, unit: "le kg", categoryId: "cat-tubercules",
    imageUrl: "https://images.unsplash.com/photo-1508661119491-3e84d0395daf?w=600&h=600&fit=crop&auto=format",
    extraImages: [
      "https://images.unsplash.com/photo-1573167243872-43c6433b9d40?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Pommes de terre fermes à chair jaune pour frites croustillantes, ragoûts, gratins et purées oncteuses. Polyvalentes et incontournables.", stock: 35, sellerIdx: 3,
  }),
  createMockProduct({
    id: "m35", name: "Taro", price: 550, unit: "le kg", categoryId: "cat-tubercules",
    imageUrl: "https://images.unsplash.com/photo-1615485291278-d927ead15c67?w=600&h=600&fit=crop&auto=format",
    description: "Taro doux et farineux, tubercule traditionnel pour purées crémeuses, soupes onctueuses et accompagnements savoureux.", stock: 14, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m36", name: "Courge", price: 500, unit: "le kg", categoryId: "cat-tubercules",
    imageUrl: "https://images.unsplash.com/photo-1508169351866-777fc0047ac5?w=600&h=600&fit=crop&auto=format",
    description: "Courge charnue et généreuse pour soupes, purées dorées et plats mijotés. Naturellement sucrée, elle se marie parfaitement aux épices africaines.", stock: 12, sellerIdx: 1,
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
    imageUrl: "https://images.unsplash.com/photo-1616684982069-e5c9b9b24f96?w=600&h=600&fit=crop&auto=format",
    description: "Piment de Cayenne séché et moulu, puissant et aromatique. Pour sauces piquantes, marinades et assaisonnements intenses.", stock: 12, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m44", name: "Poivre Noir", price: 4000, unit: "le kg", categoryId: "cat-epices",
    imageUrl: "https://images.unsplash.com/photo-1599909533601-aa23a47b5fee?w=600&h=600&fit=crop&auto=format",
    description: "Poivre noir en grains entiers, fraîchement récolté. À moudre au moulin pour un arôme intense et piquant sur tous vos plats.", stock: 8, sellerIdx: 3,
  }),
  createMockProduct({
    id: "m45", name: "Cannelle", price: 3500, unit: "le kg", categoryId: "cat-epices",
    imageUrl: "https://images.unsplash.com/photo-1608198399988-341dee9f9cda?w=600&h=600&fit=crop&auto=format",
    description: "Bâtons de cannelle aromatiques pour café Touba, thé, desserts et plats sucrés-salés. Parfum chaud et réconfortant.", stock: 11, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m46", name: "Noix de Muscade", price: 6000, unit: "le kg", categoryId: "cat-epices",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop&auto=format",
    description: "Noix de muscade entière à râper fraîchement pour gratins, béchamel et boissons chaudes. Arôme puissant et chaleureux.", stock: 6, sellerIdx: 1,
  }),
  createMockProduct({
    id: "m47", name: "Clous de Girofle", price: 5500, unit: "le kg", categoryId: "cat-epices",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop&auto=format",
    description: "Clous de girofle entiers pour café Touba, thé des îles, marinades et plats mijotés. Parfum intense et légèrement anesthésiant.", stock: 7, sellerIdx: 2,
  }),
  createMockProduct({
    id: "m48", name: "Cumin", price: 2800, unit: "le kg", categoryId: "cat-epices",
    imageUrl: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&h=600&fit=crop&auto=format",
    description: "Graines de cumin parfumées pour currys, mélanges d'épices, sauces et viandes grillées. Arôme terreux et chaleureux essentiel en cuisine africaine.", stock: 14, sellerIdx: 3,
  }),
  createMockProduct({
    id: "m49", name: "Laurier", price: 800, unit: "la botte", categoryId: "cat-epices",
    imageUrl: "https://images.unsplash.com/photo-1611684846033-5f9e3c60c4af?w=600&h=600&fit=crop&auto=format",
    description: "Feuilles de laurier séchées pour bouillons, sauces, ragoûts et marinades. Apportent une note herbacée subtile à tous vos plats mijotés.", stock: 30, sellerIdx: 0,
  }),
  createMockProduct({
    id: "m50", name: "Piment Dibi", price: 1800, unit: "le kg", categoryId: "cat-epices",
    imageUrl: "https://images.unsplash.com/photo-1563735399093-7a0ca4f94e42?w=600&h=600&fit=crop&auto=format",
    description: "Mélange d'épices typique du dibi sénégalais — poivre, piment, ail et herbes aromatiques. Idéal pour mariner viandes et poissons avant grillade.", stock: 16, sellerIdx: 1,
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
