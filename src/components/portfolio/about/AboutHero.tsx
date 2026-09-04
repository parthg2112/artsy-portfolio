"use client";
/* eslint-disable @next/next/no-img-element -- fixed-size Framer art direction, no Next optimization wanted */

import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";

import { RevealText } from "@/components/portfolio/shared/RevealText";
import { content } from "@/content/shreya";
import type { AssetPack } from "@/types/portfolio";
import { SmileyWinkIcon } from "@/components/portfolio/shared/icons";
import { cn } from "@/lib/utils";


// Framer appear effect (__framer__appearAnimationsContent): opacity 0.001→1, scale 0.5→1.
const APPEAR: Transition = {
  type: "tween",
  delay: 0.4,
  duration: 0.4,
  ease: [0.12, 0.23, 0.5, 1],
};


const BODY_CLASS =
  "font-[family-name:var(--font-body)] text-[12px] font-normal leading-[1.6em] tracking-[-0.02em] text-[#FF5E00]";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Envelope/dossier scene authored at 318x398; Cover (z-1) hides the message layers at rest. */
function DossierCard({ pack }: { pack: AssetPack }) {
  return (
    <div className="relative h-full w-full">
      {/* Back - lime board behind the message */}
      <div className="absolute left-[calc(50%-158.5px)] top-[calc(50%-198.5px)] h-[397px] w-[317px] rounded-[20px] bg-[#EBECB0] [transform:perspective(1200px)] [transform-style:preserve-3d]" />

      {/* MESSAGE CAR - the folded letter, two white faces */}
      <div className="absolute left-[calc(50%-133.5px)] top-[calc(50%-166.5px)] z-0 h-[333px] w-[267px] rounded-[20px] [transform:perspective(1200px)] [transform-style:preserve-3d]">
        <div className="absolute inset-0 rounded-[20px] bg-white [transform:perspective(1200px)] [transform-style:preserve-3d]">
          {/* Mirrored: this is the reverse face of the letter */}
          <div className="absolute left-1/2 top-[47%] w-[224px] [transform:translate(-50%,-50%)_rotateY(180deg)]">
            {content.about.dossier.copy.map((line, index) => (
              <p key={line} className={cn(BODY_CLASS, index > 0 && "mt-[20px]")}>
                {line}
              </p>
            ))}
          </div>

          <div className="absolute bottom-[19px] right-[35px] h-[97px] w-[96px] [transform:rotate(5deg)]">
            <div className="h-full w-full [transform:rotate(2deg)]">
              <img
                src={pack.aboutHero.stamp}
                alt=""
                width={96}
                height={97}
                className="block h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 rounded-[20px] bg-white [transform:perspective(1200px)] [transform-style:preserve-3d]">
          <div className="absolute right-[-26px] top-[84px] whitespace-pre [transform:rotate(90deg)]">
            <p className="font-[family-name:var(--font-display)] text-[14px] font-normal leading-[1em] tracking-[0.1em] text-[#141414]">
              {content.about.dossier.stampLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Cover - the photo sleeve that sits on top at rest */}
      <div className="absolute left-[calc(50%-158.5px)] top-[calc(50%-198.5px)] z-[1] h-[397px] w-[317px] rounded-[20px] [box-shadow:inset_0px_3px_2px_0px_rgba(255,255,255,0.2)] [transform:perspective(1200px)] [transform-style:preserve-3d]">
        <img
          src={pack.aboutHero.dossierCover}
          alt=""
          width={317}
          height={397}
          className="absolute inset-0 block h-full w-full rounded-[20px] object-cover"
        />

        <div className="absolute bottom-[31px] left-[22px] flex w-min flex-col items-start gap-[5px]">
          <p className="whitespace-pre font-[family-name:var(--font-display)] text-[30px] font-normal leading-[36px] tracking-[0.1em] text-[#FFFDFC]">
            CONFIDENTIAL FILES
          </p>
          <p className="whitespace-pre font-[family-name:var(--font-body)] text-[14px] font-normal leading-[16.8px] text-[#FFFDFC]">
            Internal use only
          </p>
        </div>

        <div className="absolute left-[219px] top-[26px] h-[27px] w-[86px]">
          <p className="break-words font-[family-name:var(--font-logo)] text-[20px] font-normal leading-[1em] tracking-[-0.1em] text-[#3B4AD6] [font-variation-settings:'wght'_900,'slnt'_-3]">
            {content.about.dossier.brand}
          </p>
        </div>
      </div>
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
  const grabRef = useRef<{ offsetX: number; offsetY: number } | null>(null);
  const [lens, setLens] = useState({ x: LENS_MAX / 2, y: LENS_MAX / 2 });

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const frame = frameRef.current;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      grabRef.current = {
        offsetX: event.clientX - rect.left - (lens.x / 100) * rect.width,
        offsetY: event.clientY - rect.top - (lens.y / 100) * rect.height,
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
      x: clamp(((event.clientX - rect.left - grab.offsetX) / rect.width) * 100, 0, LENS_MAX),
      y: clamp(((event.clientY - rect.top - grab.offsetY) / rect.height) * 100, 0, LENS_MAX),
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
      className="relative h-full min-h-[400px] w-full overflow-hidden rounded-[8px]"
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
        className="absolute h-[55%] w-[55%] cursor-grab touch-none select-none overflow-hidden rounded-[8px] border-[3px] border-[#EBECB0] active:cursor-grabbing"
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
            className="text-right font-[family-name:var(--font-display)] text-[48px] font-normal leading-[1.05em] tracking-[-0.03em] text-[#FF5E00] min-[810px]:text-[90px] min-[1200px]:text-[106px]"
          />
        </div>

        {/* Authored at scale 1 ≥1200px; Framer's tablet appear target is scale 0.7. */}
        <div className="absolute left-[33px] top-[24px] z-[1] h-[398px] w-[318px] max-[809px]:hidden min-[810px]:left-[-29px] min-[810px]:top-[72px] min-[810px]:scale-[0.7] min-[1200px]:left-[33px] min-[1200px]:top-[24px] min-[1200px]:scale-100">
          <motion.div
            className="h-full w-full"
            initial={appearInitial}
            animate={{ opacity: 1, scale: 1 }}
            transition={APPEAR}
          >
            <DossierCard pack={pack} />
          </motion.div>
        </div>

        <motion.div
          className="relative flex w-min shrink-0 items-center justify-center gap-[10px] overflow-clip pr-[20px] max-[809px]:hidden"
          initial={appearInitial}
          animate={{ opacity: 1, scale: 1 }}
          transition={APPEAR}
        >
          <SmileyWinkIcon className="relative block size-[64px] min-[1200px]:size-[69px]" />
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
