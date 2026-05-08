import { IconArrowLeft, IconFolder } from '@tabler/icons-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { Loader } from '../components/Loader';
import { NoteCard } from '../components/NoteCard';
import { notesService } from '../services/notes';
import { useCategoriesStore } from '../stores/categoriesStore';
import { Note } from '../types';
import { trierNotes } from '../utils/trierNotes';

export function CategorieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const categories = useCategoriesStore((s) => s.categories);
  const chargementCategories = useCategoriesStore((s) => s.chargement);
  const chargerCategories = useCategoriesStore((s) => s.charger);
  const [notes, setNotes] = useState<Note[]>([]);
  const [chargement, setChargement] = useState(true);
  const [aSupprimer, setASupprimer] = useState<string | null>(null);
  const categorie = categories.find((item) => item.id === id);
  const notesTriees = useMemo(() => trierNotes(notes, 'date'), [notes]);

  const chargerNotes = useCallback(async () => {
    if (!id) return;
    setChargement(true);
    try {
      const reponse = await notesService.lister({ categorieId: id, page: 1, limite: 100 });
      setNotes(reponse.items);
    } finally {
      setChargement(false);
    }
  }, [id]);

  useEffect(() => {
    void chargerCategories();
  }, [chargerCategories]);

  useEffect(() => {
    void chargerNotes();
  }, [chargerNotes]);

  const basculerFavori = async (noteId: string) => {
    await notesService.favori(noteId);
    await chargerNotes();
  };

  const basculerArchive = async (noteId: string) => {
    await notesService.archiver(noteId);
    await chargerNotes();
  };

  const confirmerSuppression = async () => {
    if (!aSupprimer) return;
    await notesService.supprimer(aSupprimer);
    setASupprimer(null);
    toast.success('Note supprimee');
    await chargerNotes();
  };

  if (chargementCategories || chargement) {
    return <Loader />;
  }

  if (!categorie) {
    return <EmptyState message="Categorie introuvable" />;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-glass p-6 shadow-glass">
        <button onClick={() => navigate('/categories')} className="mb-5 inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-white/70 hover:bg-white/10">
          <IconArrowLeft size={18} /> Categories
        </button>
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-3xl shadow-glow" style={{ backgroundColor: categorie.couleur }}>
              <IconFolder size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{categorie.nom}</h1>
              <p className="mt-1 text-sm text-white/60">Creee le {new Date(categorie.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 text-right">
            <p className="text-3xl font-bold">{notes.length}</p>
            <p className="text-sm text-white/60">{notes.length > 1 ? 'notes associees' : 'note associee'}</p>
          </div>
        </div>
      </div>

      {notes.length === 0 ? (
        <EmptyState message="Aucune note dans cette categorie" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {notesTriees.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onOuvrir={() => navigate(`/notes/${note.id}`)}
              onFavori={() => void basculerFavori(note.id)}
              onArchiver={() => void basculerArchive(note.id)}
              onSupprimer={() => setASupprimer(note.id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog ouvert={!!aSupprimer} titre="Supprimer cette note ?" onAnnuler={() => setASupprimer(null)} onConfirmer={() => void confirmerSuppression()} />
    </div>
  );
}
