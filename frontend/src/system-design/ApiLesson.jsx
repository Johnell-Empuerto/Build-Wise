// Lesson 5: "API" - a scroll-led lesson (EXPLAIN -> SHOW -> EXPERIENCE),
// styled like lessons 3 and 4. The learner reads the definition, taps the
// three job cards, watches a real request take the hallway (FlowDiagram
// auto-runs when its section scrolls into view), tries to sneak requests
// past the guard, builds the full round trip, and wraps up. Nothing is
// gated behind "Next" or step counters.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_LESSON as lesson } from "../data/system-design/api.js";
import GuideBubble from "./GuideBubble.jsx";
import FlowDiagram from "./components/FlowDiagram.jsx";
import QuickCheck from "./components/QuickCheck.jsx";
import OrderChallenge from "./components/OrderChallenge.jsx";
import { useSystemDesignProgress } from "./progress.jsx";

const INITIAL = {
  jobsOpen: null,
  jobsExplored: [],
  guardDone: [],
  orderSolved: false,
};

// Fires once when the element scrolls into view - used to start the trip.
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

function Section({ id, heading, children, sectionRef }) {
  return (
    <section
      id={id}
      ref={sectionRef}
      className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
    >
      <h2 className="text-lg font-semibold text-white">{heading}</h2>
      {children}
    </section>
  );
}

export default function ApiLesson() {
  const [state, setState] = useState(INITIAL);
  const { completeLesson } = useSystemDesignProgress();
  const [tripRef, tripSeen] = useSeen();

  const patch = (part) => setState((prev) => ({ ...prev, ...part }));

  function addTo(field, value) {
    setState((prev) =>
      prev[field].includes(value)
        ? prev
        : { ...prev, [field]: [...prev[field], value] }
    );
  }

  const jobsDone = state.jobsExplored.length === lesson.jobs.cards.length;
  const guardDone = state.guardDone.length === 2;

  // The lesson is complete once every interaction has been lived: all
  // three job cards, both guard requests, the built round trip.
  const allDone = jobsDone && guardDone && state.orderSolved;

  useEffect(() => {
    if (allDone) completeLesson(lesson.id);
  }, [allDone, completeLesson]);

  return (
    <div>
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

      {/* ---- Intro ------------------------------------------------------- */}
      <header className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
        <h1 className="text-xl font-bold text-white sm:text-2xl">
          {lesson.intro.heading}
        </h1>
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
      </header>

      <div className="mt-5">
        <GuideBubble>
          <strong className="text-white">
            The messenger finally gets a name.
          </strong>{" "}
          {lesson.intro.tease}
        </GuideBubble>
      </div>

      {/* ---- The three jobs ------------------------------------------------ */}
      <Section id="what-the-api-does" heading={lesson.jobs.heading}>
        <p className="mt-1 text-sm text-slate-400">
          {lesson.jobs.hint}{" "}
          <span className="text-slate-500">
            ({state.jobsExplored.length} of {lesson.jobs.cards.length} explored)
          </span>
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {lesson.jobs.cards.map((card) => {
            const open = state.jobsOpen === card.id;
            const explored = state.jobsExplored.includes(card.id);
            return (
              <button
                key={card.id}
                type="button"
                aria-expanded={open}
                onClick={() =>
                  patch({
                    jobsOpen: open ? null : card.id,
                    jobsExplored: explored
                      ? state.jobsExplored
                      : [...state.jobsExplored, card.id],
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
                        <span className="ml-2 text-xs text-emerald-400">✓</span>
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

        <div className="mt-4">
          {jobsDone ? (
            <GuideBubble mood="success">
              <strong className="text-white">{lesson.jobs.complete}</strong>{" "}
              Now watch one request live all three jobs at once.
            </GuideBubble>
          ) : (
            <GuideBubble>
              One card is{" "}
              <span className="text-sky-300">why the hallway exists</span> at
              all. Open all three!
            </GuideBubble>
          )}
        </div>
      </Section>

      {/* ---- The trip (auto-starts on scroll) ------------------------------- */}
      <Section
        id="the-api-trip"
        heading={lesson.trip.heading}
        sectionRef={tripRef}
      >
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {lesson.trip.body}
        </p>
        <div className="mt-4">
          <FlowDiagram
            hops={lesson.trip.hops}
            requestLabel={lesson.trip.requestLabel}
            responseLabel={lesson.trip.responseLabel}
            completeText={lesson.trip.completeText}
            runKey={tripSeen ? 1 : 0}
          />
        </div>
      </Section>

      {/* ---- The guard: two requests ---------------------------------------- */}
      <Section id="when-the-api-says-no" heading={lesson.guard.heading}>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {lesson.guard.body}{" "}
          <span className="text-slate-500">
            ({state.guardDone.length} of 2 {lesson.guard.counterDone})
          </span>
        </p>

        <div id="guard-a" className="mt-4">
          <QuickCheck
            quiz={lesson.guard.a}
            onCorrect={() => addTo("guardDone", "a")}
          />
        </div>
        <div id="guard-b" className="mt-4">
          <QuickCheck
            quiz={lesson.guard.b}
            onCorrect={() => addTo("guardDone", "b")}
          />
        </div>

        <div className="mt-4" aria-live="polite">
          {guardDone ? (
            <GuideBubble mood="success">
              <strong className="text-white">{lesson.guard.complete}</strong>{" "}
              The door is why you never talk to the kitchen directly.
            </GuideBubble>
          ) : (
            <GuideBubble mood="hint">
              Ask of every request:{" "}
              <span className="text-sky-300">who is asking?</span> One request
              here should pass, one should not.
            </GuideBubble>
          )}
        </div>
      </Section>

      {/* ---- Follow the answer home ------------------------------------------ */}
      <Section id="follow-the-answer" heading={lesson.order.heading}>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {lesson.order.body}
        </p>
        <div className="mt-4">
          <OrderChallenge
            build={lesson.order}
            onSolved={() => patch({ orderSolved: true })}
          />
        </div>
        {!state.orderSolved && (
          <div className="mt-4">
            <GuideBubble>
              Tip: the hallway never moves first -{" "}
              <span className="text-sky-300">the screen always asks</span>, and
              the answer follows the same road home.
            </GuideBubble>
          </div>
        )}
      </Section>

      {/* ---- Final takeaway -------------------------------------------------- */}
      <Section id="the-hallway" heading={lesson.summary.heading}>
        <p className="mt-2 rounded-lg border border-sky-400/30 bg-sky-400/5 px-4 py-3 text-sm font-semibold text-sky-200">
          {lesson.summary.congrats}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {lesson.summary.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
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

        <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-sm leading-relaxed text-slate-300">
          {lesson.summary.closing}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to="/system-design/fundamentals"
            className="inline-block rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
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
      </Section>
    </div>
  );
}
