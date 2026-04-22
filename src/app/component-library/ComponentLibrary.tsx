"use client";

import { AdminGate } from "@/components/ui/AdminGate";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { blockSamples } from "./samples";

function slugify(name: string): string {
  return name.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
}

export function ComponentLibrary() {
  return (
    <AdminGate>
      <div className="bg-white">
        <header className="border-b border-black/10 bg-white">
          <div className="container mx-auto px-4 md:px-6 py-16 max-w-6xl">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ac-blue mb-4">
              Admin
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-ac-black mb-4">
              Component Library
            </h1>
            <p className="text-lg font-light text-ac-black/70 max-w-2xl">
              Every page block rendered with sample content, so admins can see at a glance what each one looks like.
            </p>

            <nav aria-label="Block index" className="mt-10">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-ac-black/40 mb-3">
                Index
              </div>
              <ul className="flex flex-wrap gap-2">
                {blockSamples.map((s) => (
                  <li key={s.name}>
                    <a
                      href={`#${slugify(s.name)}`}
                      className="inline-block rounded-full border border-black/10 px-3 py-1 text-sm text-ac-black/70 hover:border-ac-blue hover:text-ac-blue transition-colors"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        {blockSamples.map((sample) => (
          <section key={sample.name} id={slugify(sample.name)} className="scroll-mt-24">
            <div className="border-y border-black/10 bg-ac-grey">
              <div className="container mx-auto px-4 md:px-6 py-5 max-w-6xl flex items-baseline justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-ac-black/50">
                    Block
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-ac-black">
                    {sample.label}
                  </h2>
                </div>
                <code className="text-xs md:text-sm text-ac-black/60 font-mono bg-white rounded px-2 py-1 border border-black/10">
                  {sample.name}
                </code>
              </div>
            </div>
            <div className="relative">
              <BlockRendererNoFooter block={sample.block} />
            </div>
          </section>
        ))}
      </div>
    </AdminGate>
  );
}

/**
 * Renders a single block via BlockRenderer. BlockRenderer always appends a
 * FooterTransition wave; we render it here but hide the final wave on each
 * block using a wrapper that clips it. Keeps BlockRenderer untouched.
 */
function BlockRendererNoFooter({ block }: { block: Record<string, unknown> }) {
  return (
    <div className="[&>div:last-child]:hidden">
      <BlockRenderer blocks={[block]} />
    </div>
  );
}
