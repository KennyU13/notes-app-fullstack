import { useEffect, useState } from 'react';
import { Categorie, Note } from '../types';
import { TagChip } from './TagChip';

const couleurs = ['#8b5cf6', '#06b6d4', '#14b8a6', '#f59e0b', '#ef4444', '#ec4899', '#22c55e', '#64748b'];

export function NoteEditor({
  note,
  categories,
  onEnregistrer
}: {
  note?: Note | null;
  categories: Categorie[];
  onEnregistrer: (payload: { titre: string; contenu: string; couleur: string; categorieId?: string | null; tags: string[]; fichiers?: File[] }) => Promise<void>;
}) {
  const [titre, setTitre] = useState(note?.titre ?? '');
  const [contenu, setContenu] = useState(note?.contenu ?? '');
  const [couleur, setCouleur] = useState(note?.couleur ?? couleurs[0]);
  const [categorieId, setCategorieId] = useState(note?.categorieId ?? '');
  const [tags, setTags] = useState<string[]>(note?.tags?.map(({ tag }) => tag.nom) ?? []);
  const [tag, setTag] = useState('');
  const [fichiers, setFichiers] = useState<File[]>([]);

  useEffect(() => {
    if (!note) return;
    setTitre(note.titre);
    setContenu(note.contenu);
    setCouleur(note.couleur);
    setCategorieId(note.categorieId ?? '');
    setTags(note.tags?.map(({ tag }) => tag.nom) ?? []);
  }, [note]);

  const ajouterTag = () => {
    const nom = tag.trim().toLowerCase();
    if (nom && !tags.includes(nom)) setTags([...tags, nom]);
    setTag('');
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); void onEnregistrer({ titre, contenu, couleur, categorieId: categorieId || null, tags, fichiers }); }} className="rounded-3xl bg-glass p-5 shadow-glass">
      <input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Titre de la note" className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-2xl font-semibold placeholder:text-white/45" />
      <textarea value={contenu} onChange={(e) => setContenu(e.target.value)} placeholder="Contenu" rows={12} className="mt-4 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 leading-7 placeholder:text-white/45" />
      <select value={categorieId} onChange={(e) => setCategorieId(e.target.value)} className="mt-4 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white">
        <option value="" className="bg-slate-950">Sans categorie</option>
        {categories.map((categorie) => (
          <option key={categorie.id} value={categorie.id} className="bg-slate-950">
            {categorie.nom}
          </option>
        ))}
      </select>
      <div className="mt-4 flex flex-wrap gap-3">
        {couleurs.map((item) => <button type="button" key={item} onClick={() => setCouleur(item)} className={`h-9 w-9 rounded-full border-2 ${couleur === item ? 'border-white' : 'border-white/20'}`} style={{ backgroundColor: item }} />)}
      </div>
      <div className="mt-4 flex gap-2">
        <input value={tag} onChange={(e) => setTag(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); ajouterTag(); } }} placeholder="Ajouter un tag" className="flex-1 rounded-2xl border border-white/20 bg-white/10 px-4 py-3" />
        <button type="button" onClick={ajouterTag} className="rounded-2xl bouton-glass px-4">Ajouter</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">{tags.map((nom) => <TagChip key={nom} nom={nom} onSupprimer={() => setTags(tags.filter((t) => t !== nom))} />)}</div>
      <label className="mt-4 block rounded-2xl border border-dashed border-white/25 bg-white/10 px-4 py-4 text-sm text-white/75">
        Pieces jointes ou images
        <input type="file" multiple onChange={(e) => setFichiers(Array.from(e.target.files ?? []))} className="mt-3 block w-full text-sm" />
      </label>
      {note?.piecesJointes?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {note.piecesJointes.map((piece) => <span key={piece.id} className="rounded-full border border-white/20 px-3 py-1 text-xs">{piece.nomOriginal}</span>)}
        </div>
      ) : null}
      <button className="mt-5 rounded-2xl bouton-glass px-6 py-3 font-semibold">Enregistrer</button>
    </form>
  );
}
