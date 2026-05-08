import { useEffect, useState } from 'react';
import { useCategoriesStore } from '../stores/categoriesStore';

export function CategoriesPage() {
  const { categories, charger, creer, supprimer } = useCategoriesStore();
  const [nom, setNom] = useState('');
  useEffect(() => { void charger(); }, []);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Categories</h1>
      <form onSubmit={async (e) => { e.preventDefault(); await creer({ nom, couleur: '#06b6d4' }); setNom(''); }} className="flex gap-3 rounded-3xl bg-glass p-4">
        <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nouvelle categorie" className="flex-1 rounded-2xl border border-white/20 bg-white/10 px-4 py-3" />
        <button className="rounded-2xl bouton-glass px-5">Ajouter</button>
      </form>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{categories.map((c) => <div key={c.id} className="flex items-center justify-between rounded-2xl bg-glass p-4"><span>{c.nom}</span><button onClick={() => void supprimer(c.id)} className="text-rose-200">Supprimer</button></div>)}</div>
    </div>
  );
}
