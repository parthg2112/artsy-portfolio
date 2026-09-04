"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { PaletteId } from "@/assets/packs";

const STORAGE_KEY = "shreya-palette";
/** Blush ships. It is bare `:root` in globals.css, so it needs no attribute to apply. */
const DEFAULT: PaletteId = "blush";
const OVERRIDE: PaletteId = "paper";

/**
 * Inlined at the top of <body> so a stored override lands on <html> before first paint.
 * Only the non-default palette is ever written, which keeps the attribute the single
 * source of truth and lets the hook below read it synchronously rather than correcting
 * it in an effect. With the switcher hidden in production nothing writes storage, so
 * this is a no-op there.
 */
export const paletteBootScript = `try{var p=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)});if(p==="${OVERRIDE}")document.documentElement.dataset.palette=p}catch(e){}`;

const listeners = new Set<() => void>();

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const getSnapshot = (): PaletteId =>
  document.documentElement.dataset.palette === OVERRIDE ? OVERRIDE : DEFAULT;

const getServerSnapshot = (): PaletteId => DEFAULT;

export function usePalette() {
  const palette = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setPalette = useCallback((next: PaletteId) => {
    if (next === DEFAULT) delete document.documentElement.dataset.palette;
    else document.documentElement.dataset.palette = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Blocked storage: the toggle still works, it just will not persist.
    }
    for (const fn of listeners) fn();
  }, []);

  return { palette, setPalette };
}
