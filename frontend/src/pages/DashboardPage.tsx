import { IconCategory, IconNote, IconStar } from '@tabler/icons-react';
import { useEffect } from 'react';
import { StatsCard } from '../components/StatsCard';
import { useNotesStore } from '../stores/notesStore';

export function DashboardPage() {
  const { notes, charger } = useNotesStore();
  useEffect(() => { void charger(); }, [charger]);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard titre="Notes" valeur={notes.length} Icone={IconNote} />
        <StatsCard titre="Favoris" valeur={notes.filter((n) => n.estFavorite).length} Icone={IconStar} />
        <StatsCard titre="Categories" valeur={new Set(notes.map((n) => n.categorieId).filter(Boolean)).size} Icone={IconCategory} />
      </div>
    </div>
  );
}
