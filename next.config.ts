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

      // Old site pages (non-blog) that no longer exist as standalone pages
      { source: "/falls-risk-tests", destination: "/solutions/able-assess", permanent: true },
      { source: "/falls-risk-tests/", destination: "/solutions/able-assess", permanent: true },
      { source: "/low-and-at-risk", destination: "/solutions/able-assess", permanent: true },
      { source: "/low-and-at-risk/", destination: "/solutions/able-assess", permanent: true },

      // Author pages
      { source: "/author/dr-paul-rinne", destination: "/meet-the-team", permanent: true },
      { source: "/author/dr-paul-rinne/", destination: "/meet-the-team", permanent: true },
      { source: "/author/uwp-group", destination: "/about", permanent: true },
      { source: "/author/uwp-group/", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
