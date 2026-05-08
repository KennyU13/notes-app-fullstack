import { api } from './api';

export const authService = {
  connexion: (payload: { email: string; motDePasse: string }) => api.post('/auth/connexion', payload).then((r) => r.data.donnees),
  inscription: (payload: { email: string; motDePasse: string; prenom: string; nom: string }) =>
    api.post('/auth/inscription', payload).then((r) => r.data.donnees),
  deconnexion: () => api.post('/auth/deconnexion'),
  rafraichir: (refreshToken: string) => api.post('/auth/rafraichir-token', { refreshToken }).then((r) => r.data.donnees)
};
