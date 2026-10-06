// Lesson 2: "What is a System?" - seven interactive stages.
// Reuses the shared teaching components (GuideBubble, QuickCheck,
// OrderChallenge); its unique interaction is the "break it, fix it"
// workbench where removing parts degrades a bicycle system live.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { WHAT_IS_A_SYSTEM_LESSON as lesson } from "../data/system-design/what-is-a-system.js";
import GuideBubble from "./GuideBubble.jsx";
import QuickCheck from "./components/QuickCheck.jsx";
import OrderChallenge from "./components/OrderChallenge.jsx";
import { useSystemDesignProgress } from "./progress.jsx";

const INITIAL = {
  stageIndex: 0,
  anatomyOpen: null,
  anatomyExplored: [],
  removed: [],
  sawFailure: false,
  lastToggled: null,
  checkPassed: false,
  solved: false,
  explainText: "",
  explainResult: null, // "pass" | "revealed" | "coach" | null
};

const PART_BY_ID = Object.fromEntries(
  lesson.workbench.parts.map((part) => [part.id, part])
);

export default function WhatIsASystemLesson() {
  const [state, setState] = useState(INITIAL);
  const { completeLesson } = useSystemDesignProgress();
  const topRef = useRef(null);

  const stage = lesson.stages[state.stageIndex];
  const patch = (part) => setState((prev) => ({ ...prev, ...part }));

  function goTo(index) {
    setState((prev) => ({ ...prev, stageIndex: index }));
    topRef.current?.scrollIntoView({ block: "start" });
  }

  useEffect(() => {
    if (stage.id === "summary") completeLesson(lesson.id);
  }, [stage.id, completeLesson]);

  function togglePart(id) {
    setState((prev) => {
      const removed = prev.removed.includes(id)
        ? prev.removed.filter((x) => x !== id)
        : [...prev.removed, id];
      return {
        ...prev,
        removed,
        sawFailure: prev.sawFailure || removed.length > 0,
        lastToggled: id,
      };
    });
  }

  function checkExplanation() {
    const text = state.explainText.toLowerCase();
    const hit = lesson.explain.keywords.some((keyword) =>
      text.includes(keyword)
    );
    patch({ explainResult: hit ? "pass" : "coach" });
  }

  const allOn = state.removed.length === 0;
  const systemState =
    allOn
      ? "working"
      : state.removed.length === 1 && state.removed[0] === "brakes"
        ? "risky"
        : "broken";
  const status = lesson.workbench.states[state.sawFailure && allOn ? "working" : systemState];
  const restored = state.sawFailure && allOn;
  const lastPart = state.lastToggled ? PART_BY_ID[state.lastToggled] : null;
  const lastRemoved = lastPart ? state.removed.includes(lastPart.id) : false;

  const anatomyDone = state.anatomyExplored.length === lesson.anatomy.cards.length;

  const canContinue = {
    intro: true,
    anatomy: true,
    break: state.sawFailure && allOn,
    check: state.checkPassed,
    analyze: state.solved,
    explain: state.explainResult !== null,
    summary: false,
  }[stage.id];

  const continueHint = {
    break: "Try pulling out a part, then put everything back.",
    check: "Answer correctly to continue - mistakes are part of learning.",
    analyze: "Build the correct order to continue.",
    explain: "Check your explanation (or reveal the model answer) to continue.",
  }[stage.id];

  const progressPercent = ((state.stageIndex + 1) / lesson.stages.length) * 100;

  return (
    <div ref={topRef}>
      <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link to="/system-design" className="hover:text-sky-400">
          System Design
        </Link>
        <span className="mx-2">/</span>
        <Link to="/system-design/fundamentals" className="hover:text-sky-400">
          Fundamentals
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{lesson.title}</span>
      </nav>

      {/* Lesson header + progress */}
      <header className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              {lesson.title}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Step {state.stageIndex + 1} of {lesson.stages.length} ·{" "}
              <span className="font-semibold text-sky-400">{stage.chip}</span>
            </p>
          </div>
          <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-400">
            {stage.label}
          </span>
        </div>
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={lesson.stages.length}
          aria-valuenow={state.stageIndex + 1}
          aria-label="Lesson progress"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Stage content */}
      <section className="mt-5" key={stage.id}>
        {stage.id === "intro" && (
          <div className="sd-appear flex flex-col gap-4">
            <GuideBubble>
              <strong className="text-white">What is a system?</strong>{" "}
              {lesson.intro.tease}
            </GuideBubble>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.intro.heading}
              </h2>
              <p className="mt-3 rounded-lg border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-sm font-medium text-sky-100">
                {lesson.intro.definition}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {lesson.intro.body}
              </p>
              <p className="mt-4 rounded-lg bg-slate-950/60 px-4 py-3 text-xs leading-relaxed text-slate-400">
                <span className="font-semibold text-slate-300">Think of it: </span>
                {lesson.intro.analogy}
              </p>
            </div>
          </div>
        )}

        {stage.id === "anatomy" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.anatomy.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {lesson.anatomy.hint}{" "}
                <span className="text-slate-500">
                  ({state.anatomyExplored.length} of{" "}
                  {lesson.anatomy.cards.length} explored)
                </span>
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {lesson.anatomy.cards.map((card) => {
                  const open = state.anatomyOpen === card.id;
                  const explored = state.anatomyExplored.includes(card.id);
                  return (
                    <button
                      key={card.id}
                      type="button"
                      aria-expanded={open}
                      onClick={() =>
                        patch({
                          anatomyOpen: open ? null : card.id,
                          anatomyExplored: explored
                            ? state.anatomyExplored
                            : [...state.anatomyExplored, card.id],
                        })
                      }
                      className={`rounded-xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        open
                          ? "border-sky-400/60 bg-sky-400/10"
                          : "border-slate-800 bg-slate-950/60 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl" aria-hidden="true">
                          {card.emoji}
                        </span>
                        <div className="min-w-0">
                          <span className="block text-sm font-semibold text-white">
                            {card.name}
                            {explored && (
                              <span className="ml-2 text-xs text-emerald-400">
                                ✓
                              </span>
                            )}
                          </span>
                          <span className="block text-xs text-slate-400">
                            {card.tagline}
                          </span>
                        </div>
                      </div>
                      {open && (
                        <div className="sd-appear mt-3 border-t border-slate-700/70 pt-3 text-xs leading-relaxed text-slate-300">
                          <p>
                            <span className="font-semibold text-sky-300">
                              Think of it:{" "}
                            </span>
                            {card.analogy}
                          </p>
                          <p className="mt-2">
                            <span className="font-semibold text-amber-300">
                              Without it:{" "}
                            </span>
                            {card.without}
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {anatomyDone ? (
              <GuideBubble mood="success">
                <strong className="text-white">
                  {lesson.anatomy.complete}
                </strong>{" "}
                Now let us see what happens when one of them goes missing.
              </GuideBubble>
            ) : (
              <GuideBubble>
                Each card hides an <span className="text-sky-300">analogy</span>{" "}
                and what happens <span className="text-amber-300">
                  without it
                </span>
                . Open them all!
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "break" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.workbench.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {lesson.workbench.body}
              </p>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {lesson.workbench.goalLabel}{" "}
                <span aria-hidden="true">🎯</span>
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {lesson.workbench.parts.map((part) => {
                  const isOut = state.removed.includes(part.id);
                  return (
                    <button
                      key={part.id}
                      type="button"
                      aria-pressed={!isOut}
                      onClick={() => togglePart(part.id)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        isOut
                          ? "border-red-500/60 bg-red-500/10 text-red-200"
                          : "border-slate-700 bg-slate-950/60 text-slate-200 hover:border-slate-500"
                      }`}
                    >
                      <span aria-hidden="true">{part.emoji}</span>
                      {part.name}
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                        {isOut ? "removed" : "in"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                className={`sd-appear mt-4 rounded-xl border px-4 py-3 ${
                  status.icon === "🟢"
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : status.icon === "🟠"
                      ? "border-amber-500/40 bg-amber-500/10"
                      : "border-red-500/40 bg-red-500/10"
                }`}
                aria-live="polite"
              >
                <p className="text-sm font-semibold text-white">
                  {status.icon} {status.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  {status.body}
                </p>
              </div>

              {lastPart && (
                <p
                  aria-live="polite"
                  className="sd-appear mt-3 rounded-lg bg-slate-950/60 px-3 py-2 text-xs leading-relaxed text-slate-400"
                >
                  <span className="font-semibold text-slate-300">
                    {lastRemoved ? "Removed" : "Restored"} {lastPart.emoji}{" "}
                    {lastPart.name}:{" "}
                  </span>
                  {lastRemoved ? lastPart.off : lastPart.on}
                </p>
              )}

              {restored && (
                <p className="sd-appear mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-center text-sm font-medium text-emerald-300">
                  ✓ {lesson.workbench.restored}
                </p>
              )}
            </div>

            {!canContinue && (
              <GuideBubble mood="hint">
                Everything works right now - try{" "}
                <span className="font-semibold text-white">taking the chain out</span>{" "}
                and watch what happens. Then put it back.
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "check" && (
          <div className="sd-appear flex flex-col gap-4">
            <QuickCheck
              quiz={lesson.quiz}
              onCorrect={() => patch({ checkPassed: true })}
            />
            {state.checkPassed ? (
              <GuideBubble mood="success">
                <strong className="text-white">Nice! 🎉</strong> Now you know
                the real test: not "does it have parts" but{" "}
                <span className="text-sky-300">
                  "do the parts work together toward a goal"
                </span>
                .
              </GuideBubble>
            ) : (
              <GuideBubble mood="hint">
                Wrong answers here are <em>useful</em> - each one exposes a
                tempting shortcut definition. Read, learn, try again.
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "analyze" && (
          <div className="sd-appear flex flex-col gap-4">
            <OrderChallenge
              build={lesson.build}
              onSolved={() => patch({ solved: true })}
            />
            {!state.solved && (
              <GuideBubble>
                Tip: always start with{" "}
                <span className="text-sky-300">why it exists</span> - the goal
                decides which parts and connections even matter.
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "explain" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                Explain your choice
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.explain.prompt}
              </p>
              <label className="sr-only" htmlFor="explain-answer">
                Your explanation
              </label>
              <textarea
                id="explain-answer"
                rows={3}
                value={state.explainText}
                onChange={(event) => patch({ explainText: event.target.value })}
                placeholder={lesson.explain.placeholder}
                className="mt-3 w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
              />
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={checkExplanation}
                  disabled={state.explainText.trim().length === 0}
                  className="rounded-lg bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {lesson.explain.checkButton}
                </button>
                <button
                  type="button"
                  onClick={() => patch({ explainResult: "revealed" })}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                >
                  {lesson.explain.revealButton}
                </button>
              </div>

              <div aria-live="polite">
                {state.explainResult === "pass" && (
                  <div className="sd-appear mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm">
                    <p className="font-semibold text-emerald-300">
                      ✓ {lesson.explain.passTitle}
                    </p>
                    <p className="mt-1 text-slate-300">
                      {lesson.explain.passBody}
                    </p>
                  </div>
                )}
                {state.explainResult === "coach" && (
                  <div className="sd-appear mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
                    <p className="font-semibold text-amber-300">
                      {lesson.explain.coachTitle}
                    </p>
                    <p className="mt-1 text-slate-300">
                      {lesson.explain.coachBody}
                    </p>
                  </div>
                )}
              </div>

              {(state.explainResult === "pass" ||
                state.explainResult === "revealed") && (
                <div className="sd-appear mt-4 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm">
                  <p className="font-semibold text-indigo-300">Model answer</p>
                  <p className="mt-1 leading-relaxed text-slate-300">
                    {lesson.explain.modelAnswer}
                  </p>
                </div>
              )}
            </div>

            <GuideBubble>
              There is no single perfect wording - the check just looks for the
              key idea:{" "}
              <span className="text-sky-300">
                parts that connect and work together toward a goal
              </span>
              .
            </GuideBubble>
          </div>
        )}

        {stage.id === "summary" && (
          <div className="sd-appear flex flex-col gap-4">
            <GuideBubble mood="success">
              <strong className="text-white">
                {lesson.summary.congrats}
              </strong>{" "}
              Pile, meet system.
            </GuideBubble>

            <div className="grid gap-3 sm:grid-cols-2">
              {lesson.summary.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4"
                >
                  <h3 className="text-sm font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-sm leading-relaxed text-slate-300">
              {lesson.summary.closing}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/system-design/fundamentals"
                className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                ← Back to Fundamentals
              </Link>
              <button
                type="button"
                onClick={() => setState({ ...INITIAL })}
                className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                ↻ Replay lesson
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Stage navigation */}
      {stage.id !== "summary" && (
        <nav
          className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4"
          aria-label="Lesson steps"
        >
          <button
            type="button"
            onClick={() => goTo(state.stageIndex - 1)}
            disabled={state.stageIndex === 0}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Back
          </button>

          <div className="text-center">
            <p className="text-xs font-medium text-slate-400">{stage.label}</p>
            {continueHint && !canContinue && (
              <p className="mt-0.5 text-[11px] text-amber-400/90">
                {continueHint}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => goTo(state.stageIndex + 1)}
            disabled={!canContinue}
            className="rounded-lg bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue →
          </button>
        </nav>
      )}
    </div>
  );
}
