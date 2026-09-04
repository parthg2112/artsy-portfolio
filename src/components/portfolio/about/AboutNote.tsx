"use client";

/* eslint-disable @next/next/no-img-element -- fixed-size prop, no Next optimization wanted */

import { motion, useReducedMotion } from "motion/react";

import { content } from "@/content/shreya";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types/portfolio";

/** Resting tilt. The reveal starts further over and settles here. */
const REST_ROTATE = -3;

/**
 * A taped polaroid that breaks up the /about paragraphs. Rendered as a span so it is
 * valid inside the heading on mobile, where it sits between the two paragraphs; on
 * desktop the same component sits in the empty gutter beside them.
 */
export function AboutNote({ photo, className }: { photo: ImageAsset; className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18, rotate: REST_ROTATE - 5 },
        whileInView: { opacity: 1, y: 0, rotate: REST_ROTATE },
        viewport: { once: true, amount: 0.4 },
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
        whileHover: { rotate: 0, scale: 1.02 },
      };

  return (
    <motion.span
      aria-hidden="true"
      /* The caption wraps to two lines, so the bottom edge is sized to hold both. */
      className={cn(
        "relative block w-fit shrink-0 bg-white p-3 pb-[68px] shadow-md min-[810px]:pb-[52px]",
        className,
      )}
      style={{ rotate: REST_ROTATE }}
      {...motionProps}
    >
      {/* Washi tape over the top corners. */}
      <span className="pointer-events-none absolute -top-2 -left-3 block h-5 w-16 rotate-[-8deg] bg-ink/20" />
      <span className="pointer-events-none absolute -top-2 -right-3 block h-5 w-16 rotate-[7deg] bg-blue/20" />

      <img
        src={photo.src}
        alt=""
        width={photo.width}
        height={photo.height}
        draggable={false}
        className="block h-[168px] w-[168px] object-cover min-[810px]:h-[210px] min-[810px]:w-[210px]"
      />

      <span className="absolute right-3 bottom-3 left-3 block text-center font-[family-name:var(--font-logo)] text-[15px] leading-[20px] tracking-[-0.02em] text-blue min-[810px]:text-[17px]">
        {content.about.noteCaption}
      </span>
    </motion.span>
  );
}
