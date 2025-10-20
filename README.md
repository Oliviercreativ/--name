# Application de Réservation de Restaurant

Application web moderne de réservation de table pour restaurant, développée avec Nuxt 3 et base de données Neon PostgreSQL.

## Fonctionnalités

- **Réservation en ligne** : Formulaire intuitif pour réserver une table
- **Gestion administrative** : Interface d'administration pour gérer les réservations
- **Statuts de réservation** : En attente, Confirmée, Annulée, Terminée
- **Validation des données** : Validation côté client et serveur avec Zod
- **Interface moderne** : UI élégante avec Nuxt UI et TailwindCSS
- **Base de données serverless** : Neon PostgreSQL avec Drizzle ORM

## Technologies utilisées

- **Frontend** : Nuxt 3, Vue 3, TypeScript
- **UI** : Nuxt UI (basé sur TailwindCSS et Headless UI)
- **Backend** : Nuxt Server API
- **Base de données** : Neon PostgreSQL (serverless)
- **ORM** : Drizzle ORM
- **Validation** : Zod

## Installation

### Prérequis

- Node.js 18+ ou Bun
- Un compte Neon (https://neon.tech)

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd --name
```

2. **Installer les dépendances**
```bash
npm install
# ou
bun install
```

3. **Configuration de la base de données**

   a. Créer un compte sur [Neon](https://neon.tech)

   b. Créer une nouvelle base de données

   c. Copier la chaîne de connexion PostgreSQL

   d. Créer un fichier `.env` à la racine du projet :
   ```bash
   cp .env.example .env
   ```

   e. Ajouter votre URL de connexion dans `.env` :
   ```env
   DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/restaurant_db?sslmode=require
   ```

4. **Générer et appliquer les migrations**
```bash
npm run db:generate
npm run db:migrate
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Structure du projet

```
.
├── server/
│   ├── api/
│   │   └── reservations/          # Endpoints API CRUD
│   ├── db/
│   │   ├── schema.ts              # Schéma de base de données
│   │   ├── index.ts               # Configuration DB
│   │   └── migrations/            # Migrations Drizzle
│   └── utils/
│       └── validation.ts          # Schémas de validation Zod
├── pages/
│   ├── index.vue                  # Page d'accueil avec formulaire
│   └── admin.vue                  # Page d'administration
├── components/                    # Composants Vue réutilisables
├── app.vue                        # Layout principal
├── nuxt.config.ts                 # Configuration Nuxt
├── drizzle.config.ts              # Configuration Drizzle
└── package.json
```

## Utilisation

### Page client (/)

Page d'accueil où les clients peuvent :
- Consulter les informations du restaurant
- Remplir le formulaire de réservation
- Recevoir une confirmation

### Page administration (/admin)

Interface d'administration permettant de :
- Visualiser toutes les réservations
- Filtrer par statut
- Voir les statistiques
- Confirmer/Annuler/Terminer des réservations
- Voir les détails complets
- Supprimer des réservations

## API Endpoints

### GET /api/reservations
Récupère toutes les réservations

### POST /api/reservations
Crée une nouvelle réservation

**Body :**
```json
{
  "customerName": "Jean Dupont",
  "customerEmail": "jean@example.com",
  "customerPhone": "0612345678",
  "reservationDate": "2024-12-25T19:00:00.000Z",
  "numberOfGuests": 4,
  "specialRequests": "Allergie aux fruits de mer"
}
```

### GET /api/reservations/:id
Récupère une réservation spécifique

### PATCH /api/reservations/:id
Met à jour une réservation

**Body :**
```json
{
  "status": "confirmed",
  "numberOfGuests": 5
}
```

### DELETE /api/reservations/:id
Supprime une réservation

## Scripts disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview production
npm run preview

# Générer les migrations DB
npm run db:generate

# Appliquer les migrations DB
npm run db:migrate

# Ouvrir Drizzle Studio (interface DB)
npm run db:studio
```

## Base de données

### Schéma de la table `reservations`

| Colonne | Type | Description |
|---------|------|-------------|
| id | serial | Identifiant unique |
| customerName | varchar(100) | Nom du client |
| customerEmail | varchar(255) | Email du client |
| customerPhone | varchar(20) | Téléphone du client |
| reservationDate | timestamp | Date et heure de la réservation |
| numberOfGuests | integer | Nombre de personnes |
| specialRequests | text | Demandes spéciales (optionnel) |
| status | enum | Statut (pending, confirmed, cancelled, completed) |
| createdAt | timestamp | Date de création |
| updatedAt | timestamp | Date de modification |

## Déploiement

### Vercel (recommandé)

1. Connecter votre repository GitHub à Vercel
2. Ajouter la variable d'environnement `DATABASE_URL` dans les settings Vercel
3. Déployer

### Netlify

1. Connecter votre repository à Netlify
2. Ajouter la variable d'environnement `DATABASE_URL`
3. Déployer

## Personnalisation

### Modifier le nom du restaurant
Éditer `pages/index.vue` et `pages/admin.vue` pour changer "Le Bon Resto"

### Modifier les couleurs
Le thème utilise principalement la couleur `orange`. Pour changer :
- Modifier les classes `text-orange-*`, `bg-orange-*` dans les composants
- Ou personnaliser le thème dans `nuxt.config.ts`

### Ajouter des champs à la réservation
1. Modifier `server/db/schema.ts` pour ajouter les colonnes
2. Générer une migration avec `npm run db:generate`
3. Appliquer avec `npm run db:migrate`
4. Mettre à jour les schémas de validation dans `server/utils/validation.ts`
5. Modifier les formulaires dans `pages/index.vue` et `pages/admin.vue`

## Licence

MIT

## Support

Pour toute question ou problème, ouvrir une issue sur le repository GitHub.
