import { describe, expect, it } from 'vitest';
import { Note } from '../types';
import { trierNotes } from './trierNotes';

const creerNote = (surcharge: Partial<Note>): Note => ({
  id: surcharge.id ?? 'note',
  titre: surcharge.titre ?? 'Note',
  contenu: surcharge.contenu ?? 'Contenu',
  couleur: surcharge.couleur ?? '#8b5cf6',
  estFavorite: surcharge.estFavorite ?? false,
  estArchivee: surcharge.estArchivee ?? false,
  estEpinglee: surcharge.estEpinglee ?? false,
  estSupprimee: surcharge.estSupprimee ?? false,
  supprimeeAt: surcharge.supprimeeAt ?? null,
  categorieId: surcharge.categorieId,
  categorie: surcharge.categorie ?? null,
  tags: surcharge.tags ?? [],
  createdAt: surcharge.createdAt ?? '2026-01-01T00:00:00.000Z',
  updatedAt: surcharge.updatedAt ?? '2026-01-01T00:00:00.000Z'
});

describe('trierNotes', () => {
  it('trie par date de mise a jour recente', () => {
    const notes = [
      creerNote({ id: 'ancienne', updatedAt: '2026-01-01T00:00:00.000Z' }),
      creerNote({ id: 'recente', updatedAt: '2026-02-01T00:00:00.000Z' })
    ];

    expect(trierNotes(notes, 'date').map((note) => note.id)).toEqual(['recente', 'ancienne']);
  });

  it('trie par titre sans modifier la liste source', () => {
    const notes = [creerNote({ id: 'b', titre: 'Budget' }), creerNote({ id: 'a', titre: 'Achats' })];

    expect(trierNotes(notes, 'titre').map((note) => note.id)).toEqual(['a', 'b']);
    expect(notes.map((note) => note.id)).toEqual(['b', 'a']);
  });

  it('place les favoris en premier', () => {
    const notes = [creerNote({ id: 'normal' }), creerNote({ id: 'favori', estFavorite: true })];

    expect(trierNotes(notes, 'favoris').map((note) => note.id)).toEqual(['favori', 'normal']);
  });

  it('garde les notes epinglees en haut quel que soit le tri', () => {
    const notes = [
      creerNote({ id: 'z', titre: 'Zebre' }),
      creerNote({ id: 'm', titre: 'Memo', estEpinglee: true })
    ];

    expect(trierNotes(notes, 'titre').map((note) => note.id)).toEqual(['m', 'z']);
  });
});
