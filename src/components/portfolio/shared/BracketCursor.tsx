"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * Four orange corner brackets that snap around whatever `.cursor-target` the pointer is
 * over. Rebuilt on `motion` rather than the shipped gsap version, and changed in two
 * ways on purpose:
 *
 * - **The native cursor stays.** The original sets `document.body.style.cursor = 'none'`
 *   globally. Nothing in this site sets `cursor: pointer` on links, so every clickable
 *   thing relies on the browser default; hiding it would strip the affordance from the
 *   nav, the CTA pill, the cards and the footer links at once, and fight `cursor-grab`
 *   on the /about lens.
 * - **No `mix-blend-mode: difference`**, which goes muddy over cream and orange. The
 *   brackets are just ink-coloured.
 *
 * It tracks the target's box, not the pointer, so it reads as a selection rather than a
 * second cursor.
 */

const BRACKET = 14;
const THICK = 3;
const GAP = 8;

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function BracketCursor({ selector = ".cursor-target" }: { selector?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [box, setBox] = useState<Box | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    // Pointer devices only: there is no hover on touch.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let target: Element | null = null;

    const measure = () => {
      if (!target) return;
      const r = target.getBoundingClientRect();
      setBox({ top: r.top - GAP, left: r.left - GAP, width: r.width + GAP * 2, height: r.height + GAP * 2 });
    };

    const onOver = (event: MouseEvent) => {
      const next = (event.target as Element | null)?.closest?.(selector) ?? null;
      if (next === target) return;
      target = next;
      if (!target) {
        setBox(null);
        return;
      }
      measure();
    };

    const onLeaveWindow = () => {
      target = null;
      setBox(null);
    };

    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeaveWindow);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [selector, prefersReducedMotion]);

  const corners = [
    { top: 0, left: 0, borderWidth: `${THICK}px 0 0 ${THICK}px` },
    { top: 0, right: 0, borderWidth: `${THICK}px ${THICK}px 0 0` },
    { bottom: 0, right: 0, borderWidth: `0 ${THICK}px ${THICK}px 0` },
    { bottom: 0, left: 0, borderWidth: `0 0 ${THICK}px ${THICK}px` },
  ];

  return (
    <AnimatePresence>
      {box ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed z-[45]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1, top: box.top, left: box.left, width: box.width, height: box.height }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.6 }}
        >
          {corners.map((corner, i) => (
            <span
              key={i}
              className="absolute border-ink"
              style={{ ...corner, width: BRACKET, height: BRACKET, borderStyle: "solid" }}
            />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
