// ExchangeDiagram - Lesson 3's core client/server story animation.
//
// Two nodes (client top/left, server bottom/right) joined by one lane. A
// glowing packet - the request - travels across, the server works, and the
// response glows back. Stories can carry optional lead scenes (narration
// frames shown before the packet leaves, e.g. "You're hungry.") and play
// slowly: scroll into view, Play, Pause, or Replay. When `serverOff` is
// true the request stops mid-lane, waits, and fails with "no response",
// so the lesson can break and repair it.
//
// Layout reuses the Lesson 1 sim-* CSS (row on >=768px, column below).
// All state is local; parents only receive onDone/onFail.
import { useEffect, useRef, useState } from "react";

// Respect the user's motion preferences (WCAG): everything collapses to a
// quick transition instead of the slow story pacing.
const REDUCED =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SCENE_MS = REDUCED ? 60 : 1800; // lead scene (narration frame)
const TRAVEL_MS = REDUCED ? 60 : 1200; // must match the .cs-story CSS timing
const PAUSE_MS = REDUCED ? 30 : 700; // breath between beats
const WORK_MS = REDUCED ? 60 : 1100; // server working
const RECEIVE_MS = REDUCED ? 60 : 600; // request landing
const WAIT_MS = REDUCED ? 300 : 1400; // offline waiting before failure

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CLIENT_ACCENT = "border-sky-400/50 bg-sky-400/10 ring-2 ring-sky-400/50";
const SERVER_ACCENT =
  "border-violet-400/50 bg-violet-400/10 ring-2 ring-violet-400/50";

export default function ExchangeDiagram({
  client,
  server,
  clientLine,
  serverLine,
  serverNote,
  request,
  response,
  copy,
  controls = "player",
  serverOff = false,
  autoPlay = false,
  runKey = 0,
  onDone,
  onFail,
}) {
  const [phase, setPhase] = useState("idle"); // idle | L0..Ln | 1..5 | waiting | failed
  const [moving, setMoving] = useState(null); // { dir: "fwd" | "back", half }
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);

  const tokenRef = useRef(0);
  const phaseRef = useRef(phase);
  const busyRef = useRef(busy);
  const pausedRef = useRef(paused);
  const serverOffRef = useRef(serverOff);
  const copyRef = useRef(copy);
  const onDoneRef = useRef(onDone);
  const onFailRef = useRef(onFail);
  const lastRunKeyRef = useRef(runKey);
  const autoRunRef = useRef(false);

  phaseRef.current = phase;
  busyRef.current = busy;
  pausedRef.current = paused;
  serverOffRef.current = serverOff;
  copyRef.current = copy;
  onDoneRef.current = onDone;
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

  // Travel from the client toward the server (the last lead scene hands
  // control here, just like the idle phase does when there is no lead).
  async function startTravel(token) {
    setPhaseBoth(1);
    setMovingBoth({
      dir: "fwd",
      half: Boolean(serverOffRef.current),
    });
    await sleep(TRAVEL_MS);
    if (tokenRef.current !== token) return;
    setMovingBoth(null);
    if (serverOffRef.current) {
      setPhaseBoth("waiting");
      await sleep(WAIT_MS);
      if (tokenRef.current !== token) return;
      setPhaseBoth("failed");
      onFailRef.current?.();
    }
  }

  function isLead(p) {
    return typeof p === "string" && p.startsWith("L");
  }

  // One beat forward from the current phase (lead scenes, then the five
  // narrated steps).
  async function advanceOnce(token) {
    const p = phaseRef.current;
    const lead = copyRef.current.lead || [];

    if (p === "idle" || isLead(p)) {
      const idx = p === "idle" ? -1 : Number(p.slice(1));
      if (idx + 1 < lead.length) {
        setPhaseBoth(`L${idx + 1}`);
        await sleep(SCENE_MS);
        if (tokenRef.current !== token) return;
        return;
      }
      await startTravel(token);
      return;
    }

    if (p === 1) {
      setPhaseBoth(2);
      await sleep(RECEIVE_MS);
      return;
    }

    if (p === 2) {
      setPhaseBoth(3);
      await sleep(WORK_MS);
      return;
    }

    if (p === 3) {
      setPhaseBoth(4);
      setMovingBoth({ dir: "back" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setMovingBoth(null);
      return;
    }

    if (p === 4) {
      setPhaseBoth(5);
      onDoneRef.current?.();
    }
  }

  function isEnd(p) {
    return p === 5 || p === "failed";
  }

  // Play: run beats until the trip succeeds, fails, pauses, or is cancelled.
  async function run() {
    if (busyRef.current) {
      // A run is already in flight - treat this as Resume.
      pausedRef.current = false;
      setPaused(false);
      return;
    }
    if (isEnd(phaseRef.current)) reset();
    pausedRef.current = false;
    setPaused(false);
    const token = ++tokenRef.current;
    setBusyBoth(true);
    try {
      while (true) {
        if (tokenRef.current !== token) return;
        if (pausedRef.current) break;
        if (isEnd(phaseRef.current)) break;
        await advanceOnce(token);
        if (tokenRef.current !== token) return;
        if (isEnd(phaseRef.current)) break;
        await sleep(PAUSE_MS);
      }
    } finally {
      if (tokenRef.current === token) setBusyBoth(false);
    }
  }

  // Pause: stop after the current beat hands control back.
  function pause() {
    if (!busyRef.current) return;
    pausedRef.current = true;
    setPaused(true);
  }

  function reset() {
    tokenRef.current += 1;
    setBusyBoth(false);
    pausedRef.current = false;
    setPaused(false);
    setMovingBoth(null);
    setPhaseBoth("idle");
  }

  function restart() {
    reset();
    run();
  }

  // Parent-triggered runs ("Try Again", etc). Scroll-led stories bump this
  // from 0 to 1 when their section scrolls into view.
  useEffect(() => {
    if (runKey !== lastRunKeyRef.current) {
      lastRunKeyRef.current = runKey;
      if (runKey > 0) run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runKey]);

  // autoPlay: start once on mount (fresh diagram = fresh trip).
  useEffect(() => {
    if (autoPlay && !autoRunRef.current) {
      autoRunRef.current = true;
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      tokenRef.current += 1;
    },
    []
  );

  const isFailed = phase === "failed";
  const isWaiting = phase === "waiting";
  const inLead = isLead(phase);
  const atEnd = isEnd(phase);
  const lead = copy.lead || [];

  // The packet: travelling, parked at the server, parked mid-lane, or back
  // at the client.
  let packet;
  if (moving) {
    if (moving.dir === "fwd") {
      packet = {
        cls: moving.half ? "sim-pkt-half" : "sim-pkt-fwd",
        label: request,
      };
    } else {
      packet = { cls: "sim-pkt-back", label: response };
    }
  } else if (isWaiting || isFailed) {
    packet = { cls: "sim-pkt-half", label: request };
  } else if (phase === 2 || phase === 3) {
    packet = { cls: "sim-pkt-end", label: request };
  } else if (phase === 4 || phase === 5) {
    packet = { cls: "", label: response };
  } else {
    packet = { cls: "", label: request }; // idle/lead: waiting at the client
  }

  const beat = inLead
    ? lead[Number(phase.slice(1))]
    : phase === "idle"
      ? { title: copy.idle, body: "" }
      : isWaiting
        ? copy.waiting
        : isFailed
          ? copy.fail
          : copy.steps[phase - 1];

  // Status chip: only real states, no numbered steps.
  let statusChip = "";
  if (isFailed) statusChip = "NO RESPONSE";
  else if (isWaiting) statusChip = "WAITING";
  else if (paused) statusChip = "⏸ PAUSED";
  else if (phase === "idle") statusChip = "READY";
  else if (atEnd) statusChip = "DONE";

  const clientActive = inLead || phase === 1 || phase === 4 || phase === 5;
  const serverActive = phase === 1 || phase === 2 || phase === 3;
  const working = phase === 3;

  // While the last lead scene plays, the client "speaks" its request.
  const showQuote =
    lead.length > 0 && phase === `L${lead.length - 1}`;

  const showPlayer = controls === "player";

  return (
    <div
      className="flex flex-col gap-4"
      role="group"
      aria-label="Client and server exchange"
    >
      {/* Controls - the story player */}
      {showPlayer && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={run}
            disabled={busy && !paused}
            className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {paused ? "▶ Resume" : "▶ Play"}
          </button>
          <button
            type="button"
            onClick={pause}
            disabled={!busy || paused}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ⏸ Pause
          </button>
          <button
            type="button"
            onClick={restart}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-400 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            ↻ Replay
          </button>
        </div>
      )}

      {/* The stage: Client -> lane -> Server */}
      <div className="cs-story sim-stage rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        {/* Client node */}
        <div
          className={`sim-node rounded-xl border p-4 transition ${
            clientActive ? `${CLIENT_ACCENT} node-active` : "border-slate-800 bg-slate-950/60"
          }`}
          data-node="client"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">
              {client.icon}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
              {client.name}
            </span>
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {client.sub}
            </span>
          </div>
          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900 p-3">
            <p className="text-[11px] leading-snug text-slate-400">
              {clientLine}
            </p>
            {showQuote && (
              <p className="sim-pop mt-2 rounded-lg border border-sky-400/40 bg-sky-400/10 px-2 py-1 text-xs font-semibold text-sky-200">
                “{request}”
              </p>
            )}
            {phase === 5 && (
              <p className="sim-pop mt-2 text-xs font-bold text-emerald-400">
                ✓ {response}
              </p>
            )}
            {isFailed && (
              <p className="sd-shake mt-2 text-xs font-bold text-red-400">
                😕 Nothing came back...
              </p>
            )}
          </div>
        </div>

        {/* Lane with the glowing packet */}
        <div className="sim-conn" aria-hidden="true">
          <span className="sim-line" />
          <span className="sim-arrow" />
          <span
            className={`sim-packet rounded-full bg-gradient-to-br from-sky-200 via-sky-400 to-indigo-500 shadow-[0_0_10px_2px_rgba(56,189,248,0.7)] ${packet.cls}`}
            title={packet.label}
          >
            <span className="sim-pkt-label rounded border border-sky-400/40 bg-slate-950/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300">
              {packet.label}
            </span>
          </span>
          {isWaiting && (
            <span className="cs-wait absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-lg">
              ⏳
            </span>
          )}
        </div>

        {/* Server node */}
        <div
          className={`sim-node rounded-xl border p-4 transition ${
            isFailed
              ? "sd-shake border-red-500/60 bg-red-500/10"
              : serverOff
                ? "border-red-500/40 bg-red-500/5 opacity-70"
                : serverActive
                  ? `${SERVER_ACCENT} node-active`
                  : "border-slate-800 bg-slate-950/60"
          }`}
          data-node="server"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">
              {server.icon}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
              {server.name}
            </span>
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {serverOff ? "offline" : server.sub}
            </span>
          </div>
          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900 p-3">
            <p className="text-[11px] leading-snug text-slate-400">
              {serverLine}
            </p>
            {working && (
              <p className="sd-appear mt-2 text-xs font-bold text-violet-300">
                <span className="cs-spin" aria-hidden="true">
                  ⚙️
                </span>{" "}
                Working...
              </p>
            )}
            {serverOff && (
              <p className="mt-2 text-xs font-bold text-red-400">
                🔴 OFFLINE - not answering
              </p>
            )}
          </div>
        </div>
      </div>

      {serverNote && (
        <p className="text-center text-[11px] text-slate-500">{serverNote}</p>
      )}

      {/* Narration (aria-live so Play/Pause users hear each beat) */}
      <div
        className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center gap-2">
          {statusChip && (
            <span
              className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isFailed
                  ? "border-red-400/40 bg-red-500/10 text-red-300"
                  : atEnd
                    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                    : paused
                      ? "border-amber-400/40 bg-amber-500/10 text-amber-300"
                      : "border-sky-400/40 bg-sky-400/10 text-sky-300"
              }`}
            >
              {statusChip}
            </span>
          )}
          <span className="text-[11px] text-slate-500">
            glowing dot = the message traveling
          </span>
        </div>
        <p className="mt-2 text-sm font-semibold text-white">{beat.title}</p>
        {beat.body && (
          <p className="mt-1 text-sm leading-relaxed text-slate-300">
            {beat.body}
          </p>
        )}
        {atEnd && !isFailed && (
          <p className="sim-pop mt-2 text-xs font-bold text-emerald-400">
            {copy.done}
          </p>
        )}
      </div>
    </div>
  );
}
