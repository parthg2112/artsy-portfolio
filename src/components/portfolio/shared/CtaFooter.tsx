/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { packHref, type PackId } from "@/assets/packs";
import { CursorGrid } from "@/components/portfolio/shared/CursorGrid";
import { FooterLink } from "@/components/portfolio/shared/FooterLink";
import { content } from "@/content/shreya";
import { cn } from "@/lib/utils";
import type { AssetPack } from "@/types/portfolio";

const PAPER = "var(--additti-paper)";
const ORANGE = "var(--additti-ink)";
const BLUE = "var(--additti-blue)";
const LIME = "var(--additti-lime)";

const bodyFont = { fontFamily: "var(--font-body)", color: BLUE } as const;
const displayFont = { fontFamily: "var(--font-display)", color: ORANGE } as const;

interface CtaFooterProps {
  pack: AssetPack;
  packId: PackId;
  className?: string;
}

export function CtaFooter({ pack, packId, className }: CtaFooterProps) {
  const photo = pack.portraits.cta;
  const columns = content.footerColumns.map((c) => ({
    ...c,
    links: c.links.map((l) => (l.external ? l : { ...l, href: packHref(packId, l.href) })),
  }));
  return (
    <footer
      id="contact"
      className={cn(
        "relative flex flex-col items-center justify-center gap-[10px] overflow-clip px-4 py-14 min-[810px]:px-10 min-[810px]:py-20",
        className,
      )}
      style={{ backgroundColor: LIME }}
    >
      {/* Lattice that lights up under the pointer, so the flat butter band has something
          to do. Listeners live on the footer, not this canvas, which stays
          pointer-events-none so it cannot swallow a click on the pill or the links. */}
      <CursorGrid />

      {/* Deliberately not clipped: the pill's hover ring scales past its own box and the
          column starts at this element's left edge, so a clip here shaves the ring.
          The footer above still clips, and its 40px padding gives the ring room. */}
      <div className="relative z-[1] flex w-full max-w-[1600px] flex-col items-center justify-center gap-[56px] min-[810px]:gap-20">
        {/* CTA Content */}
        <div className="flex w-full flex-col gap-10 min-[810px]:h-[560px] min-[810px]:flex-row min-[810px]:items-start min-[810px]:justify-between min-[810px]:gap-0">
          <div className="flex w-full flex-col items-start justify-center gap-6 min-[810px]:w-[544px] min-[810px]:max-w-[544px] min-[810px]:gap-9">
            <h2
              className="flex w-full flex-col text-[36px] leading-[45px] font-normal tracking-normal min-[810px]:w-[544px] min-[810px]:text-[72px] min-[810px]:leading-[75.6px] min-[810px]:tracking-[-1.44px]"
              style={displayFont}
            >
              {content.cta.headline}
            </h2>

            <motion.div
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="relative flex items-center justify-center"
            >
              <Link href={packHref(packId, "/contact")} className="relative flex items-center justify-center">
                <motion.span
                  aria-hidden
                  className="absolute inset-0 z-[1] rounded-[64px]"
                  style={{ backgroundColor: ORANGE, transformOrigin: "center" }}
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
                {/* Cream fill inset inside the orange layer, leaving the ring the
                    live site renders on every pill. */}
                <span
                  className="relative z-[1] flex items-center justify-center rounded-[64px] border-[1.5px] px-10 py-4"
                  style={{ backgroundColor: PAPER, borderColor: ORANGE, boxSizing: "border-box" }}
                >
                  <span className="text-[18px] leading-[25.2px]" style={bodyFont}>
                    {content.cta.buttonLabel}
                  </span>
                </span>
              </Link>
            </motion.div>
          </div>

          <div className="group flex w-full items-center justify-start min-[810px]:h-[560px] min-[810px]:w-[500px] min-[810px]:max-w-[500px] min-[810px]:justify-center">
            {/* Two frames offset from each other, like a print that missed registration:
                a cobalt outline sitting behind an orange one. It closes up on hover. */}
            <div className="relative shrink-0">
              <span
                aria-hidden="true"
                className="absolute inset-0 translate-x-[10px] translate-y-[10px] rounded-lg border-[3px] border-blue transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[4px] group-hover:translate-y-[4px] motion-reduce:transition-none"
              />
              <div
                /* 214 of a 402px viewport; 268 read as oversized against the copy. */
                className="relative h-[240px] w-[214px] overflow-clip rounded-lg border-[4px] border-ink min-[810px]:h-[560px] min-[810px]:w-[500px]"
              >
                <img
                  src={photo.src}
                  alt={`Portrait of ${content.name}`}
                  width={500}
                  height={560}
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lower band - "Footer Content" carries its own 80px top padding on the live site. */}
        <div className="flex w-full flex-col gap-10 pt-14 min-[810px]:flex-row min-[810px]:items-start min-[810px]:justify-between min-[810px]:gap-0 min-[810px]:pt-[80px]">
          <div className="flex flex-col items-start gap-3 min-[810px]:w-[816px] min-[810px]:gap-4">
            <p className="text-[18px] leading-[25.2px]" style={bodyFont}>
              Email me
            </p>
            <a
              href={`mailto:${content.email}`}
              className="text-[28px] leading-[36.4px] tracking-normal min-[810px]:text-[40px] min-[810px]:leading-[46px] min-[810px]:tracking-[-0.4px]"
              style={displayFont}
            >
              {content.email}
            </a>
          </div>

          {/* Mobile stacks the two link columns (measured: column, 32px gap). */}
          <div className="flex w-full flex-col items-start justify-center gap-8 overflow-clip min-[810px]:w-[544px] min-[810px]:max-w-[544px] min-[810px]:flex-row min-[810px]:gap-10">
            {columns.map((column) => (
              <div
                key={column.heading}
                className="flex flex-1 flex-col items-start justify-center gap-3 min-[810px]:w-[252px] min-[810px]:flex-none min-[810px]:gap-4"
              >
                <p className="text-[18px] leading-[25.2px]" style={bodyFont}>
                  {column.heading}
                </p>
                <div className="flex flex-col items-start gap-2">
                  {column.links.map((link) => (
                    <FooterLink
                      key={link.label}
                      label={link.label}
                      href={link.href}
                      external={link.external}
                      font={displayFont}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
