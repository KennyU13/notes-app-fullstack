import toast from 'react-hot-toast';
import { create } from 'zustand';
import { notesService, NotePayload } from '../services/notes';
import { Note } from '../types';

type Filtres = { recherche?: string; categorieId?: string; favoris?: boolean; archivees?: boolean };
type EtatNotes = {
  notes: Note[];
  noteActive: Note | null;
  chargement: boolean;
  filtres: Filtres;
  definirFiltres: (filtres: Partial<Filtres>) => void;
  charger: () => Promise<void>;
  creer: (payload: NotePayload) => Promise<Note>;
  modifier: (id: string, payload: Partial<NotePayload>) => Promise<Note>;
  supprimer: (id: string) => Promise<void>;
  favori: (id: string) => Promise<void>;
  archiver: (id: string) => Promise<void>;
};

export const useNotesStore = create<EtatNotes>((set, get) => ({
  notes: [],
  noteActive: null,
  chargement: false,
  filtres: {},
  definirFiltres: (filtres) => set((s) => ({ filtres: { ...s.filtres, ...filtres } })),
  charger: async () => {
    set({ chargement: true });
    try {
      const reponse = await notesService.lister(get().filtres);
      set({ notes: reponse.items });
    } finally {
      set({ chargement: false });
    }
  },
  creer: async (payload) => {
    const note = await notesService.creer(payload);
    await get().charger();
    toast.success('Note creee');
    return note;
  },
  modifier: async (id, payload) => {
    const note = await notesService.modifier(id, payload);
    set({ noteActive: note });
    await get().charger();
    toast.success('Note mise a jour');
    return note;
  },
  supprimer: async (id) => {
    await notesService.supprimer(id);
    await get().charger();
    toast.success('Note supprimee');
  },
  favori: async (id) => {
    await notesService.favori(id);
    await get().charger();
  },
  archiver: async (id) => {
    await notesService.archiver(id);
    await get().charger();
  }
}));
