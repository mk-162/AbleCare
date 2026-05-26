import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    scrollRestoration: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.tina.io" },
    ],
  },
  async rewrites() {
    return [
      { source: "/admin", destination: "/admin/index.html" },
      { source: "/admin/:path*", destination: "/admin/:path*" },
    ];
  },
  async redirects() {
    return [
      // Old segment URL
      { source: "/for/pharma-and-cros", destination: "/pharma", permanent: true },
      { source: "/for/pharma-and-cros/", destination: "/pharma", permanent: true },

      // Author pages
      { source: "/author/dr-paul-rinne", destination: "/meet-the-team", permanent: true },
      { source: "/author/dr-paul-rinne/", destination: "/meet-the-team", permanent: true },
      { source: "/author/uwp-group", destination: "/about", permanent: true },
      { source: "/author/uwp-group/", destination: "/about", permanent: true },

      // Compliance moved from evidence section to top-level
      { source: "/evidence/compliance", destination: "/compliance", permanent: true },
      { source: "/evidence/compliance/", destination: "/compliance", permanent: true },

      // Technical Documentation renamed to Documents
      { source: "/resources/technical-documentation", destination: "/resources/documents", permanent: true },
      { source: "/resources/technical-documentation/", destination: "/resources/documents", permanent: true },

      // Falls Risk Tests page merged into Able Assess solution page
      { source: "/falls-risk-tests", destination: "/solutions/able-assess", permanent: true },
      { source: "/falls-risk-tests/", destination: "/solutions/able-assess", permanent: true },

      // Low-and-at-risk results page videos now live on the Able Assess solution page
      { source: "/low-and-at-risk", destination: "/solutions/able-assess", permanent: true },
      { source: "/low-and-at-risk/", destination: "/solutions/able-assess", permanent: true },
    ];
  },
};

export default nextConfig;
