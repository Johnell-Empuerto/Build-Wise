const STYLES = {
  easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  hard: "border-red-500/30 bg-red-500/10 text-red-400",
};

export default function DifficultyBadge({ difficulty }) {
  const level = String(difficulty || "").toLowerCase();

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
        STYLES[level] || "border-slate-600 bg-slate-700/30 text-slate-300"
      }`}
    >
      {difficulty}
    </span>
  );
}
