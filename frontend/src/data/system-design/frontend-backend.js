// System Design - Level 1, Lesson 4: "Frontend vs Backend"
// Frontend-only static content. Builds directly on lesson 3 (client/server):
// the frontend IS the visible client side, the backend IS the working server
// side. Restaurant thread continues: dining room vs kitchen. Scroll-led:
// sections read top to bottom, the restaurant-to-software morph starts when
// its section scrolls into view, and every interaction lives inline.

export const FRONTEND_BACKEND_LESSON = {
  id: "frontend-backend",
  title: "Frontend vs Backend",

  intro: {
    heading: "One app, two jobs.",
    definition:
      "Frontend is what you see and touch. Backend is what makes it work.",
    body:
      "The buttons, colors, and words you interact with are the frontend. The rules, calculations, and memory behind them are the backend. You have already met them as client and server - now they get sharper names: the frontend is the client's side of the screen, the backend is the server's side of the work.",
    analogy:
      "A restaurant again: the dining room is the frontend - menus, plates, the smile that greets you. The kitchen is the backend - you never see it, but it is why your plate arrives. Neither works alone.",
    tease: "Watch the restaurant turn into software, then take the split apart yourself.",
  },

  sides: {
    heading: "What each side is for",
    hint: "Tap each card for its story.",
    complete: "Frontend shows, backend decides - and they need each other.",
    cards: [
      {
        id: "frontend",
        name: "Frontend",
        emoji: "🎨",
        tagline: "The side you see and touch.",
        analogy:
          "The dining room and menu: plates, colors, buttons, the words on the screen. It collects your intent - every click, keystroke, and tap.",
        without:
          "No frontend means a system only robots can use - raw commands typed into a terminal.",
      },
      {
        id: "backend",
        name: "Backend",
        emoji: "⚙️",
        tagline: "The side that does the work you never see.",
        analogy:
          "The kitchen: checks the order, follows the recipes, keeps the pantry (the data), and decides what is even possible.",
        without:
          "No backend means a pretty screen with nothing behind it - the moment you need a real rule or any memory, it collapses.",
      },
      {
        id: "split",
        name: "The Split",
        emoji: "🤝",
        tagline: "Each side does what it is good at.",
        analogy:
          "The dining room does not cook, and the kitchen does not seat guests. They talk through a pass window - a messenger we will name in the next lesson.",
        without:
          "Put everything on one side and you get either an unsafe app (rules living in the browser) or an ugly one (a server trying to draw pixels).",
      },
    ],
  },

  // The scroll-triggered morph: restaurant words dissolve into software
  // words (same animation family as lesson 3's restaurant-to-software beat).
  morph: {
    heading: "From Restaurant to Software",
    body:
      "Same building, new names - watch the dining room become the frontend and the kitchen become the backend.",
    from: [
      { icon: "🪑", name: "Dining Room", sub: "menus, plates, smiles" },
      { icon: "🍳", name: "Kitchen", sub: "recipes, pantry, heat" },
    ],
    to: [
      { icon: "🎨", name: "Frontend", sub: "screens, buttons, words" },
      { icon: "⚙️", name: "Backend", sub: "rules, memory, work" },
    ],
    lines: [
      "You look, tap, and read - that is the frontend.",
      "It checks, decides, and remembers - that is the backend.",
      "Frontend asks, backend answers, frontend shows.",
    ],
  },

  fix: {
    heading: "Fix the split",
    body:
      "A todo app's code was split carelessly. Some lines are in the right place - those are fine. Click the misplaced ones to move them where they belong.",
    solved:
      "Both mistakes fixed - the split is healthy again. That instinct (who should own what?) is 80% of real architecture work.",
    gateHint: "Find and fix both misplaced lines.",
    items: [
      {
        id: "draw",
        text: "Frontend: draw the todo list and the Add button",
        side: "frontend",
        correct: true,
        note: "Drawing and colors are presentation - the browser's whole specialty.",
      },
      {
        id: "validate",
        text: "Backend: reject an empty todo before saving it",
        side: "backend",
        correct: true,
        note: "Rules live on the backend so nobody can bypass them.",
      },
      {
        id: "password",
        text: "Frontend: compare your password with the stored record",
        side: "frontend",
        correct: false,
        fixSide: "backend",
        teach:
          "Everyone can read the frontend's code. Passwords must be checked on the backend, where the code is unreachable - it compares and only answers yes or no.",
      },
      {
        id: "toast",
        text: "Backend: show the 'Todo Added!' confirmation",
        side: "backend",
        correct: false,
        fixSide: "frontend",
        teach:
          "The backend cannot draw pixels - it sends the data, and the frontend decides how to show it. Messages are presentation, so they move to the frontend.",
      },
      {
        id: "send",
        text: "Frontend: send the todo when you click Add",
        side: "frontend",
        correct: true,
        note: "Collecting the click and sending the request is the frontend's half of the handshake.",
      },
    ],
  },

  quiz: {
    heading: "Quick Check: Where Does the Rule Live?",
    intro:
      "A rule only counts when it lives where nobody can bend it. Where does this one go?",
    question:
      "The rule 'each username must be unique' has to live somewhere. Where?",
    options: [
      {
        id: "frontend",
        text: "In the frontend, where users type it",
        correct: false,
        teach:
          "The frontend can be edited, bypassed, or out of date. A rule only enforced there is not a rule - it is a suggestion anyone can ignore.",
      },
      {
        id: "backend",
        text: "On the backend, which decides every signup",
        correct: true,
        teach:
          "Yes! One judge, in a place nobody can tamper with. The frontend may warn early, but the backend has the final say.",
      },
      {
        id: "database",
        text: "In the database alone",
        correct: false,
        teach:
          "The database can refuse duplicates, but deciding what 'valid' means is the backend's job: the backend speaks, the database obeys.",
      },
      {
        id: "both",
        text: "In both places, identically",
        correct: false,
        teach:
          "Two copies of one rule eventually disagree - and then nobody knows the truth. Keep one master copy on the backend.",
      },
    ],
    retryHint:
      "Pick an answer, press Check, and learn from the feedback. You can try again!",
  },

  build: {
    heading: "Follow a Like",
    body:
      "Watch which side owns each beat - click the beats in the order they really happen.",
    prompt:
      "Someone taps the ❤️ on a post. Build the five beats - and watch which side owns each one.",
    reset: "Start over",
    solved:
      "Five beats, two sides, one handshake: the frontend carries your intent, the backend makes it real, the frontend shows the result.",
    steps: [
      {
        id: "click",
        label: "Frontend: catch the click",
        why:
          "The browser notices your finger first - collecting intent is always the frontend.",
      },
      {
        id: "ask",
        label: "Frontend: ask the backend",
        why:
          "The frontend cannot decide alone; it must ask the side that owns the rules.",
      },
      {
        id: "check",
        label: "Backend: check the rules",
        why:
          "Rules run where users cannot tamper - the backend checks before anything is written.",
      },
      {
        id: "save",
        label: "Backend: save and answer",
        why:
          "It stores the like and replies - one visit to the backend, one answer back.",
      },
      {
        id: "draw",
        label: "Frontend: redraw the screen",
        why:
          "Back on screen: only the frontend can draw the new heart count.",
      },
    ],
  },

  explain: {
    heading: "Explain Your Choice",
    prompt:
      "In your own words: why must the password check live in the backend instead of the frontend?",
    placeholder: "Type your answer here...",
    keywords: ["anyone", "read", "change", "bypass", "trust", "tamper"],
    checkButton: "Check my explanation",
    revealButton: "Show a model answer",
    passTitle: "Great explanation!",
    passBody:
      "You connected the split to trust: code users cannot reach is code users cannot cheat.",
    coachTitle: "Almost - add one key idea.",
    coachBody:
      "Say that anyone can read or change the frontend code, so the check could be switched off (words like: anyone, read, change, bypass, trust, tamper).",
    modelAnswer:
      "The frontend's code is plain for anyone to read and edit, so a check there can simply be switched off. The backend runs where users cannot reach the code, checks the password, and only sends back yes or no.",
  },

  summary: {
    heading: "The Two Halves",
    congrats: "You can now split any feature into its two halves!",
    cards: [
      {
        title: "Frontend shows",
        body:
          "Drawing, animation, collecting your clicks - the visible half that carries your intent.",
      },
      {
        title: "Backend decides",
        body:
          "Rules, permissions, calculations - the half nobody sees but everyone obeys.",
      },
      {
        title: "Secrets stay backend",
        body:
          "Passwords, keys, and raw data never live in code the browser downloads.",
      },
      {
        title: "Two sides, one app",
        body:
          "Not rivals: the frontend asks, the backend answers, the frontend shows.",
      },
    ],
    closing:
      "Next lesson: the API - the messenger that carries the frontend's requests to the backend and brings the answers home. You have seen the two rooms; now meet the hallway between them.",
  },
};
