export function EmptyState({ message }: { message: string }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-3xl bg-glass p-10 text-center shadow-glass">
      <div>
        <div className="mx-auto mb-5 h-24 w-24 rounded-[28px] bg-white/10 shadow-glow" />
        <p className="text-lg font-medium text-white/85">{message}</p>
      </div>
    </div>
  );
}
