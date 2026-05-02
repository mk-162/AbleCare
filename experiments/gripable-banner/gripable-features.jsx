/* GripAbleFeatures — interactive product callout diagram
   Variants: 'classic' (refined original), 'editorial' (offset hero), 'spotlight' (guided tour focus)
*/

const GA_FEATURES = [
  {
    n: 1,
    label: "Locking Button",
    desc: "Switches grip modes. Squeeze and hold, then push down to lock.",
    // hotspot coords are % of the device image bounding box
    x: 47,
    y: 19,
    side: "left",
  },
  {
    n: 2,
    label: "Strap Hooks",
    desc: "Two attachment points for silicone straps.",
    x: 60,
    y: 22,
    side: "right",
  },
  {
    n: 3,
    label: "Grip Plate",
    desc: "Squeeze the plate with your fingers to record force.",
    x: 56,
    y: 45,
    side: "right",
  },
  {
    n: 4,
    label: "Battery LED",
    desc: "At-a-glance charge status.",
    x: 60,
    y: 73,
    side: "right",
    legend: {
      title: "Battery LED",
      items: [
        { dot: "#22c55e", k: "Green",  v: "Fully charged" },
        { dot: "#eab308", k: "Yellow", v: "Charging" },
        { dot: "#f97316", k: "Orange", v: "Battery OK" },
        { dot: "#ef4444", k: "Red",    v: "Battery low" },
      ],
    },
  },
  {
    n: 5,
    label: "Lanyard Hook",
    desc: "Attachment point for the wrist lanyard.",
    x: 50,
    y: 87,
    side: "right",
  },
  {
    n: 6,
    label: "Charging Port",
    desc: "Magnetic connector for fast, fumble-free charging.",
    x: 47,
    y: 80,
    side: "left",
  },
  {
    n: 7,
    label: "Connection LED",
    desc: "Pairing and connection status indicator.",
    x: 50,
    y: 35,
    side: "left",
    legend: {
      title: "Connection LED",
      items: [
        { dot: "rgba(0,0,0,0.15)", k: "No light",     v: "Device is asleep" },
        { dot: "#1432FF",          k: "Flashing blue", v: "Pairing — ready to connect", pulse: true },
        { dot: "#1432FF",          k: "Solid blue",    v: "Connection established" },
      ],
    },
  },
];

/* shared helpers ─────────────────────────────────────────────────────────── */
const useTour = (count, autoMs = 0) => {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(true); // start paused; user-driven
  React.useEffect(() => {
    if (paused || !autoMs) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % count), autoMs);
    return () => clearTimeout(t);
  }, [active, paused, autoMs, count]);
  return { active, setActive, paused, setPaused };
};

const Badge = ({ n, active, scheme = "light", onClick, size = 28 }) => {
  const isBlue = scheme === "blue";
  const bg = active ? "var(--ac-aqua)" : isBlue ? "rgba(255,255,255,0.95)" : "var(--ac-blue)";
  const fg = active ? "var(--ac-black)" : isBlue ? "var(--ac-blue)" : "#fff";
  return (
    <button
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: 9999,
        background: bg, color: fg,
        border: active ? `2px solid var(--ac-aqua)` : "none",
        boxShadow: active ? "0 0 0 6px rgba(0,255,210,0.25)" : "0 1px 2px rgba(0,0,0,0.15)",
        fontWeight: 700, fontSize: size * 0.45, lineHeight: 1,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 220ms cubic-bezier(0.16,1,0.3,1)",
        fontFamily: "var(--font-sans)",
      }}
      aria-label={`Feature ${n}`}
    >
      {n}
    </button>
  );
};

/* Connector — curved SVG line from hotspot to callout, plus terminal dot */
const Connector = ({ from, to, active, scheme = "light" }) => {
  const stroke = active ? "var(--ac-blue)" : scheme === "blue" ? "rgba(255,255,255,0.35)" : "rgba(20,50,255,0.25)";
  const w = active ? 1.6 : 1;
  // simple bezier with horizontal handles
  const dx = (to.x - from.x) * 0.5;
  const d = `M ${from.x},${from.y} C ${from.x + dx},${from.y} ${to.x - dx},${to.y} ${to.x},${to.y}`;
  return (
    <g style={{ transition: "all 300ms" }}>
      <path d={d} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round"
            style={{ transition: "stroke 300ms, stroke-width 300ms" }} />
      <circle cx={from.x} cy={from.y} r={active ? 5 : 3.5}
              fill={active ? "var(--ac-aqua)" : scheme === "blue" ? "#fff" : "var(--ac-blue)"}
              stroke={active ? "var(--ac-blue)" : "none"} strokeWidth={1.5}
              style={{ transition: "all 300ms" }} />
    </g>
  );
};

/* Legend block — replaces the table format */
const LedLegend = ({ legend, scheme = "light", compact = false }) => {
  if (!legend) return null;
  const muted = scheme === "blue" ? "rgba(255,255,255,0.7)" : "rgba(25,25,25,0.6)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 6 : 8, marginTop: 10 }}>
      {legend.items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: compact ? 12 : 13 }}>
          <span style={{
            width: 10, height: 10, borderRadius: 9999, background: it.dot,
            flexShrink: 0, boxShadow: it.dot.startsWith("rgba") ? "inset 0 0 0 1px rgba(0,0,0,0.15)" : "0 0 0 2px rgba(255,255,255,0.6)",
            animation: it.pulse ? "ga-pulse 1.4s ease-in-out infinite" : "none",
          }} />
          <span style={{ fontWeight: 600, minWidth: 76 }}>{it.k}</span>
          <span style={{ color: muted }}>{it.v}</span>
        </div>
      ))}
    </div>
  );
};

/* ═════════════════════════════════════════════════════════════════════════
   VARIANT A — CLASSIC: refined version of the original.
   Grey background, callouts on both sides, soft float on device,
   click-to-tour with one feature emphasized at a time.
   ═════════════════════════════════════════════════════════════════════════ */
const GAClassic = ({ width = 1280, height = 880 }) => {
  const { active, setActive } = useTour(GA_FEATURES.length);

  // device occupies center column. Calculated layout in pixels.
  const devW = 360, devH = 720;
  const devX = width / 2 - devW / 2;
  const devY = (height - devH) / 2 + 20;

  // callout target points (in viewBox px) per feature
  const targets = GA_FEATURES.map((f) => ({
    fx: devX + (f.x / 100) * devW,
    fy: devY + (f.y / 100) * devH,
    side: f.side,
    f,
  }));

  // arrange callout cards along left/right rails
  const left  = GA_FEATURES.map((f, i) => ({ ...f, i })).filter((f) => f.side === "left");
  const right = GA_FEATURES.map((f, i) => ({ ...f, i })).filter((f) => f.side === "right");

  const railLeftX = 60, railRightX = width - 60 - 280;
  const cardW = 280;

  const placeCol = (col, side) => {
    // distribute vertically with min spacing
    const padTop = 130, padBot = 70;
    const usable = height - padTop - padBot;
    const step = usable / Math.max(col.length, 1);
    return col.map((c, idx) => ({
      ...c,
      cardX: side === "left" ? railLeftX : railRightX,
      cardY: padTop + step * idx,
    }));
  };
  const leftCards  = placeCol(left, "left");
  const rightCards = placeCol(right, "right");
  const allCards = [...leftCards, ...rightCards];

  return (
    <div style={{
      width, height, position: "relative",
      background: "var(--ac-grey)",
      fontFamily: "var(--font-sans)", color: "var(--ac-black)",
      overflow: "hidden",
    }}>
      {/* Brandmark watermark, bottom-left, very low opacity */}
      <BrandmarkWatermark x={-60} y={height - 220} size={420} opacity={0.05} color="#1432FF" />

      {/* Header */}
      <div style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center", padding: "0 80px" }}>
        <div className="eyebrow" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--ac-blue)", marginBottom: 14 }}>
          ABOUT GRIPABLE
        </div>
        <h2 style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em", margin: 0 }}>
          GripAble sensor features.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(25,25,25,0.65)", margin: "10px 0 0", fontWeight: 300 }}>
          Designed with precision. Built for real-world care.
        </p>
      </div>

      {/* SVG layer for connectors */}
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
           style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {allCards.map((c) => {
          const t = targets[c.i];
          const cardCenterY = c.cardY + 22;
          const cardEdgeX = c.side === "left" ? c.cardX + cardW : c.cardX;
          const isActive = active === c.i;
          return (
            <Connector
              key={c.i}
              from={{ x: t.fx, y: t.fy }}
              to={{ x: cardEdgeX, y: cardCenterY }}
              active={isActive}
            />
          );
        })}
      </svg>

      {/* Device */}
      <div style={{
        position: "absolute",
        left: devX, top: devY,
        width: devW, height: devH,
        animation: "ga-float 6s ease-in-out infinite",
      }}>
        {/* soft glow pad under device */}
        <div style={{
          position: "absolute", left: "50%", bottom: -30, transform: "translateX(-50%)",
          width: devW * 0.7, height: 36, borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(0,255,210,0.35) 0%, transparent 70%)",
          filter: "blur(12px)",
        }} />
        <img src="assets/gripable-sensor-cutout.png" alt="GripAble sensor"
             style={{ width: "100%", height: "100%", objectFit: "contain", display: "block",
                      filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.15))" }} />
      </div>

      {/* Callout cards */}
      {allCards.map((c) => {
        const isActive = active === c.i;
        const dim = !isActive && active !== null;
        return (
          <div key={c.i}
               onClick={() => setActive(c.i)}
               style={{
                 position: "absolute", left: c.cardX, top: c.cardY,
                 width: cardW, cursor: "pointer",
                 opacity: dim ? 0.55 : 1,
                 transform: isActive ? "translateX(0)" : c.side === "left" ? "translateX(-2px)" : "translateX(2px)",
                 transition: "opacity 240ms, transform 240ms",
               }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ marginTop: 1 }}>
                <Badge n={c.n} active={isActive} onClick={(e) => { e.stopPropagation(); setActive(c.i); }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.005em", marginBottom: 4 }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 13.5, color: "rgba(25,25,25,0.65)", fontWeight: 300, lineHeight: 1.5 }}>
                  {c.desc}
                </div>
                {c.legend && isActive && (
                  <div style={{ animation: "ga-fadein 360ms ease-out" }}>
                    <LedLegend legend={c.legend} compact />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Tour controls bottom-center */}
      <TourControls active={active} setActive={setActive} count={GA_FEATURES.length} />

      <Keyframes />
    </div>
  );
};

/* ═════════════════════════════════════════════════════════════════════════
   VARIANT B — EDITORIAL: white background, gradient "A" symbol behind device,
   numbered hotspots ON the device itself, callouts in a side panel that
   updates as you click. More like a product page hero.
   ═════════════════════════════════════════════════════════════════════════ */
const GAEditorial = ({ width = 1280, height = 880 }) => {
  const { active, setActive } = useTour(GA_FEATURES.length);

  const devW = 380, devH = 760;
  const devX = 140;
  const devY = (height - devH) / 2 + 20;

  const cur = GA_FEATURES[active];

  return (
    <div style={{
      width, height, position: "relative",
      background: "#fff",
      fontFamily: "var(--font-sans)", color: "var(--ac-black)",
      overflow: "hidden",
    }}>
      {/* Soft grey wash at the top */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #F4F4F4 0%, #FFFFFF 60%)",
      }} />

      {/* Gradient "A" brand-mark device backdrop — sits behind device as a soft frame */}
      <ASymbolBackdrop cx={devX + devW / 2} cy={devY + devH / 2 + 20} h={devH * 0.92} opacity={0.18} />

      {/* Header */}
      <div style={{ position: "absolute", top: 60, left: 80, right: 80 }}>
        <div className="eyebrow" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--ac-blue)", marginBottom: 14 }}>
          ABOUT GRIPABLE
        </div>
        <h2 style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em", margin: 0, maxWidth: 720 }}>
          GripAble sensor features.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(25,25,25,0.65)", margin: "10px 0 0", fontWeight: 300 }}>
          Designed with precision. Built for real-world care.
        </p>
      </div>

      {/* Device */}
      <div style={{
        position: "absolute", left: devX, top: devY, width: devW, height: devH,
        animation: "ga-float 7s ease-in-out infinite",
      }}>
        <img src="assets/gripable-sensor-cutout.png" alt="GripAble sensor"
             style={{ width: "100%", height: "100%", objectFit: "contain",
                      filter: "drop-shadow(0 40px 50px rgba(0,0,0,0.18))" }} />

        {/* Hotspot dots placed on the device */}
        {GA_FEATURES.map((f, i) => {
          const isActive = active === i;
          const x = (f.x / 100) * devW;
          const y = (f.y / 100) * devH;
          return (
            <button key={i} onClick={() => setActive(i)}
              style={{
                position: "absolute", left: x, top: y,
                transform: "translate(-50%, -50%)",
                width: isActive ? 36 : 28, height: isActive ? 36 : 28,
                borderRadius: 9999,
                background: isActive ? "var(--ac-aqua)" : "rgba(255,255,255,0.95)",
                color: isActive ? "var(--ac-black)" : "var(--ac-blue)",
                border: "none",
                boxShadow: isActive
                  ? "0 0 0 6px rgba(0,255,210,0.35), 0 4px 14px rgba(0,0,0,0.18)"
                  : "0 2px 8px rgba(0,0,0,0.18)",
                fontWeight: 700, fontSize: isActive ? 15 : 12,
                cursor: "pointer",
                transition: "all 260ms cubic-bezier(0.16,1,0.3,1)",
                fontFamily: "var(--font-sans)",
                zIndex: 4,
              }}
              aria-label={`Feature ${f.n}`}>
              {f.n}
              {isActive && (
                <span style={{
                  position: "absolute", inset: -4, borderRadius: 9999,
                  border: "2px solid var(--ac-aqua)", animation: "ga-ring 1.6s ease-out infinite",
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Side panel — current feature */}
      <div style={{
        position: "absolute",
        right: 80, top: 200,
        width: 460,
        padding: "32px 32px 28px",
        background: "#fff",
        borderRadius: 24,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <Badge n={cur.n} active size={42} />
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(25,25,25,0.5)" }}>
            {String(cur.n).padStart(2, "0")} / {String(GA_FEATURES.length).padStart(2, "0")}
          </div>
        </div>
        <h3 key={`t-${active}`} style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em", margin: 0, animation: "ga-fadein 360ms ease-out" }}>
          {cur.label}
        </h3>
        <p key={`d-${active}`} style={{ fontSize: 16, color: "rgba(25,25,25,0.7)", fontWeight: 300, lineHeight: 1.55, marginTop: 10, animation: "ga-fadein 380ms ease-out" }}>
          {cur.desc}
        </p>
        {cur.legend && (
          <div key={`l-${active}`} style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(0,0,0,0.08)", animation: "ga-fadein 420ms ease-out" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(25,25,25,0.5)", marginBottom: 8 }}>
              {cur.legend.title} — Status reference
            </div>
            <LedLegend legend={cur.legend} />
          </div>
        )}

        {/* feature list mini-rail */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
            {GA_FEATURES.map((f, i) => (
              <button key={i} onClick={() => setActive(i)}
                style={{
                  height: 4, borderRadius: 9999,
                  background: i === active ? "var(--ac-blue)" : "rgba(0,0,0,0.1)",
                  border: "none", padding: 0, cursor: "pointer",
                  transition: "background 220ms",
                }}
                aria-label={`Go to feature ${f.n}`} />
            ))}
          </div>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={() => setActive((active - 1 + GA_FEATURES.length) % GA_FEATURES.length)}
              style={pillBtn(false)}>← Prev</button>
            <button
              onClick={() => setActive((active + 1) % GA_FEATURES.length)}
              style={pillBtn(true)}>Next →</button>
          </div>
        </div>
      </div>

      <Keyframes />
    </div>
  );
};

/* ═════════════════════════════════════════════════════════════════════════
   VARIANT C — SPOTLIGHT: blue scheme hero variant. Device on full gradient
   background. Callouts on both sides as in the original, but with
   white-on-blue palette + aqua accents. The active feature gets a circular
   "spotlight" highlight on the device.
   ═════════════════════════════════════════════════════════════════════════ */
const GASpotlight = ({ width = 1280, height = 880 }) => {
  const { active, setActive } = useTour(GA_FEATURES.length);

  const devW = 360, devH = 720;
  const devX = width / 2 - devW / 2;
  const devY = (height - devH) / 2 + 30;

  const targets = GA_FEATURES.map((f) => ({
    fx: devX + (f.x / 100) * devW,
    fy: devY + (f.y / 100) * devH,
    side: f.side,
    f,
  }));

  const left  = GA_FEATURES.map((f, i) => ({ ...f, i })).filter((f) => f.side === "left");
  const right = GA_FEATURES.map((f, i) => ({ ...f, i })).filter((f) => f.side === "right");

  const cardW = 270, railLeftX = 64, railRightX = width - 64 - cardW;

  const placeCol = (col, side) => {
    const padTop = 150, padBot = 90;
    const usable = height - padTop - padBot;
    const step = usable / Math.max(col.length, 1);
    return col.map((c, idx) => ({
      ...c,
      cardX: side === "left" ? railLeftX : railRightX,
      cardY: padTop + step * idx,
    }));
  };
  const leftCards = placeCol(left, "left");
  const rightCards = placeCol(right, "right");
  const allCards = [...leftCards, ...rightCards];
  const cur = GA_FEATURES[active];
  const tCur = targets[active];

  return (
    <div style={{
      width, height, position: "relative",
      background: "var(--ac-gradient-hero)",
      fontFamily: "var(--font-sans)", color: "#fff",
      overflow: "hidden",
    }}>
      {/* Soft radial glows — aqua top-right, white bottom-left */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(800px 500px at 90% 0%, rgba(0,255,210,0.22), transparent 60%), radial-gradient(800px 500px at 0% 100%, rgba(255,255,255,0.10), transparent 60%)",
      }} />

      {/* Header */}
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", padding: "0 80px", zIndex: 3 }}>
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

      {/* Connectors */}
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
           style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
        {allCards.map((c) => {
          const t = targets[c.i];
          const cardCenterY = c.cardY + 22;
          const cardEdgeX = c.side === "left" ? c.cardX + cardW : c.cardX;
          return (
            <Connector key={c.i}
              from={{ x: t.fx, y: t.fy }}
              to={{ x: cardEdgeX, y: cardCenterY }}
              active={active === c.i}
              scheme="blue"
            />
          );
        })}
      </svg>

      {/* Device with spotlight halo */}
      <div style={{
        position: "absolute", left: devX, top: devY,
        width: devW, height: devH,
        animation: "ga-float 6s ease-in-out infinite",
        zIndex: 3,
      }}>
        {/* Spotlight ring that follows active hotspot */}
        <div style={{
          position: "absolute",
          left: `${cur.x}%`, top: `${cur.y}%`,
          transform: "translate(-50%,-50%)",
          width: 92, height: 92, borderRadius: 9999,
          background: "radial-gradient(circle, rgba(0,255,210,0.35) 0%, rgba(0,255,210,0.0) 70%)",
          transition: "left 600ms cubic-bezier(0.16,1,0.3,1), top 600ms cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: "none",
        }} />
        <img src="assets/gripable-sensor-cutout.png" alt="GripAble sensor"
             style={{ width: "100%", height: "100%", objectFit: "contain",
                      filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.35))" }} />

        {/* hotspot rings */}
        {GA_FEATURES.map((f, i) => {
          const isActive = active === i;
          return (
            <button key={i} onClick={() => setActive(i)}
              style={{
                position: "absolute", left: `${f.x}%`, top: `${f.y}%`,
                transform: "translate(-50%,-50%)",
                width: 18, height: 18, borderRadius: 9999,
                background: isActive ? "var(--ac-aqua)" : "rgba(255,255,255,0.85)",
                border: "2px solid #fff",
                boxShadow: isActive ? "0 0 0 5px rgba(0,255,210,0.35)" : "0 2px 6px rgba(0,0,0,0.2)",
                cursor: "pointer",
                transition: "all 220ms cubic-bezier(0.16,1,0.3,1)",
                padding: 0,
                zIndex: 4,
              }}
              aria-label={`Feature ${f.n}`} />
          );
        })}
      </div>

      {/* Callout cards */}
      {allCards.map((c) => {
        const isActive = active === c.i;
        const dim = !isActive;
        return (
          <div key={c.i}
               onClick={() => setActive(c.i)}
               style={{
                 position: "absolute", left: c.cardX, top: c.cardY,
                 width: cardW, cursor: "pointer", zIndex: 3,
                 opacity: dim ? 0.6 : 1,
                 transition: "opacity 220ms",
               }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <Badge n={c.n} active={isActive} scheme="blue" onClick={(e) => { e.stopPropagation(); setActive(c.i); }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.78)", fontWeight: 300, lineHeight: 1.5 }}>
                  {c.desc}
                </div>
                {c.legend && isActive && (
                  <div style={{ animation: "ga-fadein 360ms ease-out", marginTop: 10 }}>
                    {c.legend.items.map((it, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, marginBottom: 5 }}>
                        <span style={{
                          width: 10, height: 10, borderRadius: 9999, background: it.dot,
                          boxShadow: "0 0 0 2px rgba(255,255,255,0.5)",
                          animation: it.pulse ? "ga-pulse 1.4s ease-in-out infinite" : "none",
                        }} />
                        <span style={{ fontWeight: 600, minWidth: 76, color: "#fff" }}>{it.k}</span>
                        <span style={{ color: "rgba(255,255,255,0.7)" }}>{it.v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <TourControls active={active} setActive={setActive} count={GA_FEATURES.length} scheme="blue" />
      <Keyframes />
    </div>
  );
};

/* ─── Shared sub-components ─────────────────────────────────────────────── */

const TourControls = ({ active, setActive, count, scheme = "light" }) => {
  const isBlue = scheme === "blue";
  return (
    <div style={{
      position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
      display: "flex", alignItems: "center", gap: 14, zIndex: 5,
      padding: "10px 14px",
      background: isBlue ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.85)",
      backdropFilter: "blur(0px)",
      borderRadius: 9999,
      border: isBlue ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(0,0,0,0.06)",
      boxShadow: isBlue ? "none" : "0 2px 12px rgba(0,0,0,0.05)",
    }}>
      <button onClick={() => setActive((active - 1 + count) % count)} style={navBtn(isBlue)}>←</button>
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: count }).map((_, i) => (
          <button key={i} onClick={() => setActive(i)} aria-label={`Feature ${i + 1}`}
            style={{
              width: i === active ? 22 : 7, height: 7, borderRadius: 9999,
              background: i === active
                ? (isBlue ? "var(--ac-aqua)" : "var(--ac-blue)")
                : (isBlue ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.18)"),
              border: "none", padding: 0, cursor: "pointer",
              transition: "all 240ms cubic-bezier(0.16,1,0.3,1)",
            }} />
        ))}
      </div>
      <button onClick={() => setActive((active + 1) % count)} style={navBtn(isBlue)}>→</button>
      <div style={{
        fontSize: 12, fontWeight: 600, color: isBlue ? "rgba(255,255,255,0.9)" : "rgba(25,25,25,0.65)",
        paddingLeft: 8, marginLeft: 4, borderLeft: isBlue ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.08)",
      }}>
        {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </div>
    </div>
  );
};

const navBtn = (isBlue) => ({
  width: 30, height: 30, borderRadius: 9999,
  background: isBlue ? "rgba(255,255,255,0.12)" : "var(--ac-blue)",
  color: isBlue ? "#fff" : "#fff",
  border: "none",
  fontSize: 14, fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  transition: "all 200ms",
});

const pillBtn = (primary) => ({
  height: 36, padding: "0 16px",
  borderRadius: 9999,
  background: primary ? "var(--ac-blue)" : "transparent",
  color: primary ? "#fff" : "var(--ac-black)",
  border: primary ? "none" : "1px solid rgba(0,0,0,0.12)",
  fontWeight: 600, fontSize: 13,
  fontFamily: "var(--font-sans)",
  cursor: "pointer",
  transition: "all 200ms",
});

/* The "A" symbol — two rounded capsules forming an A, gradient-filled */
const ASymbolBackdrop = ({ cx, cy, h, opacity = 0.9 }) => {
  const w = h * 0.78;
  return (
    <svg
      viewBox="0 0 100 130"
      style={{
        position: "absolute",
        left: cx - w / 2, top: cy - h / 2,
        width: w, height: h,
        opacity,
        zIndex: 1,
        pointerEvents: "none",
      }}
      aria-hidden="true">
      <defs>
        <linearGradient id="ga-a-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#1432FF" />
          <stop offset="60%" stopColor="#00a896" />
          <stop offset="100%" stopColor="#00FFD2" />
        </linearGradient>
      </defs>
      {/* Two capsules forming an A — left leg + right leg, no crossbar.
          A simplified, brand-feel device-holding shape. */}
      <g>
        <rect x="14" y="10" width="22" height="110" rx="11"
              transform="rotate(-12 25 65)" fill="url(#ga-a-grad)" />
        <rect x="64" y="10" width="22" height="110" rx="11"
              transform="rotate(12 75 65)" fill="url(#ga-a-grad)" />
      </g>
    </svg>
  );
};

/* Tiny A-mark watermark used as bottom-left flourish */
const BrandmarkWatermark = ({ x, y, size = 320, opacity = 0.05, color = "#1432FF" }) => (
  <svg viewBox="0 0 100 130"
       style={{ position: "absolute", left: x, top: y, width: size, height: size * 1.3, opacity, pointerEvents: "none" }}
       aria-hidden="true">
    <g fill={color}>
      <rect x="14" y="10" width="22" height="110" rx="11" transform="rotate(-12 25 65)" />
      <rect x="64" y="10" width="22" height="110" rx="11" transform="rotate(12 75 65)" />
    </g>
  </svg>
);

/* keyframes injected once per render — duplicate styles are deduped by browser */
const Keyframes = () => (
  <style>{`
    @keyframes ga-float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(-10px) rotate(0.6deg); }
    }
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
  `}</style>
);

/* expose for the canvas page */
Object.assign(window, { GAClassic, GAEditorial, GASpotlight, GA_FEATURES });
