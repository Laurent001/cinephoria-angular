# Cinephoria Frontend

Ce dépôt contient le frontend Angular de l'application Cinephoria.
L'application est internationalisée, utilise le Material Design.

## Fonctionnalités principales

- Gestion des rôles et des pages dynamiques
- Réservation de places de cinéma
- Authentification (avec reset mot de passe)
- Composants Angular Material
- Internationalisation (français / anglais)
- Intégration QR code et scan

## Installation

Cloner le dépôt et installer les dépendances :

git clone https://github.com/Laurent001/cinephoria-angular/cinephoria-angular.git
cd cinephoria-angular
npm install

## Lancement en développement

ng serve

Ou avec tunnel SSH + accès distant (utile pour application android):

npm run dev

## Scripts utiles

npm run build:angular:dev # Build Angular en mode développement (watch)
npm run build:angular:prod # Build Angular en production
npm run build:android:dev # Build + ajout plateforme + ouverture Android Studio
npm run build:sync-android:dev # Build + sync avec Android (sans ajout de plateforme)
npm run deploy-front-dev # Déploiement manuel en SSH sur serveur distant
npm run delete-front-dev # Suppression manuelle du frontend distant
npm run test # Lancement des tests unitaires
npm run lint # Linting avec ESLint

## Structure

cinephoria-angular/
├── src/
│ ├── app/ # Composants, services, modules
│ ├── assets/ # Fichiers statiques (icônes, i18n)
│ ├── environments/ # Fichiers d’environnement Angular
│ ├── global.scss # Feuille de style principale
│ └── index.html # Entrée HTML principale
├── scripts/ # Scripts Node pour enrichissement Capacitor
├── .github/ # Workflows CI/CD GitHub Actions
├── angular.json # Configuration Angular CLI
├── capacitor.config.ts # Configuration Capacitor
├── package.json # Dépendances et scripts
└── tsconfig\*.json # Configuration TypeScript

## Environnements

Les environnements sont définis dans :

- src/environments/environment.ts (dev par défaut)
- src/environments/environment.prod.ts (prod)

## Déploiement

### Android (Capacitor)

npm run build:android:dev # Construire et ouvrir Android Studio

Puis, lancer depuis Android Studio. Construire l'apk depuis cet outil en vue d'un déploiement en production.

Pour le scan du QR Code :

- Caméra activable
- Configuration dans `capacitor.config.ts`

## Internationalisation (i18n)

Les fichiers de traduction sont situés dans `src/assets/i18n/` :

- fr.json
- en.json

Le service utilise `@ngx-translate/core`.

## Tests

Lancement des tests avec Karma :

npm run test

## Lint

npm run lint

## Dépendances principales

- Angular
- Angular Material
- Bootstrap & Bootstrap Icons
- ngx-translate
- Capacitor
- ng2-charts
- QR Code (jsqr)
