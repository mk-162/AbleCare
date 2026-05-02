/* GripAble interactive rotation viewer
   - 21 PNG frames driven by mouse X over the device area (or drag)
   - Per-feature hotspots tracked across frames (x, y, vis) so lead-lines
     always point at the correct part of the device.
   - Tour mode: click a feature → animates to its bestFrame, highlights
     the hotspot + lead-line, dims others.
*/

const FRAMES = Array.from({ length: 21 }, (_, i) => `assets/rotate/${String(i + 1).padStart(2, "0")}.png`);

/* Each frame is 600x779. Coordinates below are in those same units;
   we scale them to the rendered device size at runtime.

   Per feature, we store an array of 21 entries — one per frame:
     { x, y, vis }   where vis ∈ [0, 1] (1 = clearly seen, 0 = on the back / hidden)

   Coordinates were read from the source frames. If a feature is on the
   far side of the device for a given frame, vis = 0 and the line hides.

   Frame index is 0..20 (UI shows 1..21).
*/

// Helper: build a smooth visibility curve. Peaks at `peak`, fades out around it.
const visCurve = (peak, halfWidth) => (i) => {
  const d = Math.abs(i - peak);
  if (d > halfWidth) return 0;
  const t = 1 - d / halfWidth;
  return Math.max(0, t);
};

// Anchor coordinates per frame, picked from the contact sheet.
// Frames are 600x779. Center column of the device varies by frame as it
// foreshortens; here are roughly-centered "device center" anchors per frame:
const DEVICE_CX = [
  295, 290, 285, 285, 290, 295, 300, // 1-7 (blue rotating to face)
  305, 310, 312, 312, 312, 308, 305, // 8-14 (rotating away)
  300, 295, 295, 298, 302, 305, 300, // 15-21 (back → returning)
];

// Per-feature data: we describe "best frame" + a hand-tuned position
// trajectory. For each feature we provide an array of {x,y} per frame and
// a vis curve. To keep the file tractable, positions for non-peak frames are
// interpolated from a few keyframes per feature.

// Render rule: a feature shows on a frame iff F.pos[frame] is defined.
// visKeys / visCurve are vestigial — kept only for legacy/debugging.
const F_KEYS = {
  // 1 — Locking Button (frames 0–20, traces top of grip across rotation)
  1: {
    label: "Locking Button",
    desc: "Switches grip modes. Squeeze and hold, then push down to lock.",
    bestFrame: 0,
    vis: visCurve(0, 2),
    pos: {
      0:  { x: 263, y: 114 }, 1:  { x: 273, y: 114 }, 2:  { x: 282, y: 114 },
      3:  { x: 284, y: 114 }, 4:  { x: 286, y: 113 }, 5:  { x: 291, y: 117 },
      6:  { x: 304, y: 116 }, 7:  { x: 309, y: 115 }, 8:  { x: 315, y: 115 },
      9:  { x: 326, y: 115 }, 10: { x: 335, y: 115 }, 11: { x: 325, y: 107 },
      12: { x: 319, y: 106 }, 13: { x: 314, y: 106 }, 14: { x: 304, y: 107 },
      15: { x: 294, y: 108 }, 16: { x: 284, y: 109 }, 17: { x: 268, y: 110 },
      18: { x: 255, y: 113 }, 19: { x: 248, y: 114 }, 20: { x: 251, y: 114 },
    },
    visKeys: {},
  },
  // 2 — Strap Hooks (frames 0–20)
  2: {
    label: "Strap Hooks",
    desc: "Two attachment points for silicone straps.",
    bestFrame: 5,
    vis: visCurve(5, 10),
    pos: {
      0:  { x: 356, y: 176 }, 1:  { x: 362, y: 176 }, 2:  { x: 362, y: 176 },
      3:  { x: 368, y: 173 }, 4:  { x: 227, y: 177 }, 5:  { x: 240, y: 177 },
      6:  { x: 251, y: 177 }, 7:  { x: 270, y: 179 }, 8:  { x: 287, y: 178 },
      9:  { x: 308, y: 177 }, 10: { x: 330, y: 176 }, 11: { x: 345, y: 176 },
      12: { x: 361, y: 176 }, 13: { x: 364, y: 177 }, 14: { x: 372, y: 177 },
      15: { x: 372, y: 176 }, 16: { x: 242, y: 175 }, 17: { x: 251, y: 177 },
      18: { x: 267, y: 177 }, 19: { x: 290, y: 177 }, 20: { x: 331, y: 177 },
    },
    visKeys: {},
  },
  // 3 — Grip Plate (frames 0–12, 18–20)
  3: {
    label: "Grip Plate",
    desc: "Squeeze the plate with your fingers to record force.",
    bestFrame: 2,
    vis: visCurve(2, 3),
    pos: {
      0:  { x: 216, y: 368 }, 1:  { x: 245, y: 368 }, 2:  { x: 272, y: 371 },
      3:  { x: 294, y: 372 }, 4:  { x: 347, y: 369 }, 5:  { x: 368, y: 369 },
      6:  { x: 378, y: 369 }, 7:  { x: 384, y: 369 }, 8:  { x: 384, y: 369 },
      9:  { x: 384, y: 369 }, 10: { x: 374, y: 369 }, 11: { x: 363, y: 369 },
      12: { x: 352, y: 369 },
      18: { x: 239, y: 367 }, 19: { x: 220, y: 367 }, 20: { x: 205, y: 368 },
    },
    visKeys: {},
  },
  // 4 — Battery LED (frames 7–15)
  4: {
    label: "Battery LED",
    desc: "At-a-glance charge status. Green / Yellow / Orange / Red.",
    bestFrame: 9,
    vis: visCurve(9, 3),
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
      7:  { x: 240, y: 620 }, 8:  { x: 240, y: 621 }, 9:  { x: 239, y: 623 },
      10: { x: 252, y: 627 }, 11: { x: 266, y: 630 }, 12: { x: 292, y: 633 },
      13: { x: 317, y: 634 }, 14: { x: 325, y: 634 }, 15: { x: 350, y: 630 },
    },
    visKeys: {},
  },
  // 5 — Lanyard Hook (frames 11–17)
  5: {
    label: "Lanyard Hook",
    desc: "Attachment point for the wrist lanyard.",
    bestFrame: 14,
    vis: visCurve(14, 4),
    pos: {
      11: { x: 232, y: 658 }, 12: { x: 249, y: 665 }, 13: { x: 270, y: 667 },
      14: { x: 291, y: 670 }, 15: { x: 315, y: 667 }, 16: { x: 331, y: 665 },
      17: { x: 352, y: 659 },
    },
    visKeys: {},
  },
  // 6 — Charging Port (frames 9–18)
  6: {
    label: "Charging Port",
    desc: "Magnetic connector for fast, fumble-free charging.",
    bestFrame: 14,
    vis: visCurve(14, 3),
    pos: {
      9:  { x: 212, y: 616 }, 10: { x: 214, y: 621 }, 11: { x: 228, y: 624 },
      12: { x: 248, y: 629 }, 13: { x: 270, y: 631 }, 14: { x: 294, y: 634 },
      15: { x: 316, y: 632 }, 16: { x: 337, y: 628 }, 17: { x: 357, y: 623 },
      18: { x: 367, y: 616 },
    },
    visKeys: {},
  },
  // 7 — Connection LED (frames 7–17)
  7: {
    label: "Connection LED",
    desc: "Pairing and connection status indicator.",
    bestFrame: 18,
    vis: visCurve(18, 3),
    legend: {
      title: "Connection LED",
      items: [
        { dot: "rgba(0,0,0,0.15)", k: "No light",     v: "Device is asleep" },
        { dot: "#1432FF",          k: "Flashing blue", v: "Pairing — ready to connect", pulse: true },
        { dot: "#1432FF",          k: "Solid blue",    v: "Connection established" },
      ],
    },
    pos: {
      7:  { x: 205, y: 177 }, 8:  { x: 204, y: 178 }, 9:  { x: 210, y: 178 },
      10: { x: 215, y: 178 }, 11: { x: 229, y: 178 }, 12: { x: 250, y: 177 },
      13: { x: 277, y: 178 }, 14: { x: 294, y: 178 }, 15: { x: 317, y: 176 },
      16: { x: 347, y: 177 }, 17: { x: 353, y: 177 },
    },
    visKeys: {},
  },
};

// Linear-interpolate keyframe data for a feature at frame index `f` (0..20)
const interpKey = (keys, f, fallback) => {
  if (keys[f] !== undefined) return keys[f];
  // find surrounding keys
  const ks = Object.keys(keys).map(Number).sort((a, b) => a - b);
  let lo = ks[0], hi = ks[ks.length - 1];
  for (const k of ks) { if (k <= f) lo = k; }
  for (let i = ks.length - 1; i >= 0; i--) { if (ks[i] >= f) hi = ks[i]; }
  if (lo === hi) return keys[lo];
  if (f < ks[0]) return keys[ks[0]];
  if (f > ks[ks.length - 1]) return keys[ks[ks.length - 1]];
  const t = (f - lo) / (hi - lo);
  const a = keys[lo], b = keys[hi];
  if (typeof a === "number") return a + (b - a) * t;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
};

const hotspotAt = (featureN, frame) => {
  const F = F_KEYS[featureN];
  const pos = interpKey(F.pos, frame, { x: 300, y: 400 });
  const vis = interpKey(F.visKeys, frame, 0);
  return { x: pos.x, y: pos.y, vis: Math.max(0, Math.min(1, vis)) };
};

const FEATURES = Object.entries(F_KEYS).map(([n, v]) => ({ n: Number(n), ...v }));

/* ─────────── Rotation viewer with tracked hotspots ─────────── */

const GAClassicAnimated = ({ width = 1280, height = 880 }) => {
  const FRAME_COUNT = FRAMES.length;
  const [frame, setFrame] = React.useState(2); // start near a nice angle
  const [active, setActive] = React.useState(null); // null | featureN
  const [tourMode, setTourMode] = React.useState(false);
  const [hint, setHint] = React.useState(true); // "drag to rotate" hint
  const targetFrame = React.useRef(2);
  const rafRef = React.useRef(null);
  const stageRef = React.useRef(null);

  // Smoothly chase a target frame
  const setTarget = (t) => {
    targetFrame.current = Math.max(0, Math.min(FRAME_COUNT - 1, t));
    if (!rafRef.current) {
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
    }
  };

  // Drag-to-rotate
  const drag = React.useRef({ active: false, startX: 0, startFrame: 0 });
  const onPointerDown = (e) => {
    drag.current = { active: true, startX: e.clientX, startFrame: targetFrame.current };
    setHint(false);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) {
      // Mouse-hover rotation across the device area
      if (!stageRef.current || tourMode) return;
      const rect = stageRef.current.getBoundingClientRect();
      const t = (e.clientX - rect.left) / rect.width; // 0..1
      const tt = Math.max(0, Math.min(1, t));
      // Map to frame range with a softer center bias so it feels natural
      setTarget(tt * (FRAME_COUNT - 1));
      return;
    }
    const dx = e.clientX - drag.current.startX;
    // rotation sensitivity: 320px to traverse all frames
    const next = drag.current.startFrame + (dx / 320) * (FRAME_COUNT - 1);
    setTarget(next);
  };
  const onPointerUp = (e) => {
    drag.current.active = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  // Tour mode: animate to the active feature's bestFrame
  React.useEffect(() => {
    if (active == null) return;
    const f = F_KEYS[active];
    if (f) setTarget(f.bestFrame);
  }, [active]);

  // Auto-loop in idle when the user hasn't interacted for a while → off by default,
  // a subtle micro-float instead.
  // (kept calm: the explicit drag/tour drives motion.)

  const onSelectFeature = (n) => {
    setTourMode(true);
    setActive(n);
    setHint(false);
  };
  const exitTour = () => {
    setTourMode(false);
    setActive(null);
  };

  // Card layout (responsive)
  const isCompact = width < 1100;
  const cardW = isCompact ? 200 : 250;
  const railLeftX = isCompact ? 32 : 56;
  const railRightX = width - railLeftX - cardW;
  const cardGap = 24;

  // Device size — clamp so cards never collide with the device.
  const maxDevByWidth = Math.max(260, width - 2 * (railLeftX + cardW + cardGap));
  const devW = Math.min(540, maxDevByWidth);
  const devH = devW * (779 / 600);
  const devX = width / 2 - devW / 2;
  const devY = (height - devH) / 2 + 30;
  const SCALE = devW / 600;

  // Distribute cards along the side rails using each feature's "best side" to match the screenshot:
  // 1 Locking, 6 Charging, 7 Connection on left
  // 2 Strap, 3 Grip, 4 Battery, 5 Lanyard on right
  const leftSide = [1, 6, 7];
  const rightSide = [2, 3, 4, 5];

  const placeCol = (ids, side) => {
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
  const cards = [...placeCol(leftSide, "left"), ...placeCol(rightSide, "right")];

  const frameInt = Math.round(frame);

  // Compute current hotspot positions in stage coordinates.
  // Rule: a feature renders ONLY on frames where F.pos has an explicit key —
  // no interpolation fallback, no visibility curve. If you didn't click it
  // in the calibrator, it doesn't show.
  const hotspots = FEATURES.map((F) => {
    const exact = F_KEYS[F.n].pos[frameInt];
    if (!exact) {
      return { n: F.n, sx: 0, sy: 0, vis: 0, hidden: true };
    }
    return {
      n: F.n,
      sx: devX + exact.x * SCALE,
      sy: devY + exact.y * SCALE,
      vis: 1,
      hidden: false,
    };
  });

  return (
    <div style={{
      width, height, position: "relative",
      background: "var(--ac-gradient-hero)",
      fontFamily: "var(--font-sans)", color: "#fff",
      overflow: "hidden",
      userSelect: "none",
      cursor: drag.current.active ? "grabbing" : "default",
    }}>
      {/* Atmospheric overlays from Spotlight */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(900px 560px at 90% 0%, rgba(0,255,210,0.22), transparent 60%), radial-gradient(900px 560px at 0% 100%, rgba(255,255,255,0.10), transparent 60%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      {/* Brandmark watermark — proper Able Care 'A' (white, low opacity over gradient) */}
      <AbleCareMark x={width - 480} y={height - 380} size={420} opacity={0.10} color="#ffffff" />

      {/* Header */}
      <div style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center", padding: "0 80px", zIndex: 5 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--ac-aqua)", marginBottom: 14 }}>
          ABOUT GRIPABLE
        </div>
        <h2 style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em", margin: 0, color: "#fff" }}>
          GripAble sensor features.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", margin: "10px 0 0", fontWeight: 300 }}>
          Designed with precision. Built for real-world care.
        </p>
      </div>

      {/* Connector SVG layer */}
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
           style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3 }}>
        {cards.map((c) => {
          const h = hotspots.find((x) => x.n === c.n);
          if (!h) return null;
          const isActive = active === c.n;
          // Line lands on the badge center. After the layout flip, badges sit
          // on the device-facing edge of every card (right edge for left-side,
          // left edge for right-side).
          const badgeCenterX = c.side === "left" ? c.cardX + cardW - 14 : c.cardX + 14;
          const cardCenterY = c.cardY + 14;
          if (h.hidden) return null;
          if (tourMode && !isActive) return null;
          const lineOpacity = 1;
          const stroke = isActive ? "var(--ac-aqua)" : "rgba(255,255,255,0.55)";
          const w = isActive ? 2 : 1;
          const dx = (badgeCenterX - h.sx) * 0.5;
          const d = `M ${h.sx},${h.sy} C ${h.sx + dx},${h.sy} ${badgeCenterX - dx},${cardCenterY} ${badgeCenterX},${cardCenterY}`;
          return (
            <g key={c.n} style={{ opacity: lineOpacity, transition: "opacity 240ms" }}>
              <path d={d} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round" />
            </g>
          );
        })}
      </svg>

      {/* Device stage — captures pointer events for rotation */}
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{
          position: "absolute",
          left: devX - 80, top: devY - 40,
          width: devW + 160, height: devH + 80,
          zIndex: 2,
          cursor: drag.current.active ? "grabbing" : "grab",
          touchAction: "none",
        }}>
        <div style={{
          position: "absolute", left: 80, top: 40,
          width: devW, height: devH,
        }}>
          {/* preload all frames, show only current */}
          {FRAMES.map((src, i) => (
            <img key={i} src={src} alt="" aria-hidden={i !== frameInt}
                 draggable={false}
                 style={{
                   position: "absolute", inset: 0,
                   width: "100%", height: "100%",
                   objectFit: "contain",
                   opacity: i === frameInt ? 1 : 0,
                   transition: "opacity 60ms linear",
                   filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.18))",
                   pointerEvents: "none",
                 }} />
          ))}
          {/* aqua glow under */}
          <div style={{
            position: "absolute", left: "50%", bottom: -10, transform: "translateX(-50%)",
            width: devW * 0.55, height: 22, borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(0,255,210,0.35) 0%, transparent 70%)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }} />
        </div>

        {/* Hotspot dots overlaid on the device — clickable */}
        {hotspots.map((h) => {
          if (h.hidden) return null;
          const isActive = active === h.n;
          if (tourMode && !isActive) return null;
          const opacity = 1;
          return (
            <button
              key={h.n}
              onClick={(e) => { e.stopPropagation(); onSelectFeature(h.n); }}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                left: h.sx - devX + 80,
                top: h.sy - devY + 40,
                transform: "translate(-50%,-50%)",
                width: 28, height: 28,
                borderRadius: 9999,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                zIndex: 4,
              }}
              aria-label={`Feature ${h.n}: ${F_KEYS[h.n].label}`}
            ></button>
          );
        })}

        {/* Drag-to-rotate hint */}
        {hint && (
          <div style={{
            position: "absolute",
            left: "50%", bottom: 0, transform: "translateX(-50%)",
            background: "rgba(20,50,255,0.95)", color: "#fff",
            padding: "8px 16px", borderRadius: 9999,
            fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
            display: "inline-flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 16px rgba(20,50,255,0.3)",
            animation: "ga-bob 2s ease-in-out infinite",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}>
            <RotateIconRot /> Drag or hover to rotate
          </div>
        )}
      </div>

      {/* Callout cards */}
      {cards.map((c) => {
        const F = F_KEYS[c.n];
        const isActive = active === c.n;
        return (
          <div key={c.n}
               onClick={() => onSelectFeature(c.n)}
               style={{
                 position: "absolute", left: c.cardX - (isActive ? 14 : 0), top: c.cardY - (isActive ? 10 : 0),
                 width: cardW + (isActive ? 28 : 0), cursor: "pointer", zIndex: isActive ? 10 : 4,
                 opacity: 1,
                 transition: "all 280ms cubic-bezier(0.16,1,0.3,1)",
                 padding: isActive ? "14px 16px" : "0",
                 borderRadius: isActive ? 14 : 0,
                 background: isActive ? "#fff" : "transparent",
                 boxShadow: isActive ? "0 12px 32px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,255,210,0.4)" : "none",
                 border: "none",
               }}>
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              flexDirection: c.side === "left" ? "row-reverse" : "row",
            }}>
              <BadgeRot n={c.n} active={isActive} scheme={isActive ? "light" : "blue"} onClick={(e) => { e.stopPropagation(); onSelectFeature(c.n); }} />
              <div style={{ minWidth: 0, textAlign: c.side === "left" ? "right" : "left" }}>
                <div style={{
                  fontSize: isActive ? 17 : (isCompact ? 14 : 16),
                  fontWeight: 700,
                  letterSpacing: "-0.005em",
                  marginBottom: 4,
                  color: isActive ? "var(--ac-black)" : "#fff",
                  transition: "font-size 220ms, color 220ms",
                }}>
                  {F.label}
                </div>
                <div style={{
                  fontSize: isCompact ? 12 : 13.5,
                  color: isActive ? "var(--ac-black)" : "#fff",
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}>
                  {F.desc}
                </div>
                {F.legend && isActive && (
                  <div style={{ animation: "ga-fadein 360ms ease-out" }}>
                    <LedLegendRot legend={F.legend} compact />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Tour controls — desktop: only shown in tour mode (rotation handles browse) */}
      {tourMode && (
        <TourControlsRot
          active={active}
          setActive={(n) => onSelectFeature(typeof n === "function" ? n(active ?? 0) : n)}
          count={FEATURES.length}
          featureNs={FEATURES.map((f) => f.n)}
          onExit={exitTour}
          tourMode={tourMode}
        />
      )}

      <KeyframesRot />
    </div>
  );
};

/* ─────────── Sub-components (Badge/LedLegend reused from gripable-features.jsx) ─────────── */

const BadgeRot = ({ n, active, scheme = "light", onClick, size = 28 }) => {
  const isBlueScheme = scheme === "blue";
  const bg = active ? "var(--ac-aqua)" : isBlueScheme ? "rgba(255,255,255,0.95)" : "var(--ac-blue)";
  const fg = active ? "var(--ac-black)" : isBlueScheme ? "var(--ac-blue)" : "#fff";
  return (
    <button
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: 9999,
        background: bg, color: fg,
        border: "none",
        boxShadow: active ? "0 0 0 6px rgba(0,255,210,0.25)" : "0 1px 2px rgba(0,0,0,0.15)",
        fontWeight: 700, fontSize: size * 0.45, lineHeight: 1,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 220ms cubic-bezier(0.16,1,0.3,1)",
        fontFamily: "var(--font-sans)",
        flexShrink: 0,
      }}
      aria-label={`Feature ${n}`}
    >
      {n}
    </button>
  );
};

const LedLegendRot = ({ legend, compact = false }) => {
  if (!legend) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 5 : 8, marginTop: 10 }}>
      {legend.items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: compact ? 12 : 13 }}>
          <span style={{
            width: 10, height: 10, borderRadius: 9999, background: it.dot,
            flexShrink: 0,
            boxShadow: it.dot.startsWith("rgba") ? "inset 0 0 0 1px rgba(0,0,0,0.15)" : "0 0 0 2px rgba(255,255,255,0.6)",
            animation: it.pulse ? "ga-pulse 1.4s ease-in-out infinite" : "none",
          }} />
          <span style={{ fontWeight: 600, minWidth: 76, color: "var(--ac-black)" }}>{it.k}</span>
          <span style={{ color: "var(--ac-black)", opacity: 0.7 }}>{it.v}</span>
        </div>
      ))}
    </div>
  );
};

const TourControlsRot = ({ active, setActive, count, featureNs, onExit, tourMode }) => {
  const idx = active == null ? -1 : featureNs.indexOf(active);
  return (
    <div style={{
      position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
      display: "flex", alignItems: "center", gap: 14, zIndex: 6,
      padding: "10px 14px",
      background: "rgba(255,255,255,0.92)",
      borderRadius: 9999,
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
    }}>
      <button onClick={() => {
        const next = idx <= 0 ? featureNs[count - 1] : featureNs[idx - 1];
        setActive(next);
      }} style={navBtnRot}>←</button>
      <div style={{ display: "flex", gap: 6 }}>
        {featureNs.map((n, i) => (
          <button key={n} onClick={() => setActive(n)} aria-label={`Feature ${n}`}
            style={{
              width: i === idx ? 22 : 7, height: 7, borderRadius: 9999,
              background: i === idx ? "var(--ac-blue)" : "rgba(0,0,0,0.18)",
              border: "none", padding: 0, cursor: "pointer",
              transition: "all 240ms cubic-bezier(0.16,1,0.3,1)",
            }} />
        ))}
      </div>
      <button onClick={() => {
        const next = idx >= count - 1 || idx < 0 ? featureNs[0] : featureNs[idx + 1];
        setActive(next);
      }} style={navBtnRot}>→</button>
      <div style={{
        fontSize: 12, fontWeight: 600, color: "rgba(25,25,25,0.65)",
        paddingLeft: 8, marginLeft: 4, borderLeft: "1px solid rgba(0,0,0,0.08)",
        minWidth: 50,
      }}>
        {active != null ? `${String(idx + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}` : `— / ${String(count).padStart(2, "0")}`}
      </div>
      {tourMode && (
        <button onClick={onExit} style={{
          ...navBtnRot, width: "auto", padding: "0 12px", borderRadius: 9999,
          background: "transparent", color: "var(--ac-black)",
          border: "1px solid rgba(0,0,0,0.12)", fontSize: 12,
        }}>Reset</button>
      )}
    </div>
  );
};

const navBtnRot = {
  width: 30, height: 30, borderRadius: 9999,
  background: "var(--ac-blue)",
  color: "#fff",
  border: "none",
  fontSize: 14, fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  transition: "all 200ms",
  fontFamily: "var(--font-sans)",
};

const RotateIconRot = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <polyline points="3 4 3 9 8 9" />
  </svg>
);

/* Proper Able Care 'A' brandmark — extracted from the official logo SVG.
   This is the rounded-A glyph (two arches forming an A) at the bottom of the
   logo. Rendered as a soft watermark. */
const AbleCareMark = ({ x, y, size = 320, opacity = 0.06, color = "#1432FF" }) => (
  <svg viewBox="0 0 754 540"
       style={{ position: "absolute", left: x, top: y, width: size, height: size * (540 / 754),
                opacity, pointerEvents: "none", zIndex: 1 }}
       aria-hidden="true">
    <g fill={color} transform="translate(0, -100)">
      <path d="M377.3,340.5l101.06,140.55l0.03,0.05c22.43,34.28,61.15,56.93,105.17,56.93c69.37,0,125.6-56.23,125.6-125.6
        c0-29.28-10.02-56.22-26.81-77.57l0-0.01L481.14,55.02C458.54,21.81,420.43,0,377.23,0c-43.58,0-81.97,22.19-104.49,55.89
        L171.61,196.53l-1.66,2.31c-6.5,9.89-10.29,21.72-10.29,34.43c0,24.08,13.55,44.98,33.44,55.51c7.46,3.95,15.81,6.44,24.67,7.09
        c1.55,0.11,3.11,0.19,4.68,0.19c21.29,0,40.1-10.59,51.46-26.79l71.07-98.84l0.46-0.65c11.46-15.27,29.71-25.16,50.27-25.16
        c34.68,0,62.8,28.12,62.8,62.8c0,12.67-3.76,24.45-10.22,34.32L377.3,340.5z" />
      <path d="M271.72,487.33c-22.89,30.76-59.53,50.7-100.82,50.7c-69.37,0-125.6-56.23-125.6-125.6
        c0-29.47,10.15-56.56,27.14-77.98l-5.12,7.12l5.12-7.12l97.51-135.6c-6.5,9.89-10.29,21.72-10.29,34.43
        c0,24.08,13.55,44.98,33.44,55.51c7.46,3.95,15.81,6.44,24.67,7.09c1.55,0.11,3.11,0.19,4.68,0.19c21.29,0,40.1-10.59,51.46-26.79
        l71.07-98.84l0.46-0.65c11.46-15.27,29.71-25.16,50.27-25.16c34.68,0,62.8,28.12,62.8,62.8c0,12.67-3.76,24.45-10.22,34.32
        L271.72,487.33" />
    </g>
  </svg>
);

const KeyframesRot = () => (
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
  `}</style>
);

Object.assign(window, { GAClassicAnimated, AbleCareMark, TourControlsRot });
