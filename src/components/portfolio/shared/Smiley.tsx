"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { SmileyOutlineIcon, SmileyWinkIcon } from "@/components/portfolio/shared/icons";
import { sparkAt } from "@/components/portfolio/shared/ClickSpark";
import { cn } from "@/lib/utils";

/**
 * The smiley faces, made playful: on hover the face swaps to its other expression, tilts
 * and grows a little, and the same spark burst the page fires on click goes off behind
 * it. Reuses the existing overlay canvas via `sparkAt` rather than drawing its own.
 */
export function Smiley({
  icon,
  className,
  size,
}: {
  icon: "outline" | "wink";
  className?: string;
  size?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const onEnter = useCallback(() => {
    setHovered(true);
    if (prefersReducedMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (rect) sparkAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }, [prefersReducedMotion]);

  const onLeave = useCallback(() => setHovered(false), []);

  // The swap is the point: hovering a smile should change the expression.
  const Face = hovered && !prefersReducedMotion
    ? icon === "wink"
      ? SmileyOutlineIcon
      : SmileyWinkIcon
    : icon === "wink"
      ? SmileyWinkIcon
      : SmileyOutlineIcon;

  return (
    <motion.span
      ref={ref}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={cn("pointer-events-auto inline-block", className)}
      style={size ? { width: size, height: size } : undefined}
      animate={
        prefersReducedMotion ? undefined : { rotate: hovered ? 14 : 0, scale: hovered ? 1.18 : 1 }
      }
      transition={{ type: "spring", stiffness: 320, damping: 14 }}
    >
      <Face className="h-full w-full" />
    </motion.span>
  );
}
