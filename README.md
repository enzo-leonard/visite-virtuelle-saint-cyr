# Saint-Cyr-sur-Mer · Visite virtuelle 360° 🕵️‍♀️

Un petit **jeu de visite virtuelle** : on choisit un point d'intérêt de
Saint-Cyr-sur-Mer, on plonge dans une **image 360°**, et on part à la chasse
aux **points violets cachés** dans le décor (façon *« Où est Charlie »*).
Chaque secret trouvé dévoile une anecdote, et certains points sont des
**passages** vers d'autres lieux.

## Lancer le projet

Le projet utilise des modules ES + chargement de textures, il faut donc le
servir via HTTP (pas en `file://`).

```bash
cd visite_virtuelle
python3 -m http.server 8000
```

Puis ouvre **http://localhost:8000** dans ton navigateur.

## Comment jouer

0. Sur l'accueil, une **carte touristique** présente tous les lieux : clique
   sur une pastille pour t'y rendre (ou utilise la liste « Tous les lieux »).
1. Choisis un lieu pour entrer dans son image 360°.
2. Fais glisser pour regarder à 360°, molette pour zoomer.
3. Ouvre le panneau **Énigmes** (à droite) : chaque devinette, avec un indice
   de direction, t'aide à localiser un **point violet** caché.
4. Trouve et clique les **points violets** → l'anecdote se dévoile et l'énigme
   correspondante se valide.
5. Les **points blancs (i)** donnent des infos sur des éléments de l'image
   (ils ne comptent pas dans le jeu).
6. Les **points orange (➜)** sont des passages : survole pour voir le lieu de
   destination, clique pour t'y téléporter.
7. Bouton **Indice** : fait scintiller les secrets non encore trouvés.
8. La progression est sauvegardée automatiquement (localStorage).

> Les trois types de points sont volontairement **sobres et discrets**.

## Mettre tes vraies photos de Saint-Cyr

1. Remplace les fichiers dans `assets/panoramas/` par tes **photos 360°
   équirectangulaires** (ratio 2:1, p. ex. `plage.jpg`).
2. Régénère les miniatures dans `assets/thumbs/` (macOS) :
   ```bash
   for f in plage port calanque village sentier vignoble; do
     sips -Z 800 "assets/panoramas/$f.jpg" --out "assets/thumbs/$f.jpg"
   done
   ```
3. Ajuste le contenu et la **position des secrets** (`yaw` horizontal,
   `pitch` vertical, en degrés) dans `js/data.js`.

## Structure

```
visite_virtuelle/
├── index.html          # structure (accueil + visionneuse)
├── css/style.css       # design méditerranéen + violet
├── js/data.js          # lieux + secrets cachés (à personnaliser)
├── js/app.js           # logique du jeu (visionneuse, progression)
└── assets/
    ├── panoramas/      # images 360° équirectangulaires
    └── thumbs/         # miniatures pour l'accueil et le carrousel
```

## Crédits

- Visionneuse 360° : [Photo Sphere Viewer](https://photo-sphere-viewer.js.org/) (MIT)
- Panoramas de démonstration : [Poly Haven](https://polyhaven.com/) (CC0) — **ce ne sont PAS de vraies photos de Saint-Cyr** (la « plage » est Mondello en Sicile, le « port » un coucher de soleil à Venise…). À remplacer par tes propres photos 360°.
- Carte touristique (`assets/carte-saint-cyr.png`) : illustration générée, décorative — remplaçable par un vrai plan. Les positions des pastilles se règlent via `map: { x, y }` (en %) dans `js/data.js`.
