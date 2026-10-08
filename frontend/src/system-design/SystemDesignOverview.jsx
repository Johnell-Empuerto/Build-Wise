// System Design overview - the top-level landing page for the new section.
import { Link } from "react-router-dom";
import {
  SYSTEM_DESIGN_ROADMAP,
  FUNDAMENTALS_LESSONS,
} from "../data/system-design/fundamentals.js";
import GuideBubble from "./GuideBubble.jsx";
import { useSystemDesignProgress } from "./progress.jsx";

const THINKING_STEPS = [
  "See it",
  "Understand it",
  "Interact",
  "Make a choice",
  "Learn from mistakes",
  "Build it",
  "Explain it",
];

export default function SystemDesignOverview() {
  const { completedLessons } = useSystemDesignProgress();
  const doneCount = FUNDAMENTALS_LESSONS.filter((lesson) =>
    completedLessons.has(lesson.id),
  ).length;
  const openCount = FUNDAMENTALS_LESSONS.filter(
    (lesson) => lesson.available,
  ).length;

  return (
    <div className="sd-appear">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
              New section
            </span>
            <h1 className="mt-3 text-3xl font-bold text-white">
              System Design
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Learn how real software is put together - by seeing it, touching
              it, breaking it, and fixing it. No jargon without a story: every
              new idea comes with an analogy you already understand.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/system-design/fundamentals"
                className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                {doneCount > 0 ? "Continue learning" : "Start learning"} →
              </Link>
              <span className="text-xs text-slate-500">
                Level 1 open · {openCount} of {FUNDAMENTALS_LESSONS.length}{" "}
                lessons open
              </span>
            </div>
          </div>
          <div className="sm:w-64">
            <GuideBubble>
              <strong className="text-white">Hi! I am your guide.</strong>
              We will start with a tiny todo app and pull it apart step by step.
              By the end, big system diagrams will feel like reading a map.
            </GuideBubble>
          </div>
        </div>
      </section>

      {/* How you will learn */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          How this section teaches
        </h2>
        <ol className="mt-3 flex flex-wrap gap-2">
          {THINKING_STEPS.map((step, index) => (
            <li
              key={step}
              className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-[10px] font-bold text-white">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Roadmap */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Roadmap
          </h2>
          <span className="text-xs text-slate-500">
            Built phase by phase - fundamentals first
          </span>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SYSTEM_DESIGN_ROADMAP.map((item) => {
            const isOpen = item.status === "open";
            const inner = (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isOpen ? "text-sky-400" : "text-slate-500"
                    }`}
                  >
                    {item.level ? `Level ${item.level}` : "Bonus"}
                  </span>
                  {isOpen ? (
                    <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Open now
                    </span>
                  ) : (
                    <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Later phase
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-base font-semibold text-white">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {item.count} lessons
                </p>
              </>
            );

            return isOpen ? (
              <Link
                key={item.title}
                to="/system-design/fundamentals"
                className="sd-appear group rounded-xl border border-sky-500/40 bg-sky-500/5 p-4 transition hover:border-sky-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                {inner}
                <span className="mt-3 inline-block text-xs font-semibold text-sky-400 opacity-0 transition group-hover:opacity-100">
                  Start Level 1 →
                </span>
              </Link>
            ) : (
              <div
                key={item.title}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 opacity-70"
                aria-label={`${item.title} - coming in a later phase`}
              >
                {inner}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
