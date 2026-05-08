"use client";

// ============================================================
// VEM Consultants — src/components/layout/Header.tsx
// Sticky header with scroll-aware backdrop blur, desktop nav,
// mobile drawer, active link tracking, and Book a Consultation CTA.
// ============================================================

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { nav, contact, brand } from "@/data/site";
import Button from "@/components/ui/Button";
import MobileNav from "@/components/layout/MobileNav";

// ─── Constants ────────────────────────────────────────────────

const SCROLL_THRESHOLD = 20; // px before header "activates"

// ─── Sub-components ───────────────────────────────────────────

/** Animated logo mark — two interlocking chevrons */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* Back chevron — accent amber */}
      <path
        d="M6 8L18 18L6 28"
        stroke="#f59e0b"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Front chevron — brand blue */}
      <path
        d="M16 8L28 18L16 28"
        stroke="#2563eb"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Desktop nav link with animated underline */
function NavLink({
  href,
  label,
  isActive,
  onClick,
}: {
  href:     string;
  label:    string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative py-1 text-sm font-medium transition-colors duration-200",
        "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full",
        "after:bg-brand-500 after:transition-all after:duration-300",
        isActive
          ? "text-brand-600 after:w-full"
          : "text-neutral-600 hover:text-brand-600 after:w-0 hover:after:w-full",
      )}
    >
      {label}
    </Link>
  );
}

/** Small top-bar with phone number — collapses on scroll */
function TopBar({ visible }: { visible: boolean }) {
  return (
    <div
      className={cn(
        "overflow-hidden bg-brand-900 transition-all duration-300 ease-in-out",
        visible ? "max-h-10 opacity-100" : "max-h-0 opacity-0",
      )}
    >
      <div className="container-vem flex items-center justify-between py-1.5">
        <p className="text-xs text-blue-200">
          Strategic advisory for East African businesses
        </p>
        <a
          href={`tel:${contact.phone}`}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium text-white",
            "transition-colors duration-200 hover:text-accent-400",
          )}
        >
          <Phone className="h-3 w-3" aria-hidden="true" />
          {contact.phoneDisplay}
        </a>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────

export default function Header() {
  const pathname              = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Scroll detection ────────────────────────────────────
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    // Set initial state (handles page refresh mid-scroll)
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── Close mobile nav on route change ────────────────────
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ── Prevent body scroll when mobile menu open ───────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // ── Active link detection ────────────────────────────────
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    // For anchor links like "/#services", check hash on homepage
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── Spacer so content isn't hidden behind fixed header ── */}
      <div
        className={cn(
          "transition-all duration-300",
          scrolled ? "h-[72px]" : "h-[108px]",
        )}
        aria-hidden="true"
      />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50",
          "transition-all duration-300 ease-in-out",
        )}
      >
        {/* Top bar — hides on scroll */}
        <TopBar visible={!scrolled} />

        {/* Main nav bar */}
        <div
          className={cn(
            "transition-all duration-300",
            scrolled
              ? [
                  "bg-white/90 backdrop-blur-md",
                  "border-b border-neutral-200/80",
                  "shadow-nav",
                  "py-0",
                ]
              : [
                  "bg-white/60 backdrop-blur-sm",
                  "border-b border-transparent",
                  "py-0",
                ],
          )}
        >
          <div className="container-vem">
            <div className="flex h-[72px] items-center justify-between gap-8">

              {/* ── Logo ─────────────────────────────────────── */}
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-2.5 rounded-md",
                  "transition-opacity duration-200 hover:opacity-80",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                )}
                aria-label={`${brand.name} — Home`}
              >
                <LogoMark className="h-9 w-9" />
                <div className="flex flex-col leading-none">
                  <span className="text-base font-bold tracking-tight text-neutral-900"
                    style={{ fontFamily: "var(--font-montserrat, 'Montserrat', serif)" }}
                  >
                    {brand.shortName}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-500">
                    Consultants
                  </span>
                </div>
              </Link>

              {/* ── Desktop nav ───────────────────────────────── */}
              <nav
                className="hidden items-center gap-7 md:flex"
                aria-label="Main navigation"
              >
                {nav.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    isActive={isActive(item.href)}
                  />
                ))}
              </nav>

              {/* ── Desktop right actions ─────────────────────── */}
              <div className="hidden items-center gap-3 md:flex">
                {/* Phone quick-dial */}
                <a
                  href={`tel:${contact.phone}`}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2",
                    "text-sm font-medium text-neutral-600",
                    "transition-colors duration-200 hover:bg-neutral-100 hover:text-brand-600",
                  )}
                  aria-label={`Call us at ${contact.phoneDisplay}`}
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden lg:inline">{contact.phoneDisplay}</span>
                </a>

                {/* Primary CTA */}
                <Button
                  href="/#contact"
                  variant="primary"
                  size="sm"
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  Book a Consultation
                </Button>
              </div>

              {/* ── Mobile hamburger ──────────────────────────── */}
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className={cn(
                  "flex items-center justify-center rounded-lg p-2",
                  "text-neutral-600 transition-colors duration-200",
                  "hover:bg-neutral-100 hover:text-brand-600",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                  "md:hidden",
                )}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                <span className="sr-only">
                  {mobileOpen ? "Close menu" : "Open menu"}
                </span>
                {/* Animated icon swap */}
                <span
                  className={cn(
                    "absolute transition-all duration-200",
                    mobileOpen
                      ? "rotate-0 opacity-100"
                      : "rotate-90 opacity-0",
                  )}
                  aria-hidden="true"
                >
                  <X className="h-5 w-5" />
                </span>
                <span
                  className={cn(
                    "transition-all duration-200",
                    mobileOpen
                      ? "-rotate-90 opacity-0"
                      : "rotate-0 opacity-100",
                  )}
                  aria-hidden="true"
                >
                  <Menu className="h-5 w-5" />
                </span>
              </button>

            </div>
          </div>

          {/* Active page indicator bar */}
          <div
            className={cn(
              "h-0.5 w-full origin-left bg-gradient-to-r from-brand-500 to-accent-500",
              "transition-transform duration-500 ease-out",
              scrolled ? "scale-x-100" : "scale-x-0",
            )}
            aria-hidden="true"
          />
        </div>
      </header>

      {/* ── Mobile nav drawer ─────────────────────────────────── */}
      <MobileNav
        id="mobile-nav"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
