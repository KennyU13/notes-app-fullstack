import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

type EtatUi = {
  theme: 'dark' | 'light';
  vue: 'grille' | 'liste';
  sidebarOuverte: boolean;
  basculerTheme: () => void;
  definirVue: (vue: 'grille' | 'liste') => void;
  basculerSidebar: () => void;
};

const stockageMemoire = (): StateStorage => {
  const donnees = new Map<string, string>();
  return {
    getItem: (nom) => donnees.get(nom) ?? null,
    setItem: (nom, valeur) => donnees.set(nom, valeur),
    removeItem: (nom) => donnees.delete(nom)
  };
};

const stockageUi = () => (typeof localStorage === 'undefined' ? stockageMemoire() : localStorage);

export const useUiStore = create<EtatUi>()(
  persist(
    (set) => ({
      theme: 'dark',
      vue: 'grille',
      sidebarOuverte: false,
      basculerTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      definirVue: (vue) => set({ vue }),
      basculerSidebar: () => set((s) => ({ sidebarOuverte: !s.sidebarOuverte }))
    }),
    { name: 'notes-ui', storage: createJSONStorage(stockageUi) }
  )
);
