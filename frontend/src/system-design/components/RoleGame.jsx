// RoleGame - Lesson 3 stage 14: live the roles. Round 1 you are the
// CLIENT (choose the asker move); round 2 you are the SERVER (choose the
// answering move). Wrong picks teach immediately.
import { useState } from "react";

export default function RoleGame({ game, onDone }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [wrongId, setWrongId] = useState(null);
  const [solvedRounds, setSolvedRounds] = useState([]);
  const [roundSolved, setRoundSolved] = useState(false);

  const round = game.rounds[roundIndex];
  const lastRound = roundIndex === game.rounds.length - 1;

  function pick(option) {
    if (roundSolved) return;
    if (option.correct) {
      setWrongId(null);
      setRoundSolved(true);
      setSolvedRounds((list) =>
        list.includes(round.id) ? list : [...list, round.id]
      );
    } else {
      setWrongId(option.id);
    }
  }

  function next() {
    if (lastRound) {
      onDone?.();
      return;
    }
    setRoundIndex((i) => i + 1);
    setWrongId(null);
    setRoundSolved(false);
  }

  return (
    <div className="flex flex-col gap-4" role="group" aria-label="Role game">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
            {round.roleIcon} {round.role}
          </p>
          <p className="text-xs text-slate-500">
            Round {roundIndex + 1} of {game.rounds.length}
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            {round.askedBy}
          </p>
          <p className="mt-1 text-lg font-semibold text-white">{round.prompt}</p>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {round.options.map((option) => {
            const chosen = option.id === wrongId;
            const right = roundSolved && option.correct;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => pick(option)}
                disabled={roundSolved}
                className={`rounded-xl border p-3 text-left text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed ${
                  right
                    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
                    : chosen
                      ? "sd-shake border-amber-500/50 bg-amber-500/10 text-amber-200"
                      : "border-slate-700 bg-slate-950/60 text-slate-200 hover:border-slate-500"
                }`}
              >
                {option.text}
              </button>
            );
          })}
        </div>

        <div aria-live="polite">
          {wrongId && (
            <p className="sd-appear mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs leading-relaxed text-amber-200">
              <span className="font-bold text-amber-300">Not quite - </span>
              {round.options.find((o) => o.id === wrongId)?.teach}
            </p>
          )}
          {roundSolved && (
            <p className="sd-appear mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300">
              ✓ {round.solved}
            </p>
          )}
        </div>
      </div>

      {roundSolved && (
        <button
          type="button"
          onClick={next}
          className="sd-appear self-center rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          {lastRound ? "✓ Finish the game" : "Switch roles →"}
        </button>
      )}

      {solvedRounds.length === game.rounds.length && (
        <p className="sd-appear rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-center text-sm font-medium text-emerald-300">
          ✓ {game.done}
        </p>
      )}
    </div>
  );
}
