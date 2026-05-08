import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NoteEditor } from '../components/NoteEditor';
import { notesService } from '../services/notes';
import { useCategoriesStore } from '../stores/categoriesStore';
import { useNotesStore } from '../stores/notesStore';
import { Note } from '../types';

export function NoteFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { creer, modifier } = useNotesStore();
  const { categories, charger: chargerCategories } = useCategoriesStore();
  const [note, setNote] = useState<Note | null>(null);
  useEffect(() => { if (id) void notesService.obtenir(id).then(setNote); }, [id]);
  useEffect(() => { void chargerCategories(); }, [chargerCategories]);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">{id ? 'Modifier la note' : 'Nouvelle note'}</h1>
      <NoteEditor note={note} categories={categories} onEnregistrer={async (payload) => {
        const { fichiers, ...donnees } = payload;
        const enregistree = id ? await modifier(id, donnees) : await creer(donnees);
        if (fichiers?.length) {
          await Promise.all(fichiers.map((fichier) => notesService.ajouterPieceJointe(enregistree.id, fichier)));
        }
        navigate(`/notes/${enregistree.id}`);
      }} />
    </div>
  );
}
