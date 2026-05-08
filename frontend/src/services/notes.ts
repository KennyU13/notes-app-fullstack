import { Note } from '../types';
import { api } from './api';

export type NotePayload = { titre: string; contenu: string; couleur?: string; categorieId?: string | null; tags?: string[] };

export const notesService = {
  lister: (params?: Record<string, unknown>) => api.get('/notes', { params }).then((r) => r.data.donnees),
  obtenir: (id: string) => api.get(`/notes/${id}`).then((r) => r.data.donnees as Note),
  creer: (payload: NotePayload) => api.post('/notes', payload).then((r) => r.data.donnees as Note),
  modifier: (id: string, payload: Partial<NotePayload>) => api.patch(`/notes/${id}`, payload).then((r) => r.data.donnees as Note),
  supprimer: (id: string) => api.delete(`/notes/${id}`).then((r) => r.data.donnees),
  restaurer: (id: string) => api.patch(`/notes/${id}/restaurer`).then((r) => r.data.donnees as Note),
  supprimerDefinitivement: (id: string) => api.delete(`/notes/${id}/definitif`).then((r) => r.data.donnees),
  favori: (id: string) => api.patch(`/notes/${id}/favori`).then((r) => r.data.donnees as Note),
  archiver: (id: string) => api.patch(`/notes/${id}/archiver`).then((r) => r.data.donnees as Note),
  epingler: (id: string) => api.patch(`/notes/${id}/epingler`).then((r) => r.data.donnees as Note),
  ajouterPieceJointe: (id: string, fichier: File) => {
    const donnees = new FormData();
    donnees.append('fichier', fichier);
    return api.post(`/notes/${id}/pieces-jointes`, donnees).then((r) => r.data.donnees);
  },
  supprimerPieceJointe: (id: string) => api.delete(`/notes/pieces-jointes/${id}`).then((r) => r.data.donnees),
  exporter: (format: 'json' | 'markdown' | 'pdf') => api.get(`/notes/export/${format}`, { responseType: 'blob' })
};
