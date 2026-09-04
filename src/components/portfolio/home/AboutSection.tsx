/* eslint-disable @next/next/no-img-element -- fixed-size Framer asset, cropped by a scaled clip wrapper */

import { RevealText } from "@/components/portfolio/shared/RevealText";
import { content } from "@/content/shreya";
import type { AssetPack } from "@/types/portfolio";


export function AboutSection({ pack }: { pack: AssetPack }) {
  const portrait = pack.portraits.about;
  return (
    <section id="about" className="relative z-[2] flex items-center justify-center overflow-clip px-[16px] py-[56px] min-[810px]:px-[40px] min-[810px]:pt-[240px] min-[810px]:pb-[80px]">
      <div className="flex w-full max-w-[1600px] flex-col items-start justify-center gap-[40px]">
        <div className="relative flex w-full flex-col items-start justify-start gap-[24px] min-[810px]:flex-row min-[810px]:items-end min-[810px]:gap-[64px]">
          {/* Static in mobile flow; absolute on desktop so it tucks under the indented
              first line. The desktop 1.4 zoom is gone: her hair starts at the very top of
              the source frame, so zooming re-cropped the crown whatever box the crop
              script picked. Without it the derived crop is exactly what renders. */}
          <div className="group flex h-[240px] w-[220px] shrink-0 items-center justify-center overflow-clip rounded-[8px] min-[810px]:absolute min-[810px]:top-[-176px] min-[810px]:left-[2px] min-[810px]:h-[260px] min-[810px]:w-[240px]">
            <div className="relative z-[1] h-[240px] w-[220px] overflow-clip rounded-[8px] min-[810px]:h-[260px] min-[810px]:w-[240px]">
              <img
                src={portrait.src}
                alt={`Portrait of ${content.name}`}
                width={240}
                height={260}
                className="h-[240px] w-[220px] max-w-none rounded-[8px] object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] motion-reduce:transition-none motion-reduce:group-hover:scale-100 min-[810px]:h-[260px] min-[810px]:w-[240px]"
              />
            </div>
          </div>

          <div className="relative z-[2] flex w-full flex-col justify-start">
            <RevealText
              as="h2"
              text={content.aboutStatement}
              className="indent-0 font-[family-name:var(--font-display)] text-[36px] leading-[42px] font-normal tracking-[-0.4px] text-ink min-[810px]:indent-[261px] min-[810px]:text-[84px] min-[810px]:leading-[88px] min-[810px]:tracking-[-0.96px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
