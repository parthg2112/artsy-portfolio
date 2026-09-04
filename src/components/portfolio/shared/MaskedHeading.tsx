"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Heading whose letters are a window onto an image: the picture shows through the type
 * and drifts under it as the pointer moves.
 *
 * Rebuilt from the React Bits component rather than pasted. That one ships against gsap
 * and masks with an SVG <clipPath>, which means measuring every word, mirroring the
 * computed font into <text> nodes and re-syncing on resize and font load - roughly eighty
 * lines whose only job is to keep the SVG agreeing with the DOM. `background-clip: text`
 * gets the same result from the layout the browser already did, so the type stays real
 * text: it wraps, it scales with the parent, and it is still selectable and readable to
 * a screen reader.
 *
 * It also degrades honestly. The cream `color` is the base; the transparent fill is
 * applied only inside an @supports guard in globals.css, so a browser without
 * background-clip renders the heading in flat cream instead of nothing at all.
 */

/** Loose enough that the image lags the cursor rather than tracking it. */
const FOLLOW = { stiffness: 90, damping: 22, mass: 0.7 } as const;

interface MaskedHeadingProps {
  text: string;
  src: string;
  /**
   * How far the image is zoomed past the heading box. The overscan is the only room
   * parallax has to travel into, so this must stay above 1 or the edges show through.
   */
  fillScale?: number;
  /** Peak pointer travel, in px. */
  parallax?: number;
  brightness?: number;
  saturation?: number;
  className?: string;
}

export function MaskedHeading({
  text,
  src,
  fillScale = 1.35,
  parallax = 26,
  // The heading sits over the same photograph behind a blue scrim, so the letters have
  // to out-punch their own backdrop to read as a window rather than a smudge.
  brightness = 1.34,
  saturation = 1.4,
  className,
}: MaskedHeadingProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // The wipe and the trigger MUST sit on different elements. A clip-path on the observed
  // element counts against its own intersection area, so watching the clipped span
  // deadlocks: it starts at `inset(0 100% 0 0)`, the observer measures a ratio of 0,
  // the reveal never runs, and the heading stays invisible forever. The outer span is
  // never clipped, so it keeps a real box for the observer to see.
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const revealed = inView || prefersReducedMotion;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, FOLLOW);
  const y = useSpring(rawY, FOLLOW);

  const backgroundPosition = useMotionTemplate`calc(50% + ${x}px) calc(50% + ${y}px)`;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    // The heading lives inside `.scroll-expand__title`, which is `pointer-events: none`,
    // so it can never receive a pointermove of its own. Listening on the window and
    // measuring against the rect sidesteps that instead of punching a hole in the layer.
    const onMove = (event: PointerEvent) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      rawX.set(Math.max(-1, Math.min(1, nx)) * -parallax);
      rawY.set(Math.max(-1, Math.min(1, ny)) * -parallax);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [parallax, prefersReducedMotion, rawX, rawY]);

  return (
    <span ref={ref} className={cn("masked-heading-root", className)}>
      <motion.span
        className="masked-heading"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: `${Math.round(fillScale * 100)}% auto`,
          backgroundPosition,
          // drop-shadow, not text-shadow: the glyph fill is transparent, so a text-shadow
          // would show straight through the letters. drop-shadow works on the already
          // clipped result, giving a true glyph-shaped edge against the photo behind.
          filter: `brightness(${brightness}) saturate(${saturation}) drop-shadow(0 1px 2px color-mix(in srgb, var(--additti-blue) 85%, black)) drop-shadow(0 6px 18px color-mix(in srgb, var(--additti-blue) 70%, black))`,
        }}
        // A wipe rather than the library's default per-word rise: the words here are set
        // on one or two lines inside a sticky stage, and staggering them fights the frame
        // that is already opening behind them.
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: revealed ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 1.05, ease: [0.16, 1, 0.3, 1] }
        }
      >
        {text}
      </motion.span>
    </span>
  );
}
