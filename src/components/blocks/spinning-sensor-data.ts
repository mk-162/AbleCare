/**
 * GripAble spinning sensor — frame metadata.
 *
 * 21 frames at 600×779. F_KEYS holds hand-tuned hotspot coordinates per
 * feature; a feature renders only on frames where `pos[frame]` is set
 * (no interpolation fallback) so badges only appear when their target
 * is actually visible on the device.
 *
 * Ported from gripable-rotate.jsx (preview workspace).
 */

export const FRAME_COUNT = 21;
export const FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) => `/spinning-sensor/${i + 1}.png`);
export const FRAME_W = 600;
export const FRAME_H = 779;

export interface LegendItem {
  dot: string;
  k: string;
  v: string;
  pulse?: boolean;
}

export interface Legend {
  title: string;
  items: LegendItem[];
}

export interface FeatureKey {
  label: string;
  desc: string;
  bestFrame: number;
  pos: Record<number, { x: number; y: number }>;
  legend?: Legend;
}

export const F_KEYS: Record<number, FeatureKey> = {
  1: {
    label: "Locking Button",
    desc: "Switches grip modes. Squeeze and hold, then push down to lock.",
    bestFrame: 0,
    pos: {
      0:  { x: 263, y: 114 }, 1:  { x: 273, y: 114 }, 2:  { x: 282, y: 114 },
      3:  { x: 284, y: 114 }, 4:  { x: 286, y: 113 }, 5:  { x: 291, y: 117 },
      6:  { x: 304, y: 116 }, 7:  { x: 309, y: 115 }, 8:  { x: 315, y: 115 },
      9:  { x: 326, y: 115 }, 10: { x: 335, y: 115 }, 11: { x: 325, y: 107 },
      12: { x: 319, y: 106 }, 13: { x: 314, y: 106 }, 14: { x: 304, y: 107 },
      15: { x: 294, y: 108 }, 16: { x: 284, y: 109 }, 17: { x: 268, y: 110 },
      18: { x: 255, y: 113 }, 19: { x: 248, y: 114 }, 20: { x: 251, y: 114 },
    },
  },
  2: {
    label: "Strap Hooks",
    desc: "Two attachment points for silicone straps.",
    bestFrame: 5,
    pos: {
      0:  { x: 356, y: 176 }, 1:  { x: 362, y: 176 }, 2:  { x: 362, y: 176 },
      3:  { x: 368, y: 173 }, 4:  { x: 227, y: 177 }, 5:  { x: 240, y: 177 },
      6:  { x: 251, y: 177 }, 7:  { x: 270, y: 179 }, 8:  { x: 287, y: 178 },
      9:  { x: 308, y: 177 }, 10: { x: 330, y: 176 }, 11: { x: 345, y: 176 },
      12: { x: 361, y: 176 }, 13: { x: 364, y: 177 }, 14: { x: 372, y: 177 },
      15: { x: 372, y: 176 }, 16: { x: 242, y: 175 }, 17: { x: 251, y: 177 },
      18: { x: 267, y: 177 }, 19: { x: 290, y: 177 }, 20: { x: 331, y: 177 },
    },
  },
  3: {
    label: "Grip Plate",
    desc: "Squeeze the plate with your fingers to record force.",
    bestFrame: 2,
    pos: {
      0:  { x: 216, y: 368 }, 1:  { x: 245, y: 368 }, 2:  { x: 272, y: 371 },
      3:  { x: 294, y: 372 }, 4:  { x: 347, y: 369 }, 5:  { x: 368, y: 369 },
      6:  { x: 378, y: 369 }, 7:  { x: 384, y: 369 }, 8:  { x: 384, y: 369 },
      9:  { x: 384, y: 369 }, 10: { x: 374, y: 369 }, 11: { x: 363, y: 369 },
      12: { x: 352, y: 369 },
      18: { x: 239, y: 367 }, 19: { x: 220, y: 367 }, 20: { x: 205, y: 368 },
    },
  },
  4: {
    label: "Battery LED",
    desc: "At-a-glance charge status. Green / Yellow / Orange / Red.",
    bestFrame: 9,
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
  },
  5: {
    label: "Lanyard Hook",
    desc: "Attachment point for the wrist lanyard.",
    bestFrame: 14,
    pos: {
      11: { x: 232, y: 658 }, 12: { x: 249, y: 665 }, 13: { x: 270, y: 667 },
      14: { x: 291, y: 670 }, 15: { x: 315, y: 667 }, 16: { x: 331, y: 665 },
      17: { x: 352, y: 659 },
    },
  },
  6: {
    label: "Charging Port",
    desc: "Magnetic connector for fast, fumble-free charging.",
    bestFrame: 14,
    pos: {
      9:  { x: 212, y: 616 }, 10: { x: 214, y: 621 }, 11: { x: 228, y: 624 },
      12: { x: 248, y: 629 }, 13: { x: 270, y: 631 }, 14: { x: 294, y: 634 },
      15: { x: 316, y: 632 }, 16: { x: 337, y: 628 }, 17: { x: 357, y: 623 },
      18: { x: 367, y: 616 },
    },
  },
  7: {
    label: "Connection LED",
    desc: "Pairing and connection status indicator.",
    bestFrame: 18,
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
  },
};

export interface Feature extends FeatureKey {
  n: number;
}

export const FEATURES: Feature[] = (Object.entries(F_KEYS) as Array<[string, FeatureKey]>)
  .map(([n, v]) => ({ n: Number(n), ...v }));

export const HERO_GRADIENT = "linear-gradient(145deg, #0b1fd4 0%, #1432FF 35%, #00a896 75%, #00FFD2 100%)";
