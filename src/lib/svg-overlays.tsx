"use client";

import React from "react";

export type WaveStyle = "ribbon" | "crest" | "fold" | "pulse" | "arc" | "none";

interface SvgOverlayProps {
  variant: WaveStyle;
  className?: string;
}

export function SvgOverlay({ variant, className = "" }: SvgOverlayProps) {
  if (variant === "none") return null;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {variant === "crest" && (
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute w-full h-full text-ac-blue" fill="currentColor">
          <path d="M0,160L80,144C160,128,320,96,480,101.3C640,107,800,149,960,144C1120,139,1280,85,1360,58.7L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" />
        </svg>
      )}
      {variant === "ribbon" && (
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute w-full h-full text-ac-blue" fill="currentColor">
          <path d="M0,224L60,208C120,192,240,160,360,160C480,160,600,192,720,202.7C840,213,960,203,1080,170.7C1200,139,1320,85,1380,58.7L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
      )}
      {variant === "fold" && (
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute w-full h-full text-ac-blue" fill="currentColor">
          <path d="M0,0L1440,320L0,320Z" />
        </svg>
      )}
      {variant === "pulse" && (
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute w-full h-full text-ac-blue" fill="currentColor">
          <path d="M0,192L48,192C96,192,192,192,288,208C384,224,480,256,576,234.7C672,213,768,139,864,117.3C960,96,1056,128,1152,149.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      )}
      {variant === "arc" && (
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute w-full h-full text-ac-blue" fill="currentColor">
          <path d="M0,320C480,0,960,0,1440,320Z" />
        </svg>
      )}
    </div>
  );
}
