// BicycleStory - Lesson 2's scroll-led bicycle story.
//
// Parts glow one by one, the push travels between them, and a small bike
// rides the road from START to DESTINATION. The story starts itself when
// its section scrolls into view (runKey 0 -> 1); the learner can Play,
// Pause, or Replay - no step counters anywhere.
// All state is local; parents only receive onDone.
import { useEffect, useRef, useState } from "react";
import BicycleSvg from "./BicycleSvg.jsx";

// Respect the user's motion preferences (WCAG): the story collapses to a
// quick sequence instead of the slow pacing.
const REDUCED =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const FRAME_MS = REDUCED ? 60 : 1100; // one narrated frame
const TRAVEL_MS = REDUCED ? 60 : 1700; // road journey (matches .ls-travel)
const PAUSE_MS = REDUCED ? 30 : 350; // breath between frames

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function BicycleStory({ copy, runKey = 0, onDone }) {
  const [phase, setPhase] = useState("idle"); // idle | "f0".."fN" | "done"
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [traveled, setTraveled] = useState(false); // stays at DESTINATION after the ride

  const tokenRef = useRef(0);
  const phaseRef = useRef(phase);
  const busyRef = useRef(busy);
  const pausedRef = useRef(paused);
  const onDoneRef = useRef(onDone);
  const lastRunKeyRef = useRef(runKey);

  phaseRef.current = phase;
  busyRef.current = busy;
  pausedRef.current = paused;
  onDoneRef.current = onDone;

  const frames = copy.frames || [];

  function setPhaseBoth(value) {
    phaseRef.current = value;
    setPhase(value);
  }
  function setBusyBoth(value) {
    busyRef.current = value;
    setBusy(value);
  }

  function isEnd(p) {
    return p === "done";
  }

  function frameMs(frame) {
    if (frame.travel) return TRAVEL_MS;
    if (frame.done) return 0;
    return FRAME_MS;
  }

  async function advanceOnce(token) {
    const p = phaseRef.current;
    const next = p === "idle" ? 0 : Number(p.slice(1)) + 1;
    if (next >= frames.length) return;
    const frame = frames[next];
    setPhaseBoth(frame.done ? "done" : `f${next}`);
    if (frame.travel) setTraveled(true);
    if (frame.done) {
      onDoneRef.current?.();
      return;
    }
    await sleep(frameMs(frame));
  }

  // Play: run frames until the story ends, pauses, or is cancelled.
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
    setTraveled(false);
    setPhaseBoth("idle");
  }

  function restart() {
    reset();
    run();
  }

  // Scroll-led start: the parent bumps runKey from 0 to 1 when the
  // section scrolls into view.
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

  const atEnd = isEnd(phase);
  const frame =
    phase === "idle" || atEnd
      ? null
      : frames[Number(phase.slice(1))] || null;
  const doneFrame = frames.find((f) => f.done);

  const beat = atEnd
    ? doneFrame?.line
    : frame
      ? frame.line
      : copy.idle;

  let statusChip = "";
  if (paused) statusChip = "⏸ PAUSED";
  else if (phase === "idle") statusChip = "READY";
  else if (atEnd) statusChip = "DONE";

  return (
    <div
      className="flex flex-col gap-4"
      role="group"
      aria-label="Bicycle story"
    >
      {/* Controls - the story player */}
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
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          ↻ Replay
        </button>
      </div>

      {/* The stage: the bicycle + the road to the goal */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 sm:p-4">
        <BicycleSvg
          hot={frame?.hot || []}
          spinning={Boolean(frame?.spin || frame?.travel)}
          label={copy.svgLabel}
        />
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">
            🏠 START
          </span>
          <div className="relative h-8 flex-1 overflow-hidden rounded-md border border-slate-800 bg-slate-900">
            <span
              className="absolute inset-x-2 top-1/2 border-t-2 border-dashed border-slate-700"
              aria-hidden="true"
            />
            <span
              className={`absolute left-[2%] top-1/2 -translate-y-1/2 text-base ${traveled ? "ls-travel" : ""}`}
              aria-hidden="true"
            >
              🚲
            </span>
          </div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
            🏁 DESTINATION
          </span>
        </div>
      </div>

      {/* Narration (aria-live so Play/Pause users hear each frame) */}
      <div
        className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center gap-2">
          {statusChip && (
            <span
              className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                paused
                  ? "border-amber-400/40 bg-amber-500/10 text-amber-300"
                  : atEnd
                    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                    : "border-sky-400/40 bg-sky-400/10 text-sky-300"
              }`}
            >
              {statusChip}
            </span>
          )}
          <span className="text-[11px] text-slate-500">{copy.legend}</span>
        </div>
        <p className="mt-2 text-sm font-semibold text-white">{beat}</p>
        {atEnd && (
          <p className="sim-pop mt-2 text-xs font-bold text-emerald-400">
            {copy.done}
          </p>
        )}
      </div>
    </div>
  );
}
