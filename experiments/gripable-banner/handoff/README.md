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

Every feature's anchor position is keyed per frame in `F_KEYS` inside [gripable-rotate.jsx](./gripable-rotate.jsx).

```js
F_KEYS[3].pos = {
  0:  { x: 356, y: 176 },   // frame 0: anchor here
  1:  { x: 362, y: 176 },
  // ...frame index → {x, y} in 600×779 image coordinates
};
```

**Render rule:** the leader line draws on any frame between a feature's first and last key (positions are linearly interpolated between keys). Outside that range the line is hidden but the **numbered badge stays parked** on the side rail at a stable Y based on the feature's `bestFrame`.

To move an anchor on a specific frame, change its x/y. To extend the visible range, add keys at the boundary frames. To hide a feature entirely, drop all its keys.

`bestFrame` controls two things: (a) the badge's resting Y position on the rail, and (b) which frame the device snaps to when the user clicks that feature's card.

## Coordinate system

- Each frame is 600 × 779 pixels.
- F_KEYS positions are in those same units.
- At runtime they're scaled to whatever device size the banner renders at (`SCALE = devW / 600`).

## Features

Numbered in left-to-right rotation order (cards highlight in this sequence as the device rotates):

| # | Feature | bestFrame | Anchor key range |
|---|---------|-----------|------------------|
| 1 | Grip Plate | 1 | 0–12, 18–20 |
| 2 | Locking Button | 4 | 0–20 |
| 3 | Strap Hooks | 7 | 0–20 |
| 4 | Battery LED | 10 | 7–15 |
| 5 | Lanyard Hook | 13 | 11–17 |
| 6 | Charging Port | 16 | 9–18 |
| 7 | Connection LED | 17 | 7–17 |

## Layout notes

- **Three responsive layouts** driven by `ResizeObserver`:
  - **Desktop** (≥1100px): 3-column grid — left rail (cards 1–4) · device · right rail (cards 5–7).
  - **Tablet** (700–1099px): device on top, 2-column card grid below.
  - **Mobile** (<700px): device on top, single active card with a chevron + dot carousel.
- **Numbered badges** are parked on the outer rails (4% / 96% of stage width) using each feature's `bestFrame` Y as their stable position. The leader line stretches from the badge to the live device-side anchor for the current frame.
- **Auto-cycle highlight**: as the device rotates, the closest feature (by `bestFrame`) is auto-highlighted, so cards 1→7 light up in order.
- **Click-mode**: clicking a card snaps the device to that feature's `bestFrame` and shows only that feature's line. Drag, hover, or arrow-key rotation exits click-mode.
- **No dots painted on the device** — only a small tick at the device-side end of the line, stopping `LINE_GAP` (4%) short of the anchor so the feature itself is unobscured.
- **Pre-decode** of all 21 frames on mount so fast rotation never lands on a still-decoding image.
- **Keyboard**: ← → step one frame, Home jumps to frame 1, End to frame 21. ARIA `slider` role.

## Brand

Colors and typography come from `colors_and_type.css`. The two main brand colors are:
- `--ac-blue` `#1432FF`
- `--ac-aqua` `#00FFD2`

The hero gradient `--ac-gradient-hero` is the banner background.
