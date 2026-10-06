const MAX_LEVEL = 7;

export default function LevelBadge({ level }) {
  const value = Number(level);

  if (!Number.isInteger(value) || value < 1 || value > MAX_LEVEL) {
    return null;
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-400"
      title={`Level ${value} of ${MAX_LEVEL}`}
    >
      <span aria-hidden="true" className="flex gap-0.5">
        {Array.from({ length: MAX_LEVEL }, (_, index) => (
          <span
            key={index}
            className={`h-1.5 w-1.5 rounded-full ${
              index < value ? "bg-sky-400" : "bg-slate-600"
            }`}
          />
        ))}
      </span>
      L{value}
    </span>
  );
}
