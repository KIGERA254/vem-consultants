// ============================================================
// VEM Consultants — src/data/site.ts
// Single source of truth for all brand, contact & meta data.
// Import `siteConfig` anywhere — components, layout, SEO, etc.
// ============================================================

// ─── Types ───────────────────────────────────────────────────

export interface SocialLinks {
  linkedin?:  string;
  twitter?:   string;
  facebook?:  string;
  instagram?: string;
  youtube?:   string;
}

export interface ContactInfo {
  /** E.164-style phone for tel: links, e.g. "+254704762144" */
  phone:      string;
  /** Human-readable version shown in the UI */
  phoneDisplay: string;
  email:      string;
  /** WhatsApp number — digits only, no "+", no spaces */
  whatsapp:   string;
  address:    string;
  city:       string;
  country:    string;
  /** Google Maps embed or directions URL */
  mapsUrl?:   string;
}

export interface BusinessHours {
  days:  string;   // e.g. "Monday – Friday"
  hours: string;   // e.g. "8:00 AM – 5:00 PM"
}

export interface NavItem {
  label:    string;
  href:     string;
  /** Scroll to section id on the homepage */
  isAnchor?: boolean;
  /** Open in new tab */
  external?: boolean;
}

export interface CTAButton {
  label: string;
  href:  string;
  /** Tailwind/component class variant */
  variant: "primary" | "outline" | "accent" | "ghost" | "outline-light";
  external?: boolean;
}

export interface TeamMember {
  name:       string;
  role:       string;
  bio:        string;
  imageSrc:   string;
  linkedin?:  string;
  twitter?:   string;
}

export interface Testimonial {
  id:         string;
  quote:      string;
  author:     string;
  role:       string;
  company:    string;
  avatarSrc?: string;
  rating:     1 | 2 | 3 | 4 | 5;
}

export interface StatItem {
  value:  string;   // e.g. "200+"
  label:  string;   // e.g. "Clients Served"
  suffix?: string;  // e.g. "+" or "%"
}

export interface SEOConfig {
  title:           string;
  titleTemplate:   string;   // e.g. "%s | VEM Consultants"
  description:     string;
  keywords:        string[];
  ogImage:         string;
  twitterHandle?:  string;
  canonicalUrl:    string;
}

export interface BrandConfig {
  name:          string;
  shortName:     string;
  tagline:       string;
  description:   string;
  logoSrc:       string;
  logoAlt:       string;
  faviconSrc:    string;
  foundedYear:   number;
  /** Primary hex — keep in sync with tailwind.config.ts */
  primaryColor:  string;
  accentColor:   string;
}

export interface SiteConfig {
  brand:        BrandConfig;
  contact:      ContactInfo;
  socials:      SocialLinks;
  businessHours: BusinessHours[];
  nav:          NavItem[];
  footerNav:    { label: string; links: NavItem[] }[];
  heroCTAs:     CTAButton[];
  stats:        StatItem[];
  team:         TeamMember[];
  testimonials: Testimonial[];
  seo:          SEOConfig;
}

// ─── Data ─────────────────────────────────────────────────────

export const siteConfig: SiteConfig = {

  // ── Brand ────────────────────────────────────────────────
  brand: {
    name:         "VEM Consultants",
    shortName:    "VEM",
    tagline:      "Your Vision. Our Expertise.",
    description:
      "VEM Consultants is a Nairobi-based strategic advisory firm helping " +
      "businesses across East Africa achieve sustainable growth through " +
      "expert consulting, financial advisory, and operational excellence.",
    logoSrc:      "/images/logo.svg",
    logoAlt:      "VEM Consultants logo",
    faviconSrc:   "/favicon.ico",
    foundedYear:  2015,
    primaryColor: "#2563eb",
    accentColor:  "#f59e0b",
  },

  // ── Contact ──────────────────────────────────────────────
  contact: {
    phone:        "+254707143663",
    phoneDisplay: "+254 704 762 144",
    email:        "info@vemconsultants.com",
    whatsapp:     "254704762144",
    address:      "Likoni, Mombasa",
    city:         "Mombasa",
    country:      "Kenya",
    mapsUrl:
      "https://maps.google.com/?q=Likoni+Mombasa+Kenya",
  },

  // ── Socials ──────────────────────────────────────────────
  socials: {
    linkedin:  "https://linkedin.com/company/vem-consultants",
    twitter:   "https://twitter.com/vemconsultants",
    facebook:  "https://facebook.com/vemconsultants",
    instagram: "https://instagram.com/vemconsultants",
  },

  // ── Business Hours ───────────────────────────────────────
  businessHours: [
    { days: "Monday – Friday", hours: "8:00 AM – 6:00 PM" },
    { days: "Saturday",        hours: "9:00 AM – 1:00 PM" },
    { days: "Sunday",          hours: "Closed" },
  ],

  // ── Main Navigation ──────────────────────────────────────
  nav: [
    { label: "Home",         href: "/",           isAnchor: false },
    { label: "About",        href: "/#about",     isAnchor: true  },
    { label: "Services",     href: "/#services",  isAnchor: true  },
    { label: "Why Us",       href: "/#why-us",    isAnchor: true  },
    { label: "Contact",      href: "/#contact",   isAnchor: true  },
  ],

  // ── Footer Navigation ────────────────────────────────────
  footerNav: [
    {
      label: "Company",
      links: [
        { label: "About Us",    href: "/#about"    },
        { label: "Our Team",    href: "/#team"     },
        { label: "Careers",     href: "/careers"   },
        { label: "Blog",        href: "/blog"      },
      ],
    },
    {
      label: "Services",
      links: [
        { label: "Business Consulting", href: "/#services" },
        { label: "Financial Advisory",  href: "/#services" },
        { label: "HR & Recruitment",    href: "/#services" },
        { label: "Legal Advisory",      href: "/#services" },
      ],
    },
    {
      label: "Legal",
      links: [
        { label: "Privacy Policy",    href: "/privacy"  },
        { label: "Terms of Service",  href: "/terms"    },
        { label: "Cookie Policy",     href: "/cookies"  },
      ],
    },
  ],

  // ── Hero CTA Buttons ─────────────────────────────────────
  heroCTAs: [
    {
      label:   "Book a Free Consultation",
      href:    "/#contact",
      variant: "accent",
    },
    {
      label:   "Explore Our Services",
      href:    "/#services",
      variant: "outline-light",
    },
  ],

  // ── Stats (About / Hero section) ─────────────────────────
  stats: [
    { value: "10",   label: "Years of Experience", suffix: "+"  },
    { value: "200",  label: "Clients Served",       suffix: "+"  },
    { value: "95",   label: "Client Satisfaction",  suffix: "%"  },
    { value: "15",   label: "Expert Consultants",   suffix: "+"  },
  ],

  // ── Team Members ─────────────────────────────────────────
  team: [
    {
      name:     "Victor E. Mwangi",
      role:     "Founder & CEO",
      bio:      "15+ years in strategic management and business development across East Africa.",
      imageSrc: "/images/team/victor.jpg",
      linkedin: "https://linkedin.com/in/victor-mwangi",
    },
    {
      name:     "Evelyn Njoroge",
      role:     "Director, Financial Advisory",
      bio:      "CPA(K) with deep expertise in corporate finance and investment structuring.",
      imageSrc: "/images/team/evelyn.jpg",
      linkedin: "https://linkedin.com/in/evelyn-njoroge",
    },
    {
      name:     "David Kigera",
      role:     `Head of IT & Operations`,
      bio:      "Specialist in talent acquisition, organisational design, and people strategy.",
      imageSrc: "/images/team/michael.jpg",
      linkedin: "https://linkedin.com/in/michael-oduya",
    },
  ],

  // ── Testimonials ─────────────────────────────────────────
  testimonials: [
    {
      id:      "t1",
      quote:
        "VEM Consultants transformed our financial reporting processes. " +
        "Their team was professional, thorough, and delivered beyond expectations.",
      author:  "Sarah Kamau",
      role:    "CFO",
      company: "Horizon Group Kenya",
      rating:  5,
    },
    {
      id:      "t2",
      quote:
        "We engaged VEM for a full HR restructure and the results have been " +
        "outstanding. Employee satisfaction is up 40% in six months.",
      author:  "James Otieno",
      role:    "CEO",
      company: "TechBridge Africa",
      rating:  5,
    },
    {
      id:      "t3",
      quote:
        "Their strategic market entry roadmap saved us months of guesswork " +
        "and helped us launch confidently in three new markets.",
      author:  "Amina Hassan",
      role:    "Head of Expansion",
      company: "Savanna Retail",
      rating:  5,
    },
  ],

  // ── SEO ──────────────────────────────────────────────────
  seo: {
    title:         "VEM Consultants — Strategic Advisory in East Africa",
    titleTemplate: "%s | VEM Consultants",
    description:
      "VEM Consultants offers expert business consulting, financial advisory, " +
      "HR solutions, and legal services to businesses across East Africa. " +
      "Based in Nairobi, Kenya.",
    keywords: [
      "business consulting Kenya",
      "financial advisory Nairobi",
      "HR consulting East Africa",
      "management consulting Kenya",
      "VEM Consultants",
      "strategic advisory Nairobi",
    ],
    ogImage:       "/images/og-image.jpg",
    twitterHandle: "@vemconsultants",
    canonicalUrl:  "https://www.vemconsultants.com",
  },
};

// ─── Convenience exports ───────────────────────────────────────
// These let you import only what you need, e.g.:
//   import { contact, nav } from "@/data/site"

export const { brand, contact, socials, businessHours, nav,
               footerNav, heroCTAs, stats, team, testimonials, seo }
  = siteConfig;

/** Pre-built WhatsApp href with a default greeting */
export const whatsappHref = (message = "Hello! I'd like to learn more about VEM Consultants.") =>
  `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;

/** Full copyright line, e.g. "© 2025 VEM Consultants. All rights reserved." */
export const copyrightLine =
  `© ${new Date().getFullYear()} ${siteConfig.brand.name}. All rights reserved.`;
