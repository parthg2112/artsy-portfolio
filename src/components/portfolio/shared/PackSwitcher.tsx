"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { packs, type PackId, type PaletteId } from "@/assets/packs";
import { usePalette } from "@/components/portfolio/shared/usePalette";
import { cn } from "@/lib/utils";

const PILL = "rounded-full px-3 py-1 text-[13px] leading-[20px] transition-colors";
const ON = "bg-ink text-paper";
const OFF = "text-blue hover:bg-ink/10";

const PALETTES: { id: PaletteId; label: string }[] = [
  { id: "paper", label: "Paper" },
  { id: "blush", label: "Blush" },
];

/**
 * Preview controls for judging variants side by side: artwork pack (a route swap, so
 * these are links) and colour palette (client state, so these are buttons).
 */
export function PackSwitcher({ active }: { active: PackId }) {
  const pathname = usePathname() ?? "/";
  const base = pathname.replace(/^\/original/, "") || "/";
  const { palette, setPalette } = usePalette();

  const hrefFor = (id: PackId) => (id === "original" ? `/original${base === "/" ? "" : base}` : base);

  return (
    <div className="fixed bottom-4 left-1/2 z-[50] flex -translate-x-1/2 flex-wrap items-center justify-center gap-1 rounded-full border border-ink bg-paper p-1 shadow-sm">
      <div className="flex items-center gap-1" role="group" aria-label="Artwork variant">
        {(Object.keys(packs) as PackId[]).map((id) => (
          <Link
            key={id}
            href={hrefFor(id)}
            aria-current={id === active ? "true" : undefined}
            className={cn(PILL, id === active ? ON : OFF)}
            style={{ fontFamily: "var(--font-body)" }}
          >
            {packs[id].label}
          </Link>
        ))}
      </div>

      {/* The palette only recolours our own artwork, so it is meaningless on /original. */}
      {active === "code" ? (
        <>
          <span aria-hidden="true" className="h-4 w-px bg-ink/25" />
          <div className="flex items-center gap-1" role="group" aria-label="Colour palette">
            {PALETTES.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setPalette(id)}
                aria-pressed={palette === id}
                className={cn(PILL, palette === id ? ON : OFF)}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
