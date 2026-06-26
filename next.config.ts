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
    // Unlinked pages removed 2026-06-19 (governance cleanup): 301 each old URL to
    // its nearest nav-reachable page so there are no 404s or dangling inbound links.
    const removed: [string, string][] = [
      // Solutions (Able Assess / Grip Strength / Able Rehab / Sensor remain in nav)
      ["/solutions/able-strength", "/solutions/able-assess"],
      ["/solutions/falls-prevention", "/solutions/able-assess"],
      ["/solutions/functional-health", "/solutions/able-assess"],
      ["/solutions/population-health", "/solutions/able-assess"],
      ["/solutions/remote-monitoring", "/solutions/able-assess"],
      // Segment sub-pages (parent segments remain in nav)
      ["/clinicians", "/"],
      ["/home-care/pe-backed", "/home-care"],
      ["/home-care/independent", "/home-care"],
      ["/senior-living/ccrc-life-plan", "/senior-living"],
      ["/senior-living/independent-living", "/senior-living"],
      ["/senior-living/assisted-living", "/senior-living"],
      ["/senior-living/rental-retirement", "/senior-living"],
      // Resource pages (Research Library / Documents / Case Studies remain in nav)
      ["/resources/1-pagers", "/resources"],
      ["/resources/buyers-guide", "/resources"],
      ["/resources/ccrc-guide", "/resources"],
      ["/resources/downloads", "/resources/documents"],
      ["/resources/evidence", "/resources/research-library"],
      ["/resources/guides", "/resources"],
      ["/resources/hhvbp-guide", "/resources"],
      ["/resources/roi-calculator", "/resources"],
      ["/resources/walkthrough", "/resources/documents"],
      ["/resources/webinars", "/resources"],
      // Company pages (About / Contact / Support / Meet the Team remain in nav)
      ["/customers", "/about"],
      ["/partners", "/about"],
      ["/news", "/about"],
      ["/careers", "/about"],
      // Product detail pages (/product/*)
      ["/product/how-it-works", "/solutions/able-assess"],
      ["/product/integrations", "/solutions/able-assess"],
      ["/product/security", "/security"],
      ["/product/clinical-validation", "/compliance"],
      // Standalone tool / dev routes
      ["/roi-calculator", "/demo"],
      ["/gripable", "/solutions/sensor"],
      ["/component-library", "/"],
    ];

    return [
      // Old segment URL
      { source: "/for/pharma-and-cros", destination: "/pharma", permanent: true },
      { source: "/for/pharma-and-cros/", destination: "/pharma", permanent: true },

      // Author pages (meet-the-team removed -> About)
      { source: "/author/dr-paul-rinne", destination: "/about", permanent: true },
      { source: "/author/dr-paul-rinne/", destination: "/about", permanent: true },
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

      // Unlinked pages removed in the 2026-06-19 governance cleanup
      ...removed.flatMap(([source, destination]) => [
        { source, destination, permanent: true },
        { source: `${source}/`, destination, permanent: true },
      ]),
    ];
  },
};

export default nextConfig;
