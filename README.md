# Notes App

Application de gestion de notes personnelles en monorepo :

- `backend/` : API REST NestJS, PostgreSQL, Prisma, JWT, Swagger.
- `frontend/` : React 18, Vite, TypeScript, Tailwind CSS, Zustand.
- `docker-compose.yml` : environnement local complet.

## Demarrage rapide

```bash
docker-compose up --build
```

Au demarrage Docker, le backend attend que PostgreSQL soit pret, applique les migrations Prisma, puis lance le seed local si `SEED_DEMO_DATA=true`.

Compte demo cree en local :

- Email : `demo@notes.local`
- Mot de passe : `password123`

Services disponibles :

- Frontend : http://localhost:5173
- Backend : http://localhost:3000
- Swagger : http://localhost:3000/documentation
- PostgreSQL : localhost:5432

Fonctionnalites principales :

- Gestion des notes, favoris, archives, categories et tags.
- Page detail categorie avec nombre de notes et liste associee.
- Recherche avancee combinant mot-cle, categorie, tag, favori et archive.
- Tri des notes par date, titre, favoris, couleur ou categorie, avec notes epinglees en haut.
- Corbeille avec restauration avant suppression definitive.
- Pieces jointes et images ajoutees aux notes.
- Export des notes en JSON, Markdown ou PDF.
- Securite renforcee : Helmet, refresh token hashe, limitation des tentatives de connexion et logs d'audit.
- Tableau de bord avec statistiques, notes recentes et repartition par categorie.
- Profil modifiable avec photo, email, naissance, poste, CIN, accroche et atouts.

## Tests

```bash
cd backend
npm test

cd ../frontend
npm test
npm run test:e2e
```

Les tests end-to-end Playwright supposent que l'application Docker tourne sur `http://localhost:5173` et que l'API est disponible sur `http://localhost:3000`.

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

## Base de donnees

Commandes utiles :

```bash
docker compose exec backend npm run db:setup
docker compose exec -e SEED_DEMO_DATA=true backend npm run db:seed
```

`db:setup` execute les migrations puis le seed. En production, gardez `SEED_DEMO_DATA` absent ou a `false`.

## Etat initial verifie

Le dossier etait vide avant generation et aucun depot Git n'etait initialise.
