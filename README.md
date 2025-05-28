# QVEMA - Plateforme de mise en relation entrepreneurs/investisseurs

API NestJS permettant de connecter des entrepreneurs et des investisseurs.

## Installation

```bash
# Installer les dépendances
npm install

# Configurer la base de données
# Créer un fichier .env à la racine du projet avec les variables suivantes:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USERNAME=root
# DB_PASSWORD=password
# DB_DATABASE=qvema
# JWT_SECRET=votre_secret_jwt
```

## Lancement

```bash
# Démarrer l'application en mode développement
npm run dev

# compiler l'application
npm run build

# demarrer l'appli
npm run start:prod
```

## Structure du projet

Le projet est organisé en modules suivant l'architecture NestJS:

- **Admin**: Gestion du tableau de bord administrateur
- **Auth**: Authentification et autorisation
- **Interests**: Gestion des centres d'intérêt
- **Investments**: Gestion des investissements
- **Projects**: Gestion des projets
- **Users**: Gestion des utilisateurs

## Documentation API

Une documentation Postman complète est disponible dans le dossier `docs/`.

Pour tester l'API:
1. Importer la collection `docs/QVEMA_API_Collection.postman_collection.json` dans Postman
2. Importer l'environnement `docs/QVEMA_Local.postman_environment.json`
3. Suivre le guide détaillé dans `docs/POSTMAN_GUIDE.md`

## Rôles

L'application gère trois types d'utilisateurs:
- **Entrepreneur**: Peut créer et gérer des projets
- **Investisseur**: Peut investir dans des projets
- **Admin**: A accès à toutes les fonctionnalités de l'application