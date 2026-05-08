"use client";

// ============================================================
// VEM Consultants — src/components/shared/ServiceCard.tsx
// Reusable card used in Services.tsx grid and anywhere else
// a service needs to be displayed (featured section, modals, etc.)
//
// Variants:
//   "default"  — standard grid card with icon, title, features
//   "compact"  — smaller horizontal card for sidebars / lists
//   "featured" — larger hero-style card with process steps
// ============================================================

import { useState } from "react";
import * as LucideIcons from "lucide-react";
import {
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

import { cn }               from "@/lib/utils";
import type { Service, LucideIconName } from "@/data/services";
import Button               from "@/components/ui/Button";

// ─── Types ────────────────────────────────────────────────────

export type ServiceCardVariant = "default" | "compact" | "featured";

export interface ServiceCardProps {
  service:    Service;
  variant?:   ServiceCardVariant;
  /** Show process steps — only meaningful in "featured" variant */
  showProcess?: boolean;
  /** Animation delay in seconds for staggered grids */
  animationDelay?: number;
  className?: string;
}

// ─── Animation variants ───────────────────────────────────────

const cardAnim: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Dynamic icon resolver ────────────────────────────────────

function DynamicIcon({
  name,
  className,
}: {
  name:       LucideIconName;
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name] as
    | React.FC<React.SVGProps<SVGSVGElement>>
    | undefined;

  const Fallback = LucideIcons.Briefcase;
  const Resolved = Icon ?? Fallback;
  return <Resolved className={className} aria-hidden="true" />;
}

// ─── Engagement size badge label ──────────────────────────────

const ENGAGEMENT_LABELS: Record<Service["engagementSize"], string> = {
  small:      "Small",
  medium:     "Medium",
  large:      "Large",
  enterprise: "Enterprise",
};

// ─── DEFAULT variant ──────────────────────────────────────────

function DefaultCard({
  service,
  animationDelay = 0,
  className,
}: ServiceCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      variants={cardAnim}
      transition={{ delay: animationDelay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
      aria-label={`${service.title} — ${service.tagline}`}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "border border-neutral-100 bg-white",
        "shadow-card transition-all duration-300",
        hovered && "shadow-card-hover -translate-y-1.5 border-brand-100",
        className,
      )}
    >
      {/* Top accent line — slides in on hover */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 transition-opacity duration-300",
          hovered ? "opacity-100" : "opacity-0",
        )}
        style={{ background: "linear-gradient(90deg, #2563eb, #f59e0b)" }}
        aria-hidden="true"
      />

      {/* Hover bg glow */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-brand-50/60 to-transparent",
          "opacity-0 transition-opacity duration-300",
          hovered && "opacity-100",
        )}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 flex-col p-6 md:p-7">

        {/* Header row: icon + badges */}
        <div className="mb-5 flex items-start justify-between gap-3">
          {/* Icon */}
          <div className={cn(
            "flex h-13 w-13 items-center justify-center rounded-xl shrink-0",
            "transition-all duration-300",
            service.iconColors.bg,
            hovered && service.iconColors.hoverBg,
          )}>
            <DynamicIcon
              name={service.icon}
              className={cn(
                "h-6 w-6 transition-colors duration-300",
                service.iconColors.text,
                hovered && service.iconColors.hoverText,
              )}
            />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {/* Featured badge */}
            {service.featured && (
              <span className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-0.5",
                "bg-accent-500 text-[10px] font-bold uppercase tracking-wider text-white",
              )}>
                <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
                Popular
              </span>
            )}
            {/* Delivery time */}
            <span className="flex items-center gap-1 rounded-lg border border-neutral-100 bg-neutral-50 px-2 py-1 text-[11px] font-medium text-neutral-400">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {service.deliveryTime}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "mb-1.5 text-lg font-bold leading-snug transition-colors duration-200",
            hovered ? "text-brand-700" : "text-neutral-900",
          )}
          style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
        >
          {service.title}
        </h3>

        {/* Tagline */}
        <p className="mb-4 text-sm font-medium leading-relaxed text-neutral-500">
          {service.tagline}
        </p>

        {/* Feature bullets — top 3 */}
        <ul className="mb-6 flex-1 space-y-2" role="list">
          {service.features.slice(0, 3).map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2
                className={cn(
                  "mt-0.5 h-3.5 w-3.5 shrink-0 transition-colors duration-200",
                  hovered ? "text-brand-500" : "text-neutral-300",
                )}
                aria-hidden="true"
              />
              <span className="text-xs leading-relaxed text-neutral-500 line-clamp-2">
                {f.text}
              </span>
            </li>
          ))}
          {service.features.length > 3 && (
            <li className="pl-5 text-xs font-medium text-neutral-400">
              +{service.features.length - 3} more included
            </li>
          )}
        </ul>

        {/* Footer: category + CTA */}
        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            {service.category.replace(/-/g, " ")}
          </span>
          <a
            href={service.href}
            className={cn(
              "group/link flex items-center gap-1.5 rounded-lg px-3 py-1.5",
              "text-xs font-semibold text-brand-600",
              "transition-all duration-200 hover:bg-brand-50",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-brand-500 focus-visible:ring-offset-1",
            )}
            aria-label={`Learn more about ${service.title}`}
          >
            Learn more
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>

      {/* Bottom gradient bar — featured cards only */}
      {service.featured && (
        <div
          className="h-1 w-full bg-gradient-to-r from-brand-500 to-accent-500"
          aria-hidden="true"
        />
      )}
    </motion.article>
  );
}

// ─── COMPACT variant ──────────────────────────────────────────

function CompactCard({ service, animationDelay = 0, className }: ServiceCardProps) {
  return (
    <motion.article
      variants={cardAnim}
      transition={{ delay: animationDelay }}
      aria-label={service.title}
      className={cn(
        "group flex items-center gap-4 rounded-xl p-4",
        "border border-neutral-100 bg-white",
        "shadow-sm transition-all duration-200",
        "hover:border-brand-200 hover:shadow-card hover:-translate-y-0.5",
        "cursor-pointer",
        className,
      )}
    >
      {/* Icon */}
      <div className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
        "transition-colors duration-200",
        service.iconColors.bg,
        "group-hover:" + service.iconColors.hoverBg,
      )}>
        <DynamicIcon
          name={service.icon}
          className={cn(
            "h-5 w-5 transition-colors duration-200",
            service.iconColors.text,
          )}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className="truncate text-sm font-bold text-neutral-900 group-hover:text-brand-700 transition-colors duration-200"
          style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
        >
          {service.title}
        </p>
        <p className="truncate text-xs text-neutral-500">{service.tagline}</p>
      </div>

      {/* Arrow */}
      <ChevronRight
        className="h-4 w-4 shrink-0 text-neutral-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand-400"
        aria-hidden="true"
      />
    </motion.article>
  );
}

// ─── FEATURED variant ─────────────────────────────────────────

function FeaturedCard({
  service,
  showProcess = true,
  animationDelay = 0,
  className,
}: ServiceCardProps) {
  return (
    <motion.article
      variants={cardAnim}
      transition={{ delay: animationDelay }}
      aria-label={`Featured: ${service.title}`}
      className={cn(
        "group relative flex flex-col rounded-3xl overflow-hidden",
        "border border-neutral-100 bg-white",
        "shadow-card-hover",
        className,
      )}
    >
      {/* Coloured top band */}
      <div
        className="h-2 w-full bg-gradient-to-r from-brand-500 to-accent-500"
        aria-hidden="true"
      />

      <div className="flex flex-1 flex-col p-8">
        {/* Icon + featured badge */}
        <div className="mb-6 flex items-start justify-between">
          <div className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl",
            service.iconColors.bg,
          )}>
            <DynamicIcon
              name={service.icon}
              className={cn("h-8 w-8", service.iconColors.text)}
            />
          </div>
          <span className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1",
            "bg-accent-50 text-xs font-bold text-accent-700",
            "border border-accent-200",
          )}>
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Most Popular
          </span>
        </div>

        {/* Title + tagline */}
        <h3
          className="mb-2 text-2xl font-black leading-snug text-neutral-900"
          style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
        >
          {service.title}
        </h3>
        <p className="mb-6 text-base leading-relaxed text-neutral-500">
          {service.description}
        </p>

        {/* All features */}
        <ul className="mb-6 space-y-2.5" role="list">
          {service.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
                aria-hidden="true"
              />
              <span className="text-sm leading-relaxed text-neutral-600">{f.text}</span>
            </li>
          ))}
        </ul>

        {/* Process steps */}
        {showProcess && service.process && service.process.length > 0 && (
          <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
              Our Process
            </p>
            <ol className="space-y-2.5" role="list">
              {service.process.map((step) => (
                <li key={step.step} className="flex items-start gap-3">
                  <span className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    "bg-brand-500 text-[11px] font-bold text-white",
                  )}>
                    {step.step}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-neutral-800">
                      {step.title}
                    </span>
                    <span className="ml-1.5 text-sm text-neutral-500">
                      — {step.description}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Meta row */}
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-500">
            ⏱ {service.deliveryTime}
          </span>
          <span className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-500 capitalize">
            📊 {ENGAGEMENT_LABELS[service.engagementSize]} engagement
          </span>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Button
            href="/#contact"
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            Get Started with {service.title}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Public component ─────────────────────────────────────────

export default function ServiceCard(props: ServiceCardProps) {
  const variant = props.variant ?? "default";

  if (variant === "compact")  return <CompactCard  {...props} />;
  if (variant === "featured") return <FeaturedCard {...props} />;
  return <DefaultCard {...props} />;
}
