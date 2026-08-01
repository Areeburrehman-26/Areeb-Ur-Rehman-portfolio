/**
 * All site copy lives here so it can be edited without touching components.
 * Anything marked PLACEHOLDER is safe to replace with real details.
 */

export const site = {
  name: "Areeb ur Rehman",
  wordmark: ["AREEB UR", "REHMAN"] as const,
  role: "Full-Stack Web Developer · AI Engineer · Backend Systems",
  email: "areebrehman615@gmail.com",
  callUrl: "https://calendar.app.google/KWERZYALu16rKDZQA",
  socials: [
    { label: "github", href: "https://github.com/Areeburrehman-26" },
    {
      label: "linkedin",
      href: "https://www.linkedin.com/in/areeb-ur-rehman-81b057292/",
    },
  ],
} as const;

export const nav = [
  { label: "work", href: "#work" },
  { label: "systems", href: "#systems" },
  { label: "about", href: "#about" },
  { label: "contact", href: "#contact" },
] as const;

export const hero = {
  eyebrow: "[· full-stack web developer · ai engineer · backend systems ·]",
  headline: "I build the system your business is missing.",
  sub: "ERP and finance tooling, booking platforms, AI chatbots, RAG assistants, voice agents, and the cloud infrastructure behind them.",
  ctas: [
    { label: "see the systems", href: "#systems", primary: true },
    { label: "book a call", href: "#contact", primary: false },
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
    body: "Ledgers, invoicing, payroll, approvals and reporting in one system your finance manager actually trusts. No more four spreadsheets and a WhatsApp thread.",
    callouts: [
      { text: "double-entry ledger", x: 12, y: 24 },
      { text: "audit trail on every write", x: 62, y: 70 },
    ],
  },
  {
    id: "booking",
    icon: "◷",
    chapter: "02 / booking & scheduling",
    headline: "SCHEDULING WITHOUT THE PHONE CALLS",
    body: "Availability, capacity, deposits, reminders and cancellations handled end to end - so the calendar stops being a person's full-time job.",
    callouts: [
      { text: "conflict-free slotting", x: 66, y: 22 },
      { text: "payments + deposits", x: 10, y: 66 },
    ],
  },
  {
    id: "chatbot",
    icon: "◍",
    chapter: "03 / ai chatbots & rag",
    headline: "ANSWERS FROM YOUR OWN DOCUMENTS",
    body: "Retrieval-augmented assistants grounded in your contracts, policies and product data. Cited, scoped, and honest about what it does not know.",
    callouts: [
      { text: "vector retrieval", x: 58, y: 18 },
      { text: "grounded + cited output", x: 14, y: 72 },
    ],
  },
  {
    id: "voice",
    icon: "◉",
    chapter: "04 / voice agents",
    headline: "A LINE THAT ALWAYS PICKS UP",
    body: "Telephony agents that qualify leads, book appointments and escalate to a human at exactly the right moment. Sub-second turn-taking, full transcripts.",
    callouts: [
      { text: "realtime speech loop", x: 64, y: 62 },
      { text: "human handoff rules", x: 12, y: 30 },
    ],
  },
  {
    id: "cloud",
    icon: "☁",
    chapter: "05 / cloud & server-side",
    headline: "MOVE THE WORK OFF THEIR MACHINES",
    body: "Queues, workers, schedulers and storage on infrastructure that scales down to nothing overnight. Heavy jobs run on servers, not on someone's laptop.",
    callouts: [
      { text: "queued background workers", x: 60, y: 28 },
      { text: "autoscaling + cost caps", x: 10, y: 68 },
    ],
  },
  {
    id: "automation",
    icon: "↻",
    chapter: "06 / automation & scraping",
    headline: "THE MANUAL STEP, DELETED",
    body: "Data pulled, cleaned, matched and pushed where it belongs on a schedule. The recurring three-hour Monday task becomes a log line.",
    callouts: [
      { text: "resilient extractors", x: 62, y: 70 },
      { text: "scheduled pipelines", x: 14, y: 24 },
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
   * PLACEHOLDER — drop a screenshot at /public/projects/<id>.png and set this
   * to `/projects/<id>.png`. Until then a generated abstract mock renders.
   */
  image?: string;
  hue: number;
};

export const projects: Project[] = [
  {
    id: "finance",
    name: "Finance & Expense Platform",
    tag: "erp",
    problem:
      "A growing operation ran its money through spreadsheets. Nobody could say what was owed this week without an afternoon of manual work.",
    build:
      "A double-entry ledger with invoicing, recurring billing, approval chains, and role-scoped reporting. Server-side jobs close the books nightly.",
    outcome:
      "Month-end went from days to a morning, and every figure traces back to the transaction that produced it.",
    stack: ["Next.js", "PostgreSQL", "Node", "Stripe"],
    hue: 24,
  },
  {
    id: "journaling",
    name: "Journaling & Reflection Platform",
    tag: "product",
    problem:
      "Consumer product needed to feel private and instant while still running AI analysis over deeply personal writing.",
    build:
      "Encrypted entry storage, streaming AI reflections, mood/topic extraction, and a background pipeline that builds long-term summaries without blocking the UI.",
    outcome:
      "Sub-second writing experience with AI insight that arrives asynchronously instead of making users wait.",
    stack: ["Next.js", "LLM API", "Queues", "Postgres"],
    hue: 265,
  },
  {
    id: "tenant-rag",
    name: "Tenant-Support RAG Assistant",
    tag: "ai / rag",
    problem:
      "A property operation drowned in repeat tenant questions already answered inside leases and policy PDFs.",
    build:
      "Document ingestion and chunking, vector retrieval with metadata filters per property, cited answers, and an escalation path to a human with full context attached.",
    outcome:
      "The bulk of routine enquiries resolve without staff touching them, and every answer points at the clause it came from.",
    stack: ["RAG", "Vector DB", "Embeddings", "Python"],
    hue: 172,
  },
  {
    id: "marketplace",
    name: "Cleaner Marketplace & Invoicing",
    tag: "marketplace",
    problem:
      "Two-sided service business coordinated jobs, cleaners and payments entirely by hand.",
    build:
      "Matching and dispatch, job lifecycle states, Stripe Connect payouts, automated invoicing, and a client portal with live job status.",
    outcome:
      "Booking to payout runs as one automated flow with no manual invoice ever written.",
    stack: ["Next.js", "Stripe Connect", "Node", "Postgres"],
    hue: 200,
  },
  {
    id: "voice-agent",
    name: "Inbound Voice Agent",
    tag: "voice",
    problem:
      "Missed calls outside office hours were quietly the largest source of lost revenue.",
    build:
      "A realtime speech agent that answers, qualifies, books into the live calendar, and hands off to staff with a transcript and summary when intent gets complex.",
    outcome:
      "Every call answered, with structured lead data landing in the CRM before the caller hangs up.",
    stack: ["Realtime STT/TTS", "LLM", "Telephony", "Webhooks"],
    hue: 330,
  },
  {
    id: "cooking",
    name: "Recipe & Meal Platform",
    tag: "content",
    problem:
      "A content-heavy cooking site needed search that understood intent, not just keywords, without a slow first paint.",
    build:
      "Structured recipe modelling, semantic search over ingredients and technique, image pipeline, and aggressive static generation with incremental revalidation.",
    outcome:
      "Fast pages, search that answers 'what can I make with what I have', and content editable by non-developers.",
    stack: ["Next.js", "Semantic Search", "CDN", "CMS"],
    hue: 40,
  },
  {
    id: "automation",
    name: "Automation & Data Pipelines",
    tag: "automation",
    problem:
      "Pricing and listing data lived on other people's websites and got copied by hand every week.",
    build:
      "Scheduled extractors with retry and drift detection, normalisation into a clean schema, deduplication, and delivery into the client's existing tools.",
    outcome:
      "A recurring multi-hour manual task became a scheduled job with alerting when a source changes shape.",
    stack: ["Python", "Playwright", "Cron", "Postgres"],
    hue: 96,
  },
];

export const about = {
  eyebrow: "[· about ·]",
  script: "the short version",
  headline: "Data structures first. Systems ever since.",
  paragraphs: [
    "I started in data structure engineering - the unglamorous work of making information sit in the right shape so everything built on top of it stays cheap and fast. That grounding never left.",
    "From there I moved into backend and full-stack AI engineering: APIs, queues, databases, retrieval pipelines, and the model layer sitting on top of all of it. I learned that most 'AI problems' are actually data-plumbing problems wearing a costume.",
    "Today I work as a full-stack AI engineer on a sliding scale - I can take a business from no system at all, to a working one, to one with AI genuinely bolted into the parts where it pays for itself. Small engagements and long builds both welcome.",
  ],
  facts: [
    { k: "focus", v: "AI systems, backend, cloud" },
    { k: "works with", v: "founders & operations teams" },
    { k: "engagements", v: "build · rescue · extend" },
    { k: "timezone", v: "PKT · overlaps EU & US-East" },
  ],
} as const;

export const processCards = [
  {
    id: "map",
    step: "01",
    title: "Map the actual problem",
    body: "Before any code: where does the work leak? I trace the real path a job takes through your business today, including the parts that live in someone's head.",
  },
  {
    id: "spine",
    step: "02",
    title: "Build the spine first",
    body: "Data model, auth, and the one workflow that matters most. You get something usable early, not a demo that collapses on real data.",
  },
  {
    id: "ai",
    step: "03",
    title: "Add AI where it pays",
    body: "Retrieval, agents and automation go in at the points with measurable return - not sprinkled across the product because it sounds modern.",
  },
  {
    id: "hand",
    step: "04",
    title: "Hand over something owned",
    body: "Documented, deployed, and yours. Infrastructure in your accounts, no black boxes, and a clear line for what happens when it needs to change.",
  },
] as const;

export const contact = {
  eyebrow: "[· contact ·]",
  headline: "Tell me what's broken.",
  sub: "No system, a system fighting you, or a working one that needs AI in it. Two ways in - pick whichever you prefer.",
  callHeading: "Book a call",
  callBody:
    "30 minutes, no pitch deck. Bring the messy version of the problem - that's the useful one.",
  callPoints: [
    "we map where the work actually leaks",
    "you leave with a build order, not a quote",
    "no obligation either way",
  ],
} as const;
