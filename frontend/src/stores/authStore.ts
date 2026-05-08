import toast from 'react-hot-toast';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { authService } from '../services/auth';
import { Utilisateur } from '../types';

type Session = { utilisateur: Utilisateur; accessToken: string; refreshToken: string };

type EtatAuth = {
  utilisateur: Utilisateur | null;
  token: string | null;
  refreshToken: string | null;
  estHydrate: boolean;
  definirSession: (session: Session) => void;
  definirUtilisateur: (utilisateur: Utilisateur) => void;
  definirHydratation: (estHydrate: boolean) => void;
  connexion: (email: string, motDePasse: string) => Promise<void>;
  inscription: (payload: { email: string; motDePasse: string; prenom: string; nom: string }) => Promise<void>;
  deconnexion: () => Promise<void>;
  modifierProfil: (payload: { prenom: string; nom: string }) => Promise<void>;
  modifierPhoto: (photo: File) => Promise<void>;
};

const stockageMemoire = (): StateStorage => {
  const donnees = new Map<string, string>();
  return {
    getItem: (nom) => donnees.get(nom) ?? null,
    setItem: (nom, valeur) => donnees.set(nom, valeur),
    removeItem: (nom) => donnees.delete(nom)
  };
};

const stockageAuth = () => (typeof localStorage === 'undefined' ? stockageMemoire() : localStorage);

export const useAuthStore = create<EtatAuth>()(
  persist(
    (set, get) => ({
      utilisateur: null,
      token: null,
      refreshToken: null,
      estHydrate: false,
      definirSession: (session) => set({ utilisateur: session.utilisateur, token: session.accessToken, refreshToken: session.refreshToken }),
      definirUtilisateur: (utilisateur) => set({ utilisateur }),
      definirHydratation: (estHydrate) => set({ estHydrate }),
      connexion: async (email, motDePasse) => {
        const session = await authService.connexion({ email, motDePasse });
        get().definirSession(session);
        toast.success('Connexion reussie');
      },
      inscription: async (payload) => {
        const session = await authService.inscription(payload);
        get().definirSession(session);
        toast.success('Bienvenue dans Notes App');
      },
      deconnexion: async () => {
        try { await authService.deconnexion(); } finally { set({ utilisateur: null, token: null, refreshToken: null }); }
        toast.success('Deconnexion reussie');
      },
      modifierProfil: async (payload) => {
        const utilisateur = await authService.modifierProfil(payload);
        set({ utilisateur });
        toast.success('Profil mis a jour');
      },
      modifierPhoto: async (photo) => {
        const utilisateur = await authService.modifierPhoto(photo);
        set({ utilisateur });
        toast.success('Photo de profil mise a jour');
      }
    }),
    {
      name: 'notes-auth',
      storage: createJSONStorage(stockageAuth),
      partialize: (etat) => ({ utilisateur: etat.utilisateur, token: etat.token, refreshToken: etat.refreshToken }),
      onRehydrateStorage: () => (etat) => {
        etat?.definirHydratation(true);
      }
    }
  )
);
