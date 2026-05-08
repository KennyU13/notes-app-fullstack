import { categoriesService } from './categories';
import { notesService } from './notes';

export type StatistiquesGlobales = {
  notes: number;
  favoris: number;
  archivees: number;
  corbeille: number;
  categories: number;
};

const totalNotes = async (params?: Record<string, unknown>) => {
  const reponse = await notesService.lister({ page: 1, limite: 1, ...params });
  return reponse.pagination.total as number;
};

export const statistiquesService = {
  globales: async (): Promise<StatistiquesGlobales> => {
    const [notes, favoris, archivees, corbeille, categories] = await Promise.all([
      totalNotes(),
      totalNotes({ favoris: true }),
      totalNotes({ archivees: true }),
      totalNotes({ corbeille: true }),
      categoriesService.lister().then((items) => items.length)
    ]);

    return { notes, favoris, archivees, corbeille, categories };
  }
};
