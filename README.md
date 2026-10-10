# GeoApp

Application mobile hybride de géolocalisation développée avec **Ionic / Angular**.
Elle permet de consulter sa position GPS, de suivre ses déplacements en temps réel,
de mesurer la distance entre sa position et un point choisi sur une carte, et de
conserver un historique des mesures.

## Fonctionnalités

- **Position ponctuelle** : récupération de la latitude, longitude et altitude via le GPS de l'appareil.
- **Suivi en temps réel** : abonnement continu à la position, avec compteur de points reçus et durée du suivi.
- **Carte interactive** : affichage OpenStreetMap (Leaflet) centré sur la position courante.
- **Mesure de distance** : un appui sur la carte calcule la distance (m / km) entre la position et le point sélectionné.
- **Historique** : sauvegarde et consultation des positions et distances dans une base **Firebase Firestore**, avec suppression d'une entrée.
- **Gestion des erreurs GPS** : permissions refusées, position indisponible, délai dépassé.

## Stack technique

| Domaine | Technologie |
| --- | --- |
| Framework | Angular 22 (standalone components) |
| UI mobile | Ionic 9 |
| Cartographie | Leaflet + OpenStreetMap |
| Géolocalisation | `@awesome-cordova-plugins/geolocation` |
| Base de données | Firebase Firestore |
| Packaging natif | Capacitor / Cordova (Android & iOS) |
| Langage | TypeScript |
| Tests | Vitest |

## Architecture

```
src/
├── app/
│   ├── home/          # Écran principal : position ponctuelle et suivi GPS
│   ├── map/           # Carte Leaflet et calcul de distance
│   ├── historique/    # Liste des entrées enregistrées (Firebase)
│   ├── services/      # HistoriqueService : accès à Firestore
│   ├── app.routes.ts  # Définition des routes
│   └── app.component.ts
├── environments/      # Configuration par environnement
└── theme/             # Thème et variables SCSS Ionic
```

## Prérequis

- [Node.js](https://nodejs.org/) (version LTS recommandée)
- [Ionic CLI](https://ionicframework.com/docs/cli) : `npm install -g @ionic/cli`
- Un appareil ou émulateur Android / iOS pour l'exécution native

## Installation

```bash
npm install
```

## Configuration

Les identifiants Firebase sont définis dans `src/environments/environment.ts`
(développement) et `src/environments/environment.prod.ts` (production).

> ⚠️ La clé API Firebase d'une application web est destinée à être publique et
> ne constitue pas, à elle seule, un secret. La sécurité repose sur la
> **configuration des règles de sécurité Firestore** et sur les **restrictions
> de clé** (domaines autorisés, App Check). Voir la section « Sécurité ».

## Développement

```bash
npm start        # Serveur de développement (ng serve)
npm run build    # Build de production
npm test         # Tests unitaires
npm run lint     # Analyse statique du code
```

### Exécution native

```bash
npm run build
npx cap sync
npx cap open android   # ou : npx cap open ios
```

## Sécurité

Avant toute mise en production :

1. **Règles Firestore** : restreindre la lecture et l'écriture aux utilisateurs
   autorisés (éviter le mode test grand public).
2. **Restrictions de clé API** : limiter la clé aux domaines et applications
   légitimes dans la Google Cloud Console.
3. **App Check** : activer la vérification d'application Firebase pour bloquer
   les clients non autorisés.
4. **Ne pas versionner de secrets** : privilégier des variables d'environnement
   ou un gestionnaire de secrets pour toute information réellement sensible.

## Auteur

- **Eyablg-ops** — https://github.com/Eyablg-ops

## Licence

Projet à usage pédagogique et personnel.
