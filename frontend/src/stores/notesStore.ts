import toast from 'react-hot-toast';
import { create } from 'zustand';
import { notesService, NotePayload } from '../services/notes';
import { Note } from '../types';

type Filtres = { recherche?: string; categorieId?: string; tagId?: string; favoris?: boolean; archivees?: boolean; corbeille?: boolean };
type EtatNotes = {
  notes: Note[];
  noteActive: Note | null;
  chargement: boolean;
  filtres: Filtres;
  definirFiltres: (filtres: Partial<Filtres>) => void;
  charger: (silencieux?: boolean) => Promise<void>;
  creer: (payload: NotePayload) => Promise<Note>;
  modifier: (id: string, payload: Partial<NotePayload>) => Promise<Note>;
  supprimer: (id: string) => Promise<void>;
  restaurer: (id: string) => Promise<void>;
  supprimerDefinitivement: (id: string) => Promise<void>;
  favori: (id: string) => Promise<void>;
  archiver: (id: string) => Promise<void>;
  epingler: (id: string) => Promise<void>;
};

const remplacer = (notes: Note[], note: Note) => notes.map((item) => (item.id === note.id ? note : item));

export const useNotesStore = create<EtatNotes>((set, get) => ({
  notes: [],
  noteActive: null,
  chargement: false,
  filtres: {},
  definirFiltres: (filtres) => set((s) => ({ filtres: { ...s.filtres, ...filtres } })),
  charger: async (silencieux = false) => {
    if (!silencieux) set({ chargement: true });
    try {
      const reponse = await notesService.lister(get().filtres);
      set({ notes: reponse.items });
    } finally {
      if (!silencieux) set({ chargement: false });
    }
  },
  creer: async (payload) => {
    const note = await notesService.creer(payload);
    set((s) => ({ notes: [note, ...s.notes] }));
    void get().charger(true);
    toast.success('Note creee');
    return note;
  },
  modifier: async (id, payload) => {
    const note = await notesService.modifier(id, payload);
    set((s) => ({ notes: remplacer(s.notes, note), noteActive: note }));
    void get().charger(true);
    toast.success('Note mise a jour');
    return note;
  },
  supprimer: async (id) => {
    await notesService.supprimer(id);
    set((s) => ({ notes: s.notes.filter((note) => note.id !== id) }));
    void get().charger(true);
    toast.success('Note deplacee dans la corbeille');
  },
  restaurer: async (id) => {
    const note = await notesService.restaurer(id);
    set((s) => ({ notes: s.notes.filter((item) => item.id !== id), noteActive: note }));
    void get().charger(true);
    toast.success('Note restauree');
  },
  supprimerDefinitivement: async (id) => {
    await notesService.supprimerDefinitivement(id);
    set((s) => ({ notes: s.notes.filter((note) => note.id !== id) }));
    void get().charger(true);
    toast.success('Note supprimee definitivement');
  },
  favori: async (id) => {
    const note = await notesService.favori(id);
    set((s) => ({ notes: remplacer(s.notes, note) }));
    void get().charger(true);
  },
  archiver: async (id) => {
    const note = await notesService.archiver(id);
    set((s) => ({ notes: remplacer(s.notes, note) }));
    void get().charger(true);
  },
  epingler: async (id) => {
    const note = await notesService.epingler(id);
    set((s) => ({ notes: remplacer(s.notes, note) }));
    void get().charger(true);
  }
}));
