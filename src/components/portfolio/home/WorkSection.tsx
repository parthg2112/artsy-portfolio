import Image from "next/image";
import type { CSSProperties } from "react";

import { content } from "@/content/shreya";
import { cn } from "@/lib/utils";
import type { AssetPack, ImageAsset, Project } from "@/types/portfolio";

const ORANGE = "#FF5E00";

/**
 * The grid sizes each card as a percentage of the 1345px reference container and lets
 * the image height follow its aspect ratio; only the 12px gap and the 35px title are
 * fixed. `widthPct` is `authored / 1345`, and row sums must stay <= 100%
 * (row 1 = 28+50, row 3 = 26+40). Titles must stay one line - a wrapping title breaks
 * the `cardHeight - imageHeight = 47` invariant the row heights depend on.
 */
interface CardLayout {
  cardWidth: number;
  cardHeight: number;
  padTop: number;
  padLeft: number;
  widthPct: number;
  /** Border colour, picked to contrast with that cover's own fill. */
  accent: string;
}

const BLUE = "#3B4AD6";

const LAYOUTS: CardLayout[] = [
  // Atlas: cream card with blue streets, so an orange edge.
  { cardWidth: 376.59, cardHeight: 575.67, padTop: 0, padLeft: 0, widthPct: 28, accent: ORANGE },
  // Breast cancer: cobalt card, so only orange separates it from the paper.
  { cardWidth: 672.5, cardHeight: 720.53, padTop: 80, padLeft: 0, widthPct: 50, accent: ORANGE },
  // RAG: cream card.
  { cardWidth: 753.19, cardHeight: 528.55, padTop: 40, padLeft: 180, widthPct: 56, accent: ORANGE },
  // Email digest: orange card, so blue for contrast.
  { cardWidth: 349.69, cardHeight: 624.86, padTop: 0, padLeft: 0, widthPct: 26, accent: BLUE },
  // n8n: lime card, so blue for contrast.
  { cardWidth: 538, cardHeight: 720.53, padTop: 40, padLeft: 0, widthPct: 40, accent: BLUE },
];

const ROW =
  "flex w-full flex-col items-start gap-6 min-[810px]:flex-row min-[810px]:gap-0 min-[810px]:justify-between";

interface CardProps {
  project: Project;
  cover: ImageAsset;
  layout: CardLayout;
  className?: string;
}

function Card({ project, cover, layout, className }: CardProps) {
  // Desktop: the card is a % of the container and the image height follows its aspect
  // ratio, so the whole card grows with the viewport. `scale()` is visual only - the
  // outer div keeps the unscaled box, which is what sets the row height.
  const vars = {
    "--card-h": `${layout.cardHeight}px`,
    "--card-w-m": `${layout.cardWidth - layout.padLeft}px`,
    "--pad-top-pct": `${(layout.padTop / layout.cardWidth) * 100}%`,
    "--pad-left-pct": `${(layout.padLeft / layout.cardWidth) * 100}%`,
    "--card-pct": `${layout.widthPct}%`,
  } as CSSProperties;

  return (
    <div
      style={vars}
      className={cn(
        "shrink-0",
        // Mobile drops the scale trick entirely: every card is a uniform
        // full-width 358 x 360 block (measured on the live site at 390px).
        "max-[809px]:h-[310px] max-[809px]:w-full",
        "min-[810px]:h-auto min-[810px]:w-[var(--card-pct)]",
        className,
      )}
    >
      <a
        href={project.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${project.title}. ${project.blurb}`}
        className={cn(
          "flex h-full w-full flex-col items-start gap-3",
          // Desktop height must stay content-driven so the image's aspect ratio
          // (and therefore the row height) grows with the container.
          "min-[810px]:h-auto min-[810px]:w-full min-[810px]:origin-center",
          "min-[810px]:pt-[var(--pad-top-pct)] min-[810px]:pl-[var(--pad-left-pct)]",
          "min-[810px]:[transform:scale(var(--additti-project-scale))]",
        )}
      >
        {/* The accent border is what lifts these off the paper grid. */}
        <div
          className="w-full overflow-hidden rounded-lg border-[3px] max-[809px]:h-[262px] min-[810px]:aspect-[var(--img-ar)]"
          style={
            {
              "--img-ar": `${cover.width} / ${cover.height}`,
              borderColor: layout.accent,
              boxSizing: "border-box",
            } as CSSProperties
          }
        >
          <Image
            src={cover.src}
            alt={project.title}
            width={Math.round(cover.width)}
            height={Math.round(cover.height)}
            className="h-full w-full rounded-lg object-cover"
          />
        </div>
        <div>
          {/* 24/30 at 390px, 28/35 from 810px up - both measured. */}
          <h5
            className="text-[24px] leading-[30px] min-[810px]:text-[28px] min-[810px]:leading-[35px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: ORANGE }}
          >
            {project.title}
          </h5>
        </div>
      </a>
    </div>
  );
}

export function WorkSection({ pack }: { pack: AssetPack }) {
  const cards = content.projects.map((project, i) => ({
    project,
    cover: pack.projectCovers[i],
    layout: LAYOUTS[i],
  }));
  const [one, two, three, four, five] = cards;

  return (
    <section className="relative z-[2] flex items-center justify-center overflow-clip px-4 py-14 min-[810px]:px-10 min-[810px]:py-20">
      <div className="flex w-full max-w-[1600px] flex-col items-center justify-center gap-6 overflow-clip min-[810px]:gap-10">
        <div className={ROW}>
          <Card {...one} />
          <Card {...two} />
        </div>

        <div className={ROW}>
          <Card {...three} />
        </div>

        <div className="relative flex w-full flex-col items-start gap-6 min-[810px]:flex-row min-[810px]:justify-start min-[810px]:gap-[10px]">
          <Card
            {...four}
            /* Live site pins this card flush to the container's right edge. */
            className="min-[810px]:absolute min-[810px]:right-0 min-[810px]:top-[-120px] min-[810px]:z-[1]"
          />
          <Card {...five} className="z-[1]" />
        </div>
      </div>
    </section>
  );
}
