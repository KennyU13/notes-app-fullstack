import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type EtatUi = {
  theme: 'dark' | 'light';
  vue: 'grille' | 'liste';
  sidebarOuverte: boolean;
  basculerTheme: () => void;
  definirVue: (vue: 'grille' | 'liste') => void;
  basculerSidebar: () => void;
};

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
    { name: 'notes-ui' }
  )
);
