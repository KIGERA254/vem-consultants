"use client";

// ============================================================
// VEM Consultants — src/components/layout/MobileNav.tsx
// Full-screen slide-in drawer for mobile navigation.
// Controlled by open/onClose props lifted from Header.tsx.
// ============================================================

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Phone,
  Mail,
  MessageCircle,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { nav, contact, brand, businessHours, socials } from "@/data/site";
import { whatsappHref } from "@/data/site";
import Button from "@/components/ui/Button";

// ─── Types ────────────────────────────────────────────────────

interface MobileNavProps {
  id:      string;
  open:    boolean;
  onClose: () => void;
}

// ─── Sub-components ───────────────────────────────────────────

/** Single nav row with an animated right-arrow */
function MobileNavLink({
  href,
  label,
  index,
  isActive,
  onClick,
}: {
  href:     string;
  label:    string;
  index:    number;
  isActive: boolean;
  onClick:  () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{ animationDelay: `${80 + index * 55}ms` }}
      className={cn(
        // Slide-up entrance — triggered by parent's open state
        "group flex items-center justify-between",
        "rounded-xl px-4 py-3.5",
        "text-base font-semibold transition-all duration-200",
        "animate-fade-up animation-fill-both",
        isActive
          ? "bg-brand-50 text-brand-600"
          : "text-neutral-800 hover:bg-neutral-50 hover:text-brand-600",
      )}
    >
      <span>{label}</span>
      <ChevronRight
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          "group-hover:translate-x-1",
          isActive ? "text-brand-500" : "text-neutral-400 group-hover:text-brand-500",
        )}
        aria-hidden="true"
      />
    </Link>
  );
}

/** Contact info row */
function ContactRow({
  icon,
  label,
  href,
  delay,
}: {
  icon:  React.ReactNode;
  label: string;
  href:  string;
  delay: number;
}) {
  return (
    <a
      href={href}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3",
        "text-sm font-medium text-neutral-700",
        "transition-colors duration-200 hover:bg-neutral-50 hover:text-brand-600",
        "animate-fade-up animation-fill-both",
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
        {icon}
      </span>
      <span>{label}</span>
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────

export default function MobileNav({ id, open, onClose }: MobileNavProps) {
  const pathname    = usePathname();
  const drawerRef   = useRef<HTMLDivElement>(null);
  const closeRef    = useRef<HTMLButtonElement>(null);

  // ── Focus management ─────────────────────────────────────
  useEffect(() => {
    if (open) {
      // Small delay so the element is visible before focusing
      const t = setTimeout(() => closeRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ── Keyboard: close on Escape ────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // ── Active link helper ───────────────────────────────────
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href);
  };

  const todayHours = businessHours[0]; // Mon–Fri as default display

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────── */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm",
          "transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* ── Drawer ────────────────────────────────────────── */}
      <div
        id={id}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          // Position — slides in from the right
          "fixed inset-y-0 right-0 z-50",
          "w-full max-w-sm",
          // Appearance
          "flex flex-col bg-white shadow-2xl",
          // Slide animation
          "transition-transform duration-300 ease-in-out will-change-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >

        {/* ── Header row ──────────────────────────────────── */}
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-neutral-100 px-5">
          {/* Logo wordmark */}
          <div className="flex flex-col leading-none">
            <span
              className="text-base font-bold tracking-tight text-neutral-900"
              style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
            >
              {brand.shortName}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-500">
              Consultants
            </span>
          </div>

          {/* Close button */}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              "text-neutral-500 transition-colors duration-200",
              "hover:bg-neutral-100 hover:text-neutral-900",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-brand-500 focus-visible:ring-offset-2",
            )}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* ── Scrollable body ──────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-5">

          {/* Nav links */}
          <nav aria-label="Mobile navigation links">
            <ul className="space-y-1" role="list">
              {nav.map((item, i) => (
                <li key={item.href}>
                  <MobileNavLink
                    href={item.href}
                    label={item.label}
                    index={i}
                    isActive={isActive(item.href)}
                    onClick={onClose}
                  />
                </li>
              ))}
            </ul>
          </nav>

          {/* Divider */}
          <div className="my-5 h-px bg-neutral-100" aria-hidden="true" />

          {/* Contact info */}
          <section aria-label="Contact information">
            <p
              className={cn(
                "mb-2 px-4 text-[11px] font-semibold uppercase",
                "tracking-widest text-neutral-400",
                "animate-fade-up animation-fill-both",
              )}
              style={{ animationDelay: "380ms" }}
            >
              Get in Touch
            </p>

            <div className="space-y-0.5">
              <ContactRow
                icon={<Phone className="h-4 w-4" />}
                label={contact.phoneDisplay}
                href={`tel:${contact.phone}`}
                delay={420}
              />
              <ContactRow
                icon={<Mail className="h-4 w-4" />}
                label={contact.email}
                href={`mailto:${contact.email}`}
                delay={460}
              />
              <ContactRow
                icon={<MapPin className="h-4 w-4" />}
                label={`${contact.address}, ${contact.country}`}
                href={contact.mapsUrl ?? "#"}
                delay={500}
              />
              <ContactRow
                icon={<Clock className="h-4 w-4" />}
                label={`${todayHours.days}: ${todayHours.hours}`}
                href="#"
                delay={540}
              />
            </div>
          </section>

          {/* Spacer pushes CTAs to the bottom */}
          <div className="flex-1" />
        </div>

        {/* ── Sticky footer CTAs ───────────────────────────── */}
        <div
          className={cn(
            "shrink-0 border-t border-neutral-100 bg-white px-4 pb-safe",
            "animate-fade-up animation-fill-both",
          )}
          style={{ animationDelay: "580ms" }}
        >
          {/* WhatsApp — full width */}
          <div className="pt-4">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className={cn(
                "flex w-full items-center justify-center gap-2.5 rounded-xl py-3",
                "bg-[#25d366] text-sm font-semibold text-white",
                "transition-opacity duration-200 hover:opacity-90",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-green-400 focus-visible:ring-offset-2",
              )}
            >
              {/* WhatsApp SVG */}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Book a Consultation — full width */}
          <div className="py-3">
            <Button
              href="/#contact"
              variant="primary"
              size="lg"
              fullWidth
              onClick={onClose}
              rightIcon={<ChevronRight className="h-5 w-5" />}
            >
              Book a Consultation
            </Button>
          </div>
        </div>

      </div>
    </>
  );
}
