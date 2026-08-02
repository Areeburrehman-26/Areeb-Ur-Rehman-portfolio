/**
 * All site copy lives here so it can be edited without touching components.
 *
 * NDA note: the work done at Sliding Scale Technologies and Sawda.ai is
 * described at capability level only. No proprietary detail, and nothing
 * framed as available to license or resell.
 */

export const site = {
  name: "Areeb ur Rehman",
  wordmark: ["AREEB UR", "REHMAN"] as const,
  role: "Full-Stack Web Developer · AI Engineer · Backend Systems",
  email: "areebrehman615@gmail.com",
  callUrl: "https://calendar.app.google/KWERZYALu16rKDZQA",
  upworkUrl:
    "https://www.upwork.com/freelancers/~015f46f60dc0dca7e8?mp_source=share",
  socials: [
    { label: "github", href: "https://github.com/Areeburrehman-26" },
    {
      label: "linkedin",
      href: "https://www.linkedin.com/in/areeb-ur-rehman-81b057292/",
    },
    {
      label: "upwork",
      href: "https://www.upwork.com/freelancers/~015f46f60dc0dca7e8?mp_source=share",
    },
  ],
} as const;

export const nav = [
  { label: "home", href: "#top" },
  { label: "work", href: "#work" },
  { label: "systems", href: "#systems" },
  { label: "about", href: "#about" },
  { label: "contact", href: "#contact" },
] as const;

export const hero = {
  eyebrow: "[· full-stack web developer · ai engineer · backend systems ·]",
  headline: "I build the system, then the AI that runs it.",
  sub: "Finance and ERP platforms, assistants grounded in your own documents, voice agents that answer the phone, and the automation behind them.",
  ctas: [
    { label: "see the work", href: "#work", primary: true },
    { label: "book a call", href: "#contact", primary: false },
  ],
  facts: [
    { k: "stack", v: "python · next.js · react" },
    { k: "ai", v: "rag · agents · langchain" },
    { k: "shipped", v: "5 chatbots · 4 rag systems" },
    { k: "status", v: "employed · open to freelance" },
  ],
} as const;

export type Capability = {
  id: string;
  icon: string;
  chapter: string;
  headline: string;
  body: string;
  callouts: { text: string; x: number; y: number }[];
};

/** Chapters of the pinned, scroll-scrubbed showcase. Order = scrub order. */
export const capabilities: Capability[] = [
  {
    id: "erp",
    icon: "▤",
    chapter: "01 / erp & finance",
    headline: "FINANCE THAT RECONCILES ITSELF",
    body: "Invoicing, salaries, extra charges, zakat and the split of profit between shareholders, calculated in one system instead of five spreadsheets. Frontend on Vercel, backend and data on the cloud.",
    callouts: [
      { text: "zakat + shareholder splits", x: 12, y: 24 },
      { text: "every figure traceable", x: 62, y: 70 },
    ],
  },
  {
    id: "chatbot",
    icon: "◍",
    chapter: "02 / ai chatbots & rag",
    headline: "ANSWERS FROM YOUR OWN DOCUMENTS",
    body: "Two things through one pipeline. Site chatbots you load your own knowledge base into, answering in realtime and escalating to a human the moment a question falls outside what they know. And retrieval systems that read dense source material, contracts and trade documentation, then answer from the clause instead of from memory.",
    callouts: [
      { text: "bring your own knowledge base", x: 58, y: 18 },
      { text: "escalates to a human", x: 14, y: 72 },
    ],
  },
  {
    id: "voice",
    icon: "◉",
    chapter: "03 / voice agents",
    headline: "A LINE THAT ALWAYS PICKS UP",
    body: "Call the number and an agent answers, works out what you want, books it, and sends the responsible staff member a summary by SMS or email. Ten calls at once, no queue, no missed evenings.",
    callouts: [
      { text: "10 concurrent calls", x: 64, y: 62 },
      { text: "summary after every call", x: 12, y: 30 },
    ],
  },
  {
    id: "automation",
    icon: "↻",
    chapter: "04 / automation & scraping",
    headline: "THE MANUAL STEP, DELETED",
    body: "AI-driven extraction over APIs, and browser automation for everything that has no API. Proxy and IP rotation, scheduled runs, and a dashboard so you can watch the thing work rather than trust it blindly.",
    callouts: [
      { text: "proxy + ip rotation", x: 62, y: 70 },
      { text: "dashboard over every run", x: 14, y: 24 },
    ],
  },
  {
    id: "cloud",
    icon: "☁",
    chapter: "05 / cloud & server-side",
    headline: "IT RUNS WHETHER YOU WATCH IT OR NOT",
    body: "Migrations between databases, storage and retrieval on servers I configure and own, authentication, and deployments that stay up. The heavy work happens on the server, not on somebody's laptop.",
    callouts: [
      { text: "database migrations", x: 60, y: 28 },
      { text: "auth + always-on deploys", x: 10, y: 68 },
    ],
  },
  {
    id: "booking",
    icon: "◷",
    chapter: "06 / booking & scheduling",
    headline: "SCHEDULING WITHOUT THE PHONE CALLS",
    body: "Availability, capacity, payments and reminders, built into the products above rather than sold as a separate thing. Shipped inside the voice agent, the marketplace and the finance platform.",
    callouts: [
      { text: "conflict-free slotting", x: 66, y: 22 },
      { text: "payments + reminders", x: 10, y: 66 },
    ],
  },
];

export type Project = {
  id: string;
  name: string;
  tag: string;
  problem: string;
  build: string;
  outcome: string;
  stack: string[];
  /**
   * Drop a screenshot at /public/projects/<id>.png and set this to
   * `/projects/<id>.png`. Until then the animated illustration renders.
   */
  image?: string;
  hue: number;
};

export const projects: Project[] = [
  {
    id: "finance",
    name: "Finance & ERP Platform",
    tag: "erp · production",
    problem:
      "Invoices, salaries, extra charges, zakat and the split of profit between shareholders lived in separate sheets. Nobody could say what was owed this week without a long afternoon of work.",
    build:
      "One system that calculates all of it: billing, payroll, deductions, zakat and shareholder distribution, with every figure traceable back to the transaction behind it. Frontend on Vercel, backend and database on the cloud.",
    outcome:
      "Month-end became a report instead of a reconciliation, and the shareholder split stopped being an argument.",
    stack: ["Next.js", "Python", "Cloud DB", "Vercel"],
    hue: 24,
  },
  {
    id: "chatbots",
    name: "AI Chatbots with Human Escalation",
    tag: "ai · 5 deployments",
    problem:
      "Businesses answered the same questions by hand all day, and off-the-shelf bots either knew nothing about them or invented an answer.",
    build:
      "A chatbot you load your own knowledge base into. It answers in realtime from that material, and when a question falls outside what it knows it hands the conversation to a human with the full context attached rather than guessing.",
    outcome:
      "Running on five sites. Routine questions resolve without staff, and nobody receives a confidently wrong answer.",
    stack: ["Python", "LangChain", "Vector DB", "Realtime chat"],
    hue: 200,
  },
  {
    id: "rag",
    name: "Document-Grounded RAG Assistants",
    tag: "rag · 4 deployments",
    problem:
      "Some questions cannot be answered from a model's memory. Tenancy law and trade documentation change, and being confidently wrong has consequences.",
    build:
      "Retrieval systems that read the source material and answer from it, with tools the assistant can call: contract and tenancy work at Sliding Scale, import and export knowledge at Sawda.ai. Both under NDA, so this is the shape of the work rather than the detail of it.",
    outcome:
      "Four retrieval systems in use. Every answer points back at the document it came from, which is the entire point.",
    stack: ["Python", "LangGraph", "Embeddings", "Vector search"],
    hue: 172,
  },
  {
    id: "voice",
    name: "Inbound Voice Agent",
    tag: "voice · production",
    problem:
      "Calls outside office hours went unanswered, and every missed call was a booking that went somewhere else.",
    build:
      "A telephony agent on the cloud that answers, classifies what the caller wants, books it against the live calendar, and sends the responsible staff member a summary by SMS or email as soon as the call ends.",
    outcome:
      "Handles ten calls at the same time and saves the team more than forty hours a week.",
    stack: ["Python", "Telephony API", "Speech", "Cloud"],
    hue: 330,
  },
  {
    id: "automation",
    name: "Behavioural Instagram Automation",
    tag: "automation · personal project",
    problem:
      "Scripted automation is obvious. It moves at machine speed in machine patterns, and gets shut down quickly.",
    build:
      "AI decides what to do next instead of following a fixed script, so the timing and order of actions read as a person using the app. Runs on a server with proxy and IP rotation across several accounts, controlled from a dashboard.",
    outcome:
      "Three to four accounts through three proxies on one server, all observable from a single dashboard.",
    stack: ["Python", "Browser automation", "Proxies", "Dashboard"],
    hue: 96,
  },
  {
    id: "journaling",
    name: "Cloud Journaling App",
    tag: "product",
    problem:
      "A journal that lives on one device is lost the moment that device is. People also remember in pictures, not only in sentences.",
    build:
      "Entries and photographs stored on a cloud-backed server, so a journal written on one device opens on any other at any time, with the images attached to the day they belong to.",
    outcome:
      "Writing and photographs stay together and stay available, wherever you open them.",
    stack: ["Next.js", "Cloud storage", "Auth", "Server"],
    hue: 265,
  },
  {
    id: "marketplace",
    name: "Cleaner Marketplace",
    tag: "marketplace",
    problem:
      "Homeowners and cleaners found each other by phone and word of mouth, and payment happened off the books.",
    build:
      "A two-sided marketplace matching cleaners to homeowners by location and service area, taking payment through Stripe, with job data processed and stored on servers rather than in a spreadsheet.",
    outcome:
      "Booking, matching and payment run as one flow, so nobody has to chase an invoice.",
    stack: ["Next.js", "Stripe", "Server", "Database"],
    hue: 40,
  },
];

export const about = {
  eyebrow: "[· about ·]",
  script: "the short version",
  headline: "Still a student. Already shipping production systems.",
  paragraphs: [
    "I am studying BS Computer Science at FAST-NUCES in Karachi, class of 2027. I did not wait for the degree before building things that other people depend on.",
    "I started at Sawda.ai as an intern on model experimentation and data workflows, then stayed as a Junior Software Engineer building AI features across their platform. I am now a Junior Software Engineer at Sliding Scale Technologies, working end to end: designing scalable applications, shipping MVPs, and building the internal tools the company runs on.",
    "Alongside that I take freelance work on Upwork and build my own systems. The through-line is the same everywhere. Get the data into the right shape, put it somewhere that stays up, and add AI at the points where it actually pays for itself.",
  ],
  facts: [
    { k: "role", v: "Junior Software Engineer, Sliding Scale Technologies" },
    { k: "studying", v: "BS Computer Science, FAST-NUCES, class of 2027" },
    { k: "based in", v: "Karachi, Pakistan" },
    { k: "freelance", v: "Upwork · 19 jobs · $1K+ earned" },
    { k: "also", v: "Co-Head, CS Competition, PROCOM'26" },
  ],
} as const;

export const processCards = [
  {
    id: "map",
    step: "01",
    title: "Find where the work leaks",
    body: "Before any code: what a job actually costs you today, including the parts that only live in somebody's head. That is usually where the system is missing.",
  },
  {
    id: "spine",
    step: "02",
    title: "Build the spine first",
    body: "Data model, auth, and the one workflow that matters most. You get something real to use early, not a demo that falls over on your actual data.",
  },
  {
    id: "ai",
    step: "03",
    title: "Add AI where it pays",
    body: "Retrieval, agents and automation go in at the points with a measurable return. Everywhere else ordinary code is faster, cheaper and easier to trust.",
  },
  {
    id: "hand",
    step: "04",
    title: "Hand over something you own",
    body: "Deployed, documented, and running on infrastructure in your name. No black boxes, and a clear answer for what happens when it needs to change.",
  },
] as const;

export const contact = {
  eyebrow: "[· contact ·]",
  headline: "Tell me what's broken.",
  sub: "No system yet, a system that fights you, or one that works and needs AI in it. Two ways in, pick whichever suits you.",
  callHeading: "Book a call",
  callBody:
    "30 minutes, no pitch deck. Bring the messy version of the problem, that is the useful one.",
  callPoints: [
    "we map where the work actually leaks",
    "you leave with a build order, not a quote",
    "no obligation either way",
  ],
} as const;
