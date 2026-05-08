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
- Recherche debounced avec filtres avances par categorie, tag, favori et archive.
- Notes en grille ou liste.
- Tri des notes par date, titre, favoris, couleur ou categorie.
- Epinglage des notes importantes en haut de liste.
- Corbeille avec restauration.
- Upload de pieces jointes ou images dans une note.
- Export JSON, Markdown et PDF depuis la liste des notes.
- Tableau de bord enrichi et profil modifiable avec photo.
- Categories modernisees avec couleurs, icones et compteurs.
- Creation, edition, suppression, favoris et archivage.
- Page detail categorie avec couleur, nombre de notes et notes associees.
- Categories, profil, notifications et animations.
