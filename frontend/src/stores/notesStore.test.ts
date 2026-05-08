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
    favori: vi.fn(),
    archiver: vi.fn()
  }
}));

const note = {
  id: 'note-1',
  titre: 'Note',
  contenu: 'Contenu',
  couleur: '#06b6d4',
  estFavorite: false,
  estArchivee: false,
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

  it('recharge la liste depuis l API apres creation', async () => {
    vi.mocked(notesService.creer).mockResolvedValue(note);

    await useNotesStore.getState().creer({ titre: 'Note', contenu: 'Contenu' });

    expect(notesService.creer).toHaveBeenCalledOnce();
    expect(notesService.lister).toHaveBeenCalledOnce();
    expect(useNotesStore.getState().notes).toEqual([note]);
  });

  it('recharge la liste depuis l API apres suppression', async () => {
    vi.mocked(notesService.supprimer).mockResolvedValue({ id: 'note-1' });

    await useNotesStore.getState().supprimer('note-1');

    expect(notesService.supprimer).toHaveBeenCalledWith('note-1');
    expect(notesService.lister).toHaveBeenCalledOnce();
  });
});
