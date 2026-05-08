# Backend Notes App

API REST NestJS pour notes personnelles.

## Installation locale

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run start:dev
```

## Variables d'environnement

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `JWT_REFRESH_EXPIRATION`
- `SEED_DEMO_DATA`
- `PORT`

## Base de donnees automatisee

Avec Docker, le backend execute au demarrage :

```bash
npm run db:setup
```

Cette commande applique les migrations Prisma et lance le seed. Le seed cree les donnees demo seulement si `SEED_DEMO_DATA=true`.

Compte demo local :

- Email : `demo@notes.local`
- Mot de passe : `password123`

## Documentation

Swagger est disponible sur `/documentation` quand le serveur tourne.

## Fonctionnalites backend

- Upload de pieces jointes sur les notes.
- Export des notes en JSON, Markdown ou PDF.
- Modification du profil utilisateur : email, photo, naissance, poste, CIN, accroche et atouts.
- Refresh token stocke hashe, Helmet, limitation des tentatives de connexion et logs d'audit.

## Reponses API

Toutes les reponses suivent le format :

```json
{ "succes": true, "donnees": {}, "message": "Optionnel" }
```
