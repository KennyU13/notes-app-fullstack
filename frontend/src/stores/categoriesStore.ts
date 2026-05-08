import toast from 'react-hot-toast';
import { create } from 'zustand';
import { categoriesService } from '../services/categories';
import { Categorie } from '../types';

type EtatCategories = {
  categories: Categorie[];
  chargement: boolean;
  charger: () => Promise<void>;
  creer: (payload: { nom: string; couleur?: string; icone?: string }) => Promise<void>;
  supprimer: (id: string) => Promise<void>;
};

export const useCategoriesStore = create<EtatCategories>((set, get) => ({
  categories: [],
  chargement: false,
  charger: async () => {
    set({ chargement: true });
    try {
      set({ categories: await categoriesService.lister() });
    } finally {
      set({ chargement: false });
    }
  },
  creer: async (payload) => {
    await categoriesService.creer(payload);
    toast.success('Categorie creee');
    await get().charger();
  },
  supprimer: async (id) => {
    await categoriesService.supprimer(id);
    toast.success('Categorie supprimee');
    await get().charger();
  }
}));
