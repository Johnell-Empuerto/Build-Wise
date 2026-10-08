// TodoSystem - Lesson 2's software system: watch it work, then break it.
//
// You -> Frontend -> Backend -> Database, stacked with a lane between
// each part. "Add Todo" runs the packet down through all three and back
// up; the Disable toggles (only one at a time) switch a part off so the
// trip dies exactly there, with narration for every stop.
// All state is local; parents only receive onRunDone / onFail.
import { useEffect, useRef, useState } from "react";

// Respect the user's motion preferences (WCAG).
const REDUCED =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TRAVEL_MS = REDUCED ? 60 : 900; // must match .ls-pkt-down / .ls-pkt-up
const WORK_MS = REDUCED ? 60 : 700; // the backend working
const SAVE_MS = REDUCED ? 60 : 600; // the database writing it down
const PAUSE_MS = REDUCED ? 30 : 400; // breath between beats

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ACCENTS = {
  frontend: "border-cyan-400/50 bg-cyan-400/10 ring-2 ring-cyan-400/50",
  backend: "border-violet-400/50 bg-violet-400/10 ring-2 ring-violet-400/50",
  database: "border-fuchsia-400/50 bg-fuchsia-400/10 ring-2 ring-fuchsia-400/50",
};

export default function TodoSystem({ copy, onRunDone, onFail }) {
  const [disabled, setDisabled] = useState(null); // null | frontend | backend | database
  const [phase, setPhase] = useState("idle"); // idle | 0..4 | "failed"
  const [moving, setMoving] = useState(null); // { lane: 0|1|2, dir }
  const [busy, setBusy] = useState(false);
  const [failPart, setFailPart] = useState(null);
  const [saved, setSaved] = useState(false);

  const tokenRef = useRef(0);
  const phaseRef = useRef(phase);
  const busyRef = useRef(busy);
  const disabledRef = useRef(disabled);
  const onRunDoneRef = useRef(onRunDone);
  const onFailRef = useRef(onFail);

  phaseRef.current = phase;
  busyRef.current = busy;
  disabledRef.current = disabled;
  onRunDoneRef.current = onRunDone;
  onFailRef.current = onFail;

  function setPhaseBoth(value) {
    phaseRef.current = value;
    setPhase(value);
  }
  function setMovingBoth(value) {
    setMoving(value);
  }
  function setBusyBoth(value) {
    busyRef.current = value;
    setBusy(value);
  }

  function cleanIdle() {
    tokenRef.current += 1;
    setBusyBoth(false);
    setMovingBoth(null);
    setFailPart(null);
    setSaved(false);
    setPhaseBoth("idle");
  }

  // Mutually exclusive: only one part can be off at a time.
  function toggle(id) {
    if (busyRef.current) return;
    setDisabled((prev) => (prev === id ? null : id));
    cleanIdle();
  }

  function fail(part) {
    setMovingBoth(null);
    setFailPart(part);
    setPhaseBoth("failed");
    onFailRef.current?.(part);
  }

  async function advance(token) {
    const p = phaseRef.current;

    if (p === "idle") {
      if (disabledRef.current === "frontend") {
        fail("frontend");
        return;
      }
      setPhaseBoth(0);
      return;
    }

    if (p === 0) {
      setMovingBoth({ lane: 0, dir: "down" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setMovingBoth(null);
      setPhaseBoth(1);
      return;
    }

    if (p === 1) {
      setMovingBoth({ lane: 1, dir: "down" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setMovingBoth(null);
      if (disabledRef.current === "backend") {
        fail("backend");
        return;
      }
      setPhaseBoth(2);
      return;
    }

    if (p === 2) {
      await sleep(WORK_MS);
      if (tokenRef.current !== token) return;
      setMovingBoth({ lane: 2, dir: "down" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setMovingBoth(null);
      if (disabledRef.current === "database") {
        fail("database");
        return;
      }
      setSaved(true);
      await sleep(SAVE_MS);
      if (tokenRef.current !== token) return;
      setPhaseBoth(3);
      return;
    }

    if (p === 3) {
      setMovingBoth({ lane: 2, dir: "up" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setMovingBoth({ lane: 1, dir: "up" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setMovingBoth(null);
      setPhaseBoth(4);
      onRunDoneRef.current?.();
    }
  }

  async function run() {
    if (busyRef.current) return;
    if (phaseRef.current === 4 || phaseRef.current === "failed") {
      cleanIdle();
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

  useEffect(
    () => () => {
      tokenRef.current += 1;
    },
    []
  );

  const isFailed = phase === "failed";
  const atEnd = phase === 4;
  const failLanes = { frontend: 0, backend: 1, database: 2 };

  // Where the packet is right now.
  let packet = null;
  if (moving) {
    packet = {
      lane: moving.lane,
      cls: moving.dir === "down" ? "ls-pkt-down" : "ls-pkt-up",
      label: moving.dir === "down" ? copy.packetOut : copy.packetBack,
    };
  } else if (isFailed) {
    packet = {
      lane: failLanes[failPart],
      at: failPart === "frontend" ? "top" : "bottom",
      label: copy.packetOut,
    };
  } else if (phase === 0 || phase === "idle") {
    packet = { lane: 0, at: "top", label: copy.packetOut };
  } else if (phase === 1) {
    packet = { lane: 0, at: "bottom", label: copy.packetOut };
  } else if (phase === 2) {
    packet = { lane: 1, at: "bottom", label: copy.packetOut };
  } else if (phase === 3) {
    packet = { lane: 2, at: "bottom", label: saved ? copy.packetBack : copy.packetOut };
  } else if (atEnd) {
    packet = { lane: 0, at: "bottom", label: copy.packetBack };
  }

  const beat = isFailed
    ? null
    : atEnd
      ? copy.done
      : phase === "idle"
        ? copy.idle
        : copy.beats[phase];

  const chip = isFailed
    ? copy.failTitle
    : atEnd
      ? "✓ DONE"
      : busy
        ? "● WORKING"
        : "READY";

  const activeNode =
    phase === 0
      ? "user"
      : phase === 1 || atEnd
        ? "frontend"
        : phase === 2
          ? "backend"
          : phase === 3
            ? "database"
            : null;

  const toggleBtn =
    "flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="flex flex-col gap-4" role="group" aria-label="Todo system">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          data-run-todo
          onClick={run}
          disabled={busy}
          className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? copy.busy : copy.run}
        </button>
        <button
          type="button"
          onClick={cleanIdle}
          disabled={busy || (phase === "idle" && !isFailed)}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copy.reset}
        </button>
      </div>

      {/* Break controls: switch one part off */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {copy.toggles.map((option) => {
          const isOff = disabled === option.id;
          return (
            <button
              key={option.id}
              type="button"
              data-disable={option.id}
              aria-pressed={isOff}
              onClick={() => toggle(option.id)}
              disabled={busy}
              className={`${toggleBtn} ${
                isOff
                  ? "border-red-500/60 bg-red-500/10 text-red-200"
                  : "border-slate-700 bg-slate-950/60 text-slate-200 hover:border-red-400/60"
              }`}
            >
              {option.label}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isOff ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {isOff ? copy.off : copy.on}
              </span>
            </button>
          );
        })}
      </div>
      {disabled && (
        <p className="text-center text-[11px] text-slate-500">
          {copy.disabledNote}
        </p>
      )}

      {/* The stacked system: You -> Frontend -> Backend -> Database */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <div className="mx-auto flex w-full max-w-md flex-col items-stretch">
          {/* The user */}
          <Node
            id="user"
            title={`${copy.user.icon} ${copy.user.name}`}
            sub={copy.user.sub}
            tone={activeNode === "user" ? "active" : "idle"}
            accent="border-slate-600 bg-slate-950/70"
          />
          <Lane packet={packet && packet.lane === 0 ? packet : null} />
          <Node
            id="frontend"
            title={`${copy.nodes[0].emoji} ${copy.nodes[0].name}`}
            sub={copy.nodes[0].sub}
            tone={
              isFailed && failPart === "frontend"
                ? "failed"
                : disabled === "frontend"
                  ? "off"
                  : activeNode === "frontend"
                    ? "active"
                    : "idle"
            }
            accent={ACCENTS.frontend}
          >
            {isFailed && failPart === "frontend" ? (
              <FailNote text="✕ no screen to tap" />
            ) : disabled === "frontend" ? (
              <OffNote />
            ) : atEnd ? (
              <div className="sd-appear">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                  {copy.appears}
                </p>
                <p className="mt-1 rounded bg-slate-800/70 px-2 py-1 text-xs text-slate-200">
                  {copy.item}
                </p>
              </div>
            ) : (
              <p className="text-[11px] leading-snug text-slate-500">
                Waiting for your tap...
              </p>
            )}
          </Node>
          <Lane packet={packet && packet.lane === 1 ? packet : null} />
          <Node
            id="backend"
            title={`${copy.nodes[1].emoji} ${copy.nodes[1].name}`}
            sub={copy.nodes[1].sub}
            tone={
              isFailed && failPart === "backend"
                ? "failed"
                : disabled === "backend"
                  ? "off"
                  : activeNode === "backend"
                    ? "active"
                    : "idle"
            }
            accent={ACCENTS.backend}
          >
            {isFailed && failPart === "backend" ? (
              <FailNote text="✕ nobody is here" />
            ) : disabled === "backend" ? (
              <OffNote />
            ) : phase === 2 && busy ? (
              <p className="sd-appear text-[11px] font-semibold text-violet-200">
                {copy.work}
              </p>
            ) : (
              <p className="text-[11px] leading-snug text-slate-500">
                Waiting behind the screen...
              </p>
            )}
          </Node>
          <Lane packet={packet && packet.lane === 2 ? packet : null} />
          <Node
            id="database"
            title={`${copy.nodes[2].emoji} ${copy.nodes[2].name}`}
            sub={copy.nodes[2].sub}
            tone={
              isFailed && failPart === "database"
                ? "failed"
                : disabled === "database"
                  ? "off"
                  : activeNode === "database"
                    ? "active"
                    : "idle"
            }
            accent={ACCENTS.database}
          >
            {isFailed && failPart === "database" ? (
              <FailNote text="✕ nothing was written" />
            ) : disabled === "database" ? (
              <OffNote />
            ) : saved ? (
              <p className="sd-appear rounded bg-fuchsia-500/10 px-2 py-1 text-xs font-medium text-fuchsia-200">
                {copy.saved}
              </p>
            ) : (
              <p className="text-[11px] leading-snug text-slate-500">
                Empty - nothing written yet.
              </p>
            )}
          </Node>
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
              : atEnd
                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                : busy
                  ? "border-sky-400/40 bg-sky-400/10 text-sky-300"
                  : "border-slate-600 bg-slate-950 text-slate-400"
          }`}
        >
          {chip}
        </span>

        {isFailed ? (
          <div className="sd-appear mt-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3">
            <p className="text-sm font-semibold text-red-300">{copy.failLine}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-red-400">
              {copy.nodes.find((n) => n.id === failPart)?.name}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
              {copy.failTexts[failPart]}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{beat}</p>
        )}
      </div>
    </div>
  );
}

// One stacked part of the system.
function Node({ id, title, sub, tone, accent, children }) {
  return (
    <div
      data-node={id}
      className={`rounded-xl border p-4 transition ${
        tone === "failed"
          ? "sd-shake border-red-500/60 bg-red-500/10"
          : tone === "off"
            ? "border-red-500/30 bg-red-500/5 opacity-60"
            : tone === "active"
              ? `${accent} node-active`
              : "border-slate-800 bg-slate-950/60"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-white">
          {title}
        </span>
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {sub}
        </span>
      </div>
      <div className="mt-2 min-h-9">{children}</div>
    </div>
  );
}

// The lane between two parts, with the packet riding down or back up.
function Lane({ packet }) {
  return (
    <div className="relative h-14" aria-hidden="true">
      <span className="absolute left-1/2 top-1 bottom-1 w-0.5 -translate-x-1/2 rounded bg-slate-700" />
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] leading-none text-slate-600">
        ▼
      </span>
      {packet && (
        <span
          key={`${packet.lane}-${packet.cls || packet.at}`}
          className={`absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-200 via-sky-400 to-indigo-500 shadow-[0_0_10px_2px_rgba(56,189,248,0.7)] ${
            packet.cls || ""
          }`}
          style={
            packet.at === "bottom" ? { top: "calc(100% - 14px)" } : undefined
          }
        >
          <span className="sim-pkt-label rounded border border-sky-400/40 bg-slate-950/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300">
            {packet.label}
          </span>
        </span>
      )}
    </div>
  );
}

function OffNote() {
  return (
    <p className="text-center text-[11px] font-bold uppercase tracking-wider text-red-400">
      ❌ OFF
    </p>
  );
}

function FailNote({ text }) {
  return (
    <p className="rounded-lg bg-red-500/15 px-2.5 py-1.5 text-[11px] font-semibold text-red-300">
      {text}
    </p>
  );
}
