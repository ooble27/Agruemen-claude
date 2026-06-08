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
    slug: "production-horticole-record-senegal-2025",
    category: "Agrobusiness",
    featured: true,
    title: "Le Sénégal franchit les 2,6 millions de tonnes de fruits et légumes en 2025",
    excerpt: "Pour la première fois de son histoire, la production horticole nationale a dépassé les 2,6 millions de tonnes lors de la campagne 2024-2025. Oignon, pomme de terre, tomate : les chiffres d'un secteur en plein essor.",
    author: { name: "Équipe Mamakaasa", role: "Rédaction" },
    date: "2 juin 2025",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1467453678174-768ec283a940?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "La campagne horticole 2024-2025 restera dans les annales de l'agriculture sénégalaise. Pour la première fois, la production nationale de fruits et légumes a franchi la barre symbolique des 2,6 millions de tonnes — un record historique qui traduit l'effort conjugué des producteurs, des politiques d'appui à l'horticulture et du Programme d'Accélération de la Cadence de l'Agriculture Sénégalaise (PRACAS)." },
      { type: "heading", text: "L'oignon et la pomme de terre, locomotives de la croissance" },
      { type: "paragraph", text: "Parmi les filières les plus dynamiques, l'oignon tire son épingle du jeu avec 493 287 tonnes récoltées, soit une progression de +23,7% par rapport à la campagne précédente. La pomme de terre affiche une performance encore plus spectaculaire : 211 000 tonnes produites, en hausse de +48,4%. Ces résultats confirment la pertinence des investissements réalisés dans la région des Niayes et dans la vallée du fleuve Sénégal." },
      { type: "quote", text: "La souveraineté alimentaire n'est pas un slogan, c'est un programme. Ces résultats prouvent que le Sénégal a les capacités de nourrir sa population depuis ses propres terres.", author: "Dr. Mabouba Diagne, Ministre de l'Agriculture, de la Souveraineté alimentaire et de l'Élevage" },
      { type: "heading", text: "19,7 milliards FCFA mobilisés pour les intrants horticoles" },
      { type: "paragraph", text: "Ces performances ne sont pas le fruit du hasard. L'État du Sénégal a mobilisé 19,7 milliards de FCFA pour la subvention des intrants horticoles — semences, engrais, produits phytosanitaires — permettant à des milliers de producteurs d'accéder à des inputs de qualité à prix réduit. Ce soutien massif a contribué à l'amélioration des rendements, notamment dans les zones irriguées de la vallée du fleuve." },
      { type: "list", items: [
        "Production totale 2024-2025 : 2,6 millions de tonnes (record historique)",
        "Oignon : 493 287 tonnes, +23,7% par rapport à 2023-2024",
        "Pomme de terre : 211 000 tonnes, +48,4%",
        "Exportations horticoles : +100% sur la dernière décennie",
        "19,7 milliards FCFA investis en subvention d'intrants",
      ]},
      { type: "heading", text: "Un secteur à fort potentiel d'exportation" },
      { type: "paragraph", text: "Au-delà de la sécurité alimentaire nationale, le secteur horticole sénégalais s'impose comme un acteur de l'export. Les haricots verts, la tomate cerise, la mangue et le melon constituent les premiers produits exportés vers les marchés européens. Sur la dernière décennie, les exportations horticoles ont progressé de plus de 100%, ouvrant la voie à une diversification des revenus pour les producteurs." },
      { type: "image", src: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&h=600&fit=crop&auto=format", alt: "Production horticole Sénégal", caption: "Récolte d'oignons dans la vallée du fleuve Sénégal — campagne 2024-2025" },
      { type: "paragraph", text: "Pour maintenir cette dynamique, le gouvernement mise sur le développement de l'irrigation, la structuration des filières et le soutien aux organisations de producteurs. L'objectif : faire de l'horticulture sénégalaise non seulement un pilier de la souveraineté alimentaire, mais aussi un vecteur de croissance économique et de création d'emplois ruraux." },
    ],
  },
  {
    id: 2,
    slug: "caravane-nationale-agroecologie-senegal-2025",
    category: "Techniques agricoles",
    title: "La Caravane nationale de l'agroécologie parcourt les 14 régions du Sénégal",
    excerpt: "Du 5 au 24 mai 2025, une caravane nationale a sillonné toutes les régions du Sénégal pour promouvoir la transition agroécologique. Retour sur une initiative portée par le Ministère de l'Agriculture et l'ISRA-BAME.",
    author: { name: "Équipe Mamakaasa", role: "Rédaction" },
    date: "28 mai 2025",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "Du 5 au 24 mai 2025, la Caravane Nationale de l'Agroécologie a traversé les 14 régions du Sénégal, portant un message simple mais essentiel : l'agriculture de demain ne peut pas reposer sur un recours croissant aux intrants chimiques. Lancée officiellement le 2 mai au Ministère de l'Agriculture, de la Souveraineté alimentaire et de l'Élevage (MASAE), la caravane a débuté son parcours dans les régions de Fatick et de Matam avant de rayonner dans tout le pays." },
      { type: "heading", text: "Le projet MAHDIA, cité en exemple" },
      { type: "paragraph", text: "Parmi les expériences mises en valeur lors de la caravane, le projet MAHDIA (Mécanismes pour une Agriculture Hydrique Durable et Intégrée en Afrique) a été particulièrement salué. Ce programme, porté par l'ISRA-BAME avec l'appui du CIRAD, propose une approche intégrée mêlant agroécologie et résilience hydrique : gestion raisonnée de l'eau, diversification des cultures, maintien de la fertilité des sols sans recours massif aux engrais chimiques." },
      { type: "quote", text: "L'agroécologie n'est pas un retour en arrière. C'est une science qui mobilise les savoirs locaux et les connaissances modernes pour concevoir des systèmes agricoles durables, productifs et résilients au changement climatique.", author: "Chercheur ISRA-BAME, lors de la caravane à Fatick, mai 2025" },
      { type: "heading", text: "AgroEco2050 : trois scénarios pour l'agriculture sénégalaise" },
      { type: "paragraph", text: "En parallèle de la caravane, l'ISRA-BAME et la FAO ont présenté les résultats de l'étude prospective AgroEco2050-Sénégal. Trois scénarios ont été construits pour l'agriculture sénégalaise à l'horizon 2050 : un scénario agroécologique (agriculture biologique, diversifiée, zéro intrant chimique), un scénario agro-industriel (intensification, mécanisation lourde, grandes exploitations) et un scénario de coexistence verte (combinant les deux approches)." },
      { type: "list", items: [
        "Scénario agroécologique : zéro intrant chimique, diversification, souveraineté alimentaire maximale",
        "Scénario agro-industriel : intensification, mécanisation, export prioritaire",
        "Scénario coexistence verte : hybride ciblant durabilité et compétitivité",
        "14 régions couvertes par la caravane du 5 au 24 mai 2025",
        "Dynamiques Locales de Transition Agroécologique (DyTAEL) créées dans plusieurs départements",
      ]},
      { type: "heading", text: "Un conseil agricole à repenser" },
      { type: "paragraph", text: "Pour l'ISRA, la réussite de la transition agroécologique passe inévitablement par une réforme du conseil agricole. Un atelier organisé en décembre 2024 en partenariat avec le CIRAD a posé les bases d'un nouveau modèle : des conseillers agricoles formés aux techniques agroécologiques, capables d'accompagner les producteurs dans la réduction de leur dépendance aux intrants chimiques tout en maintenant des rendements rentables." },
      { type: "paragraph", text: "L'ANCAR (Agence Nationale du Conseil Agricole et Rural) joue un rôle central dans ce processus, à travers ses Champs Écoles Paysans (CEP) — des groupes d'apprentissage de 25 à 30 producteurs qui expérimentent collectivement de nouvelles pratiques culturales et partagent leurs résultats en temps réel." },
    ],
  },
  {
    id: 3,
    slug: "campagne-arachidiere-2024-2025-resultats",
    category: "Marché & économie",
    title: "Campagne arachidière 2024-2025 : une baisse de 24% qui interroge les filières",
    excerpt: "La production nationale d'arachide a reculé à 795 585 tonnes pour la campagne 2024-2025, contre plus d'un million l'année précédente. Analyse des causes et perspectives pour la campagne 2025-2026.",
    author: { name: "Équipe Mamakaasa", role: "Rédaction" },
    date: "15 mai 2025",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1592483648228-b35146a4330c?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "Les résultats provisoires de la campagne agricole 2024-2025 publiés par la Direction de l'Analyse, de la Prévision et des Statistiques Agricoles (DAPSA) font état d'une baisse significative de la production arachidière nationale. Avec 795 585 tonnes récoltées, le Sénégal enregistre un recul de 24,8% par rapport à la campagne 2023-2024 (1 057 836 tonnes). Un chiffre qui interpelle l'ensemble de la filière." },
      { type: "heading", text: "Les céréales aussi en recul" },
      { type: "paragraph", text: "La tendance baissière ne se limite pas à l'arachide. La production céréalière provisoire 2024-2025 est évaluée à 2 310 018 tonnes, contre 3 056 139 tonnes la campagne précédente, soit une contraction de 24,4%. Mil, sorgho, maïs et riz local ont tous été affectés par des conditions climatiques difficiles — notamment une pluviométrie déficitaire dans certaines zones de production et une distribution tardive d'intrants dans d'autres." },
      { type: "quote", text: "Une mauvaise campagne ne remet pas en cause le potentiel de l'agriculture sénégalaise. Ce qui importe, c'est d'identifier les facteurs structurels et d'agir dessus : accès aux intrants à temps, conseil de proximité, gestion de l'eau.", author: "Analyste DAPSA, rapport provisoire campagne 2024-2025" },
      { type: "heading", text: "L'arachide, pilier de l'économie rurale" },
      { type: "paragraph", text: "L'arachide représente près de 40% de la production agricole sénégalaise et constitue la principale source de revenus pour des millions de ménages ruraux. La filière fait vivre les producteurs, les collecteurs, les huileries (dont la SONACOS et la SUNEOR) et génère une masse salariale considérable dans les zones productrices — Kaolack, Kaffrine, Fatick, Diourbel." },
      { type: "list", items: [
        "Production 2024-2025 : 795 585 tonnes (-24,8% vs 2023-2024)",
        "Production 2023-2024 : 1 057 836 tonnes (record récent)",
        "Céréales 2024-2025 : 2 310 018 tonnes (-24,4%)",
        "L'arachide = 40% de la production agricole nationale",
        "Prix d'achat du kg d'arachide maintenu pour 2025-2026",
      ]},
      { type: "heading", text: "La réponse de l'État pour 2025-2026" },
      { type: "paragraph", text: "Face à ces résultats, le Ministère de l'Agriculture a annoncé des mesures d'envergure pour la campagne 2025-2026. Dans le cadre du Programme de Mécanisation Agricole du Sénégal (PMAS 2026-2030), 1 900 cribles et 100 tarares agricoles sont mis à la disposition des producteurs et des opérateurs stockeurs semenciers, subventionnés à hauteur de 40%. À terme, le PMAS prévoit d'équiper les 1 200 points de collecte des graines d'arachide avec 20 000 cribles et 1 500 tarares." },
      { type: "paragraph", text: "Le prix d'achat au producteur est maintenu pour préserver la rentabilité des exploitations. Cette mesure vise à éviter que la baisse de production d'une campagne ne décourage les producteurs de replanter la saison suivante — un effet domino qui pourrait fragiliser durablement la filière." },
    ],
  },
  {
    id: 4,
    slug: "hello-tracteur-mecanisation-agricole-senegal",
    category: "Agrobusiness",
    title: "Hello Tracteur : la révolution de la mécanisation agricole s'enracine au Sénégal",
    excerpt: "Le programme Hello Tracteur, appuyé par le PADAER II, a remis 9 tracteurs complets à Tambacounda. Le PMAS 2026-2030 prévoit d'équiper 1 200 points de collecte à travers tout le pays.",
    author: { name: "Équipe Mamakaasa", role: "Rédaction" },
    date: "8 mai 2025",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1591086694430-49f0fd57a1ec?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "Dans la région de Tambacounda, à plus de 460 km de Dakar, une cérémonie symbolique a marqué une étape nouvelle dans la modernisation de l'agriculture sénégalaise. Neuf tracteurs agricoles complets ont été remis à des groupements de producteurs dans le cadre du programme Hello Tracteur, appuyé par le Projet d'Appui au Développement Agricole et à l'Entrepreneuriat Rural (PADAER II)." },
      { type: "heading", text: "Hello Tracteur : une plateforme numérique de mécanisation à la demande" },
      { type: "paragraph", text: "Hello Tracteur n'est pas simplement un programme de distribution de machines. C'est un modèle innovant qui combine technologie numérique et mécanisation agricole. Via une application mobile, les producteurs qui ne possèdent pas de tracteur peuvent localiser la machine la plus proche et la réserver pour leurs travaux de labour, de semis ou de récolte — à la manière d'un Uber du tracteur." },
      { type: "quote", text: "Avant, il fallait attendre des semaines pour avoir accès à un tracteur. Maintenant, je réserve via l'application et je suis servi en 48h. Le labour de mes 3 hectares ne prend plus qu'une journée.", author: "Producteur à Tambacounda, bénéficiaire du programme Hello Tracteur" },
      { type: "heading", text: "Le PMAS 2026-2030 : une ambition nationale" },
      { type: "paragraph", text: "Au-delà de Hello Tracteur, le gouvernement sénégalais a adopté le Programme de Mécanisation Agricole du Sénégal (PMAS) pour la période 2026-2030. L'objectif est d'équiper systématiquement les 1 200 points de collecte des graines d'arachide avec du matériel de traitement post-récolte : 20 000 cribles et 1 500 tarares agricoles sont prévus sur cinq ans." },
      { type: "list", items: [
        "9 tracteurs complets remis à Tambacounda via le PADAER II",
        "1 900 cribles et 100 tarares disponibles dès la campagne 2025-2026",
        "PMAS 2026-2030 : 20 000 cribles et 1 500 tarares à terme",
        "1 200 points de collecte d'arachide à équiper",
        "Subvention de 40% sur les équipements pour les producteurs",
      ]},
      { type: "heading", text: "Pourquoi la mécanisation change tout" },
      { type: "paragraph", text: "Dans les zones rurales sénégalaises, le labour manuel d'un hectare peut prendre jusqu'à 15 jours de travail. Un tracteur accomplit le même travail en quelques heures. L'impact est immédiat : les producteurs peuvent augmenter leurs surfaces cultivées, semer au bon moment (avant les premières pluies) et améliorer leurs rendements. Pour les femmes productrices — qui représentent une part croissante de la main-d'œuvre agricole — la mécanisation réduit drastiquement la pénibilité physique du travail." },
    ],
  },
  {
    id: 5,
    slug: "130-milliards-campagne-agricole-souverainete-alimentaire",
    category: "Marché & économie",
    title: "130 milliards FCFA pour la campagne 2025-2026 : le pari de la souveraineté alimentaire",
    excerpt: "Le gouvernement sénégalais a mobilisé 130 milliards FCFA via le Bulk Procurement Program pour la campagne 2025-2026. Résultat : 74 250 tonnes d'urée réceptionnées, au-delà des besoins estimés.",
    author: { name: "Équipe Mamakaasa", role: "Rédaction" },
    date: "20 avril 2025",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "La campagne agricole 2025-2026 démarre sous les meilleurs auspices du point de vue de l'approvisionnement en intrants. Au Port Autonome de Dakar, un troisième navire transportant 26 250 tonnes d'urée perlé a achevé son déchargement en juillet 2025, portant à 74 250 tonnes le total des engrais réceptionnés — soit bien au-delà des 60 000 tonnes estimées nécessaires pour couvrir les besoins nationaux." },
      { type: "heading", text: "Le Bulk Procurement Program : une rupture dans la gestion des engrais" },
      { type: "paragraph", text: "Ces volumes ont été rendus possibles grâce au Bulk Procurement Program (BPP), une nouvelle approche d'approvisionnement centralisé lancée sous l'impulsion du Président Bassirou Diomaye Faye et du Premier Ministre Ousmane Sonko. Doté d'un financement de 130 milliards de FCFA, le BPP permet à l'État de négocier directement avec les fournisseurs internationaux, contournant les intermédiaires et obtenant des prix significativement inférieurs à ceux du marché." },
      { type: "quote", text: "Pour la première fois, les engrais arrivent avant le début de la saison. C'est une révolution. Les années précédentes, beaucoup de producteurs semaient sans avoir reçu leurs intrants — et perdaient une bonne partie de leurs récoltes.", author: "Président d'une organisation paysanne, Kaolack" },
      { type: "heading", text: "Un investissement à fort rendement social" },
      { type: "paragraph", text: "L'engrais est le facteur limitant numéro un dans l'agriculture pluviale sénégalaise. Un accès à temps et à moindre coût peut améliorer les rendements céréaliers de 30 à 50%, selon les études de l'ISRA. Sur les céréales — mil, sorgho, maïs — l'apport d'urée au bon stade végétatif transforme radicalement la production d'une exploitation familiale." },
      { type: "list", items: [
        "130 milliards FCFA mobilisés via le Bulk Procurement Program (BPP)",
        "74 250 tonnes d'urée réceptionnées (vs 60 000 tonnes estimées nécessaires)",
        "3 navires déchargés en moins de 9 mois",
        "Réduction des coûts d'approvisionnement grâce à l'achat centralisé direct",
        "Amélioration des rendements céréaliers de 30 à 50% avec apport d'urée au bon stade",
      ]},
      { type: "heading", text: "Vers une souveraineté alimentaire réelle" },
      { type: "paragraph", text: "La souveraineté alimentaire — capacité d'un pays à produire lui-même les denrées de base pour sa population — est l'objectif affiché du gouvernement Faye-Sonko. Le Plan Sénégal 2050 prévoit une autosuffisance en riz, en mil et en maïs d'ici 2030. Pour y parvenir, l'accès aux intrants à temps et à prix abordable est une condition sine qua non. Le BPP est présenté comme le premier pilier de cette stratégie." },
    ],
  },
  {
    id: 6,
    slug: "niayes-poumon-maraicher-senegal",
    category: "Techniques agricoles",
    title: "Les Niayes : poumon maraîcher du Sénégal sous pression",
    excerpt: "La zone des Niayes assure près de 80% de la production nationale de légumes frais. Mais l'urbanisation galopante et l'intensification agricole menacent ce patrimoine unique. État des lieux.",
    author: { name: "Équipe Mamakaasa", role: "Rédaction" },
    date: "5 avril 2025",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "Nichés entre la côte atlantique et les premières dunes du Sahel, les Niayes forment un couloir de terres humides et fertiles qui s'étend de Dakar jusqu'à Saint-Louis. Ce microécosystème exceptionnel — caractérisé par une nappe phréatique affleurante, des sols riches et un climat tempéré — est le coeur battant du maraîchage sénégalais. La zone des Niayes assure à elle seule près de 80% de la production nationale de légumes frais." },
      { type: "heading", text: "Un grenier de légumes pour toute l'Afrique de l'Ouest" },
      { type: "paragraph", text: "Dans les Niayes, on produit des choux, des pommes de terre, des tomates, des carottes, des oignons, des laitues, des aubergines, des piments, du gombo et des navets. Près de 80% des exploitations maraîchères sont des fermes familiales de petite taille (0,5 à 1 hectare), gérées par des familles qui pratiquent ce métier de génération en génération. Ces producteurs alimentent quotidiennement les marchés de Dakar et exportent vers la sous-région." },
      { type: "quote", text: "Ma famille cultive ces terres depuis trois générations. Mon grand-père approvisionnait le marché Kermel. Aujourd'hui, j'envoie mes choux jusqu'en Mauritanie. Mais la pression des promoteurs immobiliers devient insupportable.", author: "Maraîcher, Pikine-Niayes, rencontré lors d'un reportage ANCAR 2024" },
      { type: "heading", text: "L'urbanisation, ennemi numéro un" },
      { type: "paragraph", text: "Dakar grandit à un rythme effréné. La pression démographique et la spéculation foncière rongent les terres maraîchères des Niayes par leur périphérie dakaroise. Des études menées par le GRET et la Direction de l'Horticulture (DHORT) alertent sur la perte de dizaines d'hectares de terres cultivables chaque année au profit de lotissements résidentiels et d'infrastructures." },
      { type: "list", items: [
        "Les Niayes : 80% de la production nationale de légumes frais",
        "80% des exploitations : fermes familiales de 0,5 à 1 hectare",
        "Cultures principales : chou, pomme de terre, tomate, carotte, oignon, aubergine",
        "Menace principale : urbanisation et spéculation foncière en zone périurbaine",
        "Deuxième menace : surexploitation de la nappe phréatique par l'irrigation intensive",
      ]},
      { type: "heading", text: "Vers une transition agroécologique dans les Niayes" },
      { type: "paragraph", text: "Face à ces menaces, des chercheurs du CIRAD et de l'ISRA travaillent sur la transition agroécologique du maraîchage dans la zone Sud des Niayes. L'objectif : réduire la dépendance aux pesticides et aux engrais minéraux sans compromettre la productivité. Des résultats encourageants ont été enregistrés avec des techniques comme la rotation des cultures, le compostage, les pièges à insectes et les biopesticides à base de plantes locales." },
    ],
  },
  {
    id: 7,
    slug: "super-aliments-senegalais-baobab-moringa-fonio",
    category: "Nutrition",
    title: "Baobab, moringa, fonio : les super-aliments sénégalais que la science redécouvre",
    excerpt: "La pulpe de baobab contient 6 fois plus de vitamine C que l'orange. Le moringa est surnommé « l'arbre miracle ». Et le fonio est l'une des céréales les plus nutritives d'Afrique. Retour sur les trésors nutritionnels du Sénégal.",
    author: { name: "Dr. Aminata Ndiaye", role: "Nutritionniste, ISRA" },
    date: "20 mars 2025",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "Pendant des siècles, les populations sénégalaises et sahéliennes ont su tirer parti d'une biodiversité alimentaire exceptionnelle pour nourrir leurs familles, même dans les conditions climatiques les plus difficiles. Aujourd'hui, la recherche agronomique internationale redécouvre ces aliments traditionnels et confirme ce que les grand-mères savaient depuis toujours : le baobab, le moringa et le fonio sont parmi les aliments les plus denses en nutriments qui existent." },
      { type: "heading", text: "Le baobab : l'arbre de vie" },
      { type: "paragraph", text: "L'Adansonia digitata — le baobab africain — est présent dans toutes les régions du Sénégal. Sa pulpe séchée, commercialisée sous forme de poudre, affiche des valeurs nutritionnelles hors normes : 6 fois plus de vitamine C que l'orange, 2 fois plus de calcium que le lait, une concentration en antioxydants et en fibres solubles parmi les plus élevées du règne végétal. L'Union européenne a autorisé la commercialisation de la pulpe de baobab comme novel food en 2008, ouvrant un marché d'export considérable." },
      { type: "heading", text: "Le moringa : une plante aux vertus multiples" },
      { type: "paragraph", text: "Moringa oleifera est cultivé naturellement dans toutes les régions du Sénégal, pousse sans irrigation intensive ni pesticides, et peut être récolté plusieurs fois par an. Ses feuilles séchées contiennent 7 fois plus de vitamine C que l'orange, 4 fois plus de calcium que le lait, 4 fois plus de potassium que la banane et deux fois plus de protéines que le yaourt. L'OMS et la FAO recommandent l'intégration du moringa dans les programmes de lutte contre la malnutrition en Afrique subsaharienne." },
      { type: "quote", text: "Le moringa est une réponse locale à un problème mondial. Au Sénégal, il pousse partout, coûte presque rien et peut combler des carences nutritionnelles sévères — notamment chez les enfants de moins de 5 ans.", author: "Dr. Aminata Ndiaye, ISRA, lors du séminaire Alimentation et Santé, Dakar 2024" },
      { type: "list", items: [
        "Baobab : 6× plus de vitamine C que l'orange, 2× plus de calcium que le lait",
        "Moringa : 7× vitamine C, 4× calcium, 4× potassium (vs fruits référence)",
        "Fonio : sans gluten, riche en fer, zinc et acides aminés essentiels",
        "Sésame : calcium, magnésium, acides gras oméga-6 et lignanes",
        "Néré (soumbala) : protéines fermentées, acides aminés essentiels, probiotiques naturels",
      ]},
      { type: "heading", text: "Le fonio, céréale de l'avenir ?" },
      { type: "paragraph", text: "Le fonio (Digitaria exilis) est l'une des plus anciennes céréales cultivées d'Afrique de l'Ouest. Naturellement sans gluten, à index glycémique bas et riche en acides aminés essentiels (méthionine, cystéine) que le riz et le maïs ne contiennent pas, il suscite un intérêt croissant dans les pays développés pour les régimes sans gluten et les diètes santé. Des entreprises agritech africaines ont fait du fonio un produit gourmet vendu dans les grands supermarchés — une opportunité d'export que les producteurs sénégalais commencent à saisir." },
      { type: "image", src: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&h=600&fit=crop&auto=format", alt: "Aliments locaux sénégalais", caption: "Le moringa, le baobab et le fonio : trois super-aliments sénégalais aux valeurs nutritionnelles exceptionnelles" },
      { type: "paragraph", text: "Intégrer ces aliments au quotidien n'exige pas de bouleverser ses habitudes. Une cuillère de poudre de baobab dans le lakh du matin, quelques feuilles de moringa séchées dans le thiéboudienne, le fonio en substitution partielle du riz une fois par semaine — ces petits gestes ont un impact nutritionnel considérable, notamment pour les enfants et les femmes enceintes." },
    ],
  },
  {
    id: 8,
    slug: "agritech-jeunes-entrepreneurs-senegal-2025",
    category: "Agrobusiness",
    title: "Agritech et jeunes entrepreneurs : la nouvelle vague agricole sénégalaise",
    excerpt: "Plus de 300 projets soumis, 5 startups primées : le AYuTe Africa Challenge 2025 révèle la vitalité de l'entrepreneuriat agricole des jeunes Sénégalais. DER/FJ, PSEJ, Agropoles : les dispositifs qui les soutiennent.",
    author: { name: "Équipe Mamakaasa", role: "Rédaction" },
    date: "10 mars 2025",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&h=900&fit=crop&auto=format",
    content: [
      { type: "paragraph", text: "Ils ont entre 20 et 35 ans, ont étudié l'agronomie, l'informatique ou le management, et ont décidé de revenir vers la terre — pas comme leurs aïeux, mais avec des drones, des applications mobiles et des business plans. Le mouvement des jeunes agri-entrepreneurs sénégalais prend de l'ampleur, porté par des concours, des incubateurs et des programmes de financement public dédiés." },
      { type: "heading", text: "AYuTe Africa Challenge 2025 : 300+ projets, 5 lauréats" },
      { type: "paragraph", text: "En avril 2025, Heifer International, en partenariat avec le Ministère de l'Agriculture, a organisé la 4ème édition du AYuTe Africa Challenge Sénégal. Plus de 300 projets ont été soumis entre mars et avril 2025 — un record. Cinq startups agritech ont été récompensées, couvrant des domaines aussi variés que la gestion de l'irrigation par capteurs IoT, la traçabilité des produits agricoles par QR code, la mise en relation directe producteurs-acheteurs et la production de biofertilisants à base de déchets organiques." },
      { type: "quote", text: "Quand j'ai dit à ma famille que je quittais mon poste en banque pour faire de l'agritech, ils ont cru que j'avais perdu la tête. Aujourd'hui, notre application aide 2 000 maraîchers des Niayes à vendre leur production directement aux restaurants de Dakar.", author: "Ibou Faye, co-fondateur d'une startup agritech lauréate AYuTe 2025" },
      { type: "heading", text: "DER/FJ et PSEJ : des financements dédiés aux jeunes agriculteurs" },
      { type: "paragraph", text: "Le gouvernement sénégalais a mis en place plusieurs dispositifs pour soutenir l'entrepreneuriat agricole des jeunes. La Délégation Générale à l'Entrepreneuriat Rapide des Femmes et des Jeunes (DER/FJ) propose des financements sans intérêt pour les projets à fort potentiel. Le Programme Sénégalais pour l'Entrepreneuriat des Jeunes (PSEJ) offre formations et accompagnement. Le Fonds de Financement de la Formation Professionnelle et Technique (3FPT) subventionne les projets innovants." },
      { type: "list", items: [
        "AYuTe Africa Challenge 2025 : 300+ projets, 5 startups agritech primées",
        "DER/FJ : financements sans intérêt pour les projets à fort potentiel",
        "Projet Agri-jeune 2020-2025 : 30 milliards FCFA alloués par le FIDA",
        "Agropoles Sud et Nord : pôles agro-industriels avec infrastructure, formation et financement",
        "3FPT : subventions pour projets agricoles innovants portés par des jeunes",
      ]},
      { type: "heading", text: "Les Agropoles : des hubs territoriaux pour l'agribusiness" },
      { type: "paragraph", text: "L'un des leviers les plus structurants est la création des Agropoles — des pôles agro-industriels territoriaux qui regroupent sur un même site des unités de transformation, des infrastructures de stockage et de froid, des espaces de formation et des facilités financières. Les Agropoles Nord (région de Saint-Louis) et Sud (Casamance) sont en cours de développement et visent à ancrer l'industrie agroalimentaire dans les zones de production, créant des emplois ruraux qualifiés et réduisant les pertes post-récolte." },
      { type: "paragraph", text: "La convergence entre technologie numérique, ambition entrepreneuriale des jeunes et politiques publiques ciblées dessine les contours d'une agriculture sénégalaise renouvelée. Une agriculture qui ne choisit plus entre modernité et racines — mais qui les réconcilie." },
    ],
  },
];

export const getArticleBySlug = (slug: string) => ARTICLES.find(a => a.slug === slug);
export const getFeaturedArticle = () => ARTICLES.find(a => a.featured);
export const getRelatedArticles = (article: Article, count = 3) =>
  ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0, count).concat(
    ARTICLES.filter(a => a.id !== article.id && a.category !== article.category)
  ).slice(0, count);
