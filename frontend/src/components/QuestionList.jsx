import { Link } from "react-router-dom";
import DifficultyBadge from "./DifficultyBadge.jsx";
import LevelBadge from "./LevelBadge.jsx";
import { formatChallengeType } from "../utils/format.js";

export default function QuestionList({ questions }) {
  if (questions.length === 0) {
    return <p className="text-sm text-slate-400">No challenges available yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {questions.map((question) => (
        <Link
          key={question.id}
          to={`/questions/${question.id}`}
          className="group flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 transition hover:border-emerald-500/50"
        >
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300">
              {question.title}
            </h3>
            {question.description && (
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                {question.description}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-400">
                {formatChallengeType(question.challenge_type)}
              </span>
              <LevelBadge level={question.level} />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <DifficultyBadge difficulty={question.difficulty} />
            <span className="text-slate-600 transition group-hover:text-emerald-500">
              &rarr;
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
