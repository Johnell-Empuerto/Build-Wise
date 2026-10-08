// RoleSwitch - Lesson 3: client/server are roles, not devices.
// Two computers; whichever one ASKS plays the client. Switching the asker
// flips both badges and sends the request packet the other way.
import { useRef, useState } from "react";

const TRAVEL_MS = 900;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function RoleSwitch({ copy, a, b, onSwitch }) {
  const [asker, setAsker] = useState(null); // "a" | "b" | null
  const [moving, setMoving] = useState(null); // "fwd" | "back" | null
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  async function pick(who) {
    if (busyRef.current || who === asker) return;
    busyRef.current = true;
    setBusy(true);
    setAsker(who);
    setMoving(who === "a" ? "fwd" : "back");
    onSwitch?.(who === "a" ? "a-asks-b" : "b-asks-a");
    await sleep(TRAVEL_MS);
    setMoving(null);
    busyRef.current = false;
    setBusy(false);
  }

  const clientFirst = asker === "a";
  const clientSecond = asker === "b";
  const packet = moving
    ? { cls: moving === "fwd" ? "sim-pkt-fwd" : "sim-pkt-back" }
    : asker === "a"
      ? { cls: "sim-pkt-end" } // request parked at B (B received it)
      : asker === "b"
        ? { cls: "" } // request parked back at A
        : null;

  function card(node, key, isClient, isServer) {
    return (
      <div
        className={`rounded-xl border p-4 transition ${
          isClient
            ? "border-sky-400/60 bg-sky-400/10 ring-2 ring-sky-400/40"
            : isServer
              ? "border-violet-400/60 bg-violet-400/10 ring-2 ring-violet-400/40"
              : "border-slate-800 bg-slate-950/60"
        }`}
        data-node={key}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">
            {node.icon}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {node.name}
          </span>
        </div>
        <p
          className={`mt-2 rounded-lg px-2 py-1 text-center text-[11px] font-bold uppercase tracking-wider ${
            isClient
              ? "bg-sky-500/15 text-sky-300"
              : isServer
                ? "bg-violet-500/15 text-violet-300"
                : "bg-slate-900 text-slate-500"
          }`}
        >
          {isClient
            ? "🙋 CLIENT - asking"
            : isServer
              ? "🖥️ SERVER - answering"
              : "? waiting to see"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" role="group" aria-label="Role switch">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => pick("a")}
          disabled={busy || clientFirst}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50 ${
            clientFirst
              ? "bg-sky-500 text-white"
              : "border border-slate-600 text-slate-200 hover:border-sky-400 hover:text-white"
          }`}
        >
          {copy.actionA}
        </button>
        <button
          type="button"
          onClick={() => pick("b")}
          disabled={busy || clientSecond}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50 ${
            clientSecond
              ? "bg-sky-500 text-white"
              : "border border-slate-600 text-slate-200 hover:border-sky-400 hover:text-white"
          }`}
        >
          {copy.actionB}
        </button>
      </div>

      <div className="sim-stage rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        {card(a, "a", clientFirst, clientSecond)}
        <div className="sim-conn" aria-hidden="true">
          <span className="sim-line" />
          <span className="sim-arrow" />
          {packet && (
            <span
              className={`sim-packet rounded-full bg-gradient-to-br from-sky-200 via-sky-400 to-indigo-500 shadow-[0_0_10px_2px_rgba(56,189,248,0.7)] ${packet.cls}`}
            >
              <span className="sim-pkt-label rounded border border-sky-400/40 bg-slate-950/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300">
                {copy.request}
              </span>
            </span>
          )}
        </div>
        {card(b, "b", clientSecond, clientFirst)}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4" aria-live="polite">
        <p className="text-sm font-semibold text-white">
          {asker === null
            ? copy.first
            : asker === "a"
              ? copy.narrationA
              : copy.narrationB}
        </p>
        {copy.note && (
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{copy.note}</p>
        )}
      </div>
    </div>
  );
}
