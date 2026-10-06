function paragraphs(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function Example({ example, index }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {example.title || `Example ${index + 1}`}
        </p>
      </div>
      <pre className="mt-2 overflow-x-auto whitespace-pre text-xs leading-relaxed text-slate-200">
        <code>{example.code}</code>
      </pre>
      {example.output !== undefined && example.output !== "" && (
        <div className="mt-2 border-t border-slate-800 pt-2">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Output
          </p>
          <pre className="mt-1 overflow-x-auto whitespace-pre text-xs text-emerald-400">
            <code>{String(example.output)}</code>
          </pre>
        </div>
      )}
      {example.caption && (
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          {example.caption}
        </p>
      )}
    </div>
  );
}

export default function LessonContent({ lesson }) {
  const body = paragraphs(lesson.explanation);
  const examples = Array.isArray(lesson.examples) ? lesson.examples : [];
  const notes = Array.isArray(lesson.notes) ? lesson.notes : [];
  const mistakes = Array.isArray(lesson.common_mistakes)
    ? lesson.common_mistakes
    : [];

  const hasContent =
    body.length > 0 ||
    examples.length > 0 ||
    notes.length > 0 ||
    mistakes.length > 0;

  if (!hasContent) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 px-5 py-6 text-sm text-slate-500">
        This lesson does not have written content yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {body.length > 0 && (
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-col gap-4">
            {body.map((paragraph, index) => (
              <p
                key={index}
                className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {examples.length > 0 && (
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Examples
          </h2>
          <div className="mt-3 flex flex-col gap-4">
            {examples.map((example, index) => (
              <Example key={index} example={example} index={index} />
            ))}
          </div>
        </section>
      )}

      {notes.length > 0 && (
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Keep in mind
          </h2>
          <ul className="mt-3 flex flex-col gap-3">
            {notes.map((note, index) => (
              <li key={index} className="text-sm leading-relaxed">
                <span className="font-semibold text-emerald-400">
                  {note.title}
                </span>
                <p className="mt-0.5 text-slate-300">{note.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {mistakes.length > 0 && (
        <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-400/80">
            Common mistakes
          </h2>
          <ul className="mt-3 flex flex-col gap-4">
            {mistakes.map((mistake, index) => (
              <li key={index} className="text-sm leading-relaxed">
                <p className="text-slate-300">
                  <span className="font-semibold text-red-400">Problem: </span>
                  {mistake.problem}
                </p>
                <p className="mt-1 text-slate-300">
                  <span className="font-semibold text-emerald-400">Fix: </span>
                  {mistake.fix}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
