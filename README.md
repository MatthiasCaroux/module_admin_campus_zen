# Module Admin Campus Zen

Module d'administration pour le projet Campus Zen, développé avec Vue.js 3 et Vite.

Interface d'administration complète permettant de gérer facilement les questionnaires, questions, réponses et ressources de l'application Campus Zen.

## 🔐 Sécurité - Cookies HttpOnly

**⚠️ IMPORTANT : Ce projet utilise des cookies HttpOnly pour l'authentification JWT.**

Les tokens sont stockés dans des cookies HttpOnly sécurisés côté serveur.

### Avantages
- ✅ Protection contre les attaques XSS
- ✅ Refresh automatique des tokens
- ✅ Gestion simplifiée de l'authentification
- ✅ Cookies sécurisés (HttpOnly, SameSite, Secure en production)

---

## ✨ Fonctionnalités principales

### 🔐 Authentification
- Connexion sécurisée avec cookies HttpOnly
- Protection des routes avec guard
- Refresh automatique du token (transparent pour l'utilisateur)
- Déconnexion sécurisée (supprime les cookies côté serveur)

### 📊 Dashboard
- Vue d'ensemble des statistiques
- Compteurs en temps réel (questionnaires, questions, réponses, ressources, climats, personnes)
- Accès rapide aux sections principales

### 📋 Gestion des Questionnaires
- **Vue hiérarchique avec menus déroulants** :
  - Cliquer sur un questionnaire → affiche ses questions
  - Cliquer sur une question → affiche ses réponses
- **CRUD complet à tous les niveaux** :
  - Créer/Modifier/Supprimer des questionnaires
  - Ajouter/Modifier/Supprimer des questions directement depuis le questionnaire
  - Ajouter/Modifier/Supprimer des réponses directement depuis la question
- Design épuré avec bordures colorées et badges de score

### ❓ Gestion des Questions
- CRUD complet (Créer, Lire, Modifier, Supprimer)
- **Création automatique de réponses Likert** :
  - Option cochable lors de la création d'une question
  - Génère automatiquement 7 réponses (Jamais → Toujours, scores 1-7)
- Sélection du questionnaire associé
- Définition du poids de la question
- **Vue des réponses** : bouton pour afficher toutes les réponses d'une question en modal
- Affichage du nombre de réponses par question

### 💬 Gestion des Réponses
- CRUD complet
- Lien vers la question parente
- Attribution de scores
- Filtrage par question

### 📚 Gestion des Ressources
- CRUD complet
- Types de ressources : Vidéo, Article, Podcast, Autre
- Badges colorés par type
- Liens externes cliquables
- Descriptions détaillées

### 🌤️ Gestion des Climats
- CRUD complet
- Affichage en cartes élégantes
- Interface simple et intuitive

### 👥 Gestion des Personnes et Messages
- Vue en lecture seule
- Affichage JSON détaillé

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

**Important:** Avant de builder avec Docker, assurez-vous d'avoir installé les dépendances localement:

```bash
npm install
```

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
│   │   └── Navbar.vue
│   ├── views/         # Pages de l'application
│   │   ├── Login.vue
│   │   ├── Dashboard.vue
│   │   ├── Questionnaires.vue
│   │   ├── Questions.vue
│   │   ├── Reponses.vue
│   │   ├── Ressources.vue
│   │   ├── Climats.vue
│   │   ├── Personnes.vue
│   │   └── Messages.vue
│   ├── services/      # Services et API
│   │   └── api.js
│   ├── router/        # Configuration du routing
│   │   └── index.js
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

## 🎯 Guide d'utilisation

### Connexion
1. Ouvrez l'application sur [http://localhost:5173](http://localhost:5173)
2. Connectez-vous avec les identifiants : **admin** / **admin**
3. Vous êtes redirigé vers le Dashboard

### Gérer les Questionnaires (Méthode recommandée)
1. Allez dans **Questionnaires**
2. Cliquez sur un questionnaire pour le déplier
3. Utilisez **"+ Ajouter une question"** pour créer une nouvelle question
4. Cliquez sur une question pour la déplier
5. Utilisez **"+ Ajouter une réponse"** pour créer une nouvelle réponse
6. Modifiez ou supprimez directement avec les boutons à droite

**Avantage** : Vue hiérarchique complète en un seul écran !

### Créer une Question avec échelle Likert
1. Allez dans **Questions**
2. Cliquez sur **"+ Nouvelle Question"**
3. Remplissez l'intitulé et le poids
4. **Cochez "Créer automatiquement les réponses Likert"**
5. Validez → 7 réponses sont créées automatiquement (scores 1 à 7)

### Voir les Réponses d'une Question
1. Dans la page **Questions**, cliquez sur le bouton violet **"X réponse(s)"**
2. Un modal s'ouvre avec toutes les réponses triées par score

### Gérer les Ressources
1. Allez dans **Ressources**
2. Ajoutez des vidéos, articles, podcasts avec leurs liens
3. Les badges de couleur indiquent automatiquement le type

## 🛠️ Technologies utilisées

- **Vue.js 3** - Framework JavaScript progressif avec Composition API
- **Vue Router 4** - Routing avec protection des routes
- **Axios** - Client HTTP pour les appels API
- **Vite** - Build tool et dev server ultra-rapide avec HMR
- **Docker** - Containerisation multi-stage
- **Nginx** - Serveur web pour la production

## 🏗️ Architecture

### API Backend
- URL de base : `http://54.38.35.105:8000/api/`
- Endpoints : questionnaires, questions, reponses, ressources, climats, personnes, messages, etc.

### Structure Frontend
```
src/
├── components/
│   ├── Navbar.vue          # Navigation principale
│   └── HelloWorld.vue      # Composant exemple (non utilisé)
├── views/
│   ├── Login.vue           # Page de connexion
│   ├── Dashboard.vue       # Tableau de bord
│   ├── Questionnaires.vue  # Gestion avec menus déroulants
│   ├── Questions.vue       # Gestion des questions + Likert
│   ├── Reponses.vue        # Gestion des réponses
│   ├── Ressources.vue      # Gestion des ressources
│   ├── Climats.vue         # Gestion des climats
│   ├── Personnes.vue       # Vue des personnes
│   └── Messages.vue        # Vue des messages
├── services/
│   └── api.js              # Service API centralisé
├── router/
│   └── index.js            # Configuration du routing
├── App.vue                 # Composant racine
└── main.js                 # Point d'entrée
```

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

## 🎨 Design et UX

- Interface moderne et responsive
- Palette de couleurs cohérente (violet/bleu)
- Animations et transitions fluides
- Feedback visuel sur toutes les actions
- Modals pour les formulaires
- Boutons d'action alignés et uniformes
- Badges colorés pour les types et scores
- Messages de confirmation pour les suppressions

## 🔑 Fonctionnalités avancées

### Menu déroulant hiérarchique
- Navigation intuitive à 3 niveaux (Questionnaire → Questions → Réponses)
- Icônes ► et ▼ pour indiquer l'état (fermé/ouvert)
- Actions CRUD disponibles à chaque niveau
- Vue d'ensemble complète en un seul écran

### Génération automatique Likert
- Template de 7 réponses pré-configuré
- Échelle standardisée : Jamais (1) → Toujours (7)
- Gain de temps énorme pour la création de questionnaires
- Scores automatiquement assignés

### Gestion en temps réel
- Rechargement automatique après chaque action
- Compteurs mis à jour dynamiquement
- Synchronisation avec l'API backend
- Pas de rechargement de page nécessaire

## 🚀 Améliorations futures possibles

- [ ] Recherche et filtres dans les tableaux
- [ ] Export des données (CSV, Excel)
- [ ] Import en masse de questionnaires
- [ ] Statistiques avancées
- [ ] Système de permissions plus granulaire
- [ ] Gestion des médias (upload d'images)
- [ ] Historique des modifications
- [ ] Mode sombre

## 📄 Licence

Ce projet est destiné au projet Campus Zen.

## 👤 Auteur

Matthias Caroux

---

**Développé avec ❤️ en Vue.js 3**
