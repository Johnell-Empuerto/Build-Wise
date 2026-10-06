# BuildWise

**BuildWise** is a browser-based learning platform that teaches how software
really works — through a hands-on JavaScript curriculum and an interactive
System Design section. Open it, break it, fix it, explain it.

Everything runs **entirely in the browser**: no server, no database, no
accounts. The curriculum ships as JSON, and every code challenge is judged
locally in a Web Worker.

## What's inside

### JavaScript curriculum
- Topic → Section → Concept → Lesson → Challenge navigation
- 9 topics · 41 sections · 43 concepts · 84 lessons · 189 challenges · 573 test cases
- Lessons with explanations, examples, common mistakes, and practice challenges

### In-browser challenge runner
- Monaco editor (the VS Code editor) right in the page
- Code is judged locally in a Web Worker with a 3-second time budget
- Feedback for empty code, syntax errors, runtime errors, wrong answers,
  infinite loops, and passing solutions — with expected vs. received values
  shown for every test, always
- "Next Challenge" follows the curriculum order

### System Design (interactive lessons)
- Roadmap from Fundamentals (Level 1) through API/Database/Architecture to
  Design Problems
- **"How does a Todo App work?"** — an 8-stage lesson: meet the team → watch an
  animated request/response flow → try it → quick check (with teaching
  feedback for every wrong answer) → build the flow yourself → explain your
  reasoning → summary
- Guided by a friendly on-screen guide; progress is kept in memory for the
  session (a refresh resets it, by design)

## Tech stack

| Layer    | Choice                                          |
| -------- | ----------------------------------------------- |
| UI       | React 19 + React Router 7                       |
| Styling  | Tailwind CSS 4                                  |
| Editor   | Monaco Editor (`@monaco-editor/react`)          |
| Build    | Vite 8                                          |
| Judging  | Web Worker (browser-side, no backend)           |

## Getting started

### Prerequisites
- [Node.js](https://nodejs.org/) 20 or newer (tested on Node 24)
- npm (bundled with Node)

### Install & run

```bash
git clone https://github.com/Johnell-Empuerto/Build-Wise.git
cd Build-Wise/frontend
npm install
npm run dev
```

Then open **http://localhost:5173**.

### Production build

```bash
npm run build      # outputs static files to frontend/dist
npm run preview    # serves the production build locally
```

The build is fully static — host it on any static file service (a Vercel
SPA rewrite is already configured in `frontend/vercel.json`).

## Project structure

```
Build-Wise/
├── README.md
├── .gitignore
└── frontend/
    ├── index.html
    ├── vercel.json          # SPA rewrite for static hosting
    └── src/
        ├── pages/           # Topics, sections, concepts, lessons, challenges
        ├── components/      # Lists, editor, results, badges
        ├── data/            # Curriculum JSON + System Design content
        ├── judge/           # Web Worker code judge
        ├── system-design/   # System Design section (overview, lesson, components)
        ├── services/        # Local data layer (JSON + curriculum order)
        └── utils/           # Helpers
```

## Notes

- **No backend required.** The app makes zero network calls beyond loading
  its own static assets.
- **No tracking or persistence.** Nothing is written to browser storage;
  System Design progress lives in React state for the current session.
- The test cases shown while solving challenges are the real curriculum data,
  exported from the course database into `frontend/src/data/*.json`.
