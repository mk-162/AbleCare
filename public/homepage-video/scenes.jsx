// scenes.jsx — Able Care homepage video scenes, v2
// Brand-correct logo, gradient backgrounds, larger type, earlier sync.

const BLUE = '#1432FF';
const AQUA = '#00FFD2';
const DEEP = '#0B1FD4';
const INK  = '#191919';
const WHITE = '#FFFFFF';

// Brand gradient backgrounds
const HERO_GRADIENT  = 'linear-gradient(145deg, #0b1fd4 0%, #1432FF 45%, #0a2bc9 100%)';
const AQUA_GRADIENT  = 'linear-gradient(145deg, #00FFD2 0%, #00d9b8 60%, #00a896 100%)';
const LIGHT_GRADIENT = 'linear-gradient(145deg, #ffffff 0%, #eef1ff 100%)';
const DARK_GRADIENT  = 'linear-gradient(145deg, #0a0a1a 0%, #0b1fd4 100%)';

const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t) => {
  const c1 = 1.2, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const env = (t, start, end, inDur = 0.35, outDur = 0.4) => {
  if (t < start - 0.01 || t > end + 0.01) return 0;
  const local = t - start;
  const dur = end - start;
  if (local < inDur) return easeOut(cl(local / inDur));
  if (local > dur - outDur) return 1 - easeOut(cl((local - (dur - outDur)) / outDur));
  return 1;
};

const slideIn = (t, start, inDur = 0.45, from = 18) => {
  const local = t - start;
  if (local < 0) return from;
  if (local > inDur) return 0;
  return from * (1 - easeOut(cl(local / inDur)));
};

const kenBurns = (t, start, end, from = 1.0, to = 1.08) => {
  const dur = end - start;
  const p = cl((t - start) / dur);
  return from + (to - from) * p;
};

// Correct brand A-mark — from able-care-logo.svg
// Two strokes at angles forming an interlocking A; Aqua first stroke, White/Blue second.
const AMark = ({ size = 120, primaryColor = AQUA, secondaryColor = WHITE, style = {} }) => (
  <svg viewBox="0 0 754.46 540"
    width={size} height={size * 540/754.46}
    style={{ display: 'block', ...style }}>
    <path fill={primaryColor} d="M377.3,340.5l101.06,140.55l0.03,0.05c22.43,34.28,61.15,56.93,105.17,56.93c69.37,0,125.6-56.23,125.6-125.6c0-29.28-10.02-56.22-26.81-77.57l0-0.01L481.14,55.02C458.54,21.81,420.43,0,377.23,0c-43.58,0-81.97,22.19-104.49,55.89L171.61,196.53l-1.66,2.31c-6.5,9.89-10.29,21.72-10.29,34.43c0,24.08,13.55,44.98,33.44,55.51c7.46,3.95,15.81,6.44,24.67,7.09c1.55,0.11,3.11,0.19,4.68,0.19c21.29,0,40.1-10.59,51.46-26.79l71.07-98.84l0.46-0.65c11.46-15.27,29.71-25.16,50.27-25.16c34.68,0,62.8,28.12,62.8,62.8c0,12.67-3.76,24.45-10.22,34.32L377.3,340.5z"/>
    <path fill={secondaryColor} d="M271.72,487.33c-22.89,30.76-59.53,50.7-100.82,50.7c-69.37,0-125.6-56.23-125.6-125.6c0-29.47,10.15-56.56,27.14-77.98l97.51-135.6c-6.5,9.89-10.29,21.72-10.29,34.43c0,24.08,13.55,44.98,33.44,55.51c7.46,3.95,15.81,6.44,24.67,7.09c1.55,0.11,3.11,0.19,4.68,0.19c21.29,0,40.1-10.59,51.46-26.79l71.07-98.84l0.46-0.65c11.46-15.27,29.71-25.16,50.27-25.16c34.68,0,62.8,28.12,62.8,62.8c0,12.67-3.76,24.45-10.22,34.32L271.72,487.33"/>
  </svg>
);

// Oversized watermark of the correct A mark
const Watermark = ({ opacity = 0.06, color = WHITE, size = 1100, x = -180, y = -120 }) => (
  <div style={{
    position: 'absolute', left: x, bottom: y,
    opacity, pointerEvents: 'none',
  }}>
    <AMark size={size} primaryColor={color} secondaryColor={color}/>
  </div>
);

const sceneStyle = (bg) => ({
  position: 'absolute', inset: 0,
  background: bg,
  overflow: 'hidden',
});

const eyebrowStyle = (color = AQUA) => ({
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color,
});

// ────────────────────────────────────────────────────────────────────────────
// Scene 1 — Warm opening (0 → 6.4s)
// "Good care keeps people strong, steady, and independent for longer."
// ────────────────────────────────────────────────────────────────────────────
function Scene1({ t }) {
  const start = 0, end = 6.4;
  // Scene 1 is always visible at t=0 (paused still frame) — no entry fade.
  const alpha = t <= 0 ? 1 : env(t, start, end, 0.01, 0.7);
  if (alpha <= 0) return null;
  const scale = kenBurns(t, start, end, 1.04, 1.14);
  // First phrase + eyebrow visible at t=0 so paused poster frame has content.
  const phrase1 = t <= 0 ? 1 : env(t, 0.0, end, 0.4, 0.7);
  const phrase2 = env(t, 1.7,  end, 0.4, 0.7);
  const phrase3 = env(t, 3.3,  end, 0.4, 0.7);

  return (
    <div style={{ ...sceneStyle(HERO_GRADIENT), opacity: alpha }}>
      <Watermark opacity={0.07} color={AQUA} size={1200}/>

      {/* Photo — bleeding right, on clipped panel */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '58%',
        overflow: 'hidden',
        clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0 100%)',
      }}>
        <img src="assets/elderly-man.jpg" alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: '35% center',
            transform: `scale(${scale})`, transformOrigin: 'center',
          }}/>
        {/* soft blue wash edge */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(20,50,255,0.45) 0%, rgba(20,50,255,0) 28%)',
        }}/>
      </div>

      {/* Type */}
      <div style={{
        position: 'absolute', left: 80, top: 0, bottom: 0,
        width: '52%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{
          ...eyebrowStyle(AQUA),
          opacity: t <= 0 ? 1 : env(t, 0.0, end, 0.35, 0.7),
          transform: `translateY(${slideIn(t, 0.0, 0.4, 8)}px)`,
          marginBottom: 34,
        }}>Falls Prevention</div>

        <h1 style={{
          fontSize: 120, fontWeight: 700,
          lineHeight: 0.98, letterSpacing: '-0.035em',
          color: WHITE, margin: 0, textWrap: 'balance', maxWidth: '100%',
        }}>
          <span style={{ display: 'block', opacity: phrase1,
            transform: `translateY(${slideIn(t, 0.0, 0.5, 20)}px)` }}>Strong.</span>
          <span style={{ display: 'block', opacity: phrase2,
            transform: `translateY(${slideIn(t, 1.7, 0.5, 20)}px)`,
            color: AQUA }}>Steady.</span>
          <span style={{ display: 'block', opacity: phrase3,
            transform: `translateY(${slideIn(t, 3.3, 0.5, 20)}px)` }}>Independent.</span>
        </h1>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Scene 2 — The stat (6.2 → 14.9s)
// "But 1 in 4 adults over 65 falls each year. Most risk is missed..."
// ────────────────────────────────────────────────────────────────────────────
function Scene2({ t }) {
  const start = 6.2, end = 14.9;
  const alpha = env(t, start, end, 0.45, 0.55);
  if (alpha <= 0) return null;

  const numProgress = cl((t - (start + 0.2)) / 0.8);
  const numVal = Math.round(1 + numProgress * 3);

  const eyebrowOp = env(t, start + 0.0, end, 0.35, 0.5);
  const statOp    = env(t, start + 0.2, end, 0.5, 0.5);
  const lineOp    = env(t, start + 1.8, end, 0.5, 0.5);
  const sub1Op    = env(t, start + 2.2, end, 0.5, 0.5);
  const sub2Op    = env(t, start + 4.2, end, 0.5, 0.5);
  const statScale = 0.95 + 0.05 * easeOutBack(cl((t - (start + 0.2)) / 0.7));

  return (
    <div style={{ ...sceneStyle(HERO_GRADIENT), opacity: alpha }}>
      {/* aqua radial glow */}
      <div style={{
        position: 'absolute', top: -500, right: -500,
        width: 1200, height: 1200,
        background: `radial-gradient(circle, ${AQUA}33 0%, transparent 60%)`,
      }}/>
      <Watermark opacity={0.06} color={AQUA} size={1000} x={-200} y={-150}/>

      <div style={{
        position: 'absolute', inset: 0,
        padding: '90px 80px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{
          ...eyebrowStyle(AQUA),
          opacity: eyebrowOp,
          transform: `translateY(${slideIn(t, start, 0.4, 10)}px)`,
        }}>The Problem</div>

        <div style={{
          display: 'flex', flexDirection: 'column',
          opacity: statOp,
          transform: `scale(${statScale})`,
          transformOrigin: 'left center',
        }}>
          <div style={{
            fontSize: 56, fontWeight: 400, color: WHITE,
            marginBottom: -20, letterSpacing: '-0.02em',
          }}>1 in</div>
          <div style={{
            fontSize: 580, fontWeight: 700,
            color: AQUA, lineHeight: 0.82,
            letterSpacing: '-0.07em',
            fontVariantNumeric: 'tabular-nums',
          }}>{numVal}</div>
          <div style={{
            fontSize: 46, fontWeight: 500, color: WHITE, opacity: 0.95,
            marginTop: -10, maxWidth: 820, lineHeight: 1.15,
            letterSpacing: '-0.015em',
          }}>adults over 65 falls each year.</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
          <div style={{
            height: 3, background: AQUA, width: 80,
            opacity: lineOp,
            transform: `scaleX(${lineOp})`, transformOrigin: 'left',
          }}/>
          <div style={{
            fontSize: 36, fontWeight: 400, color: WHITE, lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}>
            <span style={{ display: 'inline-block', opacity: sub1Op,
              transform: `translateY(${slideIn(t, start + 2.2, 0.5, 12)}px)` }}>
              Most of that risk is missed — </span>
            <span style={{ display: 'inline-block', opacity: sub2Op,
              transform: `translateY(${slideIn(t, start + 4.2, 0.5, 12)}px)`,
              fontWeight: 700, color: AQUA }}>
              because screening only comes after the first fall.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Scene 3 — Platform intro (14.7 → 19.8s)
// "Able Care is a technology platform built to measure it."
// ────────────────────────────────────────────────────────────────────────────
function Scene3({ t }) {
  const start = 14.7, end = 19.8;
  const alpha = env(t, start, end, 0.5, 0.55);
  if (alpha <= 0) return null;

  const eyebrowOp = env(t, start + 0.0, end, 0.4, 0.5);
  const headlineOp = env(t, start + 0.2, end, 0.5, 0.5);
  const sensorOp = env(t, start + 0.3, end, 0.6, 0.5);
  const sensorY = slideIn(t, start + 0.3, 1.0, 40);
  const drift = (t - start) * 10;

  return (
    <div style={{ ...sceneStyle(LIGHT_GRADIENT), opacity: alpha }}>
      {/* Gradient column behind sensor */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '52%',
        background: HERO_GRADIENT,
        clipPath: 'polygon(16% 0, 100% 0, 100% 100%, 0 100%)',
      }}/>

      {/* watermark INSIDE the gradient column */}
      <div style={{
        position: 'absolute', right: -220, bottom: -180,
        opacity: 0.08, pointerEvents: 'none',
      }}>
        <AMark size={900} primaryColor={AQUA} secondaryColor={AQUA}/>
      </div>

      {/* sensor */}
      <div style={{
        position: 'absolute',
        right: '6%', top: '50%',
        transform: `translate(0, calc(-50% + ${sensorY}px + ${Math.sin(drift * 0.02) * 10}px))`,
        opacity: sensorOp, width: 560,
      }}>
        <img src="assets/sensor-cutout.png" alt=""
          style={{
            width: '100%', height: 'auto',
            filter: 'drop-shadow(0 40px 50px rgba(0,0,0,0.3))',
            transform: 'rotate(-8deg)',
          }}/>
      </div>

      {/* Type on left */}
      <div style={{
        position: 'absolute', left: 80, top: 0, bottom: 0,
        width: '55%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{
          ...eyebrowStyle(BLUE),
          opacity: eyebrowOp,
          transform: `translateY(${slideIn(t, start, 0.4, 10)}px)`,
          marginBottom: 28,
        }}>The Platform</div>

        <h2 style={{
          fontSize: 108, fontWeight: 700,
          lineHeight: 0.94, letterSpacing: '-0.035em',
          color: INK, margin: 0, textWrap: 'balance',
          opacity: headlineOp,
          transform: `translateY(${slideIn(t, start + 0.2, 0.5, 20)}px)`,
        }}>
          Built to <span style={{ color: BLUE }}>measure</span> it.
        </h2>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Scene 4 — Sensor & Imperial (19.6 → 28.8s)
// "At the heart is a precision sensor... 15 years Imperial College...
//  10× more accurate than legacy tools."
// ────────────────────────────────────────────────────────────────────────────
function Scene4({ t }) {
  const start = 19.6, end = 28.8;
  const alpha = env(t, start, end, 0.5, 0.6);
  if (alpha <= 0) return null;

  const scale = kenBurns(t, start, end, 1.04, 1.16);
  const eyeOp = env(t, start + 0.05, end, 0.4, 0.5);
  const h1Op = env(t, start + 0.2, end, 0.55, 0.5);
  const stat1Op = env(t, start + 2.6, end, 0.5, 0.5);
  const stat2Op = env(t, start + 4.5, end, 0.5, 0.5);
  const ten = Math.round(cl((t - (start + 4.5)) / 1.0) * 10);

  return (
    <div style={{ ...sceneStyle('#0a0a0a'), opacity: alpha }}>
      <img src="assets/hand-use.jpg" alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: '50% 40%',
          transform: `scale(${scale})`, transformOrigin: '60% 50%',
        }}/>
      {/* Heavy blue wash for contrast */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(11,31,212,0.75) 0%, rgba(11,31,212,0.3) 40%, rgba(0,0,0,0.8) 100%)',
      }}/>

      <Watermark opacity={0.06} color={AQUA} size={1000} x={-180} y={-150}/>

      <div style={{
        position: 'absolute', top: 80, left: 80, right: 80, color: WHITE,
      }}>
        <div style={{
          ...eyebrowStyle(AQUA),
          opacity: eyeOp,
          transform: `translateY(${slideIn(t, start + 0.05, 0.4, 10)}px)`,
          marginBottom: 28,
        }}>Evidence-led</div>
        <h2 style={{
          fontSize: 86, fontWeight: 700,
          lineHeight: 0.96, letterSpacing: '-0.03em',
          margin: 0, maxWidth: 920,
          opacity: h1Op,
          transform: `translateY(${slideIn(t, start + 0.2, 0.5, 20)}px)`,
          textWrap: 'balance',
        }}>
          A precision sensor, 15 years in the making.
        </h2>
      </div>

      <div style={{
        position: 'absolute', left: 80, bottom: 90, right: 80,
        display: 'flex', gap: 36, alignItems: 'flex-end', flexWrap: 'wrap',
      }}>
        <div style={{
          opacity: stat1Op,
          transform: `translateY(${slideIn(t, start + 2.6, 0.5, 14)}px)`,
          paddingRight: 36,
          borderRight: `1px solid rgba(255,255,255,0.28)`,
        }}>
          <div style={{
            fontSize: 18, fontWeight: 700, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: AQUA, marginBottom: 14,
          }}>Origin</div>
          <div style={{ fontSize: 44, fontWeight: 500, color: WHITE, lineHeight: 1.05,
            letterSpacing: '-0.02em' }}>
            Imperial College<br/>London
          </div>
        </div>
        <div style={{
          opacity: stat2Op,
          transform: `translateY(${slideIn(t, start + 4.5, 0.5, 14)}px)`,
        }}>
          <div style={{
            fontSize: 18, fontWeight: 700, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: AQUA, marginBottom: 8,
          }}>Accuracy</div>
          <div style={{
            fontSize: 140, fontWeight: 700, color: WHITE,
            lineHeight: 0.9, letterSpacing: '-0.05em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {ten}×
          </div>
          <div style={{
            fontSize: 28, fontWeight: 400, color: AQUA,
            marginTop: 10, letterSpacing: '-0.005em',
          }}>
            more accurate than legacy tools
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Scene 5 — Biomarker (28.6 → 38.4s)
// "Grip strength is one of the most powerful biomarkers... biological age,
//  frailty, muscle and bone health, and balance. A weakening grip..."
// ────────────────────────────────────────────────────────────────────────────
function Scene5({ t }) {
  const start = 28.6, end = 38.4;
  const alpha = env(t, start, end, 0.5, 0.5);
  if (alpha <= 0) return null;

  const scale = kenBurns(t, start, end, 1.05, 1.14);
  const eyeOp = env(t, start + 0.05, end, 0.4, 0.5);
  const headOp = env(t, start + 0.2, end, 0.55, 0.5);

  const tags = [
    { label: 'Biological age', start: 1.8 },
    { label: 'Frailty',         start: 2.5 },
    { label: 'Muscle & bone',   start: 3.2 },
    { label: 'Balance',         start: 4.0 },
  ];

  const warnOp = env(t, start + 6.0, end, 0.5, 0.5);

  return (
    <div style={{ ...sceneStyle(LIGHT_GRADIENT), opacity: alpha }}>
      {/* Photo bleeding right on clipped panel */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '54%',
        overflow: 'hidden',
        clipPath: 'polygon(16% 0, 100% 0, 100% 100%, 0 100%)',
      }}>
        <img src="assets/lady-holding.jpg" alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: '45% center',
            transform: `scale(${scale})`,
          }}/>
      </div>

      <div style={{
        position: 'absolute', left: 80, top: 80, bottom: 80,
        width: '50%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        gap: 32,
      }}>
        <div style={{
          ...eyebrowStyle(BLUE),
          opacity: eyeOp,
          transform: `translateY(${slideIn(t, start + 0.05, 0.4, 10)}px)`,
        }}>The Biomarker</div>

        <h2 style={{
          fontSize: 76, fontWeight: 700,
          lineHeight: 0.98, letterSpacing: '-0.03em',
          color: INK, margin: 0, textWrap: 'balance', maxWidth: '100%',
          opacity: headOp,
          transform: `translateY(${slideIn(t, start + 0.2, 0.5, 20)}px)`,
        }}>
          Grip strength tracks what matters.
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 4 }}>
          {tags.map((tag) => {
            const tagOp = env(t, start + tag.start, end, 0.3, 0.5);
            return (
              <div key={tag.label} style={{
                padding: '14px 26px',
                background: WHITE,
                border: `1px solid rgba(0,0,0,0.06)`,
                borderRadius: 9999,
                fontSize: 24, fontWeight: 500, color: INK,
                letterSpacing: '-0.005em',
                opacity: tagOp,
                transform: `translateY(${slideIn(t, start + tag.start, 0.4, 12)}px) scale(${0.96 + 0.04 * tagOp})`,
              }}>{tag.label}</div>
            );
          })}
        </div>

        <div style={{
          marginTop: 12,
          padding: '28px 32px',
          background: HERO_GRADIENT, borderRadius: 20,
          color: WHITE,
          fontSize: 28, fontWeight: 400, lineHeight: 1.3,
          letterSpacing: '-0.01em',
          opacity: warnOp,
          transform: `translateX(${slideIn(t, start + 6.0, 0.5, -20)}px)`,
          maxWidth: '100%',
          boxShadow: '0 20px 50px rgba(11,31,212,0.25)',
        }}>
          <span style={{ color: AQUA, fontWeight: 700 }}>A weakening grip</span>{' '}
          is often the earliest warning a fall is coming.
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Scene 6 — Four metrics, 5 min (38.2 → 48.8s)
// "Our software combines grip with three more validated measurements.
//  Chair stand. Gait speed. Timed Up and Go. One screening. Five minutes.
//  Delivered by any staff, clinical or not."
// ────────────────────────────────────────────────────────────────────────────
function Scene6({ t }) {
  const start = 38.2, end = 48.8;
  const alpha = env(t, start, end, 0.5, 0.5);
  if (alpha <= 0) return null;

  const eyeOp = env(t, start + 0.0, end, 0.35, 0.5);
  const headOp = env(t, start + 0.2, end, 0.5, 0.5);

  const metrics = [
    { label: 'Grip strength',  start: 1.0 },
    { label: 'Chair stand',    start: 1.9 },
    { label: 'Gait speed',     start: 2.6 },
    { label: 'Timed Up & Go',  start: 3.3 },
  ];

  const minOp = env(t, start + 4.4, end, 0.5, 0.5);
  const minScale = 0.92 + 0.08 * easeOutBack(cl((t - (start + 4.4)) / 0.7));
  const staffOp = env(t, start + 6.2, end, 0.5, 0.5);

  return (
    <div style={{ ...sceneStyle(WHITE), opacity: alpha }}>
      {/* Left column gradient */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '44%', background: HERO_GRADIENT,
      }}/>

      <Watermark opacity={0.06} color={AQUA} size={900} x={-200} y={-150}/>

      {/* Left side: metrics list */}
      <div style={{
        position: 'absolute', left: 72, top: 80, width: 'calc(44% - 144px)',
        bottom: 80,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            ...eyebrowStyle(AQUA),
            opacity: eyeOp, marginBottom: 22,
          }}>The Screening</div>
          <h2 style={{
            fontSize: 62, fontWeight: 700,
            lineHeight: 0.98, letterSpacing: '-0.03em',
            color: WHITE, margin: 0, textWrap: 'balance',
            opacity: headOp,
            transform: `translateY(${slideIn(t, start + 0.2, 0.5, 18)}px)`,
          }}>
            Four validated measurements.
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {metrics.map((m, i) => {
            const op = env(t, start + m.start, end, 0.3, 0.5);
            return (
              <div key={m.label} style={{
                display: 'flex', alignItems: 'baseline', gap: 22,
                opacity: op,
                transform: `translateX(${slideIn(t, start + m.start, 0.4, -22)}px)`,
              }}>
                <span style={{
                  fontSize: 22, fontWeight: 700, color: AQUA,
                  fontVariantNumeric: 'tabular-nums', minWidth: 42,
                }}>0{i+1}</span>
                <span style={{
                  fontSize: 42, fontWeight: 500, color: WHITE,
                  letterSpacing: '-0.02em',
                }}>{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side — big "5 MIN" */}
      <div style={{
        position: 'absolute', left: '44%', right: 0, top: 0, bottom: 0,
        padding: '90px 70px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{
          opacity: minOp,
          transform: `scale(${minScale})`, transformOrigin: 'left center',
        }}>
          <div style={{
            fontSize: 24, fontWeight: 700, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: BLUE, marginBottom: 22,
          }}>One screening</div>
          <div style={{
            fontSize: 440, fontWeight: 700, lineHeight: 0.82,
            color: INK, letterSpacing: '-0.07em',
            fontVariantNumeric: 'tabular-nums',
            display: 'flex', alignItems: 'flex-start', gap: 0,
            background: HERO_GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            5
            <span style={{
              fontSize: 72, fontWeight: 700,
              WebkitTextFillColor: BLUE,
              marginTop: 48, marginLeft: 16, letterSpacing: '-0.01em',
            }}>min</span>
          </div>
        </div>

        <div style={{
          opacity: staffOp,
          transform: `translateY(${slideIn(t, start + 6.2, 0.5, 16)}px)`,
          fontSize: 30, fontWeight: 400, color: INK, lineHeight: 1.25,
          maxWidth: 500, paddingLeft: 24,
          letterSpacing: '-0.01em',
          borderLeft: `4px solid ${BLUE}`,
        }}>
          Delivered by <span style={{ fontWeight: 700 }}>any staff member</span> —
          clinical or not.
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Scene 7 — Dashboard (48.6 → 52.9s)
// "Results land in a simple dashboard, so your team can act early."
// ────────────────────────────────────────────────────────────────────────────
function Scene7({ t }) {
  const start = 48.6, end = 52.9;
  const alpha = env(t, start, end, 0.45, 0.45);
  if (alpha <= 0) return null;

  const eyeOp = env(t, start + 0.0, end, 0.3, 0.45);
  const headOp = env(t, start + 0.15, end, 0.45, 0.45);
  const cardOp = env(t, start + 0.3, end, 0.55, 0.45);
  const cardY = slideIn(t, start + 0.3, 0.7, 30);

  return (
    <div style={{ ...sceneStyle(HERO_GRADIENT), opacity: alpha }}>
      <Watermark opacity={0.07} color={AQUA} size={1000} x={-200} y={-150}/>

      <div style={{ position: 'absolute', top: 60, left: 80, right: 80 }}>
        <div style={{
          ...eyebrowStyle(AQUA),
          opacity: eyeOp, marginBottom: 16,
        }}>The Dashboard</div>
        <h2 style={{
          fontSize: 62, fontWeight: 700,
          lineHeight: 0.98, letterSpacing: '-0.03em',
          color: WHITE, margin: 0, maxWidth: 920,
          opacity: headOp,
          transform: `translateY(${slideIn(t, start + 0.15, 0.45, 16)}px)`,
        }}>
          Results that let your team act early.
        </h2>
      </div>

      <div style={{
        position: 'absolute',
        left: 80, right: 80, bottom: 50, height: 680,
        background: WHITE, borderRadius: 24,
        boxShadow: '0 40px 80px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        opacity: cardOp,
        transform: `translateY(${cardY}px)`,
        display: 'flex',
      }}>
        <div style={{
          width: 260, background: '#f7f7f9', padding: '32px 24px',
          borderRight: '1px solid rgba(0,0,0,0.06)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36,
          }}>
            <AMark size={28} primaryColor={AQUA} secondaryColor={BLUE}/>
            <span style={{ fontSize: 18, fontWeight: 700, color: BLUE, letterSpacing: '0.08em' }}>ABLE CARE</span>
          </div>
          {['Residents', 'Screenings', 'Risk trends', 'Reports'].map((x, i) => (
            <div key={x} style={{
              padding: '12px 14px',
              fontSize: 15, fontWeight: i === 1 ? 700 : 400,
              color: i === 1 ? BLUE : 'rgba(25,25,25,0.65)',
              background: i === 1 ? 'rgba(20,50,255,0.08)' : 'transparent',
              borderRadius: 10, marginBottom: 2,
            }}>{x}</div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '32px 36px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 26,
          }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: INK, letterSpacing: '-0.02em' }}>
              Screenings this week
            </div>
            <div style={{ fontSize: 14, color: 'rgba(25,25,25,0.55)', fontWeight: 500 }}>Updated 2 min ago</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 26 }}>
            {[
              { n: '142', l: 'Completed', c: INK },
              { n: '18',  l: 'At risk',    c: BLUE },
              { n: '4',   l: 'High risk',  c: '#D13B3B' },
            ].map(s => (
              <div key={s.l} style={{
                padding: '22px 24px',
                background: '#f7f7f9', borderRadius: 16,
              }}>
                <div style={{ fontSize: 52, fontWeight: 700, color: s.c, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'rgba(25,25,25,0.6)', marginTop: 10 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div style={{
            height: 330, background: '#f7f7f9', borderRadius: 16,
            padding: '26px 26px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(25,25,25,0.65)', marginBottom: 12 }}>Grip strength · trailing 30 days</div>
            <svg viewBox="0 0 500 200" style={{ width: '100%', height: 240 }}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BLUE} stopOpacity="0.25"/>
                  <stop offset="100%" stopColor={BLUE} stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map(i => (
                <line key={i} x1="0" x2="500" y1={40 + i*40} y2={40 + i*40}
                  stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
              ))}
              <path d="M0,130 C50,120 80,100 120,90 C170,80 210,85 260,70 C310,55 350,60 400,45 C440,35 480,40 500,30 L500,200 L0,200 Z"
                fill="url(#fill)"/>
              <path d="M0,130 C50,120 80,100 120,90 C170,80 210,85 260,70 C310,55 350,60 400,45 C440,35 480,40 500,30"
                fill="none" stroke={BLUE} strokeWidth="3.5" strokeLinecap="round"/>
              <circle cx="400" cy="45" r="7" fill={WHITE} stroke={BLUE} strokeWidth="3.5"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Scene 8 — Credentials (52.7 → 56.4s)
// ────────────────────────────────────────────────────────────────────────────
function Scene8({ t }) {
  const start = 52.7, end = 56.4;
  const alpha = env(t, start, end, 0.4, 0.4);
  if (alpha <= 0) return null;

  const eyeOp = env(t, start, end, 0.3, 0.4);
  const headOp = env(t, start + 0.15, end, 0.4, 0.4);

  const creds = [
    { label: 'CDC STEADI', start: 0.5 },
    { label: '2022 WORLD GUIDELINES', start: 0.95 },
    { label: 'FDA REGISTERED', start: 1.4 },
    { label: 'HIPAA COMPLIANT', start: 1.85 },
  ];

  return (
    <div style={{ ...sceneStyle(AQUA_GRADIENT), opacity: alpha }}>
      <Watermark opacity={0.08} color={BLUE} size={1000} x={-200} y={-150}/>

      <div style={{
        position: 'absolute', inset: 0,
        padding: '80px 80px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        gap: 40,
      }}>
        <div style={{
          ...eyebrowStyle(BLUE),
          opacity: eyeOp,
        }}>Trusted</div>
        <h2 style={{
          fontSize: 76, fontWeight: 700,
          lineHeight: 0.96, letterSpacing: '-0.03em',
          color: INK, margin: 0, maxWidth: 1000,
          opacity: headOp,
          transform: `translateY(${slideIn(t, start + 0.15, 0.4, 16)}px)`,
          textWrap: 'balance',
        }}>
          Clinically aligned.<br/>Independently verified.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 12 }}>
          {creds.map((c) => {
            const op = env(t, start + c.start, end, 0.25, 0.4);
            return (
              <div key={c.label} style={{
                display: 'flex', alignItems: 'center', gap: 22,
                opacity: op,
                transform: `translateX(${slideIn(t, start + c.start, 0.35, -18)}px)`,
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 23,
                  background: BLUE,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3 3 7-7" stroke={AQUA} strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{
                  fontSize: 36, fontWeight: 700, color: INK,
                  letterSpacing: '0.04em',
                }}>{c.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Scene 9 — End card (56.2 → end)
// ────────────────────────────────────────────────────────────────────────────
function Scene9({ t, total }) {
  const start = 57.0, end = total;
  const alpha = env(t, start, end, 0.55, 0.0);
  if (alpha <= 0) return null;

  const logoOp = env(t, start + 0.1, end, 0.55, 0);
  const logoY = slideIn(t, start + 0.1, 0.6, 14);
  const taglineOp = env(t, start + 0.7, end, 0.5, 0);
  const lineScale = cl((t - (start + 0.5)) / 0.6);

  return (
    <div style={{ ...sceneStyle(HERO_GRADIENT), opacity: alpha }}>
      <div style={{
        position: 'absolute', top: -400, right: -400,
        width: 1100, height: 1100,
        background: `radial-gradient(circle, ${AQUA}33 0%, transparent 60%)`,
      }}/>
      <div style={{
        position: 'absolute', bottom: -500, left: -500,
        width: 1100, height: 1100,
        background: `radial-gradient(circle, #ffffff20 0%, transparent 60%)`,
      }}/>
      <Watermark opacity={0.07} color={AQUA} size={900} x={-180} y={-150}/>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 36,
      }}>
        <div style={{
          opacity: logoOp,
          transform: `translateY(${logoY}px)`,
          display: 'flex', alignItems: 'center', gap: 24,
        }}>
          <AMark size={120} primaryColor={AQUA} secondaryColor={WHITE}/>
          <div style={{
            fontSize: 104, fontWeight: 700, color: WHITE,
            letterSpacing: '-0.04em', lineHeight: 1,
          }}>Able Care</div>
        </div>

        <div style={{
          width: 160 * lineScale, height: 4, background: AQUA,
          transformOrigin: 'center', opacity: lineScale,
        }}/>

        <div style={{
          fontSize: 42, fontWeight: 400, color: WHITE,
          letterSpacing: '-0.015em',
          opacity: taglineOp,
          transform: `translateY(${slideIn(t, start + 0.7, 0.5, 12)}px)`,
          textAlign: 'center',
        }}>
          Enabling intelligent health.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  AbleScenes: {
    Scene1, Scene2, Scene3, Scene4, Scene5,
    Scene6, Scene7, Scene8, Scene9,
  },
});
