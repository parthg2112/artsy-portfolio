import type { AssetPack } from "@/types/portfolio";

import { codePack } from "./code";
import { originalPack } from "./original";

export const packs = { code: codePack, original: originalPack } as const;

export type PackId = keyof typeof packs;

export function getPack(id: PackId): AssetPack {
  return packs[id];
}

/** Maps a pack to its route prefix - the code pack lives at the site root. */
export function packHref(id: PackId, path: string): string {
  const clean = path === "/" ? "" : path;
  return id === "original" ? `/original${clean}` : path;
}

export { codePack, originalPack };
