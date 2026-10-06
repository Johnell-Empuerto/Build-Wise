// System Design - Level 1, Lesson 2: "What is a System?"
// Frontend-only static content. Same teaching philosophy as lesson 1:
// see it -> understand it -> interact -> make a mistake -> learn -> build ->
// explain. No jargon before the WHY; every idea gets an analogy.

export const WHAT_IS_A_SYSTEM_LESSON = {
  id: "what-is-a-system",
  title: "What is a System?",

  stages: [
    { id: "intro", label: "Introduction", chip: "See it" },
    { id: "anatomy", label: "Anatomy of a System", chip: "Understand it" },
    { id: "break", label: "Break It, Fix It", chip: "Interact with it" },
    { id: "check", label: "Quick Check", chip: "Learn from mistakes" },
    { id: "analyze", label: "Analyze It", chip: "Build it" },
    { id: "explain", label: "Explain Your Choice", chip: "Explain it" },
    { id: "summary", label: "Summary", chip: "Wrap up" },
  ],

  intro: {
    heading: "A system is parts that work together - on purpose.",
    definition:
      "A system is a set of connected parts working together toward a goal.",
    body:
      "A box of bicycle parts is not a system. Those same parts, bolted together with a chain linking pedals to the wheel - now they can carry you to school. Nothing new was added except order and connection. That transformation, pile into system, is what this lesson is about.",
    analogy:
      "Musicians in a hallway are a crowd. On stage, following one score, they are a symphony. Same people, different system.",
    tease: "First: the four things every system must have.",
  },

  anatomy: {
    heading: "Every system has exactly these four things",
    hint: "Tap each card to hear its story.",
    complete:
      "You just named the anatomy of every system - including software ones.",
    cards: [
      {
        id: "goal",
        name: "Goal",
        emoji: "🎯",
        tagline: "What the system exists to do.",
        analogy:
          "A bicycle's goal: carry you somewhere. Same parts in a garage are just metal - the goal is what makes them a bike.",
        without:
          "Without a goal you cannot even say whether the system is working - there is nothing to aim at.",
      },
      {
        id: "parts",
        name: "Parts",
        emoji: "🧩",
        tagline: "The pieces that do the work.",
        analogy:
          "Wheels, frame, chain, pedals, brakes - each does one small job, and none of them alone can carry you.",
        without:
          "A goal with no parts is just a wish. Somebody has to actually do the work.",
      },
      {
        id: "connections",
        name: "Connections",
        emoji: "🔗",
        tagline: "How parts pass work and information.",
        analogy:
          "The chain links your legs to the wheel. Your push reaches the road only because parts pass it along.",
        without:
          "Parts that cannot reach each other are a pile again - everyone works alone and the goal never happens.",
      },
      {
        id: "boundary",
        name: "Boundary",
        emoji: "🚧",
        tagline: "What is inside the system - and what is not.",
        analogy:
          "The bike is the system. You, the rider, are outside it: you give it input (pedaling) and it gives you output (movement).",
        without:
          "With no boundary, nobody knows what belongs - does the road count? the weather? You cannot even draw the diagram.",
      },
    ],
  },

  workbench: {
    heading: "Your turn: break the bicycle - then fix it.",
    body:
      "Click parts to pull them out of the system. Watch what the bike can and cannot do anymore. Then put it back together.",
    goalLabel: "Goal: carry you somewhere",
    states: {
      working: {
        icon: "🟢",
        title: "Working - goal met",
        body:
          "Every part plays its role, the connections carry your effort, and the goal is reached.",
      },
      risky: {
        icon: "🟠",
        title: "Risky - goal met unsafely",
        body:
          "It still moves... but without brakes you cannot stop it. A system that meets its goal dangerously is not finished.",
      },
      broken: {
        icon: "🔴",
        title: "Broken - goal unreachable",
        body:
          "Something the goal depends on is missing. Effort goes in and nothing useful comes out.",
      },
    },
    restored:
      "The bike is whole again - and you just proved what breaks a system. That is systems thinking.",
    gateHint: "Try pulling out a part, then put everything back.",
    parts: [
      {
        id: "frame",
        name: "Frame",
        emoji: "🏗️",
        on: "Holds every other part in place.",
        off: "Nothing to attach parts to - it is scrap metal, not a bike.",
      },
      {
        id: "wheel",
        name: "Wheel",
        emoji: "🛞",
        on: "Rolls you forward.",
        off: "No rolling, no movement. The goal simply cannot be met.",
      },
      {
        id: "chain",
        name: "Chain",
        emoji: "⛓️",
        on: "Passes your pedaling to the wheel.",
        off:
          "You pedal and the wheel just sits there - the connection between parts is gone.",
      },
      {
        id: "pedals",
        name: "Pedals",
        emoji: "⚙️",
        on: "Takes the push from your feet.",
        off: "Your energy has no way into the system.",
      },
      {
        id: "brakes",
        name: "Brakes",
        emoji: "🛑",
        on: "Lets you stop safely.",
        off: "It moves but cannot stop - dangerous.",
      },
    ],
  },

  quiz: {
    question: "A box of bicycle parts sits in your garage. Is it a system?",
    options: [
      {
        id: "yes-parts",
        text: "Yes - it has all the parts.",
        correct: false,
        teach:
          "Parts alone are a pile, not a system. In the box nothing is connected, so the parts cannot DO anything together - they will never move you anywhere.",
      },
      {
        id: "no-together",
        text: "No - the parts do not work together toward a goal.",
        correct: true,
        teach:
          "Exactly! Parts + connections + a shared goal = system. The box has only the first ingredient.",
      },
      {
        id: "yes-machine",
        text: "Yes - bicycles are machines, and machines are systems.",
        correct: false,
        teach:
          "Close, but backwards: a machine is not automatically a system. Take it apart and it stops being one - the working-together is what counts.",
      },
      {
        id: "no-electric",
        text: "No - it has no electricity in it.",
        correct: false,
        teach:
          "Systems are not about electricity. Digestion, a bicycle, a choir, a traffic light - plenty of systems never see a volt.",
      },
    ],
    retryHint:
      "Pick an answer, press Check, and learn from the feedback. You can try again!",
  },

  build: {
    prompt:
      "You meet a system you have never seen before - a kitchen, a game, an app. How do you understand it? Click the steps in order.",
    reset: "Start over",
    solved:
      "That is the universal analysis routine: goal, parts, connections, boundary. It works on kitchens, companies, and codebases alike.",
    steps: [
      {
        id: "goal",
        label: "Find the goal",
        why:
          "The goal tells you what 'working' even means - start here or you are only naming objects.",
      },
      {
        id: "parts",
        label: "List the parts",
        why:
          "Now you know which pieces matter: keep the ones that actually serve the goal.",
      },
      {
        id: "connections",
        label: "Trace the connections",
        why:
          "Parts on their own do nothing - find how work and information travel between them.",
      },
      {
        id: "boundary",
        label: "Draw the boundary",
        why:
          "Last, decide what is inside the system and what is just environment (users, weather, other systems).",
      },
    ],
  },

  explain: {
    prompt:
      "In your own words: why is a box of bicycle parts NOT a system?",
    placeholder: "Type your answer here...",
    keywords: ["goal", "together", "connect", "purpose"],
    checkButton: "Check my explanation",
    revealButton: "Show a model answer",
    passTitle: "Great explanation!",
    passBody:
      "You linked parts to a shared goal - that is the heart of the definition.",
    coachTitle: "Almost - add one key idea.",
    coachBody:
      "Mention that the parts are not connected / do not work together, or that there is no goal (words like: goal, together, connect, purpose).",
    modelAnswer:
      "A box of parts has no goal being served and nothing is connected, so the pieces cannot work together to move anyone. A system needs connected parts cooperating toward a goal.",
  },

  summary: {
    congrats: "You can now spot a system anywhere - and take it apart on paper.",
    cards: [
      {
        title: "Goal",
        body: "What the system exists to do. No goal, no system - just stuff.",
      },
      {
        title: "Parts",
        body: "The pieces, each doing a small job.",
      },
      {
        title: "Connections",
        body:
          "How parts pass work and information - this is what makes them a whole.",
      },
      {
        title: "Boundary",
        body:
          "What is inside the system, and what is outside feeding it input.",
      },
    ],
    closing:
      "Software systems are exactly this shape: screens, APIs, servers, databases - parts with connections and a goal. You already traced one in the todo app lesson. The rest of this course is learning to design such systems well.",
  },
};
