export function Loading({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-6 text-sm text-slate-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4">
      <p className="text-sm font-semibold text-red-400">Failed to load data.</p>
      <p className="mt-1 text-sm text-red-300/80">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg border border-red-400/40 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
        >
          Try again
        </button>
      )}
    </div>
  );
}
