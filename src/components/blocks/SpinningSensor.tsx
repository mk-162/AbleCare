"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FRAMES,
  FRAME_COUNT,
  F_KEYS,
  FEATURES,
  HERO_GRADIENT,
  type Feature,
  type Legend,
} from "./spinning-sensor-data";

interface SpinningSensorProps {
  heading?: string;
  eyebrow?: string;
  description?: string;
}

const MOBILE_BREAKPOINT = 720;

export function SpinningSensor(props: SpinningSensorProps) {
  const heading = props.heading || "GripAble sensor features.";
  const eyebrow = props.eyebrow || "ABOUT GRIPABLE";
  const description = props.description || "Designed with precision. Built for real-world care.";
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: Math.max(0, rect.width), h: Math.min(880, Math.max(620, rect.width * 0.62)) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isMobile = size.w > 0 && size.w < MOBILE_BREAKPOINT;

  return (
    <section className="bg-[#0b1fd4] md:px-6 md:py-12 lg:px-8">
      <div
        className="relative mx-auto overflow-hidden md:rounded-2xl md:shadow-2xl"
        style={{ background: HERO_GRADIENT, maxWidth: 1440 }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 560px at 90% 0%, rgba(0,255,210,0.22), transparent 60%), radial-gradient(900px 560px at 0% 100%, rgba(255,255,255,0.10), transparent 60%)",
          }}
        />
        <AbleCareMark />

        <div ref={stageRef} className="relative w-full">
          {isMobile ? (
            <SpinningSensorMobile heading={heading} eyebrow={eyebrow} description={description} />
          ) : (
            <div className="relative mx-auto" style={{ width: "100%", height: size.h || 720 }}>
              {size.w > 0 && (
                <SpinningSensorDesktop
                  width={size.w}
                  height={size.h}
                  heading={heading}
                  eyebrow={eyebrow}
                  description={description}
                />
              )}
            </div>
          )}
        </div>
        <Keyframes />
      </div>
    </section>
  );
}

/* ─── Shared rotation engine ───────────────────────────────────────────── */

function useRotationEngine(initialFrame = 2) {
  const [frame, setFrame] = useState(initialFrame);
  const targetFrame = useRef(initialFrame);
  const rafRef = useRef<number | null>(null);

  const setTarget = (t: number) => {
    targetFrame.current = Math.max(0, Math.min(FRAME_COUNT - 1, t));
    if (rafRef.current != null) return;
    const tick = () => {
      setFrame((f) => {
        const diff = targetFrame.current - f;
        if (Math.abs(diff) < 0.05) {
          rafRef.current = null;
          return targetFrame.current;
        }
        rafRef.current = requestAnimationFrame(tick);
        return f + diff * 0.18;
      });
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
  }, []);

  return { frame, setTarget, targetFrame };
}

/* ─── Desktop annotated viewer ─────────────────────────────────────────── */

interface ViewerProps {
  width: number;
  height: number;
  heading: string;
  eyebrow: string;
  description?: string;
}

function SpinningSensorDesktop({ width, height, heading, eyebrow, description }: ViewerProps) {
  const { frame, setTarget, targetFrame } = useRotationEngine(2);
  const [active, setActive] = useState<number | null>(null);
  const [tourMode, setTourMode] = useState(false);
  const [hint, setHint] = useState(true);
  const [grabbing, setGrabbing] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ active: false, startX: 0, startFrame: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, startX: e.clientX, startFrame: targetFrame.current };
    setHint(false);
    setGrabbing(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) {
      if (!stageRef.current || tourMode) return;
      const rect = stageRef.current.getBoundingClientRect();
      const t = (e.clientX - rect.left) / rect.width;
      setTarget(Math.max(0, Math.min(1, t)) * (FRAME_COUNT - 1));
      return;
    }
    const dx = e.clientX - drag.current.startX;
    setTarget(drag.current.startFrame + (dx / 320) * (FRAME_COUNT - 1));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    drag.current.active = false;
    setGrabbing(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  useEffect(() => {
    if (active == null) return;
    const f = F_KEYS[active];
    if (f) setTarget(f.bestFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const onSelectFeature = (n: number) => {
    setTourMode(true);
    setActive(n);
    setHint(false);
  };
  const exitTour = () => {
    setTourMode(false);
    setActive(null);
  };

  const isCompact = width < 1100;
  const cardW = isCompact ? 200 : 250;
  const railLeftX = isCompact ? 32 : 56;
  const railRightX = width - railLeftX - cardW;
  const cardGap = 24;
  const maxDevByWidth = Math.max(220, width - 2 * (railLeftX + cardW + cardGap));
  const devW = Math.min(400, maxDevByWidth);
  const devH = devW * (779 / 600);
  const devX = width / 2 - devW / 2;
  const devY = (height - devH) / 2 + 30;
  const SCALE = devW / 600;

  const placeCol = (ids: number[], side: "left" | "right") => {
    const padTop = 150, padBot = 80;
    const usable = height - padTop - padBot;
    const step = usable / Math.max(ids.length, 1);
    return ids.map((n, idx) => ({
      n,
      cardX: side === "left" ? railLeftX : railRightX,
      cardY: padTop + step * idx,
      side,
    }));
  };
  const cards = [...placeCol([1, 7, 6], "left"), ...placeCol([2, 3, 4, 5], "right")];
  const frameInt = Math.round(frame);

  const hotspots = FEATURES.map((F) => {
    const exact = F_KEYS[F.n].pos[frameInt];
    if (!exact) return { n: F.n, sx: 0, sy: 0, hidden: true };
    return { n: F.n, sx: devX + exact.x * SCALE, sy: devY + exact.y * SCALE, hidden: false };
  });

  return (
    <div
      className="absolute inset-0 select-none"
      style={{ cursor: grabbing ? "grabbing" : "default", color: "#fff" }}
    >
      {/* Header */}
      <div className="absolute left-0 right-0 z-[5] text-center" style={{ top: 56, padding: "0 80px" }}>
        <div
          className="mb-3"
          style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.25em", color: "#00FFD2" }}
        >
          {eyebrow}
        </div>
        <h2 className="m-0" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em" }}>
          {heading}
        </h2>
        {description && (
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", margin: "10px 0 0", fontWeight: 300 }}>
            {description}
          </p>
        )}
      </div>

      {/* Connector lines */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="pointer-events-none absolute inset-0 z-[3]"
      >
        {cards.map((c) => {
          const h = hotspots.find((x) => x.n === c.n);
          if (!h || h.hidden) return null;
          if (tourMode && active !== c.n) return null;
          const isActive = active === c.n;
          const badgeCenterX = c.side === "left" ? c.cardX + cardW - 14 : c.cardX + 14;
          const cardCenterY = c.cardY + 14;
          const stroke = isActive ? "#00FFD2" : "rgba(255,255,255,0.55)";
          const w = isActive ? 2 : 1;
          const dx = (badgeCenterX - h.sx) * 0.5;
          const d = `M ${h.sx},${h.sy} C ${h.sx + dx},${h.sy} ${badgeCenterX - dx},${cardCenterY} ${badgeCenterX},${cardCenterY}`;
          return <path key={c.n} d={d} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round" />;
        })}
      </svg>

      {/* Device stage */}
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="absolute z-[2]"
        style={{
          left: devX - 80,
          top: devY - 40,
          width: devW + 160,
          height: devH + 80,
          cursor: grabbing ? "grabbing" : "grab",
          touchAction: "none",
        }}
      >
        <div className="absolute" style={{ left: 80, top: 40, width: devW, height: devH }}>
          {FRAMES.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              aria-hidden={i !== frameInt}
              draggable={false}
              className="pointer-events-none absolute inset-0"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: i === frameInt ? 1 : 0,
                transition: "opacity 60ms linear",
                filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.18))",
              }}
            />
          ))}
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              left: "50%",
              bottom: -10,
              transform: "translateX(-50%)",
              width: devW * 0.55,
              height: 22,
              borderRadius: "50%",
              background: "radial-gradient(ellipse at center, rgba(0,255,210,0.35) 0%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />
        </div>

        {hotspots.map((h) => {
          if (h.hidden) return null;
          if (tourMode && active !== h.n) return null;
          return (
            <button
              key={h.n}
              onClick={(e) => { e.stopPropagation(); onSelectFeature(h.n); }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={`Feature ${h.n}: ${F_KEYS[h.n].label}`}
              className="absolute z-[4] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-0 bg-transparent p-0"
              style={{ left: h.sx - devX + 80, top: h.sy - devY + 40, width: 28, height: 28 }}
            />
          );
        })}

        {hint && (
          <div
            className="pointer-events-none absolute inline-flex items-center gap-2"
            style={{
              left: "50%",
              bottom: 0,
              transform: "translateX(-50%)",
              background: "rgba(20,50,255,0.95)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              boxShadow: "0 4px 16px rgba(20,50,255,0.3)",
              animation: "ga-bob 2s ease-in-out infinite",
              whiteSpace: "nowrap",
            }}
          >
            <RotateIcon /> Drag or hover to rotate
          </div>
        )}
      </div>

      {/* Cards */}
      {cards.map((c) => {
        const F = F_KEYS[c.n];
        const isActive = active === c.n;
        return (
          <div
            key={c.n}
            onClick={() => onSelectFeature(c.n)}
            className="absolute cursor-pointer transition-all duration-300"
            style={{
              left: c.cardX - (isActive ? 14 : 0),
              top: c.cardY - (isActive ? 10 : 0),
              width: cardW + (isActive ? 28 : 0),
              zIndex: isActive ? 10 : 4,
              padding: isActive ? "14px 16px" : 0,
              borderRadius: isActive ? 14 : 0,
              background: isActive ? "#fff" : "transparent",
              boxShadow: isActive ? "0 12px 32px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,255,210,0.4)" : "none",
            }}
          >
            <div
              className="flex items-start gap-3"
              style={{ flexDirection: c.side === "left" ? "row-reverse" : "row" }}
            >
              <Badge n={c.n} active={isActive} scheme={isActive ? "light" : "blue"} onClick={(e) => { e.stopPropagation(); onSelectFeature(c.n); }} />
              <div style={{ minWidth: 0, textAlign: c.side === "left" ? "right" : "left" }}>
                <div
                  style={{
                    fontSize: isActive ? 17 : (isCompact ? 14 : 16),
                    fontWeight: 700,
                    letterSpacing: "-0.005em",
                    marginBottom: 4,
                    color: isActive ? "#191919" : "#fff",
                    transition: "font-size 220ms, color 220ms",
                  }}
                >
                  {F.label}
                </div>
                <div
                  style={{
                    fontSize: isCompact ? 12 : 13.5,
                    color: isActive ? "#191919" : "#fff",
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  {F.desc}
                </div>
                {F.legend && isActive && (
                  <div style={{ animation: "ga-fadein 360ms ease-out" }}>
                    <LedLegend legend={F.legend} compact />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {tourMode && (
        <TourControls active={active} setActive={onSelectFeature} onExit={exitTour} />
      )}
    </div>
  );
}

/* ─── Mobile annotated viewer ──────────────────────────────────────────── */

interface MobileProps {
  heading: string;
  eyebrow: string;
  description?: string;
}

function SpinningSensorMobile({ heading, eyebrow, description }: MobileProps) {
  const { frame, setTarget, targetFrame } = useRotationEngine(2);
  const [active, setActive] = useState<number | null>(null);
  const [hint, setHint] = useState(true);
  const deviceWrapRef = useRef<HTMLDivElement | null>(null);
  const [devSize, setDevSize] = useState({ w: 0, h: 0 });
  const drag = useRef({ active: false, startX: 0, startFrame: 0 });

  // While the user is dragging the device, update active to the nearest
  // feature so the carousel can follow. Outside of drags, frame changes are
  // driven by an explicit feature selection (which already set active), so
  // we leave it alone to avoid feedback loops during rotation animation.
  useEffect(() => {
    if (!drag.current.active) return;
    let best = FEATURES[0].n;
    let bestDist = Infinity;
    for (const F of FEATURES) {
      const d = Math.abs(frame - F.bestFrame);
      if (d < bestDist) { bestDist = d; best = F.n; }
    }
    if (best !== active) setActive(best);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame]);

  useLayoutEffect(() => {
    const el = deviceWrapRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setDevSize({ w: rect.width, h: rect.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onSelectFeature = (n: number) => {
    setActive(n);
    setHint(false);
    const F = F_KEYS[n];
    if (F) setTarget(F.bestFrame);
  };

  const onDevicePointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, startX: e.clientX, startFrame: targetFrame.current };
    setHint(false);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onDevicePointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    setTarget(drag.current.startFrame + (dx / 200) * (FRAME_COUNT - 1));
  };
  const onDevicePointerUp = (e: React.PointerEvent) => {
    drag.current.active = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const frameInt = Math.round(frame);

  // Device fills the wrapper. Hotspots are positioned over the wrapper using
  // pixel coords scaled to the rendered device size. The image is centered
  // horizontally inside the wrapper via flex; we reproduce its left offset
  // for hotspot positioning.
  const aspect = 600 / 779;
  const wrapW = devSize.w || 1;
  const wrapH = devSize.h || 1;
  // Image is contained within wrapper; compute its rendered box.
  const imgH = Math.min(wrapH, wrapW / aspect);
  const imgW = imgH * aspect;
  const imgX = (wrapW - imgW) / 2;
  const imgY = (wrapH - imgH) / 2;
  const SCALE = imgW / 600;

  const hotspots = FEATURES.map((F) => {
    const exact = F_KEYS[F.n].pos[frameInt];
    if (!exact) return { n: F.n, sx: 0, sy: 0, hidden: true };
    return { n: F.n, sx: imgX + exact.x * SCALE, sy: imgY + exact.y * SCALE, hidden: false };
  });

  const activeFeature = active != null ? F_KEYS[active] : null;

  return (
    <div className="relative z-[2] flex select-none flex-col" style={{ color: "#fff" }}>
      {/* Header */}
      <div className="px-6 pt-6 text-center">
        <div
          className="mb-1.5"
          style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", color: "#00FFD2" }}
        >
          {eyebrow}
        </div>
        <h2 className="m-0" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.01em" }}>
          {heading}
        </h2>
        {description && (
          <p className="mx-auto mt-1.5 max-w-xs" style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 300 }}>
            {description}
          </p>
        )}
      </div>

      {/* Device + hotspots */}
      <div className="relative mt-3 px-4">
        <div
          ref={deviceWrapRef}
          onPointerDown={onDevicePointerDown}
          onPointerMove={onDevicePointerMove}
          onPointerUp={onDevicePointerUp}
          onPointerLeave={onDevicePointerUp}
          className="relative mx-auto"
          style={{
            width: "100%",
            maxWidth: 220,
            aspectRatio: "600 / 779",
            touchAction: "pan-y",
            cursor: drag.current.active ? "grabbing" : "grab",
          }}
        >
          {FRAMES.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              aria-hidden={i !== frameInt}
              draggable={false}
              className="pointer-events-none absolute inset-0"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: i === frameInt ? 1 : 0,
                transition: "opacity 60ms linear",
                filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.18))",
              }}
            />
          ))}

          {/* Hotspot dots — positioned in wrapper-local coordinates */}
          {hotspots.map((h) => {
            if (h.hidden) return null;
            const isActive = active === h.n;
            return (
              <button
                key={h.n}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); onSelectFeature(h.n); }}
                aria-label={`Feature ${h.n}: ${F_KEYS[h.n].label}`}
                className="absolute z-[4] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full p-0 transition-all duration-200"
                style={{
                  left: h.sx,
                  top: h.sy,
                  width: isActive ? 22 : 14,
                  height: isActive ? 22 : 14,
                  background: isActive ? "#00FFD2" : "rgba(255,255,255,0.95)",
                  border: "2px solid #1432FF",
                  boxShadow: isActive ? "0 0 0 4px rgba(0,255,210,0.35)" : "0 1px 4px rgba(0,0,0,0.2)",
                }}
              >
                {isActive && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute rounded-full"
                    style={{ inset: -4, border: "2px solid #00FFD2", animation: "ga-ring 1.6s ease-out infinite" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Rotate arrows — flank the device */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => { setHint(false); setTarget(targetFrame.current - 2); }}
          aria-label="Rotate left"
          className="absolute left-2 top-1/2 z-[5] inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-0"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            color: "#fff",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => { setHint(false); setTarget(targetFrame.current + 2); }}
          aria-label="Rotate right"
          className="absolute right-2 top-1/2 z-[5] inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-0"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            color: "#fff",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Progress bar + hint */}
      <div className="mt-2 flex flex-col items-center gap-1.5">
        <div className="relative overflow-hidden" style={{ width: 120, height: 3, borderRadius: 9999, background: "rgba(255,255,255,0.18)" }}>
          <div
            className="absolute left-0 top-0 h-full"
            style={{
              width: `${(frame / (FRAME_COUNT - 1)) * 100}%`,
              background: "#00FFD2",
              borderRadius: 9999,
              transition: "width 120ms linear",
            }}
          />
        </div>
        {hint && (
          <div
            className="pointer-events-none inline-flex items-center gap-1.5 whitespace-nowrap"
            style={{
              background: "rgba(20,50,255,0.95)",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: 9999,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.04em",
              boxShadow: "0 4px 12px rgba(20,50,255,0.3)",
            }}
          >
            <RotateIcon /> Swipe or tap arrows to rotate
          </div>
        )}
      </div>

      {/* Carousel — horizontal scroll, bidirectionally synced with device rotation */}
      <MobileCarousel active={active} onSelectFeature={onSelectFeature} />
    </div>
  );
}

function MobileCarousel({
  active,
  onSelectFeature,
}: {
  active: number | null;
  onSelectFeature: (n: number) => void;
}) {
  const cardScrollRef = useRef<HTMLDivElement | null>(null);
  const programmatic = useRef(false);
  const programmaticTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cardWidth = 240;
  const cardGap = 12;

  // Active feature changed (from any source: dot click, device drag, hotspot)
  // → scroll the matching card into view. Marked programmatic so the scroll
  // handler doesn't echo it back as a fresh selection.
  useEffect(() => {
    if (active == null) return;
    const idx = FEATURES.findIndex((F) => F.n === active);
    if (idx < 0 || !cardScrollRef.current) return;
    programmatic.current = true;
    cardScrollRef.current.scrollTo({ left: idx * (cardWidth + cardGap), behavior: "smooth" });
    if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
    programmaticTimer.current = setTimeout(() => { programmatic.current = false; }, 500);
  }, [active]);

  // User-driven carousel scroll → select that feature.
  const onCardScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (programmatic.current) return;
    const idx = Math.round(e.currentTarget.scrollLeft / (cardWidth + cardGap));
    const n = FEATURES[Math.max(0, Math.min(FEATURES.length - 1, idx))]?.n;
    if (n && n !== active) onSelectFeature(n);
  };

  const activeIdx = FEATURES.findIndex((f) => f.n === active);

  return (
    <div className="mt-6 pb-8">
      {/* Pagination dots */}
      <div className="mb-3 flex justify-center gap-1.5">
        {FEATURES.map((F, i) => (
          <button
            key={F.n}
            onClick={() => onSelectFeature(F.n)}
            aria-label={F.label}
            className="cursor-pointer rounded-full border-0 p-0 transition-all duration-200"
            style={{
              width: i === activeIdx ? 18 : 6,
              height: 6,
              background: i === activeIdx ? "#00FFD2" : "rgba(255,255,255,0.30)",
            }}
          />
        ))}
      </div>

      <div
        ref={cardScrollRef}
        onScroll={onCardScroll}
        className="ss-mobile-scroll flex overflow-x-auto overflow-y-hidden"
        style={{
          gap: cardGap,
          padding: "4px 16px 12px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {FEATURES.map((F) => {
          const isActive = active === F.n;
          return (
            <div
              key={F.n}
              onClick={() => onSelectFeature(F.n)}
              className="cursor-pointer transition-all duration-200"
              style={{
                scrollSnapAlign: "center",
                flex: `0 0 ${cardWidth}px`,
                padding: "14px 16px",
                background: isActive ? "#fff" : "rgba(255,255,255,0.12)",
                backdropFilter: !isActive ? "blur(8px)" : undefined,
                WebkitBackdropFilter: !isActive ? "blur(8px)" : undefined,
                border: isActive ? "1px solid rgba(0,255,210,0.5)" : "1px solid rgba(255,255,255,0.18)",
                borderRadius: 14,
                boxShadow: isActive ? "0 10px 24px rgba(0,0,0,0.22)" : "none",
              }}
            >
              <div className="flex items-start gap-2.5">
                <Badge n={F.n} active={isActive} scheme={isActive ? "light" : "blue"} onClick={(e) => { e.stopPropagation(); onSelectFeature(F.n); }} size={26} />
                <div className="min-w-0 flex-1">
                  <div style={{ fontSize: 15, fontWeight: 700, color: isActive ? "#191919" : "#fff", marginBottom: 3 }}>
                    {F.label}
                  </div>
                  <div style={{ fontSize: 12.5, color: isActive ? "#191919" : "rgba(255,255,255,0.85)", fontWeight: isActive ? 400 : 300, lineHeight: 1.45 }}>
                    {F.desc}
                  </div>
                  {F.legend && isActive && (
                    <div style={{ animation: "ga-fadein 360ms ease-out" }}>
                      <LedLegend legend={F.legend} compact />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Sub-components ───────────────────────────────────────────────────── */

function Badge({
  n,
  active,
  scheme = "light",
  onClick,
  size = 28,
}: {
  n: number;
  active: boolean;
  scheme?: "light" | "blue";
  onClick?: (e: React.MouseEvent) => void;
  size?: number;
}) {
  const isBlueScheme = scheme === "blue";
  const bg = active ? "#00FFD2" : isBlueScheme ? "rgba(255,255,255,0.95)" : "#1432FF";
  const fg = active ? "#191919" : isBlueScheme ? "#1432FF" : "#fff";
  return (
    <button
      onClick={onClick}
      aria-label={`Feature ${n}`}
      className="inline-flex flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-0 transition-all duration-200"
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        boxShadow: active ? "0 0 0 6px rgba(0,255,210,0.25)" : "0 1px 2px rgba(0,0,0,0.15)",
        fontWeight: 700,
        fontSize: size * 0.45,
        lineHeight: 1,
      }}
    >
      {n}
    </button>
  );
}

function LedLegend({ legend, compact = false }: { legend: Legend; compact?: boolean }) {
  return (
    <div className="flex flex-col" style={{ gap: compact ? 5 : 8, marginTop: 10 }}>
      {legend.items.map((it, i) => (
        <div key={i} className="flex items-center gap-2.5" style={{ fontSize: compact ? 12 : 13 }}>
          <span
            className="flex-shrink-0 rounded-full"
            style={{
              width: 10,
              height: 10,
              background: it.dot,
              boxShadow: it.dot.startsWith("rgba") ? "inset 0 0 0 1px rgba(0,0,0,0.15)" : "0 0 0 2px rgba(255,255,255,0.6)",
              animation: it.pulse ? "ga-pulse 1.4s ease-in-out infinite" : undefined,
            }}
          />
          <span style={{ fontWeight: 600, minWidth: 76, color: "#191919" }}>{it.k}</span>
          <span style={{ color: "#191919", opacity: 0.7 }}>{it.v}</span>
        </div>
      ))}
    </div>
  );
}

function TourControls({
  active,
  setActive,
  onExit,
}: {
  active: number | null;
  setActive: (n: number) => void;
  onExit: () => void;
}) {
  const featureNs = FEATURES.map((f) => f.n);
  const count = featureNs.length;
  const idx = active == null ? -1 : featureNs.indexOf(active);
  const navBtnStyle: React.CSSProperties = {
    width: 30,
    height: 30,
    borderRadius: 9999,
    background: "#1432FF",
    color: "#fff",
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 200ms",
  };
  return (
    <div
      className="absolute z-[6] flex items-center gap-3.5"
      style={{
        bottom: 36,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px 14px",
        background: "rgba(255,255,255,0.92)",
        borderRadius: 9999,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
      }}
    >
      <button onClick={() => setActive(idx <= 0 ? featureNs[count - 1] : featureNs[idx - 1])} style={navBtnStyle}>
        ←
      </button>
      <div className="flex gap-1.5">
        {featureNs.map((n, i) => (
          <button
            key={n}
            onClick={() => setActive(n)}
            aria-label={`Feature ${n}`}
            className="cursor-pointer rounded-full border-0 p-0 transition-all duration-200"
            style={{
              width: i === idx ? 22 : 7,
              height: 7,
              background: i === idx ? "#1432FF" : "rgba(0,0,0,0.18)",
            }}
          />
        ))}
      </div>
      <button onClick={() => setActive(idx >= count - 1 || idx < 0 ? featureNs[0] : featureNs[idx + 1])} style={navBtnStyle}>
        →
      </button>
      <div
        className="pl-2 ml-1"
        style={{ fontSize: 12, fontWeight: 600, color: "rgba(25,25,25,0.65)", borderLeft: "1px solid rgba(0,0,0,0.08)", minWidth: 50 }}
      >
        {active != null ? `${String(idx + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}` : `— / ${String(count).padStart(2, "0")}`}
      </div>
      <button
        onClick={onExit}
        style={{
          ...navBtnStyle,
          width: "auto",
          padding: "0 12px",
          background: "transparent",
          color: "#191919",
          border: "1px solid rgba(0,0,0,0.12)",
          fontSize: 12,
        }}
      >
        Reset
      </button>
    </div>
  );
}

function RotateButton({ dir, onClick, top }: { dir: "left" | "right"; onClick: () => void; top: number }) {
  return (
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
      aria-label={`Rotate ${dir}`}
      className="absolute z-[5] inline-flex cursor-pointer items-center justify-center rounded-full p-0"
      style={{
        [dir]: 8,
        top,
        width: 44,
        height: 44,
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
        color: "#fff",
      } as React.CSSProperties}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {dir === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );
}

function RotateIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 4 3 9 8 9" />
    </svg>
  );
}

function AbleCareMark() {
  return (
    <svg
      viewBox="0 0 754 540"
      aria-hidden
      className="pointer-events-none absolute z-[1]"
      style={{ right: -40, bottom: -30, width: 460, height: 460 * (540 / 754), opacity: 0.1 }}
    >
      <g fill="#ffffff">
        <path d="M377.3,340.5l101.06,140.55l0.03,0.05c22.43,34.28,61.15,56.93,105.17,56.93c69.37,0,125.6-56.23,125.6-125.6 c0-29.28-10.02-56.22-26.81-77.57l0-0.01L481.14,55.02C458.54,21.81,420.43,0,377.23,0c-43.58,0-81.97,22.19-104.49,55.89 L171.61,196.53l-1.66,2.31c-6.5,9.89-10.29,21.72-10.29,34.43c0,24.08,13.55,44.98,33.44,55.51c7.46,3.95,15.81,6.44,24.67,7.09 c1.55,0.11,3.11,0.19,4.68,0.19c21.29,0,40.1-10.59,51.46-26.79l71.07-98.84l0.46-0.65c11.46-15.27,29.71-25.16,50.27-25.16 c34.68,0,62.8,28.12,62.8,62.8c0,12.67-3.76,24.45-10.22,34.32L377.3,340.5z" />
        <path d="M271.72,487.33c-22.89,30.76-59.53,50.7-100.82,50.7c-69.37,0-125.6-56.23-125.6-125.6 c0-29.47,10.15-56.56,27.14-77.98l-5.12,7.12l5.12-7.12l97.51-135.6c-6.5,9.89-10.29,21.72-10.29,34.43 c0,24.08,13.55,44.98,33.44,55.51c7.46,3.95,15.81,6.44,24.67,7.09c1.55,0.11,3.11,0.19,4.68,0.19c21.29,0,40.1-10.59,51.46-26.79 l71.07-98.84l0.46-0.65c11.46-15.27,29.71-25.16,50.27-25.16c34.68,0,62.8,28.12,62.8,62.8c0,12.67-3.76,24.45-10.22,34.32 L271.72,487.33" />
      </g>
    </svg>
  );
}

function Keyframes() {
  return (
    <style>{`
      @keyframes ga-fadein {
        from { opacity: 0; transform: translateY(4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes ga-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(20,50,255,0.6); }
        50%      { box-shadow: 0 0 0 6px rgba(20,50,255,0); }
      }
      @keyframes ga-ring {
        0%   { transform: scale(1);   opacity: 0.7; }
        100% { transform: scale(1.6); opacity: 0;   }
      }
      @keyframes ga-bob {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50%      { transform: translateX(-50%) translateY(-3px); }
      }
      .ss-mobile-scroll::-webkit-scrollbar { display: none; }
    `}</style>
  );
}
