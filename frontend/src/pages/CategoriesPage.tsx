import { IconBriefcase, IconDeviceFloppy, IconFolder, IconHeart, IconPalette, IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { notesService } from '../services/notes';
import { useCategoriesStore } from '../stores/categoriesStore';

const couleurs = ['#06b6d4', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#ec4899'];
const icones = ['Folder', 'Briefcase', 'Heart', 'Palette'];
const IconeCategorie = ({ nom }: { nom: string }) => {
  const Icone = nom === 'Briefcase' ? IconBriefcase : nom === 'Heart' ? IconHeart : nom === 'Palette' ? IconPalette : IconFolder;
  return <Icone size={20} />;
};

export function CategoriesPage() {
  const { categories, charger, creer, modifier, supprimer } = useCategoriesStore();
  const [nom, setNom] = useState('');
  const [couleur, setCouleur] = useState(couleurs[0]);
  const [icone, setIcone] = useState(icones[0]);
  const [compteurs, setCompteurs] = useState<Record<string, number>>({});

  useEffect(() => { void charger(); }, [charger]);
  useEffect(() => {
    void Promise.all(categories.map(async (categorie) => {
      const reponse = await notesService.lister({ page: 1, limite: 1, categorieId: categorie.id });
      return [categorie.id, reponse.pagination.total] as const;
    })).then((items) => setCompteurs(Object.fromEntries(items)));
  }, [categories]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="mt-2 text-sm text-white/60">Organisez vos notes avec des couleurs, icones et compteurs.</p>
      </div>

      <form onSubmit={async (e) => { e.preventDefault(); await creer({ nom, couleur, icone }); setNom(''); }} className="rounded-3xl bg-glass p-5 shadow-glass">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom de la categorie" className="min-w-0 rounded-2xl border border-white/20 bg-white/10 px-4 py-3" />
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bouton-glass px-5 py-3 font-semibold"><IconPlus size={18} /> Ajouter</button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {couleurs.map((item) => <button type="button" key={item} onClick={() => setCouleur(item)} className={`h-9 w-9 rounded-full border-2 ${couleur === item ? 'border-white' : 'border-white/20'}`} style={{ backgroundColor: item }} />)}
          <div className="flex rounded-2xl bg-white/10 p-1">
            {icones.map((item) => <button type="button" key={item} onClick={() => setIcone(item)} className={`rounded-xl p-2 ${icone === item ? 'bg-white/20' : ''}`}><IconeCategorie nom={item} /></button>)}
          </div>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((c) => (
          <article key={c.id} className="rounded-3xl bg-glass p-5 shadow-glass">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ backgroundColor: c.couleur }}><IconeCategorie nom={c.icone} /></div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold">{c.nom}</p>
                  <p className="text-sm text-white/55">{compteurs[c.id] ?? 0} note(s)</p>
                </div>
              </div>
              <button title="Supprimer" onClick={() => void supprimer(c.id)} className="rounded-xl p-2 text-rose-200 hover:bg-rose-500/20"><IconTrash size={18} /></button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {couleurs.map((item) => <button type="button" key={item} onClick={() => void modifier(c.id, { couleur: item })} className="h-7 w-7 rounded-full border border-white/20" style={{ backgroundColor: item }} />)}
              <button onClick={() => void modifier(c.id, { icone: c.icone === 'Folder' ? 'Briefcase' : 'Folder' })} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1 text-xs"><IconDeviceFloppy size={14} /> Icone</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
