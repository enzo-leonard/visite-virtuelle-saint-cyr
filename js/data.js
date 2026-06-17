// ============================================================
//  Données de la visite virtuelle — Saint-Cyr-sur-Mer
// ------------------------------------------------------------
//  Chaque "scène" = un point d'intérêt avec une image 360°.
//
//  Trois types de points dans chaque scène :
//   • secrets : points VIOLETS cachés (jeu « Où est Charlie »).
//               Une énigme dans le panneau de droite aide à les
//               trouver. Clic = anecdote + secret validé.
//   • infos   : points BLANCS toujours visibles. Clic = info
//               sur un élément de l'image (ne compte pas au jeu).
//   • portals : points ORANGE de navigation. Survol = nom de
//               l'autre lieu, clic = on s'y téléporte.
//
//  - yaw   : position horizontale  (0 → 360°)
//  - pitch : position verticale    (-90 bas, +90 ciel)
// ============================================================

const TOUR = {
  title: "Saint-Cyr-sur-Mer",
  subtitle: "Méditerranée",

  scenes: [
    {
      id: "plage",
      name: "Plage des Lecques",
      tags: ["Été", "Baignade"],
      teaser: "2 km de sable fin dans une baie protégée.",
      panorama: "assets/panoramas/plage.jpg",
      thumb: "assets/thumbs/plage.jpg",
      map: { x: 48, y: 60 },
      icon: "🏖️",
      intro:
        "La grande plage des Lecques déroule près de 2 km de sable fin au fond d'une baie abritée. " +
        "Eaux peu profondes, pédalos et front de mer animé : le cœur balnéaire de Saint-Cyr.",
      secrets: [
        { id: "p1", yaw: 35, pitch: -6, title: "Sable fin",
          riddle: "Là où les baigneurs posent leur serviette, le grain le plus doux se cache.",
          text: "La baie en pente douce fait des Lecques une plage idéale pour les familles et les premières baignades." },
        { id: "p2", yaw: 148, pitch: -3, title: "Villa romaine de la Tauroentum",
          riddle: "Les Romains ont laissé des traces ; tourne-toi presque dos à la mer pour les débusquer.",
          text: "À deux pas, un musée installé sur une villa gallo-romaine du 1ᵉʳ siècle garde des mosaïques d'origine." },
        { id: "p3", yaw: 250, pitch: 4, title: "Le saviez-vous ?",
          riddle: "Un nom venu du provençal se devine près des pierres plates du rivage.",
          text: "Le nom « Les Lecques » viendrait du provençal « li lèco », les pierres plates du rivage." },
      ],
      infos: [
        { id: "ip1", yaw: 95, pitch: -2, title: "Le front de mer",
          text: "La promenade des Lecques aligne restaurants, glaciers et boutiques face à la baie." },
        { id: "ip2", yaw: 200, pitch: 22, title: "Un microclimat",
          text: "Plus de 300 jours de soleil par an : Saint-Cyr profite d'un climat méditerranéen très doux." },
      ],
      quizzes: [
        { id: "qp1", yaw: 300, pitch: 6, title: "Quiz · Les Lecques",
          question: "D'où viendrait le nom « Les Lecques » ?",
          options: ["Du provençal « li lèco », les pierres plates", "D'un général romain", "D'une famille de pêcheurs"],
          answer: 0,
          explain: "« Li lèco » désigne en provençal les pierres plates du rivage." },
      ],
      portals: [
        { id: "go-port", to: "port", yaw: 110, pitch: -4 },
        { id: "go-village", to: "village", yaw: 300, pitch: -3 },
      ],
    },
    {
      id: "port",
      name: "Port de la Madrague",
      tags: ["Authentique", "Pêche"],
      teaser: "Un port de pêche aux barques colorées.",
      panorama: "assets/panoramas/port.jpg",
      thumb: "assets/thumbs/port.jpg",
      map: { x: 22, y: 56 },
      icon: "⛵",
      intro:
        "Niché sous la pointe Grenier, le port de la Madrague garde l'âme d'un village de pêcheurs : " +
        "pointus aux couleurs vives, filets qui sèchent et terrasses face au large.",
      secrets: [
        { id: "po1", yaw: 20, pitch: -4, title: "Les pointus",
          riddle: "Des barques effilées aux deux bouts dansent devant toi, un peu sur la droite.",
          text: "Ces barques traditionnelles de Provence, effilées aux deux bouts, portent le nom de « pointus »." },
        { id: "po2", yaw: 130, pitch: -8, title: "La madrague",
          riddle: "Un piège à thons d'autrefois… cherche derrière toi, côté droit.",
          text: "Une « madrague » est un labyrinthe de filets autrefois tendu pour piéger les thons en migration." },
        { id: "po3", yaw: 205, pitch: 2, title: "Pointe Grenier",
          riddle: "Une pointe boisée domine la baie : regarde derrière, vers la gauche.",
          text: "La pointe boisée qui domine le port offre l'un des plus beaux points de vue sur la baie." },
      ],
      infos: [
        { id: "io1", yaw: 165, pitch: -5, title: "Les terrasses",
          text: "Autour du port, les terrasses servent poissons grillés et spécialités provençales." },
        { id: "io2", yaw: 320, pitch: 26, title: "Le mistral",
          text: "Ce vent du nord-ouest, sec et puissant, dégage le ciel et rafraîchit les étés." },
      ],
      quizzes: [
        { id: "qpo1", yaw: 250, pitch: 4, title: "Quiz · La pêche",
          question: "Qu'est-ce qu'une « madrague » ?",
          options: ["Un type de bateau", "Un labyrinthe de filets à thons", "Un quartier du port"],
          answer: 1,
          explain: "La madrague est un piège fait de filets, autrefois tendu pour capturer les thons en migration." },
      ],
      portals: [
        { id: "go-plage", to: "plage", yaw: 70, pitch: -3 },
        { id: "go-calanque", to: "calanque", yaw: 295, pitch: -2 },
      ],
    },
    {
      id: "calanque",
      name: "Calanque de Port d'Alon",
      tags: ["Nature", "Crique"],
      teaser: "Une crique sauvage bordée de pins.",
      panorama: "assets/panoramas/calanque.jpg",
      thumb: "assets/thumbs/calanque.jpg",
      map: { x: 13, y: 24 },
      icon: "🏊",
      intro:
        "Au bout d'une pinède odorante, la calanque de Port d'Alon ouvre sur une eau translucide. " +
        "Un site naturel protégé, accessible à pied, loin de l'agitation.",
      secrets: [
        { id: "c1", yaw: 50, pitch: -2, title: "Eau turquoise",
          riddle: "Plonge ton regard sur la droite, là où l'eau devient cristal.",
          text: "La transparence vient du fond clair de galets et de l'absence de rivière qui troublerait l'eau." },
        { id: "c2", yaw: 165, pitch: 8, title: "Pins d'Alep",
          riddle: "Des arbres penchés par le vent t'observent presque dans ton dos, sur la droite.",
          text: "Ces pins penchés vers la mer sont taillés par le mistral, le vent dominant de la région." },
        { id: "c3", yaw: 240, pitch: -12, title: "Site protégé",
          riddle: "Le chemin d'accès se devine sur ta gauche, légèrement en arrière.",
          text: "Port d'Alon est un espace naturel sensible : on y vient à pied, sans laisser de trace." },
      ],
      infos: [
        { id: "ic1", yaw: 200, pitch: 16, title: "La pinède",
          text: "Une forêt de pins d'Alep descend jusqu'à la crique et offre de l'ombre aux randonneurs." },
        { id: "ic2", yaw: 80, pitch: -22, title: "La faune marine",
          text: "Sous la surface, herbiers de posidonie et petits poissons ravissent les amateurs de palmes-masque-tuba." },
      ],
      portals: [
        { id: "go-port", to: "port", yaw: 110, pitch: -3 },
        { id: "go-sentier", to: "sentier", yaw: 330, pitch: -2 },
      ],
    },
    {
      id: "village",
      name: "Centre & Place Portalis",
      tags: ["Patrimoine", "Marché"],
      teaser: "Le cœur provençal et sa Statue de la Liberté.",
      panorama: "assets/panoramas/village.jpg",
      thumb: "assets/thumbs/village.jpg",
      map: { x: 43, y: 28 },
      icon: "⛪",
      intro:
        "Place Portalis, les terrasses et le marché provençal font battre le cœur du village. " +
        "Au centre trône une étonnante réplique dorée de la Statue de la Liberté.",
      secrets: [
        { id: "v1", yaw: 25, pitch: -3, title: "La Statue de la Liberté",
          riddle: "Une dame dorée veille sur la place, droit devant, un peu à droite.",
          text: "Une réplique en cuivre doré de l'œuvre de Bartholdi veille sur la place : un clin d'œil de Saint-Cyr à New York." },
        { id: "v2", yaw: 120, pitch: -6, title: "Jean-Étienne-Marie Portalis",
          riddle: "Un grand juriste donne son nom à la place : cherche sur ta droite, derrière.",
          text: "La place honore Portalis, l'un des principaux rédacteurs du Code civil de Napoléon, originaire de la région." },
        { id: "v3", yaw: 210, pitch: 2, title: "Marché provençal",
          riddle: "Des étals colorés embaument derrière toi, vers la gauche.",
          text: "Olives, fromages, savons et tissus colorés : le marché embaume la place plusieurs matins par semaine." },
      ],
      infos: [
        { id: "iv1", yaw: 160, pitch: 10, title: "L'église",
          text: "L'église paroissiale veille sur le centre ancien et ses ruelles provençales." },
        { id: "iv2", yaw: 300, pitch: 14, title: "Les platanes",
          text: "Les platanes ombragent la place où l'on tape volontiers le carton et joue à la pétanque." },
      ],
      quizzes: [
        { id: "qv1", yaw: 250, pitch: 5, title: "Quiz · Patrimoine",
          question: "Que trône-t-il au centre de la place Portalis ?",
          options: ["Une fontaine romaine", "Une réplique dorée de la Statue de la Liberté", "Un phare miniature"],
          answer: 1,
          explain: "Saint-Cyr possède une réplique en cuivre doré de la Statue de la Liberté de Bartholdi." },
      ],
      portals: [
        { id: "go-plage", to: "plage", yaw: 80, pitch: -3 },
        { id: "go-vignoble", to: "vignoble", yaw: 290, pitch: -2 },
      ],
    },
    {
      id: "sentier",
      name: "Sentier du littoral",
      tags: ["Rando", "Panorama"],
      teaser: "Un balcon naturel au-dessus de la mer.",
      panorama: "assets/panoramas/sentier.jpg",
      thumb: "assets/thumbs/sentier.jpg",
      map: { x: 87, y: 56 },
      icon: "🥾",
      intro:
        "Le sentier du littoral suit la côte entre garrigue et falaises. Criques secrètes, " +
        "parfums de pin et de thym, et la grande bleue à perte de vue.",
      secrets: [
        { id: "s1", yaw: 40, pitch: -5, title: "La garrigue",
          riddle: "Thym et romarin parfument le chemin devant toi, sur la droite.",
          text: "Thym, romarin et ciste parfument le chemin : une végétation typique du climat méditerranéen sec." },
        { id: "s2", yaw: 150, pitch: 3, title: "Sentier des douaniers",
          riddle: "Un chemin de surveillance serpente derrière toi, côté droit.",
          text: "Ces chemins côtiers servaient autrefois aux douaniers pour surveiller la contrebande venue de la mer." },
        { id: "s3", yaw: 235, pitch: -9, title: "Criques cachées",
          riddle: "En contrebas, à ta gauche et un peu en arrière, se nichent de petites criques.",
          text: "En contrebas se nichent de minuscules criques de galets, accessibles aux plus curieux." },
      ],
      infos: [
        { id: "is1", yaw: 110, pitch: -3, title: "Le balisage",
          text: "Le sentier du littoral est balisé : suis les marques pour ne pas t'égarer." },
        { id: "is2", yaw: 300, pitch: 0, title: "Les falaises",
          text: "Des falaises calcaires plongent dans une mer d'un bleu profond." },
      ],
      portals: [
        { id: "go-calanque", to: "calanque", yaw: 100, pitch: -3 },
        { id: "go-vignoble", to: "vignoble", yaw: 320, pitch: -2 },
      ],
    },
    {
      id: "vignoble",
      name: "Vignoble de Bandol",
      tags: ["Terroir", "AOC"],
      teaser: "Les coteaux en restanques de l'AOC Bandol.",
      panorama: "assets/panoramas/vignoble.jpg",
      thumb: "assets/thumbs/vignoble.jpg",
      map: { x: 80, y: 17 },
      icon: "🍇",
      intro:
        "Sur les hauteurs, les vignes en terrasses (restanques) dessinent l'appellation Bandol, " +
        "réputée pour ses rouges de garde et ses rosés de caractère.",
      secrets: [
        { id: "vi1", yaw: 30, pitch: -4, title: "Le mourvèdre",
          riddle: "Le cépage roi mûrit au soleil, devant toi vers la droite.",
          text: "Cépage roi de l'AOC Bandol, le mourvèdre aime le soleil et donne des rouges puissants qui vieillissent longtemps." },
        { id: "vi2", yaw: 140, pitch: -7, title: "Les restanques",
          riddle: "Des murets de pierre retiennent la terre derrière toi, côté droit.",
          text: "Ces murets de pierres sèches retiennent la terre sur les pentes : un savoir-faire séculaire de la région." },
        { id: "vi3", yaw: 225, pitch: 5, title: "Rosé de Provence",
          riddle: "La couleur d'un soir d'été se cache sur ta gauche, à l'arrière.",
          text: "Le rosé de Bandol, plus structuré que la moyenne provençale, accompagne à merveille la cuisine de la mer." },
      ],
      infos: [
        { id: "ivi1", yaw: 60, pitch: 0, title: "Les domaines",
          text: "Plusieurs domaines familiaux ouvrent leurs portes pour des dégustations." },
        { id: "ivi2", yaw: 260, pitch: 6, title: "Oliviers & amandiers",
          text: "Entre les vignes, oliviers et amandiers complètent ce paysage agricole méditerranéen." },
      ],
      quizzes: [
        { id: "qvi1", yaw: 300, pitch: 4, title: "Quiz · Terroir",
          question: "Quel est le cépage roi de l'AOC Bandol ?",
          options: ["Le merlot", "Le mourvèdre", "Le chardonnay"],
          answer: 1,
          explain: "Le mourvèdre, qui adore le soleil, donne des rouges puissants de longue garde." },
      ],
      portals: [
        { id: "go-village", to: "village", yaw: 95, pitch: -3 },
        { id: "go-sentier", to: "sentier", yaw: 305, pitch: -2 },
      ],
    },
  ],
};

// Exposé en global pour le module app.js
window.TOUR = TOUR;
