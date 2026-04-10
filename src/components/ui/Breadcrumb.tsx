import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-y-1 text-xs font-light">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            {i > 0 && (
              <ChevronRight className="w-3 h-3 mx-1.5 text-ac-black/30" aria-hidden="true" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-ac-black/50 hover:text-ac-blue transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-ac-black/70">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
