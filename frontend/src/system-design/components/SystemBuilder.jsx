// SystemBuilder - Lesson 2's "build it yourself" + final challenge.
//
// Three parts sit in a stage with dashed gaps between them. Click two
// parts to wire them together in the direction the work flows; a wrong
// click teaches the direction instead of just failing. With `runnable`
// (the final challenge) the solved system can RUN SYSTEM: a packet makes
// the whole trip and the goal happens.
// All state is local React state; parents only receive onSolved / onRun.
import { Fragment, useEffect, useRef, useState } from "react";

// Respect the user's motion preferences (WCAG).
const REDUCED =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TRAVEL_MS = REDUCED ? 60 : 900; // must match the .sim-pkt-* CSS
const WORK_MS = REDUCED ? 60 : 700;
const PAUSE_MS = REDUCED ? 30 : 400;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function SystemBuilder({
  copy,
  runnable = false,
  onSolved,
  onRun,
}) {
  const [selected, setSelected] = useState(null);
  const [links, setLinks] = useState([]); // "a" | "b"
  const [feedback, setFeedback] = useState(null); // {text, tone, key}
  const [solved, setSolved] = useState(false);
  const [shake, setShake] = useState({ id: null, key: 0 });
  const [justLinked, setJustLinked] = useState(null); // {lane, key}

  // Final challenge run: a packet makes the whole trip.
  const [runPhase, setRunPhase] = useState(-1); // -1 not started | 0..4
  const [running, setRunning] = useState(false);
  const [runPacket, setRunPacket] = useState(null); // { lane, cls, label }

  const tokenRef = useRef(0);
  const runningRef = useRef(running);
  const linkTimerRef = useRef(null);
  const onRunRef = useRef(onRun);
  runningRef.current = running;
  onRunRef.current = onRun;

  useEffect(
    () => () => {
      tokenRef.current += 1;
      if (linkTimerRef.current) window.clearTimeout(linkTimerRef.current);
    },
    []
  );

  const order = copy.nodes.map((node) => node.id);

  function bad(text, id) {
    setFeedback({ text, tone: "bad", key: Date.now() });
    setShake({ id, key: Date.now() });
    setSelected(null);
  }

  function clickPart(id) {
    if (solved || runningRef.current) return;

    if (!selected) {
      const expected = order[links.length];
      if (id !== expected) {
        bad(
          links.length === 0 ? copy.labels.wrongStart : copy.labels.wrongNext,
          id
        );
        return;
      }
      setSelected(id);
      setFeedback({ text: copy.labels.selected, tone: "info", key: Date.now() });
      return;
    }

    if (id === selected) {
      setSelected(null);
      setFeedback(null);
      return;
    }

    const from = order[links.length];
    const to = order[links.length + 1];
    if (selected === from && id === to) {
      const lane = links.length;
      const next = [...links, lane === 0 ? "a" : "b"];
      setLinks(next);
      setSelected(null);
      setJustLinked({ lane, key: Date.now() });
      if (linkTimerRef.current) window.clearTimeout(linkTimerRef.current);
      linkTimerRef.current = window.setTimeout(
        () => setJustLinked(null),
        REDUCED ? 120 : 1000
      );
      if (next.length === order.length - 1) {
        setSolved(true);
        setFeedback({ text: copy.labels.solved, tone: "ok", key: Date.now() });
        onSolved?.();
      } else {
        setFeedback({ text: copy.labels.linked, tone: "ok", key: Date.now() });
      }
      return;
    }

    bad(copy.labels.wrongPair, id);
  }

  function reset() {
    tokenRef.current += 1;
    runningRef.current = false;
    setRunning(false);
    setRunPhase(-1);
    setRunPacket(null);
    setSelected(null);
    setLinks([]);
    setFeedback(null);
    setSolved(false);
    setJustLinked(null);
  }

  // The final challenge: send one todo through the wired system.
  async function runSystem() {
    if (runningRef.current) return;
    const token = ++tokenRef.current;
    runningRef.current = true;
    setRunning(true);
    setRunPhase(0);
    setRunPacket({ lane: 0, cls: "", label: "your todo" });
    try {
      await sleep(PAUSE_MS);
      if (tokenRef.current !== token) return;

      setRunPacket({ lane: 0, cls: "sim-pkt-fwd", label: "your todo" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setRunPhase(1);
      setRunPacket({ lane: 0, cls: "sim-pkt-end", label: "your todo" });
      await sleep(PAUSE_MS);
      if (tokenRef.current !== token) return;

      setRunPacket({ lane: 1, cls: "sim-pkt-fwd", label: "your todo" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setRunPhase(2);
      setRunPacket({ lane: 1, cls: "sim-pkt-end", label: "your todo" });
      await sleep(WORK_MS + PAUSE_MS);
      if (tokenRef.current !== token) return;

      setRunPhase(3);
      setRunPacket({ lane: 1, cls: "sim-pkt-back", label: "result" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;
      setRunPacket({ lane: 0, cls: "sim-pkt-back", label: "result" });
      await sleep(TRAVEL_MS);
      if (tokenRef.current !== token) return;

      setRunPacket({ lane: 0, cls: "", label: "result" });
      setRunPhase(4);
      onRunRef.current?.();
    } finally {
      if (tokenRef.current === token) {
        runningRef.current = false;
        setRunning(false);
      }
    }
  }

  // Default status: always say what to do next.
  const defaultStatus =
    selected
      ? copy.labels.selected
      : links.length === 0
        ? copy.labels.start
        : copy.labels.next;

  let status = feedback || { text: defaultStatus, tone: "info", key: 0 };
  let chip = "";
  if (runnable && runPhase >= 0) {
    chip = runPhase === 4 ? "✓ DONE" : "● RUNNING";
    status =
      runPhase === 4
        ? { text: copy.runDone, tone: "win", key: 4 }
        : { text: copy.runBeats[runPhase], tone: "run", key: runPhase };
  } else if (!feedback && solved) {
    status = { text: copy.labels.solved, tone: "ok", key: 1 };
  }

  const nodeBase =
    "sim-node rounded-xl border p-4 text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed";

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
      role="group"
      aria-label={copy.heading}
    >
      <h2 className="text-lg font-semibold text-white">{copy.heading}</h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-400">
        {copy.body}
      </p>

      {/* The stage: parts with (not yet) connected lanes */}
      <div className="sim-stage mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        {copy.nodes.map((node, index) => (
          <Fragment key={node.id}>
            {index > 0 && (
              <BLane
                connected={Boolean(links[index - 1])}
                packet={
                  runPacket && runPacket.lane === index - 1
                    ? runPacket
                    : justLinked && justLinked.lane === index - 1
                      ? { lane: index - 1, cls: "sim-pkt-fwd", label: "connected" }
                      : null
                }
              />
            )}
            <button
              type="button"
              data-part={node.id}
              onClick={() => clickPart(node.id)}
              disabled={solved || running}
              key={
                shake.id === node.id
                  ? `${node.id}-${shake.key}`
                  : node.id
              }
              className={`${nodeBase} ${
                shake.id === node.id ? "sd-shake" : ""
              } ${
                selected === node.id
                  ? "border-sky-400/60 bg-sky-400/10 ring-2 ring-sky-400/50"
                  : solved
                    ? "border-emerald-400/40 bg-emerald-500/10"
                    : "border-slate-800 bg-slate-900 hover:border-slate-500"
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                {node.emoji}
              </span>
              <p className="mt-1 text-sm font-semibold text-white">
                {node.name}
              </p>
              <p className="text-[11px] text-slate-400">{node.role}</p>
              {selected === node.id && (
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-sky-300">
                  selected
                </p>
              )}
            </button>
          </Fragment>
        ))}
      </div>

      {/* Connection chips */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {copy.chips.map((label, index) =>
          links[index] ? (
            <span
              key={label}
              className="sim-pop flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300"
            >
              🔗 {label}
            </span>
          ) : (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-700 bg-slate-950/60 px-3 py-1.5 text-xs font-medium text-slate-500"
            >
              🔗 {label}
            </span>
          )
        )}
      </div>
      {solved && (
        <p className="mt-2 text-center text-xs font-medium text-emerald-300">
          {copy.labels.solvedBody}
        </p>
      )}

      {/* Final challenge: run the wired system */}
      {runnable && solved && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            data-run-system
            onClick={runSystem}
            disabled={running}
            className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running ? copy.runBusy : copy.run}
          </button>
        </div>
      )}

      {/* Status (aria-live so every stop and teaching line is announced) */}
      <div
        key={status.key}
        aria-live="polite"
        className={`sd-appear mt-4 rounded-xl border px-4 py-3 text-sm ${
          status.tone === "ok" || status.tone === "win"
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
            : status.tone === "bad"
              ? "sd-shake border-amber-500/40 bg-amber-500/10 text-amber-100"
              : status.tone === "run"
                ? "border-sky-500/30 bg-sky-500/10 text-sky-100"
                : "border-slate-700 bg-slate-950/60 text-slate-300"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {chip && (
            <span
              className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                runPhase === 4
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                  : "border-sky-400/40 bg-sky-400/10 text-sky-300"
              }`}
            >
              {chip}
            </span>
          )}
          <p className={status.tone === "ok" ? "font-semibold" : ""}>
            {status.tone === "ok" ? `✓ ${status.text}` : status.text}
          </p>
        </div>
        {!solved && (
          <p className="mt-2 text-[11px] text-slate-500">{copy.legend}</p>
        )}
      </div>

      {/* Reset */}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          {copy.reset}
        </button>
      </div>
    </div>
  );
}

// One lane between two parts: dashed until the parts are connected.
function BLane({ connected, packet }) {
  if (!connected) {
    return (
      <div className="sim-conn">
        <span className="ls-empty-lane" aria-hidden="true" />
      </div>
    );
  }
  return (
    <div className="sim-conn">
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
