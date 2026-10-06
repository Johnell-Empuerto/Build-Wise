// Lesson 3: "Client and Server" - seven interactive stages.
// Unique interaction: "Who Speaks?" - classify six conversation lines as
// Client or Server, with per-misconception teaching on every wrong pick.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CLIENT_SERVER_LESSON as lesson } from "../data/system-design/client-server.js";
import GuideBubble from "./GuideBubble.jsx";
import QuickCheck from "./components/QuickCheck.jsx";
import OrderChallenge from "./components/OrderChallenge.jsx";
import { useSystemDesignProgress } from "./progress.jsx";

const INITIAL = {
  stageIndex: 0,
  rolesOpen: null,
  rolesExplored: [],
  placed: {},
  mistakeId: null,
  checkPassed: false,
  solved: false,
  explainText: "",
  explainResult: null, // "pass" | "revealed" | "coach" | null
};

export default function ClientServerLesson() {
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

  function pickRole(statement, role) {
    if (state.placed[statement.id]) return;
    if (role === statement.role) {
      setState((prev) => ({
        ...prev,
        placed: { ...prev.placed, [statement.id]: true },
        mistakeId: null,
      }));
    } else {
      setState((prev) => ({ ...prev, mistakeId: statement.id }));
    }
  }

  function checkExplanation() {
    const text = state.explainText.toLowerCase();
    const hit = lesson.explain.keywords.some((keyword) =>
      text.includes(keyword)
    );
    patch({ explainResult: hit ? "pass" : "coach" });
  }

  const statements = lesson.sorter.statements;
  const placedCount = statements.filter((s) => state.placed[s.id]).length;
  const sorterDone = placedCount === statements.length;
  const rolesDone =
    state.rolesExplored.length === lesson.roles.cards.length;

  const canContinue = {
    intro: true,
    roles: true,
    speak: sorterDone,
    check: state.checkPassed,
    build: state.solved,
    explain: state.explainResult !== null,
    summary: false,
  }[stage.id];

  const continueHint = {
    speak: `Place all six lines to continue (${placedCount}/${statements.length} placed).`,
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
                Client and server - the oldest pair in software.
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

        {stage.id === "roles" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.roles.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {lesson.roles.hint}{" "}
                <span className="text-slate-500">
                  ({state.rolesExplored.length} of{" "}
                  {lesson.roles.cards.length} explored)
                </span>
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {lesson.roles.cards.map((card) => {
                  const open = state.rolesOpen === card.id;
                  const explored = state.rolesExplored.includes(card.id);
                  return (
                    <button
                      key={card.id}
                      type="button"
                      aria-expanded={open}
                      onClick={() =>
                        patch({
                          rolesOpen: open ? null : card.id,
                          rolesExplored: explored
                            ? state.rolesExplored
                            : [...state.rolesExplored, card.id],
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

            {rolesDone ? (
              <GuideBubble mood="success">
                <strong className="text-white">{lesson.roles.complete}</strong>{" "}
                Next, hear them talk: you will place six lines of a real
                conversation.
              </GuideBubble>
            ) : (
              <GuideBubble>
                The last card holds{" "}
                <span className="text-sky-300">the rule</span> that keeps the
                pair working. Open all three!
              </GuideBubble>
            )}
          </div>
        )}

        {stage.id === "speak" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.sorter.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {lesson.sorter.body}{" "}
                <span className="text-slate-500">
                  ({placedCount}/{statements.length} placed)
                </span>
              </p>

              <div className="mt-4 flex flex-col gap-2">
                {statements.map((statement) => {
                  const isPlaced = Boolean(state.placed[statement.id]);
                  const isMistake = state.mistakeId === statement.id;
                  return (
                    <div
                      key={statement.id}
                      data-statement={statement.id}
                      className={`rounded-lg border px-4 py-3 ${
                        isPlaced
                          ? "border-emerald-500/40 bg-emerald-500/10"
                          : isMistake
                            ? "sd-shake border-amber-500/50 bg-amber-500/10"
                            : "border-slate-700 bg-slate-950/60"
                      }`}
                      aria-live="polite"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-200">
                          “{statement.text}”
                        </span>
                        {!isPlaced && (
                          <span className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => pickRole(statement, "client")}
                              className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                            >
                              🙋 Client
                            </button>
                            <button
                              type="button"
                              onClick={() => pickRole(statement, "server")}
                              className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-violet-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                            >
                              🍳 Server
                            </button>
                          </span>
                        )}
                        {isPlaced && (
                          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                            ✓ {statement.role}
                          </span>
                        )}
                      </div>
                      {isPlaced && (
                        <p className="mt-1.5 text-xs text-slate-400">
                          <span className="font-semibold text-emerald-300">
                            Right:{" "}
                          </span>
                          {statement.why}
                        </p>
                      )}
                      {!isPlaced && isMistake && (
                        <p className="mt-1.5 text-xs leading-relaxed text-amber-200">
                          <span className="font-semibold text-amber-300">
                            Not quite - here is why:{" "}
                          </span>
                          {statement.teach}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {sorterDone && (
                <p className="sd-appear mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-center text-sm font-medium text-emerald-300">
                  ✓ {lesson.sorter.solved}
                </p>
              )}
            </div>

            {!sorterDone && (
              <GuideBubble mood="hint">
                Listen for the difference:{" "}
                <span className="text-sky-300">wanting</span> something is the
                client; <span className="text-violet-300">delivering</span>{" "}
                something is the server.
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
                <strong className="text-white">Exactly! 🎉</strong> The server
                is an answer machine that only powers on when a question
                arrives.
              </GuideBubble>
            ) : (
              <GuideBubble mood="hint">
                Each wrong answer here exposes a different myth about who can
                start a conversation. Read them all, then try again.
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
                Tip: a conversation cannot start with an{" "}
                <span className="text-violet-300">answer</span> - someone has
                to ask first.
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
                the server waits for a request before it speaks
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
              Client asks, server answers - that heartbeat runs underneath
              everything you use.
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
