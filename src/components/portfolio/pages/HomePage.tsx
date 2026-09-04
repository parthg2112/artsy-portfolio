import { getPack, type PackId } from "@/assets/packs";
import { AboutSection } from "@/components/portfolio/home/AboutSection";
import { HeroSection } from "@/components/portfolio/home/HeroSection";
import { ServicesSection } from "@/components/portfolio/home/ServicesSection";
import { StickerMarquee } from "@/components/portfolio/home/StickerMarquee";
import { WorkSection } from "@/components/portfolio/home/WorkSection";
import { CtaFooter } from "@/components/portfolio/shared/CtaFooter";
import { PackSwitcher } from "@/components/portfolio/shared/PackSwitcher";
import { SiteNav } from "@/components/portfolio/shared/SiteNav";

export function HomePage({ packId }: { packId: PackId }) {
  const pack = getPack(packId);

  return (
    <div className="relative w-full overflow-x-clip bg-[#F7F2E6]">
      <SiteNav packId={packId} />

      {/* Paper-grid texture spans the main column only, so it never reaches the lime footer. */}
      <main className="relative z-[2] w-full">
        <div className="additti-grid-bg pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />
        <HeroSection pack={pack} />
        <StickerMarquee pack={pack} />
        <WorkSection pack={pack} />
        {/* 2px rule between Work and About, drawn as an SVG path on the source site. */}
        <div className="h-[2px] w-full rounded-[1px] bg-[#3B4AD6]" aria-hidden="true" />
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
        <ServicesSection />
      </main>

      <CtaFooter pack={pack} packId={packId} />
      <PackSwitcher active={packId} />
    </div>
  );
}
