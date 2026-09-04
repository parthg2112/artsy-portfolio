"use client";

import { useCallback, useMemo, useState } from "react";

/**
 * Dissolves one image into another through a grid of cells that appear in random order.
 *
 * The React Bits original drives this with `gsap.to(..., { stagger: { from: 'random' } })`.
 * Here each cell is simply a tile of the second image - same `background-image`, scaled
 * up by the grid size and offset to its own square - fading in on its own
 * `transition-delay`. Pure CSS, no animation library, and it reverses for free on leave.
 *
 * Only the hover flag is state, so moving the pointer does not re-render the cells.
 */

interface PixelRevealProps {
  frontSrc: string;
  backSrc: string;
  alt?: string;
  /** Cells per side. 12 gives 144 squares, which reads as pixels without being heavy. */
  gridSize?: number;
  /** Seconds for the whole dissolve; each cell gets a slice of it as its delay. */
  duration?: number;
  className?: string;
}

export function PixelReveal({
  frontSrc,
  backSrc,
  alt = "",
  gridSize = 12,
  duration = 0.4,
  className = "",
}: PixelRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const total = gridSize * gridSize;

  // Scattered but DETERMINISTIC. `Math.random()` here would be computed once on the
  // server and again on the client, giving two different orders and a hydration
  // mismatch. A cheap integer hash looks just as unordered and is identical in both.
  const delays = useMemo(() => {
    const hash = (n: number) => {
      let x = (n + 1) * 2654435761;
      x ^= x >>> 15;
      x = Math.imul(x, 2246822507);
      x ^= x >>> 13;
      return (x >>> 0) / 4294967296;
    };
    return Array.from({ length: total }, (_, i) => hash(i) * duration);
  }, [total, duration]);

  const enter = useCallback(() => setRevealed(true), []);
  const leave = useCallback(() => setRevealed(false), []);

  const step = 100 / gridSize;
  const denom = gridSize - 1 || 1;

  return (
    <div
      className={`relative overflow-hidden ${className}`.trim()}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onFocus={enter}
      onBlur={leave}
      tabIndex={0}
      role="img"
      aria-label={alt}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={frontSrc} alt="" draggable={false} className="block h-full w-full object-cover" />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {delays.map((delay, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              width: `${step}%`,
              height: `${step}%`,
              left: `${(i % gridSize) * step}%`,
              top: `${Math.floor(i / gridSize) * step}%`,
              backgroundImage: `url(${backSrc})`,
              backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
              backgroundPosition: `${((i % gridSize) / denom) * 100}% ${(Math.floor(i / gridSize) / denom) * 100}%`,
              opacity: revealed ? 1 : 0,
              transitionProperty: "opacity",
              transitionDuration: "90ms",
              transitionDelay: `${revealed ? delay : duration - delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
