// System Design - Level 1, Lesson 5: "API"
// Frontend-only static content. Pays off the "pass window" tease from lesson
// 4: the messenger between frontend and backend finally gets a name. Uses
// FlowDiagram (You -> Frontend -> API -> Backend -> Database) for the trip,
// two QuickCheck scenarios for the guard teaching, and OrderChallenge for
// the full round trip. Scroll-led like lessons 3 and 4.

export const API_LESSON = {
  id: "api",
  title: "API",

  intro: {
    heading: "The hallway between the two rooms.",
    definition:
      "An API is a messenger with rules: it carries your request to the backend and brings the answer home.",
    body:
      "You met the split in the last lesson: the frontend shows, the backend decides. But how do they talk without touching each other? Every message between the two rooms travels through one hallway - an API (Application Programming Interface). The frontend never walks into the kitchen; it hands its note to the hallway, and the hallway decides whether the note is worth carrying.",
    analogy:
      "The restaurant waiter: you order through the waiter, the kitchen cooks through the waiter, and the plate comes back through the waiter. A guest never walks into the kitchen - and the waiter never lets a rude order through.",
    tease:
      "Watch a real request take the hallway, then try to sneak one past the guard.",
  },

  jobs: {
    heading: "What the API actually does",
    hint: "Tap each card for its story.",
    complete: "Carry, check, shape - that is the whole job of an API.",
    cards: [
      {
        id: "carry",
        name: "Carry",
        emoji: "📬",
        tagline: "Move the message from room to room.",
        analogy:
          "The waiter carrying the order slip to the kitchen and the plate back to the table - nobody else moves.",
        without:
          "Without a messenger, every screen must talk to every server directly - each app learning every secret of every other app.",
      },
      {
        id: "check",
        name: "Check",
        emoji: "🚪",
        tagline: "Look at every request before it enters.",
        analogy:
          "The waiter reads the ticket: right table? right order? Bad ticket, no kitchen.",
        without:
          "No check at the door means anyone can ask for anything - even other people's todos.",
      },
      {
        id: "shape",
        name: "Shape",
        emoji: "🧾",
        tagline: "Put the answer in a shape the screen understands.",
        analogy:
          "The waiter plates the food and says it in words you understand - the kitchen never hands you a raw pan.",
        without:
          "No shared shape means the screen gets a blob it cannot draw - every app would need its own private translator.",
      },
    ],
  },

  trip: {
    heading: "Watch one request take the hallway",
    body:
      "You ask for your todo list. Follow the request down through the API, and the answer back up - click any part to hear what it does.",
    hops: [
      {
        id: "you",
        name: "You",
        emoji: "🧑‍💻",
        tagline: "the one who asks",
        accent: "blue",
        explanation:
          "Everything starts with a wish: \"show me my todos.\" Your tap is the spark.",
        analogy: "A hungry guest at the table.",
      },
      {
        id: "frontend",
        name: "Frontend",
        emoji: "🖥️",
        tagline: "catches the tap, draws the answer",
        accent: "sky",
        explanation:
          "The frontend turns your tap into a request - a message shaped like: GET /todos. It can show and send, but it cannot decide.",
        analogy: "The guest speaking the order out loud.",
      },
      {
        id: "api",
        name: "API",
        emoji: "🚪",
        tagline: "the hallway with a guard",
        accent: "violet",
        explanation:
          "The API reads the request: who is asking? is it allowed? Only then does it carry the note onward - and it carries the answer back the same way.",
        analogy: "The waiter checking the ticket before the kitchen sees it.",
      },
      {
        id: "backend",
        name: "Backend",
        emoji: "⚙️",
        tagline: "does the work you never see",
        accent: "fuchsia",
        explanation:
          "The backend follows the rules, asks the database, and decides what the answer is.",
        analogy: "The kitchen cooking the order.",
      },
      {
        id: "database",
        name: "Database",
        emoji: "🗄️",
        tagline: "remembers everything",
        accent: "cyan",
        explanation:
          "The notebook fetches your todos - the answer starts its trip back up the hallway.",
        analogy: "The pantry where the ingredients live.",
      },
    ],
    requestLabel: "REQUEST - GET /todos",
    responseLabel: "RESPONSE - your todos",
    completeText: "the answer reached your screen - the API carried both ways",
  },

  guard: {
    heading: "When the API says no",
    body:
      "The API is a guard, not a wall. Try both requests below - a wrong call teaches you what the door actually checks.",
    counterDone: "requests handled correctly",
    complete:
      "Both requests handled - the door waved one through and turned one away.",
    a: {
      question:
        "Ana is logged out. A page sends the API this request: \"show me Ana's todos.\" What should the API do?",
      options: [
        {
          id: "carry",
          text: "Carry it - the backend will sort it out",
          correct: false,
          teach:
            "The API checks BEFORE the backend works. Carrying bad requests wastes the kitchen's time - and the rules must hold even when nobody is watching. The API refuses at the door; the backend never hears it.",
        },
        {
          id: "refuse",
          text: "Refuse it at the door",
          correct: true,
          teach:
            "Yes! One look at who is asking, and the request is turned away with a short answer: \"not allowed.\" The backend never broke a sweat.",
        },
        {
          id: "database",
          text: "Ask the database first",
          correct: false,
          teach:
            "The database is not invited to this conversation. It remembers data - it does not decide who may ask. The door is the API's job.",
        },
      ],
      retryHint:
        "Pick what the door should do - wrong answers show you what the guard sees.",
    },
    b: {
      question:
        "Ana is logged in. Her own screen sends: \"show me MY todos.\" What should the API do?",
      options: [
        {
          id: "block",
          text: "Block it - the API should stop everything",
          correct: false,
          teach:
            "A guard, not a wall. If every request died at the door, nobody could ever use the app - the guard's job is to wave the right ones through.",
        },
        {
          id: "carry",
          text: "Carry it to the backend",
          correct: true,
          teach:
            "Exactly - right table, right ticket. The API passes the request along and carries the answer home.",
        },
        {
          id: "skip",
          text: "Answer it without the backend",
          correct: false,
          teach:
            "The API carries messages - the backend does the work. Skip the backend and there is nothing to fetch the todos; the hallway is not the kitchen.",
        },
      ],
      retryHint:
        "One request should pass and one should not - that is what a guard is for.",
    },
  },

  order: {
    heading: "Follow the answer home",
    body:
      "Five beats, one hallway - click them in the order it really happens.",
    prompt:
      "Your todos are on their way back. Build the whole trip - request down, answer back.",
    reset: "Start over",
    solved:
      "Five beats through one hallway: the frontend asks, the API checks and carries, the backend works, and the frontend shows.",
    steps: [
      {
        id: "send",
        label: "Frontend: send the request",
        why:
          "The screen catches your tap first - nothing moves until the frontend asks.",
      },
      {
        id: "check",
        label: "API: check the request",
        why:
          "Before any work happens, the door reads the ticket: who is asking, and is it allowed?",
      },
      {
        id: "work",
        label: "Backend: do the work",
        why:
          "Rules, queries, memory - the real work happens behind the door.",
      },
      {
        id: "carry",
        label: "API: carry the answer back",
        why:
          "The answer returns through the hallway, shaped so the screen can understand it.",
      },
      {
        id: "show",
        label: "Frontend: show the result",
        why: "Only the frontend draws - your list appears with a check mark.",
      },
    ],
  },

  summary: {
    heading: "The Hallway",
    congrats: "You can now follow any request through its API!",
    cards: [
      {
        title: "API = the messenger",
        body:
          "Every message between frontend and backend travels the hallway - in, checked, and back out.",
      },
      {
        title: "The door checks first",
        body:
          "Who is asking? Is it allowed? The API answers before the backend lifts a finger.",
      },
      {
        title: "Both ways, one hallway",
        body:
          "Requests go in shaped; answers come back shaped. The screen never sees the kitchen.",
      },
      {
        title: "Guard, not a wall",
        body:
          "Rules pass, tricks refuse - and every refusal teaches the screen what went wrong.",
      },
    ],
    closing:
      "Every feature you build from here asks this same hallway a question: what travels through, what gets checked, and what comes home. Thinking in requests and answers is the habit the rest of this course builds on.",
  },
};
