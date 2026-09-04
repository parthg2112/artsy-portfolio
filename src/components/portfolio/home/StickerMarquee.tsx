"use client";

/* eslint-disable @next/next/no-img-element -- decorative, repeated, transform-animated track */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import type { AssetPack } from "@/types/portfolio";

// A quiet background band, not a feature: the cards are small, slightly faded and
// sit behind the work grid in the reading order. Sizes keep the badges' 0.715 ratio.
const DESKTOP = { w: 132, h: 150 };
const MOBILE = { w: 92, h: 104 };
// 10px read as congested - the cards became one continuous band rather than a scatter.
const GAP = 38;
const SPEED = 42; // px per second

// Pinned per index rather than random so both copies of the stack tilt identically and
// the loop seam stays invisible. Transforms only, so the loop maths is untouched.
const TILT = [-5, 3, -2, 4.5, -3.5, 2, -4, 3.5];
const DRIFT = [0, -12, 7, -5, 11, -8, 4, -10];
/** Room for the tilt and the vertical drift so neither is clipped by the band. */
const BAND_PAD = 52;

const DESKTOP_QUERY = "(min-width: 810px)";

function CardStack({
  srcs,
  size,
  hidden = false,
}: {
  srcs: string[];
  size: { w: number; h: number };
  hidden?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center"
      style={{ height: size.h + BAND_PAD, gap: GAP }}
      aria-hidden={hidden ? "true" : undefined}
    >
      {srcs.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          width={size.w}
          height={size.h}
          draggable={false}
          /* Rest and hover both write the same `transform`, driven off two custom
             properties, so neither an inline style nor a utility can clobber the other. */
          className={cn(
            "shrink-0 object-contain transition-transform duration-300 ease-out",
            "[transform:translateY(var(--drift))_rotate(var(--tilt))]",
            "hover:[transform:translateY(0)_rotate(0deg)_scale(1.08)]",
            "motion-reduce:transition-none",
          )}
          style={
            {
              width: size.w,
              height: size.h,
              "--tilt": `${TILT[i % TILT.length]}deg`,
              "--drift": `${DRIFT[i % DRIFT.length]}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function StickerMarquee({ pack }: { pack: AssetPack }) {
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(true);
  const bandRef = useRef<HTMLElement>(null);
  const [bandWidth, setBandWidth] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = bandRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setBandWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const size = isDesktop ? DESKTOP : MOBILE;
  const srcs = pack.stickers;

  // One stack plus the seam gap, so the duplicate lands exactly where the original was.
  const distance = srcs.length * size.w + srcs.length * GAP;
  const stackWidth = srcs.length * size.w + (srcs.length - 1) * GAP;

  // Two copies are not enough. After translating by `distance` only one stack is left to
  // show, so any viewport wider than a stack - 1126px on desktop, i.e. every desktop -
  // runs out of track before the loop restarts and the band ends mid-air. Carry enough
  // copies that what remains after the translate still fills the band.
  const copies = Math.max(2, Math.ceil(bandWidth / stackWidth) + 1);

  return (
    <section
      ref={bandRef}
      aria-hidden="true"
      /* Margin on the band itself rather than padding on the hero or the work grid,
         both of whose spacing is measured against the reference layout. */
      className="relative my-10 w-full overflow-hidden opacity-90 min-[810px]:my-16"
      style={{ height: size.h + BAND_PAD }}
    >
      <motion.div
        className="flex w-max items-center"
        style={{ gap: GAP }}
        animate={prefersReducedMotion ? undefined : { x: [0, -distance] }}
        transition={
          prefersReducedMotion
            ? undefined
            : {
                duration: distance / SPEED,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }
        }
      >
        {Array.from({ length: copies }, (_, i) => (
          <CardStack key={i} srcs={srcs} size={size} hidden={i > 0} />
        ))}
      </motion.div>
    </section>
  );
}
