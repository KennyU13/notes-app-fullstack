import { api } from './api';

export const categoriesService = {
  lister: () => api.get('/categories').then((r) => r.data.donnees),
  creer: (payload: { nom: string; couleur?: string; icone?: string }) => api.post('/categories', payload).then((r) => r.data.donnees),
  modifier: (id: string, payload: { nom?: string; couleur?: string; icone?: string }) => api.patch(`/categories/${id}`, payload).then((r) => r.data.donnees),
  supprimer: (id: string) => api.delete(`/categories/${id}`).then((r) => r.data.donnees)
};
