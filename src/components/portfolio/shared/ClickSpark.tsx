"use client";

import { useEffect, useRef } from "react";

/**
 * Hearts and stars burst wherever the page is clicked, and a grid-snapped trail of small
 * stars follows the pointer. Both are drawn in a soft rose at low opacity so they read as
 * a flourish rather than a notification.
 *
 * Rebuilt from the React Bits component rather than dropped in. That one wraps the page
 * in a `height: 100%` div and sizes its canvas to that box - here `<body>` is
 * `min-h-full` with no definite height, so the wrapper would collapse to `auto` and the
 * canvas would never cover anything; and had it resolved, the canvas would have been
 * sized to the whole 1440x6000 document. This is a viewport-fixed overlay instead:
 * one screen-sized canvas, click coordinates read straight from the viewport, and the
 * animation loop parked whenever no sparks are alive.
 */

const SPARK_COUNT = 7;
const SPARK_SIZE = 9;
const SPARK_RADIUS = 26;
const DURATION = 620;

/**
 * A deeper rose than the blush ground it sits on. The first attempt used the grid's own
 * pale pink and all but vanished against `--additti-paper` (#fbeef0) - a decorative
 * flourish still has to be visible.
 */
const PINK = "223, 82, 138";

/** Five-pointed star, centred on (x, y). */
function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, turn: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.44;
    const a = turn + (Math.PI * i) / 5 - Math.PI / 2;
    const px = x + Math.cos(a) * radius;
    const py = y + Math.sin(a) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/** Heart, centred on (x, y), sized so `r` is roughly the half-width. */
function heart(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, turn: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(turn);
  ctx.scale(r / 16, r / 16);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(-2, 2, -14, -2, -14, -9);
  ctx.bezierCurveTo(-14, -15, -8, -18, 0, -10);
  ctx.bezierCurveTo(8, -18, 14, -15, 14, -9);
  ctx.bezierCurveTo(14, -2, 2, 2, 0, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Pointer trail. Snapped to a grid so it reads as pixels rather than a smear, and drawn
// on this same canvas rather than a second overlay - the alternative was three.js, which
// would have cost more in bundle than the whole rest of the site's JS.
const TRAIL_CELL = 22;
const TRAIL_LIFE = 620;
const TRAIL_MAX = 90;

/** Anything can request a burst at a point: `sparkAt(x, y)`. */
const SPARK_EVENT = "additti:spark";

export function sparkAt(x: number, y: number) {
  window.dispatchEvent(new CustomEvent(SPARK_EVENT, { detail: { x, y } }));
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  start: number;
  heart: boolean;
}

interface Dot {
  x: number;
  y: number;
  start: number;
}

export function ClickSpark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Mouse users only, and never when reduced motion is requested. `(pointer: fine)`
    // targets an actual pointing device rather than guessing from viewport width.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sparks: Spark[] = [];
    const trail: Dot[] = [];
    let raf = 0;
    let lastCell = "";

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        const t = (now - spark.start) / DURATION;
        if (t >= 1) {
          sparks.splice(i, 1);
          continue;
        }
        const eased = t * (2 - t); // ease-out
        const distance = eased * SPARK_RADIUS;
        const px = spark.x + distance * Math.cos(spark.angle);
        const py = spark.y + distance * Math.sin(spark.angle) + eased * eased * 10; // a little gravity
        const size = SPARK_SIZE * (1 - eased * 0.55);

        ctx.fillStyle = `rgba(${PINK}, ${(1 - eased) * 0.85})`;
        if (spark.heart) heart(ctx, px, py, size, spark.angle * 0.3);
        else star(ctx, px, py, size, spark.angle);
      }
      for (let i = trail.length - 1; i >= 0; i--) {
        const dot = trail[i];
        const t = (now - dot.start) / TRAIL_LIFE;
        if (t >= 1) {
          trail.splice(i, 1);
          continue;
        }
        const size = TRAIL_CELL * 0.3 * (1 - t);
        ctx.fillStyle = `rgba(${PINK}, ${(1 - t) * 0.45})`;
        star(ctx, dot.x, dot.y, size, t * 2);
      }
      ctx.globalAlpha = 1;

      // Park the loop when there is nothing left to draw instead of spinning forever.
      raf = sparks.length || trail.length ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (event: MouseEvent) => {
      // Snap to the grid and only emit when the pointer crosses into a new cell, so a
      // slow drag does not stack dozens of dots in one spot.
      const gx = Math.round(event.clientX / TRAIL_CELL) * TRAIL_CELL;
      const gy = Math.round(event.clientY / TRAIL_CELL) * TRAIL_CELL;
      const cell = `${gx},${gy}`;
      if (cell === lastCell) return;
      lastCell = cell;
      trail.push({ x: gx, y: gy, start: performance.now() });
      if (trail.length > TRAIL_MAX) trail.shift();
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const burst = (cx: number, cy: number) => {
      const now = performance.now();
      for (let i = 0; i < SPARK_COUNT; i++) {
        sparks.push({
          x: cx,
          y: cy,
          angle: (2 * Math.PI * i) / SPARK_COUNT,
          start: now,
          heart: i % 2 === 0,
        });
      }
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onClick = (event: MouseEvent) => burst(event.clientX, event.clientY);

    // Lets anything on the page ask for the same burst - the smileys fire it on hover -
    // without a second canvas or a shared React context.
    const onRequest = (event: Event) => {
      const detail = (event as CustomEvent<{ x: number; y: number }>).detail;
      if (detail) burst(detail.x, detail.y);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("click", onClick);
    document.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener(SPARK_EVENT, onRequest);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("click", onClick);
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener(SPARK_EVENT, onRequest);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
