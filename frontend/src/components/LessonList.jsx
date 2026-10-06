import { Link } from "react-router-dom";

export default function LessonList({ lessons }) {
  if (lessons.length === 0) {
    return <p className="text-sm text-slate-400">No lessons available yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {lessons.map((lesson, index) => (
        <Link
          key={lesson.id}
          to={`/lessons/${lesson.id}`}
          className="group flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 transition hover:border-emerald-500/50"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-700 text-xs font-semibold text-slate-400">
              {index + 1}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300">
                {lesson.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {Number(lesson.challenge_count || 0)} practice{" "}
                {Number(lesson.challenge_count || 0) === 1
                  ? "challenge"
                  : "challenges"}
              </p>
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
