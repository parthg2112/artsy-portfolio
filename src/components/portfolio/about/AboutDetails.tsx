// Details section of /about - one Instrument Serif statement block, two paragraphs.
// Source splits it into per-character spans, but their captured rest state is opacity 1 / no transform.

import { Fragment } from "react";

import { content } from "@/content/shreya";

// Desktop honours these authored breaks; below 810px they collapse and the text reflows.
const { paragraphOneLines: PARAGRAPH_ONE, paragraphTwo: PARAGRAPH_TWO } = content.about;

export function AboutDetails() {
  return (
    <section className="relative z-[2] flex flex-row items-start justify-center gap-[10px] overflow-clip px-[16px] py-[56px] min-[810px]:px-[40px] min-[810px]:py-[80px]">
      <div className="flex w-full max-w-[1600px] flex-col items-start justify-center gap-[100px]">
        <h3 className="relative z-[2] flex w-full flex-col justify-start indent-0 font-[family-name:var(--font-display)] text-[40px] leading-[46px] font-normal tracking-[-0.8px] text-[#FF5E00] min-[810px]:w-[78%] min-[810px]:text-[72px] min-[810px]:leading-[75.6px] min-[810px]:tracking-[-1.44px]">
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
          {/* One blank line (1lh) separates the paragraphs in the source. */}
          <span className="mt-[46px] block min-[810px]:mt-[75.6px]">{PARAGRAPH_TWO}</span>
        </h3>
      </div>
    </section>
  );
}
