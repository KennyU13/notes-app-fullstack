import { IconArchive, IconPinned, IconRestore, IconStar, IconTrash } from '@tabler/icons-react';
import { Note } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { TagChip } from './TagChip';

export function NoteCard({
  note,
  onOuvrir,
  onFavori,
  onArchiver,
  onSupprimer,
  onEpingler,
  onRestaurer,
  corbeille = false
}: {
  note: Note;
  onOuvrir: () => void;
  onFavori: () => void;
  onArchiver: () => void;
  onSupprimer: () => void;
  onEpingler?: () => void;
  onRestaurer?: () => void;
  corbeille?: boolean;
}) {
  return (
    <article className="rounded-3xl bg-glass p-5 shadow-glass transition hover:-translate-y-1 hover:shadow-glow" style={{ borderColor: `${note.couleur}88` }}>
      <button onClick={onOuvrir} className="block w-full text-left">
        <div className="mb-4 h-2 w-20 rounded-full" style={{ backgroundColor: note.couleur }} />
        <div className="flex items-start gap-2">
          {note.estEpinglee && <IconPinned size={18} className="mt-1 shrink-0 text-cyan-200" />}
          <h3 className="line-clamp-2 text-xl font-semibold">{note.titre}</h3>
        </div>
        <p className="mt-3 line-clamp-4 min-h-24 text-sm leading-6 text-white/70">{note.contenu}</p>
      </button>
      <div className="mt-4 flex flex-wrap gap-2">
        {note.categorie && <CategoryBadge nom={note.categorie.nom} couleur={note.categorie.couleur} />}
        {note.tags?.slice(0, 3).map(({ tag }) => <TagChip key={tag.id} nom={tag.nom} />)}
      </div>
      <div className="mt-5 flex items-center justify-between text-xs text-white/55">
        <span>{new Date(note.updatedAt).toLocaleDateString('fr-FR')}</span>
        <div className="flex gap-2">
          {corbeille ? (
            <>
              <button title="Restaurer" onClick={onRestaurer} className="rounded-xl p-2 hover:bg-white/10"><IconRestore size={18} /></button>
              <button title="Supprimer definitivement" onClick={onSupprimer} className="rounded-xl p-2 hover:bg-rose-500/20"><IconTrash size={18} /></button>
            </>
          ) : (
            <>
              <button title="Epingler" onClick={onEpingler} className={`rounded-xl p-2 hover:bg-white/10 ${note.estEpinglee ? 'text-cyan-200' : ''}`}><IconPinned size={18} /></button>
              <button title="Favori" onClick={onFavori} className={`rounded-xl p-2 hover:bg-white/10 ${note.estFavorite ? 'text-yellow-300' : ''}`}><IconStar size={18} /></button>
              <button title="Archiver" onClick={onArchiver} className="rounded-xl p-2 hover:bg-white/10"><IconArchive size={18} /></button>
              <button title="Supprimer" onClick={onSupprimer} className="rounded-xl p-2 hover:bg-rose-500/20"><IconTrash size={18} /></button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
