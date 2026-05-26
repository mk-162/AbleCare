import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const BASE_URL = "https://www.able-care.co";

function getJsonSlugs(dir: string): string[] {
  try {
    const fullPath = path.join(process.cwd(), dir);
    return fs
      .readdirSync(fullPath)
      .filter((f) => f.endsWith(".json"))
      .filter((f) => {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(fullPath, f), "utf-8"));
          return data.draft !== true;
        } catch {
          return true;
        }
      })
      .map((f) => f.replace(".json", ""));
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/resources`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  // SLUG_MAP pages (segments, company, utility, etc.)
  const slugMapPages = [
    "home-care", "senior-living", "skilled-nursing", "pharma",
    "about", "meet-the-team", "contact", "demo", "customers", "partners", "news",
    "privacy", "terms", "cookies", "security", "faqs", "careers", "compliance",
  ].map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Home care sub-segment pages
  const homeCareSubPages = ["pe-backed", "independent"].map((slug) => ({
    url: `${BASE_URL}/home-care/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Senior living sub-segment pages
  const seniorLivingSubPages = ["ccrc-life-plan", "independent-living", "assisted-living", "rental-retirement"].map((slug) => ({
    url: `${BASE_URL}/senior-living/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Product pages
  const productSlugs = getJsonSlugs("content/pages").filter((s) => ["how-it-works", "integrations", "security"].includes(s));
  const productPages = productSlugs.map((slug) => ({
    url: `${BASE_URL}/product/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Blog posts
  const blogSlugs = getJsonSlugs("content/learn");
  const blogPages = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Solution pages
  const solutionSlugs = getJsonSlugs("content/solutions");
  const solutionPages = solutionSlugs.map((slug) => ({
    url: `${BASE_URL}/solutions/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Resource pages
  const resourceSlugs = getJsonSlugs("content/resources");
  const resourcePages = resourceSlugs.map((slug) => ({
    url: `${BASE_URL}/resources/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Compare pages
  const compareSlugs = getJsonSlugs("content/compare");
  const comparePages = compareSlugs.map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...slugMapPages,
    ...homeCareSubPages,
    ...seniorLivingSubPages,
    ...productPages,
    ...solutionPages,
    ...blogPages,
    ...resourcePages,
    ...comparePages,
  ];
}
