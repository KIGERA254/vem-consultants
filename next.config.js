/** @type {import('next').NextConfig} */
const nextConfig = {

  // ─── Images ───────────────────────────────────────────────────
  // Allow Next.js <Image /> to load from these external domains.
  // Add more as needed (e.g. your CMS or CDN hostname).
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Supported image formats (WebP + AVIF for best compression)
    formats: ["image/avif", "image/webp"],
  },

  // ─── Trailing slash ───────────────────────────────────────────
  // Set to true if your hosting requires /about/ instead of /about
  trailingSlash: false,

  // ─── React strict mode ────────────────────────────────────────
  // Highlights potential issues during development. Keep true.
  reactStrictMode: true,

  // ─── SWC minification ─────────────────────────────────────────
  // Uses Next.js built-in Rust compiler. Faster than Terser.
  swcMinify: true,

  // ─── Environment variables exposed to the browser ─────────────
  // NEXT_PUBLIC_* vars in .env.local are already auto-exposed.
  // Add any additional public vars here if needed.
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://www.vemconsultants.com",
  },

  // ─── Redirects ────────────────────────────────────────────────
  // Example: redirect old /home to /
  async redirects() {
    return [
      {
        source:      "/home",
        destination: "/",
        permanent:   true,
      },
    ];
  },

  // ─── Headers ─────────────────────────────────────────────────
  // Security headers applied to every response.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key:   "X-Frame-Options",
            value: "DENY",
          },
          {
            key:   "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key:   "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key:   "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

};

module.exports = nextConfig;
