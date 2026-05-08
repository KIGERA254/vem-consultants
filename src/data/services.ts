// ============================================================
// VEM Consultants — src/data/services.ts
// All service data in one place. Components import from here
// so adding/editing a service updates the whole site at once.
// ============================================================

// ─── Types ────────────────────────────────────────────────────

/** Any valid lucide-react icon name (PascalCase) */
export type LucideIconName =
  | "Briefcase"
  | "TrendingUp"
  | "Users"
  | "Scale"
  | "BarChart3"
  | "ShieldCheck"
  | "Target"
  | "Lightbulb"
  | "Globe"
  | "Building2"
  | "FileText"
  | "HeartHandshake"
  | string; // allow custom extensions

export type ServiceCategory =
  | "strategy"
  | "finance"
  | "hr"
  | "legal"
  | "marketing"
  | "operations";

export interface ServiceFeature {
  /** Short bullet point shown on service detail cards */
  text: string;
}

export interface ServiceFAQ {
  question: string;
  answer:   string;
}

export interface ServiceProcess {
  step:        number;
  title:       string;
  description: string;
}

export interface Service {
  /** Unique slug — used for anchor links & future route paths */
  id:           string;
  /** Display title */
  title:        string;
  /** One-line tagline shown on the card */
  tagline:      string;
  /** Longer paragraph for detail views / hover states */
  description:  string;
  /** lucide-react icon name (PascalCase) */
  icon:         LucideIconName;
  /** Tailwind bg + text classes for the icon wrapper */
  iconColors:   { bg: string; text: string; hoverBg: string; hoverText: string };
  /** Anchor href on homepage or future sub-page */
  href:         string;
  category:     ServiceCategory;
  /** Key bullet points listed under the service */
  features:     ServiceFeature[];
  /** Delivery timeline shown on cards, e.g. "4 – 8 weeks" */
  deliveryTime: string;
  /** Approx engagement size — shown as a badge */
  engagementSize: "small" | "medium" | "large" | "enterprise";
  /** Highlight this service in the grid (larger card or featured badge) */
  featured?:    boolean;
  /** Step-by-step process for detail/modal view */
  process?:     ServiceProcess[];
  /** FAQs for detail/modal view */
  faqs?:        ServiceFAQ[];
}

// ─── Icon colour palettes (one per service) ────────────────────
// Tailwind classes — must be complete strings so Tailwind JIT
// includes them in the build (no dynamic string construction).

const PALETTES = {
  blue:   { bg: "bg-blue-50",   text: "text-blue-600",   hoverBg: "bg-blue-600",   hoverText: "text-white" },
  emerald:{ bg: "bg-emerald-50",text: "text-emerald-600",hoverBg: "bg-emerald-600",hoverText: "text-white" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", hoverBg: "bg-violet-600", hoverText: "text-white" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-600",  hoverBg: "bg-amber-600",  hoverText: "text-white" },
  rose:   { bg: "bg-rose-50",   text: "text-rose-600",   hoverBg: "bg-rose-600",   hoverText: "text-white" },
  cyan:   { bg: "bg-cyan-50",   text: "text-cyan-600",   hoverBg: "bg-cyan-600",   hoverText: "text-white" },
} as const;

// ─── Services Data ─────────────────────────────────────────────

export const services: Service[] = [
  // ── 1. Business Strategy ──────────────────────────────────
  {
    id:           "business-strategy",
    title:        "Business Strategy",
    tagline:      "Clarity, direction, and a roadmap built for growth.",
    description:
      "We work with founders, boards, and leadership teams to define a " +
      "compelling strategy, identify market opportunities, and build execution " +
      "roadmaps that translate vision into measurable results.",
    icon:         "Target",
    iconColors:   PALETTES.blue,
    href:         "/#services",
    category:     "strategy",
    featured:     true,
    deliveryTime: "4 – 8 weeks",
    engagementSize: "medium",
    features: [
      { text: "Market opportunity analysis & competitive benchmarking" },
      { text: "Vision, mission & OKR alignment workshops" },
      { text: "3-year strategic roadmap with quarterly milestones" },
      { text: "Business model design & revenue stream mapping" },
      { text: "Risk assessment & scenario planning" },
    ],
    process: [
      { step: 1, title: "Discovery",     description: "Deep-dive interviews with leadership and key stakeholders." },
      { step: 2, title: "Analysis",      description: "Market research, competitor benchmarking, and SWOT review." },
      { step: 3, title: "Strategy Lab",  description: "Facilitated workshops to co-create strategic priorities." },
      { step: 4, title: "Roadmap",       description: "Documented strategy deck with KPIs, owners, and timelines." },
      { step: 5, title: "Activation",    description: "Quarterly check-ins to track execution and adjust course." },
    ],
    faqs: [
      {
        question: "How long does a strategy engagement take?",
        answer:   "Most engagements run 4–8 weeks depending on organisation size and complexity.",
      },
      {
        question: "Do you work with early-stage startups?",
        answer:   "Yes. We have tailored packages for seed to Series A companies.",
      },
    ],
  },

  // ── 2. Financial Advisory ─────────────────────────────────
  {
    id:           "financial-advisory",
    title:        "Financial Advisory",
    tagline:      "Sound financial decisions backed by expert analysis.",
    description:
      "From financial modelling and investment structuring to fundraising " +
      "support and CFO-as-a-service, we give businesses the financial clarity " +
      "they need to grow confidently and attract capital.",
    icon:         "TrendingUp",
    iconColors:   PALETTES.emerald,
    href:         "/#services",
    category:     "finance",
    featured:     false,
    deliveryTime: "2 – 6 weeks",
    engagementSize: "medium",
    features: [
      { text: "Financial modelling & valuation analysis" },
      { text: "Fundraising strategy & investor deck preparation" },
      { text: "Cash flow forecasting & treasury management" },
      { text: "Mergers, acquisitions & due diligence support" },
      { text: "Fractional CFO retainer services" },
    ],
    process: [
      { step: 1, title: "Financial Audit",   description: "Review of existing financials, reporting, and controls." },
      { step: 2, title: "Modelling",         description: "Build robust financial models tailored to your business." },
      { step: 3, title: "Advisory",          description: "Ongoing guidance on decisions, deals, and capital strategy." },
      { step: 4, title: "Investor Readiness",description: "Pitch deck, data room setup, and investor introductions." },
    ],
    faqs: [
      {
        question: "Can you help us raise funding?",
        answer:   "Yes — we support pre-seed through Series B fundraising, including investor introductions.",
      },
      {
        question: "What does a fractional CFO engagement look like?",
        answer:   "Typically 2–3 days per month: board prep, financial reporting, and strategic input.",
      },
    ],
  },

  // ── 3. HR & People Strategy ───────────────────────────────
  {
    id:           "hr-people-strategy",
    title:        "HR & People Strategy",
    tagline:      "Build teams that perform, stay, and grow.",
    description:
      "We design people strategies that attract top talent, improve " +
      "retention, and build high-performance cultures. From org-design " +
      "and job architecture to payroll compliance and leadership coaching.",
    icon:         "Users",
    iconColors:   PALETTES.violet,
    href:         "/#services",
    category:     "hr",
    featured:     false,
    deliveryTime: "3 – 10 weeks",
    engagementSize: "medium",
    features: [
      { text: "Organisational design & restructuring" },
      { text: "Talent acquisition & executive recruitment" },
      { text: "Performance management system design" },
      { text: "Compensation benchmarking & grading structures" },
      { text: "HR policy development & labour law compliance" },
    ],
    process: [
      { step: 1, title: "People Audit",    description: "Assess current HR practices, org structure, and pain points." },
      { step: 2, title: "Design",          description: "Co-create new structures, policies, and talent frameworks." },
      { step: 3, title: "Implementation",  description: "Rollout support including manager training and comms." },
      { step: 4, title: "Review",          description: "30/60/90-day check-ins to embed changes." },
    ],
    faqs: [
      {
        question: "Do you handle recruitment end-to-end?",
        answer:   "Yes — from job profiling and sourcing through to offer negotiation and onboarding.",
      },
      {
        question: "Can you help with Kenyan labour law compliance?",
        answer:   "Absolutely. We review and update employment contracts and HR policies to Kenya Employment Act standards.",
      },
    ],
  },

  // ── 4. Legal Advisory ─────────────────────────────────────
  {
    id:           "legal-advisory",
    title:        "Legal Advisory",
    tagline:      "Navigate regulation with confidence.",
    description:
      "Our legal advisory service helps businesses structure correctly, " +
      "draft watertight contracts, and stay compliant with evolving " +
      "regulation across Kenya and East Africa — without the cost of " +
      "a full-time in-house counsel.",
    icon:         "Scale",
    iconColors:   PALETTES.amber,
    href:         "/#services",
    category:     "legal",
    featured:     false,
    deliveryTime: "1 – 4 weeks",
    engagementSize: "small",
    features: [
      { text: "Business registration & corporate structuring" },
      { text: "Contract drafting, review & negotiation" },
      { text: "Regulatory compliance & licensing" },
      { text: "Intellectual property protection" },
      { text: "Employment law & dispute advisory" },
    ],
    process: [
      { step: 1, title: "Legal Review",    description: "Audit existing contracts, structure, and compliance gaps." },
      { step: 2, title: "Advice",          description: "Clear, jargon-free guidance on your legal position." },
      { step: 3, title: "Documentation",   description: "Drafting or redlining contracts and compliance documents." },
      { step: 4, title: "Ongoing Support", description: "Retainer option for continued legal access." },
    ],
    faqs: [
      {
        question: "Are you a law firm?",
        answer:   "We are a consulting firm with qualified legal advisors. For litigation, we partner with accredited law firms.",
      },
      {
        question: "Can you help register a business in Kenya?",
        answer:   "Yes — we handle Business Registration Service (BRS) filings, KRA PIN, and sector-specific licensing.",
      },
    ],
  },

  // ── 5. Market Entry & Expansion ───────────────────────────
  {
    id:           "market-entry",
    title:        "Market Entry & Expansion",
    tagline:      "Enter new markets with data, not guesswork.",
    description:
      "Thinking of expanding into East or Southern Africa? We deliver " +
      "in-depth market intelligence, entry strategy, partner identification, " +
      "and on-the-ground support to make your expansion fast, cost-effective, " +
      "and low-risk.",
    icon:         "Globe",
    iconColors:   PALETTES.cyan,
    href:         "/#services",
    category:     "strategy",
    featured:     false,
    deliveryTime: "6 – 12 weeks",
    engagementSize: "large",
    features: [
      { text: "Country-level market sizing & feasibility studies" },
      { text: "Regulatory landscape & entry requirements" },
      { text: "Competitor mapping & white-space analysis" },
      { text: "Distribution & channel partner identification" },
      { text: "Go-to-market plan with budget & timeline" },
    ],
    process: [
      { step: 1, title: "Scoping",         description: "Define target markets, timelines, and success criteria." },
      { step: 2, title: "Research",        description: "Primary and secondary market research in-country." },
      { step: 3, title: "Strategy",        description: "Entry mode, pricing, and channel recommendations." },
      { step: 4, title: "Activation",      description: "Partner intros, regulatory filings, and launch support." },
    ],
    faqs: [
      {
        question: "Which markets do you cover?",
        answer:   "Kenya, Uganda, Tanzania, Rwanda, Ethiopia, and South Africa primarily, with broader African coverage on request.",
      },
      {
        question: "How long does a market entry study take?",
        answer:   "A full feasibility study typically takes 6–8 weeks from kick-off to final report.",
      },
    ],
  },

  // ── 6. Monitoring, Evaluation & Learning ─────────────────
  {
    id:           "mel-services",
    title:        "Monitoring & Evaluation",
    tagline:      "Measure what matters. Learn. Improve.",
    description:
      "We design and implement MEL frameworks that give organisations — " +
      "from private sector to NGOs and development agencies — clear evidence " +
      "of impact, enabling smarter decisions and stronger donor or board " +
      "reporting.",
    icon:         "BarChart3",
    iconColors:   PALETTES.rose,
    href:         "/#services",
    category:     "operations",
    featured:     false,
    deliveryTime: "4 – 8 weeks",
    engagementSize: "medium",
    features: [
      { text: "MEL framework & results chain design" },
      { text: "Key Performance Indicator (KPI) definition" },
      { text: "Data collection tools & survey design" },
      { text: "Baseline, midline & endline evaluations" },
      { text: "Impact reports & donor-ready dashboards" },
    ],
    process: [
      { step: 1, title: "Framework Design",  description: "Co-create a theory of change and results framework." },
      { step: 2, title: "Indicator Selection",description: "Define SMART KPIs aligned to programme objectives." },
      { step: 3, title: "Data Systems",      description: "Build or integrate data collection and management tools." },
      { step: 4, title: "Reporting",         description: "Periodic evaluation reports and learning workshops." },
    ],
    faqs: [
      {
        question: "Do you work with NGOs and donor-funded programmes?",
        answer:   "Yes — we have extensive experience with USAID, FCDO, GIZ, and Gates Foundation-funded projects.",
      },
      {
        question: "Can you build a data dashboard for our team?",
        answer:   "Absolutely. We can deliver live dashboards in Power BI, Google Looker Studio, or custom web tools.",
      },
    ],
  },
];

// ─── Derived helpers ───────────────────────────────────────────

/** All services marked as featured */
export const featuredServices = services.filter((s) => s.featured);

/** Look up a service by its id slug */
export const getServiceById = (id: string): Service | undefined =>
  services.find((s) => s.id === id);

/** Filter services by category */
export const getServicesByCategory = (category: ServiceCategory): Service[] =>
  services.filter((s) => s.category === category);

/** Total number of services — useful for dynamic UI labels */
export const serviceCount = services.length;
