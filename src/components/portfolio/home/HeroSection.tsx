"use client";

/* eslint-disable @next/next/no-img-element -- fixed-size Framer assets, no Next optimization wanted */

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import type { AssetPack } from "@/types/portfolio";

import { HeroFolder } from "./HeroFolder";
import { HeroHeading } from "./HeroHeading";

interface PlaneKeyframes {
  scale: number[];
  rotate: number[];
  x: number[];
  y: number[];
}

// Measured matrices at scrollY 0 / 200 / 400 / 600 / 900 over the hero's own 900px height.
const STOPS: number[] = [0, 0.22, 0.44, 0.67, 1];

const PLANE: PlaneKeyframes = {
  scale: [1.249, 1.1939, 1.149, 1.0913, 1],
  rotate: [-4.98, -3.88, -2.99, -1.83, 0],
  x: [1230.9, 903.5, 638.1, 294, -249],
  y: [-962.3, -813.6, -693, -536.7, -290],
};

const SHADOW: PlaneKeyframes = {
  scale: [0.7693, 0.7311, 0.7, 0.7, 0.7],
  rotate: [-1.98, -0.89, 0, 0, 0],
  x: [639.4, 315.3, 52.6, 51, 51],
  y: [-257.3, -110.1, 9.3, 10, 10],
};

function restingStyle(frames: PlaneKeyframes) {
  return {
    scale: frames.scale[0],
    rotate: frames.rotate[0],
    x: frames.x[0],
    y: frames.y[0],
  };
}

export function HeroSection({ pack }: { pack: AssetPack }) {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const planeScale = useTransform(scrollYProgress, STOPS, PLANE.scale);
  const planeRotate = useTransform(scrollYProgress, STOPS, PLANE.rotate);
  const planeX = useTransform(scrollYProgress, STOPS, PLANE.x);
  const planeY = useTransform(scrollYProgress, STOPS, PLANE.y);

  const shadowScale = useTransform(scrollYProgress, STOPS, SHADOW.scale);
  const shadowRotate = useTransform(scrollYProgress, STOPS, SHADOW.rotate);
  const shadowX = useTransform(scrollYProgress, STOPS, SHADOW.x);
  const shadowY = useTransform(scrollYProgress, STOPS, SHADOW.y);

  const planeStyle = prefersReducedMotion
    ? restingStyle(PLANE)
    : { scale: planeScale, rotate: planeRotate, x: planeX, y: planeY };

  const shadowStyle = prefersReducedMotion
    ? restingStyle(SHADOW)
    : { scale: shadowScale, rotate: shadowRotate, x: shadowX, y: shadowY };

  return (
    <section
      ref={heroRef}
      className="relative z-[2] flex h-[506.4px] items-center justify-center overflow-clip px-[16px] pt-[120px] pb-[56px] min-[810px]:h-[900px] min-[810px]:px-[40px] min-[810px]:pt-[160px] min-[810px]:pb-[80px]"
    >
      {/* Decorative layer keeps hero-relative coordinates; shrunk as one group below 810px. */}
      <div className="pointer-events-none absolute inset-0 max-[809px]:origin-top-left max-[809px]:scale-[0.42]">
        {pack.heroDoodles.map((doodle) => (
          <img
            key={doodle.src}
            src={doodle.src}
            alt=""
            width={Math.round(doodle.width)}
            height={Math.round(doodle.height)}
            draggable={false}
            className="absolute max-w-none object-contain"
            style={{
              left: doodle.left,
              top: doodle.top,
              width: doodle.width,
              height: doodle.height,
              transform: doodle.rotate ? `rotate(${doodle.rotate}deg)` : undefined,
            }}
          />
        ))}

        {pack.heroOrnaments.map((ornament) => (
          <div
            key={ornament.src}
            className="absolute flex flex-col items-center"
            style={{
              left: ornament.left,
              top: ornament.top,
              width: ornament.width,
              height: ornament.stringLength + ornament.height,
              zIndex: ornament.zIndex,
            }}
          >
            <div
              className="w-[2px] shrink-0 rounded-[1px] bg-[#FF5E00]"
              style={{ height: ornament.stringLength }}
            />
            <img
              src={ornament.src}
              alt=""
              width={Math.round(ornament.width)}
              height={Math.round(ornament.height)}
              draggable={false}
              className="max-w-none object-contain"
              style={{ width: ornament.width, height: ornament.height }}
            />
          </div>
        ))}

        <motion.div
          className="absolute top-[497px] left-[89px] z-[5] h-[600px] w-[600px]"
          style={{ transformOrigin: "300px 300px", ...shadowStyle }}
        >
          <motion.div
            className="absolute top-[300px] left-[300px] h-[600px] w-[600px]"
            style={{ transformOrigin: "300px 300px", ...planeStyle }}
          >
            <img
              src={pack.heroPlane}
              alt=""
              width={600}
              height={600}
              draggable={false}
              className="h-full w-full max-w-none object-cover"
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="relative flex h-[330.4px] w-full max-w-[1600px] flex-col items-center justify-center gap-[10px] min-[810px]:h-[660px]">
        {/* Folder offsets scale with the mobile decorative group so it stays in frame. */}
        <div className="absolute top-[95.3px] left-[227.6px] z-[3] max-[809px]:origin-top-left max-[809px]:scale-[0.42] min-[810px]:top-[227px] min-[810px]:left-[542px]">
          <HeroFolder pack={pack} />
        </div>

        <HeroHeading pack={pack} />
      </div>
    </section>
  );
}
