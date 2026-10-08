// Lesson 3: "Client and Server" - seventeen interactive stages.
// Story first (restaurant), then software terms, then request/response
// mechanics, failure + recovery, and two games. The learner WATCHES the
// glowing packet travel: CLIENT sends REQUEST down, SERVER sends RESPONSE
// up. Unique interactions: offline/online recovery, role switching, and
// the client-or-server classification challenge.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CLIENT_SERVER_LESSON as lesson } from "../data/system-design/client-server.js";
import GuideBubble from "./GuideBubble.jsx";
import ExchangeDiagram from "./components/ExchangeDiagram.jsx";
import RoleSwitch from "./components/RoleSwitch.jsx";
import RoleGame from "./components/RoleGame.jsx";
import Classification from "./components/Classification.jsx";
import FlowChain from "./components/FlowChain.jsx";
import { useSystemDesignProgress } from "./progress.jsx";

const INITIAL = {
  stageIndex: 0,
  introAsked: false,
  kitchenDone: false,
  morphed: false,
  lookDone: false,
  clientSelected: null,
  clientExplored: [],
  jobTried: [],
  currentJobId: "none",
  currentJob: null,
  roleDirs: [],
  exchangeDone: false,
  webDone: false,
  todoTrips: [],
  currentTripId: "none",
  currentTrip: null,
  dbCards: [],
  offlineFailed: false,
  serverOn: false,
  retryKey: 0,
  onlineRecovered: false,
  gameSolved: false,
  classifySolved: false,
  flowDone: false,
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

  function addTo(field, value) {
    setState((prev) =>
      prev[field].includes(value)
        ? prev
        : { ...prev, [field]: [...prev[field], value] }
    );
  }

  // Stage gates - every animation must be seen before Continue unlocks.
  const exploredCount = state.clientExplored.length;
  const jobCount = state.jobTried.length;
  const dirCount = state.roleDirs.length;
  const tripCount = state.todoTrips.length;
  const dbCount = state.dbCards.length;

  const canContinue = {
    intro: state.introAsked,
    kitchen: state.kitchenDone,
    rolesIntro: state.morphed,
    firstLook: state.lookDone,
    whoClient: exploredCount === lesson.whoClient.examples.length,
    whoServer: jobCount === lesson.whoServer.jobs.length,
    roleSwitch: dirCount === 2,
    exchange: state.exchangeDone,
    website: state.webDone,
    todo: tripCount === lesson.todo.trips.length,
    notDb: dbCount === 2,
    offline: state.offlineFailed,
    online: state.onlineRecovered,
    roleGame: state.gameSolved,
    classify: state.classifySolved,
    finalFlow: state.flowDone,
    summary: false,
  }[stage.id];

  const continueHint = {
    intro: "Ask for the burger to continue - watch it travel.",
    kitchen: "Watch the kitchen's full trip to continue.",
    rolesIntro: "Transform the story to continue.",
    firstLook: "Watch one full request/response trip to continue.",
    whoClient: `Tap all four examples to continue (${exploredCount}/4 explored).`,
    whoServer: `Try all four jobs to continue (${jobCount}/4 tried).`,
    roleSwitch: `Try both directions to continue (${dirCount}/2 done).`,
    exchange: "Finish one full run (Play or Step through all 5) to continue.",
    website: "Visit example.com to continue.",
    todo: `Watch both conversations to continue (${tripCount}/2 watched).`,
    notDb: "Tap the Server and Database cards to continue.",
    offline: "Send the request into the offline server to continue.",
    online: "Turn the server on, then retry - get a response to continue.",
    roleGame: "Win both rounds of the role game to continue.",
    classify: "Answer all four correctly to continue.",
    finalFlow: "Play the full flow once to continue.",
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
        {/* ---- Stage 1: the burger story -------------------------------- */}
        {stage.id === "intro" && (
          <div className="sd-appear flex flex-col gap-4">
            <GuideBubble>
              <strong className="text-white">
                You are at a restaurant. 🍔
              </strong>{" "}
              {lesson.intro.body}
            </GuideBubble>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.intro.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {lesson.intro.prompt}
              </p>
              <div className="mt-4">
                <ExchangeDiagram
                  client={lesson.intro.customer}
                  server={lesson.intro.restaurant}
                  clientLine={lesson.intro.customerLine}
                  serverLine={lesson.intro.restaurantLine}
                  request={lesson.intro.request}
                  response={lesson.intro.response}
                  copy={lesson.intro.copy}
                  playLabel={lesson.intro.playLabel}
                  controls="simple"
                  onDone={() => patch({ introAsked: true })}
                />
              </div>
            </div>
            {state.introAsked && (
              <GuideBubble mood="success">{lesson.intro.after}</GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 2: the kitchen does the work ----------------------- */}
        {stage.id === "kitchen" && (
          <div className="sd-appear flex flex-col gap-4">
            <GuideBubble>
              <strong className="text-white">Behind the counter...</strong>{" "}
              {lesson.kitchen.body}
            </GuideBubble>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.kitchen.heading}
              </h2>
              <div className="mt-4">
                <ExchangeDiagram
                  client={lesson.kitchen.customer}
                  server={lesson.kitchen.restaurant}
                  clientLine={lesson.kitchen.customerLine}
                  serverLine={lesson.kitchen.restaurantLine}
                  request={lesson.kitchen.request}
                  response={lesson.kitchen.response}
                  copy={lesson.kitchen.copy}
                  playLabel={lesson.kitchen.playLabel}
                  controls="simple"
                  onDone={() => patch({ kitchenDone: true })}
                />
              </div>
            </div>
            {state.kitchenDone && (
              <GuideBubble mood="success">{lesson.kitchen.after}</GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 3: morph story -> software roles ------------------- */}
        {stage.id === "rolesIntro" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.rolesIntro.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.rolesIntro.body}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[lesson.rolesIntro.fromCustomer, lesson.rolesIntro.fromRestaurant].map(
                  (node) => (
                    <div
                      key={node.name}
                      className={`rounded-xl border p-4 text-center transition ${
                        state.morphed
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
                  )
                )}
              </div>

              {!state.morphed ? (
                <button
                  type="button"
                  onClick={() => patch({ morphed: true })}
                  className="mt-4 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                >
                  {lesson.rolesIntro.morphLabel}
                </button>
              ) : (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-sky-300">
                    {lesson.rolesIntro.bridge}
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="morph-in-a rounded-xl border border-sky-400/50 bg-sky-400/10 p-4">
                      <p className="text-lg font-bold text-sky-200">
                        {lesson.rolesIntro.toClient.icon}{" "}
                        {lesson.rolesIntro.toClient.name}
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-sky-400">
                        {lesson.rolesIntro.toClient.sub}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-300">
                        {lesson.rolesIntro.cardClient}
                      </p>
                    </div>
                    <div className="morph-in-b rounded-xl border border-violet-400/50 bg-violet-400/10 p-4">
                      <p className="text-lg font-bold text-violet-200">
                        {lesson.rolesIntro.toServer.icon}{" "}
                        {lesson.rolesIntro.toServer.name}
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-violet-400">
                        {lesson.rolesIntro.toServer.sub}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-300">
                        {lesson.rolesIntro.cardServer}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {state.morphed && (
              <GuideBubble mood="success">
                <strong className="text-white">
                  {lesson.rolesIntro.after}
                </strong>
              </GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 4: first client/server diagram --------------------- */}
        {stage.id === "firstLook" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.firstLook.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.firstLook.body}
              </p>
              <div className="mt-4">
                <ExchangeDiagram
                  client={lesson.firstLook.client}
                  server={lesson.firstLook.server}
                  clientLine={lesson.firstLook.clientLine}
                  serverLine={lesson.firstLook.serverLine}
                  request={lesson.firstLook.request}
                  response={lesson.firstLook.response}
                  copy={lesson.firstLook.copy}
                  controls="simple"
                  onDone={() => patch({ lookDone: true })}
                />
              </div>
            </div>
            {state.lookDone && (
              <GuideBubble mood="success">{lesson.firstLook.after}</GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 5: who can be a client ----------------------------- */}
        {stage.id === "whoClient" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.whoClient.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {lesson.whoClient.body}{" "}
                <span className="text-slate-500">
                  ({exploredCount}/{lesson.whoClient.examples.length} explored)
                </span>
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {lesson.whoClient.examples.map((example) => {
                  const explored = state.clientExplored.includes(example.id);
                  const selected = state.clientSelected === example.id;
                  return (
                    <button
                      key={example.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        patch({ clientSelected: example.id });
                        addTo("clientExplored", example.id);
                      }}
                      className={`rounded-xl border p-4 text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        selected
                          ? "border-sky-400/60 bg-sky-400/10 ring-2 ring-sky-400/40"
                          : "border-slate-800 bg-slate-950/60 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-3xl" aria-hidden="true">
                        {example.icon}
                      </span>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {example.name}
                        {explored && (
                          <span className="ml-1.5 text-xs text-emerald-400">
                            ✓
                          </span>
                        )}
                      </p>
                    </button>
                  );
                })}
              </div>

              {state.clientSelected && (
                <div className="sd-appear mt-4 rounded-xl border border-sky-400/30 bg-sky-400/5 p-4">
                  <p className="text-sm font-semibold text-white">
                    {
                      lesson.whoClient.examples.find(
                        (e) => e.id === state.clientSelected
                      ).icon
                    }{" "}
                    {
                      lesson.whoClient.examples.find(
                        (e) => e.id === state.clientSelected
                      ).name
                    }{" "}
                    says: “
                    {
                      lesson.whoClient.examples.find(
                        (e) => e.id === state.clientSelected
                      ).line
                    }
                    ”
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                    {
                      lesson.whoClient.examples.find(
                        (e) => e.id === state.clientSelected
                      ).why
                    }
                  </p>
                </div>
              )}

              <p className="mt-4 rounded-lg bg-slate-950/60 px-4 py-3 text-xs leading-relaxed text-slate-400">
                <span className="font-semibold text-slate-300">Remember: </span>
                {lesson.whoClient.hint}{" "}
                <span className="text-sky-300">{lesson.whoClient.roleNote}</span>
              </p>
            </div>

            {exploredCount === lesson.whoClient.examples.length ? (
              <GuideBubble mood="success">
                <strong className="text-white">
                  {lesson.whoClient.done}
                </strong>
              </GuideBubble>
            ) : (
              <GuideBubble mood="hint">
                Tap each example - watch it light up and hear why it can act
                as the client.
              </GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 6: server jobs ------------------------------------- */}
        {stage.id === "whoServer" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.whoServer.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {lesson.whoServer.body}{" "}
                <span className="text-slate-500">({jobCount}/4 tried)</span>
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {lesson.whoServer.jobs.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => {
                      addTo("jobTried", job.id);
                      patch({ currentJobId: job.id, currentJob: job });
                    }}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                      state.currentJobId === job.id
                        ? "border-violet-400/60 bg-violet-400/15 text-violet-200"
                        : "border-slate-700 bg-slate-950/60 text-slate-200 hover:border-violet-400/50"
                    }`}
                  >
                    {job.text}
                    {state.jobTried.includes(job.id) && (
                      <span className="ml-1.5 text-xs text-emerald-400">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <ExchangeDiagram
                  key={state.currentJobId}
                  client={lesson.whoServer.client}
                  server={lesson.whoServer.server}
                  clientLine={
                    state.currentJob
                      ? `"${state.currentJob.text}"`
                      : lesson.whoServer.clientLine
                  }
                  serverLine={lesson.whoServer.serverLine}
                  request={
                    state.currentJob ? state.currentJob.request : "REQUEST"
                  }
                  response={
                    state.currentJob ? state.currentJob.response : "RESPONSE"
                  }
                  copy={lesson.whoServer.copy}
                  controls="none"
                  autoPlay={state.currentJobId !== "none"}
                />
              </div>

              <p className="mt-4 rounded-lg bg-slate-950/60 px-4 py-3 text-xs leading-relaxed text-slate-400">
                <span className="font-semibold text-slate-300">Pattern: </span>
                {lesson.whoServer.hint}
              </p>
            </div>

            {jobCount === lesson.whoServer.jobs.length ? (
              <GuideBubble mood="success">
                <strong className="text-white">{lesson.whoServer.done}</strong>
              </GuideBubble>
            ) : (
              <GuideBubble mood="hint">
                Four little jobs are waiting - tap each one and watch the
                server receive it.
              </GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 7: roles can switch -------------------------------- */}
        {stage.id === "roleSwitch" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.roleSwitch.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.roleSwitch.body}
              </p>
              <div className="mt-4">
                <RoleSwitch
                  copy={lesson.roleSwitch}
                  a={lesson.roleSwitch.a}
                  b={lesson.roleSwitch.b}
                  onSwitch={(dir) => addTo("roleDirs", dir)}
                />
              </div>
            </div>

            {dirCount === 2 ? (
              <GuideBubble mood="success">
                <strong className="text-white">
                  {lesson.roleSwitch.bothDone}
                </strong>
              </GuideBubble>
            ) : (
              <GuideBubble mood="hint">
                Try both buttons - watch who becomes the CLIENT each time.
              </GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 8: request & response with full controls ------------ */}
        {stage.id === "exchange" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.exchange.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.exchange.body}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <p className="rounded-xl border border-sky-400/40 bg-sky-400/10 px-4 py-3 text-sm font-semibold text-sky-200">
                  ↓ {lesson.exchange.requestDef}
                </p>
                <p className="rounded-xl border border-violet-400/40 bg-violet-400/10 px-4 py-3 text-sm font-semibold text-violet-200">
                  ↑ {lesson.exchange.responseDef}
                </p>
              </div>

              <div className="mt-4">
                <ExchangeDiagram
                  client={lesson.exchange.client}
                  server={lesson.exchange.server}
                  clientLine={lesson.exchange.clientLine}
                  serverLine={lesson.exchange.serverLine}
                  request={lesson.exchange.request}
                  response={lesson.exchange.response}
                  copy={lesson.exchange.copy}
                  controls="full"
                  onDone={() => patch({ exchangeDone: true })}
                />
              </div>
            </div>

            {state.exchangeDone && (
              <GuideBubble mood="success">
                <strong className="text-white">
                  {lesson.exchange.after}
                </strong>
              </GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 9: real website example ----------------------------- */}
        {stage.id === "website" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.website.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
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
                  playLabel={lesson.website.playLabel}
                  controls="simple"
                  onDone={() => patch({ webDone: true })}
                />
              </div>
              <p className="mt-4 rounded-lg bg-slate-950/60 px-4 py-3 text-xs leading-relaxed text-slate-400">
                <span className="font-semibold text-slate-300">Keep it simple: </span>
                {lesson.website.note}
              </p>
            </div>

            {state.webDone ? (
              <GuideBubble mood="success">
                <strong className="text-white">{lesson.website.after}</strong>
              </GuideBubble>
            ) : (
              <GuideBubble>
                Press the button - it is exactly what happens when you type
                an address and hit Enter.
              </GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 10: the Todo app talks this way too ----------------- */}
        {stage.id === "todo" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.todo.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
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
                      : '"Give me my Todos"'
                  }
                  serverLine='"Let me get them."'
                  serverNote={lesson.todo.serverNote}
                  request={
                    state.currentTrip ? state.currentTrip.request : "REQUEST"
                  }
                  response={
                    state.currentTrip ? state.currentTrip.response : "RESPONSE"
                  }
                  copy={{
                    ...lesson.todo.copy,
                    steps: state.currentTrip
                      ? [
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
                        ]
                      : lesson.todo.copy.steps,
                  }}
                  controls="none"
                  autoPlay={state.currentTripId !== "none"}
                />
              </div>

              <p className="mt-4 rounded-lg bg-slate-950/60 px-4 py-3 text-xs leading-relaxed text-slate-400">
                <span className="font-semibold text-slate-300">Focus here: </span>
                {lesson.todo.note}
              </p>
            </div>

            {tripCount === lesson.todo.trips.length ? (
              <GuideBubble mood="success">
                <strong className="text-white">{lesson.todo.done}</strong>
              </GuideBubble>
            ) : (
              <GuideBubble mood="hint">
                Two buttons, two short trips - watch who asks each time.
              </GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 11: server is not the database ---------------------- */}
        {stage.id === "notDb" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.notDb.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.notDb.body}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {lesson.notDb.cards.map((card) => {
                  const tapped = state.dbCards.includes(card.id);
                  return (
                    <button
                      key={card.id}
                      type="button"
                      disabled={!card.tap}
                      onClick={() => addTo("dbCards", card.id)}
                      aria-expanded={tapped}
                      className={`rounded-xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        tapped
                          ? "border-sky-400/60 bg-sky-400/10"
                          : card.tap
                            ? "border-slate-700 bg-slate-950/70 hover:border-sky-400/50"
                            : "cursor-default border-slate-800 bg-slate-950/50"
                      }`}
                    >
                      <p className="text-2xl" aria-hidden="true">
                        {card.icon}
                      </p>
                      <p className="mt-1 text-sm font-bold text-white">
                        {card.name}
                        {tapped && (
                          <span className="ml-1.5 text-xs text-emerald-400">
                            ✓
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">{card.line}</p>
                      {tapped && card.why && (
                        <p className="sd-appear mt-2 border-t border-slate-700/70 pt-2 text-xs leading-relaxed text-slate-300">
                          {card.why}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {dbCount === 2 && (
                <p className="sd-appear mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs leading-relaxed text-amber-100">
                  <span className="font-semibold text-amber-300">
                    Restaurant version:{" "}
                  </span>
                  {lesson.notDb.analogy}
                </p>
              )}
            </div>

            {dbCount === 2 ? (
              <GuideBubble mood="success">
                <strong className="text-white">{lesson.notDb.done}</strong>
              </GuideBubble>
            ) : (
              <GuideBubble mood="hint">
                Tap the <span className="text-violet-300">Server</span> and{" "}
                <span className="text-fuchsia-300">Database</span> cards -
                their jobs are not the same!
              </GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 12: break the connection ---------------------------- */}
        {stage.id === "offline" && (
          <div className="sd-appear flex flex-col gap-4">
            <GuideBubble mood="hint">
              <strong className="text-white">Prediction time: </strong>
              the server is offline. What do you think happens when the
              client sends its request anyway?
            </GuideBubble>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.offline.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
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
                  playLabel={lesson.offline.playLabel}
                  serverOff
                  controls="simple"
                  onFail={() => patch({ offlineFailed: true })}
                />
              </div>
            </div>
            {state.offlineFailed && (
              <GuideBubble mood="hint">{lesson.offline.after}</GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 13: server comes back ------------------------------- */}
        {stage.id === "online" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.online.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
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
                  {state.serverOn
                    ? "🟢 Server is ON"
                    : lesson.online.turnOnLabel}
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
                  onDone={() => patch({ onlineRecovered: true })}
                />
              </div>
            </div>

            <div aria-live="polite">
              {state.onlineRecovered ? (
                <GuideBubble mood="success">
                  <strong className="text-white">
                    {lesson.online.copy.done}
                  </strong>{" "}
                  {lesson.online.after}
                </GuideBubble>
              ) : state.serverOn ? (
                <GuideBubble mood="hint">
                  🟢 {lesson.online.turnedOn} Now press{" "}
                  <span className="text-sky-300">{lesson.online.tryLabel}</span>
                  .
                </GuideBubble>
              ) : (
                <GuideBubble mood="hint">
                  The server is still offline - bring it back with{" "}
                  <span className="text-emerald-300">
                    {lesson.online.turnOnLabel}
                  </span>
                  .
                </GuideBubble>
              )}
            </div>
          </div>
        )}

        {/* ---- Stage 14: role game --------------------------------------- */}
        {stage.id === "roleGame" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.roleGame.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {lesson.roleGame.body}
              </p>
            </div>
            <RoleGame
              game={lesson.roleGame}
              onDone={() => patch({ gameSolved: true })}
            />
            {!state.gameSolved && (
              <GuideBubble mood="hint">
                Think: what would a GOOD client do? A GOOD server? Pick the
                move that <span className="text-sky-300">asks</span> or{" "}
                <span className="text-violet-300">answers</span>.
              </GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 15: client or server classification ------------------ */}
        {stage.id === "classify" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.classify.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {lesson.classify.body}
              </p>
            </div>
            <Classification
              quiz={lesson.classify}
              onSolved={() => patch({ classifySolved: true })}
            />
            {state.classifySolved ? (
              <GuideBubble mood="success">
                <strong className="text-white">{lesson.classify.done}</strong>
              </GuideBubble>
            ) : (
              <GuideBubble mood="hint">
                One at a time - ask yourself{" "}
                <span className="text-sky-300">"who is asking?"</span> and you
                will never miss.
              </GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 16: the complete flow -------------------------------- */}
        {stage.id === "finalFlow" && (
          <div className="sd-appear flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">
                {lesson.finalFlow.heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {lesson.finalFlow.body}
              </p>
              <div className="mt-4">
                <FlowChain
                  flow={lesson.finalFlow}
                  onDone={() => patch({ flowDone: true })}
                />
              </div>
            </div>
            {state.flowDone && (
              <GuideBubble mood="success">
                <strong className="text-white">{lesson.finalFlow.after}</strong>
              </GuideBubble>
            )}
          </div>
        )}

        {/* ---- Stage 17: summary + formal definition ---------------------- */}
        {stage.id === "summary" && (
          <div className="sd-appear flex flex-col gap-4">
            <GuideBubble mood="success">
              <strong className="text-white">
                {lesson.summary.congrats}
              </strong>{" "}
              You watched it happen all lesson - now it has an official name.
            </GuideBubble>

            {/* Formal definition - only shown at the end */}
            <div className="rounded-2xl border border-sky-400/30 bg-sky-400/5 p-5">
              <p className="text-sm font-bold uppercase tracking-wider text-sky-300">
                The definition
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {lesson.summary.definition}
              </p>
              <ul className="mt-2 space-y-1.5">
                {lesson.summary.definitionBody.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2 text-sm leading-relaxed text-slate-300"
                  >
                    <span className="text-sky-400" aria-hidden="true">
                      •
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {/* CLIENT = ASKS / SERVER = ANSWERS */}
            <div className="grid gap-3 sm:grid-cols-2">
              {lesson.summary.equation.map((eq, i) => (
                <div
                  key={eq.key}
                  className={`rounded-xl border p-4 text-center ${
                    i === 0
                      ? "border-sky-400/50 bg-sky-400/10"
                      : "border-violet-400/50 bg-violet-400/10"
                  }`}
                >
                  <p className="text-2xl" aria-hidden="true">
                    {eq.icon}
                  </p>
                  <p
                    className={`mt-1 text-lg font-extrabold tracking-widest ${
                      i === 0 ? "text-sky-300" : "text-violet-300"
                    }`}
                  >
                    {eq.key} = {eq.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Recall - connection to the previous lessons */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              {lesson.summary.recall.map((line, i) => (
                <p
                  key={line}
                  className={`text-sm leading-relaxed ${
                    i === lesson.summary.recall.length - 1
                      ? "mt-1 font-semibold text-sky-300"
                      : "text-slate-300"
                  }`}
                >
                  {line}
                </p>
              ))}
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
