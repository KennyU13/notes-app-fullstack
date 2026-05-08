import { api } from './api';

export const authService = {
  connexion: (payload: { email: string; motDePasse: string }) => api.post('/auth/connexion', payload).then((r) => r.data.donnees),
  inscription: (payload: { email: string; motDePasse: string; prenom: string; nom: string }) =>
    api.post('/auth/inscription', payload).then((r) => r.data.donnees),
  profil: () => api.get('/utilisateurs/profil').then((r) => r.data.donnees),
  modifierProfil: (payload: { prenom: string; nom: string }) => api.patch('/utilisateurs/profil', payload).then((r) => r.data.donnees),
  modifierPhoto: (photo: File) => {
    const donnees = new FormData();
    donnees.append('photo', photo);
    return api.post('/utilisateurs/profil/photo', donnees).then((r) => r.data.donnees);
  },
  deconnexion: () => api.post('/auth/deconnexion'),
  rafraichir: (refreshToken: string) => api.post('/auth/rafraichir-token', { refreshToken }).then((r) => r.data.donnees)
};
