import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NoteEditor } from '../components/NoteEditor';
import { categoriesService } from '../services/categories';
import { notesService } from '../services/notes';
import { useNotesStore } from '../stores/notesStore';
import { Categorie, Note } from '../types';

export function NoteFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { creer, modifier } = useNotesStore();
  const [note, setNote] = useState<Note | null>(null);
  const [categories, setCategories] = useState<Categorie[]>([]);
  useEffect(() => { if (id) void notesService.obtenir(id).then(setNote); }, [id]);
  useEffect(() => { void categoriesService.lister().then(setCategories); }, []);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">{id ? 'Modifier la note' : 'Nouvelle note'}</h1>
      <NoteEditor note={note} categories={categories} onEnregistrer={async (payload) => {
        const enregistree = id ? await modifier(id, payload) : await creer(payload);
        navigate(`/notes/${enregistree.id}`);
      }} />
    </div>
  );
}
