"use client";

// ============================================================
// VEM Consultants — src/components/sections/About.tsx
// Two-column section: company story (left) + image & animated
// stat counters (right). Scroll-triggered via framer-motion.
// ============================================================

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Award,
  Users,
  Globe,
  TrendingUp,
  CheckCircle2,
  Quote,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { brand, stats, team } from "@/data/site";
import Button from "@/components/ui/Button";

// ─── Animation variants ───────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Animated counter hook ─────────────────────────────────────

function useAnimatedCounter(
  target: number,
  inView: boolean,
  duration = 1.8,
) {
  const motionVal = useMotionValue(0);
  const spring    = useSpring(motionVal, {
    stiffness: 60,
    damping:   20,
    mass:      1,
  });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    // Small timeout so the section is fully visible before counting
    const t = setTimeout(() => motionVal.set(target), 300);
    return () => clearTimeout(t);
  }, [inView, target, motionVal]);

  useEffect(() => {
    const unsubscribe = spring.onChange((v) => setDisplay(Math.round(v)));
    return unsubscribe;
  }, [spring]);

  return display;
}

// ─── Sub-components ───────────────────────────────────────────

/** Single animated stat card */
function StatCard({
  value,
  suffix,
  label,
  icon,
  inView,
  delay,
}: {
  value:   number;
  suffix:  string;
  label:   string;
  icon:    React.ReactNode;
  inView:  boolean;
  delay:   number;
}) {
  const count = useAnimatedCounter(value, inView);

  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay }}
      className={cn(
        "group relative flex flex-col items-center rounded-2xl p-5 text-center",
        "border border-neutral-100 bg-white",
        "shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1",
        "overflow-hidden",
      )}
    >
      {/* Hover background accent */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Icon */}
        <div className={cn(
          "mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
          "bg-brand-50 text-brand-500 transition-colors duration-300",
          "group-hover:bg-brand-500 group-hover:text-white",
        )}>
          {icon}
        </div>

        {/* Animated number */}
        <div
          className="text-3xl font-black leading-none text-brand-600"
          style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
          aria-live="polite"
          aria-label={`${count}${suffix} ${label}`}
        >
          {count}
          <span className="text-accent-500">{suffix}</span>
        </div>

        <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

/** Bullet-point value proposition */
function ValuePoint({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2
        className="mt-0.5 h-5 w-5 shrink-0 text-brand-500"
        aria-hidden="true"
      />
      <span className="text-sm leading-relaxed text-neutral-600">{children}</span>
    </li>
  );
}

/** Founder quote card */
function QuoteCard() {
  const founder = team[0]; // Victor — defined in site.ts

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "relative rounded-2xl border border-brand-100 bg-brand-50 p-6",
        "overflow-hidden",
      )}
    >
      {/* Big decorative quote mark */}
      <Quote
        className="absolute -right-2 -top-2 h-16 w-16 rotate-180 text-brand-200 opacity-60"
        aria-hidden="true"
      />

      <p className="relative z-10 text-sm italic leading-relaxed text-neutral-700">
        "We built VEM Consultants because we saw too many great businesses
        across East Africa held back by a lack of access to quality strategic
        advice. Our mission is simple: give every ambitious organisation the
        expertise they need to thrive."
      </p>

      <div className="relative z-10 mt-4 flex items-center gap-3">
        {/* Avatar placeholder — replace with real photo */}
        <div className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          "bg-brand-500 text-sm font-bold text-white",
        )}>
          {founder?.name.charAt(0) ?? "V"}
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">
            {founder?.name ?? "Victor E. Mwangi"}
          </p>
          <p className="text-xs text-neutral-500">
            {founder?.role ?? "Founder & CEO"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────

const STAT_META = [
  { icon: <TrendingUp className="h-5 w-5" />, parsedSuffix: "+" },
  { icon: <Users       className="h-5 w-5" />, parsedSuffix: "+" },
  { icon: <Award       className="h-5 w-5" />, parsedSuffix: "%" },
  { icon: <Globe       className="h-5 w-5" />, parsedSuffix: "+" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, {
    once:   true,
    margin: "-80px",
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="section bg-white"
    >
      <div className="container-vem">

        {/* ══════════════════════════════════════════════════
            Two-column grid
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">

          {/* ── LEFT: Company story ────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            {/* Eyebrow */}
            <motion.span variants={fadeUp} className="section-label">
              Who We Are
            </motion.span>

            {/* Heading */}
            <motion.h2
              id="about-heading"
              variants={fadeUp}
              className="section-title mt-2"
            >
              A decade of building{" "}
              <span className="relative inline-block text-brand-600">
                East African
                {/* Underline decoration */}
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 -bottom-1 block h-1 origin-left rounded-full bg-accent-400"
                  aria-hidden="true"
                />
              </span>{" "}
              businesses
            </motion.h2>

            {/* Body copy */}
            <motion.p
              variants={fadeUp}
              className="section-subtitle mt-4 mb-6"
            >
              Founded in {brand.foundedYear} and headquartered in Nairobi, VEM
              Consultants has grown into one of East Africa's most trusted
              strategic advisory firms — helping founders, boards, and
              leadership teams navigate complexity and unlock growth.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mb-8 text-sm leading-relaxed text-neutral-500"
            >
              We combine deep local market knowledge with global best practices
              across business strategy, financial advisory, HR, legal services,
              and monitoring & evaluation. Every engagement is tailored — no
              templates, no generic playbooks.
            </motion.p>

            {/* Value points */}
            <motion.ul
              variants={containerVariants}
              className="mb-10 space-y-3"
              role="list"
            >
              <motion.li variants={fadeUp}>
                <ValuePoint>
                  Multidisciplinary team of 15+ specialists across strategy,
                  finance, HR, and legal
                </ValuePoint>
              </motion.li>
              <motion.li variants={fadeUp}>
                <ValuePoint>
                  Boots-on-the-ground presence in Kenya, Uganda, Tanzania,
                  and Rwanda
                </ValuePoint>
              </motion.li>
              <motion.li variants={fadeUp}>
                <ValuePoint>
                  Track record across private sector, NGOs, and
                  development-finance institutions
                </ValuePoint>
              </motion.li>
              <motion.li variants={fadeUp}>
                <ValuePoint>
                  Practical, execution-focused advice — not just reports
                </ValuePoint>
              </motion.li>
            </motion.ul>

            {/* Founder quote */}
            <motion.div variants={fadeUp} className="mb-10">
              <QuoteCard />
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Button
                href="/#contact"
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Work With Us
              </Button>
              <Button
                href="/#services"
                variant="ghost"
                size="md"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Our Services
              </Button>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Image + stats grid ─────────────────── */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="flex flex-col gap-6"
          >

            {/* Main image */}
            <div className="relative">
              {/* Decorative offset frame */}
              <div
                className={cn(
                  "absolute -right-4 -top-4 h-full w-full rounded-3xl",
                  "border-2 border-brand-200 bg-brand-50",
                )}
                aria-hidden="true"
              />

              {/* Accent corner square */}
              <div
                className="absolute -bottom-3 -left-3 h-16 w-16 rounded-2xl bg-accent-400"
                aria-hidden="true"
              />

              {/* Image wrapper */}
              <div className="relative overflow-hidden rounded-3xl">
                <Image
                  src="/images/about-team.jpg"
                  alt="The VEM Consultants team in a strategy session in Nairobi"
                  width={640}
                  height={480}
                  className="h-72 w-full object-cover object-center sm:h-80 md:h-96"
                  // Replace with priority if this image is above the fold on some viewports
                  priority={false}
                  // Placeholder while loading
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUEB//EACQQAAIBBAEEAwAAAAAAAAAAAAECAwQREiExBRNBUWH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AuNFp9TqUlCFeMoxfb6mjpbdVq7YnUjWUIqUtuN8M9VFa21Oq5Qk7c3xbXBYRySajWPZSTe/+TJdABp//2Q=="
                />

                {/* Gradient overlay at bottom */}
                <div
                  className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent"
                  aria-hidden="true"
                />

                {/* Floating badge on image */}
                <div className={cn(
                  "absolute bottom-4 left-4",
                  "flex items-center gap-2 rounded-xl px-3 py-2",
                  "bg-white/90 backdrop-blur-sm shadow-md",
                )}>
                  <div className="flex -space-x-2">
                    {team.slice(0, 3).map((member, i) => (
                      <div
                        key={member.name}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full",
                          "border-2 border-white text-xs font-bold text-white",
                          i === 0 ? "bg-brand-500" :
                          i === 1 ? "bg-accent-500" :
                                    "bg-emerald-500",
                        )}
                        title={member.name}
                      >
                        {member.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900">
                      15+ Experts
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      Ready to help you
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Stat counter grid ─────────────────────── */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
            >
              {stats.map((stat, i) => {
                // Parse out the numeric part of "value" (e.g. "10" from stat)
                const numericValue = parseInt(stat.value, 10);
                const suffix       = stat.suffix ?? "";

                return (
                  <StatCard
                    key={stat.label}
                    value={numericValue}
                    suffix={suffix}
                    label={stat.label}
                    icon={STAT_META[i]?.icon ?? <TrendingUp className="h-5 w-5" />}
                    inView={inView}
                    delay={0.2 + i * 0.08}
                  />
                );
              })}
            </motion.div>

            {/* Founded year strip */}
            <motion.div
              variants={fadeUp}
              className={cn(
                "flex items-center justify-between rounded-2xl px-5 py-4",
                "border border-neutral-100 bg-neutral-50",
              )}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Established
                </p>
                <p
                  className="text-2xl font-black text-neutral-900"
                  style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
                >
                  {brand.foundedYear}
                </p>
              </div>
              <div className="h-10 w-px bg-neutral-200" aria-hidden="true" />
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Headquartered
                </p>
                <p className="text-sm font-bold text-neutral-700">
                  Nairobi, Kenya
                </p>
              </div>
              <div className="h-10 w-px bg-neutral-200" aria-hidden="true" />
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Markets
                </p>
                <p className="text-sm font-bold text-neutral-700">
                  East Africa
                </p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
