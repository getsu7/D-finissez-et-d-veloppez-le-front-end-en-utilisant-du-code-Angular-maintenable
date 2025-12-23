# 🏅 Olympic Games Starter

Application Angular permettant de visualiser les données des Jeux Olympiques avec des graphiques interactifs.

![Angular](https://img.shields.io/badge/Angular-18.0.6-red?logo=angular)
![Chart.js](https://img.shields.io/badge/Chart.js-4.2.1-blue?logo=chartdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)

---

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Démarrage](#démarrage)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Scripts disponibles](#scripts-disponibles)
- [Architecture](#architecture)
- [Tests](#tests)

---

## 🔧 Prérequis

- **Node.js** : version 18.x ou supérieure
- **npm** : version 9.x ou supérieure
- **Angular CLI** : version 18.0.6

```bash
# Vérifier les versions
node --version
npm --version
ng version
```

---

## 📥 Installation

1. **Cloner le repository**
```bash
git clone <url-du-repository>
cd D-finissez-et-d-veloppez-le-front-end-en-utilisant-du-code-Angular-maintenable
```

2. **Installer les dépendances**
```bash
npm install
```

---

## 🚀 Démarrage

### Serveur de développement

```bash
npm start
# ou
ng serve
```

Accédez à l'application sur `http://localhost:4200/`.

L'application se recharge automatiquement lors de modifications du code source.

### Build de production

```bash
npm run build
```

Les fichiers de build seront générés dans le dossier `dist/`.

---

## 📁 Structure du projet

```
src/
├── app/
│   ├── core/                    # Module central (services, modèles)
│   │   ├── models/              # Interfaces TypeScript
│   │   │   ├── olympic.model.ts
│   │   │   └── participation.model.ts
│   │   └── services/            # Services métier
│   │       └── olympic.service.ts
│   │
│   ├── pages/                   # Pages de l'application
│   │   ├── home/                # Page d'accueil
│   │   ├── country/             # Page détail pays
│   │   └── not-found/           # Page 404
│   │
│   ├── shared/                  # Module partagé
│   │   └── components/
│   │       └── chart/           # Composant graphique réutilisable
│   │
│   ├── app.module.ts            # Module principal
│   ├── app-routing.module.ts    # Configuration du routing
│   └── app.component.*          # Composant racine
│
├── assets/
│   ├── images/                  # Images statiques
│   └── mock/
│       └── olympic.json         # Données olympiques simulées
│
└── environments/                # Configuration d'environnement
```

---

## ✨ Fonctionnalités

### 🏠 Page d'accueil (Home)
- **Graphique circulaire (Pie Chart)** : Affiche la répartition des médailles par pays
- **Statistiques globales** :
  - Nombre de pays participants
  - Nombre d'éditions des JO
- **Navigation** : Cliquez sur une portion du graphique pour accéder au détail d'un pays

### 🌍 Page Pays (Country)
- **Graphique linéaire (Line Chart)** : Évolution des médailles par édition
- **Statistiques du pays** :
  - Nombre de participations
  - Total de médailles remportées
  - Total d'athlètes
- **Navigation** : Lien de retour vers l'accueil

### ⚠️ Page 404 (Not Found)
- Gestion des routes inexistantes
- Redirection automatique des URL invalides

---

## 📜 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Démarre le serveur de développement |
| `npm run build` | Build de production |
| `npm run watch` | Build en mode watch (développement) |
| `npm run lint` | Vérifie le code avec ESLint |

---

## 🏗️ Architecture

Le projet suit une architecture modulaire Angular avec :

- **CoreModule** : Services singleton et modèles de données
- **SharedModule** : Composants réutilisables (ChartComponent)
- **Pages** : Composants routés

Pour plus de détails, consultez le fichier [ARCHITECTURE.md](./ARCHITECTURE.md).
