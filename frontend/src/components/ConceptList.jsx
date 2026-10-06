import { Link } from "react-router-dom";

function Count({ value, label }) {
  const count = Number(value);
  if (!count) return null;
  return (
    <span className="text-xs text-slate-500">
      {count} {label}
      {count === 1 ? "" : "s"}
    </span>
  );
}

export default function ConceptList({ concepts }) {
  if (concepts.length === 0) {
    return <p className="text-sm text-slate-400">No concepts available yet.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {concepts.map((concept) => (
        <Link
          key={concept.id}
          to={`/concepts/${concept.id}`}
          className="group flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 transition hover:border-emerald-500/50"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300">
                {concept.name}
              </h3>
            </div>
            {concept.description && (
              <p className="mt-1 text-xs text-slate-500">{concept.description}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              <Count value={concept.lesson_count} label="lesson" />
              <Count value={concept.challenge_count} label="challenge" />
            </div>
          </div>
          <span className="text-slate-600 transition group-hover:text-emerald-500">
            &rarr;
          </span>
        </Link>
      ))}
    </div>
  );
}
