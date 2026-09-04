"use client";

import { useEffect, useRef, useState } from "react";

const TALLY_ORIGIN = "https://tally.so";
/** The form measures 440px inside the frame at every width; the slack absorbs
    validation messages in case Tally never posts a height back. */
const FALLBACK_HEIGHT = 480;

export function TallyEmbed({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(FALLBACK_HEIGHT);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== TALLY_ORIGIN) return;
      if (event.source !== ref.current?.contentWindow) return;
      if (typeof event.data !== "string" || !event.data.includes("Tally.")) return;
      try {
        const { payload } = JSON.parse(event.data) as { payload?: { height?: number } };
        if (typeof payload?.height === "number" && payload.height > 200) {
          setHeight(Math.round(payload.height));
        }
      } catch {
        // Not a message we own; leave the fallback height in place.
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      loading="lazy"
      className="w-full rounded-[8px] border border-[#FF5E00] bg-transparent transition-[height] duration-300"
      style={{ height }}
    />
  );
}
