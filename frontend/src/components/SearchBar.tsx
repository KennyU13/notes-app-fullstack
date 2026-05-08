import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNotesStore } from '../stores/notesStore';
import { useDebounce } from '../utils/debounce';

export function SearchBar() {
  const [valeur, setValeur] = useState('');
  const recherche = useDebounce(valeur, 300);
  const definirFiltres = useNotesStore((s) => s.definirFiltres);
  const charger = useNotesStore((s) => s.charger);

  useEffect(() => {
    definirFiltres({ recherche: recherche || undefined });
    void charger();
  }, [recherche, definirFiltres, charger]);

  return (
    <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
      <IconSearch size={20} className="text-white/60" />
      <input value={valeur} onChange={(e) => setValeur(e.target.value)} placeholder="Rechercher une note" className="min-w-0 flex-1 bg-transparent text-white placeholder:text-white/50" />
    </label>
  );
}
