import { IconLayoutGrid, IconList } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { Loader } from '../components/Loader';
import { NoteCard } from '../components/NoteCard';
import { useNotesStore } from '../stores/notesStore';
import { useUiStore } from '../stores/uiStore';

export function NotesPage({ favoris = false, archivees = false }: { favoris?: boolean; archivees?: boolean }) {
  const navigate = useNavigate();
  const [paramsRecherche] = useSearchParams();
  const { notes, charger, chargement, definirFiltres, favori, archiver, supprimer } = useNotesStore();
  const { vue, definirVue } = useUiStore();
  const [aSupprimer, setASupprimer] = useState<string | null>(null);
  const categorieId = paramsRecherche.get('categorieId') ?? undefined;

  useEffect(() => {
    definirFiltres({ categorieId, favoris: favoris || undefined, archivees: archivees || undefined });
    void charger();
  }, [categorieId, favoris, archivees, definirFiltres, charger]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{favoris ? 'Notes favorites' : archivees ? 'Notes archivees' : 'Toutes les notes'}</h1>
        <div className="flex rounded-2xl bg-white/10 p-1">
          <button onClick={() => definirVue('grille')} className={`rounded-xl p-2 ${vue === 'grille' ? 'bg-white/20' : ''}`}><IconLayoutGrid /></button>
          <button onClick={() => definirVue('liste')} className={`rounded-xl p-2 ${vue === 'liste' ? 'bg-white/20' : ''}`}><IconList /></button>
        </div>
      </div>
      {chargement ? <Loader /> : notes.length === 0 ? <EmptyState message="Aucune note pour le moment" /> : (
        <div className={vue === 'grille' ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid gap-4'}>
          {notes.map((note) => <NoteCard key={note.id} note={note} onOuvrir={() => navigate(`/notes/${note.id}`)} onFavori={() => void favori(note.id)} onArchiver={() => void archiver(note.id)} onSupprimer={() => setASupprimer(note.id)} />)}
        </div>
      )}
      <ConfirmDialog ouvert={!!aSupprimer} titre="Supprimer cette note ?" onAnnuler={() => setASupprimer(null)} onConfirmer={() => { if (aSupprimer) void supprimer(aSupprimer); setASupprimer(null); }} />
    </div>
  );
}
