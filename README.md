# RestauPlanning

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Application web de gestion des horaires et planning du personnel pour restaurants. Cette application permet de simplifier l'organisation des équipes, optimiser les coûts et améliorer la satisfaction des employés.

## 📋 Fonctionnalités

- **Tableau de bord** : Vue d'ensemble du planning, statistiques et alertes
- **Gestion du personnel** : Informations sur les employés, disponibilités et compétences
- **Planning hebdomadaire** : Visualisation et gestion des horaires du personnel
- **Prévisions d'activité** : Basées sur l'historique et les événements spéciaux
- **Alertes automatiques** : Congés à venir, conflits d'horaires, conformité légale
- **Génération automatique** : Création automatique de plannings en respectant les contraintes

## 🚀 Installation et démarrage

### Prérequis

- Node.js (v14.0.0 ou supérieur)
- npm (v6.0.0 ou supérieur)

### Installation

1. Clonez le dépôt
```bash
git clone https://github.com/dimiloud/restau-planning.git
cd restau-planning
```

2. Installez les dépendances
```bash
npm install
```

3. Lancez l'application en mode développement
```bash
npm start
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

### Construire pour la production

```bash
npm run build
```

Cette commande génère une version optimisée de l'application dans le dossier `build/`.

## 🔧 Personnalisation

### Données initiales

Les données initiales du restaurant sont définies dans le fichier `src/model/donnees.js`. Vous pouvez les modifier selon vos besoins:

- Informations du restaurant
- Liste du personnel
- Prévisions d'activité
- Planning existant

### Modèles de services

La génération automatique des plannings utilise des modèles prédéfinis pour les services (déjeuner et dîner). Vous pouvez personnaliser ces modèles dans la fonction `genererPlanning()` du fichier `src/utils/planningUtils.js`.

## 📱 Versions mobiles

L'application peut être adaptée pour une utilisation mobile de plusieurs façons:

1. **Progressive Web App (PWA)** : L'application actuelle peut être transformée en PWA avec quelques configurations supplémentaires.

2. **Application native** : Le code peut être adapté pour React Native afin de créer une application mobile native.

3. **Application hybride** : Utilisation de Capacitor ou Cordova pour encapsuler l'application web dans une application mobile.

## 📖 Utilisation

### Tableau de bord

Le tableau de bord fournit une vue d'ensemble de la semaine en cours avec:
- Statistiques du personnel
- Planning hebdomadaire
- Alertes importantes

### Gestion du personnel

Cette section permet de:
- Ajouter de nouveaux employés
- Modifier les informations du personnel existant
- Gérer les disponibilités et compétences
- Planifier les congés

### Génération automatique

Pour générer un planning automatiquement:
1. Accédez au tableau de bord
2. Sélectionnez la semaine désirée
3. Cliquez sur "Générer Planning Automatique"

Le système créera un planning optimisé en tenant compte:
- Des disponibilités du personnel
- Des compétences requises
- Des contraintes légales
- Des prévisions d'activité

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
