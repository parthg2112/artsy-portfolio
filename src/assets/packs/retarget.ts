import type { AssetPack } from "@/types/portfolio";

/**
 * Returns the same pack pointed at a different image directory.
 *
 * Only string values are rewritten, so every number in the pack - the geometry the
 * layout is measured against - is carried through untouched by construction. That is
 * what lets a colourway be swapped without re-running the parity gate.
 */
export function retargetPack(pack: AssetPack, from: string, to: string): AssetPack {
  const walk = (value: unknown): unknown => {
    if (typeof value === "string") {
      return value.startsWith(from) ? to + value.slice(from.length) : value;
    }
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, walk(v)]),
      );
    }
    return value;
  };
  return walk(pack) as AssetPack;
}
