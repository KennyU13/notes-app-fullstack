export function TagChip({ nom, onSupprimer }: { nom: string; onSupprimer?: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
      #{nom}
      {onSupprimer && <button onClick={onSupprimer} className="text-white/60 hover:text-white">x</button>}
    </span>
  );
}
