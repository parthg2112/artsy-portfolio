import { getPack, type PackId } from "@/assets/packs";
import { ContactHero } from "@/components/portfolio/contact/ContactHero";
import { CtaFooter } from "@/components/portfolio/shared/CtaFooter";
import { PackSwitcher } from "@/components/portfolio/shared/PackSwitcher";
import { SiteNav } from "@/components/portfolio/shared/SiteNav";

export function ContactPage({ packId }: { packId: PackId }) {
  const pack = getPack(packId);

  return (
    <div className="relative w-full overflow-x-clip bg-[#F7F2E6]">
      <SiteNav packId={packId} />

      <main className="relative z-[2] w-full">
        <div className="additti-grid-bg pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />
        <ContactHero />
      </main>

      <CtaFooter pack={pack} packId={packId} />
      <PackSwitcher active={packId} />
    </div>
  );
}
