# Frontend Notes App

Interface React glassmorphique pour la gestion de notes.

## Installation locale

```bash
npm install
cp .env.example .env
npm run dev
```

Le frontend tourne sur http://localhost:5173 et appelle l'API sur `VITE_API_URL`.

## Fonctionnalites

- Authentification avec refresh token automatique.
- Routes protegees.
- Recherche debounced.
- Notes en grille ou liste.
- Tri des notes par date, titre, favoris, couleur ou categorie.
- Creation, edition, suppression, favoris et archivage.
- Page detail categorie avec couleur, nombre de notes et notes associees.
- Categories, profil, notifications et animations.
