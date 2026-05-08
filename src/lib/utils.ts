// ============================================================
// VEM Consultants — src/lib/utils.ts
// General-purpose utility helpers used across the codebase.
// ============================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Tailwind class merging ────────────────────────────────────

/**
 * Merge Tailwind CSS classes safely, resolving conflicts.
 * Combines clsx (conditional classes) + tailwind-merge (dedup).
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-brand-500", "px-6")
 * // → "py-2 bg-brand-500 px-6"  (px-4 correctly overridden by px-6)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── String helpers ────────────────────────────────────────────

/**
 * Capitalise the first letter of a string.
 * @example capitalize("hello world") → "Hello world"
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a slug or camelCase string to a human-readable title.
 * @example toTitleCase("business-strategy") → "Business Strategy"
 * @example toTitleCase("hrAndPeople")       → "Hr And People"
 */
export function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Truncate a string to a max length, appending an ellipsis.
 * @example truncate("Hello World", 8) → "Hello Wo…"
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Strip all HTML tags from a string (useful for plain-text fallbacks).
 * @example stripHtml("<p>Hello</p>") → "Hello"
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Slugify a string — lowercase, hyphens, no special chars.
 * @example slugify("Business Strategy & Growth") → "business-strategy-growth"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Number helpers ────────────────────────────────────────────

/**
 * Format a number with locale-aware thousands separators.
 * @example formatNumber(1500000) → "1,500,000"
 */
export function formatNumber(n: number, locale = "en-KE"): string {
  return new Intl.NumberFormat(locale).format(n);
}

/**
 * Format a number as a compact abbreviation.
 * @example formatCompact(1500000) → "1.5M"
 */
export function formatCompact(n: number, locale = "en-KE"): string {
  return new Intl.NumberFormat(locale, {
    notation:      "compact",
    compactDisplay:"short",
  }).format(n);
}

/**
 * Clamp a number between a min and max.
 * @example clamp(150, 0, 100) → 100
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ─── Date helpers ──────────────────────────────────────────────

/**
 * Return the current 4-digit year — used in copyright lines.
 * @example currentYear() → 2025
 */
export function currentYear(): number {
  return new Date().getFullYear();
}

/**
 * Format a Date object or ISO string for display.
 * @example formatDate("2025-03-15") → "15 March 2025"
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
  locale = "en-KE",
): string {
  return new Intl.DateTimeFormat(locale, options).format(
    typeof date === "string" ? new Date(date) : date,
  );
}

// ─── URL helpers ───────────────────────────────────────────────

/**
 * Build a WhatsApp wa.me URL with an optional pre-filled message.
 * @param number  Digits only, no "+", no spaces (e.g. "254700000000")
 * @param message Optional pre-filled message text
 */
export function whatsappUrl(number: string, message?: string): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Build a mailto: URL with optional subject and body.
 */
export function mailtoUrl(
  email: string,
  subject?: string,
  body?: string,
): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body)    params.set("body", body);
  const qs = params.toString();
  return `mailto:${email}${qs ? `?${qs}` : ""}`;
}

/**
 * Return an absolute URL by prepending the site's canonical origin.
 * Falls back to a relative path if NEXT_PUBLIC_SITE_URL is not set.
 */
export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://www.vemconsultants.com";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

// ─── Async helpers ─────────────────────────────────────────────

/**
 * Sleep for a given number of milliseconds.
 * Useful for debouncing or adding deliberate delays in dev.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Type guards ───────────────────────────────────────────────

/** Check if a value is a non-empty string */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Check if a value is a plain object */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
