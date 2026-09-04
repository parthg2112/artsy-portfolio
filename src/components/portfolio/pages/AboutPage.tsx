import { getPack, type PackId } from "@/assets/packs";
import { AboutDetails } from "@/components/portfolio/about/AboutDetails";
import { AboutHero } from "@/components/portfolio/about/AboutHero";
import { CtaFooter } from "@/components/portfolio/shared/CtaFooter";
import { PackSwitcher } from "@/components/portfolio/shared/PackSwitcher";
import { SiteNav } from "@/components/portfolio/shared/SiteNav";

export function AboutPage({ packId }: { packId: PackId }) {
  const pack = getPack(packId);

  return (
    <div className="relative w-full overflow-x-clip bg-[#F7F2E6]">
      <SiteNav packId={packId} />

      <main className="relative z-[2] w-full">
        <div className="additti-grid-bg pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />
        <AboutHero pack={pack} />
        <AboutDetails />
      </main>

      <CtaFooter pack={pack} packId={packId} />
      <PackSwitcher active={packId} />
    </div>
  );
}
