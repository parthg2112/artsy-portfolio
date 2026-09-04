"use client";

import { useEffect, useRef } from "react";

/**
 * A lattice that lights up around the pointer and fades out behind it, drawn on a canvas
 * sized to its parent. Used to give the flat butter footer something to do.
 *
 * The canvas is `pointer-events-none` and the listeners go on the parent, so it cannot
 * intercept a click on the CTA pill or the footer links. The rAF parks itself the moment
 * nothing is lit, like the click-spark overlay.
 */

const CELL = 64;
const RADIUS = 150;
const HOLD_MS = 320;
const FADE_MS = 900;

export function CursorGrid({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 0;
    let rows = 0;
    let offX = 0;
    let offY = 0;
    let w = 0;
    let h = 0;
    let alphas = new Float32Array(0);
    let touched = new Float64Array(0);
    let raf = 0;
    let last = 0;
    let ink = "#FF5E00";

    const readInk = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--additti-ink");
      if (v.trim()) ink = v.trim();
    };

    const rebuild = () => {
      w = parent.offsetWidth;
      h = parent.offsetHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      offX = (w - cols * CELL) / 2;
      offY = (h - rows * CELL) / 2;
      alphas = new Float32Array(cols * rows);
      touched = new Float64Array(cols * rows);
    };

    const energise = (px: number, py: number) => {
      const now = performance.now();
      const minC = Math.max(0, Math.floor((px - RADIUS - offX) / CELL));
      const maxC = Math.min(cols - 1, Math.floor((px + RADIUS - offX) / CELL));
      const minR = Math.max(0, Math.floor((py - RADIUS - offY) / CELL));
      const maxR = Math.min(rows - 1, Math.floor((py + RADIUS - offY) / CELL));
      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          const cx = offX + c * CELL + CELL / 2;
          const cy = offY + r * CELL + CELL / 2;
          const d = Math.hypot(cx - px, cy - py);
          if (d > RADIUS) continue;
          const t = 1 - d / RADIUS;
          const level = t * t * (3 - 2 * t);
          const i = r * cols + c;
          if (level > alphas[i]) alphas[i] = level;
          touched[i] = now;
        }
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      ctx.clearRect(0, 0, w, h);

      const step = dt / FADE_MS;
      let alive = false;

      for (let i = 0; i < alphas.length; i++) {
        let a = alphas[i];
        if (a <= 0) continue;
        if (now - touched[i] > HOLD_MS) {
          a = Math.max(0, a - step);
          alphas[i] = a;
          if (a <= 0) continue;
        }
        alive = true;
        const cx = offX + (i % cols) * CELL;
        const cy = offY + Math.floor(i / cols) * CELL;
        ctx.strokeStyle = ink;
        // Halved from 0.55: at full strength the lattice competed with the footer's
        // own text for attention and made the links harder to read.
        ctx.globalAlpha = a * 0.28;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(cx + 0.5, cy + 0.5, CELL - 1, CELL - 1);
      }
      ctx.globalAlpha = 1;

      raf = alive ? requestAnimationFrame(draw) : 0;
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      energise(event.clientX - rect.left, event.clientY - rect.top);
      wake();
    };

    readInk();
    rebuild();
    const ro = new ResizeObserver(rebuild);
    ro.observe(parent);
    parent.addEventListener("pointermove", onMove);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      parent.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`.trim()}
    />
  );
}
