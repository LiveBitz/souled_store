import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============================================
  // IMAGE OPTIMIZATION - Bandwidth Reduction
  // ============================================
  images: {
    unoptimized: true,  // Bypass Vercel image optimization quota
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "zjhxlwanzqdigsvqxzau.supabase.co",
      },
      // ✅ Current Supabase project
      {
        protocol: "https",
        hostname: "zmsbmnxqhmxaaemnswzc.supabase.co",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },

  // ============================================
  // SECURITY HEADERS
  // ============================================
  async headers() {
    return [
      // Security headers on all routes (no Cache-Control here — let Next.js manage it per route type)
      {
        source: "/:path*",
        headers: [
          // Prevent clickjacking attacks
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // Prevent MIME sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Enable XSS protection
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Referrer policy
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions policy
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
        ],
      },
      // Long-lived immutable cache ONLY for Next.js static assets (JS/CSS chunks)
      // These filenames include content hashes so they are safe to cache forever.
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
    ];
  },

  // ============================================
  // REDIRECTS
  // ============================================
  async redirects() {
    return [
      {
        source: "/products",
        destination: "/category",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;