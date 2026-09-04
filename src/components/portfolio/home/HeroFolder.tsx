"use client";
/* eslint-disable @next/next/no-img-element */

import { motion, useReducedMotion, type Transition, type Variants } from "motion/react";

import { content } from "@/content/shreya";
import { cn } from "@/lib/utils";
import type { AssetPack, FolderSheet } from "@/types/portfolio";

// Spec coords are absolute page px at 1440; every value below is already converted
// to an offset inside the folder's own 262x209 box (page origin 582, 387).
const FOLDER_W = 262;
const FOLDER_H = 209;
const FRONT_TOP = 47;
const IMG_BASE = "absolute block object-cover";

const SPRING: Transition = { type: "spring", stiffness: 200, damping: 26 };

const FRONT_VARIANTS: Variants = {
  closed: { rotateX: 0 },
  open: { rotateX: -41.1 },
};

function sheetVariants(sheet: FolderSheet): Variants {
  return {
    closed: { x: 0, y: 0, rotate: sheet.rotate },
    open: { x: sheet.openX, y: sheet.openY, rotate: sheet.openRotate },
  };
}

export function HeroFolder({ pack }: { pack: AssetPack }) {
  const prefersReducedMotion = useReducedMotion();
  const { folder } = pack;

  return (
    <motion.div
      className="relative"
      style={{
        width: FOLDER_W,
        height: FOLDER_H,
        perspective: "2500px",
        perspectiveOrigin: "50% 100%",
      }}
      initial="closed"
      animate="closed"
      whileHover={prefersReducedMotion ? undefined : "open"}
    >
      <div
        className="absolute left-0 top-0 z-0"
        style={{ width: FOLDER_W, height: FOLDER_H, clipPath: folder.backClipPath }}
      >
        <img
          src={folder.back}
          alt=""
          width={FOLDER_W}
          height={FOLDER_H}
          className="block h-full w-full rounded-[8px] object-cover"
        />
      </div>

      {folder.sheets.map((sheet) => (
        <motion.div
          key={sheet.src}
          className="absolute z-[1]"
          style={{ left: 37, top: 38, width: 187, height: 132 }}
          variants={sheetVariants(sheet)}
          transition={SPRING}
        >
          <img
            src={sheet.src}
            alt=""
            width={187}
            height={132}
            className="block h-full w-full rounded-[8px] object-cover"
          />
        </motion.div>
      ))}

      {/* The flap hinges on its bottom edge, so its stickers and label tilt with it. */}
      <motion.div
        className="absolute z-[2]"
        style={{
          left: 0,
          top: FRONT_TOP,
          width: FOLDER_W,
          height: 162,
          transformOrigin: "bottom",
        }}
        variants={FRONT_VARIANTS}
        transition={SPRING}
      >
        <img
          src={folder.flap}
          alt=""
          width={FOLDER_W}
          height={162}
          className={cn(IMG_BASE, "left-0 top-0 rounded-[8px]")}
        />

        {folder.stickers.map((sticker) => (
          <img
            key={sticker.src}
            src={sticker.src}
            alt=""
            width={sticker.width}
            height={sticker.height}
            className={IMG_BASE}
            style={{
              left: sticker.left,
              top: sticker.top,
              width: sticker.width,
              height: sticker.height,
            }}
          />
        ))}

        <img
          src={folder.avatar}
          alt=""
          width={30}
          height={30}
          className={cn(IMG_BASE, "rounded-full")}
          style={{ left: 7, top: 8, width: 30, height: 30 }}
        />

        {/* Live values: Instrument Serif italic 50px/60px #3B4AD6, page (635,437).
            ~209px of flap is available, so the name must stay short. */}
        <span
          className="absolute block whitespace-nowrap italic"
          style={{
            left: 53,
            top: 3,
            fontFamily: "var(--font-display)",
            fontSize: 50,
            lineHeight: "60px",
            color: "var(--additti-blue)",
          }}
        >
          {content.shortName}
        </span>
      </motion.div>
    </motion.div>
  );
}
