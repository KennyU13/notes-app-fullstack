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
- `PORT`

## Documentation

Swagger est disponible sur `/documentation` quand le serveur tourne.

## Reponses API

Toutes les reponses suivent le format :

```json
{ "succes": true, "donnees": {}, "message": "Optionnel" }
```
