import { Link } from "react-router-dom";

export default function TopicList({ topics }) {
  if (topics.length === 0) {
    return (
      <p className="text-sm text-slate-400">No topics available yet.</p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {topics.map((topic) => (
        <Link
          key={topic.id}
          to={`/topics/${topic.id}`}
          className="group rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-emerald-500/50 hover:bg-slate-900/70"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-white group-hover:text-emerald-300">
              {topic.name}
            </h3>
            <span className="text-xs font-medium text-slate-600">
              #{topic.order_index}
            </span>
          </div>

          {topic.description && (
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {topic.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            {Number(topic.section_count) > 0 && (
              <span>
                {topic.section_count} section
                {Number(topic.section_count) === 1 ? "" : "s"}
              </span>
            )}
            {Number(topic.challenge_count) > 0 && (
              <span>
                {topic.challenge_count} challenge
                {Number(topic.challenge_count) === 1 ? "" : "s"}
              </span>
            )}
          </div>

          <span className="mt-4 inline-block text-xs font-semibold text-emerald-500 opacity-0 transition group-hover:opacity-100">
            View sections &rarr;
          </span>
        </Link>
      ))}
    </div>
  );
}
