// Level 1 (Fundamentals) lesson list.
import { Link } from "react-router-dom";
import { FUNDAMENTALS_LESSONS } from "../data/system-design/fundamentals.js";
import GuideBubble from "./GuideBubble.jsx";
import { useSystemDesignProgress } from "./progress.jsx";

export default function SystemDesignFundamentals() {
  const { completedLessons } = useSystemDesignProgress();

  return (
    <div className="sd-appear">
      <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link to="/system-design" className="hover:text-sky-400">
          System Design
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">Fundamentals</span>
      </nav>

      <div className="mb-6">
        <span className="inline-flex items-center rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
          Level 1
        </span>
        <h1 className="mt-3 text-2xl font-bold text-white">Fundamentals</h1>
        <p className="mt-1 text-sm text-slate-400">
          The building blocks every system is made of - taught one interactive
          story at a time.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
        <ol className="flex flex-col gap-3">
          {FUNDAMENTALS_LESSONS.map((lesson, index) => {
            const done = completedLessons.has(lesson.id);

            if (lesson.available) {
              return (
                <li key={lesson.id}>
                  <Link
                    to={`/system-design/fundamentals/${lesson.id}`}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-sky-500/40 bg-sky-500/5 px-5 py-4 transition hover:border-sky-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <h2 className="text-sm font-semibold text-white group-hover:text-sky-300">
                          {lesson.title}
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {lesson.summary}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0">
                      {done ? (
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                          ✓ Complete
                        </span>
                      ) : (
                        <span className="rounded-full bg-sky-500 px-3 py-1 text-[11px] font-bold text-white transition group-hover:bg-sky-400">
                          Start →
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={lesson.id}>
                <div
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-4 opacity-70"
                  aria-label={`${lesson.title} - coming later`}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-700 text-xs font-bold text-slate-500">
                      {index + 1}
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-300">
                        {lesson.title}
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Coming in a later phase
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <aside className="flex flex-col gap-4">
          <GuideBubble>
            <strong className="text-white">Start with lesson 1.</strong> Parts,
            connections, and one goal. Once you can name those three out loud in
            any app you use, every future diagram will make sense.
          </GuideBubble>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              What you will be able to do
            </h3>
            <ul className="mt-2 flex flex-col gap-1.5 text-xs leading-relaxed text-slate-400">
              <li>▸ Trace a request from screen to storage</li>
              <li>▸ Explain each part with a real analogy</li>
              <li>▸ Spot a broken architecture yourself</li>
              <li>▸ Justify your choices in plain words</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
