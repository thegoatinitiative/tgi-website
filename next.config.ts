import type { NextConfig } from "next";

const securityHeaders = [
  {
    // Prevent clickjacking attacks
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Prevent MIME type sniffing
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Enable XSS filtering
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    // Control referrer information
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Permissions policy (formerly feature policy)
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  // Redirects for Google sitelinks
  async redirects() {
    return [
      {
        source: '/who-we-are',
        destination: '/mission',
        permanent: true,
      },
      {
        source: '/who-are-we',
        destination: '/mission',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/mission',
        permanent: true,
      },
      {
        source: '/our-team',
        destination: '/operatives',
        permanent: true,
      },
      {
        source: '/team',
        destination: '/operatives',
        permanent: true,
      },
      {
        source: '/cory-gautereaux',
        destination: '/operatives',
        permanent: true,
      },
      {
        source: '/stories',
        destination: '/articles',
        permanent: true,
      },
      {
        source: '/submit-a-tip-or-lead',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/submit-tip',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/tip',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/tips',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/lead',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/leads',
        destination: '/contact',
        permanent: true,
      },
    ];
  },
  // Allow external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
};

export default nextConfig;
