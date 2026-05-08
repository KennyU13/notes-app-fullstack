import { IconArchive, IconCategory, IconDownload, IconNote, IconPaperclip, IconPinned, IconShieldLock, IconStar, IconTag, IconTrash } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { StatsCard } from '../components/StatsCard';
import { notesService } from '../services/notes';
import { statistiquesService, StatistiquesGlobales } from '../services/statistiques';
import { useCategoriesStore } from '../stores/categoriesStore';
import { useNotesStore } from '../stores/notesStore';
import { Note } from '../types';

export function DashboardPage() {
  const { charger } = useNotesStore();
  const { categories, charger: chargerCategories } = useCategoriesStore();
  const [stats, setStats] = useState<StatistiquesGlobales>({ notes: 0, favoris: 0, archivees: 0, corbeille: 0, categories: 0 });
  const [recentes, setRecentes] = useState<Note[]>([]);
  const [notesTableau, setNotesTableau] = useState<Note[]>([]);
  const [compteursCategories, setCompteursCategories] = useState<Record<string, number>>({});
  const notesEpinglees = useMemo(() => notesTableau.filter((note) => note.estEpinglee), [notesTableau]);
  const tagsUtilises = useMemo(() => {
    const uniques = new Map<string, string>();
    notesTableau.forEach((note) => note.tags?.forEach(({ tag }) => uniques.set(tag.id, tag.nom)));
    return Array.from(uniques, ([id, nom]) => ({ id, nom })).sort((a, b) => a.nom.localeCompare(b.nom));
  }, [notesTableau]);
  const piecesJointes = useMemo(() => notesTableau.reduce((total, note) => total + (note.piecesJointes?.length ?? 0), 0), [notesTableau]);

  useEffect(() => {
    void charger();
    void chargerCategories();
    void statistiquesService.globales().then(setStats);
    void notesService.lister({ page: 1, limite: 5 }).then((reponse) => setRecentes(reponse.items));
    void notesService.lister({ page: 1, limite: 100 }).then((reponse) => setNotesTableau(reponse.items));
  }, [charger, chargerCategories]);

  useEffect(() => {
    void Promise.all(categories.map(async (categorie) => {
      const reponse = await notesService.lister({ page: 1, limite: 1, categorieId: categorie.id });
      return [categorie.id, reponse.pagination.total] as const;
    })).then((items) => setCompteursCategories(Object.fromEntries(items)));
  }, [categories]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="mt-2 text-sm text-white/60">Vue rapide de votre espace de notes personnelles.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard titre="Notes" valeur={stats.notes} Icone={IconNote} description="Notes actives hors corbeille" />
        <StatsCard titre="Favoris" valeur={stats.favoris} Icone={IconStar} description="Notes marquees importantes" />
        <StatsCard titre="Archivees" valeur={stats.archivees} Icone={IconArchive} description="Notes conservees en archive" />
        <StatsCard titre="Categories" valeur={stats.categories} Icone={IconCategory} description="Classements disponibles" />
        <StatsCard titre="Corbeille" valeur={stats.corbeille} Icone={IconTrash} description="Notes en attente de restauration" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,.8fr)]">
        <section className="rounded-3xl bg-glass p-5 shadow-glass">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Notes recentes</h2>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">{recentes.length} visibles</span>
          </div>
          <div className="space-y-3">
            {recentes.map((note) => (
              <div key={note.id} className="flex items-start justify-between gap-4 rounded-2xl bg-white/10 p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{note.titre}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-white/60">{note.contenu}</p>
                </div>
                <span className="shrink-0 rounded-full px-3 py-1 text-xs" style={{ backgroundColor: `${note.couleur}55` }}>{note.categorie?.nom ?? 'Sans categorie'}</span>
              </div>
            ))}
            {recentes.length === 0 && <p className="rounded-2xl bg-white/10 p-4 text-sm text-white/60">Aucune note recente.</p>}
          </div>
        </section>

        <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="min-w-0 rounded-3xl bg-glass p-5 shadow-glass">
            <div className="mb-4 flex items-center justify-between gap-3">
              <IconPinned className="shrink-0 text-cyan-200" />
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{notesEpinglees.length}</span>
            </div>
            <p className="text-sm text-white/60">Notes epinglees</p>
            <div className="mt-4 space-y-2">
              {notesEpinglees.slice(0, 3).map((note) => (
                <div key={note.id} className="flex min-w-0 items-center gap-2 rounded-2xl bg-white/10 px-3 py-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: note.couleur }} />
                  <span className="min-w-0 truncate text-sm">{note.titre}</span>
                </div>
              ))}
              {notesEpinglees.length === 0 && <p className="rounded-2xl bg-white/10 px-3 py-2 text-sm text-white/55">Aucune note epinglee.</p>}
            </div>
          </div>
          <div className="min-w-0 rounded-3xl bg-glass p-5 shadow-glass">
            <div className="mb-4 flex items-center justify-between gap-3">
              <IconTag className="shrink-0 text-cyan-200" />
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{tagsUtilises.length}</span>
            </div>
            <p className="text-sm text-white/60">Tags utilises</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tagsUtilises.slice(0, 8).map((tag) => (
                <span key={tag.id} className="max-w-full truncate rounded-full bg-white/10 px-3 py-1 text-xs text-white/75">#{tag.nom}</span>
              ))}
              {tagsUtilises.length === 0 && <p className="rounded-2xl bg-white/10 px-3 py-2 text-sm text-white/55">Aucun tag utilise.</p>}
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="rounded-3xl bg-glass p-5 shadow-glass xl:col-span-2">
          <h2 className="text-xl font-semibold">Repartition par categorie</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {categories.slice(0, 6).map((categorie) => (
              <div key={categorie.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: categorie.couleur }} />
                  <span className="truncate text-sm">{categorie.nom}</span>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{compteursCategories[categorie.id] ?? 0}</span>
              </div>
            ))}
            {categories.length === 0 && <p className="rounded-2xl bg-white/10 p-4 text-sm text-white/60">Aucune categorie creee.</p>}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-3xl bg-glass p-5 shadow-glass">
            <IconPaperclip className="mb-4 text-cyan-200" />
            <p className="text-sm text-white/60">Pieces jointes</p>
            <p className="mt-2 text-3xl font-bold">{piecesJointes}</p>
          </div>
          <div className="rounded-3xl bg-glass p-5 shadow-glass">
            <IconDownload className="mb-4 text-cyan-200" />
            <p className="text-sm text-white/60">Exports disponibles</p>
            <p className="mt-2 text-lg font-semibold">JSON / MD / PDF</p>
          </div>
          <div className="rounded-3xl bg-glass p-5 shadow-glass">
            <IconShieldLock className="mb-4 text-cyan-200" />
            <p className="text-sm text-white/60">Securite</p>
            <p className="mt-2 text-lg font-semibold">JWT, audit, rate limit</p>
          </div>
        </section>
      </div>
    </div>
  );
}
