"use client";

/* eslint-disable @next/next/no-img-element -- decorative preview, no Next sizing wanted */

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

import { RevealText } from "@/components/portfolio/shared/RevealText";
import { content } from "@/content/shreya";
import type { AssetPack } from "@/types/portfolio";

const SERVICES_HEADING = "Things I am good at";

/** Lag, not lock - the preview trails the pointer rather than being pinned to it. */
const FOLLOW = { stiffness: 140, damping: 20, mass: 0.6 } as const;
const PREVIEW_W = 240;

export function ServicesSection({ pack }: { pack: AssetPack }) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, FOLLOW);
  const sy = useSpring(y, FOLLOW);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      x.set(event.clientX - rect.left);
      y.set(event.clientY - rect.top);
    },
    [x, y],
  );

  // Without the jump the springs start at the section's origin, so the first hover
  // flings the preview in from the top-left corner instead of appearing under the
  // cursor. Snap the position, then let the spring take over for the movement.
  const onRowEnter = useCallback(
    (index: number) => (event: React.PointerEvent<HTMLElement>) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        const px = event.clientX - rect.left;
        const py = event.clientY - rect.top;
        x.set(px);
        y.set(py);
        if (active === null) {
          sx.jump(px);
          sy.jump(py);
        }
      }
      setActive(index);
    },
    [active, sx, sy, x, y],
  );

  const enabled = !prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      id="skills"
      onPointerMove={enabled ? onPointerMove : undefined}
      onPointerLeave={enabled ? () => setActive(null) : undefined}
      className="relative z-[2] flex items-center justify-center overflow-clip px-[16px] pt-[56px] pb-[80px] min-[810px]:px-[40px] min-[810px]:pt-[80px] min-[810px]:pb-[160px]"
    >
      <div className="flex w-full max-w-[1600px] flex-col items-start justify-center gap-[40px] min-[810px]:items-end">
        <div className="flex w-full max-w-full flex-col items-start justify-start gap-[28px] min-[810px]:max-w-[75%] min-[810px]:gap-[40px]">
          <div className="relative z-[2] flex w-full max-w-[720px] flex-col">
            <RevealText
              as="h2"
              text={SERVICES_HEADING}
              className="font-display text-ink text-[40px] leading-[46px] font-normal tracking-[-0.4px] min-[810px]:text-[96px] min-[810px]:leading-[100.8px] min-[810px]:tracking-[-0.96px]"
            />
          </div>

          <div className="flex w-full flex-col items-center justify-end">
            {content.services.map((service, i) => (
              <div
                key={service.index}
                onPointerEnter={enabled ? onRowEnter(i) : undefined}
                /* `cursor-target` is what BracketCursor locks onto. */
                className="cursor-target relative flex w-full flex-col items-start justify-center gap-[12px] py-[20px] min-[810px]:flex-row min-[810px]:gap-0 min-[810px]:py-[28px] min-[810px]:pr-[40px]"
              >
                {/* Mobile: title 28/36.4 with the index inline; description stays 320px wide. */}
                <div className="flex h-[36.4px] w-full min-w-0 flex-row items-start justify-start gap-[10px] overflow-clip min-[810px]:h-[46px] min-[810px]:flex-1">
                  <h4 className="font-display text-ink text-[28px] leading-[36.4px] font-normal tracking-[-0.4px] min-[810px]:text-[40px] min-[810px]:leading-[46px]">
                    {service.title}
                  </h4>
                  <p className="font-body text-blue text-[16px] leading-[22.4px] font-normal">
                    {service.index}
                  </p>
                </div>
                <p className="font-body text-blue w-full max-w-[320px] text-[16px] leading-[22.4px] font-normal min-[810px]:w-[320px] min-[810px]:shrink-0">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* One preview for all three rows, parked at section level so a row's own
          `overflow-clip` title cluster cannot crop it. Desktop pointers only - touch has
          no hover, so it would only ever flash on tap. */}
      <AnimatePresence>
        {enabled && active !== null ? (
          <motion.div
            key={active}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-[3] hidden overflow-hidden rounded-lg border-[3px] border-ink shadow-[0_20px_50px_-18px_color-mix(in_srgb,var(--additti-blue)_55%,transparent)] min-[810px]:block"
            style={{ x: sx, y: sy, width: PREVIEW_W, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0, scale: 0.88, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            exit={{ opacity: 0, scale: 0.9, rotate: -4 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={pack.projectCovers[content.services[active].coverIndex].src}
              alt=""
              draggable={false}
              className="block w-full"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
