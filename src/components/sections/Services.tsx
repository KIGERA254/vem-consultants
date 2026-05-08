"use client";

// ============================================================
// VEM Consultants — src/components/sections/Services.tsx
// Responsive 3-column card grid driven by src/data/services.ts
// Staggered scroll-triggered reveal via framer-motion.
// Each card: icon · title · tagline · features · CTA arrow.
// ============================================================

import { useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  motion,
  useInView,
  AnimatePresence,
  type Variants,
} from "framer-motion";

import { cn } from "@/lib/utils";
import { services, type Service, type LucideIconName } from "@/data/services";
import Button from "@/components/ui/Button";

// ─── Animation variants ───────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Dynamic icon resolver ────────────────────────────────────

function DynamicIcon({
  name,
  className,
}: {
  name:      LucideIconName;
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name] as
    | React.FC<React.SVGProps<SVGSVGElement>>
    | undefined;

  if (!Icon) {
    // Fallback — render a generic briefcase icon
    const Fallback = LucideIcons.Briefcase;
    return <Fallback className={className} aria-hidden="true" />;
  }
  return <Icon className={className} aria-hidden="true" />;
}

// ─── ServiceCard ──────────────────────────────────────────────

function ServiceCard({
  service,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  service:   Service;
  index:     number;
  isHovered: boolean;
  onHover:   () => void;
  onLeave:   () => void;
}) {
  return (
    <motion.article
      variants={cardVariants}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocusCapture={onHover}
      onBlurCapture={onLeave}
      aria-label={service.title}
      className={cn(
        "group relative flex flex-col rounded-2xl",
        "border border-neutral-100 bg-white",
        "transition-all duration-350 ease-out",
        "overflow-hidden cursor-pointer",
        isHovered
          ? "shadow-card-hover -translate-y-2 border-brand-100"
          : "shadow-card hover:shadow-card-hover",
      )}
    >
      {/* Featured badge */}
      {service.featured && (
        <div className="absolute right-4 top-4 z-10">
          <span className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1",
            "bg-accent-500 text-[10px] font-bold uppercase tracking-wider text-white",
            "shadow-sm",
          )}>
            <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
            Popular
          </span>
        </div>
      )}

      {/* Top colour accent bar — reveals on hover */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 transition-all duration-300",
          isHovered ? "opacity-100" : "opacity-0",
        )}
        style={{
          background: `linear-gradient(90deg, var(--brand-500), var(--accent-500))`,
        }}
        aria-hidden="true"
      />

      {/* Card body */}
      <div className="flex flex-1 flex-col p-6 md:p-7">

        {/* Icon + engagement badge row */}
        <div className="mb-5 flex items-start justify-between">
          {/* Icon box */}
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            "transition-all duration-300",
            service.iconColors.bg,
            isHovered && service.iconColors.hoverBg,
          )}>
            <DynamicIcon
              name={service.icon}
              className={cn(
                "h-7 w-7 transition-colors duration-300",
                service.iconColors.text,
                isHovered && service.iconColors.hoverText,
              )}
            />
          </div>

          {/* Delivery time badge */}
          <span className={cn(
            "rounded-lg px-2.5 py-1 text-[11px] font-semibold",
            "bg-neutral-50 text-neutral-400 border border-neutral-100",
          )}>
            {service.deliveryTime}
          </span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "mb-2 text-lg font-bold leading-snug text-neutral-900",
            "transition-colors duration-200",
            isHovered && "text-brand-700",
          )}
          style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
        >
          {service.title}
        </h3>

        {/* Tagline */}
        <p className="mb-4 text-sm font-medium text-neutral-500 leading-relaxed">
          {service.tagline}
        </p>

        {/* Feature list — shows top 3 */}
        <ul className="mb-6 space-y-2 flex-1" role="list">
          {service.features.slice(0, 3).map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                  "transition-colors duration-200",
                  isHovered ? "bg-brand-500" : "bg-neutral-300",
                )}
                aria-hidden="true"
              />
              <span className="text-xs leading-relaxed text-neutral-500 line-clamp-2">
                {f.text}
              </span>
            </li>
          ))}
          {service.features.length > 3 && (
            <li className="text-xs font-medium text-neutral-400 pl-3.5">
              +{service.features.length - 3} more
            </li>
          )}
        </ul>

        {/* CTA row */}
        <div className={cn(
          "flex items-center justify-between",
          "pt-4 border-t border-neutral-100",
        )}>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {service.category.replace("-", " ")}
          </span>

          <a
            href={service.href}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5",
              "text-xs font-semibold text-brand-600",
              "transition-all duration-200",
              "hover:bg-brand-50",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-brand-500 focus-visible:ring-offset-2",
              "group/cta",
            )}
            aria-label={`Learn more about ${service.title}`}
          >
            Learn more
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>

      {/* Bottom fill — slides up on hover for featured */}
      {service.featured && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand-500 to-accent-500",
            "transition-all duration-300",
            isHovered ? "opacity-100" : "opacity-60",
          )}
          aria-hidden="true"
        />
      )}
    </motion.article>
  );
}

// ─── Category filter tabs ─────────────────────────────────────

const CATEGORIES = [
  { value: "all",        label: "All Services" },
  { value: "strategy",   label: "Strategy"     },
  { value: "finance",    label: "Finance"       },
  { value: "hr",         label: "HR & People"  },
  { value: "legal",      label: "Legal"         },
  { value: "operations", label: "Operations"   },
] as const;

type CategoryFilter = (typeof CATEGORIES)[number]["value"];

// ─── Main Component ───────────────────────────────────────────

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: "-60px" });

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [hoveredId, setHoveredId]           = useState<string | null>(null);

  const filtered =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className="section section-alt"
    >
      <div className="container-vem">

        {/* ── Section header ──────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="section-header"
        >
          <motion.span variants={fadeUp} className="section-label">
            What We Offer
          </motion.span>

          <motion.h2
            id="services-heading"
            variants={fadeUp}
            className="section-title"
          >
            Expert services built for{" "}
            <span className="text-brand-600">East African</span> growth
          </motion.h2>

          <motion.p variants={fadeUp} className="section-subtitle mx-auto">
            From first-day strategy through to long-term execution, our six
            core service lines cover every dimension of business success.
          </motion.p>
        </motion.div>

        {/* ── Category filter tabs ─────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mb-10 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Filter services by category"
        >
          {CATEGORIES.map((cat) => {
            const isActive  = activeCategory === cat.value;
            const hasInCat  = cat.value === "all"
              ? true
              : services.some((s) => s.category === cat.value);

            return (
              <button
                key={cat.value}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.value)}
                disabled={!hasInCat}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-semibold",
                  "transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  isActive
                    ? "bg-brand-500 text-white shadow-sm"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-brand-300 hover:text-brand-600",
                )}
              >
                {cat.label}
                {cat.value !== "all" && (
                  <span className={cn(
                    "ml-1.5 inline-flex h-4 w-4 items-center justify-center",
                    "rounded-full text-[10px] font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-neutral-100 text-neutral-500",
                  )}>
                    {services.filter((s) => s.category === cat.value).length}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Cards grid ──────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className={cn(
              "grid gap-5",
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            )}
            role="tabpanel"
            aria-label={`${activeCategory} services`}
          >
            {filtered.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                isHovered={hoveredId === service.id}
                onHover={() => setHoveredId(service.id)}
                onLeave={() => setHoveredId(null)}
              />
            ))}

            {/* Empty state */}
            {filtered.length === 0 && (
              <motion.div
                variants={fadeUp}
                className="col-span-full py-16 text-center"
              >
                <p className="text-neutral-400">
                  No services in this category yet.
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom CTA strip ─────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          transition={{ delay: 0.6 }}
          className={cn(
            "mt-14 flex flex-col items-center gap-5 rounded-3xl p-8 text-center",
            "border border-brand-100 bg-gradient-to-br from-brand-50 to-white",
            "sm:flex-row sm:justify-between sm:text-left",
          )}
        >
          <div>
            <p
              className="text-lg font-bold text-neutral-900"
              style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
            >
              Not sure which service fits your needs?
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Book a free 30-minute discovery call and we'll point you in the right direction.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Button
              href="/#contact"
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Book a Free Call
            </Button>
            <Button
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? "254700000000"}`}
              variant="ghost"
              size="md"
            >
              WhatsApp Us
            </Button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
