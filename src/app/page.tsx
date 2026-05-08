// ============================================================
// VEM Consultants — src/app/page.tsx
// Homepage: server component that composes all sections in order.
// Section IDs here must match the href anchors in src/data/site.ts
// and the nav links in Header.tsx / MobileNav.tsx.
//
// Render order:
//   Hero → About → Services → WhyChooseUs → BookingCTA → Contact
// ============================================================

import type { Metadata } from "next";

import Hero         from "@/components/sections/Hero";
import About        from "@/components/sections/About";
import Services     from "@/components/sections/Services";
import WhyChooseUs  from "@/components/sections/WhyChooseUs";
import BookingCTA   from "@/components/shared/BookingCTA";
import Contact      from "@/components/sections/Contact";

import { siteConfig } from "@/data/site";

// ─── Page-level metadata (overrides layout.tsx defaults) ──────

export const metadata: Metadata = {
  title:       siteConfig.seo.title,
  description: siteConfig.seo.description,
  keywords:    siteConfig.seo.keywords,
  openGraph: {
    title:       siteConfig.seo.title,
    description: siteConfig.seo.description,
    url:         siteConfig.seo.canonicalUrl,
    siteName:    siteConfig.brand.name,
    images: [
      {
        url:    siteConfig.seo.ogImage,
        width:  1200,
        height: 630,
        alt:    `${siteConfig.brand.name} — ${siteConfig.brand.tagline}`,
      },
    ],
    locale: "en_KE",
    type:   "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       siteConfig.seo.title,
    description: siteConfig.seo.description,
    images:      [siteConfig.seo.ogImage],
    creator:     siteConfig.seo.twitterHandle,
    site:        siteConfig.seo.twitterHandle,
  },
  alternates: {
    canonical: siteConfig.seo.canonicalUrl,
  },
};

// ─── Structured data (JSON-LD) ─────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@type":    "ProfessionalService",
  name:        siteConfig.brand.name,
  description: siteConfig.brand.description,
  url:         siteConfig.seo.canonicalUrl,
  logo:        `${siteConfig.seo.canonicalUrl}${siteConfig.brand.logoSrc}`,
  telephone:   siteConfig.contact.phone,
  email:       siteConfig.contact.email,
  foundingDate: String(siteConfig.brand.foundedYear),
  address: {
    "@type":           "PostalAddress",
    addressLocality:    siteConfig.contact.city,
    addressCountry:     "KE",
    streetAddress:      siteConfig.contact.address,
  },
  areaServed: ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia"],
  sameAs: Object.values(siteConfig.socials).filter(Boolean),
  openingHoursSpecification: siteConfig.businessHours
    .filter((h) => h.hours !== "Closed")
    .map((h) => ({
      "@type":    "OpeningHoursSpecification",
      dayOfWeek:  h.days,
      opens:      "08:00",
      closes:     h.days.includes("Saturday") ? "13:00" : "18:00",
    })),
};

// ─── Page component ───────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* JSON-LD structured data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/*
        Each section component owns its own `id` attribute internally
        (e.g. <section id="about">). They are listed here in the exact
        order a visitor scrolls through the page.

        Anchor map (must match src/data/site.ts nav hrefs):
          /#hero      → <Hero />
          /#about     → <About />
          /#services  → <Services />
          /#why-us    → <WhyChooseUs />
          /#contact   → <Contact />
      */}

      <Hero />
      <About />
      <Services />
      <WhyChooseUs />
      <BookingCTA />
      <Contact />
    </>
  );
}
