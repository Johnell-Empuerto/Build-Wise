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
  { id: "what-is-a-system", title: "What is a System?", available: false },
  { id: "client-server", title: "Client and Server", available: false },
  { id: "frontend-backend", title: "Frontend vs Backend", available: false },
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

export const LESSON_STAGES = [
  { id: "intro", label: "Introduction", chip: "See it" },
  { id: "team", label: "The Team", chip: "Understand it" },
  { id: "flow", label: "Follow the Request", chip: "Interact with it" },
  { id: "try", label: "Try It", chip: "See what happens" },
  { id: "check", label: "Quick Check", chip: "Learn from mistakes" },
  { id: "build", label: "Build the Flow", chip: "Build it" },
  { id: "explain", label: "Explain Your Choice", chip: "Explain it" },
  { id: "summary", label: "Summary", chip: "Wrap up" },
];

export const TODO_APP_LESSON = {
  id: "todo-app",
  title: "How does a Todo App work?",

  intro: {
    heading: "One click. Five parts working together.",
    body: "A todo app feels simple: you type something, press Add, and it appears. But behind that one click, a small team of parts passes your todo along like a relay race. In this lesson you will watch one todo travel through the whole team - and come back with a smiley check mark.",
    tease: "Ready? First, meet the team.",
  },

  // Stage 2: clickable component cards (analogies + what happens without it)
  team: [
    {
      id: "frontend",
      name: "Frontend",
      accent: "cyan",
      emoji: "🖥️",
      tagline: "The screen you interact with.",
      analogy:
        "Like the menu board and cashier counter in a shop - it is what you see and touch.",
      without:
        "Nothing to click. You would have to type raw commands like a developer.",
    },
    {
      id: "api",
      name: "API",
      accent: "blue",
      emoji: "📡",
      tagline: "The messenger that carries requests and answers.",
      analogy:
        "Like a waiter: takes your order to the kitchen and brings the food back.",
      without:
        "The screen would have to reach into the database directly - and hand out its secret password to everyone.",
    },
    {
      id: "backend",
      name: "Backend",
      accent: "violet",
      emoji: "⚙️",
      tagline: "The part that processes the request.",
      analogy:
        "Like the kitchen worker who checks the order, follows the rules, and prepares it.",
      without:
        "Nobody checks the rules. Any invalid or harmful request would walk right in.",
    },
    {
      id: "database",
      name: "Database",
      accent: "fuchsia",
      emoji: "🗄️",
      tagline: "The place where information is remembered.",
      analogy:
        "Like the shop's notebook - it writes down every order so it is not forgotten.",
      without:
        "Your todos live only on the screen. Close the page and they are gone forever.",
    },
  ],

  // Stage 3/4: the animated request/response flow
  hops: [
    {
      id: "user",
      name: "You",
      accent: "sky",
      emoji: "🧑‍💻",
      tagline: "You tap Add Todo.",
      explanation:
        "Every flow starts with a person wanting something to happen.",
      analogy: "The customer who places an order.",
    },
    {
      id: "frontend",
      name: "Frontend",
      accent: "cyan",
      emoji: "🖥️",
      tagline: "The screen you interact with.",
      explanation:
        "It draws the buttons and lists, then sends your click onward as a request.",
      analogy: "The cashier counter that takes your order.",
    },
    {
      id: "api",
      name: "API",
      accent: "blue",
      emoji: "📡",
      tagline: "The messenger between screen and brain.",
      explanation:
        "It carries the request to the backend and later carries the answer back.",
      analogy: "The waiter walking between table and kitchen.",
    },
    {
      id: "backend",
      name: "Backend",
      accent: "violet",
      emoji: "⚙️",
      tagline: "The part that processes the request.",
      explanation:
        "It checks that the todo is valid and decides what should happen next.",
      analogy: "The kitchen worker preparing your order.",
    },
    {
      id: "database",
      name: "Database",
      accent: "fuchsia",
      emoji: "🗄️",
      tagline: "The place where information is remembered.",
      explanation:
        "It writes the todo down so it is still there after you close and reopen the app.",
      analogy: "The notebook that stores every order.",
    },
  ],

  flow: {
    instruction:
      "Press Play and follow the moving dot. The dot is your request travelling through the system - then the answer travelling back.",
    requestLabel: "REQUEST - carrying your todo down",
    responseLabel: "RESPONSE - carrying the answer back up",
    completeText:
      "Flow complete - you followed one todo all the way down and back!",
  },

  tryIt: {
    heading: "Your turn. Add a todo.",
    body: "Press the button and watch what happens behind the scenes. Every click sends one todo on the journey you just learned.",
    button: "＋ Add Todo",
    addedText: "Todo Added ✓",
    resultCaption:
      "Nice! The answer travelled back the same way your request went down: Database → Backend → API → Frontend → you.",
  },

  // Stage 5: quick check with teaching feedback for every wrong answer
  quiz: {
    question: "Where is a todo permanently remembered?",
    options: [
      {
        id: "frontend",
        text: "In the frontend",
        correct: false,
        teach:
          "The frontend only SHOWS the todo on your screen. Refresh the page without a backend and it would disappear.",
      },
      {
        id: "database",
        text: "In the database",
        correct: true,
        teach:
          "Yes! The database is the system's notebook - the todo is still there after the server restarts.",
      },
      {
        id: "api",
        text: "In the API",
        correct: false,
        teach:
          "The API is only a messenger. It passes the todo along like a waiter - it does not keep a copy.",
      },
      {
        id: "javascript",
        text: "In JavaScript",
        correct: false,
        teach:
          "JavaScript is the LANGUAGE the app is written in. A language does not store data - the database does.",
      },
    ],
    retryHint: "Pick an answer, press Check, and learn from the feedback. You can try again!",
  },

  // Stage 6: order challenge (build the flow yourself)
  build: {
    prompt:
      "Build the path of a todo. Click the parts in the order your todo would visit them.",
    reset: "Start over",
    solved:
      "Perfect flow! Your todo visits: You → Frontend → API → Backend → Database.",
    steps: [
      {
        id: "user",
        label: "You click Add Todo",
        why: "Nothing can happen until someone asks for it - you start the flow.",
      },
      {
        id: "frontend",
        label: "Frontend",
        why: "The screen catches your click and turns it into a request.",
      },
      {
        id: "api",
        label: "API",
        why: "The messenger carries the request toward the brain of the app.",
      },
      {
        id: "backend",
        label: "Backend",
        why: "The backend checks the request and decides what to do.",
      },
      {
        id: "database",
        label: "Database",
        why: "Last stop - the database writes the todo down to remember it.",
      },
    ],
  },

  // Stage 7: explain your choice (simple keyword check, no AI)
  explain: {
    prompt:
      "In one or two sentences: why does a todo app need a database instead of only the frontend?",
    placeholder: "Type your answer here...",
    keywords: ["remember", "store", "save", "permanent", "restart", "close"],
    checkButton: "Check my explanation",
    revealButton: "Show a model answer",
    passTitle: "Great explanation!",
    passBody:
      "You connected the database to remembering data - that is the core idea.",
    coachTitle: "Almost - add one key idea.",
    coachBody:
      "Mention that the database STORES or REMEMBERS data (for example words like: remember, store, permanent, restart).",
    modelAnswer:
      "The database remembers todos permanently. The frontend only displays them - if you closed the page, they would be lost without a database.",
  },

  summary: {
    congrats: "You just learned how a todo app really works!",
    cards: [
      {
        title: "Frontend shows",
        body: "The screen you interact with turns your click into a request.",
      },
      {
        title: "Backend works",
        body: "It checks the request, follows the rules, and tells the database what to do.",
      },
      {
        title: "Database remembers",
        body: "It writes data down so it survives restarts, refreshes, and time.",
      },
      {
        title: "API connects",
        body: "The messenger between screen and brain - requests go down, answers come back.",
      },
    ],
    closing:
      "Every bigger system you will ever design is this same team, with more helpers added when the load grows.",
  },
};
