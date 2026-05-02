/* GripAble — mobile equivalent of the rotation viewer.
   Mobile interaction: swipe horizontally on the device to rotate. As the
   device rotates, the feature carousel auto-scrolls to whichever feature
   is most visible at that angle. Swiping the carousel rotates the device.
   The two views are bound to a single source of truth (the frame index).
*/

const GAClassicMobile = ({ width = 390, height = 844 }) => {
  const FRAME_COUNT = FRAMES.length;
  const [frame, setFrame] = React.useState(2);
  const [active, setActive] = React.useState(1);
  const [hint, setHint] = React.useState(true);
  const targetFrame = React.useRef(2);
  const rafRef = React.useRef(null);
  const cardScrollRef = React.useRef(null);
  const isProgrammaticScroll = React.useRef(false);
  const programmaticScrollTimer = React.useRef(null);

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

  // ─── Find which feature is "best" at a given frame ───
  const featureAtFrame = (f) => {
    let best = FEATURES[0].n;
    let bestScore = -1;
    for (const F of FEATURES) {
      const h = hotspotAt(F.n, f);
      // score = visibility, with a small bonus for being near the feature's bestFrame
      const distToBest = Math.abs(f - F.bestFrame);
      const score = h.vis * (1 - distToBest * 0.02);
      if (score > bestScore) {
        bestScore = score;
        best = F.n;
      }
    }
    return best;
  };

  // ─── Sync active feature + carousel scroll position when frame changes ───
  React.useEffect(() => {
    const n = featureAtFrame(frame);
    if (n !== active) {
      setActive(n);
      // Scroll the carousel to that card (programmatic, ignored by onScroll)
      const idx = FEATURES.findIndex((F) => F.n === n);
      if (cardScrollRef.current && idx >= 0) {
        const el = cardScrollRef.current;
        const cardW = 280 + 12;
        isProgrammaticScroll.current = true;
        el.scrollTo({ left: idx * cardW, behavior: "smooth" });
        clearTimeout(programmaticScrollTimer.current);
        programmaticScrollTimer.current = setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 500);
      }
    }
  }, [frame]);

  const onSelectFeature = (n) => {
    setActive(n);
    setHint(false);
    const F = F_KEYS[n];
    if (F) setTarget(F.bestFrame);
    const idx = FEATURES.findIndex((f) => f.n === n);
    if (cardScrollRef.current) {
      const el = cardScrollRef.current;
      const cardW = 280 + 12;
      isProgrammaticScroll.current = true;
      el.scrollTo({ left: idx * cardW, behavior: "smooth" });
      clearTimeout(programmaticScrollTimer.current);
      programmaticScrollTimer.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 500);
    }
  };

  // ─── Card scroll → rotate ───
  const onCardScroll = (e) => {
    if (isProgrammaticScroll.current) return; // ignore our own scroll
    const el = e.currentTarget;
    const cardW = 280 + 12;
    const idx = Math.round(el.scrollLeft / cardW);
    const n = FEATURES[Math.max(0, Math.min(FEATURES.length - 1, idx))]?.n;
    if (n && n !== active) {
      setActive(n);
      const F = F_KEYS[n];
      if (F) setTarget(F.bestFrame);
      setHint(false);
    }
  };

  // ─── Device swipe → rotate ───
  const drag = React.useRef({ active: false, startX: 0, startFrame: 0 });
  const onDevicePointerDown = (e) => {
    drag.current = { active: true, startX: e.clientX, startFrame: targetFrame.current };
    setHint(false);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onDevicePointerMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    // Mobile: 200px traverses all 21 frames (a bit more sensitive than desktop)
    const next = drag.current.startFrame + (dx / 200) * (FRAME_COUNT - 1);
    setTarget(next);
  };
  const onDevicePointerUp = (e) => {
    drag.current.active = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const frameInt = Math.round(frame);

  // Device size — larger to take up more of the screen
  const devW = Math.min(width - 80, 310);
  const devH = devW * (779 / 600);
  const devX = (width - devW) / 2;
  const devY = 100;
  const SCALE = devW / 600;

  // Hotspot positions in stage coordinates
  const hotspots = FEATURES.map((F) => {
    const h = hotspotAt(F.n, frame);
    return {
      n: F.n,
      sx: devX + h.x * SCALE,
      sy: devY + h.y * SCALE,
      vis: h.vis,
      hidden: h.vis < 0.05,
    };
  });

  const activeIdx = FEATURES.findIndex((f) => f.n === active);

  return (
    <div style={{
      width, height, position: "relative",
      background: "var(--ac-gradient-hero)",
      fontFamily: "var(--font-sans)", color: "#fff",
      overflow: "hidden",
      userSelect: "none",
    }}>
      {/* Atmospheric overlays */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(500px 360px at 90% 0%, rgba(0,255,210,0.22), transparent 60%), radial-gradient(500px 360px at 0% 100%, rgba(255,255,255,0.10), transparent 60%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      {/* Header */}
      <div style={{ padding: "28px 24px 0", textAlign: "center", position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--ac-aqua)", marginBottom: 8 }}>
          ABOUT GRIPABLE
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em", margin: 0, color: "#fff" }}>
          GripAble sensor features.
        </h2>
      </div>

      {/* Device — entire area is swipe-to-rotate */}
      <div
        onPointerDown={onDevicePointerDown}
        onPointerMove={onDevicePointerMove}
        onPointerUp={onDevicePointerUp}
        onPointerLeave={onDevicePointerUp}
        style={{
          position: "absolute",
          left: 0, right: 0, top: devY - 30,
          height: devH + 60,
          touchAction: "pan-y",
          cursor: drag.current.active ? "grabbing" : "grab",
        }}>
        <div style={{
          position: "absolute", left: devX, top: 30,
          width: devW, height: devH,
        }}>
          {FRAMES.map((src, i) => (
            <img key={i} src={src} alt="" aria-hidden={i !== frameInt}
                 draggable={false}
                 style={{
                   position: "absolute", inset: 0,
                   width: "100%", height: "100%",
                   objectFit: "contain",
                   opacity: i === frameInt ? 1 : 0,
                   transition: "opacity 60ms linear",
                   filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.18))",
                   pointerEvents: "none",
                 }} />
          ))}
          {/* aqua glow */}
          <div style={{
            position: "absolute", left: "50%", bottom: -4, transform: "translateX(-50%)",
            width: devW * 0.55, height: 14, borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(0,255,210,0.35) 0%, transparent 70%)",
            filter: "blur(8px)",
            pointerEvents: "none",
          }} />
        </div>
      </div>

      {/* Persistent rotate arrows — always visible affordance */}
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => { setHint(false); setTarget(targetFrame.current - 2); }}
        aria-label="Rotate left"
        style={{
          position: "absolute",
          left: 8, top: devY + devH / 2 - 22,
          width: 44, height: 44, borderRadius: 9999,
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
          color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", padding: 0,
          zIndex: 5,
        }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => { setHint(false); setTarget(targetFrame.current + 2); }}
        aria-label="Rotate right"
        style={{
          position: "absolute",
          right: 8, top: devY + devH / 2 - 22,
          width: 44, height: 44, borderRadius: 9999,
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
          color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", padding: 0,
          zIndex: 5,
        }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Frame progress bar */}
      <div style={{
        position: "absolute",
        left: "50%", top: devY + devH + 14, transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: 8,
        zIndex: 4,
      }}>
        <div style={{
          width: 120, height: 3, borderRadius: 9999,
          background: "rgba(255,255,255,0.18)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", left: 0, top: 0,
            height: "100%",
            width: `${(frame / (FRAME_COUNT - 1)) * 100}%`,
            background: "var(--ac-aqua)",
            borderRadius: 9999,
            transition: "width 120ms linear",
          }} />
        </div>
      </div>

      {/* Hotspot dots overlay (fixed-position children of stage, not the swipe area) */}
      {hotspots.map((h) => {
        if (h.hidden) return null;
        const isActive = active === h.n;
        return (
          <button
            key={h.n}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onSelectFeature(h.n); }}
            style={{
              position: "absolute",
              left: h.sx, top: h.sy,
              transform: "translate(-50%,-50%)",
              width: isActive ? 22 : 14, height: isActive ? 22 : 14,
              borderRadius: 9999,
              background: isActive ? "var(--ac-aqua)" : "rgba(255,255,255,0.95)",
              border: "2px solid var(--ac-blue)",
              boxShadow: isActive ? "0 0 0 4px rgba(0,255,210,0.35)" : "0 1px 4px rgba(0,0,0,0.2)",
              opacity: h.vis,
              cursor: "pointer",
              padding: 0,
              transition: "all 220ms cubic-bezier(0.16,1,0.3,1)",
              zIndex: 4,
            }}
            aria-label={`Feature ${h.n}: ${F_KEYS[h.n].label}`}
          >
            {isActive && (
              <span aria-hidden="true" style={{
                position: "absolute", inset: -4, borderRadius: 9999,
                border: "2px solid var(--ac-aqua)",
                animation: "ga-ring 1.6s ease-out infinite",
                pointerEvents: "none",
              }} />
            )}
          </button>
        );
      })}

      {/* Swipe hint chip — sits just under the progress bar */}
      {hint && (
        <div style={{
          position: "absolute",
          left: "50%", top: devY + devH + 30, transform: "translateX(-50%)",
          background: "rgba(20,50,255,0.95)", color: "#fff",
          padding: "6px 12px", borderRadius: 9999,
          fontSize: 10.5, fontWeight: 600, letterSpacing: "0.04em",
          display: "inline-flex", alignItems: "center", gap: 6,
          boxShadow: "0 4px 12px rgba(20,50,255,0.3)",
          animation: "ga-bob 2s ease-in-out infinite",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          zIndex: 5,
        }}>
          <RotateIconRot /> Swipe or tap arrows to rotate
        </div>
      )}

      {/* Feature carousel */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 24,
      }}>
        {/* Dot pagination above carousel */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12 }}>
          {FEATURES.map((F, i) => (
            <button key={F.n} onClick={() => onSelectFeature(F.n)} aria-label={F.label}
              style={{
                width: i === activeIdx ? 18 : 6, height: 6, borderRadius: 9999,
                background: i === activeIdx ? "var(--ac-aqua)" : "rgba(255,255,255,0.30)",
                border: "none", padding: 0, cursor: "pointer",
                transition: "all 240ms cubic-bezier(0.16,1,0.3,1)",
              }} />
          ))}
        </div>
        <div
          ref={cardScrollRef}
          onScroll={onCardScroll}
          style={{
            display: "flex", gap: 12, padding: "4px 16px 12px",
            overflowX: "auto", overflowY: "hidden",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}>
          {FEATURES.map((F) => {
            const isActive = active === F.n;
            return (
              <div key={F.n}
                   onClick={() => onSelectFeature(F.n)}
                   style={{
                     scrollSnapAlign: "start",
                     flex: "0 0 280px",
                     padding: "14px 16px",
                     background: isActive ? "#fff" : "rgba(255,255,255,0.12)",
                     backdropFilter: !isActive ? "blur(8px)" : "none",
                     WebkitBackdropFilter: !isActive ? "blur(8px)" : "none",
                     border: isActive ? "1px solid rgba(0,255,210,0.5)" : "1px solid rgba(255,255,255,0.18)",
                     borderRadius: 14,
                     boxShadow: isActive ? "0 10px 24px rgba(0,0,0,0.22)" : "none",
                     transition: "all 240ms",
                     cursor: "pointer",
                     minHeight: 110,
                   }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <BadgeRot n={F.n} active={isActive} scheme={isActive ? "light" : "blue"} onClick={(e) => { e.stopPropagation(); onSelectFeature(F.n); }} size={26} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: isActive ? "var(--ac-black)" : "#fff", marginBottom: 3 }}>
                      {F.label}
                    </div>
                    <div style={{ fontSize: 12.5, color: isActive ? "var(--ac-black)" : "rgba(255,255,255,0.85)", fontWeight: isActive ? 400 : 300, lineHeight: 1.45 }}>
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
        </div>
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

Object.assign(window, { GAClassicMobile });
