// "How does a Todo App work?" - the first interactive System Design lesson.
//
// Eight stages that follow the learning philosophy:
//   See it -> Understand it -> Interact -> See what happens ->
//   Make a mistake (and learn why) -> Try again -> Build it -> Explain it
// Everything is local React state: no backend, no persistence.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  LESSON_STAGES,
  TODO_APP_LESSON as lesson,
} from "../data/system-design/fundamentals.js";
import GuideBubble from "./GuideBubble.jsx";
import FlowDiagram from "./components/FlowDiagram.jsx";
import QuickCheck from "./components/QuickCheck.jsx";
import OrderChallenge from "./components/OrderChallenge.jsx";
import { useSystemDesignProgress } from "./progress.jsx";

const INITIAL = {
  stageIndex: 0,
  teamOpen: null,
  teamExplored: [],
  flowDone: false,
  runKey: 0,
  addedCount: 0,
  checkPassed: false,
  buildSolved: false,
  explainText: "",
  explainResult: null, // "pass" | "revealed" | null
};

export default function TodoAppLesson() {
  const [state, setState] = useState(INITIAL);
  const { completeLesson } = useSystemDesignProgress();
  const topRef = useRef(null);

  const stage = LESSON_STAGES[state.stageIndex];
  const patch = (part) => setState((prev) => ({ ...prev, ...part }));

  function goTo(index) {
    setState((prev) => ({ ...prev, stageIndex: index }));
    topRef.current?.scrollIntoView({ block: "start" });
  }

  // Reaching the summary completes the lesson (in-memory progress only).
  useEffect(() => {
    if (stage.id === "summary") completeLesson(lesson.id);
  }, [stage.id, completeLesson]);

  function checkExplanation() {
    const text = state.explainText.toLowerCase();
    const hit = lesson.explain.keywords.some((keyword) =>
      text.includes(keyword)
    );
    patch({ explainResult: hit ? "pass" : "coach" });
  }

  function revealModelAnswer() {
    patch({ explainResult: "revealed" });
  }

  const canContinue = {
    intro: true,
    team: true,
    flow: state.flowDone,
    try: state.addedCount > 0,
    check: state.checkPassed,
    build: state.buildSolved,
    explain: state.explainResult !== null,
    summary: false,
  }[stage.id];

  const continueHint = {
    flow: "Play the full flow once to continue.",
    try: "Add a todo to continue.",
    check: "Answer correctly to continue - mistakes are part of learning.",
    build: "Build the correct flow to continue.",
    explain: "Check your explanation (or reveal the model answer) to continue.",
  }[stage.id];

  const progressPercent = ((state.stageIndex + 1) / LESSON_STAGES.length) * 100;

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
              Step {state.stageIndex + 1} of {LESSON_STAGES.length} ·{" "}
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
          aria-valuemax={LESSON_STAGES.length}
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
                Welcome to your first system design story.
              </strong>{" "}
              {lesson.intro.tease}
            </GuideBubble>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.intro.heading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {lesson.intro.body}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold">
                {lesson.hops.map((hop, index) => (
                  <span key={hop.id} className="flex items-center gap-2">
                    <span className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-slate-300">
                      {hop.emoji} {hop.name}
                    </span>
                    {index < lesson.hops.length - 1 && (
                      <span aria-hidden="true" className="text-slate-600">
                        ↓
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500">
                ↓ This is the path your todo will travel. You will animate it
                in a moment - first, meet each part.
              </p>
            </div>
          </div>
        )}

        {stage.id === "team" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                Meet the team
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Tap each card to hear its story.{" "}
                <span className="text-slate-500">
                  ({state.teamExplored.length} of {lesson.team.length}{" "}
                  explored)
                </span>
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {lesson.team.map((member) => {
                  const open = state.teamOpen === member.id;
                  const explored = state.teamExplored.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      aria-expanded={open}
                      onClick={() => {
                        patch({
                          teamOpen: open ? null : member.id,
                          teamExplored: explored
                            ? state.teamExplored
                            : [...state.teamExplored, member.id],
                        });
                      }}
                      className={`rounded-xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        open
                          ? "border-sky-400/60 bg-sky-400/10"
                          : "border-slate-800 bg-slate-950/60 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="text-2xl"
                          aria-hidden="true"
                        >
                          {member.emoji}
                        </span>
                        <div className="min-w-0">
                          <span className="block text-sm font-semibold text-white">
                            {member.name}
                            {explored && (
                              <span className="ml-2 text-xs text-emerald-400">
                                ✓
                              </span>
                            )}
                          </span>
                          <span className="block text-xs text-slate-400">
                            {member.tagline}
                          </span>
                        </div>
                      </div>
                      {open && (
                        <div className="sd-appear mt-3 border-t border-slate-700/70 pt-3 text-xs leading-relaxed text-slate-300">
                          <p>
                            <span className="font-semibold text-sky-300">
                              Think of it:{" "}
                            </span>
                            {member.analogy}
                          </p>
                          <p className="mt-2">
                            <span className="font-semibold text-amber-300">
                              Without it:{" "}
                            </span>
                            {member.without}
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {state.teamExplored.length === lesson.team.length ? (
              <GuideBubble mood="success">
                <strong className="text-white">Perfect - that is the whole team!</strong>{" "}
                Screen, messenger, worker, notebook. Now let us watch them
                pass one todo between them.
              </GuideBubble>
            ) : (
              <GuideBubble>
                Every card hides two things: an{" "}
                <span className="text-sky-300">analogy</span> and what would
                happen <span className="text-amber-300">without it</span>.
                Open them all!
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "flow" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                Follow the request
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.flow.instruction}
              </p>
              <div className="mt-5">
                <FlowDiagram
                  hops={lesson.hops}
                  onComplete={() => patch({ flowDone: true })}
                  requestLabel={lesson.flow.requestLabel}
                  responseLabel={lesson.flow.responseLabel}
                  completeText={lesson.flow.completeText}
                />
              </div>
            </div>
            {!state.flowDone && (
              <GuideBubble mood="hint">
                Watch the dot go all the way down{" "}
                <span className="font-semibold text-white">and back up</span>{" "}
                before moving on - the trip home matters just as much.
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "try" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.tryIt.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {lesson.tryIt.body}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => patch({ runKey: state.runKey + 1 })}
                  className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                >
                  {lesson.tryIt.button}
                </button>
                {state.addedCount > 0 && (
                  <span className="text-xs text-slate-500">
                    {state.addedCount} todo{state.addedCount === 1 ? "" : "s"}{" "}
                    added this session
                  </span>
                )}
              </div>

              <div className="mt-5">
                <FlowDiagram
                  hops={lesson.hops}
                  runKey={state.runKey}
                  onComplete={() =>
                    patch({ addedCount: state.addedCount + 1 })
                  }
                  requestLabel={lesson.flow.requestLabel}
                  responseLabel={lesson.flow.responseLabel}
                  completeText={lesson.flow.completeText}
                />
              </div>

              {state.addedCount > 0 && (
                <div className="sd-appear mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                  <p className="text-lg font-bold text-emerald-400">
                    {lesson.tryIt.addedText}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    {lesson.tryIt.resultCaption}
                  </p>
                </div>
              )}
            </div>
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
                <strong className="text-white">Nice! 🎉</strong> You know
                where data really lives. Remember: the frontend shows, the
                backend works, the database remembers - even after the server
                restarts.
              </GuideBubble>
            ) : (
              <GuideBubble mood="hint">
                Wrong answers here are <em>useful</em> - each one tells you
                exactly why that part cannot store your todo. Read, learn,
                try again.
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "build" && (
          <div className="sd-appear flex flex-col gap-4">
            <OrderChallenge
              build={lesson.build}
              onSolved={() => patch({ buildSolved: true })}
            />
            {!state.buildSolved && (
              <GuideBubble>
                Tip: a todo always starts with{" "}
                <span className="text-sky-300">a person asking</span> - and
                ends where data can be{" "}
                <span className="text-fuchsia-300">remembered</span>.
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
                onChange={(event) =>
                  patch({ explainText: event.target.value })
                }
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
                  onClick={revealModelAnswer}
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
                  <p className="font-semibold text-indigo-300">
                    Model answer
                  </p>
                  <p className="mt-1 leading-relaxed text-slate-300">
                    {lesson.explain.modelAnswer}
                  </p>
                </div>
              )}
            </div>

            <GuideBubble>
              There is no single perfect wording - the check just looks for
              the key idea:{" "}
              <span className="text-sky-300">
                the database stores and remembers
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
              You saw it, touched it, missed once, fixed it, built it, and
              explained it. That is how system design actually works.
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
            <p className="text-xs font-medium text-slate-400">
              {stage.label}
            </p>
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
