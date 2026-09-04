"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { packs, type PackId } from "@/assets/packs";
import { cn } from "@/lib/utils";

/**
 * Preview control for judging the two artwork packs side by side. It maps the current
 * path onto the other pack's mirror route, so you stay on the same page when switching.
 */
export function PackSwitcher({ active }: { active: PackId }) {
  const pathname = usePathname() ?? "/";
  const base = pathname.replace(/^\/original/, "") || "/";

  const hrefFor = (id: PackId) => (id === "original" ? `/original${base === "/" ? "" : base}` : base);

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[50] flex -translate-x-1/2 items-center gap-1 rounded-full border border-[#FF5E00] bg-[#F7F2E6] p-1 shadow-sm"
      role="group"
      aria-label="Artwork variant"
    >
      {(Object.keys(packs) as PackId[]).map((id) => (
        <Link
          key={id}
          href={hrefFor(id)}
          aria-current={id === active ? "true" : undefined}
          className={cn(
            "rounded-full px-3 py-1 text-[13px] leading-[20px] transition-colors",
            id === active ? "bg-[#FF5E00] text-[#F7F2E6]" : "text-[#3B4AD6] hover:bg-[#FF5E00]/10",
          )}
          style={{ fontFamily: "var(--font-body)" }}
        >
          {packs[id].label}
        </Link>
      ))}
    </div>
  );
}
