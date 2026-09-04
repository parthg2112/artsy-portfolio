"use client";
/* eslint-disable @next/next/no-img-element -- fixed-size Framer art direction, no Next optimization wanted */

import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";

import { PixelReveal } from "@/components/portfolio/shared/PixelReveal";
import { RevealText } from "@/components/portfolio/shared/RevealText";
import { content } from "@/content/shreya";
import type { AssetPack } from "@/types/portfolio";
import { Smiley } from "@/components/portfolio/shared/Smiley";
import { cn } from "@/lib/utils";


// Framer appear effect (__framer__appearAnimationsContent): opacity 0.001→1, scale 0.5→1.
const APPEAR: Transition = {
  type: "tween",
  delay: 0.4,
  duration: 0.4,
  ease: [0.12, 0.23, 0.5, 1],
};



function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Art card in the top-left of /about, authored at 318x398.
 *
 * This was a three-layer dossier scene - a lime board, a folded letter carrying
 * copy on its reverse, and a cover on top. The card never flips on this page, so
 * every one of those layers was permanently hidden behind the cover; all that ever
 * rendered was the cover image. It is a single framed image now.
 */
function ArtCard({ pack }: { pack: AssetPack }) {
  return (
    <div className="relative h-full w-full">
      <PixelReveal
        frontSrc={pack.aboutHero.dossierCover}
        backSrc={pack.aboutHero.artReveal}
        alt={`Artwork, dissolving to a portrait of ${content.name}`}
        className="absolute left-[calc(50%-158.5px)] top-[calc(50%-198.5px)] h-[397px] w-[317px] rounded-[20px] border-[3px] border-ink shadow-[0_18px_44px_-18px_color-mix(in_srgb,var(--additti-blue)_60%,transparent)]"
      />
    </div>
  );
}

const LENS_RATIO = 0.55;
const LENS_BORDER = 3;
const LENS_MAX = 100 * (1 - LENS_RATIO);

interface Frame {
  src: string;
  breakpointClass: string;
}

function framesFor(pack: AssetPack): readonly Frame[] {
  return [
    { src: pack.aboutHero.lensDesktop, breakpointClass: "max-[809px]:hidden" },
    { src: pack.aboutHero.lensMobile, breakpointClass: "min-[810px]:hidden" },
  ];
}

// Sizes are expressed against the lens' own content box so no measurement is needed:
// 100% here is (lensSize - 2*border), so the full frame is (100% + 2*border) / LENS_RATIO.
const FRAME_SPAN = `calc((100% + ${LENS_BORDER * 2}px) / ${LENS_RATIO})`;

function cloneOffset(percent: number) {
  return `calc(0px - ${LENS_BORDER}px - (100% + ${LENS_BORDER * 2}px) * ${percent / 100 / LENS_RATIO})`;
}

/** Framer code component: blurred+dimmed backdrop with a draggable lime-bordered lens. */
function LensImage({ pack }: { pack: AssetPack }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const grabRef = useRef<{ fx: number; fy: number } | null>(null);
  const [lens, setLens] = useState({ x: LENS_MAX / 2, y: LENS_MAX / 2 });

  // The grab offset is stored as a FRACTION of the frame, not pixels. The frame carries a
  // hover scale, so its rect can still be changing when a drag starts; a pixel offset
  // frozen at pointerdown would then be measured against a different box every frame and
  // the lens would jump. A fraction is dimensionless and survives the resize.
  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const frame = frameRef.current;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      grabRef.current = {
        fx: (event.clientX - rect.left) / rect.width - lens.x / 100,
        fy: (event.clientY - rect.top) / rect.height - lens.y / 100,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [lens.x, lens.y],
  );

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const grab = grabRef.current;
    const frame = frameRef.current;
    if (!grab || !frame) return;
    const rect = frame.getBoundingClientRect();
    setLens({
      x: clamp(((event.clientX - rect.left) / rect.width - grab.fx) * 100, 0, LENS_MAX),
      y: clamp(((event.clientY - rect.top) / rect.height - grab.fy) * 100, 0, LENS_MAX),
    });
  }, []);

  const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    grabRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  return (
    <div
      ref={frameRef}
      /* The scale goes on the frame, never on the images: the blurred base and the sharp
         clone inside the lens are separate layers that only register because they share
         one untransformed box. Scaling either alone desynchronises the peephole. */
      className={cn(
        "relative h-full min-h-[400px] w-full overflow-hidden rounded-[8px]",
        // Long expo-out rather than a short ease-out: at 300ms a 1.5% scale reads as a
        // hard step. Same curve the polaroid reveal uses.
        "transition-[transform,box-shadow] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:scale-[1.035] hover:shadow-[0_28px_70px_-22px_color-mix(in_srgb,var(--additti-blue)_55%,transparent)]",
        "motion-reduce:transition-none motion-reduce:hover:scale-100",
      )}
    >
      {framesFor(pack).map((frame) => (
        <img
          key={frame.src}
          src={frame.src}
          alt={pack.aboutHero.lensAlt}
          width={1280}
          height={720}
          /* Native image-drag would fight the lens' pointer capture. */
          draggable={false}
          className={cn(
            "absolute inset-0 block h-full w-full rounded-[8px] object-cover",
            frame.breakpointClass,
          )}
        />
      ))}

      <div className="absolute inset-0 bg-black/50 backdrop-blur-[5px]" />

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute h-[55%] w-[55%] cursor-grab touch-none select-none overflow-hidden rounded-[8px] border-[3px] border-lime active:cursor-grabbing"
        style={{ left: `${lens.x}%`, top: `${lens.y}%` }}
      >
        {framesFor(pack).map((frame) => (
          <img
            key={frame.src}
            src={frame.src}
            alt=""
            width={1280}
            height={720}
            draggable={false}
            className={cn("absolute block max-w-none object-cover", frame.breakpointClass)}
            style={{
              width: FRAME_SPAN,
              height: FRAME_SPAN,
              left: cloneOffset(lens.x),
              top: cloneOffset(lens.y),
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function AboutHero({ pack }: { pack: AssetPack }) {
  const prefersReducedMotion = useReducedMotion();
  const appearInitial = prefersReducedMotion ? undefined : { opacity: 0.001, scale: 0.5 };

  return (
    <section className="relative z-[2] flex h-min w-full items-center justify-center gap-[10px] overflow-clip px-[40px] pb-[40px] pt-[240px] max-[809px]:px-[16px] max-[809px]:pb-[56px] max-[809px]:pt-[160px]">
      <div className="relative flex h-min w-px max-w-[1600px] flex-col items-end justify-start gap-[40px] overflow-clip max-[809px]:gap-[24px] [flex:1_0_0]">
        <div className="relative w-full max-w-[800px] whitespace-pre-wrap break-words">
          <RevealText
            as="h1"
            text={content.about.heading}
            className="text-right font-[family-name:var(--font-display)] text-[48px] font-normal leading-[1.05em] tracking-[-0.03em] text-ink min-[810px]:text-[90px] min-[1200px]:text-[106px]"
          />
        </div>

        {/* Authored at scale 1 ≥1200px; Framer's tablet appear target is scale 0.7. */}
        <div className="absolute left-[33px] top-[24px] z-[1] h-[398px] w-[318px] max-[809px]:hidden min-[810px]:left-[-29px] min-[810px]:top-[72px] min-[810px]:scale-[0.7] min-[1200px]:left-[33px] min-[1200px]:top-[24px] min-[1200px]:scale-100">
          {/* Hover has to be a motion prop, not a Tailwind class: motion writes `transform`
              inline for the appear animation and an inline transform beats any class. */}
          <motion.div
            className="h-full w-full"
            initial={appearInitial}
            animate={{ opacity: 1, scale: 1 }}
            transition={APPEAR}
            whileHover={prefersReducedMotion ? undefined : { y: -8, rotate: -1.5 }}
          >
            <ArtCard pack={pack} />
          </motion.div>
        </div>

        <motion.div
          className="relative flex w-min shrink-0 items-center justify-center gap-[10px] overflow-clip pr-[20px] max-[809px]:hidden"
          initial={appearInitial}
          animate={{ opacity: 1, scale: 1 }}
          transition={APPEAR}
        >
          <Smiley icon="wink" className="relative block size-[64px] min-[1200px]:size-[69px]" />
        </motion.div>

        <motion.div
          className="relative flex h-[720px] w-full shrink-0 items-center justify-center gap-[10px] overflow-clip rounded-[8px] max-[809px]:h-[320px]"
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={APPEAR}
        >
          <div className="relative h-full w-px [flex:1_0_0]">
            <LensImage pack={pack} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
