"use client";

// ============================================================
// VEM Consultants — src/components/sections/Hero.tsx
// Full-viewport hero: animated headline, two CTAs,
// trust badges, and a scroll-down indicator.
// Requires: framer-motion, lucide-react
// ============================================================

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowDown,
  ChevronRight,
  CheckCircle2,
  Star,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { brand, heroCTAs, stats, contact } from "@/data/site";
import { whatsappHref } from "@/data/site";
import Button from "@/components/ui/Button";

// ─── Animation variants ───────────────────────────────────────

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren:   0.2,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Trust badges shown below the CTAs ───────────────────────

const TRUST_ITEMS = [
  "10+ Years Experience",
  "200+ Clients Served",
  "East Africa's Trusted Advisors",
];

// ─── Sub-components ───────────────────────────────────────────

/** Animated word-by-word headline */
function AnimatedHeading({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span className="inline">
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={fadeUp}
          className="inline-block mr-[0.3em] last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/** Accent highlighted span — gold gradient */
function GoldText({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "relative inline-block",
        "bg-clip-text text-transparent",
        "bg-gradient-to-r from-accent-400 via-accent-500 to-amber-300",
      )}
    >
      {children}
      {/* Subtle underline glow */}
      <span
        className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full opacity-60"
        style={{ background: "linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)" }}
        aria-hidden="true"
      />
    </span>
  );
}

/** Pulsing scroll-indicator arrow */
function ScrollIndicator() {
  return (
    <motion.a
      href="#about"
      aria-label="Scroll down to learn more"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.6, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center gap-2",
        "text-white/40 transition-colors duration-300 hover:text-white/80",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-white/50 focus-visible:ring-offset-4",
        "focus-visible:ring-offset-transparent rounded-sm",
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
        Scroll
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </motion.div>
    </motion.a>
  );
}

/** Single stat shown in the floating card */
function StatPill({
  value,
  label,
  delay,
}: {
  value:  string;
  label:  string;
  delay:  number;
}) {
  return (
    <motion.div
      variants={scaleIn}
      transition={{ delay }}
      className={cn(
        "flex flex-col items-center rounded-2xl px-5 py-4",
        "bg-white/8 backdrop-blur-sm border border-white/10",
        "min-w-[90px]",
      )}
    >
      <span
        className="text-2xl font-bold text-white leading-none"
        style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
      >
        {value}
      </span>
      <span className="mt-1 text-center text-[11px] font-medium text-white/50 leading-tight">
        {label}
      </span>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: background moves at 30% of scroll speed
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start start", "end start"],
  });
  const bgY     = useTransform(scrollYProgress, [0, 1], ["0%",  "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity  = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero — VEM Consultants"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >

      {/* ── Background layer ───────────────────────────────── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0"
        aria-hidden="true"
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-[#0f2460]" />

        {/* Diagonal accent band */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(135deg, transparent 30%, rgba(37,99,235,0.4) 50%, transparent 70%)",
          }}
        />

        {/* Radial glow — top right */}
        <div
          className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
        />

        {/* Radial glow — bottom left */}
        <div
          className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>

      {/* ── Main content ────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 flex flex-1 items-center"
      >
        <div className="container-vem w-full py-20 md:py-28">
          <div className="mx-auto max-w-4xl">

            {/* Staggered content container */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center text-center"
            >

              {/* ── Eyebrow badge ─────────────────────────── */}
              <motion.div variants={fadeIn} className="mb-7">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-1.5",
                    "border border-white/15 bg-white/8 backdrop-blur-sm",
                    "text-xs font-semibold uppercase tracking-[0.18em] text-white/70",
                  )}
                >
                  <Star
                    className="h-3 w-3 fill-accent-400 text-accent-400"
                    aria-hidden="true"
                  />
                  East Africa's Premier Consulting Firm
                  <Star
                    className="h-3 w-3 fill-accent-400 text-accent-400"
                    aria-hidden="true"
                  />
                </span>
              </motion.div>

              {/* ── Main heading ──────────────────────────── */}
              <h1
                className={cn(
                  "mb-6 text-balance text-4xl font-black leading-[1.08] tracking-tight text-white",
                  "sm:text-5xl md:text-6xl lg:text-7xl",
                )}
                style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
              >
                <motion.span variants={container} initial="hidden" animate="show" className="block">
                  <AnimatedHeading text="Your Vision." />
                </motion.span>
                <motion.span
                  variants={fadeUp}
                  className="mt-1 block"
                >
                  <GoldText>Our Expertise.</GoldText>
                </motion.span>
                <motion.span
                  variants={fadeUp}
                  className="mt-2 block text-3xl font-bold text-white/80 sm:text-4xl md:text-5xl"
                >
                  Your Growth.
                </motion.span>
              </h1>

              {/* ── Sub-heading ───────────────────────────── */}
              <motion.p
                variants={fadeUp}
                className={cn(
                  "mb-10 max-w-2xl text-base leading-relaxed text-white/60",
                  "sm:text-lg md:text-xl",
                )}
              >
                Strategic advisory, financial guidance, and operational excellence —
                helping businesses across{" "}
                <span className="font-medium text-white/85">East Africa</span>{" "}
                achieve sustainable, measurable growth.
              </motion.p>

              {/* ── CTA buttons ───────────────────────────── */}
              <motion.div
                variants={fadeUp}
                className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
              >
                <Button
                  href="/#contact"
                  variant="accent"
                  size="lg"
                  rightIcon={<ChevronRight className="h-5 w-5" />}
                  className="w-full sm:w-auto"
                >
                  Book a Free Consultation
                </Button>

                <Button
                  href="/#services"
                  variant="outline-light"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Explore Our Services
                </Button>
              </motion.div>

              {/* ── Trust badges ──────────────────────────── */}
              <motion.div
                variants={fadeUp}
                className="mb-16 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
              >
                {TRUST_ITEMS.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 text-xs font-medium text-white/50"
                  >
                    <CheckCircle2
                      className="h-3.5 w-3.5 shrink-0 text-green-400"
                      aria-hidden="true"
                    />
                    {item}
                  </span>
                ))}
              </motion.div>

              {/* ── Stat pills ────────────────────────────── */}
              <motion.div
                variants={container}
                className={cn(
                  "flex flex-wrap items-center justify-center gap-3",
                  "rounded-2xl border border-white/8 bg-white/5 p-4 backdrop-blur-sm",
                  "w-full max-w-lg",
                )}
              >
                {stats.map((stat, i) => (
                  <StatPill
                    key={stat.label}
                    value={`${stat.value}${stat.suffix ?? ""}`}
                    label={stat.label}
                    delay={0.9 + i * 0.08}
                  />
                ))}
              </motion.div>

            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Bottom row: scroll indicator + quick contact ───── */}
      <motion.div
        style={{ opacity }}
        className={cn(
          "relative z-10 w-full border-t border-white/8",
          "bg-white/5 backdrop-blur-sm",
        )}
      >
        <div className="container-vem">
          <div className="flex h-16 items-center justify-between">

            {/* Quick contact */}
            <motion.a
              href={`tel:${contact.phone}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className={cn(
                "flex items-center gap-2 text-xs font-medium text-white/40",
                "transition-colors duration-200 hover:text-white/80",
              )}
            >
              <span className="hidden sm:inline">Call us:</span>
              <span className="font-semibold text-white/60">
                {contact.phoneDisplay}
              </span>
            </motion.a>

            {/* Scroll indicator — centered */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <ScrollIndicator />
            </div>

            {/* WhatsApp quick link */}
            <motion.a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium text-white/40",
                "transition-colors duration-200 hover:text-[#25d366]",
              )}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
            </motion.a>

          </div>
        </div>
      </motion.div>

    </section>
  );
}
