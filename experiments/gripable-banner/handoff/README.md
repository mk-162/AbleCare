# GripAble Sensor Banner

An interactive product banner showing the GripAble device rotating through 21 frames, with 7 callout features that appear at the rotation angles where they're visible.

## What's in here

```
.
├── preview.html             ← Open this to see it run
├── gripable-rotate.jsx      ← The React component
├── colors_and_type.css      ← Brand tokens (Able Care colors / DM Sans)
└── assets/
    ├── rotate/01.png … 21.png    ← Pre-rendered rotation frames (600×779)
    └── able-care-logo.svg
```

## How to run it

The component uses standalone Babel + React via CDN, so any static server works.

From this folder:

```sh
python -m http.server 4567
# or
npx serve -p 4567
```

Then open `http://localhost:4567/preview.html`. A toolbar at the top lets you switch banner sizes (1280×880 default).

You can drag or hover over the device to rotate. Click a feature card to enter "tour mode" — it snaps the rotation to that feature's `bestFrame` and dims the others.

## How the calibration works

Every feature's dot/line position is keyed per frame in `F_KEYS` inside [gripable-rotate.jsx](./gripable-rotate.jsx).

```js
F_KEYS[2].pos = {
  0:  { x: 356, y: 176 },   // frame 0: dot here
  1:  { x: 362, y: 176 },
  // ...frame index → {x, y} in 600×779 image coordinates
};
```

**Render rule:** a feature's dot + line shows on a frame **if and only if** `F.pos[frame]` is defined. There's no interpolation fallback and no visibility curve — if the frame doesn't have an explicit key, the feature is hidden on that frame. (`visKeys`, `visCurve`, `bestFrame` are vestigial except `bestFrame` which is still used by the click-to-tour animation.)

So to move a dot on a specific frame, change its x/y. To make a feature appear on a new frame, add a key. To hide it on a frame, remove the key.

## Coordinate system

- Each frame is 600 × 779 pixels.
- F_KEYS positions are in those same units.
- At runtime they're scaled to whatever device size the banner renders at (`SCALE = devW / 600`).

## Features

| # | Feature | Currently appears on frames |
|---|---------|------------------------------|
| 1 | Locking Button | 0–20 |
| 2 | Strap Hooks | 0–20 |
| 3 | Grip Plate | 0–12, 18–20 |
| 4 | Battery LED | 7–15 |
| 5 | Lanyard Hook | 11–17 |
| 6 | Charging Port | 9–18 |
| 7 | Connection LED | 7–17 |

## Layout notes

- **Cards** sit on left rail (1, 6, 7) and right rail (2, 3, 4, 5).
- **Lead-lines** terminate at the badge center; left-side cards use `flexDirection: row-reverse` so the badge sits on the device-facing edge.
- **No dots are drawn on the device** — the lines terminate at the feature itself. A small invisible click target sits over each feature so the device side stays clickable.
- **Responsive**: at widths below 1100px the device shrinks and cards drop to 200px wide.

## Brand

Colors and typography come from `colors_and_type.css`. The two main brand colors are:
- `--ac-blue` `#1432FF`
- `--ac-aqua` `#00FFD2`

The hero gradient `--ac-gradient-hero` is the banner background.
