import { beforeEach, describe, expect, it, vi } from 'vitest';
import { notesService } from '../services/notes';
import { useNotesStore } from './notesStore';

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn()
  }
}));

vi.mock('../services/notes', () => ({
  notesService: {
    lister: vi.fn(),
    creer: vi.fn(),
    modifier: vi.fn(),
    supprimer: vi.fn(),
    restaurer: vi.fn(),
    supprimerDefinitivement: vi.fn(),
    favori: vi.fn(),
    archiver: vi.fn(),
    epingler: vi.fn()
  }
}));

const note = {
  id: 'note-1',
  titre: 'Note',
  contenu: 'Contenu',
  couleur: '#06b6d4',
  estFavorite: false,
  estArchivee: false,
  estEpinglee: false,
  estSupprimee: false,
  supprimeeAt: null,
  tags: [],
  createdAt: '2026-05-08T00:00:00.000Z',
  updatedAt: '2026-05-08T00:00:00.000Z'
};

describe('notesStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNotesStore.setState({ notes: [], noteActive: null, chargement: false, filtres: {} });
    vi.mocked(notesService.lister).mockResolvedValue({ items: [note], pagination: { page: 1, limite: 12, total: 1, pages: 1 } });
  });

  it('met a jour la liste immediatement et resynchronise apres creation', async () => {
    vi.mocked(notesService.creer).mockResolvedValue(note);

    await useNotesStore.getState().creer({ titre: 'Note', contenu: 'Contenu' });

    expect(notesService.creer).toHaveBeenCalledOnce();
    expect(notesService.lister).toHaveBeenCalledOnce();
    expect(useNotesStore.getState().notes).toEqual([note]);
  });

  it('supprime la note immediatement et resynchronise ensuite', async () => {
    vi.mocked(notesService.supprimer).mockResolvedValue({ id: 'note-1' });
    vi.mocked(notesService.lister).mockResolvedValue({ items: [], pagination: { page: 1, limite: 12, total: 0, pages: 0 } });
    useNotesStore.setState({ notes: [note] });

    await useNotesStore.getState().supprimer('note-1');

    expect(notesService.supprimer).toHaveBeenCalledWith('note-1');
    expect(notesService.lister).toHaveBeenCalledOnce();
    expect(useNotesStore.getState().notes).toEqual([]);
  });

  it('met a jour le favori immediatement', async () => {
    const noteFavorite = { ...note, estFavorite: true };
    vi.mocked(notesService.favori).mockResolvedValue(noteFavorite);
    vi.mocked(notesService.lister).mockResolvedValue({ items: [noteFavorite], pagination: { page: 1, limite: 12, total: 1, pages: 1 } });
    useNotesStore.setState({ notes: [note] });

    await useNotesStore.getState().favori('note-1');

    expect(useNotesStore.getState().notes[0].estFavorite).toBe(true);
    expect(notesService.lister).toHaveBeenCalledOnce();
  });
});
