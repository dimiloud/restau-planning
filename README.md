# RestauPlanning

Application de gestion des horaires et planning du personnel pour restaurant.

## Fonctionnalités

- **Tableau de bord** : Vue d'ensemble du planning, statistiques et alertes
- **Gestion du personnel** : Informations sur les employés, disponibilités et compétences
- **Planning hebdomadaire** : Visualisation et gestion des horaires
- **Prévisions d'activité** : Basées sur l'historique et les événements spéciaux
- **Alertes automatiques** : Congés à venir, conflits d'horaires, etc.
- **Génération automatique** : Création automatique de plannings en respectant les contraintes

## Structure du projet

Le projet est organisé comme suit:

```
restau-planning/
├── src/
│   ├── model/         # Modèles de données
│   ├── utils/         # Fonctions utilitaires
│   ├── components/    # Composants UI
│   ├── store/         # Gestion de l'état (avec Zustand ou Pinia)
│   └── views/         # Vues/Pages de l'application
└── public/            # Ressources statiques
```

## Technologies utilisées

- **Frontend**: Javascript/Vue.js ou React
- **Gestion d'état**: Zustand (React) ou Pinia (Vue.js)
- **Stockage**: localStorage, éventuellement une API backend
- **UI**: CSS personnalisé ou framework UI (Tailwind, Bootstrap)

## Installation et utilisation

### Installation des dépendances

```bash
# Cloner le dépôt
git clone https://github.com/dimiloud/restau-planning.git
cd restau-planning

# Installer les dépendances
npm install
```

### Lancer l'application en développement

```bash
npm run dev
```

### Construire pour la production

```bash
npm run build
```

## Options d'intégration

### Version Web

L'application peut être déployée comme un site web classique accessible depuis n'importe quel navigateur.

### Version Mobile

Pour une version mobile, le code peut être adapté pour:
- Une Progressive Web App (PWA)
- Une application native avec React Native
- Une application hybride avec Capacitor/Cordova

## Fonctionnalités à venir

- Système de notification par email/SMS
- Intégration avec les systèmes de caisse
- Module de gestion des paies
- Statistiques avancées
- Application mobile dédiée

## Licence

Ce projet est sous licence MIT.
