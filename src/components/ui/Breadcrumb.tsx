import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: "dark" | "light";
}

export function Breadcrumb({ items, variant = "dark" }: BreadcrumbProps) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href && { item: `https://www.able-care.co${item.href}` }),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ol className="flex items-center flex-wrap gap-y-1 text-xs font-light">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            {i > 0 && (
              <ChevronRight className={`w-3 h-3 mx-1.5 ${variant === "light" ? "text-white/30" : "text-ac-black/30"}`} aria-hidden="true" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={variant === "light" ? "text-white/50 hover:text-white transition-colors" : "text-ac-black/50 hover:text-ac-blue transition-colors"}
              >
                {item.label}
              </Link>
            ) : (
              <span className={variant === "light" ? "text-white/70" : "text-ac-black/70"}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
