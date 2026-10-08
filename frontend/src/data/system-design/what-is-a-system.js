// System Design - Level 1, Lesson 2: "What is a System?"
// Frontend-only static content, told as a scroll-led lesson:
// EXPLAIN (parts / connections / goal) -> SHOW (the bicycle story) ->
// EXPERIENCE (break the bicycle, run + break the todo system) ->
// UNDERSTAND (build it, judge it, see it everywhere, final challenge).
// No jargon before the WHY; every idea gets a visual first.

export const WHAT_IS_A_SYSTEM_LESSON = {
  id: "what-is-a-system",
  title: "What is a System?",

  intro: {
    heading: "A system is parts that work together - on purpose.",
    paragraphs: [
      "A system is a set of connected parts working together toward a goal.",
      "Not a pile of pieces, not a list of names - parts that pass work to each other until something real gets done.",
    ],
    definition:
      "A system is a set of connected parts working together toward a goal.",
    cards: [
      {
        id: "parts",
        icon: "🧩",
        name: "Parts",
        body: "Each piece does one small job.",
        bike: "🚲 frame, pedals, chain, wheels",
        app: "📱 Frontend, Backend, Database",
      },
      {
        id: "connections",
        icon: "🔗",
        name: "Connections",
        body: "How one part passes work to the next.",
        bike: "🚲 the chain carries your push to the wheel",
        app: "📱 your tap travels Frontend → Backend → Database",
      },
      {
        id: "goal",
        icon: "🎯",
        name: "Goal",
        body: "What the system exists to do. No goal, no system.",
        bike: "🚲 carry you somewhere",
        app: "📱 save and manage your todos",
      },
    ],
  },

  rule: {
    heading: "The simple rule",
    body: "Every system - bicycle, kitchen, or app - follows one shape:",
    steps: [
      { id: "parts", icon: "🧩", label: "PARTS" },
      { id: "connections", icon: "🔗", label: "CONNECTIONS" },
      { id: "goal", icon: "🎯", label: "GOAL" },
    ],
    equals: "✨ SYSTEM",
    note: "Take any one away and you are back to a pile of parts.",
  },

  story: {
    heading: "Watch a bicycle become a system",
    body: "The story plays as you read it. Parts light up, the push travels between them, and the goal finally happens.",
    svgLabel: "A bicycle telling its story",
    frames: [
      { hot: ["frame"], line: "The frame holds every part in place." },
      { hot: ["pedals"], line: "The pedals take your push." },
      { hot: ["chain"], line: "The chain carries the push." },
      { hot: ["wheel"], line: "The wheel turns push into movement." },
      {
        hot: ["handlebar"],
        line: "The handlebar keeps it aimed at the goal.",
      },
      { hot: ["pedals"], line: "The pedal does not move the bicycle alone." },
      { hot: ["pedals", "chain"], line: "The pedal moves the chain." },
      {
        hot: ["chain", "wheel"],
        line: "The chain turns the wheel.",
        spin: true,
      },
      {
        hot: ["frame", "pedals", "chain", "wheel", "handlebar"],
        line: "The bicycle moves.",
        spin: true,
        travel: true,
      },
      { line: "That's a system.", done: true },
    ],
    idle: "The story starts itself when you scroll here - or press Play.",
    done: "Parts + connections + goal = one system working.",
    legend: "glow = the part we are talking about",
    after:
      "That is a system. Now take one part away and watch it stop.",
  },

  remove: {
    heading: "Take one part out - watch it fail",
    body: "Pull a piece out of the bicycle. It tries to ride without it - and tells you exactly what was lost.",
    parts: [
      { id: "wheel", name: "Wheel", emoji: "🛞" },
      { id: "chain", name: "Chain", emoji: "⛓️" },
      { id: "pedals", name: "Pedal", emoji: "⚙️" },
      { id: "handlebar", name: "Handlebar", emoji: "🧭" },
    ],
    svgLabel: "A bicycle with removable parts",
    failTitle: "✕ The ride failed",
    failTexts: {
      wheel: "Without a wheel nothing can roll - movement is simply impossible.",
      chain:
        "The pedals spin, the wheel sits still - the connection between parts is cut.",
      pedals: "Your push never enters the bicycle - nothing can move it.",
      handlebar:
        "It moves - but nobody can steer it. A system you cannot control fails too.",
    },
    idle: "All five parts in place. Remove one to hear what it was for.",
    restored: "The bicycle is whole again - every part had a job.",
    teach:
      "Three removals, three failures - the bicycle needed every one of them. Remove a part, lose the system.",
    hint: "Pull out three different parts - each one fails in its own way.",
    restore: "Restore all",
    legend: "faded = the part you removed",
  },

  transition: {
    heading: "The same shape, now in software",
    body: "The todo app is built like the bicycle: parts, connections, one goal. Watch the bike become the app.",
    from: { icon: "🚲", name: "Bicycle", sub: "pedals → chain → wheel" },
    to: [
      {
        icon: "🖥️",
        name: "Frontend",
        sub: "like the pedals - where your push enters",
      },
      {
        icon: "⚙️",
        name: "Backend",
        sub: "like the chain - carries and does the work",
      },
      { icon: "🗄️", name: "Database", sub: "remembers the result" },
    ],
    lines: [
      "Your tap enters at the Frontend.",
      "The Frontend passes it to the Backend.",
      "The Database remembers the todo.",
      "Three parts, two connections, one goal: your todo is saved.",
    ],
  },

  bridge:
    "Same rules in software. Watch one todo travel through three parts - then switch one off.",

  todo: {
    heading: "One todo through three parts",
    body: "Press Add Todo and watch the message travel. Then switch a part off and try again - the failure tells you what that part was for.",
    svgLabel: "The todo system, stacked",
    user: { icon: "🙋", name: "You", sub: "the user" },
    nodes: [
      { id: "frontend", name: "Frontend", emoji: "🖥️", sub: "the screen" },
      { id: "backend", name: "Backend", emoji: "⚙️", sub: "the worker" },
      { id: "database", name: "Database", emoji: "🗄️", sub: "the notebook" },
    ],
    run: "▶ Add Todo",
    busy: "● Working…",
    reset: "↻ Reset",
    toggles: [
      { id: "frontend", label: "Disable Frontend" },
      { id: "backend", label: "Disable Backend" },
      { id: "database", label: "Disable Database" },
    ],
    idle:
      "All three parts are ON. Press Add Todo to send one todo through the system.",
    hint:
      "Send one todo through, then switch a part off and try again - the failure names the missing part.",
    beats: [
      "The frontend receives your action.",
      "The frontend sends the request to the backend.",
      "The database remembers the todo.",
      "The result travels back to the frontend.",
    ],
    done: "The parts worked together to achieve the goal.",
    appears: "TODO APPEARS",
    item: "✅ Buy milk",
    saved: "📝 saved",
    work: "↩ working on it...",
    failTitle: "✕ The trip failed",
    failLine: "Todo was not saved.",
    failTexts: {
      frontend: "No screen - your action can never enter the system.",
      backend: "Nobody does the work - the request just sits there.",
      database: "Nothing remembers it - close the tab and it is gone.",
    },
    packetOut: "your todo",
    packetBack: "result",
    on: "ON",
    off: "OFF",
    disabledNote: "switched off - press it again to bring the part back",
  },

  build: {
    heading: "Build a system from scratch",
    body: "Three parts, zero connections - still a pile. Click two parts to wire them together, in the direction the work flows.",
    svgLabel: "System builder",
    nodes: [
      {
        id: "frontend",
        name: "Frontend",
        emoji: "🖥️",
        role: "the screen you use",
      },
      { id: "backend", name: "Backend", emoji: "⚙️", role: "the worker" },
      { id: "database", name: "Database", emoji: "🗄️", role: "the notebook" },
    ],
    chips: ["Frontend → Backend", "Backend → Database"],
    labels: {
      start: "Click the part where the work starts.",
      selected: "Now click the part it should connect to.",
      wrongStart: "Start where YOU touch it - the Frontend.",
      wrongNext:
        "The Frontend is already wired - next comes the Backend, the worker.",
      wrongPair:
        "Not like that - the work flows Frontend → Backend → Database.",
      linked: "🔗 Connected - one more to go.",
      next: "One more connection: Backend → Database.",
      solved: "System ready",
      solvedBody: "Three parts, two connections, one goal.",
      idleRun: "The system is wired. Press RUN SYSTEM to send one todo through it.",
    },
    reset: "↻ Start over",
    run: "▶ RUN SYSTEM",
    runBusy: "● Running…",
    runBeats: [
      "Your tap enters at the Frontend.",
      "The Backend does the work.",
      "The Database remembers the todo.",
      "The result is back on your screen.",
    ],
    runDone:
      "🎉 The system worked - one todo, three parts, two connections, one goal.",
    legend: "dashed = not connected yet",
  },

  check: {
    heading: "Is this a system?",
    intro: "Parts, connections, goal - judge each one. A wrong pick tells you why.",
    items: [
      {
        id: "bike",
        prompt: "A bicycle, assembled and ready to ride.",
        answer: true,
        right: "Yes! Parts connected, working together - one goal: carry you.",
        wrong:
          "Look again: its parts are connected and it has one clear goal. It IS a system.",
      },
      {
        id: "pile",
        prompt: "A box of bicycle parts on the garage floor.",
        answer: false,
        right:
          "Correct - same pieces as the bicycle, but nothing is connected. Still a pile.",
        wrong:
          "Not yet - the parts exist, but nothing is connected, so nothing works together.",
      },
      {
        id: "sand",
        prompt: "A pile of sand.",
        answer: false,
        right: "Correct - no parts doing jobs, no connections, no goal.",
        wrong:
          "A pile has no parts doing jobs and no connections - the opposite of a system.",
      },
    ],
    yes: "Yes, it is a system",
    no: "No, it is not",
    solved: "Three for three. Now watch a pile become a system.",
    bubble:
      "Only connections turn the same pieces into something that works - parts, connections, goal, or nothing at all.",
    transform: {
      from: { icon: "📦", name: "Box of parts", sub: "parts, no connections" },
      steps: ["+ connections", "+ one goal"],
      to: { icon: "✨", name: "SYSTEM", sub: "parts + connections + goal" },
    },
  },

  examples: {
    heading: "Systems everywhere",
    hint: "Tap each card - find its parts, its connections, and its goal.",
    done: "You just analyzed three systems without writing a line of code.",
    equation: ["🧩 PARTS", "🔗 CONNECTIONS", "🎯 GOAL"],
    equals: "🧠 SYSTEM",
    cards: [
      {
        id: "bike",
        emoji: "🚲",
        name: "Bicycle",
        animIcon: "🛞",
        anim: "spin",
        parts: "frame, pedals, chain, wheels",
        connections: "the pedals drive the chain; the chain turns the wheel",
        goal: "carry you somewhere",
      },
      {
        id: "kitchen",
        emoji: "🍳",
        name: "Restaurant",
        animIcon: "♨️",
        anim: "wait",
        parts: "orders, cook, stove, plates",
        connections: "the ticket passes order → cook → plate",
        goal: "turn an order into a meal",
      },
      {
        id: "todo",
        emoji: "✅",
        name: "Todo app",
        animIcon: "⚙️",
        anim: "spin",
        parts: "Frontend, Backend, Database",
        connections: "your tap travels Frontend → Backend → Database",
        goal: "save and manage your todos",
      },
    ],
  },

  final: {
    heading: "Final challenge: build it, then run it",
    body: "No hints this time. Wire the three parts together, press RUN SYSTEM, and watch one todo make the whole trip.",
    done: "You built it, you wired it, you ran it - that is a system.",
  },

  summary: {
    heading: "The basic idea",
    body: "You started this lesson with a box of parts. Now you can spot the difference between a pile and a system - anywhere.",
    definitionHeading: "The formal definition - now it should feel obvious:",
    definition:
      "A system is a set of connected parts working together toward a goal.",
    stackCaption: "Parts + connections + goal →",
    stack: [
      { id: "parts", icon: "🧩", label: "Parts" },
      { id: "links", icon: "🔗", label: "Connections" },
      { id: "goal", icon: "🎯", label: "Goal" },
      { id: "system", icon: "✨", label: "SYSTEM" },
    ],
    callback:
      "You saw a bicycle and a todo app break the moment a part went missing. Now you know WHY a system works: parts, connections, and a goal. That is system design - and everything else in this course builds on it.",
    replay: "↻ Replay lesson",
    back: "← Back to Fundamentals",
  },
};
