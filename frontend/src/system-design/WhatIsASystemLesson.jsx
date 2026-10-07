// Lesson 2: "What is a System?" - fourteen interactive stages.
//
// Bicycle (real world) -> parts -> run it -> break it -> goal ->
// morph to software -> todo flow -> break the app -> connections ->
// builder -> goal quiz -> real systems -> final challenge -> finale.
// Reuses QuickCheck; unique pieces are BicycleSystem, TodoFlow, and
// SystemBuilder. All state is local React state, no persistence.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { WHAT_IS_A_SYSTEM_LESSON as lesson } from "../data/system-design/what-is-a-system.js";
import GuideBubble from "./GuideBubble.jsx";
import QuickCheck from "./components/QuickCheck.jsx";
import BicycleSystem from "./components/BicycleSystem.jsx";
import TodoFlow from "./components/TodoFlow.jsx";
import SystemBuilder from "./components/SystemBuilder.jsx";
import { useSystemDesignProgress } from "./progress.jsx";

const INITIAL = {
  stageIndex: 0,
  assembled: false,
  assembledOnce: false,
  selectedPart: null,
  explored: [],
  rideDone: false,
  removed: [],
  sawFail: false,
  removeRideOk: false,
  goalStep: 0,
  goalTraced: false,
  morphStarted: false,
  morphDone: false,
  flowDone: false,
  todoMissing: [],
  todoSawFail: false,
  todoDone: false,
  links: { a: false, b: false },
  connDone: false,
  built: false,
  quizPassed: false,
  exampleOpen: null,
  examplesSeen: [],
  finalPassed: false,
  finale: 0,
};

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

  // Stage 5: the three answers reveal one after another.
  function traceGoal() {
    if (state.goalTraced) return;
    patch({ goalStep: 1 });
    window.setTimeout(() => patch({ goalStep: 2 }), 950);
    window.setTimeout(() => patch({ goalStep: 3 }), 1900);
    window.setTimeout(() => patch({ goalStep: 4, goalTraced: true }), 2750);
  }

  // Stage 6: the bicycle flips into the todo app.
  function startMorph() {
    if (state.morphStarted) return;
    patch({ morphStarted: true });
    window.setTimeout(() => patch({ morphDone: true }), 1400);
  }

  function toggleRemove(id) {
    setState((prev) => {
      const removed = prev.removed.includes(id)
        ? prev.removed.filter((x) => x !== id)
        : [...prev.removed, id];
      return { ...prev, removed, removeRideOk: false };
    });
  }

  function toggleTodoPart(id) {
    setState((prev) => {
      const missing = prev.todoMissing.includes(id)
        ? prev.todoMissing.filter((x) => x !== id)
        : [...prev.todoMissing, id];
      return { ...prev, todoMissing: missing, todoDone: false };
    });
  }

  function explorePart(id) {
    setState((prev) => ({
      ...prev,
      selectedPart: id,
      explored: prev.explored.includes(id)
        ? prev.explored
        : [...prev.explored, id],
    }));
  }

  function openExample(id) {
    setState((prev) => ({
      ...prev,
      exampleOpen: prev.exampleOpen === id ? null : id,
      examplesSeen: prev.examplesSeen.includes(id)
        ? prev.examplesSeen
        : [...prev.examplesSeen, id],
    }));
  }

  const allPartsExplored = state.explored.length === lesson.parts.items.length;
  const allExamplesSeen =
    state.examplesSeen.length === lesson.examples.cards.length;

  const canContinue = {
    intro: state.assembledOnce,
    parts: allPartsExplored,
    together: state.rideDone,
    remove:
      state.sawFail && state.removed.length === 0 && state.removeRideOk,
    goal: state.goalTraced,
    morph: state.morphDone,
    flow: state.flowDone,
    todoBreak:
      state.todoSawFail && state.todoMissing.length === 0 && state.todoDone,
    connections: state.connDone,
    builder: state.built,
    goalQuiz: state.quizPassed,
    examples: allExamplesSeen,
    final: state.finalPassed,
    summary: false,
  }[stage.id];

  const continueHint = {
    intro: "Assemble the bicycle to continue.",
    parts: "Tap every part to continue.",
    together: "Watch one full ride to continue.",
    remove: lesson.remove.gateHint,
    goal: lesson.goal.gateHint,
    morph: lesson.morph.gateHint,
    flow: "Watch one full trip to continue.",
    todoBreak: lesson.todoBreak.gateHint,
    connections: lesson.connections.gateHint,
    builder: lesson.builder.gateHint,
    goalQuiz: "Answer correctly to continue - mistakes are part of learning.",
    examples: lesson.examples.gateHint,
    final: "Answer correctly to continue - mistakes are part of learning.",
  }[stage.id];

  const progressPercent =
    ((state.stageIndex + 1) / lesson.stages.length) * 100;

  // Summary finale: parts -> connections -> goal -> SYSTEM, then the
  // formal definition fades in.
  useEffect(() => {
    if (stage.id !== "summary" || state.finale >= 4) return;
    const timers = [
      window.setTimeout(() => patch({ finale: 1 }), 700),
      window.setTimeout(() => patch({ finale: 2 }), 1500),
      window.setTimeout(() => patch({ finale: 3 }), 2300),
      window.setTimeout(() => patch({ finale: 4 }), 3200),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage.id]);

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
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.intro.heading}
              </h2>
              <p className="mt-3 rounded-lg border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-sm font-medium text-sky-100">
                {lesson.intro.definition}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {lesson.intro.question}
              </p>

              <div className="mt-4">
                <BicycleSystem
                  mode="assemble"
                  copy={lesson.intro}
                  assembled={state.assembled}
                  onAssemble={(next) =>
                    patch({
                      assembled: next,
                      assembledOnce: next ? true : state.assembledOnce,
                    })
                  }
                />
              </div>

              <div aria-live="polite">
                <p
                  key={String(state.assembled)}
                  className={`sd-appear mt-3 rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                    state.assembled
                      ? "border border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-300"
                      : "border border-slate-700 bg-slate-950/60 text-slate-400"
                  }`}
                >
                  {state.assembled
                    ? lesson.intro.assembled
                    : lesson.intro.pileNote}
                </p>
              </div>
            </div>
          </div>
        )}

        {stage.id === "parts" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.parts.heading}
              </h2>
              <div className="mt-4">
                <BicycleSystem
                  mode="parts"
                  copy={lesson.parts}
                  parts={lesson.parts.items}
                  selected={state.selectedPart}
                  explored={state.explored}
                  onSelect={explorePart}
                />
              </div>
            </div>
            {!allPartsExplored ? (
              <GuideBubble>
                Each part hides what it is{" "}
                <span className="text-sky-300">for</span> - and a picture of
                it at work. Open them all!
              </GuideBubble>
            ) : (
              <GuideBubble mood="success">
                <strong className="text-white">{lesson.parts.done}</strong>{" "}
                Now watch what happens when they move together.
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "together" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.together.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.together.body}
              </p>
              <div className="mt-4">
                <BicycleSystem
                  mode="run"
                  copy={lesson.together}
                  onRunEnd={({ ok }) => {
                    if (ok) patch({ rideDone: true });
                  }}
                />
              </div>
            </div>
            <GuideBubble mood={state.rideDone ? "success" : undefined}>
              {state.rideDone ? (
                <>
                  <strong className="text-white">
                    You just watched a system work.
                  </strong>{" "}
                  Your push traveled part to part until the goal happened.
                  Next: take a piece away and watch it stop.
                </>
              ) : (
                <>
                  Follow the effort: it enters at the{" "}
                  <span className="text-sky-300">pedal</span>, gets carried by
                  the <span className="text-sky-300">chain</span>, and becomes
                  movement at the <span className="text-sky-300">wheel</span>.
                </>
              )}
            </GuideBubble>
          </div>
        )}

        {stage.id === "remove" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.remove.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.remove.body}
              </p>
              <div className="mt-4">
                <BicycleSystem
                  mode="remove"
                  copy={lesson.remove}
                  removed={state.removed}
                  onToggle={toggleRemove}
                  onRunEnd={({ ok }) =>
                    ok
                      ? patch({ removeRideOk: true })
                      : patch({ sawFail: true, removeRideOk: false })
                  }
                />
              </div>
              <div aria-live="polite">
                {state.removed.length === 0 && state.removeRideOk && (
                  <p className="sd-appear mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-center text-sm font-medium text-emerald-300">
                    ✓ {lesson.remove.restored}
                  </p>
                )}
                {state.removed.length > 0 && (
                  <p className="sd-appear mt-3 rounded-lg bg-slate-950/60 px-3 py-2 text-xs leading-relaxed text-slate-400">
                    <span className="font-semibold text-slate-300">
                      Without it:{" "}
                    </span>
                    {lesson.remove.parts.find((p) => p.id === state.removed[state.removed.length - 1])?.off}
                  </p>
                )}
              </div>
            </div>

            {!canContinue ? (
              <GuideBubble mood="hint">
                {lesson.remove.gateHint}
              </GuideBubble>
            ) : (
              <GuideBubble mood="success">
                <strong className="text-white">Systems thinking unlocked.</strong>{" "}
                Engineers learn exactly this way - fail on purpose, read the
                failure, repair it.
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "goal" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.goal.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.goal.body}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {lesson.goal.steps.map((step, index) => {
                  const active = state.goalStep >= index + 1;
                  return (
                    <div
                      key={step.id}
                      className={`rounded-xl border p-4 transition ${
                        active
                          ? "node-active border-sky-400/60 bg-sky-400/10"
                          : "border-slate-800 bg-slate-950/60"
                      }`}
                    >
                      <p className="text-sm font-semibold text-white">
                        {step.title}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                        {active ? step.body : "Press trace to answer this."}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={traceGoal}
                  disabled={state.goalTraced}
                  className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {lesson.goal.trace}
                </button>
              </div>

              <div aria-live="polite">
                {state.goalStep >= 1 && state.goalStep <= 3 && (
                  <p
                    key={state.goalStep}
                    className="sd-appear mt-4 rounded-lg border border-sky-400/30 bg-sky-400/5 px-4 py-2.5 text-sm text-sky-100"
                  >
                    {lesson.goal.steps[state.goalStep - 1].body}
                  </p>
                )}
                {state.goalStep >= 4 && (
                  <p className="sd-appear mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-300">
                    ✓ {lesson.goal.done}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {stage.id === "morph" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.morph.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.morph.body}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div
                  className={`rounded-xl border border-slate-700 bg-slate-950/70 p-4 ${
                    state.morphStarted ? "morph-out" : ""
                  }`}
                >
                  <span className="block text-4xl" aria-hidden="true">
                    🚲
                  </span>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Bicycle
                  </p>
                  <p className="text-xs text-slate-400">
                    pedals → chain → wheel
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    goal: carry you somewhere
                  </p>
                </div>

                {state.morphStarted ? (
                  lesson.morph.cards.map((card, index) => (
                    <div
                      key={card.id}
                      className={`morph-in-${["a", "b", "c"][index]} rounded-xl border border-sky-400/40 bg-sky-400/5 p-4`}
                    >
                      <span className="block text-4xl" aria-hidden="true">
                        {card.emoji}
                      </span>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {card.name}
                      </p>
                      <p className="text-xs font-medium text-sky-300">
                        {card.bike}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        {card.body}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-4 text-center">
                    <span className="block text-4xl" aria-hidden="true">
                      ❓
                    </span>
                    <p className="mt-2 text-xs text-slate-500">
                      the todo app from Lesson 1 - same shape?
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={startMorph}
                  disabled={state.morphStarted}
                  className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {lesson.morph.button}
                </button>
              </div>

              <div aria-live="polite">
                {state.morphDone && (
                  <p className="sim-pop mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-300">
                    ✓ {lesson.morph.done}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {stage.id === "flow" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.flow.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.flow.body}
              </p>
              <div className="mt-4">
                <TodoFlow
                  mode="flow"
                  copy={lesson.flow}
                  onDone={() => patch({ flowDone: true })}
                />
              </div>
            </div>
            <GuideBubble mood={state.flowDone ? "success" : undefined}>
              {state.flowDone ? (
                <>
                  <strong className="text-white">
                    Three parts, two connections, one goal.
                  </strong>{" "}
                  Now take a part away and watch exactly where it dies.
                </>
              ) : (
                <>
                  Same trip as Lesson 1 - but this time watch the{" "}
                  <span className="text-sky-300">whole</span>, not just your
                  message.
                </>
              )}
            </GuideBubble>
          </div>
        )}

        {stage.id === "todoBreak" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.todoBreak.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.todoBreak.body}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {lesson.todoBreak.parts.map((part) => {
                  const isOut = state.todoMissing.includes(part.id);
                  return (
                    <button
                      key={part.id}
                      type="button"
                      aria-pressed={!isOut}
                      onClick={() => toggleTodoPart(part.id)}
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

              <div className="mt-4">
                <TodoFlow
                  mode="break"
                  copy={lesson.todoBreak}
                  missing={state.todoMissing}
                  onFail={() => patch({ todoSawFail: true, todoDone: false })}
                  onDone={() => patch({ todoDone: true })}
                />
              </div>
            </div>

            {!canContinue ? (
              <GuideBubble mood="hint">
                {lesson.todoBreak.gateHint}
              </GuideBubble>
            ) : (
              <GuideBubble mood="success">
                <strong className="text-white">
                  Same rules as the bicycle.
                </strong>{" "}
                Missing part, cut connection, unreachable goal - software
                systems fail exactly like physical ones.
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "connections" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.connections.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.connections.body}
              </p>
              <div className="mt-4">
                <TodoFlow
                  mode="connect"
                  copy={lesson.connections}
                  links={state.links}
                  onConnect={(id) =>
                    patch({ links: { ...state.links, [id]: true } })
                  }
                  onDone={() => patch({ connDone: true })}
                />
              </div>
            </div>
            <GuideBubble mood={state.connDone ? "success" : "hint"}>
              {state.connDone ? (
                <>
                  <strong className="text-white">
                    A connection is a part of the system too.
                </strong>{" "}
                  Missing links fail just like missing parts - you cannot see
                  a wire, but you can see what stops flowing.
                </>
              ) : (
                <>
                  The parts are right there - so why does nothing happen?{" "}
                  <span className="text-sky-300">
                    Click the cut links to repair them.
                  </span>
                </>
              )}
            </GuideBubble>
          </div>
        )}

        {stage.id === "builder" && (
          <div className="sd-appear flex flex-col gap-4">
            <SystemBuilder
              build={lesson.builder}
              onSolved={() => patch({ built: true })}
            />
            {!state.built && (
              <GuideBubble>
                Tip: a system is built in a{" "}
                <span className="text-sky-300">direction</span> - input first,
                work in the middle, memory last.
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "goalQuiz" && (
          <div className="sd-appear flex flex-col gap-4">
            <QuickCheck
              quiz={lesson.goalQuiz}
              onCorrect={() => patch({ quizPassed: true })}
            />
            {state.quizPassed ? (
              <GuideBubble mood="success">
                <strong className="text-white">Nice! 🎉</strong> Parts exist
                to serve the goal - never the other way around.
              </GuideBubble>
            ) : (
              <GuideBubble mood="hint">
                {lesson.goalQuiz.tip}
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "examples" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.examples.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {lesson.examples.hint}{" "}
                <span className="text-slate-500">
                  ({state.examplesSeen.length} of{" "}
                  {lesson.examples.cards.length} explored)
                </span>
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {lesson.examples.cards.map((card) => {
                  const open = state.exampleOpen === card.id;
                  const seen = state.examplesSeen.includes(card.id);
                  return (
                    <button
                      key={card.id}
                      type="button"
                      aria-expanded={open}
                      onClick={() => openExample(card.id)}
                      className={`rounded-xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        open
                          ? "border-sky-400/60 bg-sky-400/10"
                          : "border-slate-800 bg-slate-950/60 hover:border-slate-600"
                      }`}
                    >
                      <span className="block text-2xl" aria-hidden="true">
                        {card.emoji}
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-white">
                        {card.name}
                        {seen && (
                          <span className="ml-2 text-xs text-emerald-400">
                            ✓
                          </span>
                        )}
                      </span>
                      {open && (
                        <span className="sd-appear mt-2 block space-y-1 border-t border-slate-700/70 pt-2 text-xs leading-relaxed text-slate-300">
                          <span className="block">
                            <strong className="text-sky-300">Parts: </strong>
                            {card.parts}
                          </span>
                          <span className="block">
                            <strong className="text-violet-300">
                              Connections:{" "}
                            </strong>
                            {card.connections}
                          </span>
                          <span className="block">
                            <strong className="text-emerald-300">Goal: </strong>
                            {card.goal}
                          </span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div aria-live="polite">
                {allExamplesSeen ? (
                  <div className="sim-pop mt-4 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
                    {lesson.examples.equation.map((term, index) => (
                      <span key={term} className="flex items-center gap-2">
                        {index > 0 && (
                          <span
                            className="text-sm font-bold text-slate-400"
                            aria-hidden="true"
                          >
                            +
                          </span>
                        )}
                        <span className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-white">
                          {term}
                        </span>
                      </span>
                    ))}
                    <span
                      className="text-sm font-bold text-slate-400"
                      aria-hidden="true"
                    >
                      =
                    </span>
                    <span className="rounded-lg border border-indigo-400/50 bg-indigo-500/20 px-3 py-1.5 text-xs font-bold text-indigo-200">
                      {lesson.examples.equals}
                    </span>
                  </div>
                ) : (
                  <p className="mt-4 text-xs leading-relaxed text-slate-500">
                    Open each card: find its parts, its connections, and its
                    goal.
                  </p>
                )}
                {allExamplesSeen && (
                  <p className="mt-2 text-center text-xs leading-relaxed text-slate-400">
                    {lesson.examples.done}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {stage.id === "final" && (
          <div className="sd-appear flex flex-col gap-4">
            <QuickCheck
              quiz={lesson.final}
              onCorrect={() => patch({ finalPassed: true })}
            />
            {state.finalPassed ? (
              <GuideBubble mood="success">
                <strong className="text-white">
                  You just proved the definition.
                </strong>{" "}
                Parts, connections, goal - when all three are there, you have
                a system. Ready for the finale.
              </GuideBubble>
            ) : (
              <GuideBubble mood="hint">{lesson.final.tip}</GuideBubble>
            )}
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

            {/* Finale: parts -> connections -> goal -> SYSTEM */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {lesson.summary.finaleCaption}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {lesson.summary.finale.map((item, index) =>
                  state.finale >= index + 1 ? (
                    <div
                      key={item.id}
                      className={`sim-pop flex flex-col items-center gap-1 rounded-xl border px-5 py-3 ${
                        index === 3
                          ? "border-emerald-400/60 bg-emerald-400/10"
                          : "border-slate-700 bg-slate-950/70"
                      }`}
                    >
                      <span className="text-3xl" aria-hidden="true">
                        {item.icon}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {item.label}
                      </span>
                    </div>
                  ) : (
                    <div
                      key={item.id}
                      className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-slate-800 px-5 py-3 opacity-40"
                    >
                      <span className="text-3xl" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-xs text-slate-600">…</span>
                    </div>
                  )
                )}
              </div>

              <div aria-live="polite">
                {state.finale >= 4 && (
                  <div className="sd-appear mx-auto mt-5 max-w-xl rounded-xl border border-sky-400/40 bg-sky-400/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                      {lesson.summary.definitionHeading}
                    </p>
                    <p className="mt-2 text-base font-semibold leading-relaxed text-white">
                      {lesson.summary.definition}
                    </p>
                  </div>
                )}
              </div>
            </div>

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
              {lesson.summary.callback}
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
