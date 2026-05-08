import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NoteEditor } from '../components/NoteEditor';
import { notesService } from '../services/notes';
import { useNotesStore } from '../stores/notesStore';
import { Note } from '../types';

export function NoteFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { creer, modifier } = useNotesStore();
  const [note, setNote] = useState<Note | null>(null);
  useEffect(() => { if (id) void notesService.obtenir(id).then(setNote); }, [id]);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">{id ? 'Modifier la note' : 'Nouvelle note'}</h1>
      <NoteEditor note={note} onEnregistrer={async (payload) => {
        const enregistree = id ? await modifier(id, payload) : await creer(payload);
        navigate(`/notes/${enregistree.id}`);
      }} />
    </div>
  );
}
