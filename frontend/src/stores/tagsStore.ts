import { create } from 'zustand';
import { tagsService } from '../services/tags';
import { Tag } from '../types';

type EtatTags = {
  tags: Tag[];
  chargement: boolean;
  charger: () => Promise<void>;
};

export const useTagsStore = create<EtatTags>((set) => ({
  tags: [],
  chargement: false,
  charger: async () => {
    set({ chargement: true });
    try {
      set({ tags: await tagsService.lister() });
    } finally {
      set({ chargement: false });
    }
  }
}));
