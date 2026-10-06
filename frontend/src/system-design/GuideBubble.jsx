// Friendly guide (mascot) - a small gradient robot built from SVG.
// Used across System Design pages for short, encouraging explanations.
export function GuideAvatar({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="System Design guide"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="guide-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <line
        x1="24"
        y1="7"
        x2="24"
        y2="13"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="5" r="3" fill="#22d3ee" />
      <rect
        x="8"
        y="13"
        width="32"
        height="26"
        rx="9"
        fill="url(#guide-body)"
      />
      <rect x="14" y="21" width="8" height="9" rx="4.5" fill="#0f172a" />
      <rect x="26" y="21" width="8" height="9" rx="4.5" fill="#0f172a" />
      <circle cx="18" cy="24.5" r="1.8" fill="#e0f2fe" />
      <circle cx="30" cy="24.5" r="1.8" fill="#e0f2fe" />
      <path
        d="M19 33c1.6 1.6 8.4 1.6 10 0"
        stroke="#0f172a"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="4" y="24" width="4" height="8" rx="2" fill="#64748b" />
      <rect x="40" y="24" width="4" height="8" rx="2" fill="#64748b" />
    </svg>
  );
}

export default function GuideBubble({ children, mood = "coach" }) {
  const moodStyles = {
    coach: "border-indigo-500/30 bg-indigo-500/10",
    success: "border-emerald-500/30 bg-emerald-500/10",
    hint: "border-amber-500/30 bg-amber-500/10",
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${moodStyles[mood] || moodStyles.coach}`}
    >
      <GuideAvatar />
      <div className="pt-0.5 text-sm leading-relaxed text-slate-200">
        {children}
      </div>
    </div>
  );
}
