// Lesson 3: "Client and Server" - a scroll-led lesson (EXPLAIN -> SHOW ->
// EXPERIENCE). The learner reads the definitions, watches the burger story
// transform into software, sees request/response in action, then switches
// roles, answers a short check, and breaks + repairs the connection.
// Stories start themselves when their section scrolls into view; nothing
// is gated behind "Next" or step counters.
import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CLIENT_SERVER_LESSON as lesson } from "../data/system-design/client-server.js";
import GuideBubble from "./GuideBubble.jsx";
import ExchangeDiagram from "./components/ExchangeDiagram.jsx";
import RoleSwitch from "./components/RoleSwitch.jsx";
import WhoIsAsking from "./components/WhoIsAsking.jsx";
import { useSystemDesignProgress } from "./progress.jsx";

const INITIAL = {
  burgerDone: false,
  roleDirs: [],
  checkSolved: false,
  offlineFailed: false,
  serverOn: false,
  retryKey: 0,
  recovered: false,
  todoTrips: [],
  currentTripId: "none",
  currentTrip: null,
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

export default function ClientServerLesson() {
  const [state, setState] = useState(INITIAL);
  const { completeLesson } = useSystemDesignProgress();

  const [burgerRef, burgerSeen] = useSeen();
  const [transitionRef, transitionSeen] = useSeen();
  const [softwareRef, softwareSeen] = useSeen();
  const [rrRef, rrSeen] = useSeen();
  const [websiteRef, websiteSeen] = useSeen();
  const [offlineRef, offlineSeen] = useSeen();

  const patch = (part) => setState((prev) => ({ ...prev, ...part }));

  function addTo(field, value) {
    setState((prev) =>
      prev[field].includes(value)
        ? prev
        : { ...prev, [field]: [...prev[field], value] }
    );
  }

  // The lesson is complete once every interaction has been lived: both
  // role directions, the short check, the offline failure, and recovery.
  const allDone =
    state.roleDirs.length === 2 &&
    state.checkSolved &&
    state.offlineFailed &&
    state.recovered;

  useEffect(() => {
    if (allDone) completeLesson(lesson.id);
  }, [allDone, completeLesson]);

  const tripCopy = (() => {
    if (!state.currentTrip) return lesson.todo.copy;
    return {
      ...lesson.todo.copy,
      steps: [
        {
          title: state.currentTrip.step1,
          body: "The request leaves the app - watch it travel.",
        },
        lesson.todo.copy.steps[1],
        lesson.todo.copy.steps[2],
        lesson.todo.copy.steps[3],
        {
          title: state.currentTrip.step5,
          body: "The response arrived and the screen updated.",
        },
      ],
    };
  })();

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

      {/* ---- Intro ----------------------------------------------------- */}
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
      </header>

      {/* ---- What is a client? ------------------------------------------ */}
      <Section id="what-is-a-client" heading={lesson.whoClient.heading}>
        {lesson.whoClient.paragraphs.map((paragraph, index) => (
          <p
            key={paragraph}
            className={`mt-2 text-sm leading-relaxed ${
              index === 0 ? "font-semibold text-slate-200" : "text-slate-400"
            }`}
          >
            {paragraph}
          </p>
        ))}
        <div className="mt-3 flex flex-wrap gap-2">
          {lesson.whoClient.examples.map((example) => (
            <span
              key={example}
              className="rounded-lg border border-sky-400/30 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-200"
            >
              {example}
            </span>
          ))}
        </div>
        <p className="mt-3 rounded-lg bg-slate-950/60 px-4 py-3 text-xs leading-relaxed text-slate-400">
          {lesson.whoClient.exampleNote}
        </p>
        <div className="mt-3 flex items-center justify-center gap-3 text-center">
          <span className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-slate-300">
            {lesson.whoClient.visual.you}
          </span>
          <span className="text-slate-600" aria-hidden="true">
            ↓
          </span>
          <span className="rounded-lg border border-sky-400/50 bg-sky-400/10 px-3 py-2 text-xs font-bold text-sky-200">
            {lesson.whoClient.visual.client}
          </span>
          <span className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs italic text-slate-400">
            “{lesson.whoClient.visual.line}”
          </span>
        </div>
      </Section>

      {/* ---- What is a server? ------------------------------------------ */}
      <Section id="what-is-a-server" heading={lesson.whoServer.heading}>
        {lesson.whoServer.paragraphs.map((paragraph, index) => (
          <p
            key={paragraph}
            className={`mt-2 text-sm leading-relaxed ${
              index === 0 ? "font-semibold text-slate-200" : "text-slate-400"
            }`}
          >
            {paragraph}
          </p>
        ))}
        <ul className="mt-3 space-y-1">
          {lesson.whoServer.abilities.map((ability) => (
            <li key={ability} className="text-xs text-slate-400">
              {ability}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-center">
          <span className="rounded-lg border border-sky-400/50 bg-sky-400/10 px-3 py-2 text-xs font-bold text-sky-200">
            {lesson.whoServer.example.client}
          </span>
          <span className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs italic text-slate-300">
            “{lesson.whoServer.example.request}”
          </span>
          <span className="text-slate-600" aria-hidden="true">
            ▶
          </span>
          <span className="rounded-lg border border-violet-400/50 bg-violet-400/10 px-3 py-2 text-xs font-bold text-violet-200">
            {lesson.whoServer.example.server}
          </span>
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">
          {lesson.whoServer.example.line}
        </p>
      </Section>

      {/* ---- Client vs server ------------------------------------------- */}
      <Section id="client-vs-server" heading={lesson.vs.heading}>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-sky-400/50 bg-sky-400/10 p-4">
            <p className="text-lg font-bold text-sky-200">
              {lesson.vs.clientCard.icon} {lesson.vs.clientCard.name}
            </p>
            <p className="mt-1 text-xs font-extrabold uppercase tracking-widest text-sky-400">
              {lesson.vs.clientCard.tag}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              {lesson.vs.clientCard.body}
            </p>
          </div>
          <div className="rounded-xl border border-violet-400/50 bg-violet-400/10 p-4">
            <p className="text-lg font-bold text-violet-200">
              {lesson.vs.serverCard.icon} {lesson.vs.serverCard.name}
            </p>
            <p className="mt-1 text-xs font-extrabold uppercase tracking-widest text-violet-400">
              {lesson.vs.serverCard.tag}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              {lesson.vs.serverCard.body}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center">
          {lesson.vs.loop.map((step, index) => (
            <Fragment key={`${step}-${index}`}>
              <span
                className={`rounded-lg border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                  step === "CLIENT"
                    ? "border-sky-400/50 bg-sky-400/10 text-sky-300"
                    : "border-violet-400/50 bg-violet-400/10 text-violet-300"
                }`}
              >
                {step}
              </span>
              {index < lesson.vs.loop.length - 1 && (
                <span className="text-slate-500" aria-hidden="true">
                  →
                </span>
              )}
            </Fragment>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">
          {lesson.vs.loopNote}
        </p>
      </Section>

      {/* ---- Roles are roles -------------------------------------------- */}
      <Section id="client-server-roles" heading={lesson.roles.heading}>
        {lesson.roles.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-2 text-sm leading-relaxed text-slate-400">
            {paragraph}
          </p>
        ))}
        <p className="mt-3 rounded-lg bg-slate-950/60 px-4 py-3 text-xs leading-relaxed text-slate-500">
          {lesson.roles.note}
        </p>
      </Section>

      <div className="mt-5">
        <GuideBubble>
          <strong className="text-white">{lesson.bridge}</strong>
        </GuideBubble>
      </div>

      {/* ---- Story 1: the burger ---------------------------------------- */}
      <Section
        id="burger-story"
        heading={lesson.burger.heading}
        sectionRef={burgerRef}
      >
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {lesson.burger.body}
        </p>
        <div className="mt-4">
          <ExchangeDiagram
            client={lesson.burger.customer}
            server={lesson.burger.restaurant}
            clientLine={lesson.burger.customerLine}
            serverLine={lesson.burger.restaurantLine}
            request={lesson.burger.request}
            response={lesson.burger.response}
            copy={lesson.burger.copy}
            controls="player"
            runKey={burgerSeen ? 1 : 0}
            onDone={() => patch({ burgerDone: true })}
          />
        </div>
        {state.burgerDone && (
          <p
            className="sd-appear mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs font-semibold leading-relaxed text-emerald-300"
            aria-live="polite"
          >
            {lesson.burger.after}
          </p>
        )}
      </Section>

      {/* ---- Restaurant -> software morph ------------------------------- */}
      <Section
        id="story-to-software"
        heading={lesson.transition.heading}
        sectionRef={transitionRef}
      >
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {lesson.transition.body}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {lesson.transition.from.map((node) => (
            <div
              key={node.name}
              className={`rounded-xl border p-4 text-center ${
                transitionSeen
                  ? "morph-out border-slate-800 bg-slate-950/60"
                  : "border-slate-700 bg-slate-950/70"
              }`}
            >
              <span className="text-3xl" aria-hidden="true">
                {node.icon}
              </span>
              <p className="mt-1 text-sm font-bold uppercase tracking-wider text-slate-300">
                {node.name}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{node.sub}</p>
            </div>
          ))}
        </div>

        {transitionSeen && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="morph-in-a rounded-xl border border-sky-400/50 bg-sky-400/10 p-4 text-center">
              <span className="text-3xl" aria-hidden="true">
                {lesson.transition.to[0].icon}
              </span>
              <p className="mt-1 text-sm font-bold uppercase tracking-wider text-sky-200">
                {lesson.transition.to[0].name}
              </p>
              <p className="mt-0.5 text-xs text-sky-400">
                {lesson.transition.to[0].sub}
              </p>
            </div>
            <div className="morph-in-b rounded-xl border border-violet-400/50 bg-violet-400/10 p-4 text-center">
              <span className="text-3xl" aria-hidden="true">
                {lesson.transition.to[1].icon}
              </span>
              <p className="mt-1 text-sm font-bold uppercase tracking-wider text-violet-200">
                {lesson.transition.to[1].name}
              </p>
              <p className="mt-0.5 text-xs text-violet-400">
                {lesson.transition.to[1].sub}
              </p>
            </div>
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

      {/* ---- Story 2: the software loop --------------------------------- */}
      <Section
        id="software-story"
        heading={lesson.software.heading}
        sectionRef={softwareRef}
      >
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {lesson.software.body}
        </p>
        <div className="mt-4">
          <ExchangeDiagram
            client={lesson.software.client}
            server={lesson.software.server}
            clientLine={lesson.software.clientLine}
            serverLine={lesson.software.serverLine}
            request={lesson.software.request}
            response={lesson.software.response}
            copy={lesson.software.copy}
            controls="player"
            runKey={softwareSeen ? 1 : 0}
          />
        </div>
      </Section>

      {/* ---- The two words ---------------------------------------------- */}
      <Section id="request-response-terms" heading={lesson.terms.heading}>
        {lesson.terms.lines.map((line, index) => (
          <p
            key={line}
            className={`mt-2 text-sm leading-relaxed ${
              index === 0 ? "font-semibold text-sky-200" : "font-semibold text-violet-200"
            }`}
          >
            {index === 0 ? "↓ " : "↑ "}
            {line}
          </p>
        ))}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center">
          {lesson.terms.diagram.map((step, index) => (
            <Fragment key={`${step}-${index}`}>
              <span
                className={`rounded-lg border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                  step === "SERVER"
                    ? "border-violet-400/50 bg-violet-400/10 text-violet-300"
                    : step === "CLIENT"
                      ? "border-sky-400/50 bg-sky-400/10 text-sky-300"
                      : "border-slate-600 bg-slate-950/70 text-slate-300"
                }`}
              >
                {step}
              </span>
              {index < lesson.terms.diagram.length - 1 && (
                <span className="text-slate-500" aria-hidden="true">
                  ▼
                </span>
              )}
            </Fragment>
          ))}
        </div>
      </Section>

      {/* ---- Watch a request and response -------------------------------- */}
      <Section
        id="request-response-demo"
        heading={lesson.rr.heading}
        sectionRef={rrRef}
      >
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {lesson.rr.body}
        </p>
        <div className="mt-4">
          <ExchangeDiagram
            client={lesson.rr.client}
            server={lesson.rr.server}
            clientLine={lesson.rr.clientLine}
            serverLine={lesson.rr.serverLine}
            request={lesson.rr.request}
            response={lesson.rr.response}
            copy={lesson.rr.copy}
            controls="player"
            runKey={rrSeen ? 1 : 0}
          />
        </div>
      </Section>

      {/* ---- Opening a website ------------------------------------------- */}
      <Section
        id="website-example"
        heading={lesson.website.heading}
        sectionRef={websiteRef}
      >
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {lesson.website.body}
        </p>
        <div className="mt-4">
          <ExchangeDiagram
            client={lesson.website.client}
            server={lesson.website.server}
            clientLine={lesson.website.clientLine}
            serverLine={lesson.website.serverLine}
            request={lesson.website.request}
            response={lesson.website.response}
            copy={lesson.website.copy}
            controls="player"
            runKey={websiteSeen ? 1 : 0}
          />
        </div>
        <p className="mt-4 rounded-lg bg-slate-950/60 px-4 py-3 text-xs leading-relaxed text-slate-500">
          {lesson.website.note}
        </p>
      </Section>

      {/* ---- The Todo app, again ------------------------------------------ */}
      <Section id="todo-again" heading={lesson.todo.heading}>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {lesson.todo.body}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {lesson.todo.trips.map((trip) => (
            <button
              key={trip.id}
              type="button"
              onClick={() => {
                addTo("todoTrips", trip.id);
                patch({ currentTripId: trip.id, currentTrip: trip });
              }}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                state.currentTripId === trip.id
                  ? "border-sky-400/60 bg-sky-400/15 text-sky-200"
                  : "border-slate-700 bg-slate-950/60 text-slate-200 hover:border-sky-400/50"
              }`}
            >
              {trip.label}
              {state.todoTrips.includes(trip.id) && (
                <span className="ml-1.5 text-xs text-emerald-400">✓</span>
              )}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <ExchangeDiagram
            key={`trip-${state.currentTripId}`}
            client={lesson.todo.client}
            server={lesson.todo.server}
            clientLine={
              state.currentTrip
                ? `"${state.currentTrip.request}"`
                : '"Show my Todos"'
            }
            serverLine={lesson.todo.serverLine}
            request={state.currentTrip ? state.currentTrip.request : "REQUEST"}
            response={state.currentTrip ? state.currentTrip.response : "RESPONSE"}
            copy={tripCopy}
            controls="none"
            autoPlay={state.currentTripId !== "none"}
          />
        </div>
      </Section>

      {/* ---- Roles can switch --------------------------------------------- */}
      <Section id="roles-can-switch" heading={lesson.roleSwitch.heading}>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {lesson.roleSwitch.body}
        </p>
        <div className="mt-4">
          <RoleSwitch
            copy={lesson.roleSwitch}
            a={lesson.roleSwitch.a}
            b={lesson.roleSwitch.b}
            onSwitch={(direction) => addTo("roleDirs", direction)}
          />
        </div>
        {state.roleDirs.length === 2 && (
          <p
            className="sd-appear mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs font-semibold leading-relaxed text-emerald-300"
            aria-live="polite"
          >
            ✓ {lesson.roleSwitch.bothDone}
          </p>
        )}
      </Section>

      {/* ---- Short interactive check --------------------------------------- */}
      <Section id="who-is-asking" heading={lesson.check.heading}>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {lesson.check.intro}
        </p>
        <div className="mt-4">
          <WhoIsAsking
            quiz={lesson.check}
            onSolved={() => patch({ checkSolved: true })}
          />
        </div>
      </Section>

      {/* ---- Server offline ------------------------------------------------ */}
      <Section
        id="server-offline"
        heading={lesson.offline.heading}
        sectionRef={offlineRef}
      >
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {lesson.offline.body}
        </p>
        <div className="mt-4">
          <ExchangeDiagram
            client={lesson.offline.client}
            server={lesson.offline.server}
            clientLine={lesson.offline.clientLine}
            serverLine={lesson.offline.serverLine}
            request={lesson.offline.request}
            response={lesson.offline.response}
            copy={lesson.offline.copy}
            serverOff
            controls="player"
            runKey={offlineSeen ? 1 : 0}
            onFail={() => patch({ offlineFailed: true })}
          />
        </div>
        {state.offlineFailed && (
          <p
            className="sd-appear mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs leading-relaxed text-amber-100"
            aria-live="polite"
          >
            No server, no answer - the client can wait forever. Let us fix it
            in the next section.
          </p>
        )}
      </Section>

      {/* ---- Bring the server back ------------------------------------------ */}
      <Section id="server-back" heading={lesson.online.heading}>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {lesson.online.body}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => patch({ serverOn: true })}
            disabled={state.serverOn}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed ${
              state.serverOn
                ? "border border-emerald-500/50 bg-emerald-500/15 text-emerald-300 opacity-70"
                : "bg-emerald-500 text-white hover:bg-emerald-400"
            }`}
          >
            {state.serverOn ? "🟢 Server is ON" : lesson.online.turnOnLabel}
          </button>
          <button
            type="button"
            onClick={() => patch({ retryKey: state.retryKey + 1 })}
            disabled={!state.serverOn}
            className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {lesson.online.tryLabel}
          </button>
        </div>

        <div className="mt-4">
          <ExchangeDiagram
            client={lesson.online.client}
            server={lesson.online.server}
            clientLine={lesson.online.clientLine}
            serverLine={lesson.online.serverLine}
            request={lesson.online.request}
            response={lesson.online.response}
            copy={lesson.online.copy}
            serverOff={!state.serverOn}
            runKey={state.retryKey}
            controls="none"
            onDone={() => patch({ recovered: true })}
          />
        </div>

        <div aria-live="polite">
          {state.recovered ? (
            <p className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs font-semibold leading-relaxed text-emerald-300">
              {lesson.online.copy.done} {lesson.online.after}
            </p>
          ) : state.serverOn ? (
            <p className="mt-4 rounded-lg border border-sky-400/30 bg-sky-500/10 px-4 py-3 text-xs leading-relaxed text-sky-200">
              🟢 {lesson.online.turnedOn} Now press{" "}
              <span className="font-semibold">{lesson.online.tryLabel}</span>.
            </p>
          ) : (
            <p className="mt-4 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-xs leading-relaxed text-slate-400">
              The server is still offline - bring it back with{" "}
              <span className="font-semibold text-emerald-300">
                {lesson.online.turnOnLabel}
              </span>
              .
            </p>
          )}
        </div>
      </Section>

      {/* ---- Final takeaway -------------------------------------------------- */}
      <Section id="the-basic-idea" heading={lesson.final.heading}>
        <p className="mt-2 text-sm text-slate-500">{lesson.final.body}</p>
        <p className="mt-2 rounded-lg border border-sky-400/30 bg-sky-400/5 px-4 py-3 text-sm font-semibold text-sky-200">
          {lesson.final.sentence}
        </p>

        <div className="mt-4 flex flex-wrap items-stretch justify-center gap-3">
          {lesson.final.chain.map((node, index) => (
            <Fragment key={`${node.label}-${index}`}>
              <div
                className={`rounded-xl border p-4 text-center ${
                  index % 2 === 0
                    ? "border-sky-400/50 bg-sky-400/10"
                    : "border-violet-400/50 bg-violet-400/10"
                }`}
              >
                <p className="text-2xl" aria-hidden="true">
                  {node.icon}
                </p>
                <p
                  className={`mt-1 text-sm font-extrabold tracking-widest ${
                    index % 2 === 0 ? "text-sky-300" : "text-violet-300"
                  }`}
                >
                  {node.label}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {node.action}
                </p>
              </div>
              {index < lesson.final.chain.length - 1 && (
                <span className="self-center text-xl text-slate-500" aria-hidden="true">
                  →
                </span>
              )}
            </Fragment>
          ))}
        </div>

        <div className="mt-5">
          <Link
            to="/system-design/fundamentals"
            className="inline-block rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            ← Back to Fundamentals
          </Link>
        </div>
      </Section>
    </div>
  );
}
