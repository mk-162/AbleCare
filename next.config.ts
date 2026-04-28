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
    ];
  },
};

export default nextConfig;
