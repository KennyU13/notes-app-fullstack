# Notes App

Application de gestion de notes personnelles en monorepo :

- `backend/` : API REST NestJS, PostgreSQL, Prisma, JWT, Swagger.
- `frontend/` : React 18, Vite, TypeScript, Tailwind CSS, Zustand.
- `docker-compose.yml` : environnement local complet.

## Demarrage rapide

```bash
docker-compose up --build
```

Services disponibles :

- Frontend : http://localhost:5173
- Backend : http://localhost:3000
- Swagger : http://localhost:3000/documentation
- PostgreSQL : localhost:5432

## Production

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

Avant une vraie mise en production, remplacez `JWT_SECRET` et les identifiants PostgreSQL.

## Reset BDD

```bash
docker-compose down -v
docker-compose up -d --build
```

## Etat initial verifie

Le dossier etait vide avant generation et aucun depot Git n'etait initialise.
