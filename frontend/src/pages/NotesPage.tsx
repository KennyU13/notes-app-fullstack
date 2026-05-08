import { IconLayoutGrid, IconList } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { Loader } from '../components/Loader';
import { NoteCard } from '../components/NoteCard';
import { useNotesStore } from '../stores/notesStore';
import { useUiStore } from '../stores/uiStore';
import { TriNotes, trierNotes } from '../utils/trierNotes';

export function NotesPage({ favoris = false, archivees = false }: { favoris?: boolean; archivees?: boolean }) {
  const navigate = useNavigate();
  const [paramsRecherche] = useSearchParams();
  const { notes, charger, chargement, definirFiltres, favori, archiver, supprimer } = useNotesStore();
  const { vue, definirVue } = useUiStore();
  const [aSupprimer, setASupprimer] = useState<string | null>(null);
  const [tri, setTri] = useState<TriNotes>('date');
  const categorieId = paramsRecherche.get('categorieId') ?? undefined;
  const notesTriees = trierNotes(notes, tri);

  useEffect(() => {
    definirFiltres({ categorieId, favoris: favoris || undefined, archivees: archivees || undefined });
    void charger();
  }, [categorieId, favoris, archivees, definirFiltres, charger]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{favoris ? 'Notes favorites' : archivees ? 'Notes archivees' : 'Toutes les notes'}</h1>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <select
            aria-label="Trier les notes"
            value={tri}
            onChange={(event) => setTri(event.target.value as TriNotes)}
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white outline-none focus:border-violet-300"
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
        </div>
      </div>
      {chargement ? <Loader /> : notes.length === 0 ? <EmptyState message="Aucune note pour le moment" /> : (
        <div className={vue === 'grille' ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid gap-4'}>
          {notesTriees.map((note) => <NoteCard key={note.id} note={note} onOuvrir={() => navigate(`/notes/${note.id}`)} onFavori={() => void favori(note.id)} onArchiver={() => void archiver(note.id)} onSupprimer={() => setASupprimer(note.id)} />)}
        </div>
      )}
      <ConfirmDialog ouvert={!!aSupprimer} titre="Supprimer cette note ?" onAnnuler={() => setASupprimer(null)} onConfirmer={() => { if (aSupprimer) void supprimer(aSupprimer); setASupprimer(null); }} />
    </div>
  );
}
