"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface AlertBannerProps {
  type?: string;
  text: string;
  ctaText?: string;
  ctaLink?: string;
}

export function AlertBanner({ type = "info", text, ctaText, ctaLink }: AlertBannerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const bgClass =
    type === "warning" ? "bg-yellow-100 text-yellow-900"
    : type === "success" ? "bg-green-100 text-green-900"
    : "bg-ac-aqua text-ac-black";

  return (
    <div className={`${bgClass} py-2 px-4 relative`}>
      <div className="container mx-auto flex items-center justify-center text-sm font-medium pr-8">
        <span>{text}</span>
        {ctaText && ctaLink && (
          <Link href={ctaLink} className="ml-2 underline hover:text-ac-blue transition-colors font-bold">
            {ctaText}
          </Link>
        )}
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 opacity-60 hover:opacity-100 p-1"
          aria-label="Close alert"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
