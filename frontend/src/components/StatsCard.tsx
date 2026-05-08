import { Icon } from '@tabler/icons-react';

export function StatsCard({ titre, valeur, Icone, description }: { titre: string; valeur: number; Icone: Icon; description?: string }) {
  return (
    <div className="min-h-36 min-w-0 rounded-3xl bg-glass p-5 shadow-glass sm:p-6">
      <Icone className="mb-4 text-cyan-200" />
      <p className="truncate text-sm text-white/65">{titre}</p>
      <p className="mt-2 text-3xl font-bold sm:text-4xl">{valeur}</p>
      {description && <p className="mt-2 text-xs leading-5 text-white/55">{description}</p>}
    </div>
  );
}
