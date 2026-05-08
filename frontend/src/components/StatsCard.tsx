import { Icon } from '@tabler/icons-react';

export function StatsCard({ titre, valeur, Icone }: { titre: string; valeur: number; Icone: Icon }) {
  return (
    <div className="rounded-3xl bg-glass p-6 shadow-glass">
      <Icone className="mb-5 text-cyan-200" />
      <p className="text-sm text-white/65">{titre}</p>
      <p className="mt-2 text-4xl font-bold">{valeur}</p>
    </div>
  );
}
