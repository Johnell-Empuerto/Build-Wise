// ExchangeDiagram - Lesson 3's core client/server animation.
//
// Two nodes (client top/left, server bottom/right) joined by one lane. A
// glowing packet - the request - travels down, the server works, and the
// response glows back. Learners can Play, Pause, Step through five beats,
// or Replay. When `serverOff` is true the request stops mid-lane, waits,
// and fails with "no response", so the lesson can break and repair it.
//
// Layout reuses the Lesson 1 sim-* CSS (row on >=768px, column below).
// All state is local; parents only receive onDone/onFail.
import { useEffect, useRef, useState } from "react";

const TRAVEL_MS = 900; // must match the sim-pkt-* CSS keyframes
const PAUSE_MS = 450;
const WORK_MS = 700;
const RECEIVE_MS = 400;
const WAIT_MS = 750;

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
  playLabel,
  controls = "simple",
  serverOff = false,
  autoPlay = false,
  runKey = 0,
  onDone,
  onFail,
}) {
  const [phase, setPhase] = useState("idle"); // idle | 1..5 | waiting | failed
  const [moving, setMoving] = useState(null); // { dir: "fwd" | "back", half }
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);

  const tokenRef = useRef(0);
  const phaseRef = useRef(phase);
  const busyRef = useRef(busy);
  const pausedRef = useRef(paused);
  const serverOffRef = useRef(serverOff);
  const onDoneRef = useRef(onDone);
  const onFailRef = useRef(onFail);
  const lastRunKeyRef = useRef(runKey);
  const autoRunRef = useRef(false);

  phaseRef.current = phase;
  busyRef.current = busy;
  pausedRef.current = paused;
  serverOffRef.current = serverOff;
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

  // One beat forward from the current phase (the five narrated steps).
  async function advanceOnce(token) {
    const p = phaseRef.current;

    if (p === "idle") {
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

  // Step: exactly one beat, then hand control back.
  async function step() {
    if (busyRef.current) return;
    if (isEnd(phaseRef.current)) return;
    pausedRef.current = false;
    setPaused(false);
    const token = ++tokenRef.current;
    setBusyBoth(true);
    await advanceOnce(token);
    if (tokenRef.current === token) setBusyBoth(false);
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

  // Parent-triggered runs (job picked, "Try Again", etc).
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
  const atEnd = isEnd(phase);

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
    packet = { cls: "", label: request }; // idle: waiting at the client
  }

  const beat =
    phase === "idle"
      ? { title: copy.idle, body: "" }
      : isWaiting
        ? copy.waiting
        : isFailed
          ? copy.fail
          : copy.steps[phase - 1];

  const stepChip =
    phase === "idle"
      ? "READY"
      : isWaiting
        ? "WAITING"
        : isFailed
          ? "NO RESPONSE"
          : paused
            ? `PAUSED - step ${phase} of 5`
            : `Step ${phase} of 5`;

  const clientActive = phase === 1 || phase === 4 || phase === 5;
  const serverActive = phase === 1 || phase === 2 || phase === 3;
  const working = phase === 3;

  const primaryLabel = playLabel || copy.controls.play;
  const showFull = controls === "full";
  const showSimple = controls === "simple";
  const ctrl = {
    play: "▶ Play",
    pause: "⏸ Pause",
    replay: "↻ Replay",
    step: "⏭ Step",
    ...(copy.controls || {}),
  };

  return (
    <div
      className="flex flex-col gap-4"
      role="group"
      aria-label="Client and server exchange"
    >
      {/* Controls */}
      {showFull && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={run}
            disabled={busy && !paused}
            className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {paused ? "▶ Resume" : ctrl.play}
          </button>
          <button
            type="button"
            onClick={pause}
            disabled={!busy || paused}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {ctrl.pause}
          </button>
          <button
            type="button"
            onClick={restart}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-400 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            {ctrl.replay}
          </button>
          <button
            type="button"
            onClick={step}
            disabled={busy || atEnd}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {ctrl.step}
          </button>
        </div>
      )}

      {showSimple && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={run}
            disabled={busy}
            className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-wait disabled:opacity-60"
          >
            {busy
              ? "⏳ Working..."
              : atEnd
                ? ctrl.replay
                : primaryLabel}
          </button>
        </div>
      )}

      {/* The stage: Client -> lane -> Server */}
      <div className="sim-stage rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
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
                : atEnd
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                  : "border-sky-400/40 bg-sky-400/10 text-sky-300"
            }`}
          >
            {stepChip}
          </span>
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
