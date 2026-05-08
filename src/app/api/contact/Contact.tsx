"use client";

// ============================================================
// VEM Consultants — src/components/sections/Contact.tsx
// Two-column contact section:
//   Left  — info sidebar (address, hours, map link, social)
//   Right — react-hook-form + Zod, POSTs to /api/contact
// Features: field-level errors, loading spinner, success/error
// toast, honeypot bot trap, service selector, char counter.
// ============================================================

import { useState, useRef, useEffect } from "react";
import { useForm }                      from "react-hook-form";
import { zodResolver }                  from "@hookform/resolvers/zod";
import { z }                            from "zod";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Loader2,
  MessageSquare,
  ArrowRight,
  X,
} from "lucide-react";

import { cn }                            from "@/lib/utils";
import { contact, businessHours, socials, brand } from "@/data/site";
import { whatsappHref }                  from "@/data/site";
import { services }                      from "@/data/services";
import Button                            from "@/components/ui/Button";

// ─── Zod schema (mirrors route.ts — keep in sync) ────────────

const contactSchema = z.object({
  name: z
    .string({ required_error: "Your name is required." })
    .min(2,  "Name must be at least 2 characters.")
    .max(80, "Name must be 80 characters or fewer.")
    .trim(),

  email: z
    .string({ required_error: "Email address is required." })
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long.")
    .trim(),

  phone: z
    .string()
    .trim()
    .regex(/^[\d\s\+\-\(\)]{7,20}$/, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),

  service: z
    .string()
    .optional()
    .or(z.literal("")),

  message: z
    .string({ required_error: "Please include a message." })
    .min(10,   "Message must be at least 10 characters.")
    .max(2000, "Message must be 2 000 characters or fewer.")
    .trim(),

  // Honeypot — must always be empty
  website: z.string().max(0).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ─── Animation variants ───────────────────────────────────────

const containerAnim: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const toastAnim: Variants = {
  hidden: { opacity: 0, y: -16, scale: 0.95 },
  show:   { opacity: 1, y: 0,   scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, y: -12, scale: 0.95, transition: { duration: 0.25 } },
};

// ─── Sub-components ───────────────────────────────────────────

/** Form field wrapper with label + error */
function Field({
  label,
  required,
  error,
  children,
  className,
}: {
  label:     string;
  required?: boolean;
  error?:    string;
  children:  React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="flex items-center gap-1 text-sm font-semibold text-neutral-700">
        {label}
        {required && (
          <span className="text-brand-500" aria-label="required">*</span>
        )}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-red-500"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Contact info row */
function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon:  React.ReactNode;
  label: string;
  value: React.ReactNode;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3.5">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 text-brand-300">
        {icon}
      </div>
      <div>
        <p className="mb-0.5 text-[11px] font-bold uppercase tracking-widest text-white/35">
          {label}
        </p>
        <div className="text-sm font-medium leading-relaxed text-white/75">
          {value}
        </div>
      </div>
    </div>
  );

  if (!href) return <div>{inner}</div>;

  return (
    <a
      href={href}
      className="block transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900 rounded-lg"
    >
      {inner}
    </a>
  );
}

const SOCIAL_MAP = {
  linkedin:  { icon: <Linkedin  className="h-4 w-4" />, label: "LinkedIn"   },
  twitter:   { icon: <Twitter   className="h-4 w-4" />, label: "Twitter/X"  },
  facebook:  { icon: <Facebook  className="h-4 w-4" />, label: "Facebook"   },
  instagram: { icon: <Instagram className="h-4 w-4" />, label: "Instagram"  },
} as const;

// ─── Main Component ───────────────────────────────────────────

type ToastState = { type: "success" | "error"; message: string } | null;

export default function Contact() {
  const sectionRef  = useRef<HTMLElement>(null);
  const inView      = useInView(sectionRef, { once: true, margin: "-60px" });
  const [toast, setToast]         = useState<ToastState>(null);
  const [charCount, setCharCount] = useState(0);

  // Auto-dismiss toast after 6 seconds
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "", email: "", phone: "",
      service: "", message: "", website: "",
    },
  });

  // Live char count for message textarea
  const messageValue = watch("message", "");
  useEffect(() => {
    setCharCount(messageValue.length);
  }, [messageValue]);

  // ── Form submit ─────────────────────────────────────────
  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        // Map server field errors back to react-hook-form
        if (json.errors) {
          (Object.entries(json.errors) as [keyof ContactFormData, string[]][])
            .forEach(([field, messages]) => {
              setError(field, { message: messages[0] });
            });
        }
        setToast({
          type:    "error",
          message: json.message ?? "Something went wrong. Please try again.",
        });
        return;
      }

      // Success
      setToast({ type: "success", message: json.message });
      reset();
      setCharCount(0);

    } catch {
      setToast({
        type:    "error",
        message: "Network error — please check your connection and try again.",
      });
    }
  };

  const inputBase = cn(
    "w-full rounded-xl border bg-white px-4 py-3",
    "text-sm text-neutral-900 placeholder:text-neutral-400",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
  );
  const inputNormal = cn(inputBase, "border-neutral-200 hover:border-neutral-300");
  const inputError  = cn(inputBase, "border-red-300 bg-red-50/40 focus:ring-red-400");

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-brand-900"
    >
      {/* ── Background ──────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-700/25 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent-500/8 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
            `,
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── Toast notification ───────────────────────────── */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 top-6 z-[9998] flex justify-center px-4"
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.type + toast.message}
              variants={toastAnim}
              initial="hidden"
              animate="show"
              exit="exit"
              role={toast.type === "error" ? "alert" : "status"}
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-2xl px-5 py-3.5",
                "shadow-xl backdrop-blur-sm border max-w-md w-full",
                toast.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50  border-red-200  text-red-800",
              )}
            >
              {toast.type === "success"
                ? <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" aria-hidden="true" />
                : <AlertCircle  className="h-5 w-5 shrink-0 text-red-500"   aria-hidden="true" />
              }
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => setToast(null)}
                aria-label="Dismiss notification"
                className="ml-1 rounded-lg p-1 opacity-60 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative section container-vem">

        {/* ══════════════════════════════════════════════════
            Section header
        ══════════════════════════════════════════════════ */}
        <motion.div
          variants={containerAnim}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="section-header mb-12"
        >
          <motion.span variants={fadeUp} className="section-label text-blue-300">
            Get In Touch
          </motion.span>

          <motion.h2
            id="contact-heading"
            variants={fadeUp}
            className="section-title-light"
          >
            Let's start a{" "}
            <span className="text-accent-400">conversation</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="section-subtitle-light mx-auto">
            Tell us about your business and what you're trying to achieve.
            We'll respond within one business day.
          </motion.p>
        </motion.div>

        {/* ══════════════════════════════════════════════════
            Two-column grid
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">

          {/* ── LEFT: Info sidebar ─────────────────────────── */}
          <motion.aside
            variants={slideLeft}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="lg:col-span-4"
            aria-label="Contact information"
          >
            <div className={cn(
              "sticky top-28 flex flex-col gap-8",
              "rounded-3xl border border-white/8 bg-white/5 p-7 backdrop-blur-sm",
            )}>

              {/* Brand blurb */}
              <div>
                <p
                  className="mb-2 text-lg font-bold text-white"
                  style={{ fontFamily: "var(--font-montserrat,'Montserrat',serif)" }}
                >
                  {brand.name}
                </p>
                <p className="text-sm leading-relaxed text-white/50">
                  Based in Nairobi. Serving businesses across East Africa.
                  Our team typically responds within 4 hours on business days.
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/8" aria-hidden="true" />

              {/* Contact rows */}
              <div className="flex flex-col gap-5">
                <InfoRow
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={contact.phoneDisplay}
                  href={`tel:${contact.phone}`}
                />
                <InfoRow
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={contact.email}
                  href={`mailto:${contact.email}`}
                />
                <InfoRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Office"
                  value={
                    <>
                      {contact.address}<br />
                      {contact.city}, {contact.country}
                    </>
                  }
                  href={contact.mapsUrl}
                />
                <InfoRow
                  icon={<Clock className="h-4 w-4" />}
                  label="Hours"
                  value={
                    <ul className="space-y-0.5">
                      {businessHours.map((h) => (
                        <li key={h.days}>
                          <span className="font-semibold text-white/60">{h.days}:</span>{" "}
                          <span className={h.hours === "Closed" ? "text-white/35" : ""}>{h.hours}</span>
                        </li>
                      ))}
                    </ul>
                  }
                />
              </div>

              {/* Divider */}
              <div className="h-px bg-white/8" aria-hidden="true" />

              {/* WhatsApp CTA */}
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center justify-center gap-2.5 rounded-2xl py-3.5",
                  "bg-[#25d366]/12 border border-[#25d366]/20 text-[#25d366]",
                  "text-sm font-semibold",
                  "transition-all duration-200 hover:bg-[#25d366] hover:text-white",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-green-400 focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-brand-900",
                )}
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Chat on WhatsApp
              </a>

              {/* Social icons */}
              {Object.entries(socials).length > 0 && (
                <div className="flex items-center gap-2" role="list" aria-label="Social media">
                  {(Object.entries(socials) as [keyof typeof socials, string][]).map(
                    ([key, url]) =>
                      url && SOCIAL_MAP[key as keyof typeof SOCIAL_MAP] ? (
                        <div role="listitem" key={key}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${brand.name} on ${SOCIAL_MAP[key as keyof typeof SOCIAL_MAP].label}`}
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-xl",
                              "bg-white/5 text-white/40",
                              "transition-all duration-200 hover:bg-brand-500 hover:text-white",
                              "focus-visible:outline-none focus-visible:ring-2",
                              "focus-visible:ring-brand-400 focus-visible:ring-offset-2",
                              "focus-visible:ring-offset-brand-900",
                            )}
                          >
                            {SOCIAL_MAP[key as keyof typeof SOCIAL_MAP].icon}
                          </a>
                        </div>
                      ) : null,
                  )}
                </div>
              )}
            </div>
          </motion.aside>

          {/* ── RIGHT: Contact form ────────────────────────── */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="lg:col-span-8"
          >
            <div className={cn(
              "rounded-3xl border border-white/8 bg-white p-8 md:p-10",
              "shadow-2xl",
            )}>

              <div className="mb-7">
                <h3
                  className="text-xl font-bold text-neutral-900"
                  style={{ fontFamily: "var(--font-montserrat,'Montserrat',serif)" }}
                >
                  Send us a message
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Fields marked <span className="text-brand-500 font-semibold">*</span> are required.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                aria-label="Contact form"
              >
                {/* Honeypot — invisible to real users */}
                <input
                  {...register("website")}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                />

                {/* ── Name + Email row ──────────────────────── */}
                <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Full Name" required error={errors.name?.message}>
                    <input
                      {...register("name")}
                      type="text"
                      id="contact-name"
                      placeholder="e.g. Sarah Kamau"
                      autoComplete="name"
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={errors.name ? inputError : inputNormal}
                    />
                  </Field>

                  <Field label="Email Address" required error={errors.email?.message}>
                    <input
                      {...register("email")}
                      type="email"
                      id="contact-email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      className={errors.email ? inputError : inputNormal}
                    />
                  </Field>
                </div>

                {/* ── Phone + Service row ───────────────────── */}
                <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Phone Number" error={errors.phone?.message}>
                    <input
                      {...register("phone")}
                      type="tel"
                      id="contact-phone"
                      placeholder="+254 700 000 000"
                      autoComplete="tel"
                      aria-invalid={!!errors.phone}
                      className={errors.phone ? inputError : inputNormal}
                    />
                  </Field>

                  <Field label="Service of Interest" error={errors.service?.message}>
                    <div className="relative">
                      <select
                        {...register("service")}
                        id="contact-service"
                        aria-invalid={!!errors.service}
                        className={cn(
                          errors.service ? inputError : inputNormal,
                          "appearance-none pr-10 cursor-pointer",
                          "text-neutral-700",
                        )}
                        defaultValue=""
                      >
                        <option value="" disabled>Select a service…</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                        aria-hidden="true"
                      />
                    </div>
                  </Field>
                </div>

                {/* ── Message ───────────────────────────────── */}
                <div className="mb-7">
                  <Field
                    label="Message"
                    required
                    error={errors.message?.message}
                  >
                    <div className="relative">
                      <textarea
                        {...register("message")}
                        id="contact-message"
                        rows={5}
                        placeholder="Tell us about your business and what you're looking to achieve…"
                        aria-required="true"
                        aria-invalid={!!errors.message}
                        aria-describedby="char-count"
                        className={cn(
                          errors.message ? inputError : inputNormal,
                          "resize-none leading-relaxed",
                        )}
                      />
                      {/* Char counter */}
                      <p
                        id="char-count"
                        aria-live="polite"
                        className={cn(
                          "absolute bottom-3 right-3 text-[11px] font-medium tabular-nums",
                          charCount > 1800
                            ? "text-red-400"
                            : charCount > 1500
                            ? "text-amber-400"
                            : "text-neutral-300",
                        )}
                      >
                        {charCount}/2000
                      </p>
                    </div>
                  </Field>
                </div>

                {/* ── Privacy note ──────────────────────────── */}
                <p className="mb-6 text-xs leading-relaxed text-neutral-400">
                  By submitting this form you agree to our{" "}
                  <a
                    href="/privacy"
                    className="text-brand-500 underline underline-offset-2 hover:text-brand-700"
                  >
                    Privacy Policy
                  </a>
                  . We'll never share your information with third parties.
                </p>

                {/* ── Submit ────────────────────────────────── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    leftIcon={
                      isSubmitting
                        ? undefined
                        : <Send className="h-4 w-4" aria-hidden="true" />
                    }
                    rightIcon={
                      !isSubmitting
                        ? undefined
                        : <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    }
                    aria-busy={isSubmitting}
                    className="sm:min-w-[200px]"
                  >
                    {isSubmitting ? "Sending…" : "Send Message"}
                  </Button>

                  <p className="flex items-center gap-2 text-xs text-neutral-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
                    We respond within 1 business day
                  </p>
                </div>

              </form>
            </div>

            {/* ── Quick-contact strip ────────────────────────── */}
            <motion.div
              variants={fadeUp}
              className={cn(
                "mt-5 flex flex-col items-center gap-3 rounded-2xl px-6 py-4",
                "border border-white/8 bg-white/5 backdrop-blur-sm",
                "sm:flex-row sm:justify-between",
              )}
            >
              <p className="text-sm text-white/50">
                Prefer a quicker conversation?
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white"
                >
                  <Phone className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />
                  {contact.phoneDisplay}
                </a>
                <span className="text-white/20" aria-hidden="true">|</span>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#25d366] transition-opacity hover:opacity-80"
                >
                  <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                  WhatsApp
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
