import { Link } from "react-router-dom";

// Home: what BuildWise is all about - the brand, the two learning paths,
// and how the learning loop works. Static content only (no API calls).
export default function HomePage() {
  const steps = [
    {
      n: "1",
      title: "Learn",
      body: "Short, visual lessons that explain the why before the what - no jargon before you have seen it.",
    },
    {
      n: "2",
      title: "Practice",
      body: "Challenges that teach from every wrong answer instead of just marking you wrong.",
    },
    {
      n: "3",
      title: "Apply",
      body: "Real-world scenarios where you make the calls and justify them in plain words.",
    },
  ];

  return (
    <div>
      {/* ---- Hero --------------------------------------------------------- */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-xs font-bold text-slate-950">
          BW
        </span>
        <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          BuildWise - learn to code, and learn how code fits together.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          BuildWise is a hands-on place to learn programming. Every concept is
          taught in plain language, with interactive lessons you can poke,
          break, and rebuild. Start with JavaScript, then step up to
          designing the systems your code lives in.
        </p>
      </section>

      {/* ---- The two learning paths ---------------------------------------- */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Link
          to="/topics"
          className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-emerald-500/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
            Path 1 - Learn JavaScript
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            From your first variable to real-world problems
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Fundamentals, control flow, functions, and data structures - one
            topic at a time. Then apply everything you learned to real-world
            scenarios in JavaScript Problem Solving.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-emerald-400 transition group-hover:text-emerald-300">
            Start learning →
          </span>
        </Link>

        <Link
          to="/system-design"
          className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-sky-500/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-sky-400">
            Path 2 - System Design
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            Understand the apps you use - then design your own
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Parts, connections, and goals: how real systems are built, taught
            one interactive story at a time - starting with what a system even
            is.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-sky-400 transition group-hover:text-sky-300">
            Open System Design →
          </span>
        </Link>
      </div>

      {/* ---- How it works --------------------------------------------------- */}
      <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          How BuildWise works
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <p className="text-lg font-bold text-emerald-400">{step.n}</p>
              <p className="mt-1 text-sm font-semibold text-white">
                {step.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
