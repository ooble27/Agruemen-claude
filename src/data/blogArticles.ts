export type ArticleSection =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "list"; items: string[] };

export interface Article {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: ArticleSection[];
  author: { name: string; role: string };
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

export const ARTICLES: Article[] = [
  {
    id: 1,
    slug: "agrobusiness-senegal-mutation",
    category: "Agrobusiness",
    featured: true,
    title: "L'agrobusiness au Sénégal : un secteur en pleine mutation",
    excerpt: "Le secteur agricole sénégalais représente 17% du PIB et emploie plus de la moitié de la population active. Découvrez comment la digitalisation transforme les chaînes de valeur.",
    author: { name: "Équipe Agrumen", role: "Rédaction" },
    date: "24 avril 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "Le secteur agricole sénégalais représente 17% du PIB national et emploie plus de 60% de la population active. Pourtant, pendant des décennies, les agriculteurs ont été les grands oubliés de la chaîne de valeur — percevant une fraction infime du prix final payé par le consommateur." },
      { type: "heading", text: "Un secteur historiquement sous-valorisé" },
      { type: "paragraph", text: "Dans la filière tomate au Sénégal, un producteur reçoit en moyenne 75 FCFA par kilogramme, alors que le consommateur dakarois paye 350 à 500 FCFA au marché. La différence — parfois 6 fois le prix producteur — est absorbée par une chaîne d'intermédiaires : collecteurs, grossistes, semi-grossistes, détaillants." },
      { type: "quote", text: "Ce n'est pas que les producteurs manquent de talent ou de travail. C'est que le système de distribution les a toujours défavorisés.", author: "Dr. Cheikh Diop, économiste agricole, ISRA Dakar" },
      { type: "heading", text: "La révolution numérique change la donne" },
      { type: "paragraph", text: "L'essor du mobile money (Wave, Orange Money) et la démocratisation des smartphones transforment structurellement ce secteur. Pour la première fois, un producteur à Thiès peut recevoir un paiement d'un acheteur à Dakar en 30 secondes, sans passer par aucun intermédiaire." },
      { type: "paragraph", text: "Des plateformes comme Agrumen, lancée en 2022, ont profité de cette infrastructure pour créer des marketplaces directes. Le résultat : les producteurs partenaires constatent en moyenne +40% de revenus dès la première année." },
      { type: "list", items: [
        "Suppression des intermédiaires entre champ et consommateur",
        "Paiement mobile immédiat et sécurisé (Wave, Orange Money)",
        "Traçabilité complète de la récolte à la livraison",
        "Données de marché en temps réel pour mieux planifier les cultures",
        "Formation et accompagnement via des agents terrain",
      ]},
      { type: "heading", text: "Perspectives 2026-2030" },
      { type: "paragraph", text: "Selon les projections du Ministère de l'Agriculture, le marché des produits frais au Sénégal atteindra 2 500 milliards FCFA en 2030. La digitalisation de seulement 20% de ce marché représente une opportunité de 500 milliards FCFA pour les plateformes qui sauront s'imposer dès maintenant." },
      { type: "image", src: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=600&fit=crop&auto=format", alt: "Producteur sénégalais", caption: "Un producteur partenaire Agrumen dans sa exploitation à Thiès" },
      { type: "paragraph", text: "La mutation est en marche. Les acteurs qui réussiront à s'adapter — producteurs, distributeurs, investisseurs — sont ceux qui comprennent que l'agriculture africaine n'est plus un secteur archaïque mais un marché d'avenir en pleine transformation numérique." },
    ],
  },
  {
    id: 2,
    slug: "maraichage-urbain-dakar",
    category: "Techniques agricoles",
    title: "Maraîchage urbain à Dakar : cultiver en ville, c'est possible",
    excerpt: "De plus en plus de Dakarois se lancent dans le maraîchage urbain. Techniques de culture en bac, choix des variétés, gestion de l'eau — tout ce qu'il faut savoir.",
    author: { name: "Aminata Diallo", role: "Agronome" },
    date: "20 avril 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "Dakar est l'une des villes les plus densément peuplées d'Afrique de l'Ouest. Avec 3,5 millions d'habitants sur une presqu'île de 550 km², l'espace est une ressource rare. Pourtant, un mouvement discret mais croissant transforme terrasses, cours et toits en potagers productifs." },
      { type: "heading", text: "Pourquoi cultiver en ville ?" },
      { type: "paragraph", text: "La réponse est à la fois économique et nutritionnelle. Un ménage dakarois consacre en moyenne 52% de son budget alimentaire aux fruits et légumes. Cultiver soi-même, même à petite échelle, peut réduire cette dépense de 20 à 30%." },
      { type: "quote", text: "J'ai commencé avec 4 bacs de 80 litres sur ma terrasse. En 3 mois, je produisais assez de tomates, laitues et piments pour couvrir les besoins de ma famille.", author: "Aïssatou Mbaye, Dakar-Plateau" },
      { type: "heading", text: "Les techniques adaptées au climat dakarois" },
      { type: "list", items: [
        "Culture en bac ou sac de culture : idéale pour les petits espaces, facile à gérer",
        "Hydroponie simplifiée : production sans sol, économe en eau",
        "Compostage urbain : valorisez vos déchets alimentaires en terreau",
        "Paillage : réduire l'évaporation de 60% par temps chaud",
        "Arrosage goutte-à-goutte bricolé : récupérateur d'eau + tuyaux percés",
      ]},
      { type: "heading", text: "Quelles variétés choisir ?" },
      { type: "paragraph", text: "Les variétés locales adaptées au climat sahélien sont les meilleures alliées du maraîcher urbain dakarois. Piments locaux, aubergines violettes, gombo, tomates cerise et laitues résistantes à la chaleur sont idéaux pour commencer." },
      { type: "image", src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=600&fit=crop&auto=format", alt: "Maraîchage urbain", caption: "Un potager urbain sur toit-terrasse à Dakar" },
      { type: "paragraph", text: "Le maraîchage urbain n'est pas qu'un hobby : c'est une réponse concrète aux défis de souveraineté alimentaire. À mesure que Dakar grandit, ces îlots de verdure joueront un rôle croissant dans l'alimentation de la ville." },
    ],
  },
  {
    id: 3,
    slug: "prix-legumes-dakar-fluctuations",
    category: "Marché & économie",
    title: "Prix des légumes à Dakar : comprendre les fluctuations saisonnières",
    excerpt: "Les prix des tomates, oignons et piments varient considérablement selon les saisons. Analyse des facteurs et conseils pour acheter au meilleur prix.",
    author: { name: "Moussa Sow", role: "Analyste marché" },
    date: "15 avril 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "Si vous faites vos courses au marché Tilène ou Thiaroye, vous avez forcément remarqué que les prix des légumes semblent varier presque chaque semaine. Ce phénomène, souvent vécu comme une injustice par les consommateurs, obéit en réalité à des logiques saisonnières bien précises." },
      { type: "heading", text: "Les deux grandes saisons agricoles" },
      { type: "paragraph", text: "Le Sénégal connaît deux grandes périodes de production maraîchère. La saison froide (novembre à mars) est la haute saison : températures basses, humidité modérée, rendements élevés. C'est là que les prix sont les plus bas. La saison chaude (avril à octobre) voit les rendements chuter et les prix grimper, parfois de 200 à 400%." },
      { type: "quote", text: "En décembre, la tomate est à 100 FCFA le kilo à Dakar. En juillet, la même tomate peut atteindre 600 FCFA. La différence, c'est juste le calendrier agricole.", author: "Ibrahima Fall, grossiste au marché Thiaroye" },
      { type: "list", items: [
        "Nov-Fév : bas prix (haute saison, pleine production Niayes et Casamance)",
        "Mar-Avr : prix stables avec légère hausse",
        "Mai-Juil : hausse marquée (fin de saison froide, début chaleur)",
        "Août-Oct : prix maximaux (faible production locale, importations)",
      ]},
      { type: "heading", text: "Comment acheter malin ?" },
      { type: "paragraph", text: "Achetez en grande quantité de novembre à mars et apprenez à conserver (séchage, congélation, fermentation). Avec Agrumen, vous achetez directement au producteur, ce qui lisse naturellement les prix en éliminant les intermédiaires." },
    ],
  },
  {
    id: 4,
    slug: "portrait-fatou-ba-maraichere",
    category: "Producteurs",
    title: "Portrait : Fatou Ba, maraîchère à Thiès qui a doublé ses revenus",
    excerpt: "Rencontre avec Fatou Ba, 38 ans, productrice de tomates qui a rejoint Agrumen il y a deux ans. Depuis, ses revenus ont augmenté de 45% et elle emploie 3 personnes.",
    author: { name: "Équipe Agrumen", role: "Rédaction" },
    date: "10 avril 2026",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "Il est 6h30 du matin à Thiès. Fatou Ba est déjà dans ses champs. Ses 2 hectares de tomates et d'aubergines brillent sous la rosée matinale. À 38 ans, cette mère de quatre enfants est devenue l'une des productrices les plus actives de la plateforme Agrumen." },
      { type: "heading", text: "Avant Agrumen : la galère des intermédiaires" },
      { type: "paragraph", text: "Pendant dix ans, Fatou a vendu sa production aux collecteurs qui venaient directement à la ferme. « Ils fixaient les prix eux-mêmes. Si je refusais, ils partaient — et ma récolte pourrissait. J'avais aucune alternative. » En 2023, elle gagnait en moyenne 180 000 FCFA par mois, à peine de quoi nourrir sa famille." },
      { type: "quote", text: "Quand un agent Agrumen m'a contactée en janvier 2024, j'étais sceptique. J'avais vu trop d'intermédiaires promettre monts et merveilles. Mais là, c'était différent : je fixais mes propres prix.", author: "Fatou Ba, productrice à Thiès" },
      { type: "heading", text: "Deux ans plus tard : une transformation totale" },
      { type: "paragraph", text: "Aujourd'hui, Fatou reçoit en moyenne 270 000 FCFA par mois — une hausse de 50%. Elle a embauché trois personnes pour l'aider à la récolte et à la préparation des commandes. Elle a agrandi son exploitation d'un demi-hectare." },
      { type: "list", items: [
        "+50% de revenus en 24 mois",
        "3 employés recrutés dans sa communauté",
        "+0,5 hectare d'exploitation",
        "Formation en gestion comptable via Agrumen Academy",
        "Accès au microcrédit agricole via les partenaires Agrumen",
      ]},
      { type: "image", src: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=600&fit=crop&auto=format", alt: "Fatou Ba dans ses champs", caption: "Fatou Ba dans son exploitation à Thiès, avril 2026" },
      { type: "paragraph", text: "Le message de Fatou aux autres productrices qui hésitent ? « N'attendez pas. Chaque mois que vous passez avec les collecteurs, c'est de l'argent que vous perdez. Rejoignez Agrumen et reprenez le contrôle de votre production. »" },
    ],
  },
  {
    id: 5,
    slug: "super-aliments-senegalais",
    category: "Nutrition",
    title: "Les super-aliments sénégalais que vous ignorez peut-être",
    excerpt: "Le baobab, le moringa, le fonio, le sésame... Le Sénégal regorge d'aliments aux propriétés nutritionnelles exceptionnelles.",
    author: { name: "Dr. Khadija Ndiaye", role: "Nutritionniste" },
    date: "5 avril 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "Pendant que le monde entier se passionne pour le quinoa péruvien et le goji tibétain, le Sénégal dispose d'un patrimoine alimentaire exceptionnel que beaucoup ne connaissent pas encore. Ces trésors locaux combinent valeurs nutritionnelles hors norme et adaptations parfaites au climat sahélien." },
      { type: "heading", text: "Le baobab : l'arbre à tout faire" },
      { type: "paragraph", text: "La pulpe de baobab contient 6 fois plus de vitamine C que l'orange, 2 fois plus de calcium que le lait et une concentration en antioxydants comparable aux superfruits les plus médiatisés. Disponible en poudre, elle s'intègre facilement dans les smoothies, les sauces et les desserts." },
      { type: "heading", text: "Le moringa : la feuille miracle" },
      { type: "paragraph", text: "Les feuilles de moringa contiennent 7 fois plus de vitamine C que l'orange, 4 fois plus de calcium que le lait, 4 fois plus de potassium que la banane. Cultivé naturellement dans toutes les régions du Sénégal, il pousse sans irrigation ni pesticides." },
      { type: "list", items: [
        "Baobab : vitamine C, calcium, fibres, antioxydants",
        "Moringa : protéines complètes, fer, vitamines A, B, C",
        "Fonio : gluten-free, fer, zinc, acides aminés essentiels",
        "Sésame : calcium, magnésium, acides gras oméga-6",
        "Néré (soumbala) : protéines fermentées, probiotiques naturels",
      ]},
      { type: "heading", text: "Comment les intégrer au quotidien ?" },
      { type: "paragraph", text: "La clé est de commencer petit. Une cuillère de poudre de baobab dans votre lakh matinal. Quelques feuilles de moringa séchées dans votre thiéboudienne. Le fonio en substitution du riz une fois par semaine. Ces petits gestes ont un impact nutritionnel considérable sur le long terme." },
    ],
  },
  {
    id: 6,
    slug: "chaine-du-froid-producteurs",
    category: "Techniques agricoles",
    title: "La chaîne du froid : comment préserver la fraîcheur de la récolte",
    excerpt: "30 à 40% des pertes post-récolte en Afrique subsaharienne sont dues à une mauvaise gestion de la température. Solutions pratiques pour les producteurs sénégalais.",
    author: { name: "Ibrahim Thiaw", role: "Expert logistique" },
    date: "1 avril 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "Un producteur qui perd 30% de sa récolte avant même de la vendre ne perd pas seulement de l'argent. Il perd du temps, de l'énergie, de l'eau, des engrais. Au Sénégal, les pertes post-récolte représentent environ 450 milliards FCFA par an — une somme colossale qui pourrait être éliminée avec les bonnes pratiques." },
      { type: "heading", text: "Pourquoi les produits se dégradent-ils si vite ?" },
      { type: "paragraph", text: "La chaleur est l'ennemi numéro un des produits frais. À 30°C, une tomate cueillie le matin peut être abîmée le soir même. La solution n'est pas forcément technologique : de simples ajustements dans la gestion post-récolte permettent de doubler la durée de conservation." },
      { type: "list", items: [
        "Récolter tôt le matin (température plus basse, moins de stress hydrique)",
        "Stocker à l'ombre immédiatement après la récolte",
        "Utiliser des cagettes aérées plutôt que des sacs fermés",
        "Humidifier légèrement les légumes feuilles pour ralentir la perte d'eau",
        "Trier et séparer les produits abîmés dès la récolte",
      ]},
      { type: "heading", text: "Les solutions low-cost qui fonctionnent" },
      { type: "paragraph", text: "Le système Zeer pot (pot-dans-pot avec du sable humide) permet de maintenir une température 10 à 15°C inférieure à l'ambiance extérieure — sans électricité. Une solution inventée en Inde, utilisée avec succès dans plusieurs régions du Sénégal." },
    ],
  },
  {
    id: 7,
    slug: "financement-agricole-senegal",
    category: "Agrobusiness",
    title: "Financement agricole au Sénégal : quelles options pour les petits producteurs ?",
    excerpt: "Microfinance, crédits agricoles, subventions de l'État, financement participatif — tour d'horizon des solutions disponibles.",
    author: { name: "Équipe Agrumen", role: "Rédaction" },
    date: "28 mars 2026",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "L'accès au financement est le principal frein au développement des exploitations agricoles sénégalaises. Selon une étude de la BOAD, 73% des petits producteurs n'ont jamais bénéficié d'un crédit formel. Pourtant, des solutions existent — encore faut-il les connaître." },
      { type: "heading", text: "Le crédit agricole classique" },
      { type: "paragraph", text: "La CNCAS (Caisse Nationale de Crédit Agricole du Sénégal) propose des prêts dédiés aux agriculteurs avec des taux préférentiels. Problème : les exigences de garantie (titre foncier, cautionnement) excluent de facto la majorité des petits producteurs." },
      { type: "heading", text: "Les IMF : une alternative accessible" },
      { type: "paragraph", text: "Les Institutions de Microfinance (IMF) comme CMS, PAMECAS ou MECAP proposent des crédits de campagne sans garantie foncière. Les montants sont plus modestes (100 000 à 2 millions FCFA) mais les procédures sont simplifiées et les délais courts." },
      { type: "list", items: [
        "CNCAS : crédits agricoles classiques, taux 7-12%, garantie requise",
        "IMF (CMS, PAMECAS) : microcrédits 100K-2M FCFA, sans garantie foncière",
        "Programme AGRISOLVE de l'État : subventions intrants (semences, engrais)",
        "Financement participatif (crowdfunding) : HelloAsso Sénégal, WeFarm",
        "Programme Agrumen Invest : accès au crédit via nos partenaires financiers",
      ]},
    ],
  },
  {
    id: 8,
    slug: "manger-local-saison",
    category: "Nutrition",
    title: "Manger local et de saison : les bénéfices pour la santé et la planète",
    excerpt: "Consommer des produits locaux et de saison réduit l'empreinte carbone, soutient les agriculteurs et apporte une meilleure qualité nutritionnelle.",
    author: { name: "Dr. Khadija Ndiaye", role: "Nutritionniste" },
    date: "22 mars 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "Un oignon importé des Pays-Bas a parcouru plus de 5 000 km avant d'arriver dans votre cuisine dakaroise. Une tomate sénégalaise de Thiès, elle, arrive chez vous en moins de 24 heures. La différence ne se lit pas seulement sur l'étiquette : elle se sent dans l'assiette et dans votre corps." },
      { type: "heading", text: "Valeur nutritionnelle : local gagne" },
      { type: "paragraph", text: "Les fruits et légumes commencent à perdre leurs nutriments dès le moment de la récolte. Après 48h, une tomate peut avoir perdu jusqu'à 30% de sa vitamine C. Après 5 jours de transport international et stockage en chambre froide, c'est 50-60%." },
      { type: "quote", text: "La tomate la plus nutritive, c'est celle qui vient d'être cueillie. Chaque heure compte.", author: "Dr. Khadija Ndiaye, nutritionniste" },
      { type: "list", items: [
        "Moins de nutriments perdus (transport court = consommation rapide après récolte)",
        "Moins de pesticides post-récolte (pas besoin de traitement pour le transport)",
        "Empreinte carbone réduite de 80% vs produit importé",
        "Soutien direct à l'économie locale et aux revenus des producteurs",
        "Saveurs plus intenses et authentiques",
      ]},
    ],
  },
];

export const getArticleBySlug = (slug: string) => ARTICLES.find(a => a.slug === slug);
export const getFeaturedArticle = () => ARTICLES.find(a => a.featured);
export const getRelatedArticles = (article: Article, count = 3) =>
  ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0, count).concat(
    ARTICLES.filter(a => a.id !== article.id && a.category !== article.category)
  ).slice(0, count);
