// System Design - Level 1 (Fundamentals) static content.
// Frontend-only: no backend, no database, no API calls. React state drives
// all progress; a refresh simply resets it.

export const FUNDAMENTALS_LESSONS = [
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
  { level: 1, title: "Fundamentals", count: 8, status: "open" },
  { level: 2, title: "Requirements", count: 6, status: "planned" },
  { level: 3, title: "API Design", count: 7, status: "planned" },
  { level: 4, title: "Database Design", count: 7, status: "planned" },
  { level: 5, title: "Architecture", count: 7, status: "planned" },
  { level: 6, title: "Performance & Scaling", count: 6, status: "planned" },
  { level: 7, title: "Reliability", count: 6, status: "planned" },
  { level: 8, title: "Security", count: 7, status: "planned" },
  { level: null, title: "Design Problems", count: 12, status: "planned" },
];
