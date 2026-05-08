// ============================================================
// VEM Consultants — src/components/ui/Button.tsx
// Polymorphic button component with full variant + size system.
// Works as a <button> or renders as <a> via the `asChild` prop.
// ============================================================

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

export type ButtonVariant =
  | "primary"        // solid brand-blue — main CTAs
  | "accent"         // solid amber/gold — hero & booking CTAs
  | "outline"        // bordered brand-blue on white bg
  | "outline-light"  // bordered white — for dark/hero backgrounds
  | "ghost"          // text-only, subtle hover bg
  | "danger"         // solid red — destructive actions
  | "link";          // plain underlined link style

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

// Base props shared by both button and anchor modes
interface ButtonBaseProps {
  variant?:      ButtonVariant;
  size?:         ButtonSize;
  /** Show a spinner and disable interactions */
  loading?:      boolean;
  /** Stretch to fill its container */
  fullWidth?:    boolean;
  /** Icon placed before the label */
  leftIcon?:     ReactNode;
  /** Icon placed after the label */
  rightIcon?:    ReactNode;
  children?:     ReactNode;
  className?:    string;
}

// Button mode (default)
export type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

// Anchor mode — pass `href` to render an <a> tag
export type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

// ─── Style maps ───────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-brand-500 text-white border border-transparent",
    "hover:bg-brand-600 active:bg-brand-700",
    "shadow-md hover:shadow-lg hover:-translate-y-px",
    "focus-visible:ring-brand-500",
  ),
  accent: cn(
    "bg-accent-500 text-white border border-transparent",
    "hover:bg-accent-600 active:bg-accent-700",
    "shadow-md hover:shadow-cta hover:-translate-y-px",
    "focus-visible:ring-accent-500",
  ),
  outline: cn(
    "bg-transparent text-brand-600 border-2 border-brand-500",
    "hover:bg-brand-500 hover:text-white active:bg-brand-600",
    "focus-visible:ring-brand-500",
  ),
  "outline-light": cn(
    "bg-transparent text-white border-2 border-white",
    "hover:bg-white hover:text-brand-700 active:bg-neutral-100",
    "focus-visible:ring-white",
  ),
  ghost: cn(
    "bg-transparent text-brand-600 border border-transparent",
    "hover:bg-brand-50 hover:text-brand-700 active:bg-brand-100",
    "focus-visible:ring-brand-500",
  ),
  danger: cn(
    "bg-red-600 text-white border border-transparent",
    "hover:bg-red-700 active:bg-red-800",
    "shadow-md hover:shadow-lg hover:-translate-y-px",
    "focus-visible:ring-red-500",
  ),
  link: cn(
    "bg-transparent text-brand-600 border-0 underline underline-offset-4",
    "hover:text-brand-800 active:text-brand-900",
    "p-0 h-auto rounded-none shadow-none",
    "focus-visible:ring-brand-500",
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7  px-3   text-xs  gap-1   rounded-md",
  sm: "h-9  px-4   text-sm  gap-1.5 rounded-lg",
  md: "h-11 px-6   text-sm  gap-2   rounded-lg",
  lg: "h-12 px-8   text-base gap-2  rounded-xl",
  xl: "h-14 px-10  text-lg  gap-2.5 rounded-xl",
};

// Icon size that scales with button size
const iconSizeStyles: Record<ButtonSize, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-4 h-4",
  lg: "w-5 h-5",
  xl: "w-6 h-6",
};

// ─── Spinner ──────────────────────────────────────────────────

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  {
    variant   = "primary",
    size      = "md",
    loading   = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className,
    ...rest
  },
  ref,
) {
  const isLink  = "href" in rest && rest.href !== undefined;
  const iconCls = iconSizeStyles[size];

  const baseStyles = cn(
    // Layout
    "inline-flex items-center justify-center font-semibold",
    "select-none whitespace-nowrap",
    // Transitions
    "transition-all duration-200 ease-in-out",
    // Focus ring
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    // Disabled / loading
    "disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
    // Variant + size
    variantStyles[variant],
    sizeStyles[size],
    // Modifiers
    fullWidth && "w-full",
    loading   && "cursor-wait",
    className,
  );

  const content = (
    <>
      {/* Loading spinner replaces leftIcon when loading */}
      {loading ? (
        <Spinner className={iconCls} />
      ) : (
        leftIcon && (
          <span className={cn("shrink-0", iconCls)} aria-hidden="true">
            {leftIcon}
          </span>
        )
      )}

      {/* Label */}
      {children && (
        <span className={loading ? "opacity-70" : undefined}>
          {children}
        </span>
      )}

      {/* Right icon — hidden while loading */}
      {!loading && rightIcon && (
        <span className={cn("shrink-0", iconCls)} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </>
  );

  // ── Anchor mode ──────────────────────────────────────────
  if (isLink) {
    const { href, ...anchorRest } = rest as ButtonAsAnchor;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={baseStyles}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  // ── Button mode ──────────────────────────────────────────
  const { ...buttonRest } = rest as ButtonAsButton;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={baseStyles}
      disabled={loading || (buttonRest as ButtonHTMLAttributes<HTMLButtonElement>).disabled}
      {...buttonRest}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
