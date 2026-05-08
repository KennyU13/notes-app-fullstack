import { IconArchive, IconCategory, IconNote, IconPinned, IconStar, IconTag, IconTrash } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { StatsCard } from '../components/StatsCard';
import { notesService } from '../services/notes';
import { statistiquesService, StatistiquesGlobales } from '../services/statistiques';
import { useNotesStore } from '../stores/notesStore';
import { useTagsStore } from '../stores/tagsStore';
import { Note } from '../types';

export function DashboardPage() {
  const { notes, charger } = useNotesStore();
  const { tags, charger: chargerTags } = useTagsStore();
  const [stats, setStats] = useState<StatistiquesGlobales>({ notes: 0, favoris: 0, archivees: 0, corbeille: 0, categories: 0 });
  const [recentes, setRecentes] = useState<Note[]>([]);
  const notesEpinglees = useMemo(() => notes.filter((note) => note.estEpinglee).length, [notes]);

  useEffect(() => {
    void charger();
    void chargerTags();
    void statistiquesService.globales().then(setStats);
    void notesService.lister({ page: 1, limite: 5 }).then((reponse) => setRecentes(reponse.items));
  }, [charger, chargerTags]);

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

      <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
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

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-3xl bg-glass p-5 shadow-glass">
            <IconPinned className="mb-4 text-cyan-200" />
            <p className="text-sm text-white/60">Notes epinglees</p>
            <p className="mt-2 text-3xl font-bold">{notesEpinglees}</p>
          </div>
          <div className="rounded-3xl bg-glass p-5 shadow-glass">
            <IconTag className="mb-4 text-cyan-200" />
            <p className="text-sm text-white/60">Tags utilises</p>
            <p className="mt-2 text-3xl font-bold">{tags.length}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
