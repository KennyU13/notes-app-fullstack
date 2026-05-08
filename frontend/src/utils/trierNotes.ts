import { Note } from '../types';

export type TriNotes = 'date' | 'titre' | 'favoris' | 'couleur' | 'categorie';

const dateMiseAJour = (note: Note) => new Date(note.updatedAt).getTime();
const nomCategorie = (note: Note) => note.categorie?.nom ?? 'Sans categorie';

export function trierNotes(notes: Note[], tri: TriNotes) {
  return [...notes].sort((a, b) => {
    const epinglees = Number(b.estEpinglee) - Number(a.estEpinglee);
    if (epinglees !== 0) return epinglees;

    switch (tri) {
      case 'titre':
        return a.titre.localeCompare(b.titre, 'fr', { sensitivity: 'base' }) || dateMiseAJour(b) - dateMiseAJour(a);
      case 'favoris':
        return Number(b.estFavorite) - Number(a.estFavorite) || dateMiseAJour(b) - dateMiseAJour(a);
      case 'couleur':
        return a.couleur.localeCompare(b.couleur, 'fr', { sensitivity: 'base' }) || dateMiseAJour(b) - dateMiseAJour(a);
      case 'categorie':
        return nomCategorie(a).localeCompare(nomCategorie(b), 'fr', { sensitivity: 'base' }) || dateMiseAJour(b) - dateMiseAJour(a);
      case 'date':
      default:
        return dateMiseAJour(b) - dateMiseAJour(a);
    }
  });
}
