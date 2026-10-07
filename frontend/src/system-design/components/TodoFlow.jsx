// TodoFlow - Lesson 2's software-system stage.
//
// The same Frontend -> Backend -> Database diagram as Lesson 1, but
// seen through the system lens. One component, three modes:
//   flow    - Play the full trip with narration (parts + goal)
//   break   - a part is missing; the trip dies exactly there (🔴 MISSING)
//   connect - the lanes are cut buttons; repair them and the trip runs
//
// Layout and packet motion reuse the sim-* CSS from Lesson 1. All state
// is local React state; parents only receive onDone / onFail / onConnect.
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

export default function TodoFlow({
  mode, // "flow" | "break" | "connect"
  copy,
  missing = [],
  links = { a: false, b: false },
  onConnect,
  onDone,
  onFail,
}) {
  const [phase, setPhase] = useState("idle"); // idle | 0..4 | "failed"
  const [moving, setMoving] = useState(null); // { seg: "a" | "b", dir }
  const [busy, setBusy] = useState(false);
  const [failPart, setFailPart] = useState(null);
  const [justConnected, setJustConnected] = useState(null);

  const tokenRef = useRef(0);
  const phaseRef = useRef(phase);
  const movingRef = useRef(moving);
  const busyRef = useRef(busy);
  const modeRef = useRef(mode);
  const missingRef = useRef(missing);
  const onDoneRef = useRef(onDone);
  const onFailRef = useRef(onFail);
  const lastBothRef = useRef(false);

  phaseRef.current = phase;
  movingRef.current = moving;
  busyRef.current = busy;
  modeRef.current = mode;
  missingRef.current = missing;
  onDoneRef.current = onDone;
  onFailRef.current = onFail;

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
  function failBoth(part) {
    setMovingBoth(null);
    setFailPart(part);
    setPhaseBoth("failed");
    onFailRef.current?.(part);
  }

  async function advance(token) {
    const p = phaseRef.current;

    if (p === "idle") {
      if (
        modeRef.current === "break" &&
        missingRef.current.includes("frontend")
      ) {
        failBoth("frontend");
        return;
      }
      setPhaseBoth(0);
      return;
    }

    if (p === 0) {
      setMovingBoth({ seg: "a", dir: "fwd" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setMovingBoth(null);
      if (
        modeRef.current === "break" &&
        missingRef.current.includes("backend")
      ) {
        failBoth("backend");
        return;
      }
      setPhaseBoth(1);
      return;
    }

    if (p === 1) {
      setMovingBoth({ seg: "b", dir: "fwd" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setMovingBoth(null);
      if (
        modeRef.current === "break" &&
        missingRef.current.includes("database")
      ) {
        failBoth("database");
        return;
      }
      setPhaseBoth(2);
      return;
    }

    if (p === 2) {
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
      onDoneRef.current?.();
    }
  }

  async function run() {
    if (busyRef.current) return;
    if (phaseRef.current === 4 || phaseRef.current === "failed") {
      setPhaseBoth("idle");
      setMovingBoth(null);
      setFailPart(null);
      await sleep(80);
    }
    const token = ++tokenRef.current;
    setBusyBoth(true);
    try {
      while (true) {
        if (tokenRef.current !== token) return;
        const p = phaseRef.current;
        if (p === 4 || p === "failed") break;
        await advance(token);
        if (tokenRef.current !== token) return;
        const next = phaseRef.current;
        if (next === 4 || next === "failed") break;
        await sleep(PAUSE_MS);
      }
    } finally {
      if (tokenRef.current === token) setBusyBoth(false);
    }
  }

  function reset() {
    tokenRef.current += 1;
    setBusyBoth(false);
    setMovingBoth(null);
    setFailPart(null);
    setJustConnected(null);
    setPhaseBoth("idle");
  }

  // Connect mode: repairing the second link fires the proof trip.
  const bothUp = mode === "connect" && Boolean(links.a) && Boolean(links.b);
  useEffect(() => {
    if (mode !== "connect") return;
    if (bothUp && !lastBothRef.current) {
      lastBothRef.current = true;
      run();
    }
    if (!bothUp) lastBothRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bothUp, mode]);

  useEffect(
    () => () => {
      tokenRef.current += 1;
    },
    []
  );

  function connectLink(id) {
    setJustConnected(id);
    onConnect?.(id);
  }

  const isFailed = phase === "failed";
  const atEnd = phase === 4 || isFailed;

  let packet = null;
  if (moving) {
    packet = {
      seg: moving.seg,
      cls: moving.dir === "fwd" ? "sim-pkt-fwd" : "sim-pkt-back",
      label: moving.dir === "fwd" ? "message" : "answer",
    };
  } else if (phase === 0) {
    packet = { seg: "a", cls: "", label: "your message" };
  } else if (phase === 1) {
    packet = { seg: "a", cls: "sim-pkt-end", label: "message" };
  } else if (phase === 2 || phase === 3) {
    packet = {
      seg: "b",
      cls: "sim-pkt-end",
      label: phase === 3 ? "saved" : "message",
    };
  } else if (isFailed) {
    packet =
      failPart === "backend"
        ? { seg: "a", cls: "sim-pkt-end", label: "message" }
        : failPart === "database"
          ? { seg: "b", cls: "sim-pkt-end", label: "message" }
          : null;
  } else if (phase === 4) {
    packet = { seg: "a", cls: "", label: "answer" };
  }

  const beat =
    phase === "idle"
      ? idleText()
      : isFailed
        ? null
        : phase === 4
          ? copy.done
          : copy.beats[phase];
  const stepChip = isFailed
    ? "STOPPED"
    : phase === 4
      ? "COMPLETE"
      : phase === "idle"
        ? "READY"
        : `STEP ${phase + 1} of ${copy.beats.length}`;

  function idleText() {
    if (mode === "connect" && !bothUp) {
      if (justConnected && !bothUp) return copy.linkDone?.[justConnected];
      return copy.waitText;
    }
    if (justConnected && !bothUp) return copy.linkDone?.[justConnected];
    return copy.idle;
  }

  const startLabel =
    mode === "break" ? copy.add : copy.play;

  const screenActive = phase === 0 || phase === 4;
  const workerActive = phase === 1;
  const storeActive = phase === 2 || phase === 3;
  const saved = phase === 3 || phase === 4;

  const nodeMissing = (id) => mode === "break" && missing.includes(id);

  return (
    <div
      className="flex flex-col gap-4"
      role="group"
      aria-label="Todo system simulation"
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={busy || (mode === "connect" && !bothUp)}
          className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? copy.busy : startLabel}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={busy || phase === "idle"}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copy.reset}
        </button>
      </div>

      {/* The stage: Frontend -> Backend -> Database */}
      <div className="sim-stage rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        {/* Frontend = the screen */}
        <div
          className={`sim-node rounded-xl border p-4 transition ${
            isFailed && failPart === "frontend"
              ? "sd-shake border-red-500/60 bg-red-500/10"
              : nodeMissing("frontend")
                ? "border-red-500/30 bg-red-500/5 opacity-60"
                : screenActive
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
              the screen
            </span>
          </div>
          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              My Todos
            </p>
            {phase !== "idle" && !nodeMissing("frontend") ? (
              <p className="sd-appear mt-1.5 rounded bg-slate-800/70 px-2 py-1 text-xs text-slate-300">
                ✉ "Buy milk"
              </p>
            ) : (
              <p className="mt-1.5 text-[11px] leading-snug text-slate-600">
                Waiting for your message...
              </p>
            )}
            {phase === 4 && (
              <p className="sim-pop mt-1.5 text-xs font-bold text-emerald-400">
                ✓ Todo saved!
              </p>
            )}
          </div>
          {nodeMissing("frontend") && (
            <p className="mt-2 text-center text-[11px] font-bold text-red-400">
              ❌ removed
            </p>
          )}
        </div>

        <Lane
          id="a"
          broken={mode === "connect" && !links.a}
          label={copy.connectA}
          onConnect={connectLink}
          packet={packet && packet.seg === "a" ? packet : null}
        />

        {/* Backend = the worker */}
        <div
          className={`sim-node rounded-xl border p-4 transition ${
            isFailed && failPart === "backend"
              ? "sd-shake border-red-500/60 bg-red-500/10"
              : nodeMissing("backend")
                ? "border-red-500/30 bg-red-500/5 opacity-60"
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
            {(workerActive || storeActive || phase === 4) &&
              !nodeMissing("backend") && (
                <p className="sd-appear rounded-lg bg-violet-500/10 px-2.5 py-1.5 text-[11px] text-violet-200">
                  ↩ working on it...
                </p>
              )}
            {isFailed && failPart === "backend" && (
              <p className="rounded-lg bg-red-500/15 px-2.5 py-1.5 text-[11px] font-semibold text-red-300">
                ✕ nobody is here to work
              </p>
            )}
            {isFailed && failPart === "database" && (
              <p className="rounded-lg bg-red-500/15 px-2.5 py-1.5 text-[11px] font-semibold text-red-300">
                ✕ the notebook is gone!
              </p>
            )}
            {!workerActive && !storeActive && phase !== 4 && !isFailed && (
              <p className="text-[11px] leading-snug text-slate-600">
                Waiting behind the screen for a message...
              </p>
            )}
          </div>
          {nodeMissing("backend") && (
            <p className="mt-2 text-center text-[11px] font-bold text-red-400">
              ❌ removed
            </p>
          )}
        </div>

        <Lane
          id="b"
          broken={mode === "connect" && !links.b}
          label={copy.connectB}
          onConnect={connectLink}
          packet={packet && packet.seg === "b" ? packet : null}
        />

        {/* Database = the notebook */}
        <div
          className={`sim-node rounded-xl border p-4 transition ${
            isFailed && failPart === "database"
              ? "sd-shake border-red-500/60 bg-red-500/10"
              : nodeMissing("database")
                ? "border-red-500/30 bg-red-500/5 opacity-60"
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
            {nodeMissing("database") ? (
              <p className="text-center text-[11px] font-bold text-red-400">
                ❌ removed
              </p>
            ) : saved ? (
              <p className="sd-appear rounded bg-fuchsia-500/10 px-2 py-1 text-xs font-medium text-fuchsia-200">
                📝 saved
              </p>
            ) : (
              <p className="px-1 text-[11px] leading-snug text-slate-600">
                Empty - nothing written yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Narration (aria-live so every stop is announced) */}
      <div
        className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
        aria-live="polite"
      >
        <span
          className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            isFailed
              ? "border-red-400/40 bg-red-500/10 text-red-300"
              : phase === 4
                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                : "border-sky-400/40 bg-sky-400/10 text-sky-300"
          }`}
        >
          {stepChip}
        </span>

        {isFailed ? (
          <div className="sd-appear mt-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3">
            <p className="text-sm font-semibold text-red-300">
              {copy.failTitle}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-red-400">
              {failPart === "frontend"
                ? "Frontend"
                : failPart === "backend"
                  ? "Backend"
                  : "Database"}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
              {copy.failTexts?.[failPart]}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{beat}</p>
        )}

        {phase === 4 && (
          <div className="sd-appear mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-300">
            🧩 Frontend → ⚙️ Backend → 🗄️ Database → back: one goal met.
          </div>
        )}
      </div>
    </div>
  );
}

// One lane between two nodes. In connect mode a cut lane is a button
// the learner clicks to repair it.
function Lane({ id, broken, label, onConnect, packet }) {
  if (broken) {
    return (
      <div className="sim-conn">
        <button
          type="button"
          onClick={() => onConnect?.(id)}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-red-400/60 bg-red-500/5 text-center transition hover:border-red-300 hover:bg-red-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
        >
          <span className="text-sm" aria-hidden="true">
            ✂
          </span>
          <span className="px-1 text-[10px] font-bold leading-tight text-red-300">
            {label}
          </span>
        </button>
      </div>
    );
  }
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
