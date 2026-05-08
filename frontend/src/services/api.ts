import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
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
    if (erreur.response?.status === 401 && refreshToken && !requete._retry) {
      requete._retry = true;
      const reponse = await api.post('/auth/rafraichir-token', { refreshToken });
      useAuthStore.getState().definirSession(reponse.data.donnees);
      requete.headers.Authorization = `Bearer ${reponse.data.donnees.accessToken}`;
      return api(requete);
    }
    return Promise.reject(erreur);
  }
);
