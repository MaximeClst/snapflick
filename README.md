# SnapFlick

> Convertisseur d'images **rapide, privé et gratuit** — 100% dans le navigateur.

SnapFlick transforme vos images d'un format à l'autre en quelques secondes, sans inscription, sans filigrane, et **sans jamais envoyer vos fichiers sur un serveur**. Tout est traité localement dans votre navigateur.

---

## ✨ Fonctionnalités

- **6 formats supportés** : PNG, JPEG, WebP, GIF, TIFF et SVG (vectorisation)
- **100% privé** : aucun upload, aucun tracking, aucune image ne quitte votre appareil
- **Glisser-déposer** : interface drag & drop fluide avec aperçu instantané
- **Sans friction** : aucun compte, aucun email, aucune limite cachée
- **Responsive** : fonctionne sur desktop, tablette et mobile
- **Accessible** : focus visible, contraste AA, support `prefers-reduced-motion`

## 🧰 Stack technique

- **React 19** + **Vite 6**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **imagetracerjs** pour la vectorisation SVG
- **file-saver** pour le téléchargement local

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de dev (http://localhost:5173)
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint
```

## 📁 Structure du projet

```
snapflick/
├── public/              # Assets statiques
├── src/
│   ├── App.jsx          # Landing page + convertisseur
│   ├── index.css        # Tailwind v4 + tokens design (brand, ink, accent)
│   ├── main.jsx         # Entry point React
│   └── components/      # Composants additionnels
├── index.html
├── vite.config.js
└── package.json
```

## 🔒 Confidentialité

Aucune image n'est envoyée à un serveur. Toute la conversion s'effectue dans le navigateur via :
- `FileReader` (lecture du fichier en mémoire)
- `ImageTracer` (vectorisation SVG côté client)
- `file-saver` (téléchargement direct sans réseau)

Vous pouvez littéralement couper le Wi-Fi avant de convertir — ça marche.

## 📦 Déploiement

Le projet est compatible avec **Vercel**, **Netlify**, **Cloudflare Pages** ou tout hébergeur statique.

```bash
npm run build
# → output dans dist/
```

## 📄 Licence

Projet personnel — usage libre.
