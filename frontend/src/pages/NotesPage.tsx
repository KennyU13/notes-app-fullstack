import { IconLayoutGrid, IconList } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { Loader } from '../components/Loader';
import { NoteCard } from '../components/NoteCard';
import { useCategoriesStore } from '../stores/categoriesStore';
import { useNotesStore } from '../stores/notesStore';
import { useTagsStore } from '../stores/tagsStore';
import { useUiStore } from '../stores/uiStore';
import { TriNotes, trierNotes } from '../utils/trierNotes';
import { notesService } from '../services/notes';

export function NotesPage({ favoris = false, archivees = false, corbeille = false }: { favoris?: boolean; archivees?: boolean; corbeille?: boolean }) {
  const navigate = useNavigate();
  const [paramsRecherche] = useSearchParams();
  const { notes, charger, chargement, filtres, definirFiltres, favori, archiver, supprimer, restaurer, supprimerDefinitivement, epingler } = useNotesStore();
  const categories = useCategoriesStore((s) => s.categories);
  const chargerCategories = useCategoriesStore((s) => s.charger);
  const tags = useTagsStore((s) => s.tags);
  const chargerTags = useTagsStore((s) => s.charger);
  const { vue, definirVue } = useUiStore();
  const [aSupprimer, setASupprimer] = useState<string | null>(null);
  const [tri, setTri] = useState<TriNotes>('date');
  const categorieId = paramsRecherche.get('categorieId') ?? undefined;
  const notesTriees = trierNotes(notes, tri);

  useEffect(() => {
    void chargerCategories();
    void chargerTags();
  }, [chargerCategories, chargerTags]);

  useEffect(() => {
    definirFiltres({ categorieId, favoris: favoris || undefined, archivees: archivees || undefined, corbeille: corbeille || undefined });
    void charger();
  }, [categorieId, favoris, archivees, corbeille, definirFiltres, charger]);

  const definirFiltreAvance = (filtre: Partial<typeof filtres>) => {
    definirFiltres(filtre);
    void charger();
  };

  const confirmerSuppression = () => {
    if (!aSupprimer) return;
    if (corbeille) void supprimerDefinitivement(aSupprimer);
    else void supprimer(aSupprimer);
    setASupprimer(null);
  };

  const titre = corbeille ? 'Corbeille' : favoris ? 'Notes favorites' : archivees ? 'Notes archivees' : 'Toutes les notes';

  const exporter = async (format: 'json' | 'markdown' | 'pdf') => {
    const reponse = await notesService.exporter(format);
    const extension = format === 'markdown' ? 'md' : format;
    const url = URL.createObjectURL(reponse.data);
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = `notes.${extension}`;
    lien.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <h1 className="text-3xl font-bold">{titre}</h1>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <select
            aria-label="Trier les notes"
            value={tri}
            onChange={(event) => setTri(event.target.value as TriNotes)}
            className="min-w-40 flex-1 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white outline-none focus:border-violet-300 sm:flex-none"
          >
            <option value="date">Date recente</option>
            <option value="titre">Titre</option>
            <option value="favoris">Favoris</option>
            <option value="couleur">Couleur</option>
            <option value="categorie">Categorie</option>
          </select>
          <div className="flex rounded-2xl bg-white/10 p-1">
            <button title="Vue grille" onClick={() => definirVue('grille')} className={`rounded-xl p-2 ${vue === 'grille' ? 'bg-white/20' : ''}`}><IconLayoutGrid /></button>
            <button title="Vue liste" onClick={() => definirVue('liste')} className={`rounded-xl p-2 ${vue === 'liste' ? 'bg-white/20' : ''}`}><IconList /></button>
          </div>
          {!corbeille && (
            <div className="flex rounded-2xl bg-white/10 p-1 text-sm">
              <button onClick={() => void exporter('json')} className="rounded-xl px-3 py-2 hover:bg-white/10">JSON</button>
              <button onClick={() => void exporter('markdown')} className="rounded-xl px-3 py-2 hover:bg-white/10">MD</button>
              <button onClick={() => void exporter('pdf')} className="rounded-xl px-3 py-2 hover:bg-white/10">PDF</button>
            </div>
          )}
        </div>
      </div>

      {!corbeille && (
        <div className="grid gap-3 rounded-3xl bg-glass p-4 shadow-glass sm:grid-cols-2 xl:grid-cols-4">
          <select aria-label="Filtrer par categorie" value={filtres.categorieId ?? ''} onChange={(e) => definirFiltreAvance({ categorieId: e.target.value || undefined })} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none">
            <option value="">Toutes les categories</option>
            {categories.map((categorie) => <option key={categorie.id} value={categorie.id}>{categorie.nom}</option>)}
          </select>
          <select aria-label="Filtrer par tag" value={filtres.tagId ?? ''} onChange={(e) => definirFiltreAvance({ tagId: e.target.value || undefined })} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none">
            <option value="">Tous les tags</option>
            {tags.map((tag) => <option key={tag.id} value={tag.id}>{tag.nom}</option>)}
          </select>
          <select aria-label="Filtrer par favoris" value={filtres.favoris === true ? 'true' : ''} onChange={(e) => definirFiltreAvance({ favoris: e.target.value === 'true' ? true : undefined })} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none">
            <option value="">Toutes les notes</option>
            <option value="true">Favoris seulement</option>
          </select>
          <select aria-label="Filtrer par archivage" value={filtres.archivees === true ? 'true' : ''} onChange={(e) => definirFiltreAvance({ archivees: e.target.value === 'true' ? true : undefined })} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none">
            <option value="">Actives et archivees</option>
            <option value="true">Archivees seulement</option>
          </select>
        </div>
      )}

      {chargement ? <Loader /> : notes.length === 0 ? <EmptyState message={corbeille ? 'La corbeille est vide' : 'Aucune note pour le moment'} /> : (
        <div className={vue === 'grille' ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid gap-4'}>
          {notesTriees.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              corbeille={corbeille}
              onOuvrir={() => navigate(`/notes/${note.id}`)}
              onFavori={() => void favori(note.id)}
              onArchiver={() => void archiver(note.id)}
              onEpingler={() => void epingler(note.id)}
              onRestaurer={() => void restaurer(note.id)}
              onSupprimer={() => setASupprimer(note.id)}
            />
          ))}
        </div>
      )}
      <ConfirmDialog ouvert={!!aSupprimer} titre={corbeille ? 'Supprimer definitivement cette note ?' : 'Deplacer cette note dans la corbeille ?'} onAnnuler={() => setASupprimer(null)} onConfirmer={confirmerSuppression} />
    </div>
  );
}
