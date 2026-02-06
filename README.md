# Module Admin Campus Zen

<div align="center">

**Interface d'administration** pour la plateforme Campus Zen

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-green.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-blueviolet.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](../LICENSE)

</div>

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Mise en production (OVH)](#-mise-en-production-ovh)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [Fonctionnalités](#-fonctionnalités)
- [Dépannage](#-dépannage)

## 🎯 Aperçu

Module Admin Campus Zen est une **interface d'administration complète** permettant aux administrateurs de gérer :

✅ **Questionnaires** avec système hiérarchique  
✅ **Questions** avec génération automatique Likert  
✅ **Réponses** avec scores configurables  
✅ **Ressources** (articles, vidéos, podcasts)  
✅ **Climats** (états émotionnels résultants)  
✅ **Statistiques** en temps réel  

### Stack technologique

```
┌─────────────────────────────────┐
│   Vue.js 3 + Composition API    │  Framework
├─────────────────────────────────┤
│   Vite                          │  Build tool ultra-rapide
├─────────────────────────────────┤
│   Vue Router 4                  │  Navigation & guards
├─────────────────────────────────┤
│   Axios                         │  Client HTTP
├─────────────────────────────────┤
│   Chart.js / Vue-Chartjs        │  Graphiques
└─────────────────────────────────┘
```

## 📦 Prérequis

### Requis
- **Node.js** 18+ (recommandé: 20+)
- **npm** 9+ ou **yarn** 1.22+
- **Git**

### Vérifier les prérequis

```bash
node --version      # Doit être 18+
npm --version
git --version
```

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/MatthiasCaroux/module_admin_campus_zen.git
cd module_admin_campus_zen
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

### 3. Lancer le serveur de développement

L'application sera disponible à `http://localhost:5173` avec hot-reload.

### Build production

Pour générer une version de production, utiliser les scripts npm fournis.

## 🚀 Mise en production (OVH)

Le serveur est configuré pour servir le build `dist` généré dans `module_admin_campus_zen`. Aucun détail sensible de configuration n'est requis dans cette documentation.

Pour la mise en production, cloner aussi module_admin_campus_zen dans le home du serveur (par exemple /home/ubuntu) afin que le build soit disponible à un chemin du type /home/ubuntu/module_admin_campus_zen/dist.

### Build côté serveur

Un script dédié est disponible : `buildModuleAdmin.sh`.

```bash
#!/bin/bash
rm -rf node_modules package-lock.json dist

npm install

npm run build
```

Après exécution, le build est disponible dans `module_admin_campus_zen/dist` et sert de base au déploiement.


### Sur un navigateur

Pour accéder au module administrateur depuis un navigateur, ouvrez : `https://incidents-bouake.com`

## 📱 Utilisation

### Connexion

1. Ouvrez `http://localhost:5173`
2. Identifiants par défaut : **admin** / **admin**
3. Vous êtes redirigé vers le **Dashboard**

### 📊 Dashboard

- Vue d'ensemble des statistiques
- Compteurs en temps réel
- Accès rapide aux sections principales
- Graphiques de synthèse

### 📋 Questionnaires (Vue hiérarchique recommandée)

**Méthode recommandée** : Gestion via **Questionnaires**

Permet de naviguer dans l'arborescence :
- Questionnaire → Questions → Réponses
- Toutes les actions CRUD intégrées à un seul écran
- Interface intuitive avec menus déroulants

**Avantages** :
- ✅ Vue hiérarchique complète
- ✅ Toutes les actions CRUD sur un seul écran
- ✅ Navigation intuitive
- ✅ Moins de clics nécessaires

### ❓ Questions avec Likert automatique

Option pour créer automatiquement 7 réponses Likert lors de la création d'une question.

**Réponses générées** (échelle 1-7) :
- Jamais, Rarement, Parfois, Souvent, Très souvent, Presque toujours, Toujours

### 💬 Réponses

- Vue détaillée de chaque réponse
- Scores Likert (1-7)
- Lien vers la question parente
- Filtrage par question

### 📚 Ressources

Types disponibles :
- 📹 **Vidéo** (badge bleu)
- 📄 **Article** (badge vert)
- 🎙️ **Podcast** (badge orange)
- 🎯 **Autre** (badge gris)

Champs :
- Nom de la ressource
- URL/lien externe
- Type (avec badge coloré)
- Description détaillée

### 🌤️ Climats

États émotionnels résultants :
- Interface simple et intuitive
- Affichage en cartes élégantes
- CRUD complet
- Messages associés par climat

### 📊 Statistiques

- **Questionnaires** : nombre total
- **Questions** : nombre total
- **Réponses** : nombre total
- **Ressources** : nombre total
- **Utilisateurs** : nombre total
- **Climats** : états disponibles

## 📁 Structure du projet

```
module_admin_campus_zen/
├── src/
│   ├── components/              # 🔧 Composants réutilisables
│   │   └── Navbar.vue          # Navigation principale
│   │
│   ├── views/                   # 📱 Pages de l'application
│   │   ├── Login.vue           # Authentification
│   │   ├── Dashboard.vue       # Tableau de bord
│   │   ├── Questionnaires.vue  # Gestion hiérarchique
│   │   ├── Questions.vue       # Gestion + Likert
│   │   ├── Reponses.vue        # Gestion des réponses
│   │   ├── Ressources.vue      # Gestion des ressources
│   │   ├── Climats.vue         # Gestion des climats
│   │   ├── Personnes.vue       # Vue des utilisateurs
│   │   └── Messages.vue        # Vue des messages
│   │
│   ├── router/                  # 🗺️ Navigation
│   │   └── index.js            # Routes & guards
│   │
│   ├── services/                # 🌐 API
│   │   └── api.js              # Client Axios centralisé
│   │
│   ├── stores/                  # 🔄 État global (optionnel)
│   │   └── auth.js
│   │
│   ├── assets/                  # 📦 Ressources
│   │   └── styles/
│   │
│   ├── App.vue                  # 📍 Composant racine
│   └── main.js                  # Point d'entrée
│
├── public/                       # Fichiers statiques
├── vite.config.js              # Configuration Vite
├── index.html                   # Template HTML
└── package.json
```

## 🔐 Sécurité

### Authentification

✅ **Cookies HttpOnly** pour les tokens JWT  
✅ **Guards Vue Router** pour protéger les routes  
✅ **Refresh automatique** des tokens expirants  
✅ **Déconnexion sécurisée** (suppression des cookies)  

### Flux d'authentification

```
1. Connexion avec email/password
        ↓
2. Backend retourne tokens dans cookies HttpOnly
        ↓
3. Les tokens sont automatiquement envoyés avec chaque requête
        ↓
4. Guard Vue Router vérifie l'authentification
        ↓
5. Si expiré, refresh automatique du token
        ↓
6. Déconnexion = suppression des cookies
```



## 🛠️ Utilisation avancée

### API Service

Tous les appels API passent par un service centralisé (`src/services/api.js`) avec support complet des opérations CRUD :
- **GET** : Récupérer les ressources
- **POST** : Créer des ressources
- **PUT** : Mettre à jour les ressources
- **DELETE** : Supprimer les ressources

### Router Guards

Protection des routes au niveau admin avec vérification d'authentification automatique.


## 🧪 Tests et qualité

### Scripts disponibles

```bash
npm run dev        # Développement avec hot-reload
npm run build      # Build production
npm run preview    # Prévisualise le build
```

### Vérification du build

```bash
npm run build      # Génère dist/
npm run preview    # Teste le build
```

## 📊 Gestion des données

### Hiérarchie des données

```
Questionnaire (1)
    ├── Question (N)
    │   └── Réponse (M)
    │
    └── SubmitRecu
        └── Reponse_Personne
```

### Flux de données

```
Admin crée/modifie données
        ↓
API reçoit et valide
        ↓
BD mise à jour
        ↓
Frontend rafraîchit l'affichage
        ↓
Admin voit les changements
```

## 🔧 Dépannage

### Port 5173 déjà utilisé

Lancer le serveur sur un port différent avec `npm run dev -- --port 5174`.

### Erreurs de connexion à l'API

Vérifier que le backend Django tourne sur `http://localhost:8000`.

### Module not found

Réinstaller les dépendances avec `npm install` puis relancer avec `npm run dev`.

### Erreurs TypeScript

Vérifier la configuration TypeScript (`tsconfig.json`) et que toutes les dépendances sont correctement installées.

## 📚 Ressources

- [Vue.js 3 Docs](https://vuejs.org/)
- [Vue Router Docs](https://router.vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Axios Docs](https://axios-http.com/)
- [Chart.js Docs](https://www.chartjs.org/)
## Auteurs
- Enzo Familiar-Marais
- Matthias Caroux
- Niksan Nagarajah
- Samuel Niveau

## 📝 License

MIT - Voir [LICENSE](../LICENSE)

