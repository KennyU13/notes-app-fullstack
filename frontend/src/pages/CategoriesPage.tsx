import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { categoriesService } from '../services/categories';
import { Categorie } from '../types';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [nom, setNom] = useState('');
  const charger = () => categoriesService.lister().then(setCategories);
  useEffect(() => { void charger(); }, []);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Categories</h1>
      <form onSubmit={async (e) => { e.preventDefault(); await categoriesService.creer({ nom, couleur: '#06b6d4' }); setNom(''); toast.success('Categorie creee'); void charger(); }} className="flex gap-3 rounded-3xl bg-glass p-4">
        <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nouvelle categorie" className="flex-1 rounded-2xl border border-white/20 bg-white/10 px-4 py-3" />
        <button className="rounded-2xl bouton-glass px-5">Ajouter</button>
      </form>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{categories.map((c) => <div key={c.id} className="flex items-center justify-between rounded-2xl bg-glass p-4"><span>{c.nom}</span><button onClick={async () => { await categoriesService.supprimer(c.id); void charger(); }} className="text-rose-200">Supprimer</button></div>)}</div>
    </div>
  );
}
