"use client";

import { useEffect, useRef } from "react";

/**
 * A koi pond on a green halftone screen. The water is a height-field wave simulation that
 * refracts everything beneath it: a mottled floor, drifting caustic light, reeds and the koi.
 * Lotus pads and leaves float on top. The scene is worked out as brightness at a coarse grid,
 * ordered-dithered to a few greens, and every cell is shown as a square pixel.
 * Fish are snapped to that grid and redrawn in steps, so they move like pixel sprites.
 *
 * Tap the water to make a gentle ripple, which also nudges the floating pads around; fish
 * nearby come over to see what it was. Tap a fish to scare it, or drag it through the water.
 */

const STEP = 1000 / 60; // fixed simulation step, so waves travel at the same speed on any display
const SPRITE_STEP = 1000 / 14; // fish, reeds and leaves redraw at this rate, like sprite animation
const DAMPING = 0.985;
const REFRACTION = 2;
const SPECULAR = 0.08;
const SEGMENTS = 16;
const LEVELS = 6;

// 4×4 Bayer matrix: ordered dithering, as on early monochrome displays.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

// Brightness to colour, built around the site accent (--accent #6EA91A, --accent-deep #335404).
const STOPS: [number, [number, number, number]][] = [
  [0, [5, 9, 3]],
  [0.25, [20, 36, 6]],
  [0.5, [51, 84, 4]],
  [0.75, [110, 169, 26]],
  [1, [196, 238, 128]],
];

const BACKGROUND: [number, number, number] = [9, 9, 9]; // the page background, so switched-off dots vanish into it

const PALETTE = Array.from({ length: LEVELS }, (_, k) => {
  const v = k / (LEVELS - 1);
  let j = 0;
  while (j < STOPS.length - 2 && v > STOPS[j + 1][0]) j++;
  const [a, ca] = STOPS[j];
  const [b, cb] = STOPS[j + 1];
  const t = (v - a) / (b - a);
  return ca.map((c, i) => Math.round(c + (cb[i] - c) * t)) as [number, number, number];
});

type Point = { x: number; y: number };

type Patch = { at: number; side: number; r: number };

type Fish = {
  path: Point[]; // where the head has been, newest first; the body follows this exact path
  spine: Point[]; // the body as drawn: the path, with the swimming wave added
  heading: number;
  turn: number; // angular velocity, eased so turns start and finish gently
  speed: number; // cells per second
  cruise: number; // relaxed swimming speed, about a quarter of a body length per second
  beat: number; // phase of the swimming wave
  swim: number; // how hard it is swimming, 0.3 (gliding) to 1
  phase: number; // drives the tail and fin flicks in drawFish
  length: number;
  width: number;
  seed: number;
  goal: Point;
  goalUntil: number;
  fear: number;
  fleeAngle: number;
  target: Point | null; // something worth investigating, like a tap on the water
  patches: Patch[];
};

type Blade = { x: number; y: number; angle: number; length: number; bend: number; width: number; lum: number; seed: number };

type Leaf = { x: number; y: number; vx: number; vy: number; angle: number; spin: number; size: number; lum: number };

type Pad = { x: number; y: number; vx: number; vy: number; angle: number; spin: number; r: number; lum: number; flower: boolean; glow: number };

// Dark speckles along each koi's back, placed along the body (0 = nose, 1 = tail) and across it.
function speckles(rand: () => number): Patch[] {
  return Array.from({ length: 10 }, () => ({
    at: 0.12 + rand() * 0.68,
    side: (rand() < 0.8 ? 1 : -1) * (0.3 + rand() * 0.5),
    r: 0.15 + rand() * 0.25,
  }));
}


function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function angleDiff(from: number, to: number) {
  let d = to - from;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

/** Body half-width along the fish, 0 at the nose to 1 at the tail: round head, full shoulders, thin peduncle. */
function bodyWidth(t: number) {
  if (t < 0.22) return 0.62 + 0.38 * Math.sin((t / 0.22) * (Math.PI / 2));
  return 1 - 0.85 * Math.pow((t - 0.22) / 0.78, 1.2);
}

function grey(l: number, a = 1) {
  const v = Math.round(Math.max(0, Math.min(1, l)) * 255);
  return `rgba(${v},${v},${v},${a})`;
}

/** The pond floor: dark and softly mottled. */
function buildFloor(W: number, H: number) {
  const floor = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      floor[y * W + x] =
        0.27 +
        Math.sin(x * 0.037 + 1.3) * Math.cos(y * 0.051) * 0.035 +
        Math.sin((x - y * 0.6) * 0.019) * 0.03;
    }
  }
  return floor;
}

/** Reed clusters leaning in from the edges. */
function buildReeds(W: number, H: number) {
  const rand = mulberry32(5);
  const clusters = [
    { x: 0.17, y: 0.94, angle: -0.85, n: 11, len: 0.36 },
    { x: 0.83, y: 0.94, angle: -2.3, n: 11, len: 0.36 },
    { x: 0.4, y: 0.1, angle: 1.4, n: 5, len: 0.3 },
    { x: 0.1, y: 0.55, angle: -0.4, n: 3, len: 0.18 },
  ];
  const blades: Blade[] = [];
  for (const c of clusters) {
    for (let i = 0; i < c.n; i++) {
      blades.push({
        x: c.x * W + (rand() - 0.5) * 12,
        y: c.y * H + (rand() - 0.5) * 6,
        angle: c.angle + (rand() - 0.5) * 0.9,
        length: c.len * H * (0.55 + rand() * 0.6),
        bend: (rand() - 0.5) * 0.8,
        width: 1.4 + rand() * 1.6,
        lum: 0.55 + rand() * 0.3,
        seed: rand() * 10,
      });
    }
  }
  return blades;
}

function drawReeds(ctx: CanvasRenderingContext2D, blades: Blade[], t: number) {
  for (const b of blades) {
    const sway = Math.sin(t * 0.6 + b.seed) * 0.06;
    const a = b.angle + sway;
    const tipA = a + b.bend + sway * 2;
    const mx = b.x + Math.cos(a) * b.length * 0.55;
    const my = b.y + Math.sin(a) * b.length * 0.55;
    const tx = mx + Math.cos(tipA) * b.length * 0.45;
    const ty = my + Math.sin(tipA) * b.length * 0.45;
    const px = Math.cos(a + Math.PI / 2) * b.width;
    const py = Math.sin(a + Math.PI / 2) * b.width;
    ctx.beginPath();
    ctx.moveTo(b.x + px, b.y + py);
    ctx.quadraticCurveTo(mx + px * 0.7, my + py * 0.7, tx, ty);
    ctx.quadraticCurveTo(mx - px * 0.7, my - py * 0.7, b.x - px, b.y - py);
    ctx.closePath();
    // Dark blade, light edges.
    ctx.fillStyle = grey(0.06);
    ctx.fill();
    ctx.strokeStyle = grey(b.lum);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function makeLeaves(W: number, H: number, rand: () => number): Leaf[] {
  return Array.from({ length: Math.max(5, Math.round(W / 34)) }, () => ({
    x: rand() * W,
    y: rand() * H,
    vx: 0,
    vy: 0,
    angle: rand() * Math.PI * 2,
    spin: (rand() - 0.5) * 0.004,
    size: H * (0.035 + rand() * 0.08),
    lum: 0.7 + rand() * 0.25,
  }));
}

function drawLeaf(ctx: CanvasRenderingContext2D, l: Leaf) {
  const x = Math.round(l.x);
  const y = Math.round(l.y);
  const c = Math.cos(l.angle) * l.size;
  const s = Math.sin(l.angle) * l.size;
  // An angular, slightly lopsided fragment: tip, wide shoulder, stem, narrow shoulder.
  ctx.fillStyle = grey(l.lum);
  ctx.beginPath();
  ctx.moveTo(x + c, y + s);
  ctx.lineTo(x - s * 0.7 - c * 0.2, y + c * 0.7 - s * 0.2);
  ctx.lineTo(x - c * 0.9, y - s * 0.9);
  ctx.lineTo(x + s * 0.35 + c * 0.1, y - c * 0.35 + s * 0.1);
  ctx.closePath();
  ctx.fill();
}

/** Two lotus beds: clusters of round pads, a couple of them flowering. */
function makePads(W: number, H: number, rand: () => number): Pad[] {
  const pads: Pad[] = [];
  // glow scales the bed's brightness; the lower-right bed sits quieter so it doesn't pull the eye.
  for (const bed of [{ x: 0.78, y: 0.36, n: 3, glow: 1 }, { x: 0.72, y: 0.74, n: 2, glow: 0.6 }]) {
    for (let i = 0; i < bed.n; i++) {
      const r = H * (0.075 + rand() * 0.04);
      pads.push({
        x: bed.x * W + (rand() - 0.5) * H * 0.34,
        y: bed.y * H + (rand() - 0.5) * H * 0.26,
        vx: 0,
        vy: 0,
        angle: rand() * Math.PI * 2,
        spin: (rand() - 0.5) * 0.0015,
        r,
        lum: (0.44 + rand() * 0.08) * bed.glow,
        flower: i === 0,
        glow: bed.glow,
      });
    }
  }
  return pads;
}

function drawPad(ctx: CanvasRenderingContext2D, p: Pad) {
  const x = Math.round(p.x);
  const y = Math.round(p.y);
  // The pad: a disc with a wedge cut to the centre.
  ctx.fillStyle = grey(p.lum);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, p.r, p.angle + 0.22, p.angle + Math.PI * 2 - 0.22);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = grey(p.lum * 0.45); // dark rim, so pads read against the water
  ctx.lineWidth = 1.2;
  ctx.stroke();
  // Veins.
  ctx.strokeStyle = grey(p.lum * 0.6);
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let k = 1; k < 6; k++) {
    const a = p.angle + (k / 6) * Math.PI * 2;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * p.r * 0.85, y + Math.sin(a) * p.r * 0.85);
  }
  ctx.stroke();
  if (!p.flower) return;
  // A lotus flower: pointed petals round a bright centre.
  const fr = p.r * 0.6;
  ctx.fillStyle = grey(p.glow);
  for (let k = 0; k < 6; k++) {
    const a = p.angle * 0.5 + (k / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * fr * 0.5, y + Math.sin(a) * fr * 0.5, fr * 0.55, fr * 0.24, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = grey(0.78 * p.glow);
  ctx.beginPath();
  ctx.arc(x, y, fr * 0.28, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * One pixel per brightness level, S×S device pixels: a solid square with a thin dark gap
 * around it, like the cells of an old monochrome screen. Brightness shows only as colour.
 * Level 0 is a switched-off cell: plain page background.
 */
function buildSprites(S: number) {
  return PALETTE.map((col, k) => {
    const sprite = new Uint32Array(S * S);
    if (k === 0) return sprite.fill(((255 << 24) | (BACKGROUND[2] << 16) | (BACKGROUND[1] << 8) | BACKGROUND[0]) >>> 0);
    const gapCol = col.map((c, i) => BACKGROUND[i] + (c - BACKGROUND[i]) * 0.12);
    const half = S * 0.4;
    const SS = 4;
    for (let py = 0; py < S; py++) {
      for (let px = 0; px < S; px++) {
        let cover = 0;
        for (let sy = 0; sy < SS; sy++) {
          for (let sx = 0; sx < SS; sx++) {
            const dx = Math.abs(px + (sx + 0.5) / SS - S / 2);
            const dy = Math.abs(py + (sy + 0.5) / SS - S / 2);
            if (dx <= half && dy <= half) cover++;
          }
        }
        cover /= SS * SS;
        const r = Math.round(gapCol[0] + (col[0] - gapCol[0]) * cover);
        const g = Math.round(gapCol[1] + (col[1] - gapCol[1]) * cover);
        const b = Math.round(gapCol[2] + (col[2] - gapCol[2]) * cover);
        sprite[py * S + px] = ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
      }
    }
    return sprite;
  });
}

function makeFish(W: number, H: number, rand: () => number): Fish {
  const length = H * (0.34 + rand() * 0.06);
  const heading = rand() * Math.PI * 2;
  const x = W * (0.2 + rand() * 0.6);
  const y = H * (0.3 + rand() * 0.4);
  const seed = rand();
  const cruise = length * (0.2 + 0.1 * seed);
  const path = Array.from({ length: 24 }, (_, i) => ({
    x: x - Math.cos(heading) * length * 0.06 * i,
    y: y - Math.sin(heading) * length * 0.06 * i,
  }));
  return {
    path,
    spine: path.slice(0, SEGMENTS).map((p) => ({ ...p })),
    heading,
    turn: 0,
    speed: cruise,
    cruise,
    beat: seed * 10,
    swim: 0.4,
    phase: 0,
    length,
    width: length * 0.1,
    seed,
    goal: { x, y },
    goalUntil: 0,
    fear: 0,
    fleeAngle: 0,
    target: null,
    patches: speckles(rand),
  };
}

/** Draws a fish as brightness (red channel) and coverage (alpha), snapped to the dot grid. */
function drawFish(ctx: CanvasRenderingContext2D, f: Fish) {
  const s = f.spine.map((p) => ({ x: Math.round(p.x), y: Math.round(p.y) }));
  const n = s.length;
  const dirAt = (i: number) =>
    i === 0 ? Math.atan2(s[0].y - s[1].y, s[0].x - s[1].x) : Math.atan2(s[i - 1].y - s[i].y, s[i - 1].x - s[i].x);

  // Tail: two flowing lobes.
  const tail = s[n - 1];
  const ta = dirAt(n - 1) + Math.PI;
  const swing = Math.sin(f.phase * 1.2) * 0.45;
  const tl = f.length * 0.34;
  const at = (a: number, r: number) => [tail.x + Math.cos(ta + a) * tl * r, tail.y + Math.sin(ta + a) * tl * r] as const;
  ctx.fillStyle = grey(0.95, 0.8);
  ctx.beginPath();
  ctx.moveTo(tail.x, tail.y);
  ctx.quadraticCurveTo(...at(0.25 + swing, 0.6), ...at(0.55 + swing * 1.4, 1));
  ctx.quadraticCurveTo(...at(swing, 0.5), ...at(-0.55 + swing * 1.4, 1));
  ctx.quadraticCurveTo(...at(-0.25 + swing, 0.6), tail.x, tail.y);
  ctx.fill();

  // Pectoral and pelvic fins, sweeping back as they paddle.
  const flap = Math.sin(f.phase * 0.7) * 0.3;
  for (const [idx, size] of [[3, 1.05], [8, 0.6]] as const) {
    const a = dirAt(idx);
    for (const side of [-1, 1]) {
      const fa = a + side * (2.45 + flap * side);
      ctx.beginPath();
      ctx.ellipse(
        s[idx].x + Math.cos(fa) * f.width * 1.05,
        s[idx].y + Math.sin(fa) * f.width * 1.05,
        f.width * size,
        f.width * size * 0.42,
        fa,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  // Body outline: nose, down one flank, round the tail, back up the other.
  const left: Point[] = [];
  const right: Point[] = [];
  for (let i = 0; i < n; i++) {
    const a = dirAt(i) + Math.PI / 2;
    const w = f.width * bodyWidth(i / (n - 1));
    left.push({ x: s[i].x + Math.cos(a) * w, y: s[i].y + Math.sin(a) * w });
    right.push({ x: s[i].x - Math.cos(a) * w, y: s[i].y - Math.sin(a) * w });
  }
  const ha = dirAt(0);
  const nose = { x: s[0].x + Math.cos(ha) * f.width * 0.75, y: s[0].y + Math.sin(ha) * f.width * 0.75 };
  const pts = [nose, ...left, ...right.reverse()];
  const body = new Path2D();
  const mid = (p: Point, q: Point) => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });
  const m0 = mid(pts[pts.length - 1], pts[0]);
  body.moveTo(m0.x, m0.y);
  for (let i = 0; i < pts.length; i++) {
    const m = mid(pts[i], pts[(i + 1) % pts.length]);
    body.quadraticCurveTo(pts[i].x, pts[i].y, m.x, m.y);
  }

  ctx.fillStyle = grey(1);
  ctx.fill(body);
  ctx.save();
  ctx.clip(body);
  // One flank in shade.
  ctx.strokeStyle = grey(0.76);
  ctx.lineWidth = f.width * 0.7;
  ctx.beginPath();
  ctx.moveTo(right[right.length - 1].x, right[right.length - 1].y);
  for (let i = right.length - 2; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
  ctx.stroke();
  ctx.fillStyle = grey(0.25);
  for (const p of f.patches) {
    const i = Math.round(p.at * (n - 1));
    const a = dirAt(i) + Math.PI / 2;
    const w = f.width * bodyWidth(p.at);
    ctx.beginPath();
    ctx.ellipse(s[i].x + Math.cos(a) * w * p.side, s[i].y + Math.sin(a) * w * p.side, f.width * p.r * 0.65, f.width * p.r * 0.45, dirAt(i) + p.side * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export default function Pond() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bloomRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const bloom = bloomRef.current;
    if (!wrap || !canvas || !bloom) return;
    const ctx = canvas.getContext("2d");
    const bctx = bloom.getContext("2d");
    const fishCanvas = document.createElement("canvas");
    const reedCanvas = document.createElement("canvas");
    const leafCanvas = document.createElement("canvas");
    const fctx = fishCanvas.getContext("2d", { willReadFrequently: true });
    const rctx = reedCanvas.getContext("2d", { willReadFrequently: true });
    const lctx = leafCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx || !bctx || !fctx || !rctx || !lctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = mulberry32(42);

    let PX = 4;
    let W = 0;
    let H = 0;
    let cur = new Float32Array(0);
    let prev = new Float32Array(0);
    let floor = new Float32Array(0);
    let vignette = new Float32Array(0);
    let reeds: Blade[] = [];
    let leaves: Leaf[] = [];
    let pads: Pad[] = [];
    let image: ImageData | null = null; // one pixel per cell, for the bloom
    let screen: ImageData | null = null; // the dots, at device resolution
    let screen32 = new Uint32Array(0);
    let levels = new Uint8Array(0);
    let S = 3; // device pixels per cell
    let sprites: Uint32Array[] = [];
    let fish: Fish[] = [];
    let fishPx = new Uint8ClampedArray(0);
    let reedPx = new Uint8ClampedArray(0);
    let leafPx = new Uint8ClampedArray(0);
    let lastSprite = -Infinity;

    // Caustic cells: one drifting light point per cell, padded by a cell on every side.
    let cell = 40;
    let gw = 0;
    let gh = 0;
    let cpx = new Float32Array(0);
    let cpy = new Float32Array(0);
    let cph = new Float32Array(0);

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const nextPX = 4;
      const nextS = Math.max(2, Math.round(nextPX * Math.min(2, window.devicePixelRatio || 1)));
      const nextW = Math.max(60, Math.ceil(rect.width / nextPX));
      const nextH = Math.max(40, Math.ceil(rect.height / nextPX));
      if (nextW === W && nextH === H && nextPX === PX && nextS === S) return;
      const sx = W ? nextW / W : 1;
      const sy = H ? nextH / H : 1;
      PX = nextPX;
      W = nextW;
      H = nextH;
      S = nextS;
      for (const c of [bloom, fishCanvas, reedCanvas, leafCanvas]) {
        c.width = W;
        c.height = H;
      }
      canvas.width = W * S;
      canvas.height = H * S;
      for (const c of [canvas, bloom]) {
        c.style.width = `${W * PX}px`;
        c.style.height = `${H * PX}px`;
      }
      screen = ctx.createImageData(W * S, H * S);
      screen32 = new Uint32Array(screen.data.buffer);
      levels = new Uint8Array(W * H);
      sprites = buildSprites(S);
      cur = new Float32Array(W * H);
      prev = new Float32Array(W * H);
      floor = buildFloor(W, H);
      reeds = buildReeds(W, H);
      image = bctx.createImageData(W, H);
      lastSprite = -Infinity;

      // How "on" the screen is at each cell: full in the middle, falling to nothing at the edges.
      // The render loop switches cells off against a dither threshold, so the edges dissolve dot by dot.
      vignette = new Float32Array(W * H);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const ex = Math.min(1, Math.min(x, W - 1 - x) / (W * 0.22));
          const ey = Math.min(1, Math.min(y, H - 1 - y) / (H * 0.27));
          const e = ex * ey;
          vignette[y * W + x] = e * e * (3 - 2 * e);
        }
      }

      cell = Math.max(26, Math.round(H / 3.1));
      gw = Math.ceil(W / cell) + 2;
      gh = Math.ceil(H / cell) + 2;
      cpx = new Float32Array(gw * gh);
      cpy = new Float32Array(gw * gh);
      const crand = mulberry32(3);
      cph = new Float32Array(gw * gh * 4).map(() => crand() * Math.PI * 2);

      for (const f of fish) {
        for (const p of [...f.path, ...f.spine, f.goal]) { p.x *= sx; p.y *= sy; }
      }
      const count = 2;
      fish = fish.slice(0, count);
      for (let k = fish.length; k < count; k++) fish.push(makeFish(W, H, rand));
      if (leaves.length === 0) leaves = makeLeaves(W, H, rand);
      else for (const l of leaves) { l.x *= sx; l.y *= sy; }
      if (pads.length === 0) pads = makePads(W, H, rand);
      else for (const p of pads) { p.x *= sx; p.y *= sy; }
    };

    const disturb = (cx: number, cy: number, radius: number, amount: number) => {
      const r = Math.ceil(radius);
      for (let y = Math.max(1, Math.floor(cy) - r); y <= Math.min(H - 2, Math.floor(cy) + r); y++) {
        for (let x = Math.max(1, Math.floor(cx) - r); x <= Math.min(W - 2, Math.floor(cx) + r); x++) {
          const d = Math.hypot(x - cx, y - cy) / radius;
          if (d < 1) cur[y * W + x] += amount * (0.5 + 0.5 * Math.cos(d * Math.PI));
        }
      }
    };

    const stepWater = () => {
      for (let y = 1; y < H - 1; y++) {
        const row = y * W;
        for (let x = 1; x < W - 1; x++) {
          const i = row + x;
          prev[i] = ((cur[i - 1] + cur[i + 1] + cur[i - W] + cur[i + W]) * 0.5 - prev[i]) * DAMPING;
        }
      }
      const t = cur;
      cur = prev;
      prev = t;
    };

    // Move the head and record where it went. The body is laid along that trail, so every part
    // of the fish passes through the same water the head did, the way a real fish swims.
    const moveHead = (f: Fish, x: number, y: number) => {
      const path = f.path;
      if (Math.hypot(path[0].x - path[1].x, path[0].y - path[1].y) >= f.length * 0.02) path.unshift({ x, y });
      else path[0] = { x, y };
      // Forget the trail beyond the tail.
      let total = 0;
      for (let k = 1; k < path.length; k++) {
        total += Math.hypot(path[k].x - path[k - 1].x, path[k].y - path[k - 1].y);
        if (total > f.length * 1.3 && k > 2) { path.length = k + 1; break; }
      }
    };

    // Lay the body along the trail, then add the swimming wave: barely there at the head,
    // growing towards the tail, and travelling backwards along the body.
    const layBody = (f: Fish) => {
      const spacing = f.length / (SEGMENTS - 1);
      const line: Point[] = [{ ...f.path[0] }];
      let prevPt = f.path[0];
      let k = 1;
      let need = spacing;
      while (line.length < SEGMENTS) {
        if (k < f.path.length) {
          const next = f.path[k];
          const d = Math.hypot(next.x - prevPt.x, next.y - prevPt.y);
          if (d >= need && d > 0) {
            const t = need / d;
            prevPt = { x: prevPt.x + (next.x - prevPt.x) * t, y: prevPt.y + (next.y - prevPt.y) * t };
            line.push(prevPt);
            need = spacing;
          } else {
            need -= d;
            prevPt = next;
            k++;
          }
        } else {
          // Trail ran out (just spawned or just dropped): carry straight on behind.
          const a = line[line.length - 2] ?? { x: prevPt.x + Math.cos(f.heading), y: prevPt.y + Math.sin(f.heading) };
          const b = line[line.length - 1];
          const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
          prevPt = { x: b.x + ((b.x - a.x) / d) * need, y: b.y + ((b.y - a.y) / d) * need };
          line.push(prevPt);
          need = spacing;
        }
      }
      f.spine = line.map((p, i) => {
        const t = i / (SEGMENTS - 1);
        const a = line[Math.max(0, i - 1)];
        const b = line[Math.min(SEGMENTS - 1, i + 1)];
        const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        const nx = -(b.y - a.y) / d;
        const ny = (b.x - a.x) / d;
        const ramp = Math.min(1, Math.max(0, (t - 0.15) / 0.85));
        const amp = f.length * (0.008 + 0.07 * Math.pow(ramp * ramp * (3 - 2 * ramp), 1.5)) * f.swim;
        const off = amp * Math.sin(f.beat - 5.2 * t);
        return { x: p.x + nx * off, y: p.y + ny * off };
      });
      f.phase = f.beat;
    };

    const translateFish = (f: Fish, dx: number, dy: number) => {
      for (const q of f.path) { q.x += dx; q.y += dy; }
      for (const q of f.spine) { q.x += dx; q.y += dy; }
    };

    // Keep a whole fish inside the pond by sliding it, never by moving its head alone (that pivots the body).
    const shiftInside = (f: Fish) => {
      let dx = 0;
      let dy = 0;
      for (const q of f.spine) {
        dx = Math.max(dx, 2 - q.x);
        dx = Math.min(dx, W - 3 - q.x);
        dy = Math.max(dy, 2 - q.y);
        dy = Math.min(dy, H - 3 - q.y);
      }
      if (dx || dy) translateFish(f, dx, dy);
    };

    // Hard rule: fish never touch. Any part of two bodies that comes too close pushes the
    // whole fish apart (shared between them, unless one is being held by the pointer).
    const separate = () => {
      for (let pass = 0; pass < 3; pass++) {
        for (let a = 0; a < fish.length; a++) {
          for (let b = a + 1; b < fish.length; b++) {
            const A = fish[a];
            const B = fish[b];
            let px = 0;
            let py = 0;
            for (let i = 0; i < SEGMENTS; i++) {
              const ra = A.width * bodyWidth(i / (SEGMENTS - 1));
              for (let j = 0; j < SEGMENTS; j++) {
                const clear = ra + B.width * bodyWidth(j / (SEGMENTS - 1)) + 3;
                const ddx = A.spine[i].x - B.spine[j].x;
                const ddy = A.spine[i].y - B.spine[j].y;
                const d = Math.hypot(ddx, ddy) || 0.01;
                const push = clear - d;
                if (push > Math.hypot(px, py)) {
                  // keep the deepest overlap
                  px = (ddx / d) * push;
                  py = (ddy / d) * push;
                }
              }
            }
            if (px === 0 && py === 0) continue;
            const aHeld = drag?.fish === A;
            const bHeld = drag?.fish === B;
            const shareA = aHeld ? 0 : bHeld ? 1 : 0.5;
            const shareB = 1 - shareA;
            translateFish(A, px * shareA, py * shareA);
            translateFish(B, -px * shareB, -py * shareB);
            // A fish pushed against the edge slides back in; the next pass moves the other one instead.
            if (!aHeld) shiftInside(A);
            if (!bHeld) shiftInside(B);
          }
        }
      }
    };

    let simTime = 0;

    const stepFish = () => {
      const dt = STEP / 1000;
      simTime += dt;
      const calm = reduceMotion ? 0.45 : 1;
      for (const f of fish) {
        const head = f.path[0];

        // Held by the pointer: the head follows it, and the body trails along its path.
        if (drag && drag.fish === f) {
          const ddx = drag.to.x - head.x;
          const ddy = drag.to.y - head.y;
          const dist = Math.hypot(ddx, ddy);
          if (dist > 0.5) f.heading = Math.atan2(ddy, ddx);
          f.turn = 0;
          f.speed = Math.min(f.length * 3, dist * 0.2 / dt);
          f.swim = 0.3 + 0.7 * Math.min(1, f.speed / (f.cruise * 1.2));
          f.beat += dt * Math.PI * 2 * (0.9 + 1.6 * f.speed / f.length);
          moveHead(f, head.x + ddx * 0.2, head.y + ddy * 0.2);
          layBody(f);
          if (dist > 1 && rand() < 0.3) disturb(head.x, head.y, 2, -0.3);
          continue;
        }

        // Where it wants to go: a slowly changing goal inside the pond, or something worth a look.
        if (f.target) {
          f.goal = f.target;
          f.goalUntil = simTime + 4;
          f.target = null;
        }
        if (simTime > f.goalUntil || Math.hypot(f.goal.x - head.x, f.goal.y - head.y) < f.length * 0.3) {
          // Goals sit towards the far side, so the fish make long runs along the wide pond.
          const side = head.x < W / 2 ? 1 : -1;
          f.goal = { x: W / 2 + side * W * (0.12 + rand() * 0.18), y: H * (0.36 + rand() * 0.28) };
          f.goalUntil = simTime + 4 + rand() * 5;
        }
        let bx = f.goal.x - head.x;
        let by = f.goal.y - head.y;
        const gd = Math.hypot(bx, by) || 1;
        bx /= gd;
        by /= gd;

        // Keep inside the visible pond: look a body length ahead and start a wide turn early.
        const ahead = f.length * 1.1;
        const lx = head.x + Math.cos(f.heading) * ahead;
        const ly = head.y + Math.sin(f.heading) * ahead;
        const mx = W * 0.16;
        const my = H * 0.2;
        const out = Math.max(mx - lx, lx - (W - mx), my - ly, ly - (H - my), 0);
        if (out > 0) {
          const cx = W / 2 - head.x;
          const cy = H / 2 - head.y;
          const cd = Math.hypot(cx, cy) || 1;
          const pull = Math.min(3, 0.8 + out / (f.length * 0.25)) * (1 + f.fear * 5); // even a bolting fish turns away from the edge
          bx += (cx / cd) * pull;
          by += (cy / cd) * pull;
        }

        // Look ahead for other fish and steer away early; the closer they are, the stronger.
        const reach = f.length * 0.7;
        const probe = { x: head.x + Math.cos(f.heading) * reach, y: head.y + Math.sin(f.heading) * reach };
        let ax = 0;
        let ay = 0;
        let crowd = 0;
        for (const o of fish) {
          if (o === f) continue;
          for (const m of o.spine) {
            for (const q of [head, probe]) {
              const ddx = q.x - m.x;
              const ddy = q.y - m.y;
              const d = Math.hypot(ddx, ddy) || 0.01;
              const range = f.length * 1.05;
              if (d < range) {
                const w = (1 - d / range) ** 2;
                ax += (ddx / d) * w;
                ay += (ddy / d) * w;
                crowd += w;
              }
            }
          }
        }
        const urgency = Math.min(1, crowd * 0.6);
        if (urgency > 0) {
          const ad = Math.hypot(ax, ay) || 1;
          bx = bx * (1 - urgency) + (ax / ad) * 3 * urgency;
          by = by * (1 - urgency) + (ay / ad) * 3 * urgency;
          if (urgency > 0.6) f.goalUntil = Math.min(f.goalUntil, simTime + 1.2); // pick somewhere else soon
        }

        // Fear pulls hard in the escape direction.
        if (f.fear > 0.02) {
          bx += Math.cos(f.fleeAngle) * f.fear * 6;
          by += Math.sin(f.fleeAngle) * f.fear * 6;
        }

        // Turn smoothly: angular speed eases towards what's needed, and is capped by how fast
        // the fish is moving, so it sweeps round in an arc and never spins on the spot.
        const err = angleDiff(f.heading, Math.atan2(by, bx));
        // The turning circle never gets tighter than about 0.6 body lengths (0.4 when dodging), so
        // the body, which follows the head's path, bends into a gentle arc instead of curling up.
        const cap = Math.min(6, f.speed / (f.length * (0.6 - 0.2 * urgency)));
        const gain = 1.2 + 2 * urgency + 8 * f.fear;
        const want = Math.max(-cap, Math.min(cap, err * gain));
        f.turn += (want - f.turn) * (1 - Math.exp(-dt * gain * 4.5));
        f.heading = angleDiff(0, f.heading + f.turn * dt); // kept within ±π

        // Cruise with a slow ebb and flow, ease off into turns and near other fish, bolt when scared.
        const ebb = 1 + 0.15 * Math.sin(0.37 * simTime + 23 * f.seed);
        const goalSpeed =
          f.cruise * calm * ebb * (1 - 0.35 * Math.min(Math.abs(err), 1)) * (1 - 0.4 * urgency) + f.fear * f.length * 1.8;
        f.speed += (goalSpeed - f.speed) * (1 - Math.exp(-dt * (f.fear > 0.15 ? 7 : 1.1)));
        f.fear *= Math.exp(-dt * 1.1);

        // Tail beats faster the faster it swims; the wave is strongest when it's working hard.
        f.swim = 0.3 + 0.7 * Math.min(1, f.speed / (f.cruise * 1.2));
        f.beat += dt * Math.PI * 2 * (0.9 + 1.6 * f.speed / f.length);

        moveHead(f, head.x + Math.cos(f.heading) * f.speed * dt, head.y + Math.sin(f.heading) * f.speed * dt);
        layBody(f);
        shiftInside(f);

        // A faint wake, stronger when darting.
        if (rand() < 0.2) disturb(f.path[0].x, f.path[0].y, 2.5, -(0.15 + f.fear * 0.8));
      }
      separate();
    };

    // Lotus pads barely drift; ripples rock them gently and they settle back.
    const stepPads = () => {
      for (const p of pads) {
        const ix = Math.max(1, Math.min(W - 2, Math.round(p.x)));
        const iy = Math.max(1, Math.min(H - 2, Math.round(p.y)));
        const i = iy * W + ix;
        p.vx = p.vx * 0.9 + (cur[i + 1] - cur[i - 1]) * 0.004;
        p.vy = p.vy * 0.9 + (cur[i + W] - cur[i - W]) * 0.004;
        p.x = Math.max(p.r, Math.min(W - p.r, p.x + p.vx));
        p.y = Math.max(p.r, Math.min(H - p.r, p.y + p.vy));
        p.angle += p.spin;
      }
    };

    // Leaves drift slowly and get pushed along by passing ripples.
    const stepLeaves = () => {
      const drift = reduceMotion ? 0.002 : 0.006;
      for (const l of leaves) {
        const ix = Math.max(1, Math.min(W - 2, Math.round(l.x)));
        const iy = Math.max(1, Math.min(H - 2, Math.round(l.y)));
        const i = iy * W + ix;
        l.vx = l.vx * 0.94 + (cur[i + 1] - cur[i - 1]) * 0.012 + drift;
        l.vy = l.vy * 0.94 + (cur[i + W] - cur[i - W]) * 0.012;
        l.x += l.vx;
        l.y += l.vy;
        l.angle += l.spin + l.vx * 0.02;
        const pad = l.size * 2;
        if (l.x > W + pad) l.x = -pad;
        if (l.x < -pad) l.x = W + pad;
        if (l.y > H + pad) l.y = -pad;
        if (l.y < -pad) l.y = H + pad;
      }
    };


    const render = (time: number) => {
      if (!image) return;
      const t = (time / 1000) * (reduceMotion ? 0.25 : 1);

      // Sprites update in steps, not every frame.
      if (time - lastSprite >= SPRITE_STEP) {
        lastSprite = time;
        fctx.clearRect(0, 0, W, H);
        for (const f of fish) drawFish(fctx, f);
        fishPx = fctx.getImageData(0, 0, W, H).data;
        rctx.clearRect(0, 0, W, H);
        drawReeds(rctx, reeds, t);
        reedPx = rctx.getImageData(0, 0, W, H).data;
        lctx.clearRect(0, 0, W, H);
        for (const p of pads) drawPad(lctx, p);
        for (const l of leaves) drawLeaf(lctx, l);
        leafPx = lctx.getImageData(0, 0, W, H).data;
      }

      for (let cy = 0; cy < gh; cy++) {
        for (let cx = 0; cx < gw; cx++) {
          const k = cy * gw + cx;
          cpx[k] = (cx - 1 + 0.5 + 0.34 * Math.sin(t * 0.3 + cph[k * 4]) + 0.07 * Math.sin(t * 0.8 + cph[k * 4 + 1])) * cell;
          cpy[k] = (cy - 1 + 0.5 + 0.34 * Math.cos(t * 0.26 + cph[k * 4 + 2]) + 0.07 * Math.cos(t * 0.7 + cph[k * 4 + 3])) * cell;
        }
      }

      const out = image.data;
      const last = LEVELS - 1;
      const lineWidth = cell * 0.075;
      const warp = cell * 0.22;
      const warpFreq = (Math.PI * 2) / (cell * 1.6);
      const shadowX = Math.max(2, Math.round(H * 0.04));
      const shadowY = Math.max(2, Math.round(H * 0.05));

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = y * W + x;
          const dx = (x < W - 1 ? cur[i + 1] : cur[i]) - (x > 0 ? cur[i - 1] : cur[i]);
          const dy = (y < H - 1 ? cur[i + W] : cur[i]) - (y > 0 ? cur[i - W] : cur[i]);
          const fx = Math.max(0, Math.min(W - 1, x + dx * REFRACTION));
          const fy = Math.max(0, Math.min(H - 1, y + dy * REFRACTION));
          const sx = fx | 0;
          const sy = fy | 0;
          const si = sy * W + sx;

          // Caustics: bright along the walls between drifting cells, bent into curves by a warp.
          const wx = Math.max(0, Math.min(W - 1, fx + Math.sin(fy * warpFreq + t * 0.4) * warp));
          const wy = Math.max(0, Math.min(H - 1, fy + Math.sin(fx * warpFreq - t * 0.35) * warp));
          const gx = Math.floor(wx / cell) + 1;
          const gy = Math.floor(wy / cell) + 1;
          let f1 = 1e9;
          let f2 = 1e9;
          for (let oy = -1; oy <= 1; oy++) {
            const row = (gy + oy) * gw;
            for (let ox = -1; ox <= 1; ox++) {
              const k = row + gx + ox;
              const ddx = cpx[k] - wx;
              const ddy = cpy[k] - wy;
              const d = ddx * ddx + ddy * ddy;
              if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) f2 = d;
            }
          }
          const e = (Math.sqrt(f2) - Math.sqrt(f1)) / lineWidth;
          const caustic = Math.exp(-e * e * 1.4) * 0.85 + Math.exp(-e * 0.7) * 0.15;

          let L = floor[si] + caustic * 0.08;

          // Shadows on the floor, cast down and to the right.
          const shx = sx - shadowX;
          const shy = sy - shadowY;
          if (shx >= 0 && shy >= 0) {
            const k = (shy * W + shx) * 4;
            const sa = Math.max(fishPx[k + 3], reedPx[k + 3] * 0.7) / 255;
            L *= 1 - sa * 0.42;
          }
          const lsx = x - shadowX;
          const lsy = y - shadowY;
          if (lsx >= 0 && lsy >= 0 && leafPx[(lsy * W + lsx) * 4 + 3] > 128) L *= 0.55;

          const ra = reedPx[si * 4 + 3] / 255;
          if (ra > 0.3) L += ((reedPx[si * 4] / 255) * (0.8 + caustic * 0.5) - L) * Math.min(1, ra * 1.4);

          const fa = fishPx[si * 4 + 3];
          if (fa > 50) {
            const cover = fa > 140 ? 1 : 0.6; // solid body, see-through fins
            L += ((fishPx[si * 4] / 255) * (0.92 + caustic * 0.18) - L) * cover;
          }

          L += (dx + dy) * SPECULAR; // ripple glints, lit from the top left

          // Leaves float on the surface, so they are not refracted.
          if (leafPx[i * 4 + 3] > 128) L = (leafPx[i * 4] / 255) * (0.9 + caustic * 0.1);

          const on = vignette[i];
          L *= 0.45 + 0.55 * on;

          const n = BAYER[(y & 3) * 4 + (x & 3)];
          const k = on <= n ? 0 : Math.max(0, Math.min(last, Math.floor(L * last + n)));
          levels[i] = k;
          const col = PALETTE[k];
          const o = i * 4;
          out[o] = col[0];
          out[o + 1] = col[1];
          out[o + 2] = col[2];
          out[o + 3] = 255;
        }
      }
      bctx.putImageData(image, 0, 0);

      // Stamp a dot sprite for every cell.
      if (screen) {
        const FW = W * S;
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const sp = sprites[levels[y * W + x]];
            let o = y * S * FW + x * S;
            for (let r = 0, q = 0; r < S; r++, o += FW) {
              for (let c = 0; c < S; c++, q++) screen32[o + c] = sp[q];
            }
          }
        }
        ctx.putImageData(screen, 0, 0);
      }
    };

    // --- Pointer ---
    const toSim = (e: PointerEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      return { x: ((e.clientX - rect.left) / rect.width) * W, y: ((e.clientY - rect.top) / rect.height) * H };
    };
    let lastMove: Point | null = null;
    let drag: { fish: Fish; to: Point; start: Point; moved: boolean } | null = null;

    const fishAt = (p: Point) =>
      fish.find((f) => f.spine.some((s, i) => Math.hypot(s.x - p.x, s.y - p.y) < f.width * bodyWidth(i / (SEGMENTS - 1)) + 4));

    const onDown = (e: PointerEvent) => {
      const p = toSim(e);

      // Grab a fish. Whether it gets dragged or just tapped is decided on release.
      const f = fishAt(p);
      if (f) {
        drag = { fish: f, to: p, start: p, moved: false };
        f.target = null;
        f.fear = 0;
        canvas.setPointerCapture(e.pointerId);
        canvas.style.cursor = "grabbing";
        return;
      }

      disturb(p.x, p.y, 3, -5);
      for (const o of fish) {
        const d = Math.hypot(o.spine[0].x - p.x, o.spine[0].y - p.y);
        if (d < W * 0.5 && o.fear < 0.2) {
          const a = Math.atan2(o.spine[0].y - p.y, o.spine[0].x - p.x);
          const off = o.length * 0.6;
          o.target = { x: p.x + Math.cos(a) * off, y: p.y + Math.sin(a) * off };
        }
      }
    };

    const onUp = (e: PointerEvent) => {
      if (!drag) return;
      const f = drag.fish;
      if (!drag.moved) {
        // A tap: the fish darts away.
        const head = f.spine[0];
        // Dart away from the tap, but lean towards open water rather than into the edge.
        const away = Math.atan2(head.y - drag.start.y, head.x - drag.start.x) + (rand() - 0.5) * 0.8;
        const toCentre = Math.atan2(H / 2 - head.y, W / 2 - head.x);
        const edgeness = Math.max(Math.abs(head.x / W - 0.5) * 2, Math.abs(head.y / H - 0.5) * 2);
        f.fleeAngle = away + angleDiff(away, toCentre) * Math.min(0.8, edgeness * edgeness);
        f.fear = 1;
        f.speed = Math.max(f.speed, f.length * 0.9);
        disturb(head.x, head.y, 2.5, -2);
      } else {
        f.fear = 0; // let go: it eases back to cruising from wherever it was dropped
      }
      drag = null;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      canvas.style.cursor = fishAt(toSim(e)) ? "grab" : "";
    };

    const onMove = (e: PointerEvent) => {
      const p = toSim(e);
      if (drag) {
        drag.to = p;
        if (Math.hypot(p.x - drag.start.x, p.y - drag.start.y) > 2) drag.moved = true;
        return;
      }
      canvas.style.cursor = fishAt(p) ? "grab" : "";
      if (!lastMove) {
        lastMove = p;
      } else if (Math.hypot(p.x - lastMove.x, p.y - lastMove.y) > 3) {
        disturb(p.x, p.y, 2, e.buttons ? -1.5 : -0.5);
        lastMove = p;
      }
    };

    const onLeave = () => {
      lastMove = null;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    // --- Loop, paused when off screen or in a background tab ---
    let raf = 0;
    let running = false;
    let visible = true;
    let lastTime = 0;
    let acc = 0;
    let nextDrop = 0;

    const frame = (time: number) => {
      if (!running) return;
      acc += Math.min(100, time - (lastTime || time));
      lastTime = time;
      while (acc >= STEP) {
        stepWater();
        stepFish();
        stepLeaves();
        stepPads();
        acc -= STEP;
      }
      if (!reduceMotion && time > nextDrop) {
        disturb(W * (0.2 + rand() * 0.6), H * (0.2 + rand() * 0.6), 2.5, -3);
        nextDrop = time + 1400 + rand() * 2400;
      }
      render(time);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      lastTime = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    render(0);

    const ro = new ResizeObserver(() => { resize(); render(performance.now()); });
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    io.observe(wrap);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const layer = "absolute left-0 top-0";

  return (
    <div ref={wrapRef} className="pond relative overflow-hidden">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Koi swimming in a glowing green pond with floating lotus pads. Tap the water to make ripples, tap a fish to scare it, or drag a fish to move it."
        className={`touch-none ${layer}`}
      />
      {/* Phosphor bloom: a blurred copy of the frame, screened over the top. */}
      <canvas ref={bloomRef} aria-hidden className={`pond-bloom pointer-events-none ${layer}`} />
    </div>
  );
}
