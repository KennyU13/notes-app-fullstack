import { api } from './api';

export const tagsService = {
  lister: () => api.get('/tags').then((r) => r.data.donnees),
  creer: (nom: string) => api.post('/tags', { nom }).then((r) => r.data.donnees),
  supprimer: (id: string) => api.delete(`/tags/${id}`).then((r) => r.data.donnees)
};
