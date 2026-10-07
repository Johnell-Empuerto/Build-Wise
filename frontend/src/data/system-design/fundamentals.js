// System Design - Level 1 (Fundamentals) static content.
// Frontend-only: no backend, no database, no API calls. React state drives
// all progress; a refresh simply resets it.

export const FUNDAMENTALS_LESSONS = [
  {
    id: "todo-app",
    title: "How does a Todo App work?",
    summary:
      "Follow one todo from your screen all the way to storage and back.",
    available: true,
  },
  { id: "what-is-a-system", title: "What is a System?", summary: "Parts, connections, goals, and boundaries - what turns a pile of pieces into a system.", available: true },
  { id: "client-server", title: "Client and Server", summary: "The two roles behind every online interaction: who asks, who answers, and who waits.", available: true },
  { id: "frontend-backend", title: "Frontend vs Backend", summary: "Who owns what: frontend shows and collects, backend rules and remembers.", available: true },
  { id: "api", title: "API", available: false },
  { id: "database", title: "Database", available: false },
  { id: "request-response", title: "Request and Response", available: false },
  { id: "stateful-stateless", title: "Stateful vs Stateless", available: false },
  {
    id: "sync-async",
    title: "Synchronous vs Asynchronous",
    available: false,
  },
];

// The full roadmap shown on the System Design overview page.
export const SYSTEM_DESIGN_ROADMAP = [
  { level: 1, title: "Fundamentals", count: 9, status: "open" },
  { level: 2, title: "Requirements", count: 6, status: "planned" },
  { level: 3, title: "API Design", count: 7, status: "planned" },
  { level: 4, title: "Database Design", count: 7, status: "planned" },
  { level: 5, title: "Architecture", count: 7, status: "planned" },
  { level: 6, title: "Performance & Scaling", count: 6, status: "planned" },
  { level: 7, title: "Reliability", count: 6, status: "planned" },
  { level: 8, title: "Security", count: 7, status: "planned" },
  { level: null, title: "Design Problems", count: 12, status: "planned" },
];

// Lesson 1 stage list: watch the system -> learn from mistakes -> break it
// -> understand it -> rebuild the trip -> wrap up.
export const LESSON_STAGES = [
  { id: "journey", label: "Follow One Todo", chip: "See it" },
  { id: "quiz", label: "Where Is It Kept?", chip: "Learn from mistakes" },
  { id: "break", label: "Break the System", chip: "See what happens" },
  { id: "cards", label: "Four Simple Cards", chip: "Understand it" },
  { id: "challenge", label: "Trace the Round Trip", chip: "Build it" },
  { id: "summary", label: "Summary", chip: "Wrap up" },
];

export const TODO_APP_LESSON = {
  id: "todo-app",
  title: "How does a Todo App work?",

  // Stage 1: the miniature simulation (see -> click -> watch -> understand).
  journey: {
    ready: "READY",
    stepPrefix: "STEP",
    addLabel: "ADD",
    inputPlaceholder: "Write a todo...",
    defaultTodo: "Buy milk",
    idle: {
      title: "Let's follow one todo.",
      body: "Type a todo (try: Buy milk) and press ADD. A glowing message will leave your screen, travel through the whole system, and come back with a check mark.",
    },
    // One entry per beat; the simulator shows the entry of the step it just
    // reached. Technical words appear only AFTER the visual it names.
    beats: [
      {
        title: "You clicked ADD.",
        body: "A glowing message leaves your screen: \"Please save: {todo}\". The screen you are touching is the FRONTEND - buttons, text, forms - like the front counter of a restaurant. Programmers call that glowing message a REQUEST.",
      },
      {
        title: "The worker received it.",
        body: "The BACKEND is the worker behind the screen - the kitchen behind the counter. It receives your message and decides what should happen: \"Okay! I'll save it.\"",
      },
      {
        title: "Now the notebook.",
        body: "The DATABASE is where the system remembers information - like a notebook. If you close the app, the notebook still remembers.",
      },
      {
        title: "Written down!",
        body: "BEFORE: the notebook was empty. AFTER: \"Buy milk\" is written inside. That is what saving really looks like. Now the answer starts travelling back.",
      },
      {
        title: "The answer came back.",
        body: "\"Saved!\" arrived at your screen: Database to Backend to Frontend. Programmers call this coming-back message a RESPONSE.",
      },
      {
        title: "✓ Todo saved!",
        body: "You just watched one complete trip through a software system - a REQUEST going down and a RESPONSE coming back.",
      },
    ],
    fail: {
      title: "Uh oh!",
      body: "The backend asked the database to remember the todo, but the database is unavailable. The screen can still be visible - but saving the todo fails.",
    },
    chainCaption: "The whole trip:",
    chain: [
      { id: "you", label: "You" },
      { id: "frontend", label: "Frontend" },
      { id: "backend", label: "Backend" },
      { id: "database", label: "Database" },
      { id: "backend2", label: "Backend" },
      { id: "frontend2", label: "Frontend" },
      { id: "you2", label: "You" },
    ],
    idleHint: "Type a todo, then press ADD to start the trip.",
    doneHint: "The trip is complete - continue when you are ready.",
    controls: {
      play: "▶ Play",
      replay: "↻ Replay",
      tryAgain: "↻ Try Again",
      playing: "● Playing…",
      step: "⏭ Step",
      reset: "↻ Reset",
    },
  },

  // Stage 2: interactive break - answer, learn visually from a mistake.
  quiz: {
    question: "Where should {todo} be remembered?",
    intro: "Pick an answer. A wrong one shows you exactly why it cannot remember.",
    wrongHeading: "Not quite - watch what happens.",
    demoScreen: "📱 Your screen",
    demoScreenNote: "(it closes...)",
    demoNote: "🗄️ The notebook",
    demoNoteNote: "(it stays)",
    demoCaption:
      "Imagine closing the app. The screen disappears. The notebook stays. That is why we use a database.",
    options: [
      {
        id: "frontend",
        label: "Frontend",
        correct: false,
        teach:
          "The frontend only SHOWS the todo. Close the app and its list disappears with it.",
      },
      {
        id: "backend",
        label: "Backend",
        correct: false,
        teach:
          "The backend WORKS on the todo, but the notebook is what keeps it. Workers can restart - the notebook outlasts them.",
      },
      {
        id: "database",
        label: "Database",
        correct: true,
        teach:
          "Yes! The notebook. Close the app, restart the computer - \"{todo}\" is still written down.",
      },
      {
        id: "button",
        label: "The Button",
        correct: false,
        teach:
          "A button just reacts to your tap. It cannot remember anything on its own.",
      },
    ],
    correctText:
      "Exactly - the database is the notebook of the system. The screen shows it, the worker saves it, the notebook remembers it.",
    gateHint: "Find where the todo is remembered to continue.",
  },

  // Stage 3: break the system, watch it fail, repair it, watch it succeed.
  breakStage: {
    heading: "What happens if the database disappears?",
    body: "Turn the database OFF and watch the same trip fail - then repair it and watch it work.",
    toggleOn: "🗄️ Database: ON (click to turn OFF)",
    toggleOff: "🗄️ Database: OFF (click to turn ON)",
    toggleOnShort: "Database ON",
    toggleOffShort: "Database OFF",
    statusOff: "Database is OFF. Saving the todo will fail.",
    statusOn: "Database is ON. Everything can be remembered.",
    failPanel:
      "Uh oh! The backend asked the database to remember the todo, but the database is unavailable. The screen still works - but saving the todo fails.",
    retryHint:
      "Turn the database back on, then press Try Again to watch the whole trip succeed.",
    restoredHint:
      "The database is back on. Press Try Again in the simulator to watch the full trip succeed.",
    successText: "The database is back - and the whole trip worked!",
    gateHint: "Turn the database off and watch a trip fail to continue.",
  },

  // Stage 4: simple final explanation (four cards).
  cards: {
    heading: "The whole system in four cards",
    body: "Four simple answers you can now say out loud.",
    items: [
      { emoji: "🖥️", name: "FRONTEND", body: "The part you see and touch." },
      {
        emoji: "⚙️",
        name: "BACKEND",
        body: "The worker that handles the request.",
      },
      {
        emoji: "🗄️",
        name: "DATABASE",
        body: "The place that remembers information.",
      },
      {
        emoji: "📨",
        name: "REQUEST / RESPONSE",
        body: "A message going there and coming back.",
      },
    ],
  },

  // Stage 5: final interactive challenge - build the round trip.
  challenge: {
    prompt:
      "You want to save a new todo. Arrange the whole round trip - the request going down, then the response coming back.",
    goingLabel: "Going down (request)",
    backLabel: "Coming back (response)",
    poolHint: "Click a part to fill the next box - the right part is always next.",
    parts: [
      { id: "frontend", label: "Frontend", emoji: "🖥️" },
      { id: "backend", label: "Backend", emoji: "⚙️" },
      { id: "database", label: "Database", emoji: "🗄️" },
    ],
    slots: [
      { id: "frontend", why: "Nothing can happen until you press ADD on the screen." },
      { id: "backend", why: "The screen cannot store by itself - it sends its message to the worker." },
      { id: "database", why: "The worker hands the todo to the notebook." },
      { id: "database", why: "The answer starts where the data was saved: the notebook says \"Saved!\"" },
      { id: "backend", why: "The worker carries the answer back toward the screen." },
      { id: "frontend", why: "The screen shows the check mark to you." },
    ],
    wrongHeading: "Not the next stop - here is why:",
    solvedText: "🎉 You just traced a real software system!",
    solvedBody:
      "Request down: Frontend to Backend to Database. Response back: Database to Backend to Frontend. That is the real shape of nearly every app you use.",
    reset: "Start over",
    gateHint: "Build the full round trip to continue.",
  },

  // Stage 6: wrap-up.
  summary: {
    congrats: "You just learned how a todo app really works!",
    wordsHeading: "Words you now know",
    words: [
      { term: "FRONTEND", def: "the part you see and touch" },
      { term: "BACKEND", def: "the worker behind the screen" },
      { term: "DATABASE", def: "the notebook that remembers" },
      { term: "REQUEST", def: "the message going there" },
      { term: "RESPONSE", def: "the answer coming back" },
    ],
    closing:
      "Every bigger system you will ever design is this same trip - with more helpers added when the load grows.",
  },
};
