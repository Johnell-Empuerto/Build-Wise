// SystemSimulator - Lesson 1's miniature interactive system animation.
//
// Three visible parts (Frontend screen -> Backend worker -> Database
// notebook) joined by two lanes. A glowing packet - the learner's message -
// travels forward, gets written into the notebook, then the answer travels
// back. Learners can watch the whole trip (Play), advance one beat at a
// time (Step), or start over (Reset). When `dbOff` is true the trip fails at
// the notebook instead of saving, so the lesson can break and repair it.
//
// Layout is pure CSS: a row on >=768px screens, a column below that. All
// state is local React state; parents only receive onDone/onFail/onMessage.
import { useEffect, useRef, useState } from "react";

const TRAVEL_MS = 900; // must match the sim-pkt-* CSS keyframes
const PAUSE_MS = 450;
const SAVE_MS = 650;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FRONTEND_ACCENT =
  "border-cyan-400/50 bg-cyan-400/10 ring-2 ring-cyan-400/50";
const BACKEND_ACCENT =
  "border-violet-400/50 bg-violet-400/10 ring-2 ring-violet-400/50";
const DATABASE_ACCENT =
  "border-fuchsia-400/50 bg-fuchsia-400/10 ring-2 ring-fuchsia-400/50";

export default function SystemSimulator({
  journey,
  dbOff = false,
  runKey = 0,
  onDone,
  onFail,
  onMessage,
}) {
  const [text, setText] = useState("");
  const [message, setMessage] = useState(journey.defaultTodo);
  const [todos, setTodos] = useState([]); // what the screen shows
  const [stored, setStored] = useState([]); // what the notebook holds
  const [phase, setPhase] = useState("idle"); // idle | 0..5 | "failed"
  const [moving, setMoving] = useState(null); // { seg: "a" | "b", dir }
  const [busy, setBusy] = useState(false);

  const tokenRef = useRef(0);
  const phaseRef = useRef(phase);
  const movingRef = useRef(moving);
  const busyRef = useRef(busy);
  const dbOffRef = useRef(dbOff);
  const textRef = useRef(text);
  const messageRef = useRef(message);
  const lastRunKeyRef = useRef(runKey);
  const onDoneRef = useRef(onDone);
  const onFailRef = useRef(onFail);
  const onMessageRef = useRef(onMessage);

  phaseRef.current = phase;
  movingRef.current = moving;
  busyRef.current = busy;
  dbOffRef.current = dbOff;
  textRef.current = text;
  messageRef.current = message;
  onDoneRef.current = onDone;
  onFailRef.current = onFail;
  onMessageRef.current = onMessage;

  // State setters that also update their mirror ref so async beats always
  // read fresh values without waiting for a re-render.
  function setPhaseBoth(value) {
    phaseRef.current = value;
    setPhase(value);
  }
  function setMovingBoth(value) {
    movingRef.current = value;
    setMoving(value);
  }
  function setBusyBoth(value) {
    busyRef.current = value;
    setBusy(value);
  }
  function setMessageBoth(value) {
    messageRef.current = value;
    setMessage(value);
    onMessageRef.current?.(value);
  }

  // One beat forward from the current phase. Called by both Play and Step;
  // aborts early if another control bumps the token.
  async function advanceOnce(token) {
    const p = phaseRef.current;

    if (p === "idle") {
      const label = textRef.current.trim() || messageRef.current;
      setMessageBoth(label);
      textRef.current = "";
      setText("");
      setStored([]);
      setPhaseBoth(0);
      return;
    }

    if (p === 0) {
      setMovingBoth({ seg: "a", dir: "fwd" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setMovingBoth(null);
      setPhaseBoth(1);
      return;
    }

    if (p === 1) {
      setMovingBoth({ seg: "b", dir: "fwd" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setMovingBoth(null);
      if (dbOffRef.current) {
        setPhaseBoth("failed");
        onFailRef.current?.();
        return;
      }
      setPhaseBoth(2);
      return;
    }

    if (p === 2) {
      const saved = messageRef.current;
      setStored((list) => (list.includes(saved) ? list : [...list, saved]));
      setPhaseBoth(3);
      await sleep(SAVE_MS);
      return;
    }

    if (p === 3) {
      setMovingBoth({ seg: "b", dir: "back" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setMovingBoth({ seg: "a", dir: "back" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setMovingBoth(null);
      setPhaseBoth(4);
      return;
    }

    if (p === 4) {
      const saved = messageRef.current;
      setTodos((list) => (list.includes(saved) ? list : [...list, saved]));
      setPhaseBoth(5);
      onDoneRef.current?.();
    }
  }

  // Play: run beats until the trip succeeds, fails, or is cancelled.
  async function run() {
    if (busyRef.current) return;
    if (phaseRef.current === 5 || phaseRef.current === "failed") reset();
    const token = ++tokenRef.current;
    setBusyBoth(true);
    try {
      while (true) {
        if (tokenRef.current !== token) return;
        const p = phaseRef.current;
        if (p === 5 || p === "failed") break;
        await advanceOnce(token);
        if (tokenRef.current !== token) return;
        // No trailing pause after the final beat: hand control back at once.
        const next = phaseRef.current;
        if (next === 5 || next === "failed") break;
        await sleep(PAUSE_MS);
      }
    } finally {
      if (tokenRef.current === token) setBusyBoth(false);
    }
  }

  // Step: exactly one beat, then hand control back.
  async function step() {
    if (busyRef.current) return;
    const p = phaseRef.current;
    if (p === 5 || p === "failed") return;
    const token = ++tokenRef.current;
    setBusyBoth(true);
    await advanceOnce(token);
    if (tokenRef.current === token) setBusyBoth(false);
  }

  function reset() {
    tokenRef.current += 1;
    setBusyBoth(false);
    setMovingBoth(null);
    setStored([]);
    setPhaseBoth("idle");
  }

  // ADD: the learner's click starts a fresh trip with their text.
  function add() {
    if (busyRef.current) return;
    const label = textRef.current.trim() || journey.defaultTodo;
    tokenRef.current += 1;
    setBusyBoth(false);
    setMovingBoth(null);
    setStored([]);
    setMessageBoth(label);
    textRef.current = "";
    setText("");
    setPhaseBoth(0);
  }

  // Parent-triggered run (e.g. the database toggles OFF by itself).
  useEffect(() => {
    if (runKey !== lastRunKeyRef.current) {
      lastRunKeyRef.current = runKey;
      if (runKey > 0) run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runKey]);

  useEffect(
    () => () => {
      tokenRef.current += 1;
    },
    []
  );

  const isFailed = phase === "failed";
  const atEnd = phase === 5 || isFailed;

  // Which connector (if any) shows the packet right now, and with what label.
  let packet = null;
  if (moving) {
    packet = {
      seg: moving.seg,
      cls: moving.dir === "fwd" ? "sim-pkt-fwd" : "sim-pkt-back",
      label: moving.dir === "fwd" ? "REQUEST" : "answer",
    };
  } else if (phase === 0) {
    packet = { seg: "a", cls: "", label: "Your message" };
  } else if (phase === 1) {
    packet = { seg: "a", cls: "sim-pkt-end", label: "REQUEST" };
  } else if (phase === 2 || phase === 3) {
    packet = { seg: "b", cls: "sim-pkt-end", label: phase === 3 ? "saved" : "REQUEST" };
  } else if (isFailed) {
    packet = { seg: "b", cls: "sim-pkt-end", label: "REQUEST" };
  } else if (phase === 4) {
    packet = { seg: "a", cls: "", label: "RESPONSE" };
  }

  const beat =
    phase === "idle"
      ? journey.idle
      : isFailed
        ? journey.fail
        : journey.beats[phase];
  const stepChip =
    phase === "idle"
      ? journey.ready
      : isFailed
        ? "STOPPED"
        : `${journey.stepPrefix} ${phase + 1} of ${journey.beats.length}`;

  const screenActive = phase === 0 || phase === 4 || phase === 5;
  const workerActive = phase === 1;
  const storeActive = phase === 2 || phase === 3;

  const playLabel = busy
    ? journey.controls.playing
    : phase === 5
      ? journey.controls.replay
      : isFailed
        ? journey.controls.tryAgain
        : journey.controls.play;

  return (
    <div
      className="flex flex-col gap-4"
      role="group"
      aria-label="Miniature system simulation"
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-wait disabled:opacity-60"
        >
          {playLabel}
        </button>
        <button
          type="button"
          onClick={step}
          disabled={busy || atEnd}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {journey.controls.step}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={busy || phase === "idle"}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-400 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {journey.controls.reset}
        </button>
      </div>

      {/* The stage: Frontend -> Backend -> Database */}
      <div className="sim-stage rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        {/* Frontend = the actual todo screen */}
        <div
          className={`sim-node sim-node-screen rounded-xl border p-4 transition ${
            screenActive
              ? `${FRONTEND_ACCENT} node-active`
              : "border-slate-800 bg-slate-950/60"
          }`}
          data-node="frontend"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">
              🖥️
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Frontend
            </span>
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              the screen you use
            </span>
          </div>
          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              My Todos
            </p>
            <ul className="mt-1.5 min-h-9 space-y-1" aria-label="Todo list">
              {todos.length === 0 ? (
                <li className="text-[11px] leading-snug text-slate-600">
                  {journey.idleHint}
                </li>
              ) : (
                todos.map((item) => (
                  <li
                    key={item}
                    className="sd-appear rounded bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300"
                  >
                    ✓ {item}
                  </li>
                ))
              )}
            </ul>
            <div className="mt-2 flex items-center gap-2">
              <label className="sr-only" htmlFor="sim-input">
                New todo
              </label>
              <input
                id="sim-input"
                type="text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") add();
                }}
                placeholder={journey.inputPlaceholder}
                className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={add}
                disabled={busy}
                className="shrink-0 rounded-md bg-cyan-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {journey.addLabel}
              </button>
            </div>
          </div>
          {phase === 5 && (
            <p className="sim-pop mt-2 text-center text-xs font-bold text-emerald-400">
              ✓ Todo saved!
            </p>
          )}
        </div>

        <Connector packet={packet && packet.seg === "a" ? packet : null} />

        {/* Backend = the worker */}
        <div
          className={`sim-node sim-node-worker rounded-xl border p-4 transition ${
            isFailed
              ? "border-red-500/60 bg-red-500/10"
              : workerActive
                ? `${BACKEND_ACCENT} node-active`
                : "border-slate-800 bg-slate-950/60"
          }`}
          data-node="backend"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">
              ⚙️
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
              Backend
            </span>
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              the worker
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            {(workerActive || storeActive || phase === 4 || phase === 5) && (
              <p className="sd-appear rounded-lg bg-slate-950/70 px-2.5 py-1.5 text-[11px] text-slate-300">
                📨 "Save: {message}"
              </p>
            )}
            {(workerActive || storeActive || phase === 4 || phase === 5) && (
              <p className="sd-appear rounded-lg bg-violet-500/10 px-2.5 py-1.5 text-[11px] text-violet-200">
                ↩ "Okay! I'll save it."
              </p>
            )}
            {isFailed && (
              <p className="sd-shake rounded-lg bg-red-500/15 px-2.5 py-1.5 text-[11px] font-semibold text-red-300">
                ✕ The database is unavailable!
              </p>
            )}
            {!workerActive &&
              !storeActive &&
              phase !== 4 &&
              phase !== 5 &&
              !isFailed && (
                <p className="text-[11px] leading-snug text-slate-600">
                  Waiting behind the screen for a message...
                </p>
              )}
          </div>
        </div>

        <Connector packet={packet && packet.seg === "b" ? packet : null} />

        {/* Database = the notebook */}
        <div
          className={`sim-node sim-node-store rounded-xl border p-4 transition ${
            isFailed
              ? "sd-shake border-red-500/60 bg-red-500/10"
              : dbOff
                ? "border-red-500/40 bg-red-500/5 opacity-70"
                : storeActive
                  ? `${DATABASE_ACCENT} node-active`
                  : "border-slate-800 bg-slate-950/60"
          }`}
          data-node="database"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">
              🗄️
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-300">
              Database
            </span>
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              the notebook
            </span>
          </div>
          <div className="mt-3 min-h-12 rounded-lg border border-dashed border-slate-700 bg-slate-950/70 p-2">
            {dbOff || isFailed ? (
              <p className="text-center text-[11px] font-bold text-red-400">
                🔴 OFF - unavailable
              </p>
            ) : stored.length === 0 ? (
              <p className="px-1 text-[11px] leading-snug text-slate-600">
                Empty - nothing written yet.
              </p>
            ) : (
              stored.map((item) => (
                <p
                  key={item}
                  className="sd-appear rounded bg-fuchsia-500/10 px-2 py-1 text-xs font-medium text-fuchsia-200"
                >
                  📝 {item}
                </p>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Narration (aria-live so Step/Play users hear each beat) */}
      <div
        className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              isFailed
                ? "border-red-400/40 bg-red-500/10 text-red-300"
                : phase === 5
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                  : "border-sky-400/40 bg-sky-400/10 text-sky-300"
            }`}
          >
            {stepChip}
          </span>
          <span className="text-[11px] text-slate-500">
            glowing packet = your message "{message}"
          </span>
        </div>
        <p className="mt-2 text-sm font-semibold text-white">{beat.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-300">
          {beat.body.replace("{todo}", message)}
        </p>

        {phase === 5 && (
          <div className="sd-appear mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              {journey.chainCaption}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              {journey.chain.map((link, index) => (
                <span key={link.id} className="flex items-center gap-1.5">
                  <span className="rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1 font-medium text-slate-200">
                    {link.label}
                  </span>
                  {index < journey.chain.length - 1 && (
                    <span aria-hidden="true" className="text-slate-500">
                      {index < 3 ? "↓" : "↑"}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// One lane between two nodes: line, arrowhead, and (optionally) the packet.
function Connector({ packet }) {
  return (
    <div className="sim-conn" aria-hidden="true">
      <span className="sim-line" />
      <span className="sim-arrow" />
      {packet && (
        <span
          className={`sim-packet rounded-full bg-gradient-to-br from-sky-200 via-sky-400 to-indigo-500 shadow-[0_0_10px_2px_rgba(56,189,248,0.7)] ${packet.cls}`}
          title={packet.label}
        >
          <span className="sim-pkt-label rounded border border-sky-400/40 bg-slate-950/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300">
            {packet.label}
          </span>
        </span>
      )}
    </div>
  );
}
