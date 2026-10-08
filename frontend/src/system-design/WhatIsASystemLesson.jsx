// Lesson 2: "What is a System?" - a scroll-led lesson (EXPLAIN -> SHOW ->
// EXPERIENCE -> UNDERSTAND). The definition, the simple rule, a bicycle
// story that starts itself, breaking it part by part, the same shape in
// software, building and judging systems, and a final challenge. Nothing
// is gated behind "Next" or step counters; stories start when their
// section scrolls into view. All state is local React state.
import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { WHAT_IS_A_SYSTEM_LESSON as lesson } from "../data/system-design/what-is-a-system.js";
import GuideBubble from "./GuideBubble.jsx";
import BicycleStory from "./components/BicycleStory.jsx";
import BicycleBreak from "./components/BicycleBreak.jsx";
import TodoSystem from "./components/TodoSystem.jsx";
import SystemBuilder from "./components/SystemBuilder.jsx";
import IsItASystem from "./components/IsItASystem.jsx";
import { useSystemDesignProgress } from "./progress.jsx";

const INITIAL = {
  storyDone: false,
  removedEver: [],
  todoDone: false,
  todoFailed: [],
  built: false,
  checkSolved: false,
  examplesSeen: [],
  challengeDone: false,
};

// Fires once when the element scrolls into view - used to start stories.
function useSeen() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [seen]);
  return [ref, seen];
}

function Section({ id, heading, body, children, sectionRef }) {
  return (
    <section
      id={id}
      ref={sectionRef}
      className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
    >
      <h2 className="text-lg font-semibold text-white">{heading}</h2>
      {body && (
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
      )}
      {children}
    </section>
  );
}

export default function WhatIsASystemLesson() {
  const [state, setState] = useState(INITIAL);
  const [resetKey, setResetKey] = useState(0);
  const { completeLesson } = useSystemDesignProgress();

  const [storyRef, storySeen] = useSeen();
  const [transitionRef, transitionSeen] = useSeen();

  const patch = (part) => setState((prev) => ({ ...prev, ...part }));

  function addTo(field, value) {
    setState((prev) =>
      prev[field].includes(value)
        ? prev
        : { ...prev, [field]: [...prev[field], value] }
    );
  }

  // The lesson is complete once every experience has been lived: three
  // bicycle removals, one clean todo trip, all three software failure
  // modes, the built system, the judgment check, and the final run.
  const allDone =
    state.removedEver.length >= 3 &&
    state.todoDone &&
    state.todoFailed.length === 3 &&
    state.built &&
    state.checkSolved &&
    state.challengeDone;

  useEffect(() => {
    if (allDone) completeLesson(lesson.id);
  }, [allDone, completeLesson]);

  function replay() {
    setState({ ...INITIAL });
    setResetKey((key) => key + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const allExamplesSeen =
    state.examplesSeen.length === lesson.examples.cards.length;

  return (
    <div key={resetKey}>
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

      {/* ---- Intro: the definition ------------------------------------- */}
      <header className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
        <h1 className="text-xl font-bold text-white sm:text-2xl">
          {lesson.intro.heading}
        </h1>
        <div className="mt-3 space-y-2">
          {lesson.intro.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={`text-sm leading-relaxed ${
                index === 0
                  ? "font-semibold text-slate-200"
                  : "text-slate-400"
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <p className="mt-3 rounded-lg border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-sm font-medium text-sky-100">
          {lesson.intro.definition}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {lesson.intro.cards.map((card) => (
            <div
              key={card.id}
              className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <p className="text-sm font-semibold text-white">
                <span aria-hidden="true">{card.icon}</span> {card.name}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {card.body}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-sky-300">
                {card.bike}
              </p>
              <p className="text-[11px] leading-relaxed text-violet-300">
                {card.app}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* ---- The simple rule -------------------------------------------- */}
      <Section
        id="the-simple-rule"
        heading={lesson.rule.heading}
        body={lesson.rule.body}
      >
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center">
          {lesson.rule.steps.map((step, index) => (
            <Fragment key={step.id}>
              <span className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-white">
                {step.icon} {step.label}
              </span>
              {index < lesson.rule.steps.length - 1 && (
                <span className="text-sm font-bold text-slate-500" aria-hidden="true">
                  +
                </span>
              )}
            </Fragment>
          ))}
          <span className="text-sm font-bold text-slate-500" aria-hidden="true">
            =
          </span>
          <span className="rounded-lg border border-emerald-400/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-200">
            {lesson.rule.equals}
          </span>
        </div>
        <p className="mt-3 text-center text-xs leading-relaxed text-slate-500">
          {lesson.rule.note}
        </p>
      </Section>

      {/* ---- Bicycle story (starts itself when seen) --------------------- */}
      <Section
        id="bicycle-story"
        heading={lesson.story.heading}
        body={lesson.story.body}
        sectionRef={storyRef}
      >
        <div className="mt-4">
          <BicycleStory
            copy={lesson.story}
            runKey={storySeen ? 1 : 0}
            onDone={() => patch({ storyDone: true })}
          />
        </div>
        {state.storyDone && (
          <p
            className="sd-appear mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs font-semibold leading-relaxed text-emerald-300"
            aria-live="polite"
          >
            {lesson.story.after}
          </p>
        )}
      </Section>

      {/* ---- Break the bicycle ------------------------------------------- */}
      <Section
        id="break-the-bicycle"
        heading={lesson.remove.heading}
        body={lesson.remove.body}
      >
        <div className="mt-4">
          <BicycleBreak
            copy={lesson.remove}
            onRemove={(id) => addTo("removedEver", id)}
          />
        </div>
      </Section>
      <div className="mt-5">
        <GuideBubble
          mood={state.removedEver.length >= 3 ? "success" : "hint"}
        >
          {state.removedEver.length >= 3 ? (
            <strong className="text-white">{lesson.remove.teach}</strong>
          ) : (
            lesson.remove.hint
          )}
        </GuideBubble>
      </div>

      {/* ---- Bicycle becomes software ------------------------------------- */}
      <Section
        id="from-bike-to-app"
        heading={lesson.transition.heading}
        body={lesson.transition.body}
        sectionRef={transitionRef}
      >
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div
            className={`rounded-xl border p-4 text-center ${
              transitionSeen
                ? "morph-out border-slate-800 bg-slate-950/60"
                : "border-slate-700 bg-slate-950/70"
            }`}
          >
            <span className="text-3xl" aria-hidden="true">
              {lesson.transition.from.icon}
            </span>
            <p className="mt-1 text-sm font-bold uppercase tracking-wider text-slate-300">
              {lesson.transition.from.name}
            </p>
            <p className="text-xs text-slate-500">{lesson.transition.from.sub}</p>
          </div>
          {!transitionSeen && (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-4 text-center">
              <span className="text-3xl" aria-hidden="true">
                ❓
              </span>
              <p className="mt-2 text-xs text-slate-500">
                the todo app from Lesson 1 - same shape?
              </p>
            </div>
          )}
        </div>

        {transitionSeen && (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {lesson.transition.to.map((node, index) => (
              <div
                key={node.name}
                className={`morph-in-${["a", "b", "c"][index]} rounded-xl border p-4 text-center ${
                  index === 0
                    ? "border-sky-400/50 bg-sky-400/10"
                    : index === 1
                      ? "border-violet-400/50 bg-violet-400/10"
                      : "border-fuchsia-400/50 bg-fuchsia-400/10"
                }`}
              >
                <span className="text-3xl" aria-hidden="true">
                  {node.icon}
                </span>
                <p className="mt-1 text-sm font-bold uppercase tracking-wider text-slate-100">
                  {node.name}
                </p>
                <p className="text-xs text-slate-400">{node.sub}</p>
              </div>
            ))}
          </div>
        )}

        {transitionSeen && (
          <ol className="mt-4 space-y-1.5" aria-live="polite">
            {lesson.transition.lines.map((line, index) => (
              <li
                key={line}
                className="morph-in-c rounded-lg bg-slate-950/60 px-4 py-2 text-sm text-slate-300"
                style={{ animationDelay: `${0.3 + index * 0.35}s` }}
              >
                {line}
              </li>
            ))}
          </ol>
        )}
      </Section>

      <div className="mt-5">
        <GuideBubble>
          <strong className="text-white">{lesson.bridge}</strong>
        </GuideBubble>
      </div>

      {/* ---- The todo system: run it, then break it ------------------------ */}
      <Section
        id="todo-system"
        heading={lesson.todo.heading}
        body={lesson.todo.body}
      >
        <div className="mt-4">
          <TodoSystem
            copy={lesson.todo}
            onRunDone={() => patch({ todoDone: true })}
            onFail={(part) => addTo("todoFailed", part)}
          />
        </div>
      </Section>
      <div className="mt-5">
        <GuideBubble mood={state.todoDone ? "success" : "hint"}>
          {state.todoDone ? (
            <strong className="text-white">{lesson.todo.done}</strong>
          ) : (
            lesson.todo.hint
          )}
        </GuideBubble>
      </div>

      {/* ---- Build a system ------------------------------------------------- */}
      <Section
        id="build-a-system"
        heading={lesson.build.heading}
        body={lesson.build.body}
      >
        <div className="mt-4">
          <SystemBuilder
            copy={lesson.build}
            onSolved={() => patch({ built: true })}
          />
        </div>
      </Section>
      <div className="mt-5">
        <GuideBubble mood={state.built ? "success" : "hint"}>
          {state.built ? (
            <strong className="text-white">
              {lesson.build.labels.solvedBody}
            </strong>
          ) : (
            lesson.build.labels.start
          )}
        </GuideBubble>
      </div>

      {/* ---- Is this a system? ---------------------------------------------- */}
      <Section
        id="is-this-a-system"
        heading={lesson.check.heading}
        body={lesson.check.intro}
      >
        <div className="mt-4">
          <IsItASystem
            copy={lesson.check}
            onSolved={() => patch({ checkSolved: true })}
          />
        </div>
      </Section>
      {state.checkSolved && (
        <div className="mt-5">
          <GuideBubble mood="success">{lesson.check.bubble}</GuideBubble>
        </div>
      )}

      {/* ---- Systems everywhere ------------------------------------------------ */}
      <Section
        id="systems-everywhere"
        heading={lesson.examples.heading}
        body={lesson.examples.hint}
      >
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {lesson.examples.cards.map((card) => {
            const open = state.examplesSeen.includes(card.id);
            return (
              <button
                key={card.id}
                type="button"
                data-example={card.id}
                aria-expanded={open}
                onClick={() => addTo("examplesSeen", card.id)}
                className={`rounded-xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                  open
                    ? "border-emerald-400/50 bg-emerald-500/5"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-600"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">
                    {card.emoji}
                  </span>
                  <span
                    className={`text-lg ${
                      card.anim === "spin" ? "ls-anim-spin" : "ls-anim-wait"
                    }`}
                    aria-hidden="true"
                  >
                    {card.animIcon}
                  </span>
                  {open && (
                    <span className="ml-auto text-sm font-bold text-emerald-400">
                      ✓
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm font-semibold text-white">
                  {card.name}
                </span>
                {open && (
                  <span className="sd-appear mt-2 block space-y-1 border-t border-slate-700/70 pt-2 text-xs leading-relaxed text-slate-300">
                    <span className="block">
                      <strong className="text-sky-300">Parts: </strong>
                      {card.parts}
                    </span>
                    <span className="block">
                      <strong className="text-violet-300">Connections: </strong>
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
            <>
              <div className="sim-pop mt-4 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
                {lesson.examples.equation.map((term, index) => (
                  <span key={term} className="flex items-center gap-2">
                    {index > 0 && (
                      <span className="text-sm font-bold text-slate-400" aria-hidden="true">
                        +
                      </span>
                    )}
                    <span className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-white">
                      {term}
                    </span>
                  </span>
                ))}
                <span className="text-sm font-bold text-slate-400" aria-hidden="true">
                  =
                </span>
                <span className="rounded-lg border border-indigo-400/50 bg-indigo-500/20 px-3 py-1.5 text-xs font-bold text-indigo-200">
                  {lesson.examples.equals}
                </span>
              </div>
              <p className="mt-2 text-center text-xs leading-relaxed text-slate-400">
                {lesson.examples.done}
              </p>
            </>
          ) : (
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Open each card: find its parts, its connections, and its goal.
            </p>
          )}
        </div>
      </Section>

      {/* ---- Final challenge ---------------------------------------------------- */}
      <Section
        id="final-challenge"
        heading={lesson.final.heading}
        body={lesson.final.body}
      >
        <div className="mt-4">
          <SystemBuilder
            runnable
            copy={lesson.build}
            onRun={() => patch({ challengeDone: true })}
          />
        </div>
      </Section>
      <div className="mt-5">
        <GuideBubble mood={state.challengeDone ? "success" : "hint"}>
          {state.challengeDone ? (
            <strong className="text-white">{lesson.final.done}</strong>
          ) : (
            lesson.build.labels.idleRun
          )}
        </GuideBubble>
      </div>

      {/* ---- The basic idea ------------------------------------------------------- */}
      <Section
        id="the-basic-idea"
        heading={lesson.summary.heading}
        body={lesson.summary.body}
      >
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {lesson.summary.definitionHeading}
        </p>
        <p className="mt-2 rounded-lg border border-sky-400/30 bg-sky-400/5 px-4 py-3 text-sm font-semibold leading-relaxed text-sky-200">
          {lesson.summary.definition}
        </p>

        <p className="mt-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
          {lesson.summary.stackCaption}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {lesson.summary.stack.map((item, index) => (
            <Fragment key={item.id}>
              <span
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${
                  item.id === "system"
                    ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
                    : "border-slate-700 bg-slate-950/70 text-slate-300"
                }`}
              >
                {item.icon} {item.label}
              </span>
              {index < lesson.summary.stack.length - 1 && (
                <span className="text-slate-500" aria-hidden="true">
                  →
                </span>
              )}
            </Fragment>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-sm leading-relaxed text-slate-300">
          {lesson.summary.callback}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to="/system-design/fundamentals"
            className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            {lesson.summary.back}
          </Link>
          <button
            type="button"
            onClick={replay}
            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            {lesson.summary.replay}
          </button>
        </div>
      </Section>
    </div>
  );
}
