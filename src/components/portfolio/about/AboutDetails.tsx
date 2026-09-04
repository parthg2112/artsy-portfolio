// Details section of /about - one Instrument Serif statement block, two paragraphs.
// Source splits it into per-character spans, but their captured rest state is opacity 1 / no transform.

import { Fragment } from "react";

import { AboutNote } from "@/components/portfolio/about/AboutNote";
import { content } from "@/content/shreya";
import type { AssetPack } from "@/types/portfolio";

// Desktop honours these authored breaks; below 810px they collapse and the text reflows.
const { paragraphOneLines: PARAGRAPH_ONE, paragraphTwo: PARAGRAPH_TWO } = content.about;

export function AboutDetails({ pack }: { pack: AssetPack }) {
  return (
    <section className="relative z-[2] flex flex-row items-start justify-center gap-[10px] overflow-clip px-[16px] py-[56px] min-[810px]:px-[40px] min-[810px]:py-[80px]">
      {/* The heading is capped at 78% on desktop; the note fills the gutter that leaves. */}
      <div className="flex w-full max-w-[1600px] flex-col items-start justify-center gap-[100px] min-[810px]:flex-row min-[810px]:items-start min-[810px]:gap-[40px]">
        <h3 className="relative z-[2] flex w-full flex-col justify-start indent-0 font-[family-name:var(--font-display)] text-[40px] leading-[46px] font-normal tracking-[-0.8px] text-ink min-[810px]:w-[78%] min-[810px]:text-[72px] min-[810px]:leading-[75.6px] min-[810px]:tracking-[-1.44px]">
          <span className="block">
            {PARAGRAPH_ONE.map((line, index) => (
              <Fragment key={line}>
                {line}
                {index < PARAGRAPH_ONE.length - 1 ? (
                  <>
                    {" "}
                    {/* Hidden below 810px so the lines reflow to the narrower column. */}
                    <br className="hidden min-[810px]:inline" />
                  </>
                ) : null}
              </Fragment>
            ))}
          </span>

          {/* Mobile only: sits between the paragraphs, where the wall of text was. */}
          <AboutNote photo={pack.portraits.note} className="my-[40px] ml-[8px] min-[810px]:hidden" />

          {/* One blank line (1lh) separates the paragraphs in the source. */}
          <span className="mt-0 block min-[810px]:mt-[75.6px]">{PARAGRAPH_TWO}</span>
        </h3>

        <AboutNote
          photo={pack.portraits.note}
          className="max-[809px]:hidden min-[810px]:mt-[18px]"
        />
      </div>
    </section>
  );
}
