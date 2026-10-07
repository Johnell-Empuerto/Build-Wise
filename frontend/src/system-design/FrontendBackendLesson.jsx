// Lesson 4: "Frontend vs Backend" - seven interactive stages.
// Unique interaction: "Fix the Split" - a mis-split codebase where the
// learner clicks misplaced lines to move them to the correct side, with
// security/presentation teaching on every fix.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FRONTEND_BACKEND_LESSON as lesson } from "../data/system-design/frontend-backend.js";
import GuideBubble from "./GuideBubble.jsx";
import QuickCheck from "./components/QuickCheck.jsx";
import OrderChallenge from "./components/OrderChallenge.jsx";
import { useSystemDesignProgress } from "./progress.jsx";

const INITIAL = {
  stageIndex: 0,
  sidesOpen: null,
  sidesExplored: [],
  fixed: {},
  noted: {},
  checkPassed: false,
  solved: false,
  explainText: "",
  explainResult: null, // "pass" | "revealed" | "coach" | null
};

const WRONG_ITEMS = lesson.fix.items.filter((item) => !item.correct);

export default function FrontendBackendLesson() {
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

  function clickItem(item) {
    if (item.correct) {
      patch({ noted: { ...state.noted, [item.id]: true } });
      return;
    }
    if (!state.fixed[item.id]) {
      patch({ fixed: { ...state.fixed, [item.id]: true } });
    }
  }

  function checkExplanation() {
    const text = state.explainText.toLowerCase();
    const hit = lesson.explain.keywords.some((keyword) =>
      text.includes(keyword)
    );
    patch({ explainResult: hit ? "pass" : "coach" });
  }

  const sidesDone = state.sidesExplored.length === lesson.sides.cards.length;
  const fixCount = WRONG_ITEMS.filter((item) => state.fixed[item.id]).length;
  const fixDone = fixCount === WRONG_ITEMS.length;

  const canContinue = {
    intro: true,
    sides: true,
    fix: fixDone,
    check: state.checkPassed,
    build: state.solved,
    explain: state.explainResult !== null,
    summary: false,
  }[stage.id];

  const continueHint = {
    fix: `Find and fix both misplaced lines (${fixCount}/${WRONG_ITEMS.length} fixed).`,
    check: "Answer correctly to continue - mistakes are part of learning.",
    build: "Build the correct order to continue.",
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
              <strong className="text-white">
                Frontend and backend - the famous pair.
              </strong>{" "}
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

        {stage.id === "sides" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.sides.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {lesson.sides.hint}{" "}
                <span className="text-slate-500">
                  ({state.sidesExplored.length} of{" "}
                  {lesson.sides.cards.length} explored)
                </span>
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {lesson.sides.cards.map((card) => {
                  const open = state.sidesOpen === card.id;
                  const explored = state.sidesExplored.includes(card.id);
                  return (
                    <button
                      key={card.id}
                      type="button"
                      aria-expanded={open}
                      onClick={() =>
                        patch({
                          sidesOpen: open ? null : card.id,
                          sidesExplored: explored
                            ? state.sidesExplored
                            : [...state.sidesExplored, card.id],
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

            {sidesDone ? (
              <GuideBubble mood="success">
                <strong className="text-white">{lesson.sides.complete}</strong>{" "}
                Next, a real codebase got this split wrong - time to repair it.
              </GuideBubble>
            ) : (
              <GuideBubble>
                The third card holds{" "}
                <span className="text-sky-300">why the split exists</span> at
                all. Open all three!
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "fix" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.fix.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {lesson.fix.body}{" "}
                <span className="text-slate-500">
                  ({fixCount}/{WRONG_ITEMS.length} fixed)
                </span>
              </p>

              <div className="mt-4 flex flex-col gap-2">
                {lesson.fix.items.map((item) => {
                  const wasWrong = !item.correct;
                  const isFixed = Boolean(state.fixed[item.id]);
                  const isRight = item.correct;
                  const showNote = (isRight && state.noted[item.id]) || isFixed;
                  const showTeach = wasWrong && isFixed;
                  const currentSide = wasWrong
                    ? isFixed
                      ? item.fixSide
                      : item.side
                    : item.side;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-fix-item={item.id}
                      onClick={() => clickItem(item)}
                      className={`rounded-lg border px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        isFixed
                          ? "border-emerald-500/40 bg-emerald-500/10"
                          : wasWrong
                            ? "border-amber-500/50 bg-amber-500/10 hover:border-amber-400"
                            : state.noted[item.id]
                              ? "border-slate-600 bg-slate-950/80"
                              : "border-slate-700 bg-slate-950/60 hover:border-slate-500"
                      }`}
                      aria-live="polite"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-medium text-slate-200">
                          {item.text}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            currentSide === "frontend"
                              ? "border-sky-400/40 bg-sky-400/10 text-sky-300"
                              : "border-violet-400/40 bg-violet-400/10 text-violet-300"
                          }`}
                        >
                          in {currentSide}
                        </span>
                      </div>

                      {isRight && !showNote && (
                        <p className="mt-1.5 text-xs text-slate-500">
                          Click to hear why it is placed correctly.
                        </p>
                      )}
                      {wasWrong && !isFixed && (
                        <p className="mt-1.5 text-xs text-amber-400/90">
                          ⚠ This line looks misplaced - click to fix it.
                        </p>
                      )}
                      {isRight && showNote && (
                        <p className="mt-1.5 text-xs text-slate-400">
                          <span className="font-semibold text-emerald-300">
                            ✓ Right where it belongs:{" "}
                          </span>
                          {item.note}
                        </p>
                      )}
                      {showTeach && (
                        <p className="sd-appear mt-1.5 text-xs leading-relaxed text-emerald-200">
                          <span className="font-semibold text-emerald-300">
                            ✓ Moved to {item.fixSide}:{" "}
                          </span>
                          {item.teach}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {fixDone && (
                <p className="sd-appear mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-center text-sm font-medium text-emerald-300">
                  ✓ {lesson.fix.solved}
                </p>
              )}
            </div>

            {!fixDone && (
              <GuideBubble mood="hint">
                Ask of every line:{" "}
                <span className="text-sky-300">who owns this?</span> Rules and
                secrets belong to the backend; pixels and messages belong to
                the frontend.
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
                <strong className="text-white">Exactly! 🎉</strong> One rule,
                one judge, in a place nobody can rewrite - that is how backend
                decisions work.
              </GuideBubble>
            ) : (
              <GuideBubble mood="hint">
                Every wrong answer here puts the rule somewhere it can be
                cheated or forked. Read the teaching, then try again.
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "build" && (
          <div className="sd-appear flex flex-col gap-4">
            <OrderChallenge
              build={lesson.build}
              onSolved={() => patch({ solved: true })}
            />
            {!state.solved && (
              <GuideBubble>
                Tip: every journey starts when{" "}
                <span className="text-sky-300">the screen catches your tap</span>{" "}
                - the backend never moves first.
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
              The check looks for one core idea:{" "}
              <span className="text-sky-300">
                frontend code can be read and changed, backend code cannot
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
              Frontend shows, backend decides - and now you can place any
              feature yourself.
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
