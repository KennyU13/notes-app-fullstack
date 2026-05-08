export function TagChip({ nom, onSupprimer }: { nom: string; onSupprimer?: () => void }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
      <span className="min-w-0 truncate">#{nom}</span>
      {onSupprimer && <button type="button" onClick={onSupprimer} className="shrink-0 text-white/60 hover:text-white">x</button>}
    </span>
  );
}
