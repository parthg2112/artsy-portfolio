"use client";

import { getPack, type PackId } from "@/assets/packs";
import { usePalette } from "@/components/portfolio/shared/usePalette";
import { ContactHero } from "@/components/portfolio/contact/ContactHero";
import { CtaFooter } from "@/components/portfolio/shared/CtaFooter";
import { PackSwitcher } from "@/components/portfolio/shared/PackSwitcher";
import { SiteNav } from "@/components/portfolio/shared/SiteNav";

export function ContactPage({ packId }: { packId: PackId }) {
  const { palette } = usePalette();
  const pack = getPack(packId, palette);

  return (
    <div className="relative w-full overflow-x-clip bg-paper">
      <SiteNav packId={packId} />

      <main className="relative z-[2] w-full">
        <div className="additti-grid-bg pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />
        <ContactHero />
      </main>

      <CtaFooter pack={pack} packId={packId} />
      {/* Preview control, development only: blush + code is the shipped design.
          It is also the only way to reach /original, which does not build in production. */}
      {process.env.NODE_ENV === "development" ? <PackSwitcher active={packId} /> : null}
    </div>
  );
}
