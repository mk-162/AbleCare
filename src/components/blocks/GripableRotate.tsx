"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/* ─── Frame data ──────────────────────────────────────────────────────────── */
const FRAMES = Array.from({ length: 21 }, (_, i) =>
  `/gripable/rotate/${String(i + 1).padStart(2, "0")}.png`
);

/* ─── Feature hotspot calibration (600×779 image coords) ─────────────────── */
interface PosMap { [frame: number]: { x: number; y: number } }
interface LegendItem { dot: string; k: string; v: string; pulse?: boolean }
interface Feature {
  n: number;
  label: string;
  desc: string;
  bestFrame: number;
  pos: PosMap;
  legend?: { title: string; items: LegendItem[] };
}

/* Features are numbered in left-to-right rotation order across the 21 frames.
   Each card gets a roughly even slice of the rotation: card N's bestFrame
   is around (N-1)*3+1, so as the device rotates the auto-highlight cycles
   through cards 1..7 in order. */
const F_KEYS: Record<number, Feature> = {
  1: {
    n: 1, label: "Grip Plate", desc: "Squeeze the plate with your fingers to record force.",
    bestFrame: 1,
    pos: {
      0:{x:216,y:368},1:{x:245,y:368},2:{x:272,y:371},3:{x:294,y:372},4:{x:347,y:369},
      5:{x:368,y:369},6:{x:378,y:369},7:{x:384,y:369},8:{x:384,y:369},9:{x:384,y:369},
      10:{x:374,y:369},11:{x:363,y:369},12:{x:352,y:369},
      18:{x:239,y:367},19:{x:220,y:367},20:{x:205,y:368},
    },
  },
  2: {
    n: 2, label: "Locking Button", desc: "Switches grip modes. Squeeze and hold, then push down to lock.",
    bestFrame: 4,
    pos: {
      0:{x:263,y:114},1:{x:273,y:114},2:{x:282,y:114},3:{x:284,y:114},4:{x:286,y:113},
      5:{x:291,y:117},6:{x:304,y:116},7:{x:309,y:115},8:{x:315,y:115},9:{x:326,y:115},
      10:{x:335,y:115},11:{x:325,y:107},12:{x:319,y:106},13:{x:314,y:106},14:{x:304,y:107},
      15:{x:294,y:108},16:{x:284,y:109},17:{x:268,y:110},18:{x:255,y:113},19:{x:248,y:114},20:{x:251,y:114},
    },
  },
  3: {
    n: 3, label: "Strap Hooks", desc: "Two attachment points for silicone straps.",
    bestFrame: 7,
    pos: {
      0:{x:356,y:176},1:{x:362,y:176},2:{x:362,y:176},3:{x:368,y:173},4:{x:227,y:177},
      5:{x:240,y:177},6:{x:251,y:177},7:{x:270,y:179},8:{x:287,y:178},9:{x:308,y:177},
      10:{x:330,y:176},11:{x:345,y:176},12:{x:361,y:176},13:{x:364,y:177},14:{x:372,y:177},
      15:{x:372,y:176},16:{x:242,y:175},17:{x:251,y:177},18:{x:267,y:177},19:{x:290,y:177},20:{x:331,y:177},
    },
  },
  4: {
    n: 4, label: "Battery LED", desc: "At-a-glance charge status. Green / Yellow / Orange / Red.",
    bestFrame: 10,
    legend: {
      title: "Battery LED",
      items: [
        { dot: "#22c55e", k: "Green",  v: "Fully charged" },
        { dot: "#eab308", k: "Yellow", v: "Charging" },
        { dot: "#f97316", k: "Orange", v: "Battery OK" },
        { dot: "#ef4444", k: "Red",    v: "Battery low" },
      ],
    },
    pos: {
      7:{x:240,y:620},8:{x:240,y:621},9:{x:239,y:623},10:{x:252,y:627},11:{x:266,y:630},
      12:{x:292,y:633},13:{x:317,y:634},14:{x:325,y:634},15:{x:350,y:630},
    },
  },
  5: {
    n: 5, label: "Lanyard Hook", desc: "Attachment point for the wrist lanyard.",
    bestFrame: 13,
    pos: {
      11:{x:232,y:658},12:{x:249,y:665},13:{x:270,y:667},14:{x:291,y:670},
      15:{x:315,y:667},16:{x:331,y:665},17:{x:352,y:659},
    },
  },
  6: {
    n: 6, label: "Charging Port", desc: "Magnetic connector for fast, fumble-free charging.",
    bestFrame: 16,
    pos: {
      9:{x:212,y:616},10:{x:214,y:621},11:{x:228,y:624},12:{x:248,y:629},13:{x:270,y:631},
      14:{x:294,y:634},15:{x:316,y:632},16:{x:337,y:628},17:{x:357,y:623},18:{x:367,y:616},
    },
  },
  7: {
    n: 7, label: "Connection LED", desc: "Pairing and connection status indicator.",
    // Connection LED's anchor data only covers frames 7-17, so bestFrame
    // stays inside that window even though its slot extends to frame 20.
    bestFrame: 17,
    legend: {
      title: "Connection LED",
      items: [
        { dot: "rgba(0,0,0,0.15)", k: "No light",     v: "Device is asleep" },
        { dot: "#1432FF",          k: "Flashing blue", v: "Pairing — ready to connect", pulse: true },
        { dot: "#1432FF",          k: "Solid blue",    v: "Connection established" },
      ],
    },
    pos: {
      7:{x:205,y:177},8:{x:204,y:178},9:{x:210,y:178},10:{x:215,y:178},11:{x:229,y:178},
      12:{x:250,y:177},13:{x:277,y:178},14:{x:294,y:178},15:{x:317,y:176},16:{x:347,y:177},17:{x:353,y:177},
    },
  },
};

const FEATURES = Object.values(F_KEYS);

/* Cards 1-4 down the left rail, 5-7 down the right rail, in numbered order. */
const LEFT_FEATURES = [1, 2, 3, 4];
const RIGHT_FEATURES = [5, 6, 7];

/* Vertical offset (in % of stage height) applied to the floating badge —
   lets us spread crowded hotspots without moving the anchor point on the
   device. Positive = nudge down, negative = nudge up. */
const BADGE_Y_OFFSET: Record<number, number> = {
  2: -4,  // Locking Button — sits just marginally above the device anchor
  4: -3,  // Battery LED — nudge up so it doesn't crowd the Lanyard Hook below
  5:  3,  // Lanyard Hook — nudge down for the same reason
};

/* Badges are parked on the outer rails of the stage (in % of stage width)
   so they never overlap the device silhouette as it rotates. The leader
   lines do all the stretching. */
const LEFT_RAIL_X = 4;   // % from left edge
const RIGHT_RAIL_X = 96; // % from left edge
const LINE_GAP = 4;      // % — line stops this far short of the feature point

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const interpPos = (pos: PosMap, f: number): { x: number; y: number } | null => {
  if (pos[f]) return pos[f];
  const ks = Object.keys(pos).map(Number).sort((a, b) => a - b);
  if (ks.length === 0) return null;
  if (f < ks[0] || f > ks[ks.length - 1]) return null;
  let lo = ks[0], hi = ks[ks.length - 1];
  for (const k of ks) { if (k <= f) lo = k; }
  for (let i = ks.length - 1; i >= 0; i--) { if (ks[i] >= f) { hi = ks[i]; break; } }
  if (lo === hi) return pos[lo];
  const t = (f - lo) / (hi - lo);
  return { x: pos[lo].x + (pos[hi].x - pos[lo].x) * t, y: pos[lo].y + (pos[hi].y - pos[lo].y) * t };
};

/* ─── LED Legend ─────────────────────────────────────────────────────────────── */
function LedLegend({ legend }: { legend: NonNullable<Feature["legend"]> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
      {legend.items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
          <span style={{
            width: 10, height: 10, borderRadius: 9999, background: it.dot, flexShrink: 0,
            boxShadow: it.dot.startsWith("rgba") ? "inset 0 0 0 1px rgba(0,0,0,0.15)" : "0 0 0 2px rgba(255,255,255,0.6)",
            animation: it.pulse ? "gr-pulse 1.4s ease-in-out infinite" : "none",
          }} />
          <span style={{ fontWeight: 600, color: "#191919", minWidth: 78 }}>{it.k}</span>
          <span style={{ color: "rgba(25,25,25,0.7)" }}>{it.v}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Feature card (shared across breakpoints) ─────────────────────────────── */
function FeatureCard({
  feature, active, align, compact, onSelect,
}: {
  feature: Feature;
  active: boolean;
  align: "left" | "right";
  compact?: boolean;
  onSelect: () => void;
}) {
  const reverse = align === "left";
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        width: "100%", textAlign: reverse ? "right" : "left",
        background: active ? "#fff" : "rgba(255,255,255,0.08)",
        backdropFilter: "blur(6px)",
        border: active ? "1px solid rgba(0,255,210,0.6)" : "1px solid rgba(255,255,255,0.16)",
        borderRadius: 14,
        padding: compact ? "12px 14px" : "14px 16px",
        cursor: "pointer",
        boxShadow: active
          ? "0 16px 40px -8px rgba(0,0,0,0.32), 0 0 0 4px rgba(0,255,210,0.18)"
          : "0 1px 2px rgba(0,0,0,0.10)",
        transition: "background 220ms, border-color 220ms, box-shadow 240ms cubic-bezier(0.16,1,0.3,1), transform 240ms cubic-bezier(0.16,1,0.3,1)",
        transform: active ? "translateY(-1px)" : "translateY(0)",
        fontFamily: "inherit",
        display: "block",
      }}
    >
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        flexDirection: reverse ? "row-reverse" : "row",
      }}>
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            width: 30, height: 30, borderRadius: 9999,
            background: active ? "#00FFD2" : "rgba(255,255,255,0.95)",
            color: active ? "#191919" : "#1432FF",
            fontWeight: 700, fontSize: 13,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: active ? "0 0 0 4px rgba(0,255,210,0.25)" : "0 1px 3px rgba(0,0,0,0.18)",
            transition: "all 220ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >{feature.n}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontSize: 14, fontWeight: 700,
            color: active ? "#191919" : "#fff",
            marginBottom: 3, letterSpacing: "-0.005em",
          }}>{feature.label}</div>
          <div style={{
            fontSize: 13,
            color: active ? "rgba(25,25,25,0.72)" : "rgba(255,255,255,0.78)",
            lineHeight: 1.5, fontWeight: 400,
          }}>{feature.desc}</div>
          {feature.legend && active && (
            <div style={{ animation: "gr-fadein 320ms ease-out" }}>
              <LedLegend legend={feature.legend} />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

/* ─── Device stage (shared across breakpoints) ─────────────────────────────── */
function DeviceStage({
  frame, active, clicked, hint, drag, rotating, onPointerDown, onPointerMove, onPointerUp,
  onHoverRotate, onKeyRotate, onSelectFeature, maxWidth, enableHoverRotate,
}: {
  frame: number;
  active: number | null;
  clicked: number | null;
  hint: boolean;
  drag: boolean;
  rotating: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onHoverRotate: (e: React.PointerEvent) => void;
  onKeyRotate: (e: React.KeyboardEvent) => void;
  onSelectFeature: (n: number) => void;
  maxWidth: number;
  enableHoverRotate: boolean;
}) {
  // Hotspots stay visible at all times — no fade during rotation. Flashing
  // them in and out as the user rotates reads as visual noise.
  const hotspotOpacity = 1;
  const hotspotTransition = "none";
  const frameInt = Math.round(frame);

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="GripAble sensor — drag or use arrow keys to rotate"
      aria-valuemin={1}
      aria-valuemax={FRAMES.length}
      aria-valuenow={frameInt + 1}
      style={{
        position: "relative",
        width: "100%",
        maxWidth,
        margin: "0 auto",
        aspectRatio: "600 / 779",
        touchAction: "none",
        userSelect: "none",
        cursor: drag ? "grabbing" : "grab",
        outline: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={(e) => {
        if (drag) onPointerMove(e);
        // Hover-to-rotate fires for any mouse pointer. Touch devices use drag instead
        // (pointerType !== "mouse"), so they aren't affected by this branch.
        else if (e.pointerType === "mouse") onHoverRotate(e);
      }}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onKeyDown={onKeyRotate}
    >
      {/* Soft contact shadow under device */}
      <div style={{
        position: "absolute", left: "50%", bottom: "2%",
        transform: "translateX(-50%)",
        width: "62%", height: "5%",
        borderRadius: "50%",
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0.32) 0%, transparent 70%)",
        filter: "blur(6px)", pointerEvents: "none", zIndex: 0,
      }} />

      {/* Aqua glow */}
      <div style={{
        position: "absolute", left: "50%", bottom: "1%",
        transform: "translateX(-50%)",
        width: "56%", height: "4%",
        borderRadius: "50%",
        background: "radial-gradient(ellipse at center, rgba(0,255,210,0.45) 0%, transparent 70%)",
        filter: "blur(8px)", pointerEvents: "none", zIndex: 0,
      }} />

      {/* Frame stack — all eager so fast rotations never land on an unloaded frame */}
      {FRAMES.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          draggable={false}
          loading="eager"
          decoding="sync"
          fetchPriority={i === frameInt ? "high" : "low"}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
            // Snap between frames instantly. A fade transition causes brief
            // moments where neighboring frames are both partially visible,
            // which reads as the device "disappearing" mid-rotation.
            opacity: i === frameInt ? 1 : 0,
            filter: "drop-shadow(0 24px 28px rgba(0,0,0,0.22))",
            zIndex: 1,
          }}
        />
      ))}

      {/* Leader lines — single SVG overlay. Lines stretch dynamically from
          each feature anchor (which moves with rotation) to a fixed badge
          position parked off the device on either side rail. */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          pointerEvents: "none", zIndex: 3, overflow: "visible",
          opacity: hotspotOpacity, transition: hotspotTransition,
        }}
      >
        {FEATURES.map((F) => {
          // In click-mode, only the clicked feature's line is shown.
          if (clicked != null && clicked !== F.n) return null;
          const p = interpPos(F.pos, frameInt);
          if (!p) return null;
          const isActive = active === F.n;
          const goesLeft = LEFT_FEATURES.includes(F.n);
          const ax = (p.x / 600) * 100;
          const ay = (p.y / 779) * 100;
          // Badge Y is anchored to the bestFrame's Y so it stays put across rotation;
          // only the device-side end of the line moves with the active frame.
          const restPos = F.pos[F.bestFrame] ?? p;
          const badgeY = (restPos.y / 779) * 100 + (BADGE_Y_OFFSET[F.n] ?? 0);
          const tickX = goesLeft ? ax - LINE_GAP : ax + LINE_GAP;
          const badgeX = goesLeft ? LEFT_RAIL_X : RIGHT_RAIL_X;
          return (
            <line
              key={F.n}
              x1={tickX} y1={ay} x2={badgeX} y2={badgeY}
              stroke={isActive ? "rgba(0,255,210,0.95)" : "rgba(255,255,255,0.7)"}
              strokeWidth={isActive ? 1.5 : 1}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              style={{
                filter: isActive ? "drop-shadow(0 0 3px rgba(0,255,210,0.6))" : "none",
                transition: "stroke 220ms, stroke-width 220ms",
              }}
            />
          );
        })}
      </svg>

      {/* Numbered hotspots — badge is always rendered at its stable rail position;
          the device-side tick only appears when the feature anchor is visible
          for the current frame. In click-mode, only the clicked feature shows. */}
      {FEATURES.map((F) => {
        if (clicked != null && clicked !== F.n) return null;
        const p = interpPos(F.pos, frameInt);
        const isActive = active === F.n;
        const goesLeft = LEFT_FEATURES.includes(F.n);
        const restPos = F.pos[F.bestFrame] ?? p;
        if (!restPos) return null;
        const restY = (restPos.y / 779) * 100;
        const ax = p ? (p.x / 600) * 100 : null;
        const ay = p ? (p.y / 779) * 100 : null;
        const badgeY = restY + (BADGE_Y_OFFSET[F.n] ?? 0);
        const tickX = ax != null ? (goesLeft ? ax - LINE_GAP : ax + LINE_GAP) : null;
        const badgeCx = goesLeft ? LEFT_RAIL_X : RIGHT_RAIL_X;

        return (
          <div
            key={F.n}
            style={{
              position: "absolute",
              left: 0, top: 0, right: 0, bottom: 0,
              pointerEvents: "none",
              zIndex: 4,
              opacity: hotspotOpacity,
              transition: hotspotTransition,
            }}
          >
            {/* Tiny tick at the device-side end of the line, stopping short of
                the point. Only rendered when this feature has an anchor for the
                current frame (otherwise the badge stays parked but with no line). */}
            {tickX != null && ay != null && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: `${tickX}%`,
                  top: `${ay}%`,
                  width: 5, height: 5,
                  borderRadius: 9999,
                  transform: "translate(-50%, -50%)",
                  background: isActive ? "#00FFD2" : "rgba(255,255,255,0.95)",
                  boxShadow: isActive
                    ? "0 0 0 3px rgba(0,255,210,0.28)"
                    : "0 0 0 1px rgba(20,50,255,0.18)",
                  transition: "background 220ms, box-shadow 220ms",
                }}
              />
            )}
            {/* Numbered badge — floats to the side, slightly offset vertically when crowded */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelectFeature(F.n); }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={`Feature ${F.n}: ${F.label}`}
              style={{
                position: "absolute",
                left: `${badgeCx}%`,
                top: `${badgeY}%`,
                transform: "translate(-50%, -50%)",
                width: "clamp(22px, 4.6%, 30px)",
                aspectRatio: "1 / 1",
                padding: 0, border: "none",
                borderRadius: 9999,
                background: isActive ? "#00FFD2" : "rgba(255,255,255,0.96)",
                color: isActive ? "#191919" : "#1432FF",
                fontWeight: 700,
                fontSize: "clamp(10px, 2vw, 13px)",
                fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: isActive
                  ? "0 0 0 5px rgba(0,255,210,0.32), 0 2px 6px rgba(0,0,0,0.25)"
                  : "0 2px 6px rgba(0,0,0,0.22), 0 0 0 1px rgba(20,50,255,0.08)",
                cursor: "pointer",
                pointerEvents: rotating ? "none" : "auto",
                transition: "background 200ms, color 200ms, box-shadow 240ms cubic-bezier(0.16,1,0.3,1), transform 240ms",
                animation: isActive ? "gr-dot-pulse 1.8s ease-in-out infinite" : "none",
              }}
            >
              {F.n}
            </button>
          </div>
        );
      })}

      {/* Hint pill */}
      {hint && (
        <div style={{
          position: "absolute", left: "50%", bottom: "-6%",
          transform: "translateX(-50%)",
          background: "rgba(20,50,255,0.95)", color: "#fff",
          padding: "7px 16px", borderRadius: 9999,
          fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
          display: "inline-flex", alignItems: "center", gap: 7,
          whiteSpace: "nowrap", pointerEvents: "none", zIndex: 4,
          animation: "gr-bob 2s ease-in-out infinite",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7"/>
            <polyline points="3 4 3 9 8 9"/>
          </svg>
          Drag to rotate
        </div>
      )}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────────── */
export function GripableRotate() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(1200);
  const [frame, setFrame] = useState(2);
  // `clicked` is set when the user clicks a feature card; in this mode only
  // the clicked feature's hotspot is shown and the device snaps to its peak
  // frame. When null, the component is in auto-mode: hover/drag rotates the
  // device and the active card is derived from the current frame.
  const [clicked, setClicked] = useState<number | null>(null);
  const [hint, setHint] = useState(true);
  const [mobileIdx, setMobileIdx] = useState(0);
  const targetFrame = useRef(2);
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef({ active: false, startX: 0, startFrame: 0, dragged: false });
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const rotateIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Mark that the user is actively rotating the device. Hotspots fade out
     while this is true and fade back in ~280ms after the last rotate event.
     Manual rotation also exits click-mode so all 7 cards become live again. */
  const flagRotating = useCallback(() => {
    setClicked(null);
    setIsRotating(true);
    if (rotateIdleTimer.current) clearTimeout(rotateIdleTimer.current);
    rotateIdleTimer.current = setTimeout(() => setIsRotating(false), 280);
  }, []);

  useEffect(() => () => {
    if (rotateIdleTimer.current) clearTimeout(rotateIdleTimer.current);
  }, []);

  /* Measure container */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setContainerW(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Pre-decode every frame on mount. Without this, the PNG that we promote
     to opacity:1 may still be decoding (decoding="async"), so during fast
     rotation there's a beat where the new frame hasn't painted yet and the
     old frame already went to opacity:0 — visually the device "disappears".
     Pre-decoding guarantees all 21 frames are paint-ready before the user
     ever rotates. */
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      FRAMES.map((src) => {
        const img = new Image();
        img.src = src;
        return img.decode().catch(() => undefined);
      })
    ).then(() => {
      if (cancelled) return;
    });
    return () => { cancelled = true; };
  }, []);

  const isMobile  = containerW < 700;
  const isTablet  = containerW >= 700 && containerW < 1100;
  const isDesktop = containerW >= 1100;

  /* Smooth frame chasing */
  const setTarget = useCallback((t: number) => {
    targetFrame.current = Math.max(0, Math.min(FRAMES.length - 1, t));
    if (!rafRef.current) {
      const tick = () => {
        setFrame((f) => {
          const diff = targetFrame.current - f;
          if (Math.abs(diff) < 0.05) {
            rafRef.current = null;
            return targetFrame.current;
          }
          rafRef.current = requestAnimationFrame(tick);
          return f + diff * 0.22;
        });
      };
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* Auto-highlight: in auto-mode, derive the active card from the current
     frame by picking whichever feature's bestFrame is closest. This makes
     cards highlight in order 1→7 as the device scrolls left-to-right. */
  const frameInt = Math.round(frame);
  const autoActive = (() => {
    let best = FEATURES[0].n;
    let minD = Infinity;
    for (const F of FEATURES) {
      const d = Math.abs(F.bestFrame - frameInt);
      if (d < minD) { minD = d; best = F.n; }
    }
    return best;
  })();
  const active = clicked ?? autoActive;

  /* Pointer handlers — drag-to-rotate on the device */
  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startFrame: targetFrame.current,
      dragged: false,
    };
    setIsDragging(true);
    setHint(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 3) dragRef.current.dragged = true;
    // 280px swipe = full rotation. Reasonable across all sizes.
    setTarget(dragRef.current.startFrame + (dx / 280) * (FRAMES.length - 1));
    flagRotating();
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsDragging(false);
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
  };

  /* Desktop hover-to-rotate: maps cursor X across the stage to a frame */
  const onHoverRotate = (e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setTarget(t * (FRAMES.length - 1));
    flagRotating();
    if (hint) setHint(false);
  };

  /* Keyboard arrows rotate the device by one frame at a time. Like
     hover/drag rotation, this exits click-mode so the auto-cycling
     active-card highlight resumes. */
  const onKeyRotate = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      flagRotating();
      setTarget(targetFrame.current - 1);
      setHint(false);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      flagRotating();
      setTarget(targetFrame.current + 1);
      setHint(false);
    } else if (e.key === "Home") {
      e.preventDefault();
      flagRotating();
      setTarget(0);
    } else if (e.key === "End") {
      e.preventDefault();
      flagRotating();
      setTarget(FRAMES.length - 1);
    }
  };

  const selectFeature = (n: number) => {
    setClicked(n);
    setTarget(F_KEYS[n].bestFrame);
    setHint(false);
    setMobileIdx(FEATURES.findIndex((f) => f.n === n));
  };

  const stageProps = {
    frame, active, clicked, hint, drag: isDragging,
    rotating: isRotating,
    onPointerDown, onPointerMove, onPointerUp,
    onHoverRotate, onKeyRotate,
    onSelectFeature: selectFeature,
    enableHoverRotate: isDesktop,
  };

  return (
    <section
      ref={containerRef}
      style={{
        width: "100%",
        background: "linear-gradient(145deg, #0b1fd4 0%, #1432FF 35%, #00a896 75%, #00FFD2 100%)",
        fontFamily: '"DM Sans", "Arial", sans-serif',
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="GripAble sensor interactive viewer"
    >
      <style>{`
        @keyframes gr-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(20,50,255,0.6); }
          50%      { box-shadow: 0 0 0 6px rgba(20,50,255,0); }
        }
        @keyframes gr-dot-pulse {
          0%,100% { box-shadow: 0 0 0 5px rgba(0,255,210,0.32), 0 2px 6px rgba(0,0,0,0.25); }
          50%      { box-shadow: 0 0 0 9px rgba(0,255,210,0.10), 0 2px 6px rgba(0,0,0,0.25); }
        }
        @keyframes gr-bob {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(-3px); }
        }
        @keyframes gr-fadein {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Atmospheric overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background:
            "radial-gradient(700px 400px at 85% 10%, rgba(0,255,210,0.20), transparent 60%), radial-gradient(600px 400px at 10% 90%, rgba(255,255,255,0.08), transparent 60%)",
        }}
      />

      {/* Header */}
      <header
        style={{
          position: "relative", zIndex: 5, textAlign: "center",
          padding: isMobile ? "40px 24px 0" : "56px 40px 0",
          maxWidth: 760, margin: "0 auto",
        }}
      >
        <div style={{
          fontSize: 11, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.25em", color: "#00FFD2", marginBottom: 12,
        }}>
          ABOUT GRIPABLE
        </div>
        <h2 style={{
          fontSize: isMobile ? 28 : isTablet ? 36 : 44,
          fontWeight: 700, lineHeight: 1.08, margin: 0,
          color: "#fff", letterSpacing: "-0.015em",
        }}>
          GripAble sensor features.
        </h2>
        <p style={{
          fontSize: isMobile ? 14 : 16,
          color: "rgba(255,255,255,0.78)",
          margin: "10px 0 0", fontWeight: 300,
        }}>
          Designed with precision. Built for real-world care.
        </p>
      </header>

      {/* ─── DESKTOP LAYOUT ───────────────────────────────────────────────── */}
      {isDesktop && (
        <div
          style={{
            position: "relative", zIndex: 2,
            display: "grid",
            gridTemplateColumns: "minmax(220px, 280px) minmax(360px, 1fr) minmax(220px, 280px)",
            gap: 32,
            alignItems: "center",
            maxWidth: 1320,
            margin: "0 auto",
            padding: "40px 32px 56px",
          }}
        >
          {/* Left rail */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {LEFT_FEATURES.map((n) => (
              <FeatureCard
                key={n}
                feature={F_KEYS[n]}
                active={active === n}
                align="left"
                onSelect={() => selectFeature(n)}
              />
            ))}
          </div>

          {/* Device stage */}
          <div ref={stageRef}>
            <DeviceStage {...stageProps} maxWidth={420} />
          </div>

          {/* Right rail */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {RIGHT_FEATURES.map((n) => (
              <FeatureCard
                key={n}
                feature={F_KEYS[n]}
                active={active === n}
                align="right"
                onSelect={() => selectFeature(n)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── TABLET LAYOUT ────────────────────────────────────────────────── */}
      {isTablet && (
        <div
          style={{
            position: "relative", zIndex: 2,
            padding: "40px 32px 48px",
            maxWidth: 880, margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: 36 }}>
            <DeviceStage {...stageProps} maxWidth={360} />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}>
            {FEATURES.map((F) => (
              <FeatureCard
                key={F.n}
                feature={F}
                active={active === F.n}
                align="right"
                compact
                onSelect={() => selectFeature(F.n)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── MOBILE LAYOUT ────────────────────────────────────────────────── */}
      {isMobile && (
        <div
          style={{
            position: "relative", zIndex: 2,
            padding: "32px 20px 36px",
          }}
        >
          <div style={{ marginBottom: 32 }}>
            <DeviceStage {...stageProps} maxWidth={280} />
          </div>

          {/* Carousel nav */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, marginBottom: 14,
          }}>
            <button
              type="button"
              onClick={() => {
                const prev = (mobileIdx - 1 + FEATURES.length) % FEATURES.length;
                selectFeature(FEATURES[prev].n);
              }}
              aria-label="Previous feature"
              style={{
                width: 32, height: 32, borderRadius: 9999,
                background: "rgba(255,255,255,0.16)", border: "none",
                color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontFamily: "inherit",
              }}
            >‹</button>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {FEATURES.map((F, i) => (
                <button
                  key={F.n}
                  type="button"
                  onClick={() => selectFeature(F.n)}
                  aria-label={`Show ${F.label}`}
                  style={{
                    width: i === mobileIdx ? 20 : 8,
                    height: 8, borderRadius: 9999, padding: 0,
                    background: i === mobileIdx ? "#00FFD2" : "rgba(255,255,255,0.35)",
                    border: "none", cursor: "pointer",
                    transition: "all 240ms cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                const next = (mobileIdx + 1) % FEATURES.length;
                selectFeature(FEATURES[next].n);
              }}
              aria-label="Next feature"
              style={{
                width: 32, height: 32, borderRadius: 9999,
                background: "rgba(255,255,255,0.16)", border: "none",
                color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontFamily: "inherit",
              }}
            >›</button>
          </div>

          {/* Active card */}
          <FeatureCard
            feature={FEATURES[mobileIdx]}
            active
            align="right"
            onSelect={() => selectFeature(FEATURES[mobileIdx].n)}
          />

          <div style={{
            textAlign: "center", marginTop: 12, fontSize: 12,
            color: "rgba(255,255,255,0.6)", fontWeight: 500,
          }}>
            {mobileIdx + 1} of {FEATURES.length}
          </div>
        </div>
      )}
    </section>
  );
}
