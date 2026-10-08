// WhoIsAsking - Lesson 3's short interactive check: given one arrow
// between computers A and B, pick who is asking (client) and then who is
// answering (server). Wrong picks teach; the second question only appears
// after the first is answered. No Next button - answers advance the check.
import { useState } from "react";

function QuestionBlock({
  question,
  solved,
  wrongCount,
  onPick,
  isLast,
  solvedText,
}) {
  return (
    <div className="sd-appear rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-sm font-semibold text-white">{question.prompt}</p>

      {solved ? (
        <p className="mt-2 text-xs font-semibold leading-relaxed text-emerald-300">
          {question.right}
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onPick(option.correct)}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {!solved && wrongCount > 0 && (
        <p
          key={wrongCount}
          className="sd-shake mt-2 text-xs font-semibold leading-relaxed text-amber-300"
        >
          {question.wrong}
        </p>
      )}

      {isLast && solved && solvedText && (
        <p className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300">
          ✓ {solvedText}
        </p>
      )}
    </div>
  );
}

export default function WhoIsAsking({ quiz, onSolved }) {
  const [q1, setQ1] = useState({ solved: false, wrongCount: 0 });
  const [q2, setQ2] = useState({ solved: false, wrongCount: 0 });

  function pick(question, setQuestion, correct) {
    if (question.solved) return;
    if (correct) {
      setQuestion((prev) => ({ ...prev, solved: true }));
      if (question === q2) onSolved?.();
    } else {
      setQuestion((prev) => ({ ...prev, wrongCount: prev.wrongCount + 1 }));
    }
  }

  return (
    <div className="flex flex-col gap-3" role="group" aria-label={quiz.heading}>
      {/* The diagram: A sends a request to B */}
      <div className="sim-stage rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-center">
            <p className="text-lg" aria-hidden="true">
              {quiz.diagram.from}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
              {quiz.diagram.label} ▶
            </p>
            <p className="mt-1 text-xs text-slate-500">asks →</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-center">
            <p className="text-lg" aria-hidden="true">
              {quiz.diagram.to}
            </p>
          </div>
        </div>
      </div>

      <QuestionBlock
        question={quiz.q1}
        solved={q1.solved}
        wrongCount={q1.wrongCount}
        onPick={(correct) => pick(q1, setQ1, correct)}
        isLast={false}
      />

      {q1.solved && (
        <QuestionBlock
          question={quiz.q2}
          solved={q2.solved}
          wrongCount={q2.wrongCount}
          onPick={(correct) => pick(q2, setQ2, correct)}
          isLast
          solvedText={quiz.solved}
        />
      )}
    </div>
  );
}
