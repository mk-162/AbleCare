# GripAble Sensor Banner — experimental

An interactive product banner that rotates the GripAble device through 21 frames with 7 callout features that appear at the rotation angles where they're visible.

> **Status:** Experimental / in testing. Lives off-`main` while we iterate. Not yet wired into the AbleCare site.

## What's in here

| Path | Purpose |
|------|---------|
| [`gripable-rotate.jsx`](./gripable-rotate.jsx) | The React component (calibrated `F_KEYS` per frame) |
| [`preview.html`](./preview.html) | Standalone preview — open via static server |
| [`colors_and_type.css`](./colors_and_type.css) | Brand tokens (Able Care colors / DM Sans) |
| [`calibrate.html`](./calibrate.html) | Internal calibration tool — click to place dots per frame |
| [`assets/rotate/01.png` … `21.png`](./assets/rotate/) | Pre-rendered rotation frames (600×779) |
| [`handoff/`](./handoff/) | **Clean bundle for sharing with design agents** — same component + assets, no internal tooling |
| [`calibrations/`](./calibrations/) | History of calibration JSON exports |
| `gripable-features.jsx`, `gripable-rotate-mobile.jsx`, `design-canvas.jsx`, `ios-frame.jsx` | Adjacent experiments (not part of the banner) |

## Run it locally

```sh
cd experiments/gripable-banner
python -m http.server 4567   # or: npx serve -p 4567
```

Then open `http://localhost:4567/preview.html`.

To calibrate dots: open `http://localhost:4567/calibrate.html`.

## Render rule

A feature's dot + line shows on a frame **iff** `F.pos[frame]` is defined in `F_KEYS`. There is no interpolation fallback and no visibility curve — if the frame doesn't have an explicit key, the feature is hidden on that frame. To move a dot, change its `{ x, y }`. To hide it, delete the key.

See [`handoff/README.md`](./handoff/README.md) for the design-agent-facing version of these notes.
