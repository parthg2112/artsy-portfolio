import type { CSSProperties } from "react";

import { TallyEmbed } from "@/components/portfolio/contact/TallyEmbed";
import { Smiley } from "@/components/portfolio/shared/Smiley";
import { content } from "@/content/shreya";
import { cn } from "@/lib/utils";

const { headingWords, ariaLabel, intro, tallyEmbedUrl } = content.contact;

/** Email first, then the socials - the row the original site put under the heading. */
const CONTACT_LINKS = [
  { label: content.email, href: `mailto:${content.email}`, external: false },
  ...content.socials.map((s) => ({ label: s.label, href: s.href, external: true })),
];

function HeadingWord({ text, width, italic }: { text: string; width: number; italic?: boolean }) {
  return (
    <span
      style={{ "--word-w": `${width}px` } as CSSProperties}
      className={cn(
        "flex shrink-0 items-center justify-center whitespace-nowrap font-[family-name:var(--font-display)] font-normal text-ink",
        "min-[810px]:h-[111.3px] min-[810px]:w-[var(--word-w)] min-[810px]:text-[106px] min-[810px]:leading-[111.3px] min-[810px]:tracking-[-3.18px]",
        "max-[809px]:h-[44px] max-[809px]:text-[40px] max-[809px]:leading-[44px] max-[809px]:tracking-[-1.2px]",
        italic && "italic",
      )}
    >
      {text}
    </span>
  );
}

export function ContactHero() {
  return (
    <section
      className="relative z-[2] flex w-full items-center justify-center overflow-clip px-[40px] pb-[80px] pt-[160px] max-[809px]:px-[16px] max-[809px]:pb-[56px] max-[809px]:pt-[120px]"
    >
      <div className="flex w-full max-w-[1600px] flex-col items-center justify-center gap-[64px] max-[809px]:gap-[40px]">
        <div className="flex w-full flex-col items-center justify-center gap-[24px]">
          <h1
            aria-label={ariaLabel}
            className="relative z-[3] m-0 flex w-full max-w-[768px] flex-wrap items-center justify-center gap-y-0 min-[810px]:gap-x-[16px] max-[809px]:gap-x-[6px]"
          >
            {headingWords.map((word) => (
              <HeadingWord key={word.text} {...word} />
            ))}
          </h1>

          {/* Natural widths here - the original's fixed 177/115/115 cells were sized to
              its own labels and would clip these longer ones. */}
          <div className="flex flex-wrap items-center justify-center gap-x-[24px] gap-y-[8px]">
            {CONTACT_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                className="whitespace-nowrap text-center font-[family-name:var(--font-body)] text-[16px] font-normal leading-[22.4px] text-ink"
              >
                {link.label}
              </a>
            ))}

            <div
              aria-hidden="true"
              className="flex size-[109px] shrink-0 items-center justify-center overflow-clip p-[20px] text-blue max-[809px]:size-[72px] max-[809px]:p-[14px]"
            >
              <Smiley icon="wink" className="h-full w-full" />
            </div>
          </div>

          <p className="w-full max-w-[432px] text-center font-[family-name:var(--font-body)] text-[16px] font-normal leading-[22.4px] text-blue">
            {intro}
          </p>
        </div>

        {/* The form is hosted on Tally; the fallback keeps the page usable until the
            embed URL is filled in (see content.contact.tallyEmbedUrl). */}
        <div className="flex w-full max-w-[656px] flex-col items-center gap-[20px]">
          {tallyEmbedUrl ? (
            <TallyEmbed src={tallyEmbedUrl} title={`Contact ${content.name}`} />
          ) : (
            <div className="flex w-full flex-col items-center gap-[12px] rounded-[8px] border border-ink bg-paper px-[24px] py-[40px]">
              <p className="text-center font-[family-name:var(--font-body)] text-[16px] leading-[22.4px] text-blue">
                The form lives on Tally and is not connected yet. Email is the fastest route
                in the meantime.
              </p>
              <a
                href={`mailto:${content.email}`}
                className="font-[family-name:var(--font-display)] text-[28px] leading-[36.4px] text-ink min-[810px]:text-[40px] min-[810px]:leading-[46px]"
              >
                {content.email}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
