// System Design - Level 1, Lesson 3: "Client and Server"
// Frontend-only static content for a scroll-led lesson: explain the two
// roles, tell the burger story, transform it into software, then let the
// learner switch roles, answer a short check, and break + repair the
// connection. Every animation copy lives here.

function storyCopy(overrides = {}) {
  return {
    idle:
      "Ready - press Play, or keep scrolling and the story starts itself.",
    steps: [
      {
        title: "1. Client sends a request.",
        body:
          "Watch the glowing dot leave the client - that dot IS the request on its way.",
      },
      {
        title: "2. Server receives it.",
        body: "The request landed. The server lights up - it heard the ask.",
      },
      {
        title: "3. Server does some work.",
        body:
          "Now the server works: it checks rules, finds data, prepares the answer.",
      },
      {
        title: "4. Server sends a response.",
        body:
          "The answer glows back the other way - a response always returns to whoever asked.",
      },
      {
        title: "5. Client shows the result.",
        body:
          "The client got the response and shows it to the user. One full trip - done!",
      },
    ],
    waiting: {
      title: "⏳ Waiting...",
      body:
        "The server is not available. The client keeps waiting for an answer...",
    },
    fail: {
      title: "No response came back.",
      body:
        "The client asked, but the server did not answer. This is what \"the website is down\" feels like.",
    },
    done: "✓ Got a response!",
    ...overrides,
  };
}

export const CLIENT_SERVER_LESSON = {
  id: "client-server",
  title: "Client and Server",

  intro: {
    heading: "Client and Server",
    paragraphs: [
      "Almost every app you use needs to communicate with something else.",
      "For example, when you open a website, save a Todo, or log in, something has to receive your request and do some work.",
      "Two important roles are involved: the client and the server.",
    ],
  },

  whoClient: {
    heading: "What is a Client?",
    paragraphs: [
      "A client is the part of a system that asks for something.",
      "The client is usually the thing the user is using - the part that starts the conversation.",
    ],
    examples: ["💻 Web browser", "📱 Mobile app", "🖥️ Desktop app", "⌚ Smart watch"],
    exampleNote:
      "Example: you open your Todo app and ask to see your Todos. The app is acting as the client because it is asking for information.",
    visual: { you: "👤 YOU", client: "💻 CLIENT", line: "Give me my Todos" },
  },

  whoServer: {
    heading: "What is a Server?",
    paragraphs: [
      "A server is the part of a system that receives requests and does the work.",
      "It can check information, calculate something, save information, or send information back.",
    ],
    abilities: [
      "✔ Check information (like a password)",
      "✔ Calculate something",
      "✔ Save information",
      "✔ Send information back",
    ],
    example: {
      client: "💻 CLIENT",
      request: "Give me my Todos",
      server: "🖥️ SERVER",
      line: "The server receives the request and gets the Todos.",
    },
  },

  vs: {
    heading: "Client vs Server",
    clientCard: {
      icon: "💻",
      name: "CLIENT",
      tag: "ASKS",
      body: "Usually asks for something. It starts the conversation.",
    },
    serverCard: {
      icon: "🖥️",
      name: "SERVER",
      tag: "WORKS + ANSWERS",
      body: "Receives the request and provides an answer.",
    },
    loop: ["CLIENT", "SERVER", "CLIENT"],
    loopNote:
      "The client asks - the server answers - the client shows the result. Then it happens again.",
  },

  roles: {
    heading: "Client and Server are Roles",
    paragraphs: [
      "Client and server describe roles in a system - not permanent labels.",
      "The important question is not what device it is.",
      "The important question is: Who is asking? And who is answering?",
    ],
    note:
      "Later in the lesson you will switch both roles yourself. For now, remember the question.",
  },

  bridge:
    "Now let's see this idea in action - through a burger, long before any software words.",

  burger: {
    heading: "The Burger Story",
    body:
      "Watch the story first: a customer asks, the restaurant answers. No tech words yet - just watch who asks and who does the work.",
    customer: { icon: "👤", name: "Customer", sub: "that is you" },
    restaurant: { icon: "🍔", name: "Restaurant", sub: "where you order" },
    customerLine: "I'm hungry...",
    restaurantLine: "Ordering is open!",
    request: "Can I have a burger?",
    response: "🍔 Burger ready!",
    after:
      "That is the whole trick: your message went out, and an answer came back.",
    copy: storyCopy({
      idle: "The story begins when you reach it - or press Play.",
      lead: [
        {
          title: "You're hungry.",
          body:
            "One hungry customer, one restaurant across the street. That is the whole scene.",
        },
        {
          title: "So you ask the restaurant for a burger.",
          body:
            "Your words leave your mouth and start crossing the street.",
        },
      ],
      steps: [
        {
          title: "Your message travels to the restaurant.",
          body:
            "Watch the glowing dot - that is your words crossing the street.",
        },
        {
          title: "The restaurant receives your request.",
          body: "Somebody on the other side heard you.",
        },
        {
          title: "The restaurant does the work.",
          body:
            "Cooking and plating - only the kitchen can do this.",
        },
        {
          title: "Then the answer comes back.",
          body: "The finished burger travels back to your table.",
        },
        {
          title: "You got what you asked for.",
          body:
            "You asked - and something answered. A message goes out, an answer comes back.",
        },
      ],
      done: "✓ One burger, one full round trip.",
    }),
  },

  transition: {
    heading: "From Restaurant to Software",
    body:
      "Software can work in a similar way. Watch the words transform - same story, software names.",
    from: [
      { icon: "👤", name: "CUSTOMER", sub: "the one who wants something" },
      { icon: "🍔", name: "RESTAURANT", sub: "the place that serves" },
    ],
    to: [
      { icon: "💻", name: "CLIENT", sub: "The one that asks." },
      {
        icon: "🖥️",
        name: "SERVER",
        sub: "Receives the request and does the work.",
      },
    ],
    lines: [
      "Software can work in a similar way.",
      "You ask.",
      "Something receives your request.",
      "It does some work.",
      "And an answer comes back.",
    ],
  },

  software: {
    heading: "The Same Idea in Software",
    body:
      "The restaurant is now a server, the customer is now a client - and the glowing dot is the same message. Watch each beat.",
    client: { icon: "💻", name: "Client", sub: "the one that asks" },
    server: { icon: "🖥️", name: "Server", sub: "the one that answers" },
    clientLine: "\"I need something...\"",
    serverLine: "\"I can help.\"",
    request: "REQUEST",
    response: "RESPONSE",
    copy: storyCopy({
      idle: "Ready - this story plays when you reach it.",
      steps: [
        {
          title: "The client asks the server for something.",
          body: "The request leaves the client and travels to the server.",
        },
        {
          title: "The server receives the request.",
          body: "The ask landed - the server knows what you want.",
        },
        {
          title: "The server does the work.",
          body:
            "Checking, calculating, saving - this is the WORK part.",
        },
        {
          title: "The server sends an answer back.",
          body: "The response glows back to whoever asked.",
        },
        {
          title: "The client shows the result.",
          body: "The answer arrived and the client displays it.",
        },
      ],
      done: "✓ One complete round trip.",
    }),
  },

  terms: {
    heading: "Request and Response",
    lines: [
      "The message going from the client to the server is called a REQUEST.",
      "The answer coming back is called a RESPONSE.",
    ],
    diagram: ["CLIENT", "REQUEST", "SERVER", "RESPONSE", "CLIENT"],
  },

  rr: {
    heading: "Watch a Request and Response",
    body:
      "Two official words, one loop. Watch the request travel down, the server work, and the response travel back.",
    client: { icon: "💻", name: "Client", sub: "the one that asks" },
    server: { icon: "🖥️", name: "Server", sub: "the one that answers" },
    clientLine: "\"I need something...\"",
    serverLine: "\"I'll help.\"",
    request: "REQUEST",
    response: "RESPONSE",
    copy: storyCopy({
      idle: "Ready - this story plays when you reach it.",
      lead: [
        {
          title: "The client is asking.",
          body: "Every conversation in software starts with a question.",
        },
      ],
      steps: [
        {
          title: "The request is traveling.",
          body: "The message moves from the client to the server.",
        },
        {
          title: "The server received it.",
          body: "The request landed at the server.",
        },
        {
          title: "The server is working.",
          body: "The server does the work it was asked to do.",
        },
        {
          title: "The response is coming back.",
          body: "The answer travels back to whoever asked.",
        },
        {
          title: "The client received the answer.",
          body: "The client shows the result. One full round trip!",
        },
      ],
      done: "✓ One full round trip.",
    }),
  },

  website: {
    heading: "Opening a Website",
    body:
      "When your browser asks for a website, the browser is acting as the client. The server receives the request and sends something back.",
    note:
      "Later lessons cover how the words travel. Today: browser asks, server responds.",
    client: { icon: "🌐", name: "Browser", sub: "client" },
    server: { icon: "🖥️", name: "Website Server", sub: "server" },
    clientLine: "example.com",
    serverLine: "I have that page.",
    request: "Give me this website",
    response: "Here is the website.",
    copy: storyCopy({
      idle: "Ready - this trip plays when you reach it.",
      lead: [
        {
          title: "You type an address and hit Enter.",
          body: "That single Enter starts a whole conversation.",
        },
      ],
      steps: [
        {
          title: "Your browser asks for the page.",
          body: "\"Give me this website\" leaves your machine.",
        },
        {
          title: "The server received the request.",
          body: "The website server heard the ask.",
        },
        {
          title: "The server does the work.",
          body: "It gathers the page it was asked for.",
        },
        {
          title: "The response comes back.",
          body: "The page travels back to your browser.",
        },
        {
          title: "The page is on your screen!",
          body: "Browser asked, server answered - that is a website.",
        },
      ],
      done: "✓ Website loaded.",
    }),
  },

  todo: {
    heading: "Your Todo App, Again",
    body:
      "This is only about the client and the server. The app you know from Lesson 1 talks this way too - two little conversations, watch who asks each time.",
    trips: [
      {
        id: "show",
        label: "📥 Show my Todos",
        request: "Show my Todos",
        response: "✓ Here are your Todos",
        step1: "The app asks: \"Show my Todos.\"",
        step5: "Your list appears on screen.",
      },
      {
        id: "save",
        label: "💾 Save Buy milk",
        request: "Save: Buy milk",
        response: "✓ Saved!",
        step1: "The app asks: \"Save Buy milk.\"",
        step5: "\"Buy milk\" is saved!",
      },
    ],
    client: { icon: "📱", name: "App", sub: "client" },
    server: { icon: "🖥️", name: "Server", sub: "server" },
    serverLine: "\"Let me handle that.\"",
    copy: (() => {
      const base = storyCopy();
      return storyCopy({
        idle: "Pick a conversation to watch.",
        steps: [
          {
            title: "The app sends the request.",
            body: "The request leaves the app - watch it travel.",
          },
          base.steps[1],
          base.steps[2],
          base.steps[3],
          {
            title: "The app shows the result.",
            body: "The response arrived and the screen updated.",
          },
        ],
      });
    })(),
  },

  roleSwitch: {
    heading: "Roles Can Switch",
    body:
      "Two plain computers - no phones, no big server racks. Whichever computer ASKS is the client. Pick who asks and watch the badges flip.",
    actionA: "Computer A asks Computer B",
    actionB: "Computer B asks Computer A",
    first: "Pick who asks: Computer A or Computer B?",
    narrationA: "Computer A is the client because it is asking.",
    narrationB:
      "The roles changed because the direction of the request changed. Computer B is now the client.",
    bothDone:
      "Client and server are roles, not permanent labels.",
    note: "",
    a: { icon: "💻", name: "Computer A" },
    b: { icon: "🖧", name: "Computer B" },
    request: "Give me some data.",
  },

  check: {
    heading: "Quick Check: Who Is Asking?",
    intro:
      "Two computers, one arrow. Look at who sends the request - then who sends the answer back.",
    diagram: { from: "💻 A", to: "💻 B", label: "REQUEST ●" },
    q1: {
      prompt: "Who is asking?",
      options: [
        { id: "a", label: "💻 A is Client", correct: true },
        { id: "b", label: "💻 B is Client", correct: false },
      ],
      right: "A is the client because A is asking.",
      wrong:
        "Look at the arrow - A is the one sending the request, so A is asking.",
    },
    q2: {
      prompt: "Who is answering?",
      options: [
        { id: "a", label: "🖥️ A is Server", correct: false },
        { id: "b", label: "🖥️ B is Server", correct: true },
      ],
      right: "B is the server because B is answering.",
      wrong:
        "Look at who sends the answer back - that is B, so B is answering.",
    },
    solved: "Exactly - A asks, B answers. That is the whole pattern.",
  },

  offline: {
    heading: "When the Server Is Offline",
    body:
      "Now watch what happens when the server is unavailable. The client sends its request anyway - watch closely.",
    client: { icon: "💻", name: "Client", sub: "asking into the void" },
    server: { icon: "🖥️", name: "Server", sub: "offline" },
    clientLine: "Hello? Anyone?",
    serverLine: "💤 zzz... nobody is listening.",
    request: "REQUEST",
    response: "(never comes)",
    copy: storyCopy({
      idle: "Ready - this trip plays when you reach it.",
      lead: [
        {
          title: "The server is offline.",
          body: "The client sends its request anyway - watch closely.",
        },
      ],
      steps: [
        {
          title: "The client sent a request.",
          body:
            "The glowing dot starts its journey - but nobody is listening on the other side.",
        },
        {
          title: "The server received it.",
          body: "",
        },
        {
          title: "The server does some work.",
          body: "",
        },
        {
          title: "Server sends a response.",
          body: "",
        },
        {
          title: "Client shows the result.",
          body: "",
        },
      ],
      waiting: {
        title: "⏳ Waiting...",
        body:
          "The server is not available. The client keeps waiting for an answer...",
      },
      fail: {
        title: "No response came back.",
        body:
          "The client asked, but the server did not answer. This is what \"the website is down\" feels like.",
      },
    }),
  },

  online: {
    heading: "Bring the Server Back",
    body:
      "No server, no answer. Bring the server online, then try the same request again.",
    turnOnLabel: "🟢 Turn Server On",
    tryLabel: "🔁 Try Again",
    turnedOn: "Now the server is available.",
    after: "The request can be answered - bringing the server back was the whole fix.",
    client: { icon: "💻", name: "Client", sub: "ready to ask again" },
    server: { icon: "🖥️", name: "Server", sub: "listening again" },
    clientLine: "Ready when you are!",
    serverLine: "🟢 ONLINE - listening",
    request: "REQUEST",
    response: "✓ I'm back!",
    copy: storyCopy({
      idle: "Turn the server on first, then press Try Again.",
      steps: [
        {
          title: "The client sends the request again.",
          body: "Same request as before.",
        },
        {
          title: "The server receives it.",
          body: "This time - it lands!",
        },
        {
          title: "The server does the work.",
          body: "The server wakes up and works.",
        },
        {
          title: "The answer comes back.",
          body: "The response flies back to the client.",
        },
        {
          title: "The client received the answer.",
          body: "The screen can update again.",
        },
      ],
      done: "✓ Success - the request was answered.",
    }),
  },

  final: {
    heading: "The Basic Idea",
    body: "One sentence to take with you:",
    sentence:
      "That's the basic idea behind client and server communication.",
    chain: [
      { icon: "💻", label: "CLIENT", action: "ASKS" },
      { icon: "🖥️", label: "SERVER", action: "WORKS + ANSWERS" },
      { icon: "💻", label: "CLIENT", action: "SHOWS THE RESULT" },
    ],
  },
};
