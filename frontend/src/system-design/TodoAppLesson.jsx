// "How does a Todo App work?" - the first interactive System Design lesson.
//
// Six stages built as a miniature simulation the learner can WATCH:
//   1. Journey  - click ADD, see the glowing message travel Frontend ->
//                 Backend -> Database and come back (Play / Step / Reset)
//   2. Quiz     - where should the todo be remembered? Learn from a mistake
//                 with a visual "the screen closes, the notebook stays"
//   3. Break    - turn the database OFF, watch the trip fail, repair it,
//                 watch it succeed
//   4. Cards    - four simple answers (frontend / backend / db / req-resp)
//   5. Challenge- rebuild the whole round trip in six slots
//   6. Summary  - the words you now know + way back
//
// Technical terms (REQUEST / RESPONSE) only appear AFTER their visual.
// Everything is local React state: no backend, no persistence.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  LESSON_STAGES,
  TODO_APP_LESSON as lesson,
} from "../data/system-design/fundamentals.js";
import GuideBubble from "./GuideBubble.jsx";
import SystemSimulator from "./components/SystemSimulator.jsx";
import RoundTripOrder from "./components/RoundTripOrder.jsx";
import { useSystemDesignProgress } from "./progress.jsx";

const INITIAL = {
  stageIndex: 0,
  journeyDone: false,
  quizMistake: null, // option id of the last wrong pick
  quizMistakeCount: 0,
  quizPassed: false,
  dbOff: false,
  runKey: 0,
  sawFail: false,
  breakDone: false,
  challengeSolved: false,
  todoLabel: lesson.journey.defaultTodo,
};

export default function TodoAppLesson() {
  const [state, setState] = useState(INITIAL);
  const { completeLesson } = useSystemDesignProgress();
  const topRef = useRef(null);

  const stage = LESSON_STAGES[state.stageIndex];
  const patch = (part) => setState((prev) => ({ ...prev, ...part }));

  // Story text can mention whichever todo the learner actually typed.
  const fill = (str) => str.replaceAll("{todo}", state.todoLabel);

  function goTo(index) {
    setState((prev) => ({ ...prev, stageIndex: index }));
    topRef.current?.scrollIntoView({ block: "start" });
  }

  // Reaching the summary completes the lesson (in-memory progress only).
  useEffect(() => {
    if (stage.id === "summary") completeLesson(lesson.id);
  }, [stage.id, completeLesson]);

  // Break stage: turning the database OFF auto-starts the failing trip.
  function toggleDatabase() {
    setState((prev) => {
      const nextOff = !prev.dbOff;
      return {
        ...prev,
        dbOff: nextOff,
        runKey: nextOff ? prev.runKey + 1 : prev.runKey,
      };
    });
  }

  function answerQuiz(option) {
    if (state.quizPassed) return;
    if (option.correct) {
      patch({ quizPassed: true, quizMistake: null });
    } else {
      patch({
        quizMistake: option.id,
        quizMistakeCount: state.quizMistakeCount + 1,
      });
    }
  }

  const canContinue = {
    journey: state.journeyDone,
    quiz: state.quizPassed,
    break: state.breakDone,
    cards: true,
    challenge: state.challengeSolved,
    summary: false,
  }[stage.id];

  const continueHint = {
    journey: "Watch one full trip to continue.",
    quiz: "Answer correctly to continue - mistakes are part of learning.",
    break: lesson.breakStage.gateHint,
    challenge: lesson.challenge.gateHint,
  }[stage.id];

  const progressPercent = ((state.stageIndex + 1) / LESSON_STAGES.length) * 100;

  const quizMistakeOption = state.quizMistake
    ? lesson.quiz.options.find((option) => option.id === state.quizMistake)
    : null;

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
        {stage.id === "journey" && (
          <div className="sd-appear flex flex-col gap-4">
            <GuideBubble mood={state.journeyDone ? "success" : undefined}>
              {state.journeyDone ? (
                <>
                  <strong className="text-white">
                    You just watched a complete trip!
                  </strong>{" "}
                  Down as a REQUEST, back as a RESPONSE. Now let us check what
                  you really saw.
                </>
              ) : (
                <>
                  <strong className="text-white">
                    Welcome to your first system design story.
                  </strong>{" "}
                  Let us follow ONE todo. Type anything (try: Buy milk), press
                  ADD, then watch the glowing message travel - or press Step to
                  move one beat at a time.
                </>
              )}
            </GuideBubble>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">
                Watch one todo make the full trip
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                Three parts, one glowing message. Play the whole animation, or
                step through it - the explanation under the diagram updates at
                every stop.
              </p>
              <div className="mt-4">
                <SystemSimulator
                  journey={lesson.journey}
                  onDone={() => patch({ journeyDone: true })}
                  onMessage={(label) => patch({ todoLabel: label })}
                />
              </div>
            </div>
          </div>
        )}

        {stage.id === "quiz" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {fill(lesson.quiz.question)}
              </h2>
              <p className="mt-1 text-sm text-slate-400">{lesson.quiz.intro}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {lesson.quiz.options.map((option) => {
                  const picked = state.quizMistake === option.id;
                  const correctPick =
                    state.quizPassed && option.correct;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      data-quiz-option={option.id}
                      onClick={() => answerQuiz(option)}
                      disabled={state.quizPassed}
                      className={`rounded-xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-default ${
                        correctPick
                          ? "border-emerald-400/60 bg-emerald-400/10"
                          : picked
                            ? "border-amber-400/60 bg-amber-400/10"
                            : "border-slate-800 bg-slate-950/60 hover:border-slate-600"
                      }`}
                    >
                      <span className="block text-sm font-semibold text-white">
                        {option.label}
                        {correctPick && (
                          <span className="ml-2 text-xs text-emerald-400">
                            ✓
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div aria-live="polite">
                {quizMistakeOption && !state.quizPassed && (
                  <div
                    key={state.quizMistakeCount}
                    className="sd-shake sd-appear mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm"
                  >
                    <p className="font-semibold text-amber-300">
                      {lesson.quiz.wrongHeading}
                    </p>

                    {/* Visual proof: the screen closes, the notebook stays. */}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div
                        key={`demo-${state.quizMistakeCount}`}
                        className="sim-close rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-center"
                      >
                        <span className="block text-2xl" aria-hidden="true">
                          📱
                        </span>
                        <span className="block text-xs font-medium text-slate-300">
                          {lesson.quiz.demoScreen}
                        </span>
                        <span className="block text-[10px] text-slate-500">
                          {lesson.quiz.demoScreenNote}
                        </span>
                      </div>
                      <span aria-hidden="true" className="text-slate-500">
                        vs
                      </span>
                      <div className="rounded-lg border border-fuchsia-400/40 bg-fuchsia-500/10 px-4 py-3 text-center">
                        <span className="block text-2xl" aria-hidden="true">
                          🗄️
                        </span>
                        <span className="block text-xs font-medium text-fuchsia-200">
                          {lesson.quiz.demoNote}
                        </span>
                        <span className="block text-[10px] text-fuchsia-400/70">
                          {lesson.quiz.demoNoteNote}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 leading-relaxed text-slate-300">
                      {lesson.quiz.demoCaption}
                    </p>
                    <p className="mt-2 leading-relaxed text-slate-300">
                      <span className="font-semibold text-white">
                        Why "{quizMistakeOption.label}" is not the place:{" "}
                      </span>
                      {fill(quizMistakeOption.teach)}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-amber-300/80">
                      Try again - pick another answer.
                    </p>
                  </div>
                )}

                {state.quizPassed && (
                  <div className="sd-appear mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm">
                    <p className="font-semibold text-emerald-300">
                      ✓ {fill(lesson.quiz.correctText)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {!state.quizPassed && (
              <GuideBubble mood="hint">
                Wrong answers here are <em>useful</em> - each one shows you
                exactly what that part cannot do. Read, learn, try again.
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "break" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.breakStage.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.breakStage.body}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  data-db-toggle
                  aria-pressed={!state.dbOff}
                  onClick={toggleDatabase}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                    state.dbOff
                      ? "bg-red-500/15 text-red-300 ring-1 ring-red-400/50 hover:bg-red-500/25"
                      : "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/50 hover:bg-emerald-500/25"
                  }`}
                >
                  {state.dbOff
                    ? lesson.breakStage.toggleOff
                    : lesson.breakStage.toggleOn}
                </button>
                <span
                  className={`text-xs font-medium ${
                    state.dbOff ? "text-red-300" : "text-emerald-300"
                  }`}
                >
                  {state.dbOff
                    ? lesson.breakStage.statusOff
                    : lesson.breakStage.statusOn}
                </span>
              </div>

              <div className="mt-4">
                <SystemSimulator
                  journey={lesson.journey}
                  dbOff={state.dbOff}
                  runKey={state.runKey}
                  onDone={() => {
                    if (state.sawFail) patch({ breakDone: true });
                  }}
                  onFail={() => {
                    if (!state.sawFail) patch({ sawFail: true });
                  }}
                />
              </div>

              <div aria-live="polite">
                {state.sawFail && state.breakDone && (
                  <div className="sd-appear mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm">
                    <p className="font-semibold text-emerald-300">
                      ✓ {lesson.breakStage.successText}
                    </p>
                  </div>
                )}
                {state.sawFail && !state.breakDone && (
                  <div className="sd-appear mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm">
                    <p className="font-semibold text-red-300">
                      ✕ {lesson.breakStage.failPanel}
                    </p>
                    <p className="mt-1 leading-relaxed text-slate-300">
                      {state.dbOff
                        ? lesson.breakStage.retryHint
                        : lesson.breakStage.restoredHint}
                    </p>
                  </div>
                )}
                {!state.sawFail && (
                  <p className="mt-4 text-xs leading-relaxed text-slate-500">
                    Press{" "}
                    <span className="font-semibold text-slate-300">
                      {lesson.breakStage.toggleOffShort}
                    </span>{" "}
                    to switch the database off - the trip will start by itself.
                  </p>
                )}
              </div>
            </div>

            <GuideBubble mood={state.breakDone ? "success" : "hint"}>
              {state.breakDone ? (
                <>
                  <strong className="text-white">You fixed the system!</strong>{" "}
                  Every part matters: the screen shows, the worker saves, the
                  notebook remembers - take one away and the trip breaks.
                </>
              ) : (
                <>
                  Failures are how engineers learn. Break it on purpose, watch{" "}
                  <span className="text-red-300">where</span> it breaks, then
                  repair it.
                </>
              )}
            </GuideBubble>
          </div>
        )}

        {stage.id === "cards" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.cards.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {lesson.cards.body}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {lesson.cards.items.map((card) => (
                  <div
                    key={card.name}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" aria-hidden="true">
                        {card.emoji}
                      </span>
                      <span className="text-sm font-semibold uppercase tracking-wider text-white">
                        {card.name}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <GuideBubble>
              Say them out loud:{" "}
              <span className="text-cyan-300">frontend shows</span>,{" "}
              <span className="text-violet-300">backend works</span>,{" "}
              <span className="text-fuchsia-300">database remembers</span>,{" "}
              <span className="text-sky-300">request out, response back</span>.
              That is the whole language.
            </GuideBubble>
          </div>
        )}

        {stage.id === "challenge" && (
          <div className="sd-appear flex flex-col gap-4">
            <RoundTripOrder
              challenge={lesson.challenge}
              onSolved={() => patch({ challengeSolved: true })}
            />
            {!state.challengeSolved && (
              <GuideBubble>
                Tip: the trip always starts at the{" "}
                <span className="text-cyan-300">screen</span> - and the answer
                always starts where the data was saved: the{" "}
                <span className="text-fuchsia-300">notebook</span>.
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "summary" && (
          <div className="sd-appear flex flex-col gap-4">
            <GuideBubble mood="success">
              <strong className="text-white">
                {lesson.summary.congrats}
              </strong>{" "}
              You watched it, broke it, fixed it, named every part, and traced
              the whole trip. That is how system design actually works.
            </GuideBubble>

            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                {lesson.summary.wordsHeading}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {lesson.summary.words.map((word) => (
                  <span
                    key={word.term}
                    className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs"
                  >
                    <strong className="text-white">{word.term}</strong>{" "}
                    <span className="text-slate-400">- {word.def}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm leading-relaxed text-slate-300">
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
