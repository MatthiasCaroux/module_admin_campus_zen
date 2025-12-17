# Module Admin Campus Zen

Module d'administration pour le projet Campus Zen, développé avec Vue.js 3 et Vite.

## 📋 Prérequis

### Pour l'installation locale
- Node.js 18+ (recommandé: 20+)
- npm 9+ ou yarn 1.22+

### Pour l'installation avec Docker
- Docker 20+
- Docker Compose 2+

## 🚀 Installation et démarrage

### Option 1: Installation locale

#### 1. Cloner le repository
```bash
git clone https://github.com/MatthiasCaroux/module_admin_campus_zen.git
cd module_admin_campus_zen
```

#### 2. Installer les dépendances
```bash
npm install
```

#### 3. Lancer le serveur de développement
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

#### 4. Build pour la production
```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`

#### 5. Prévisualiser le build de production
```bash
npm run preview
```

### Option 2: Installation avec Docker

#### Développement avec Docker

```bash
# Démarrer le service de développement
docker-compose up dev

# Ou en arrière-plan
docker-compose up -d dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

#### Production avec Docker

```bash
# Build et démarrer le service de production
docker-compose up prod

# Ou en arrière-plan
docker-compose up -d prod
```

L'application sera accessible sur [http://localhost:8080](http://localhost:8080)

#### Build Docker manuel

```bash
# Build pour le développement
docker build --target development -t module-admin-campus-zen:dev .

# Build pour la production
docker build --target production -t module-admin-campus-zen:prod .

# Lancer le conteneur de développement
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules module-admin-campus-zen:dev

# Lancer le conteneur de production
docker run -p 8080:80 module-admin-campus-zen:prod
```

## 📦 Scripts disponibles

- `npm run dev` - Démarre le serveur de développement avec hot-reload
- `npm run build` - Build l'application pour la production
- `npm run preview` - Prévisualise le build de production localement

## 🏗️ Structure du projet

```
module_admin_campus_zen/
├── public/             # Fichiers statiques
├── src/
│   ├── assets/        # Assets (images, styles, etc.)
│   ├── components/    # Composants Vue réutilisables
│   ├── App.vue        # Composant racine
│   └── main.js        # Point d'entrée de l'application
├── index.html         # Template HTML principal
├── vite.config.js     # Configuration Vite
├── package.json       # Dépendances et scripts npm
├── Dockerfile         # Configuration Docker multi-stage
├── docker-compose.yml # Configuration Docker Compose
└── nginx.conf         # Configuration Nginx pour la production
```

## 🐳 Architecture Docker

Ce projet utilise une architecture Docker multi-stage:

- **Stage de développement**: Image Node.js avec hot-reload pour le développement
- **Stage de build**: Compile l'application Vue.js
- **Stage de production**: Image Nginx légère pour servir l'application en production

### Avantages
- ✅ Images optimisées et légères
- ✅ Build rapide et efficace
- ✅ Séparation des environnements dev/prod
- ✅ Hot-reload en développement
- ✅ Configuration Nginx optimisée pour Vue.js

## 🛠️ Technologies utilisées

- **Vue.js 3** - Framework JavaScript progressif
- **Vite** - Build tool et dev server ultra-rapide
- **Docker** - Containerisation
- **Nginx** - Serveur web pour la production

## 📝 Commandes Docker utiles

```bash
# Arrêter les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire les images
docker-compose build

# Nettoyer les conteneurs et volumes
docker-compose down -v

# Lister les conteneurs actifs
docker ps
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet pour les variables d'environnement:

```env
VITE_API_URL=http://localhost:3000/api
```

Les variables d'environnement commençant par `VITE_` seront automatiquement injectées dans l'application.

## 📄 Licence

Ce projet est destiné au projet Campus Zen.

## 👤 Auteur

Matthias Caroux
