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
    "home-care", "senior-living", "skilled-nursing", "clinicians", "pharma",
    "about", "meet-the-team", "contact", "demo", "customers", "partners", "news",
    "privacy", "terms", "cookies", "security", "faqs",
  ].map((slug) => ({
    url: `${BASE_URL}/${slug}`,
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
    ...solutionPages,
    ...blogPages,
    ...resourcePages,
    ...comparePages,
  ];
}
