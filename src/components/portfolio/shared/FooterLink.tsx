"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const REST = { scaleX: 0 } as const;
const HOVER = { scaleX: 1 } as const;

const LABEL =
  "text-[24px] leading-[30px] font-normal min-[810px]:text-[28px] min-[810px]:leading-[35px]";

/**
 * A footer link with an underline that wipes in from the left. Uses the same
 * rest/hover variant pair and 0.25s easeOut as the nav and CTA pills.
 */
export function FooterLink({
  label,
  href,
  external,
  font,
}: {
  label: string;
  href: string;
  external?: boolean;
  font: React.CSSProperties;
}) {
  const prefersReducedMotion = useReducedMotion();

  const inner = (
    <motion.span
      className="relative inline-block"
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      animate="rest"
    >
      <h5 className={LABEL} style={font}>
        {label}
      </h5>
      {prefersReducedMotion ? null : (
        <motion.span
          aria-hidden="true"
          className="absolute right-0 -bottom-[2px] left-0 block h-[2px] rounded-[1px]"
          style={{ backgroundColor: "currentColor", transformOrigin: "left", color: font.color }}
          variants={{ rest: REST, hover: HOVER }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      )}
    </motion.span>
  );

  return external ? (
    <a href={href} target="_blank" rel="noreferrer noopener">
      {inner}
    </a>
  ) : (
    <Link href={href}>{inner}</Link>
  );
}
