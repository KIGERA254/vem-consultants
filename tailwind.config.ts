import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      // ─── Brand Colors ────────────────────────────────────────────────
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#2563eb", // primary
          600: "#1d4ed8",
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#172554", // darkest
        },
        accent: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // gold / CTA accent
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        neutral: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        success: "#16a34a",
        error:   "#dc2626",
        warning: "#f59e0b",
      },

      // ─── Typography ──────────────────────────────────────────────────
      fontFamily: {
        sans:    ["var(--font-inter)",       "system-ui", "sans-serif"],
        heading: ["var(--font-montserrat)",  "Georgia",   "serif"],
        mono:    ["var(--font-jetbrains)",   "monospace"],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        xs:    ["0.75rem",  { lineHeight: "1rem" }],
        sm:    ["0.875rem", { lineHeight: "1.25rem" }],
        base:  ["1rem",     { lineHeight: "1.5rem" }],
        lg:    ["1.125rem", { lineHeight: "1.75rem" }],
        xl:    ["1.25rem",  { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem",   { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem",  { lineHeight: "2.5rem" }],
        "5xl": ["3rem",     { lineHeight: "1.1" }],
        "6xl": ["3.75rem",  { lineHeight: "1" }],
        "7xl": ["4.5rem",   { lineHeight: "1" }],
      },

      // ─── Spacing & Layout ─────────────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "section": "6rem",   // consistent vertical section padding
      },

      maxWidth: {
        "8xl":  "88rem",
        "9xl":  "96rem",
        "prose": "65ch",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // ─── Shadows ─────────────────────────────────────────────────────
      boxShadow: {
        "card":  "0 2px 16px -2px rgba(37, 99, 235, 0.08), 0 1px 4px -1px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 32px -4px rgba(37, 99, 235, 0.18), 0 2px 8px -2px rgba(0,0,0,0.08)",
        "hero":  "0 24px 64px -12px rgba(37, 99, 235, 0.3)",
        "cta":   "0 4px 20px -4px rgba(245, 158, 11, 0.45)",
        "nav":   "0 1px 0 0 rgba(0,0,0,0.06), 0 4px 16px -4px rgba(0,0,0,0.08)",
      },

      // ─── Keyframes ───────────────────────────────────────────────────
      keyframes: {
        // Entrance animations
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          "0%":   { opacity: "0", transform: "translateY(-24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-left": {
          "0%":   { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },

        // Looping / ambient
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.6" },
        },
        "spin-slow": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },

        // WhatsApp pulse (used by FloatingWhatsApp)
        "wa-ping": {
          "0%":     { boxShadow: "0 0 0 0 rgba(37,211,102,0.55)" },
          "70%":    { boxShadow: "0 0 0 14px rgba(37,211,102,0)" },
          "100%":   { boxShadow: "0 0 0 0 rgba(37,211,102,0)" },
        },

        // Hero text gradient sweep
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },

        // Counter animation helper
        "count-up": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },

        // Accordion / drawer
        "accordion-down": {
          "0%":   { height: "0", opacity: "0" },
          "100%": { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          "0%":   { height: "var(--radix-accordion-content-height)", opacity: "1" },
          "100%": { height: "0", opacity: "0" },
        },
      },

      // ─── Animation Utilities ─────────────────────────────────────────
      animation: {
        // Entrances (pair with `animate-` class + fill-mode in CSS)
        "fade-up":         "fade-up 0.6s ease both",
        "fade-up-slow":    "fade-up 0.9s ease both",
        "fade-down":       "fade-down 0.6s ease both",
        "fade-in":         "fade-in 0.5s ease both",
        "slide-in-left":   "slide-in-left 0.6s ease both",
        "slide-in-right":  "slide-in-right 0.6s ease both",
        "scale-in":        "scale-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both",

        // Looping
        "float":           "float 4s ease-in-out infinite",
        "pulse-slow":      "pulse-slow 3s ease-in-out infinite",
        "spin-slow":       "spin-slow 12s linear infinite",
        "shimmer":         "shimmer 2.5s linear infinite",
        "wa-ping":         "wa-ping 2s ease-in-out infinite",
        "gradient-x":      "gradient-x 5s ease infinite",
        "count-up":        "count-up 0.5s ease both",

        // Accordion
        "accordion-down":  "accordion-down 0.25s ease",
        "accordion-up":    "accordion-up 0.25s ease",
      },

      // ─── Transition Timing ───────────────────────────────────────────
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "smooth":    "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },

      // ─── Backdrop Blur ───────────────────────────────────────────────
      backdropBlur: {
        xs: "2px",
      },

      // ─── Background Images ───────────────────────────────────────────
      backgroundImage: {
        "hero-gradient":    "linear-gradient(135deg, #172554 0%, #1e40af 50%, #2563eb 100%)",
        "section-gradient": "linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)",
        "card-gradient":    "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)",
        "shimmer-gradient": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
        "cta-gradient":     "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
        "accent-gradient":  "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      },
    },
  },

  plugins: [],
};

export default config;
