"use client";

import { getPack, type PackId } from "@/assets/packs";
import { usePalette } from "@/components/portfolio/shared/usePalette";
import { AboutSection } from "@/components/portfolio/home/AboutSection";
import { HeroSection } from "@/components/portfolio/home/HeroSection";
import { ServicesSection } from "@/components/portfolio/home/ServicesSection";
import { StickerMarquee } from "@/components/portfolio/home/StickerMarquee";
import { WorkSection } from "@/components/portfolio/home/WorkSection";
import { CtaFooter } from "@/components/portfolio/shared/CtaFooter";
import { PackSwitcher } from "@/components/portfolio/shared/PackSwitcher";
import { ScrollExpand } from "@/components/portfolio/shared/ScrollExpand";
import { BracketCursor } from "@/components/portfolio/shared/BracketCursor";
import { SectionIndex } from "@/components/portfolio/shared/SectionIndex";
import { SiteNav } from "@/components/portfolio/shared/SiteNav";
import { content } from "@/content/shreya";

export function HomePage({ packId }: { packId: PackId }) {
  const { palette } = usePalette();
  const pack = getPack(packId, palette);

  return (
    <div className="relative w-full overflow-x-clip bg-paper">
      <SiteNav packId={packId} />

      {/* Paper-grid texture spans the main column only, so it never reaches the lime footer. */}
      <main className="relative z-[2] w-full">
        <div className="additti-grid-bg pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />
        <HeroSection pack={pack} />
        <StickerMarquee pack={pack} />
        <WorkSection pack={pack} />
        {/* Replaces the source site's 2px rule: a frame that opens to full bleed as you
            scroll past. Costs roughly two viewport heights of page length. */}
        <ScrollExpand
          src={pack.fullBleed.src}
          alt=""
          title={content.fullBleed.title}
          scrollHint={content.fullBleed.hint}
        >
          <p className="max-w-[24ch] font-[family-name:var(--font-display)] text-[28px] leading-[1.15] min-[810px]:text-[44px]">
            {content.fullBleed.line}
          </p>
        </ScrollExpand>
        <AboutSection pack={pack} />
        <div className="flex w-full justify-center" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pack.divider.src}
            alt=""
            width={pack.divider.width}
            height={pack.divider.height}
            className="h-[115px] w-[400px] max-w-none object-contain max-[809px]:my-[23px] max-[809px]:h-[69px] max-[809px]:w-[240px]"
          />
        </div>
        <ServicesSection pack={pack} />
      </main>

      <CtaFooter pack={pack} packId={packId} />
      <SectionIndex />
      {/* Locks onto the .cursor-target service rows only. */}
      <BracketCursor />
      {/* Preview control, development only: blush + code is the shipped design.
          It is also the only way to reach /original, which does not build in production. */}
      {process.env.NODE_ENV === "development" ? <PackSwitcher active={packId} /> : null}
    </div>
  );
}
