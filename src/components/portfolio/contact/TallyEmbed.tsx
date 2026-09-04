"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

/** Shown until Tally's loader reports the real height. The form measures ~440px. */
const FALLBACK_HEIGHT = 480;

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

/**
 * `dynamicHeight=1` in the embed URL does nothing on its own - the iframe posts its
 * height and Tally's own loader in the *parent* is what listens and resizes. That
 * script is what actually sizes the form; without it the height stays pinned, which
 * is why the earlier hand-rolled postMessage listener never fired.
 *
 * The form's fonts and colours are set inside Tally, not here: the embed is
 * cross-origin, so no stylesheet of ours can reach into it. See docs/PORTFOLIO.md.
 */
export function TallyEmbed({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);

  // Why the form loaded only about half the time: `<Script onLoad>` fires once per page
  // load, but `next/script` dedupes, so arriving at /contact through a client-side
  // navigation re-mounts this iframe with `window.Tally` already present and nothing
  // ever calls `loadEmbeds()` again - leaving an empty box. Call it on mount whenever
  // the global is already there, and fall back to loading the form directly if the
  // script is blocked or never arrives.
  useEffect(() => {
    if (window.Tally) window.Tally.loadEmbeds();

    const fallback = window.setTimeout(() => {
      const frame = ref.current;
      if (frame && !frame.src) frame.src = src;
    }, 2500);

    return () => window.clearTimeout(fallback);
  }, [src]);

  return (
    <>
      <iframe
        ref={ref}
        data-tally-src={src}
        title={title}
        loading="lazy"
        height={FALLBACK_HEIGHT}
        className="w-full rounded-[8px] bg-transparent"
      />
      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="lazyOnload"
        onLoad={() => window.Tally?.loadEmbeds()}
        onError={() => {
          // Script blocked: load the form directly so the page still works, just at
          // the fallback height.
          if (ref.current && !ref.current.src) ref.current.src = src;
        }}
      />
    </>
  );
}
