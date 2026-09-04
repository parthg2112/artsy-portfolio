"use client";

/* eslint-disable @next/next/no-img-element -- authored fixed-size chips, no Next optimization wanted */

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import { content } from "@/content/shreya";
import {
  SmileyOutlineIcon,
  SmileyWinkIcon,
} from "@/components/portfolio/shared/icons";
import { cn } from "@/lib/utils";
import type { AssetPack } from "@/types/portfolio";

const CYCLE_MS = 935;
const ROW_HEIGHT = 136;

const TEXT_CLASS =
  "flex h-[136px] shrink-0 items-center justify-center whitespace-nowrap font-[family-name:var(--font-display)] text-[106px] font-normal leading-[100.7px] tracking-[-3.18px] text-[#FF5E00]";

/** All three sources stay mounted (preloaded); only visibility toggles, so the swap is a hard cut. */
function Chip({ srcs, index }: { srcs: string[]; index: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative z-[1] block h-[76px] w-[140px] shrink-0 scale-[1.3] overflow-hidden rounded-[4px]"
    >
      {srcs.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          width={140}
          height={76}
          draggable={false}
          className="absolute inset-0 h-full w-full rounded-[4px] object-cover"
          style={{ visibility: i === index ? "visible" : "hidden" }}
        />
      ))}
    </span>
  );
}

export function HeroHeading({ pack }: { pack: AssetPack }) {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % 3), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [prefersReducedMotion]);

  const activeIndex = prefersReducedMotion ? 0 : index;
  const { slots, ariaLabel, rows } = content.hero;

  return (
    <h1
      aria-label={ariaLabel}
      // The block is scaled about its centre, so at the mobile scale the authored
      // top of 86px pushes its last row past the hero's clip. -24px pulls it back in.
      className="absolute top-[86px] z-[4] m-0 flex w-[990px] flex-wrap items-center justify-center gap-x-[16px] gap-y-0 max-[809px]:left-1/2 max-[809px]:top-[-24px] min-[810px]:left-[73%]"
      style={{
        height: rows * ROW_HEIGHT,
        transform: "translateX(-50%) scale(var(--additti-heading-scale))",
        transformOrigin: "50% 50%",
      }}
    >
      {slots.map((slot, i) => {
        if (slot.kind === "word") {
          return (
            <span
              key={`w-${i}`}
              className={cn(TEXT_CLASS, slot.word.italic && "italic")}
              style={{ width: slot.word.width }}
            >
              {slot.word.text}
            </span>
          );
        }
        if (slot.kind === "chip") {
          return (
            <Chip key={`c-${i}`} srcs={pack.headingChips[slot.slot]} index={activeIndex} />
          );
        }
        const Icon = slot.icon === "wink" ? SmileyWinkIcon : SmileyOutlineIcon;
        return (
          <span
            key={`e-${i}`}
            aria-hidden="true"
            className="z-[2] block shrink-0 text-[#3B4AD6]"
            style={{ width: slot.size, height: slot.size }}
          >
            <Icon className="h-full w-full" />
          </span>
        );
      })}
    </h1>
  );
}
