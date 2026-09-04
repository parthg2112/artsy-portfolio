"use client";

/* eslint-disable @next/next/no-img-element -- decorative, repeated, transform-animated track */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import type { AssetPack } from "@/types/portfolio";

// A quiet background band, not a feature: the cards are small, slightly faded and
// sit behind the work grid in the reading order. Sizes keep the badges' 0.715 ratio.
const DESKTOP = { w: 132, h: 184 };
const MOBILE = { w: 92, h: 128 };
const GAP = 10;
const SPEED = 42; // px per second

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
      className="flex shrink-0"
      style={{ height: size.h, gap: GAP }}
      aria-hidden={hidden ? "true" : undefined}
    >
      {srcs.map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          width={size.w}
          height={size.h}
          draggable={false}
          className="shrink-0 object-cover"
          style={{ width: size.w, height: size.h }}
        />
      ))}
    </div>
  );
}

export function StickerMarquee({ pack }: { pack: AssetPack }) {
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const size = isDesktop ? DESKTOP : MOBILE;
  const srcs = pack.stickers;

  // One track plus the seam gap, so the duplicate lands exactly where the original was.
  const distance = srcs.length * size.w + srcs.length * GAP;
  const duration = distance / SPEED;

  return (
    <section
      aria-hidden="true"
      className="relative w-full overflow-hidden opacity-70"
      style={{ height: size.h }}
    >
      <motion.div
        className="flex w-max"
        style={{ gap: GAP }}
        animate={prefersReducedMotion ? undefined : { x: [0, -distance] }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration, ease: "linear", repeat: Infinity, repeatType: "loop" }
        }
      >
        <CardStack srcs={srcs} size={size} />
        <CardStack srcs={srcs} size={size} hidden />
      </motion.div>
    </section>
  );
}
