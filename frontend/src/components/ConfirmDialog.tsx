import { motion } from 'framer-motion';

export function ConfirmDialog({ ouvert, titre, onConfirmer, onAnnuler }: { ouvert: boolean; titre: string; onConfirmer: () => void; onAnnuler: () => void }) {
  if (!ouvert) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm rounded-3xl bg-glass p-6 shadow-glass">
        <h2 className="text-xl font-semibold">{titre}</h2>
        <p className="mt-2 text-white/70">Cette action est definitive.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onAnnuler} className="rounded-2xl border border-white/20 px-4 py-2">Annuler</button>
          <button onClick={onConfirmer} className="rounded-2xl bg-rose-500/70 px-4 py-2">Confirmer</button>
        </div>
      </motion.div>
    </div>
  );
}
