// System Design - Level 1, Lesson 3: "Client and Server"
// Frontend-only static content. Continues the restaurant metaphor already
// introduced in the todo-app lesson (waiter = API, reserved for lesson 5).
// Here: the customer asks, the kitchen answers.

export const CLIENT_SERVER_LESSON = {
  id: "client-server",
  title: "Client and Server",

  stages: [
    { id: "intro", label: "Introduction", chip: "See it" },
    { id: "roles", label: "Meet the Roles", chip: "Understand it" },
    { id: "speak", label: "Who Speaks?", chip: "Interact with it" },
    { id: "check", label: "Quick Check", chip: "Learn from mistakes" },
    { id: "build", label: "Build the Conversation", chip: "Build it" },
    { id: "explain", label: "Explain Your Choice", chip: "Explain it" },
    { id: "summary", label: "Summary", chip: "Wrap up" },
  ],

  intro: {
    heading: "Every interaction online is the same two-step dance.",
    definition: "A client asks. A server answers.",
    body:
      "Open a website, check your email, play an online game - behind every single one of them sits the same pattern: something somewhere asks, something somewhere answers, and the one answering always waits its turn. Learn this pair and half of every architecture diagram you will ever see is already yours.",
    analogy:
      "A restaurant: you (the client) decide what you want and ask. The kitchen (the server) cooks it and hands it back. The kitchen never runs to your table to ask if you are hungry - it waits.",
    tease: "Two roles, one rule: whoever asks first.",
  },

  roles: {
    heading: "Two roles, one strict rule",
    hint: "Tap each card for its story.",
    complete: "Client asks, server answers - and the server waits its turn.",
    cards: [
      {
        id: "client",
        name: "Client",
        emoji: "🙋",
        tagline: "The one who asks.",
        analogy:
          "You at the restaurant: hungry, reading the menu, placing the order. The client knows what it wants and starts the conversation.",
        without:
          "If nobody ever asks, the server just stands there. (Idle servers are completely normal - they only work on demand.)",
      },
      {
        id: "server",
        name: "Server",
        emoji: "🍳",
        tagline: "The one who answers.",
        analogy:
          "The kitchen: stocked, staffed, ready - but it only cooks when an order actually arrives.",
        without:
          "If nobody ever answers, the client spins forever waiting for a reply it will never get.",
      },
      {
        id: "rule",
        name: "The Rule",
        emoji: "🔁",
        tagline: "Client speaks first - every time.",
        analogy:
          "The kitchen never comes to your table to ask whether you are hungry. It waits to be asked, then answers.",
        without:
          "Break the rule and nobody knows who is answering whom - the conversation collapses into noise.",
      },
    ],
  },

  sorter: {
    heading: "Who would say it?",
    body:
      "Six lines from a restaurant conversation. For each one, pick who says it: the Client or the Server. A wrong pick will tell you why.",
    solved:
      "Perfect - you can hear the difference now: wanting something is the client, delivering something is the server.",
    gateHint: "Place all six lines to continue.",
    statements: [
      {
        id: "order",
        text: "I'd like the pancakes, please.",
        role: "client",
        teach:
          "Servers do not place orders - this is someone ASKING for something, and asking is exactly the client's whole job.",
        why: "The client starts it by wanting something.",
      },
      {
        id: "delivery",
        text: "Order up - pancakes for table 4!",
        role: "server",
        teach:
          "Nobody is asking anything here - this is an ANSWER being handed over. Only a server produces answers.",
        why: "Delivering the result is the server answering.",
      },
      {
        id: "list",
        text: "Show me my todo list.",
        role: "client",
        teach:
          "Still a request: someone wants data shown to them. The one who wants is always the client - no exceptions.",
        why: "Wanting to see data means asking, and asking means client.",
      },
      {
        id: "todos",
        text: "Your todos: buy milk, walk the dog.",
        role: "server",
        teach:
          "This is data being handed BACK. Handing results back is the server's reply - it is not asking for anything.",
        why: "Only after being asked does a server hand over data.",
      },
      {
        id: "anyone",
        text: "Is anyone there? I need something.",
        role: "client",
        teach:
          "A server never wonders 'is anyone there?' - servers listen quietly; clients are the ones who reach out first.",
        why: "Only a client reaches out first.",
      },
      {
        id: "error",
        text: "Error: I don't understand that request.",
        role: "server",
        teach:
          "Even an error is still an ANSWER - the server only spoke because it was asked first. Errors do not make it the client.",
        why: "Errors count as answers: servers still wait for a question.",
      },
    ],
  },

  quiz: {
    question:
      "Your phone suddenly shows a message from a server you never contacted. What is odd about that?",
    options: [
      {
        id: "fine",
        text: "Nothing - servers can start conversations anytime.",
        correct: false,
        teach:
          "Not in request/response: servers wait. Messages that arrive unasked come from bots, notifications, or spam - not from a server answering YOU.",
      },
      {
        id: "wait",
        text: "Servers must wait for the client to ask first.",
        correct: true,
        teach:
          "Exactly! Client speaks, server answers - and the server's clock only starts after your request lands.",
      },
      {
        id: "phone",
        text: "Phones can only ever be servers.",
        correct: false,
        teach:
          "Roles are about asking vs answering, not devices. Your phone is a client when it fetches a page - and it can serve its own photos to your laptop too.",
      },
      {
        id: "short",
        text: "It would be fine if the message were shorter.",
        correct: false,
        teach:
          "Size has nothing to do with it. The rule is about who starts the conversation, not how long the words are.",
      },
    ],
    retryHint:
      "Pick an answer, press Check, and learn from the feedback. You can try again!",
  },

  build: {
    prompt:
      "Build one full conversation between a client and a server. Click the beats in order.",
    reset: "Start over",
    solved:
      "That is every client/server conversation ever: ask, receive, work, answer. Tiny website or huge online game - same four beats.",
    steps: [
      {
        id: "ask",
        label: "Client asks",
        why:
          "Every conversation starts with someone wanting something - the server stays silent until then.",
      },
      {
        id: "hear",
        label: "Server hears the ask",
        why:
          "You cannot answer a question you never received - hearing comes before acting.",
      },
      {
        id: "work",
        label: "Server does the work",
        why:
          "Now it prepares the reply: finds the data, checks the rules, cooks the pancakes.",
      },
      {
        id: "answer",
        label: "Server answers back",
        why:
          "The reply travels to whoever asked - skip this and the client waits forever.",
      },
    ],
  },

  explain: {
    prompt: "In your own words: why must the client speak first?",
    placeholder: "Type your answer here...",
    keywords: ["ask", "request", "first", "wait", "start"],
    checkButton: "Check my explanation",
    revealButton: "Show a model answer",
    passTitle: "Great explanation!",
    passBody:
      "You nailed the heartbeat of request/response: the server has nothing to say until someone asks.",
    coachTitle: "Almost - add one key idea.",
    coachBody:
      "Say that the server WAITS until a request comes, or that the client STARTS/asks first (words like: ask, request, first, wait, start).",
    modelAnswer:
      "Servers only answer - they have nothing to say until someone asks. The client starts the conversation by sending a request, so everything the server does comes after that. Otherwise the server would be guessing what you want.",
  },

  summary: {
    congrats: "You now know the two roles behind everything online!",
    cards: [
      {
        title: "Client asks",
        body:
          "Wants something, starts the conversation, judges the answer.",
      },
      {
        title: "Server answers",
        body:
          "Does the work and replies - but only ever after being asked.",
      },
      {
        title: "Roles, not devices",
        body:
          "Any machine can play either part. Your phone is a client to YouTube's servers, and a server when it shares photos with your laptop.",
      },
      {
        title: "One rule",
        body:
          "Client speaks first, server answers. Break it and the conversation breaks.",
      },
    ],
    closing:
      "Next, we split the pair by location: the frontend is the client you can see, the backend is the server you cannot - and the API is the messenger carrying their words. Same two roles, sharper names.",
  },
};
