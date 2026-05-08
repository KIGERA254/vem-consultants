"use client";

// ============================================================
// VEM Consultants — src/components/shared/BookingCTA.tsx
// Full-width CTA banner placed between homepage sections.
// Three visual variants: gradient (default), light, minimal.
// Fully driven by props — reusable across any page.
// ============================================================

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  ArrowRight,
  Phone,
  CalendarDays,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import { cn }           from "@/lib/utils";
import { contact }      from "@/data/site";
import { whatsappHref } from "@/data/site";
import Button           from "@/components/ui/Button";

// ─── Types ────────────────────────────────────────────────────

export type BookingCTAVariant = "gradient" | "light" | "minimal";

export interface BookingCTAProps {
  /** Main headline */
  heading?:     string;
  /** Supporting copy */
  subheading?:  string;
  /** Primary button label */
  primaryLabel?:  string;
  /** Primary button href */
  primaryHref?:   string;
  /** Secondary button label — defaults to WhatsApp */
  secondaryLabel?: string;
  /** Secondary button href — defaults to WhatsApp link */
  secondaryHref?:  string;
  /** Visual style */
  variant?:     BookingCTAVariant;
  /** Show the 3 quick-contact method icons */
  showContactMethods?: boolean;
  className?:   string;
}

// ─── Animation variants ───────────────────────────────────────

const containerAnim: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show:   { opacity: 1, scale: 1,  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Contact method pills ─────────────────────────────────────

const CONTACT_METHODS = [
  {
    id:    "call",
    icon:  Phone,
    label: "Call us",
    value: (c: typeof contact) => c.phoneDisplay,
    href:  (c: typeof contact) => `tel:${c.phone}`,
    color: "text-blue-400",
  },
  {
    id:    "whatsapp",
    icon:  MessageSquare,
    label: "WhatsApp",
    value: () => "Chat instantly",
    href:  () => whatsappHref(),
    color: "text-green-400",
  },
  {
    id:    "book",
    icon:  CalendarDays,
    label: "Book a call",
    value: () => "Free 30 min",
    href:  () => "/#contact",
    color: "text-amber-400",
  },
] as const;

// ─── Gradient variant (default) ───────────────────────────────

function GradientCTA({
  heading,
  subheading,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  showContactMethods,
  inView,
}: Required<Omit<BookingCTAProps, "variant" | "className">> & { inView: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-brand-900 px-8 py-14 md:px-16 md:py-16">

      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent-500/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Top separator */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <motion.div
        variants={containerAnim}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Eyebrow pill */}
        <motion.div variants={fadeUp} className="mb-6">
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-1.5",
            "border border-white/15 bg-white/8 backdrop-blur-sm",
            "text-xs font-semibold uppercase tracking-[0.18em] text-white/65",
          )}>
            <Sparkles className="h-3 w-3 text-accent-400" aria-hidden="true" />
            Free Consultation Available
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          className="mb-4 max-w-2xl text-balance text-3xl font-black leading-tight text-white md:text-4xl lg:text-5xl"
          style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
        >
          {heading}
        </motion.h2>

        {/* Subheading */}
        <motion.p
          variants={fadeUp}
          className="mb-10 max-w-xl text-base leading-relaxed text-white/55 md:text-lg"
        >
          {subheading}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          className="mb-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button
            href={primaryHref}
            variant="accent"
            size="lg"
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            {primaryLabel}
          </Button>
          <Button
            href={secondaryHref}
            variant="outline-light"
            size="lg"
            target={secondaryHref.startsWith("http") ? "_blank" : undefined}
            rel={secondaryHref.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {secondaryLabel}
          </Button>
        </motion.div>

        {/* Contact methods */}
        {showContactMethods && (
          <motion.div
            variants={containerAnim}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {CONTACT_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <motion.a
                  key={method.id}
                  variants={scaleIn}
                  href={method.href(contact)}
                  target={method.id === "whatsapp" ? "_blank" : undefined}
                  rel={method.id === "whatsapp" ? "noopener noreferrer" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-4 py-2.5",
                    "border border-white/10 bg-white/6 backdrop-blur-sm",
                    "transition-all duration-200 hover:bg-white/12 hover:-translate-y-0.5",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-white/40 focus-visible:ring-offset-2",
                    "focus-visible:ring-offset-brand-900",
                  )}
                >
                  <Icon
                    className={cn("h-4 w-4 shrink-0", method.color)}
                    aria-hidden="true"
                  />
                  <div className="text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                      {method.label}
                    </p>
                    <p className="text-xs font-semibold text-white/80">
                      {method.value(contact)}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Light variant ────────────────────────────────────────────

function LightCTA({
  heading,
  subheading,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  showContactMethods,
  inView,
}: Required<Omit<BookingCTAProps, "variant" | "className">> & { inView: boolean }) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl px-8 py-12 md:px-14 md:py-14",
      "border border-brand-100 bg-gradient-to-br from-brand-50 to-white",
    )}>
      {/* Decorative corner accent */}
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-100/60 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-accent-100/40 blur-2xl"
        aria-hidden="true"
      />

      <motion.div
        variants={containerAnim}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="relative z-10 flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left"
      >
        {/* Text block */}
        <div className="mb-8 md:mb-0 md:mr-12 md:max-w-lg">
          <motion.h2
            variants={fadeUp}
            className="mb-3 text-2xl font-black leading-tight text-neutral-900 md:text-3xl"
            style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
          >
            {heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm leading-relaxed text-neutral-500 md:text-base">
            {subheading}
          </motion.p>

          {/* Contact methods — horizontal on desktop */}
          {showContactMethods && (
            <motion.div
              variants={containerAnim}
              className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start"
            >
              {CONTACT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <motion.a
                    key={method.id}
                    variants={scaleIn}
                    href={method.href(contact)}
                    target={method.id === "whatsapp" ? "_blank" : undefined}
                    rel={method.id === "whatsapp" ? "noopener noreferrer" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2",
                      "text-xs font-semibold text-neutral-600",
                      "shadow-sm transition-all duration-200 hover:border-brand-300 hover:text-brand-600 hover:-translate-y-0.5",
                    )}
                  >
                    <Icon className={cn("h-3.5 w-3.5 shrink-0", method.color)} aria-hidden="true" />
                    {method.value(contact)}
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Buttons */}
        <motion.div
          variants={fadeUp}
          className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row"
        >
          <Button
            href={primaryHref}
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            {primaryLabel}
          </Button>
          <Button
            href={secondaryHref}
            variant="outline"
            size="lg"
            target={secondaryHref.startsWith("http") ? "_blank" : undefined}
            rel={secondaryHref.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {secondaryLabel}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Minimal variant ──────────────────────────────────────────

function MinimalCTA({
  heading,
  subheading,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  inView,
}: Required<Omit<BookingCTAProps, "variant" | "className" | "showContactMethods">> & { inView: boolean }) {
  return (
    <motion.div
      variants={containerAnim}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="flex flex-col items-center gap-6 py-4 text-center md:flex-row md:justify-between md:text-left"
    >
      <div className="md:max-w-lg">
        <motion.p
          variants={fadeUp}
          className="text-lg font-bold text-neutral-900 md:text-xl"
          style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
        >
          {heading}
        </motion.p>
        <motion.p variants={fadeUp} className="mt-1 text-sm text-neutral-500">
          {subheading}
        </motion.p>
      </div>

      <motion.div
        variants={fadeUp}
        className="flex shrink-0 flex-wrap items-center gap-3"
      >
        <Button
          href={primaryHref}
          variant="primary"
          size="md"
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          {primaryLabel}
        </Button>
        <Button
          href={secondaryHref}
          variant="ghost"
          size="md"
          target={secondaryHref.startsWith("http") ? "_blank" : undefined}
          rel={secondaryHref.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {secondaryLabel}
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─── Public component ─────────────────────────────────────────

export default function BookingCTA({
  heading      = "Ready to grow your business?",
  subheading   = "Book a free 30-minute discovery call and let's explore how VEM Consultants can help you reach your next milestone.",
  primaryLabel  = "Book a Free Consultation",
  primaryHref   = "/#contact",
  secondaryLabel = "Chat on WhatsApp",
  secondaryHref  = whatsappHref(),
  variant        = "gradient",
  showContactMethods = true,
  className,
}: BookingCTAProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const sharedProps = {
    heading,
    subheading,
    primaryLabel,
    primaryHref,
    secondaryLabel,
    secondaryHref,
    showContactMethods,
    inView,
  };

  return (
    <section
      aria-label="Book a consultation"
      className={cn("section container-vem", className)}
    >
      <div ref={ref}>
        {variant === "gradient" && <GradientCTA {...sharedProps} />}
        {variant === "light"    && <LightCTA    {...sharedProps} />}
        {variant === "minimal"  && (
          <MinimalCTA
            {...sharedProps}
            showContactMethods={showContactMethods}
          />
        )}
      </div>
    </section>
  );
}
