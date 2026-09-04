"use client";

/* eslint-disable @next/next/no-img-element -- full-bleed art direction, no Next sizing wanted */

import { useEffect, useRef } from "react";

/**
 * A frame that opens from a small card to full bleed as the page scrolls past it, then
 * releases. Ported from React Bits to TypeScript; its stylesheet lives in globals.css
 * because this project keeps a single stylesheet.
 *
 * The stage is `position: sticky`. That works here only because each page root uses
 * `overflow-x: clip` (which leaves `overflow-y: visible`) rather than `overflow: hidden`,
 * which would make the root a scroll container and pin the stage to it instead.
 *
 * The original mirrored its props into a ref rewritten during render; here the tuning
 * numbers are plain effect dependencies instead, so the effect simply re-runs if they
 * ever change and nothing is written during render.
 */

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

interface ScrollExpandProps {
  src: string;
  alt?: string;
  /** Node, not string, so the title can carry its own treatment (see MaskedHeading). */
  title?: React.ReactNode;
  scrollHint?: string;
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  scrollDistance?: number;
  holdDistance?: number;
  smoothing?: number;
  overlayScrim?: number;
  children?: React.ReactNode;
  className?: string;
}

export function ScrollExpand({
  src,
  alt = "",
  title = "",
  scrollHint = "",
  // Landscape at rest: the source is 2.23:1, so a portrait card would crop it to an
  // extreme close-up before the expansion even starts.
  startWidth = 56,
  startHeight = 46,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.15,
  // Tuned down from the 1.2 / 0.35 defaults: the track is stageHeight * (1 + distance +
  // hold), so every extra tenth costs a tenth of a viewport of page length.
  scrollDistance = 0.9,
  holdDistance = 0.2,
  smoothing = 0.1,
  overlayScrim = 0.72,
  children,
  className = "",
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!root || !track || !stage || !frame || !media) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;

    const apply = (p: number) => {
      const e = smoothstep(0, 1, p);

      const w = startWidth + (100 - startWidth) * e;
      const h = startHeight + (100 - startHeight) * e;
      const ix = Math.max(0, (100 - w) / 2);
      const iy = Math.max(0, (100 - h) / 2);
      const r = startRadius + (endRadius - startRadius) * e;
      frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;

      media.style.transform = `scale(${mediaZoom + (1 - mediaZoom) * e})`;

      // The scrim never goes fully clear: the display type sits on the picture at rest and
      // needs something behind it to read against. The floor was 0.55; the title is now
      // filled with this same photograph, so the backdrop has to be pushed further from
      // the letters or the two read as one flat wash.
      if (scrimRef.current) scrimRef.current.style.opacity = `${overlayScrim * (0.78 + 0.22 * e)}`;

      if (titleRef.current) {
        const out = smoothstep(0.4, 0.88, p);
        titleRef.current.style.opacity = `${1 - out}`;
        titleRef.current.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`;
      }

      if (hintRef.current) {
        const gone = smoothstep(0, 0.12, p);
        hintRef.current.style.opacity = `${1 - gone}`;
        hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
      }

      if (overlayRef.current) {
        const inn = smoothstep(0.68, 1, p);
        overlayRef.current.style.opacity = `${inn}`;
        overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`;
      }
    };

    const measure = () => {
      stageH = window.innerHeight;
      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      track.style.height = `${stageH * (1 + Math.max(0, scrollDistance) + Math.max(0, holdDistance))}px`;
      stage.style.setProperty(
        "--se-title-size",
        `${clamp((root.clientWidth || stageH) * 0.075, 20, 84)}px`,
      );
    };

    const readProgress = () =>
      clamp(-track.getBoundingClientRect().top / (stageH * Math.max(0.01, scrollDistance)), 0, 1);

    const tick = () => {
      const k = smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      apply(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const onScroll = () => {
      target = readProgress();
      if (smoothing <= 0 || reduceMotion) {
        current = target;
        apply(current);
        return;
      }
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      apply(current);
    };

    onResize();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
  ]);

  return (
    <div ref={rootRef} className={`scroll-expand ${className}`.trim()}>
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            <img ref={mediaRef} className="scroll-expand__media" src={src} alt={alt} draggable={false} />
            <div ref={scrimRef} className="scroll-expand__scrim" />
            {children ? (
              <div ref={overlayRef} className="scroll-expand__overlay">
                {children}
              </div>
            ) : null}
          </div>
          {title ? (
            <div ref={titleRef} className="scroll-expand__title">
              {title}
            </div>
          ) : null}
          {scrollHint ? (
            <div ref={hintRef} className="scroll-expand__hint">
              {scrollHint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
