/**
 * Sidebar widget loader.
 *
 * Reads content/settings/sidebar-widgets.json at build time and exposes the
 * configured widgets for the blog sidebar. Falls back to hard-coded defaults
 * if the file is missing or malformed, so the site never breaks on a bad edit
 * in Tina.
 *
 * Usage:
 *   import { getSidebarWidgets } from "@/lib/sidebar-widgets";
 *   const { blogSidebar } = getSidebarWidgets();
 */

export type SidebarWidgetVariant = "whitepaper" | "tool" | "landing";

export interface SidebarWidget {
  title: string;
  description: string;
  ctaText?: string;
  ctaLink: string;
  variant?: SidebarWidgetVariant;
}

export interface SidebarWidgets {
  blogSidebar: { widgets: SidebarWidget[] };
}

const DEFAULTS: SidebarWidgets = {
  blogSidebar: {
    widgets: [
      {
        title: "Falls Prevention Buyer's Guide",
        description:
          "Compare the leading falls prevention tools side-by-side. Download the free guide.",
        ctaText: "Download Guide",
        ctaLink: "/resources/buyers-guide",
        variant: "whitepaper",
      },
      {
        title: "Book a Demo",
        description:
          "See Able Assess in action, tailored to your care setting. No slides, no fluff.",
        ctaText: "Book a Demo",
        ctaLink: "/demo",
        variant: "landing",
      },
    ],
  },
};

let _cache: SidebarWidgets | null = null;

function normalise(section: unknown, fallback: { widgets: SidebarWidget[] }): { widgets: SidebarWidget[] } {
  if (!section || typeof section !== "object") return fallback;
  const widgets = (section as { widgets?: unknown }).widgets;
  if (!Array.isArray(widgets)) return fallback;

  const cleaned: SidebarWidget[] = [];
  for (const w of widgets) {
    if (!w || typeof w !== "object") continue;
    const widget = w as Record<string, unknown>;
    const title = typeof widget.title === "string" ? widget.title : "";
    const description = typeof widget.description === "string" ? widget.description : "";
    const ctaLink = typeof widget.ctaLink === "string" ? widget.ctaLink : "";
    if (!title || !ctaLink) continue;
    cleaned.push({
      title,
      description,
      ctaLink,
      ctaText: typeof widget.ctaText === "string" ? widget.ctaText : undefined,
      variant:
        widget.variant === "whitepaper" || widget.variant === "tool" || widget.variant === "landing"
          ? widget.variant
          : undefined,
    });
  }

  return cleaned.length > 0 ? { widgets: cleaned } : fallback;
}

export function getSidebarWidgets(): SidebarWidgets {
  if (_cache) return _cache;

  try {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const fs = require("fs");
    const path = require("path");
    /* eslint-enable @typescript-eslint/no-require-imports */

    const file = path.join(process.cwd(), "content/settings/sidebar-widgets.json");
    const raw = fs.readFileSync(file, "utf-8");
    const data = JSON.parse(raw);

    _cache = {
      blogSidebar: normalise(data?.blogSidebar, DEFAULTS.blogSidebar),
    };
  } catch {
    _cache = DEFAULTS;
  }

  return _cache;
}
