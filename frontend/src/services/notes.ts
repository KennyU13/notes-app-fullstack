import { Note } from '../types';
import { api } from './api';

export type NotePayload = { titre: string; contenu: string; couleur?: string; categorieId?: string; tags?: string[] };

export const notesService = {
  lister: (params?: Record<string, unknown>) => api.get('/notes', { params }).then((r) => r.data.donnees),
  obtenir: (id: string) => api.get(`/notes/${id}`).then((r) => r.data.donnees as Note),
  creer: (payload: NotePayload) => api.post('/notes', payload).then((r) => r.data.donnees as Note),
  modifier: (id: string, payload: Partial<NotePayload>) => api.patch(`/notes/${id}`, payload).then((r) => r.data.donnees as Note),
  supprimer: (id: string) => api.delete(`/notes/${id}`).then((r) => r.data.donnees),
  favori: (id: string) => api.patch(`/notes/${id}/favori`).then((r) => r.data.donnees as Note),
  archiver: (id: string) => api.patch(`/notes/${id}/archiver`).then((r) => r.data.donnees as Note)
};
