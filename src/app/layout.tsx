// ============================================================
// VEM Consultants — src/app/layout.tsx
// Root layout: fonts, global metadata, OpenGraph, Header,
// Footer, FloatingWhatsApp. Wraps every page in the app.
// ============================================================

import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, JetBrains_Mono } from "next/font/google";

import Header          from "@/components/layout/Header";
import Footer          from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";

import { siteConfig }  from "@/data/site";
import "@/styles/globals.css";

// ─── Google Fonts ─────────────────────────────────────────────
//
// next/font downloads fonts at build time, self-hosts them, and
// injects zero-CLS CSS variables — no external network request
// at runtime and no layout shift.

const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-inter",
  display:  "swap",
  // Only the weights used across the site
  weight:   ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets:  ["latin"],
  variable: "--font-montserrat",
  display:  "swap",
  weight:   ["500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets:  ["latin"],
  variable: "--font-jetbrains",
  display:  "swap",
  weight:   ["400", "500"],
});

// ─── Viewport config ──────────────────────────────────────────

export const viewport: Viewport = {
  width:               "device-width",
  initialScale:        1,
  maximumScale:        5,          // allow user zoom (accessibility)
  themeColor:          [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)",  color: "#172554" },
  ],
  colorScheme: "light",
};

// ─── Root metadata ────────────────────────────────────────────
//
// page.tsx can override any of these with its own `export const metadata`.
// next/head merges them — page values take priority over layout values.

export const metadata: Metadata = {
  // ── Basic ─────────────────────────────────────────────────
  metadataBase: new URL(siteConfig.seo.canonicalUrl),

  title: {
    // page.tsx sets title directly → appears as-is
    default:  siteConfig.seo.title,
    // page.tsx sets title as a string → "%s | VEM Consultants"
    template: siteConfig.seo.titleTemplate,
  },

  description: siteConfig.seo.description,

  keywords: siteConfig.seo.keywords,

  authors: [{ name: siteConfig.brand.name, url: siteConfig.seo.canonicalUrl }],

  creator:   siteConfig.brand.name,
  publisher: siteConfig.brand.name,

  // ── Indexing ───────────────────────────────────────────────
  robots: {
    index:             true,
    follow:            true,
    googleBot: {
      index:           true,
      follow:          true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  // ── Canonical ─────────────────────────────────────────────
  alternates: {
    canonical: "/",          // resolved against metadataBase
  },

  // ── Open Graph ────────────────────────────────────────────
  openGraph: {
    type:        "website",
    locale:      "en_KE",
    url:         siteConfig.seo.canonicalUrl,
    siteName:    siteConfig.brand.name,
    title:       siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [
      {
        url:    siteConfig.seo.ogImage,  // /images/og-image.jpg
        width:  1200,
        height: 630,
        alt:    `${siteConfig.brand.name} — ${siteConfig.brand.tagline}`,
        type:   "image/jpeg",
      },
    ],
  },

  // ── Twitter / X Card ──────────────────────────────────────
  twitter: {
    card:        "summary_large_image",
    site:        siteConfig.seo.twitterHandle,
    creator:     siteConfig.seo.twitterHandle,
    title:       siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [
      {
        url: siteConfig.seo.ogImage,
        alt: `${siteConfig.brand.name} — ${siteConfig.brand.tagline}`,
      },
    ],
  },

  // ── Icons ─────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico",               sizes: "any"   },
      { url: "/icons/icon-16.png",         sizes: "16x16",  type: "image/png" },
      { url: "/icons/icon-32.png",         sizes: "32x32",  type: "image/png" },
      { url: "/icons/icon-192.png",        sizes: "192x192",type: "image/png" },
    ],
    apple:    [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: [{ url: "/favicon.ico" }],
  },

  // ── Web app manifest ──────────────────────────────────────
  manifest: "/manifest.json",

  // ── Verification (add tokens when you set up Search Console) ──
  verification: {
    // google: "YOUR_GOOGLE_VERIFICATION_TOKEN",
    // yandex: "YOUR_YANDEX_TOKEN",
  },

  // ── App metadata ──────────────────────────────────────────
  applicationName: siteConfig.brand.name,
  category:        "Business",

  // ── Other ─────────────────────────────────────────────────
  referrer: "origin-when-cross-origin",

  // Disable automatic phone-number detection on iOS
  formatDetection: {
    telephone: false,
    address:   false,
    email:     false,
  },
};

// ─── Root layout ──────────────────────────────────────────────

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={[
        inter.variable,
        montserrat.variable,
        jetbrainsMono.variable,
      ].join(" ")}
      // Prevent flash of unstyled content on some browsers
      suppressHydrationWarning
    >
      <body
        className={[
          // Base font — Inter via CSS variable
          "font-sans",
          // Prevents horizontal overflow from animations
          "overflow-x-hidden",
          // Smooth scroll handled in globals.css
          "bg-white text-neutral-800 antialiased",
        ].join(" ")}
      >

        {/*
          Skip-to-content link — appears on Tab keypress.
          Critical for keyboard and screen-reader accessibility.
        */}
        <a
          href="#main-content"
          className={[
            "fixed left-4 top-4 z-[9999]",
            "rounded-lg bg-brand-500 px-4 py-2",
            "text-sm font-semibold text-white",
            "shadow-lg",
            "-translate-y-20 opacity-0",
            "transition-all duration-200",
            "focus:translate-y-0 focus:opacity-100",
          ].join(" ")}
        >
          Skip to main content
        </a>

        {/* ── Global header (sticky, manages its own spacer) ── */}
        <Header />

        {/* ── Page content ──────────────────────────────────── */}
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>

        {/* ── Global footer ─────────────────────────────────── */}
        <Footer />

        {/* ── WhatsApp bubble (fixed, z-50) ─────────────────── */}
        <FloatingWhatsApp />

      </body>
    </html>
  );
}
