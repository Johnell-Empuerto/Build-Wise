// System Design - Level 1, Lesson 2: "What is a System?"
// Frontend-only static content, fourteen interactive stages:
// bicycle (real world) -> parts -> run -> break -> goal ->
// morph to software -> todo flow -> break the app -> connections ->
// builder -> goal quiz -> real systems -> final challenge -> finale.
// No jargon before the WHY; every idea gets a visual first.

export const WHAT_IS_A_SYSTEM_LESSON = {
  id: "what-is-a-system",
  title: "What is a System?",

  stages: [
    { id: "intro", label: "The Box of Parts", chip: "See it" },
    { id: "parts", label: "Meet the Parts", chip: "Understand it" },
    { id: "together", label: "Working Together", chip: "See it work" },
    { id: "remove", label: "Break the Bicycle", chip: "Learn from mistakes" },
    { id: "goal", label: "The Goal", chip: "Understand it" },
    { id: "morph", label: "From Bike to App", chip: "Connect it" },
    { id: "flow", label: "The Todo System", chip: "See it work" },
    { id: "todoBreak", label: "Break the App", chip: "Learn from mistakes" },
    { id: "connections", label: "Connections Matter", chip: "Understand it" },
    { id: "builder", label: "Build a System", chip: "Build it" },
    { id: "goalQuiz", label: "Find the Goal", chip: "Learn from mistakes" },
    { id: "examples", label: "Systems Everywhere", chip: "See it" },
    { id: "final", label: "Final Challenge", chip: "Explain it" },
    { id: "summary", label: "Summary", chip: "Wrap up" },
  ],

  intro: {
    heading: "A system is parts that work together - on purpose.",
    definition:
      "A system is a set of connected parts working together toward a goal.",
    question:
      "A bicycle lies in pieces on the garage floor: frame, wheel, chain, pedals, brakes. Is it a system yet?",
    tease: "Assemble it - then watch the answer appear.",
    assembled:
      "Same parts - now they are connected. That is the difference.",
    pileNote:
      "A pile of parts cannot carry anyone anywhere. Order and connection are the whole trick.",
    assemble: "Assemble the bicycle",
    disassemble: "Take it apart",
    svgLabel: "A bicycle made of five parts",
  },

  parts: {
    heading: "Every part has one small job",
    hint: "Tap each part to hear its story.",
    done: "You just explored all five parts - each one does a small job alone.",
    items: [
      {
        id: "frame",
        name: "Frame",
        emoji: "🏗️",
        what: "Holds every other part in place.",
        analogy:
          "The skeleton of the bike. Without it nothing has anything to attach to.",
      },
      {
        id: "wheel",
        name: "Wheel",
        emoji: "🛞",
        what: "Rolls you forward - the part that touches the road.",
        analogy:
          "The final performer: all the effort ends up here, turned into movement.",
      },
      {
        id: "chain",
        name: "Chain",
        emoji: "⛓️",
        what: "Carries your pedaling to the wheel.",
        analogy:
          "A conveyor belt between two machines - it does no work itself, it PASSES work along.",
      },
      {
        id: "pedals",
        name: "Pedals",
        emoji: "⚙️",
        what: "Takes the push from your feet.",
        analogy:
          "The entrance door: this is where your energy enters the system.",
      },
      {
        id: "brakes",
        name: "Brakes",
        emoji: "🛑",
        what: "Lets you stop safely.",
        analogy:
          "The safety net. The bike works without them... until the first hill.",
      },
    ],
  },

  together: {
    heading: "Alone a part does nothing - together they ride",
    body:
      "Press start and follow your own push through the chain to the wheel. Watch where the effort goes.",
    start: "Start the ride",
    again: "Ride again",
    busy: "● Riding…",
    idle: "Ready. Press start - your push begins at the pedal.",
    beats: {
      push: "You push the pedal - your effort enters the system.",
      chain:
        "The chain carries the effort to the wheel - a CONNECTION doing its job.",
      roll: "The wheel turns - you move! The goal happens.",
    },
    done: "Goal met: you move! Parts + connections + a goal, working as one.",
    svgLabel: "A bicycle riding forward",
  },

  remove: {
    heading: "Take one part out - watch the ride fail",
    body:
      "Click a part to pull it out of the bicycle, then press Ride. Every failure teaches you what that part was really for.",
    start: "Ride",
    again: "Ride again",
    busy: "● Riding…",
    idle: "Bicycle intact. Remove a part, then press Ride.",
    beats: {
      push: "You push the pedal - your effort enters the system.",
      chain: "The chain carries the effort toward the wheel...",
      roll: "The wheel turns - you move!",
    },
    done: "Goal met: you move! The whole bicycle works.",
    failTitle: "✕ The ride failed",
    failTexts: {
      pedals:
        "The push never enters - without pedals your effort has nowhere to go.",
      chain:
        "Pedals spin, the wheel sits still - the connection between parts is cut.",
      wheel:
        "Nothing can roll - the goal of movement is simply impossible.",
      brakes:
        "It moves - but you cannot stop it. Reaching a goal dangerously is not working.",
    },
    parts: [
      {
        id: "wheel",
        name: "Wheel",
        emoji: "🛞",
        off: "No rolling, no movement. The goal cannot be met.",
      },
      {
        id: "chain",
        name: "Chain",
        emoji: "⛓️",
        off: "You pedal and the wheel just sits there - the connection is gone.",
      },
      {
        id: "pedals",
        name: "Pedals",
        emoji: "⚙️",
        off: "Your energy has no way into the system.",
      },
      {
        id: "brakes",
        name: "Brakes",
        emoji: "🛑",
        off: "It moves but cannot stop - dangerous.",
      },
    ],
    restored:
      "The bicycle is whole again and the ride succeeds - you just broke a system and fixed it.",
    gateHint: "Take a part out, press Ride, then put it back and ride again.",
    svgLabel: "A bicycle with removable parts",
  },

  goal: {
    heading: "Three questions separate a pile from a system",
    body:
      "Ask them about the bicycle in order. Press trace and follow the answers.",
    trace: "Trace the goal",
    steps: [
      {
        id: "parts",
        title: "🧩 Do parts exist?",
        body: "Five pieces, each with one small job.",
      },
      {
        id: "together",
        title: "🔗 Do they work together?",
        body: "Connections pass your effort from piece to piece.",
      },
      {
        id: "goal",
        title: "🎯 Is there a goal?",
        body: "All that passing adds up to one result: you move.",
      },
    ],
    done:
      "Yes, yes, and yes - three answers in that order. THAT is what you just watched, not a pile.",
    gateHint: "Press trace to follow the three answers.",
  },

  morph: {
    heading: "Now point the same idea at software",
    body:
      "The todo app from Lesson 1 has the same shape as the bicycle. Press the button and watch the bicycle become the app.",
    button: "Connect it to software",
    cards: [
      {
        id: "frontend",
        name: "Frontend",
        emoji: "🖥️",
        bike: "Like the pedals",
        body: "Where YOU push - type, tap, click. Input enters here.",
      },
      {
        id: "backend",
        name: "Backend",
        emoji: "⚙️",
        bike: "Like the chain",
        body: "Carries your push and does the work behind the scenes.",
      },
      {
        id: "database",
        name: "Database",
        emoji: "🗄️",
        bike: "Something bikes don't have",
        body: "A notebook that remembers - your todos from Lesson 1.",
      },
    ],
    done:
      "The todo app is a system too: parts, connections, and one goal - save and manage your todos.",
    gateHint: "Press the button to morph the bicycle into the app.",
  },

  flow: {
    heading: "Watch the todo system work - one message, three parts",
    body:
      "Same trip you traced in Lesson 1, seen through the system lens: three parts, two connections, one goal.",
    play: "Play the trip",
    busy: "● Working…",
    reset: "↻ Reset",
    idle: "Press Play and watch one message make the whole trip.",
    beats: [
      "The screen takes your message - Frontend shows and asks.",
      "The worker receives it - Backend does the work.",
      "The notebook writes it down - Database remembers.",
      "The answer travels back - the screen can show it.",
    ],
    done: "Trip complete: three parts, two connections, one goal met.",
    failTitle: "✕ The trip failed",
    savedLabel: "✓ saved",
  },

  todoBreak: {
    heading: "Break the software system now",
    body:
      "Pull a part out of the app, then press Add a todo - watch exactly where the trip dies.",
    add: "Add a todo",
    busy: "● Working…",
    reset: "↻ Reset",
    idle: "All three parts in place. Remove one, then press Add a todo.",
    beats: [
      "The screen takes your message - Frontend shows and asks.",
      "The worker receives it - Backend does the work.",
      "The notebook writes it down - Database remembers.",
      "The answer travels back - the screen can show it.",
    ],
    done:
      "All three parts are back - the trip completes. You just proved what breaks a software system.",
    failTitle: "🔴 MISSING",
    failTexts: {
      frontend:
        "No screen - your message can never even enter the system.",
      backend:
        "The message arrives but nobody does the work - it just sits there.",
      database:
        "The work happens but nothing remembers it - close the tab and it is gone.",
    },
    parts: [
      { id: "frontend", name: "Frontend", emoji: "🖥️" },
      { id: "backend", name: "Backend", emoji: "⚙️" },
      { id: "database", name: "Database", emoji: "🗄️" },
    ],
    gateHint: "Take a part away, press Add a todo, then put it back and retry.",
    svgLabel: "The todo app system diagram",
  },

  connections: {
    heading: "Parts are not enough - they must be connected",
    body:
      "Here are the three parts - but someone cut the wires. Nothing flows. Click each broken link to repair it.",
    waitText:
      "Parts sit in place - but with cut links, nothing flows. Connect them.",
    connectA: "Connect Frontend → Backend",
    connectB: "Connect Backend → Database",
    connectedLabel: "🔗 Connected",
    play: "Run the message",
    busy: "● Working…",
    reset: "↻ Reset",
    idle: "Press Run the message once both links are repaired.",
    beats: [
      "The screen takes your message - Frontend shows and asks.",
      "The worker receives it - Backend does the work.",
      "The notebook writes it down - Database remembers.",
      "The answer travels back - the screen can show it.",
    ],
    done:
      "Connected! The message flows - two parts, one connection, one result.",
    failTitle: "✕ The trip failed",
    linkDone: {
      a: "Connected! The Frontend can now reach the Backend.",
      b: "Connected! The Backend can now reach the Database.",
    },
    gateHint: "Repair both broken links to continue.",
    svgLabel: "The todo app system with repairable links",
  },

  builder: {
    heading: "Build a system from scratch",
    body:
      "No diagram yet - just pieces. Place Frontend, Backend, and Database in the right order, then connect them.",
    parts: [
      {
        id: "frontend",
        name: "Frontend",
        emoji: "🖥️",
        role: "the screen you use",
      },
      { id: "backend", name: "Backend", emoji: "⚙️", role: "the worker" },
      { id: "database", name: "Database", emoji: "🗄️", role: "the notebook" },
    ],
    links: [
      { id: "a", label: "Frontend → Backend" },
      { id: "b", label: "Backend → Database" },
    ],
    labels: {
      wrongFirst:
        "Not yet - start where YOU touch it: the Frontend.",
      wrongNext:
        "The screen cannot work alone - next comes the Backend, the worker.",
      noLinks:
        "Something is missing: the parts are placed, but nothing is connected.",
      linkWrongOrder:
        "Connect Frontend → Backend first - that is where the message goes next.",
      solved:
        "A complete system: three parts, two connections, one goal.",
      missingNow: "Something is missing - place:",
      placeFirst: "Place the three parts first, then connect them.",
    },
    reset: "Start over",
    gateHint: "Place all three parts and connect them to continue.",
    svgLabel: "System builder slots",
  },

  goalQuiz: {
    question: "Quick check: what is the GOAL of a todo app?",
    options: [
      {
        id: "save",
        text: "Save and manage Todos.",
        correct: true,
        teach:
          "Exactly! The screen, the worker, the database - all three exist to make THAT happen.",
      },
      {
        id: "screen",
        text: "Show a beautiful screen.",
        correct: false,
        teach:
          "The screen is a PART, not a goal. A gorgeous screen that forgets your todos fails the system.",
      },
      {
        id: "database",
        text: "Store everything in a database.",
        correct: false,
        teach:
          "The database is also just a part. A goal is what the whole system achieves for someone.",
      },
      {
        id: "errors",
        text: "Run without errors.",
        correct: false,
        teach:
          "Not wrong, but vague: a system can run perfectly and still do nothing useful. Aim at what the user gets.",
      },
    ],
    retryHint:
      "Pick an answer, press Check, and learn from the feedback. You can try again!",
    tip: "Whenever you see parts, ask: what are they FOR? The answer is the goal.",
  },

  examples: {
    heading: "Three systems you already know",
    hint: "Tap each card - name its parts, connections, and goal.",
    done:
      "You just analyzed three real systems without writing a line of code.",
    equation: ["🧩 PARTS", "🔗 CONNECTIONS", "🎯 GOAL"],
    equals: "🧠 SYSTEM",
    cards: [
      {
        id: "traffic",
        name: "Traffic light",
        emoji: "🚦",
        parts: "bulbs, timer, wiring, power",
        connections: "the timer switches the current from one bulb to the next",
        goal: "alternate who may go - without crashes",
      },
      {
        id: "orchestra",
        name: "Orchestra",
        emoji: "🎻",
        parts: "players, instruments, the score",
        connections: "everyone follows the conductor's beat",
        goal: "make ONE song, together",
      },
      {
        id: "kitchen",
        name: "Restaurant kitchen",
        emoji: "🍳",
        parts: "orders, cook, stove, plates",
        connections: "the ticket passes cook → stove → plate",
        goal: "turn an order into a meal",
      },
    ],
    gateHint: "Explore all three cards to continue.",
  },

  final: {
    question: "Final challenge: which of these is a SYSTEM?",
    options: [
      {
        id: "bike",
        text: "A fully assembled bicycle.",
        correct: true,
        teach:
          "Yes! Parts connected, working together, one clear goal: carry you.",
      },
      {
        id: "box",
        text: "A box of bicycle parts.",
        correct: false,
        teach:
          "Same pieces - but nothing is connected, so nothing works together. Still a pile.",
      },
      {
        id: "sand",
        text: "A pile of sand.",
        correct: false,
        teach:
          "A pile has no parts doing jobs and no connections - the opposite of a system.",
      },
      {
        id: "chain",
        text: "A single bicycle chain, alone.",
        correct: false,
        teach:
          "One part by itself cannot be a system. A chain only matters inside a bike, connected to pedals and a wheel.",
      },
    ],
    retryHint:
      "Pick an answer, press Check, and learn from the feedback. You can try again!",
    tip: "Look for the three answers: parts, working together, a goal.",
  },

  summary: {
    congrats:
      "You can now spot a system anywhere - and take one apart in your head.",
    finale: [
      { id: "parts", icon: "🧩", label: "Parts" },
      { id: "links", icon: "🔗", label: "Connections" },
      { id: "goal", icon: "🎯", label: "Goal" },
      { id: "system", icon: "✨", label: "SYSTEM" },
    ],
    finaleCaption: "Parts + connections + goal →",
    definitionHeading:
      "The formal definition - now it should feel obvious:",
    definition:
      "A system is a set of connected parts working together toward a goal.",
    callback:
      "In Lesson 1 you traced one todo through a real app. Now you know WHY that trip works: parts, connections, and a goal. That is system design - and everything else in this course builds on it.",
    cards: [
      {
        title: "Parts",
        body: "Each piece does one small job.",
      },
      {
        title: "Connections",
        body: "How pieces pass work and information - this is what makes them a whole.",
      },
      {
        title: "Goal",
        body: "What the system exists to do. No goal, no system.",
      },
      {
        title: "System",
        body: "Parts + connections + goal, working as one.",
      },
    ],
  },
};
