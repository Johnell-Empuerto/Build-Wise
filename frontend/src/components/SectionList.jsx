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

export default function SectionList({ sections }) {
  // Sections without concepts are hidden instead of shown as
  // "coming soon" placeholders (V1 §22). Deep links to them still
  // work and show an honest empty state on the concepts page.
  const visible = sections.filter(
    (section) => Number(section.concept_count) > 0
  );

  if (visible.length === 0) {
    return <p className="text-sm text-slate-400">No sections available yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {visible.map((section) => {
        return (
          <Link
            key={section.id}
            to={`/sections/${section.id}`}
            className="group flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 transition hover:border-emerald-500/50"
          >
            <div>
              <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300">
                {section.name}
              </h3>
              {section.description && (
                <p className="mt-1 text-xs text-slate-500">
                  {section.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                <Count value={section.concept_count} label="concept" />
                <Count value={section.lesson_count} label="lesson" />
                <Count value={section.challenge_count} label="challenge" />
              </div>
            </div>
            <span className="text-slate-600 transition group-hover:text-emerald-500">
              &rarr;
            </span>
          </Link>
        );
      })}
    </div>
  );
}
