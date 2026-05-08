"use client";

// ============================================================
// VEM Consultants — src/components/sections/WhyChooseUs.tsx
// Dark-background section with 4 value propositions,
// icon grid, animated reveals, and a testimonial strip.
// ============================================================

import { useRef } from "react";
import {
  motion,
  useInView,
  type Variants,
} from "framer-motion";
import {
  ShieldCheck,
  MapPin,
  Users,
  Zap,
  Star,
  ArrowRight,
  CheckCircle2,
  Quote,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { testimonials, stats } from "@/data/site";
import Button from "@/components/ui/Button";

// ─── Animation variants ───────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Value propositions data ──────────────────────────────────

const VALUE_PROPS = [
  {
    id:      "expert-team",
    icon:    Users,
    title:   "Multidisciplinary Expert Team",
    body:    "15+ specialists across strategy, finance, HR, legal, and MEL — working as one integrated team on your engagement, not siloed departments.",
    bullets: [
      "CPA-certified financial advisors",
      "Qualified HR & legal practitioners",
      "Seasoned strategy consultants",
    ],
    accent: "from-blue-500/20 to-blue-600/5",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    borderAccent: "border-blue-500/20",
  },
  {
    id:      "proven-track",
    icon:    ShieldCheck,
    title:   "Proven Track Record",
    body:    "Over a decade delivering measurable results for 200+ clients — from seed-stage startups to multinational corporations and development-finance institutions.",
    bullets: [
      "95% client satisfaction rate",
      "200+ successful engagements",
      "Private sector, NGO & DFI clients",
    ],
    accent: "from-amber-500/20 to-amber-600/5",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    borderAccent: "border-amber-500/20",
  },
  {
    id:      "local-knowledge",
    icon:    MapPin,
    title:   "Deep Local Market Knowledge",
    body:    "Born and built in East Africa. We combine on-the-ground market intelligence across Kenya, Uganda, Tanzania, Rwanda, and Ethiopia with globally-benchmarked methodologies.",
    bullets: [
      "In-country presence in 5 markets",
      "Regulatory & compliance expertise",
      "Established government relationships",
    ],
    accent: "from-emerald-500/20 to-emerald-600/5",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    borderAccent: "border-emerald-500/20",
  },
  {
    id:      "execution",
    icon:    Zap,
    title:   "Execution-First Philosophy",
    body:    "We don't just hand over reports and disappear. Every engagement includes implementation support, accountability check-ins, and a commitment to seeing results materialise.",
    bullets: [
      "Hands-on implementation support",
      "Quarterly progress accountability",
      "Flexible retainer & project models",
    ],
    accent: "from-violet-500/20 to-violet-600/5",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    borderAccent: "border-violet-500/20",
  },
] as const;

// ─── Sub-components ───────────────────────────────────────────

/** Single value-prop card */
function ValueCard({
  prop,
  index,
}: {
  prop:  (typeof VALUE_PROPS)[number];
  index: number;
}) {
  const Icon = prop.icon;

  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay: index * 0.08 }}
      className={cn(
        "group relative flex flex-col rounded-2xl p-6 md:p-7",
        "border bg-white/5 backdrop-blur-sm",
        "transition-all duration-350",
        "hover:bg-white/10 hover:-translate-y-1",
        prop.borderAccent,
      )}
    >
      {/* Radial gradient glow on hover */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100",
          `bg-gradient-to-br ${prop.accent}`,
        )}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Icon */}
        <div className={cn(
          "mb-5 flex h-12 w-12 items-center justify-center rounded-xl",
          "transition-transform duration-300 group-hover:scale-110",
          prop.iconBg,
        )}>
          <Icon
            className={cn("h-6 w-6", prop.iconColor)}
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        <h3
          className="mb-3 text-lg font-bold leading-snug text-white"
          style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
        >
          {prop.title}
        </h3>

        {/* Body */}
        <p className="mb-5 text-sm leading-relaxed text-white/55 flex-1">
          {prop.body}
        </p>

        {/* Bullet points */}
        <ul className="space-y-2" role="list">
          {prop.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <CheckCircle2
                className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", prop.iconColor)}
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-white/65">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/** Star rating display */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating
              ? "fill-accent-400 text-accent-400"
              : "fill-white/10 text-white/10",
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/** Single testimonial card */
function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number];
}) {
  return (
    <motion.div
      variants={scaleIn}
      className={cn(
        "relative flex flex-col rounded-2xl p-5",
        "border border-white/8 bg-white/5 backdrop-blur-sm",
        "transition-all duration-300 hover:bg-white/10",
      )}
    >
      {/* Quote icon */}
      <Quote
        className="absolute right-4 top-4 h-8 w-8 rotate-180 text-white/8"
        aria-hidden="true"
      />

      {/* Stars */}
      <StarRating rating={testimonial.rating} />

      {/* Quote text */}
      <blockquote className="relative z-10 mt-3 mb-4 text-sm italic leading-relaxed text-white/65">
        "{testimonial.quote}"
      </blockquote>

      {/* Attribution */}
      <footer className="mt-auto flex items-center gap-3">
        {/* Avatar */}
        <div className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center",
          "rounded-full bg-brand-500/40 text-xs font-bold text-white",
        )}>
          {testimonial.author.charAt(0)}
        </div>
        <div>
          <cite className="block text-xs font-semibold not-italic text-white/85">
            {testimonial.author}
          </cite>
          <span className="text-[11px] text-white/45">
            {testimonial.role}, {testimonial.company}
          </span>
        </div>
      </footer>
    </motion.div>
  );
}

/** Floating metric badge */
function MetricBadge({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay }}
      className={cn(
        "flex flex-col items-center rounded-2xl px-6 py-4",
        "border border-white/10 bg-white/8 backdrop-blur-sm",
      )}
    >
      <span
        className="text-3xl font-black leading-none text-white"
        style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
      >
        {value}
      </span>
      <span className="mt-1 text-center text-[11px] font-medium uppercase tracking-wider text-white/45">
        {label}
      </span>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────

export default function WhyChooseUs() {
  const sectionRef       = useRef<HTMLElement>(null);
  const headerRef        = useRef<HTMLDivElement>(null);
  const cardsRef         = useRef<HTMLDivElement>(null);
  const testimonialsRef  = useRef<HTMLDivElement>(null);

  const headerInView       = useInView(headerRef,       { once: true, margin: "-60px" });
  const cardsInView        = useInView(cardsRef,        { once: true, margin: "-60px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      id="why-us"
      aria-labelledby="why-us-heading"
      className="relative overflow-hidden bg-brand-900"
    >

      {/* ── Background effects ──────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Large blue glow — top left */}
        <div className="absolute -left-48 -top-48 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        {/* Gold glow — bottom right */}
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-accent-500/10 blur-3xl" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />
        {/* Top separator gradient */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {/* Bottom separator gradient */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative section container-vem">

        {/* ══════════════════════════════════════════════════
            Section header
        ══════════════════════════════════════════════════ */}
        <motion.div
          ref={headerRef}
          variants={containerVariants}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="section-header"
        >
          <motion.span variants={fadeUp} className="section-label text-blue-300">
            Why VEM
          </motion.span>

          <motion.h2
            id="why-us-heading"
            variants={fadeUp}
            className="section-title-light"
          >
            The VEM difference —
            <br className="hidden sm:block" />
            <span className="text-accent-400"> four things</span> that set us apart
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="section-subtitle-light mx-auto"
          >
            Great consulting is about more than advice. It's about partnership,
            accountability, and results that actually show up in your numbers.
          </motion.p>

          {/* Quick metric strip */}
          <motion.div
            variants={containerVariants}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {stats.map((s, i) => (
              <MetricBadge
                key={s.label}
                value={`${s.value}${s.suffix ?? ""}`}
                label={s.label}
                delay={0.3 + i * 0.07}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* ══════════════════════════════════════════════════
            4-card value proposition grid
        ══════════════════════════════════════════════════ */}
        <motion.div
          ref={cardsRef}
          variants={containerVariants}
          initial="hidden"
          animate={cardsInView ? "show" : "hidden"}
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {VALUE_PROPS.map((prop, i) => (
            <ValueCard key={prop.id} prop={prop} index={i} />
          ))}
        </motion.div>

        {/* ══════════════════════════════════════════════════
            Divider
        ══════════════════════════════════════════════════ */}
        <div
          className="my-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          aria-hidden="true"
        />

        {/* ══════════════════════════════════════════════════
            Testimonials strip
        ══════════════════════════════════════════════════ */}
        <motion.div
          ref={testimonialsRef}
          variants={containerVariants}
          initial="hidden"
          animate={testimonialsInView ? "show" : "hidden"}
        >
          {/* Heading */}
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
              What our clients say
            </p>
          </motion.div>

          {/* Testimonial cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════
            Bottom CTA
        ══════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          transition={{ delay: 0.7 }}
          className={cn(
            "mt-16 flex flex-col items-center gap-6 rounded-3xl p-10 text-center",
            "border border-white/10 bg-white/5 backdrop-blur-sm",
            "relative overflow-hidden",
          )}
        >
          {/* Glow behind CTA */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-accent-500/5"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <p
              className="mb-2 text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
            >
              Ready to experience the VEM difference?
            </p>
            <p className="mx-auto max-w-lg text-sm text-white/55">
              Join 200+ businesses across East Africa that trust VEM Consultants
              to deliver strategy that actually works.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              href="/#contact"
              variant="accent"
              size="lg"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Start a Conversation
            </Button>
            <Button
              href="/#services"
              variant="outline-light"
              size="lg"
            >
              View All Services
            </Button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
