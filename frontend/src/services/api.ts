import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (reponse) => reponse,
  async (erreur) => {
    const requete = erreur.config;
    const refreshToken = useAuthStore.getState().refreshToken;
    const url = String(requete?.url ?? '');
    const routeAuth = url.includes('/auth/connexion') || url.includes('/auth/inscription') || url.includes('/auth/rafraichir-token');
    if (erreur.response?.status === 401 && refreshToken && !requete._retry && !routeAuth) {
      requete._retry = true;
      const reponse = await api.post('/auth/rafraichir-token', { refreshToken });
      useAuthStore.getState().definirSession(reponse.data.donnees);
      requete.headers.Authorization = `Bearer ${reponse.data.donnees.accessToken}`;
      return api(requete);
    }
    const message = erreur.response?.data?.message ?? (erreur.request ? 'API inaccessible. Verifiez que le backend tourne sur http://localhost:3001.' : 'Une erreur est survenue');
    toast.error(message);
    return Promise.reject(erreur);
  }
);
