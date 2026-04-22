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

      // Old site pages
      { source: "/falls-risk-tests", destination: "/solutions/able-assess", permanent: true },
      { source: "/falls-risk-tests/", destination: "/solutions/able-assess", permanent: true },
      { source: "/low-and-at-risk", destination: "/solutions/able-assess", permanent: true },
      { source: "/low-and-at-risk/", destination: "/solutions/able-assess", permanent: true },
      { source: "/timed-up-and-go-test", destination: "/blog/falls-risk-assessment", permanent: true },
      { source: "/timed-up-and-go-test/", destination: "/blog/falls-risk-assessment", permanent: true },

      // Old blog posts → new blog paths
      { source: "/blog/able-assess-fall-risk-assessment-tool", destination: "/solutions/able-assess", permanent: true },
      { source: "/blog/able-assess-fall-risk-assessment-tool/", destination: "/solutions/able-assess", permanent: true },
      { source: "/blog/able-assess-fall-risk-screening", destination: "/blog/falls-risk-assessment", permanent: true },
      { source: "/blog/able-assess-fall-risk-screening/", destination: "/blog/falls-risk-assessment", permanent: true },
      { source: "/blog/chair-to-stand-test", destination: "/blog/functional-assessments", permanent: true },
      { source: "/blog/chair-to-stand-test/", destination: "/blog/functional-assessments", permanent: true },
      { source: "/blog/gait-speed-test", destination: "/blog/functional-assessments", permanent: true },
      { source: "/blog/gait-speed-test/", destination: "/blog/functional-assessments", permanent: true },
      { source: "/blog/timed-up-and-go-test-tug-test", destination: "/blog/functional-assessments", permanent: true },
      { source: "/blog/timed-up-and-go-test-tug-test/", destination: "/blog/functional-assessments", permanent: true },
      { source: "/blog/hand-dynamometer-guide", destination: "/blog/hand-dynamometers", permanent: true },
      { source: "/blog/hand-dynamometer-guide/", destination: "/blog/hand-dynamometers", permanent: true },
      { source: "/blog/nice-guidelines-falls-prevention-2025", destination: "/blog/nice-2025-falls-guidance-response", permanent: true },
      { source: "/blog/nice-guidelines-falls-prevention-2025/", destination: "/blog/nice-2025-falls-guidance-response", permanent: true },
      { source: "/blog/what-are-biomarkers-grip-strength", destination: "/blog/what-is-grip-strength-testing", permanent: true },
      { source: "/blog/what-are-biomarkers-grip-strength/", destination: "/blog/what-is-grip-strength-testing", permanent: true },
      { source: "/blog/functional-health-measurements-grip-strength", destination: "/blog/functional-assessments", permanent: true },
      { source: "/blog/functional-health-measurements-grip-strength/", destination: "/blog/functional-assessments", permanent: true },
      { source: "/blog/pharma-and-cros", destination: "/pharma", permanent: true },
      { source: "/blog/pharma-and-cros/", destination: "/pharma", permanent: true },

      // Old blog category pages
      { source: "/blog/category/falls-prevention", destination: "/blog", permanent: true },
      { source: "/blog/category/falls-prevention/", destination: "/blog", permanent: true },
      { source: "/blog/category/functional-health", destination: "/blog", permanent: true },
      { source: "/blog/category/functional-health/", destination: "/blog", permanent: true },
      { source: "/blog/category/grip-strength", destination: "/blog", permanent: true },
      { source: "/blog/category/grip-strength/", destination: "/blog", permanent: true },
      { source: "/blog/category/guides", destination: "/blog", permanent: true },
      { source: "/blog/category/guides/", destination: "/blog", permanent: true },
      { source: "/blog/category/insights", destination: "/blog", permanent: true },
      { source: "/blog/category/insights/", destination: "/blog", permanent: true },

      // Author pages
      { source: "/author/dr-paul-rinne", destination: "/meet-the-team", permanent: true },
      { source: "/author/dr-paul-rinne/", destination: "/meet-the-team", permanent: true },
      { source: "/author/uwp-group", destination: "/about", permanent: true },
      { source: "/author/uwp-group/", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
