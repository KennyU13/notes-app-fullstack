export function CategoryBadge({ nom, couleur }: { nom: string; couleur: string }) {
  return <span className="rounded-full border border-white/20 px-3 py-1 text-xs" style={{ backgroundColor: `${couleur}55` }}>{nom}</span>;
}
