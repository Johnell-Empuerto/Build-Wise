// System Design - Level 1, Lesson 3: "Client and Server"
// Frontend-only static content. Teaches through a restaurant story first
// (customer asks, kitchen answers), then transforms it into software:
// CLIENT = asks, SERVER = answers. Every animation copy lives here.

function exchangeCopy(overrides = {}) {
  return {
    idle: "Ready when you are - press Play and watch the glowing dot.",
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
        "The request stopped on the way. The client is waiting for an answer that never comes.",
    },
    fail: {
      title: "❌ No response",
      body:
        "The client asked, but the server did not answer. Nothing came back.",
    },
    done: "✓ Got a response!",
    controls: { play: "▶ Play", pause: "⏸ Pause", replay: "↻ Replay", step: "⏭ Step" },
    ...overrides,
  };
}

export const CLIENT_SERVER_LESSON = {
  id: "client-server",
  title: "Client and Server",

  stages: [
    { id: "intro", label: "A Burger Story", chip: "See it" },
    { id: "kitchen", label: "The Kitchen Answers", chip: "See it" },
    { id: "rolesIntro", label: "Meet Client & Server", chip: "Understand it" },
    { id: "firstLook", label: "First Diagram", chip: "See it" },
    { id: "whoClient", label: "Who Is the Client?", chip: "Understand it" },
    { id: "whoServer", label: "Who Is the Server?", chip: "Understand it" },
    { id: "roleSwitch", label: "Roles Can Switch", chip: "Understand it" },
    { id: "exchange", label: "Request & Response", chip: "Interact with it" },
    { id: "website", label: "A Real Website", chip: "See it" },
    { id: "todo", label: "Todos Again", chip: "See it" },
    { id: "notDb", label: "Not the Database", chip: "Learn from mistakes" },
    { id: "offline", label: "Server Offline", chip: "Interact with it" },
    { id: "online", label: "Server Back On", chip: "Interact with it" },
    { id: "roleGame", label: "Role Game", chip: "Interact with it" },
    { id: "classify", label: "Client or Server?", chip: "Learn from mistakes" },
    { id: "finalFlow", label: "The Full Flow", chip: "See it" },
    { id: "summary", label: "Summary", chip: "Wrap up" },
  ],

  intro: {
    heading: "What happens when you want a burger?",
    body:
      "You are hungry. Somewhere across the street there is a restaurant. That is the whole scene - one hungry customer, one restaurant. Nothing else matters yet.",
    prompt: "Press the button and watch your words travel.",
    playLabel: "🍔 Ask for a burger",
    customer: { icon: "👤", name: "Customer", sub: "that is you" },
    restaurant: { icon: "🍔", name: "Restaurant", sub: "where you order" },
    customerLine: "I'm hungry...",
    restaurantLine: "Ordering is open!",
    request: "Can I have a burger?",
    response: "Sure - one burger!",
    copy: exchangeCopy({
      idle:
        "Hungry? Press the button and watch your message travel to the restaurant.",
      steps: [
        {
          title: "Your words fly to the restaurant!",
          body:
            "That glowing dot is your message: \"Can I have a burger?\" - it crosses the street to the restaurant.",
        },
        {
          title: "The restaurant got your words.",
          body: "Your message arrived. Somebody on the other side heard you.",
        },
        {
          title: "The restaurant starts working.",
          body: "Behind the counter, work begins because you asked.",
        },
        {
          title: "Something comes back to you.",
          body: "The restaurant sends an answer your way.",
        },
        {
          title: "You got it!",
          body:
            "You asked - something answered. Remember this feeling: a message goes out, an answer comes back.",
        },
      ],
      controls: {},
    }),
    after:
      "That is the whole trick: your message went out, and an answer came back. No tech words yet - just watching.",
  },

  kitchen: {
    heading: "Now watch the kitchen do the work",
    body:
      "Your words reached the restaurant. Inside the kitchen, the cook reads the order, prepares the burger, and hands it back. The customer only waits - the kitchen does the work.",
    playLabel: "🧑‍🍳 Watch the kitchen",
    customer: { icon: "👤", name: "Customer", sub: "waits at the table" },
    restaurant: { icon: "🍳", name: "Kitchen", sub: "does the work" },
    customerLine: "Waiting... hungry...",
    restaurantLine: "Order received!",
    request: "Burger please!",
    response: "🍔 Burger ready!",
    copy: exchangeCopy({
      idle: "The kitchen is ready. Press the button to watch it work.",
      steps: [
        {
          title: "Your order flies to the kitchen.",
          body: "\"Burger please!\" travels from your table to the kitchen.",
        },
        {
          title: "The kitchen received the order.",
          body: "The cook hears your ask and gets ready to work.",
        },
        {
          title: "The kitchen prepares the burger.",
          body:
            "Chopping, cooking, plating - this is the WORK part, and only the kitchen can do it.",
        },
        {
          title: "🍔 The burger comes back to you.",
          body: "The finished burger travels back to your table.",
        },
        {
          title: "You received the result.",
          body:
            "The customer asked. The kitchen did the work. The customer received the result. Simple, right?",
        },
      ],
      controls: {},
    }),
    after:
      "The customer asked. The kitchen did the work. The customer received the result. Software works in a similar way.",
  },

  rolesIntro: {
    heading: "Software calls them something else",
    body:
      "Same story, new names. In software, the customer has a special role - and so does the kitchen. Watch the words transform.",
    morphLabel: "✨ Transform the story",
    fromCustomer: { icon: "👤", name: "CUSTOMER", sub: "the one who wants something" },
    fromRestaurant: { icon: "🍔", name: "RESTAURANT", sub: "the place that serves" },
    toClient: { icon: "💻", name: "CLIENT", sub: "The one that asks." },
    toServer: { icon: "🖥️", name: "SERVER", sub: "Receives the request and does the work." },
    bridge: "These are two important roles in software:",
    cardClient:
      "The client is the one that ASKS - it wants something and starts the conversation.",
    cardServer:
      "The server is the one that RECEIVES the request and does the work.",
    after:
      "Client asks. Server does the work. Same restaurant - just software words now.",
  },

  firstLook: {
    heading: "See the two roles talk",
    body:
      "A client box on top, a server box below, and one glowing dot between them. The dot going down is the request; the dot coming back is the response.",
    client: { icon: "💻", name: "Client", sub: "the one that asks" },
    server: { icon: "🖥️", name: "Server", sub: "the one that answers" },
    clientLine: "I need...",
    serverLine: "I'll help.",
    request: "REQUEST",
    response: "RESPONSE",
    copy: exchangeCopy({
      idle:
        "Press Play: watch the REQUEST travel down, and the RESPONSE travel back up.",
      done: "✓ One full conversation!",
    }),
    after:
      "Down: the request. Up: the response. Every client/server chat looks like this.",
  },

  whoClient: {
    heading: "Which one can be a client?",
    body: "Tap each example and watch it light up.",
    hint: "A client is usually the thing the user interacts with that asks another system for something.",
    roleNote:
      "The important idea is the ROLE - not every client must be a physical device.",
    done:
      "Nice - a phone, a browser, a desktop app, a smart watch: any of them can be the one asking.",
    examples: [
      {
        id: "phone",
        icon: "📱",
        name: "Phone app",
        line: "Load my feed!",
        why:
          "The app asks another system for something: \"Show me new posts!\" It starts the conversation, so it acts as the client.",
      },
      {
        id: "browser",
        icon: "💻",
        name: "Web browser",
        line: "Give me example.com",
        why:
          "Your browser asks a server for a webpage. It wants something, so it is acting as the client.",
      },
      {
        id: "desktop",
        icon: "🖥️",
        name: "Desktop app",
        line: "Check for updates",
        why:
          "A desktop program asks the maker's server \"Is there a newer version?\" Asking means client.",
      },
      {
        id: "watch",
        icon: "⌚",
        name: "Smart device",
        line: "What's the weather?",
        why:
          "Even a tiny watch can ask a big server for the weather. Small size does not matter - asking does.",
      },
    ],
  },

  whoServer: {
    heading: "What does a server do?",
    body: "Tap a job and watch the server receive it.",
    hint: "The server receives requests and does work for the client.",
    done:
      "Four jobs, one pattern: somebody asks, the server receives it and does the work.",
    client: { icon: "📱", name: "App", sub: "sends the job" },
    clientLine: "I need something...",
    server: { icon: "🖥️", name: "Server", sub: "receives and works" },
    serverLine: "Got it - working on it!",
    jobs: [
      {
        id: "login",
        text: "Check my login",
        request: "Check my login",
        response: "✓ Logged in!",
      },
      {
        id: "todos",
        text: "Give me my Todos",
        request: "Give me my Todos",
        response: "✓ Here are your Todos",
      },
      {
        id: "save",
        text: "Save this Todo",
        request: "Save: Buy milk",
        response: "✓ Saved!",
      },
      {
        id: "profile",
        text: "Show me my profile",
        request: "Show me my profile",
        response: "✓ Profile: John, ⭐ 12 lessons",
      },
    ],
    copy: exchangeCopy({
      idle: "Tap a job above - watch the server receive it and answer.",
      done: "✓ The server received the request and did the work.",
    }),
  },

  roleSwitch: {
    heading: "Client and server are roles",
    body:
      "Never think \"client = phone\" or \"server = a big computer.\" Two plain computers: who is asking, and who is answering?",
    actionA: "Computer A asks Computer B",
    actionB: "Computer B asks Computer A",
    first: "Pick who asks first.",
    bothDone:
      "You did both directions! The roles depend on what is happening right now - whoever asks is the client, whoever answers is the server.",
    note: 'The important question is: "Who is asking?" and "Who is answering?"',
    a: { icon: "💻", name: "Computer A" },
    b: { icon: "🖧", name: "Computer B" },
    request: "REQUEST",
  },

  exchange: {
    heading: "Request and Response - the two official words",
    body:
      "REQUEST: the client asks for something. RESPONSE: the server answers. Watch the loop, or step through it one beat at a time.",
    requestDef: "REQUEST - the client asks for something.",
    responseDef: "RESPONSE - the server answers.",
    client: { icon: "💻", name: "Client", sub: "the one that asks" },
    server: { icon: "🖥️", name: "Server", sub: "the one that answers" },
    clientLine: "\"I need something...\"",
    serverLine: "\"I'll help.\"",
    request: "REQUEST",
    response: "RESPONSE",
    copy: exchangeCopy({
      idle:
        "Use Play, Pause, Replay or Step. Watch the request go down and the response come back.",
      done: "✓ Five steps - that is the heartbeat of all software.",
    }),
    after:
      "Client sends a request. Server works. Server sends a response. Client shows the result. Forever.",
  },

  website: {
    heading: "You do this a hundred times a day",
    body:
      "Type example.com and hit Enter. Your browser becomes a client, some server becomes the server, and the page flies back to you.",
    playLabel: "🌐 Visit example.com",
    client: { icon: "🌐", name: "Browser", sub: "client" },
    server: { icon: "🖥️", name: "Website Server", sub: "server" },
    clientLine: "example.com",
    serverLine: "I have that page.",
    request: "Give me this website",
    response: "Here it is",
    copy: exchangeCopy({
      idle: "Press the button - just like typing an address and hitting Enter.",
      done: "✓ The page is on your screen!",
    }),
    simple: true,
    note:
      "No deep tech here - later lessons cover how the words travel. Today: browser asks, server responds.",
    after:
      "Browser asks. Server responds. Websites, games, videos - same story.",
  },

  todo: {
    heading: "Back to your Todo app",
    body:
      "The app you know from Lesson 1 also talks this way. Two little conversations - watch who asks each time.",
    trips: [
      {
        id: "get",
        label: "📥 Get my Todos",
        request: "Give me my Todos",
        response: "✓ Here are your Todos",
        step1: "The app asks: \"Give me my Todos.\"",
        step5: "Your list appears on screen.",
      },
      {
        id: "save",
        label: "💾 Save \"Buy milk\"",
        request: "Save: Buy milk",
        response: "✓ Saved!",
        step1: "The app asks: \"Save Buy milk.\"",
        step5: "\"Buy milk\" is saved - and shown back to you.",
      },
    ],
    client: { icon: "📱", name: "App", sub: "client" },
    server: { icon: "🖥️", name: "Server", sub: "server" },
    serverNote: "🗄️ the server may ask a database to remember things",
    done: "Both trips done - client asked twice, server answered twice.",
    copy: exchangeCopy({
      idle: "Pick a conversation to watch.",
    }),
    note:
      "Focus on the glowing dot between the two boxes - that is the client/server relationship.",
  },

  notDb: {
    heading: "The server is NOT the database",
    body:
      "A very common mix-up: beginners glue these two together. Tap each card and hear the difference.",
    cards: [
      {
        id: "client",
        icon: "💻",
        name: "Client",
        line: "Asks for something.",
        tap: false,
      },
      {
        id: "server",
        icon: "🖥️",
        name: "Server",
        line: "Does the work and applies rules.",
        tap: true,
        why:
          "The server receives the request, checks the rules, and decides what to do. It is the DOER.",
      },
      {
        id: "database",
        icon: "🗄️",
        name: "Database",
        line: "Remembers the information.",
        tap: true,
        why:
          "The database keeps the information safe. It never answers users - it remembers. That is its whole job.",
      },
    ],
    analogy:
      "Restaurant: the customer orders, the waiter/kitchen does the work, and the storage room remembers what ingredients you have.",
    done:
      "Server does the work. Database remembers. Different jobs - that mix-up never comes back.",
  },

  offline: {
    heading: "What if the server does not answer?",
    body:
      "Right now the server is OFFLINE. Send the request anyway and see what the client experiences.",
    playLabel: "📡 Send the request",
    client: { icon: "💻", name: "Client", sub: "asking into the void" },
    server: { icon: "🖥️", name: "Server", sub: "offline" },
    clientLine: "Hello? Anyone?",
    serverLine: "💤 zzz... nobody is listening.",
    request: "REQUEST",
    response: "(never comes)",
    copy: exchangeCopy({
      idle:
        "The server is offline. Send a request and watch what happens - or predict it first!",
      waiting: {
        title: "⏳ Waiting...",
        body:
          "The request stopped halfway. The client keeps waiting for an answer...",
      },
      fail: {
        title: "❌ No response",
        body:
          "The client asked, but the server did not answer. This is what \"the website is down\" feels like.",
      },
      controls: {},
    }),
    after:
      "No server, no answer. The client can shout into the void forever - nothing comes back.",
  },

  online: {
    heading: "Turn the server back on",
    body: "Bring the server online, then try the same request again.",
    turnOnLabel: "🟢 Turn Server On",
    tryLabel: "🔁 Try Again",
    turnedOn: "Server is online - now the client's request can land.",
    client: { icon: "💻", name: "Client", sub: "ready to ask again" },
    server: { icon: "🖥️", name: "Server", sub: "listening again" },
    clientLine: "Ready when you are!",
    serverLine: "🟢 ONLINE - listening",
    request: "REQUEST",
    response: "✓ I'm back!",
    copy: exchangeCopy({
      idle: "Turn the server on first, then press Try Again.",
      steps: [
        { title: "1. Client sends a request.", body: "Same request as before." },
        { title: "2. Server receives it.", body: "This time - it lands!" },
        { title: "3. Server does some work.", body: "The server wakes up and works." },
        { title: "4. Server sends a response.", body: "The answer flies back." },
        { title: "5. Client shows the result.", body: "✓ Got a response!" },
      ],
      done: "✓ Got a response! The same request worked as soon as the server came back.",
    }),
    after:
      "Server back on, request retried, answer received. Sometimes that is all \"fixing it\" takes.",
  },

  roleGame: {
    heading: "You are the roles now",
    body: "Two rounds. First you ask, then you answer. Pick the choice a good client or server would make.",
    rounds: [
      {
        id: "asClient",
        role: "You are the CLIENT.",
        roleIcon: "💻",
        askedBy: "The server asks you:",
        prompt: "\"What do you want?\"",
        options: [
          {
            id: "todos",
            text: "📋 Get my Todos",
            correct: true,
            teach:
              "Yes! A client ASKS for what it wants - \"get my todos\" is a perfect client move.",
          },
          {
            id: "code",
            text: "🛠️ Change the server's code",
            correct: false,
            teach:
              "Not quite. Clients do not rewrite servers - they only ASK for things. Asking is your whole job as the client.",
          },
          {
            id: "power",
            text: "🔌 Turn off the computer",
            correct: false,
            teach:
              "Not quite. A client does not switch the other side off - it asks politely and waits for an answer.",
          },
        ],
        solved: "Perfect client move: you ASKED for what you want.",
      },
      {
        id: "asServer",
        role: "You are now the SERVER.",
        roleIcon: "🖥️",
        askedBy: "The client asks you:",
        prompt: "\"Give me my Todos.\"",
        options: [
          {
            id: "send",
            text: "📤 Send the requested data",
            correct: true,
            teach:
              "Yes! The server answers: it does the requested work and sends the response back.",
          },
          {
            id: "ignore",
            text: "🙈 Ignore the client",
            correct: false,
            teach:
              "Not quite. A server that never answers leaves the client waiting forever. Answering is the deal.",
          },
          {
            id: "delete",
            text: "🗑️ Delete everything",
            correct: false,
            teach:
              "Not quite! The server does the work it was ASKED to do - deleting everything is the opposite of answering.",
          },
        ],
        solved: "Perfect server move: you ANSWERED with the work.",
      },
    ],
    done:
      "You lived both roles! Client asks, server answers - that is the whole partnership.",
  },

  classify: {
    heading: "Client or Server?",
    body: "Four situations, one at a time. Look at who is asking - or who is answering.",
    buttons: { client: "🙋 CLIENT", server: "🖥️ SERVER" },
    nextLabel: "Next →",
    finishLabel: "✓ Finish",
    wrongBase:
      "Not quite. Look at who is asking - if it asks another system for something, it is acting as the client.",
    items: [
      {
        id: "web",
        text: "Web browser asking for a webpage",
        answer: "client",
        right:
          "Correct! The browser is asking the server for something, so it is acting as the client.",
        wrong:
          "Not quite. Look at who is asking - the browser WANTS a page from somewhere else, so it is acting as the client.",
      },
      {
        id: "password",
        text: "Backend checking a password",
        answer: "server",
        right:
          "Correct! It received a request and does the work - that is exactly the server's job.",
        wrong:
          "Not quite. Look at who is answering - checking the password is work done AFTER being asked, so it is acting as the server.",
      },
      {
        id: "profile",
        text: "Phone app asking for user profile",
        answer: "client",
        right:
          "Correct! The app wants data from another system, so it is acting as the client.",
        wrong:
          "Not quite. The app WANTS something - it asks another system, so it is acting as the client.",
      },
      {
        id: "returning",
        text: "Server returning data",
        answer: "server",
        right:
          "Correct! It answers a request with data - that is the server role in action.",
        wrong:
          "Not quite. Look at who is answering - handing data back after being asked is the server's move.",
      },
    ],
    done: "4 out of 4 - you can spot the roles in the wild now!",
  },

  finalFlow: {
    heading: "The complete flow",
    body:
      "Watch the whole journey, top to bottom and back: a user asks, the client sends, the server works, the answer returns.",
    playLabel: "▶ Play the full flow",
    steps: [
      { id: "user1", label: "USER", body: "A person wants something." },
      { id: "client1", label: "CLIENT", body: "The client turns it into a request." },
      { id: "request", label: "REQUEST", body: "The glowing dot leaves the client.", dot: "r" },
      { id: "server", label: "SERVER", body: "The server receives it." },
      { id: "work", label: "WORK", body: "The server does the work.", spin: true },
      { id: "response", label: "RESPONSE", body: "The answer travels back.", dot: "l" },
      { id: "client2", label: "CLIENT", body: "The client gets the response." },
      { id: "user2", label: "USER", body: "The user sees the result. Done!" },
    ],
    done: "✓ The full flow - request down, response up, user happy.",
    after:
      "Every app you use does this loop, over and over: user, client, request, server, work, response, you.",
  },

  summary: {
    congrats: "Client asks. Server answers.",
    definition: "Client and server are two roles in a system.",
    definitionBody: [
      "The client asks for something.",
      "The server receives the request, does the work, and sends a response.",
    ],
    equation: [
      { key: "CLIENT", value: "ASKS", icon: "💻" },
      { key: "SERVER", value: "ANSWERS", icon: "🖥️" },
    ],
    recall: [
      "Earlier, we saw a Todo system.",
      "Now you know one important relationship inside that system.",
      "The client asks. The server answers.",
    ],
    cards: [
      {
        title: "Roles, not devices",
        body:
          "Any machine can play either part. Your phone is a client to YouTube's servers - and a server when it shares photos with your laptop.",
      },
      {
        title: "Who is asking?",
        body:
          "That is the only question worth memorizing. Asking = client. Answering = server.",
      },
      {
        title: "Request and response",
        body:
          "The glowing dot you watched all lesson: down = request, up = response. It never starts any other way.",
      },
      {
        title: "Server ≠ database",
        body:
          "The server does the work and applies rules. The database remembers. Two different jobs.",
      },
    ],
    closing:
      "Next, we split the pair by location: the frontend is the client you can see, the backend is the server you cannot - and the API is the messenger carrying their words. Same two roles, sharper names.",
  },
};
