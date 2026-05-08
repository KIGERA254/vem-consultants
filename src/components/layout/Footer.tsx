"use client";

// ============================================================
// VEM Consultants — src/components/layout/Footer.tsx
// 3-column footer: brand + tagline | quick links | contact info
// Social icons · dynamic year · newsletter-ready structure.
// ============================================================

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  ArrowUpRight,
  ChevronRight,
  Heart,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  brand,
  contact,
  socials,
  footerNav,
  businessHours,
  copyrightLine,
  whatsappHref,
} from "@/data/site";

// ─── Logo mark (mirrors Header.tsx) ───────────────────────────

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M6 8L18 18L6 28"
        stroke="#f59e0b"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 8L28 18L16 28"
        stroke="#60a5fa"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Social icon map ──────────────────────────────────────────

const SOCIAL_ICONS: Record<
  keyof typeof socials,
  { icon: React.ReactNode; label: string }
> = {
  linkedin:  { icon: <Linkedin  className="h-4 w-4" />, label: "LinkedIn"  },
  twitter:   { icon: <Twitter   className="h-4 w-4" />, label: "Twitter / X" },
  facebook:  { icon: <Facebook  className="h-4 w-4" />, label: "Facebook"  },
  instagram: { icon: <Instagram className="h-4 w-4" />, label: "Instagram" },
  youtube:   { icon: <Youtube   className="h-4 w-4" />, label: "YouTube"   },
};

// ─── Sub-components ───────────────────────────────────────────

/** Column heading */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.15em] text-white/50">
      {children}
    </h3>
  );
}

/** A quick-link row */
function FooterLink({ href, label }: { href: string; label: string }) {
  const isExternal = href.startsWith("http");
  return (
    <li>
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={cn(
          "group flex items-center gap-1.5",
          "text-sm text-white/60 transition-colors duration-200 hover:text-white",
        )}
      >
        <ChevronRight
          className={cn(
            "h-3 w-3 shrink-0 text-brand-400 opacity-0",
            "transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5",
          )}
          aria-hidden="true"
        />
        {label}
        {isExternal && (
          <ArrowUpRight
            className="h-3 w-3 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-60"
            aria-hidden="true"
          />
        )}
      </Link>
    </li>
  );
}

/** Contact info row */
function ContactRow({
  icon,
  href,
  children,
}: {
  icon:     React.ReactNode;
  href:     string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group flex items-start gap-3",
        "text-sm text-white/60 transition-colors duration-200 hover:text-white",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center",
          "rounded-lg bg-white/5 text-brand-400",
          "transition-colors duration-200 group-hover:bg-brand-500/20 group-hover:text-brand-300",
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="leading-relaxed">{children}</span>
    </a>
  );
}

/** Social icon button */
function SocialButton({
  href,
  icon,
  label,
}: {
  href:  string;
  icon:  React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Follow VEM Consultants on ${label}`}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg",
        "bg-white/5 text-white/50",
        "transition-all duration-200",
        "hover:bg-brand-500 hover:text-white hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-brand-400 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-brand-900",
      )}
    >
      {icon}
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="relative bg-brand-900 text-white" aria-label="Site footer">

      {/* ── Subtle top gradient accent ─────────────────────── */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"
        aria-hidden="true"
      />

      {/* ── Decorative background mesh ─────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-brand-800/40 blur-3xl" />
        <div className="absolute -left-20 bottom-20 h-48 w-48 rounded-full bg-accent-500/5 blur-3xl" />
      </div>

      <div className="relative">

        {/* ════════════════════════════════════════════════════
            MAIN FOOTER BODY
        ════════════════════════════════════════════════════ */}
        <div className="container-vem py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">

            {/* ── Col 1: Brand (spans 4/12 on lg) ─────────────── */}
            <div className="lg:col-span-4">

              {/* Logo */}
              <Link
                href="/"
                className={cn(
                  "mb-5 flex items-center gap-2.5",
                  "w-fit rounded-md transition-opacity duration-200 hover:opacity-80",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-brand-400 focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-brand-900",
                )}
                aria-label={`${brand.name} — Home`}
              >
                <LogoMark className="h-9 w-9" />
                <div className="flex flex-col leading-none">
                  <span
                    className="text-base font-bold tracking-tight text-white"
                    style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
                  >
                    {brand.shortName}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/40">
                    Consultants
                  </span>
                </div>
              </Link>

              {/* Tagline */}
              <p className="mb-4 text-lg font-semibold text-white/90 leading-snug"
                style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
              >
                {brand.tagline}
              </p>

              {/* Description */}
              <p className="mb-6 text-sm text-white/50 leading-relaxed max-w-xs">
                {brand.description}
              </p>

              {/* Social icons */}
              {Object.entries(socials).length > 0 && (
                <div className="flex flex-wrap items-center gap-2" role="list" aria-label="Social media links">
                  {(Object.entries(socials) as [keyof typeof socials, string][]).map(
                    ([key, url]) =>
                      url && SOCIAL_ICONS[key] ? (
                        <div role="listitem" key={key}>
                          <SocialButton
                            href={url}
                            icon={SOCIAL_ICONS[key].icon}
                            label={SOCIAL_ICONS[key].label}
                          />
                        </div>
                      ) : null,
                  )}
                </div>
              )}
            </div>

            {/* ── Col 2: Quick links (spans 5/12, split across 2–3 groups) ── */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                {footerNav.map((group) => (
                  <div key={group.label}>
                    <FooterHeading>{group.label}</FooterHeading>
                    <ul className="space-y-2.5" role="list">
                      {group.links.map((link) => (
                        <FooterLink
                          key={link.href + link.label}
                          href={link.href}
                          label={link.label}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Col 3: Contact info (spans 3/12 on lg) ──────── */}
            <div className="lg:col-span-3">
              <FooterHeading>Contact Us</FooterHeading>

              <div className="space-y-3">
                <ContactRow
                  icon={<Phone className="h-3.5 w-3.5" />}
                  href={`tel:${contact.phone}`}
                >
                  {contact.phoneDisplay}
                </ContactRow>

                <ContactRow
                  icon={<Mail className="h-3.5 w-3.5" />}
                  href={`mailto:${contact.email}`}
                >
                  {contact.email}
                </ContactRow>

                <ContactRow
                  icon={<MapPin className="h-3.5 w-3.5" />}
                  href={contact.mapsUrl ?? "#"}
                >
                  {contact.address},<br />{contact.city}, {contact.country}
                </ContactRow>

                {/* Business hours */}
                <div className="pt-1">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-brand-400">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <div className="space-y-0.5">
                      {businessHours.map((h) => (
                        <p key={h.days} className="text-xs leading-relaxed text-white/50">
                          <span className="font-medium text-white/70">{h.days}:</span>{" "}
                          {h.hours}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-6 flex w-full items-center justify-center gap-2",
                  "rounded-xl bg-[#25d366]/10 py-2.5 px-4",
                  "text-sm font-semibold text-[#25d366]",
                  "border border-[#25d366]/20",
                  "transition-all duration-200 hover:bg-[#25d366] hover:text-white",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-green-400 focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-brand-900",
                )}
              >
                {/* WhatsApp icon */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>

          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            BOTTOM BAR
        ════════════════════════════════════════════════════ */}
        <div className="border-t border-white/5">
          <div className="container-vem py-5">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">

              {/* Copyright */}
              <p className="flex items-center gap-1.5 text-xs text-white/30">
                {copyrightLine}
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  Made with{" "}
                  <Heart
                    className="h-3 w-3 text-accent-500"
                    fill="currentColor"
                    aria-label="love"
                  />{" "}
                  in Nairobi
                </span>
              </p>

              {/* Legal links */}
              <nav aria-label="Legal links" className="flex items-center gap-4">
                {[
                  { label: "Privacy Policy",   href: "/privacy"  },
                  { label: "Terms of Service", href: "/terms"    },
                  { label: "Cookies",          href: "/cookies"  },
                ].map((link, i, arr) => (
                  <span key={link.href} className="flex items-center gap-4">
                    <Link
                      href={link.href}
                      className="text-xs text-white/30 transition-colors duration-200 hover:text-white/70"
                    >
                      {link.label}
                    </Link>
                    {i < arr.length - 1 && (
                      <span className="text-white/10" aria-hidden="true">·</span>
                    )}
                  </span>
                ))}
              </nav>

            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
