import toast from 'react-hot-toast';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth';
import { Utilisateur } from '../types';

type Session = { utilisateur: Utilisateur; accessToken: string; refreshToken: string };

type EtatAuth = {
  utilisateur: Utilisateur | null;
  token: string | null;
  refreshToken: string | null;
  definirSession: (session: Session) => void;
  connexion: (email: string, motDePasse: string) => Promise<void>;
  inscription: (payload: { email: string; motDePasse: string; prenom: string; nom: string }) => Promise<void>;
  deconnexion: () => Promise<void>;
};

export const useAuthStore = create<EtatAuth>()(
  persist(
    (set, get) => ({
      utilisateur: null,
      token: null,
      refreshToken: null,
      definirSession: (session) => set({ utilisateur: session.utilisateur, token: session.accessToken, refreshToken: session.refreshToken }),
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
      }
    }),
    { name: 'notes-auth' }
  )
);
