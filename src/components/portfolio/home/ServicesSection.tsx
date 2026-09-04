import { RevealText } from "@/components/portfolio/shared/RevealText";
import { content } from "@/content/shreya";

const SERVICES_HEADING = "Things I am good at";

export function ServicesSection() {
  return (
    <section className="relative z-[2] flex items-center justify-center overflow-clip px-[16px] pt-[56px] pb-[80px] min-[810px]:px-[40px] min-[810px]:pt-[80px] min-[810px]:pb-[160px]">
      <div className="flex w-full max-w-[1600px] flex-col items-start justify-center gap-[40px] min-[810px]:items-end">
        <div className="flex w-full max-w-full flex-col items-start justify-start gap-[28px] min-[810px]:max-w-[75%] min-[810px]:gap-[40px]">
          <div className="relative z-[2] flex w-full max-w-[720px] flex-col">
            <RevealText
              as="h2"
              text={SERVICES_HEADING}
              className="font-display text-ink text-[40px] leading-[46px] font-normal tracking-[-0.4px] min-[810px]:text-[96px] min-[810px]:leading-[100.8px] min-[810px]:tracking-[-0.96px]"
            />
          </div>

          <div className="flex w-full flex-col items-center justify-end">
            {content.services.map((service) => (
              <div
                key={service.index}
                className="flex w-full flex-col items-start justify-center gap-[12px] py-[20px] min-[810px]:flex-row min-[810px]:gap-0 min-[810px]:py-[28px] min-[810px]:pr-[40px]"
              >
                {/* Mobile: title 28/36.4 with the index inline; description stays 320px wide. */}
                <div className="flex h-[36.4px] w-full min-w-0 flex-row items-start justify-start gap-[10px] overflow-clip min-[810px]:h-[46px] min-[810px]:flex-1">
                  <h4 className="font-display text-ink text-[28px] leading-[36.4px] font-normal tracking-[-0.4px] min-[810px]:text-[40px] min-[810px]:leading-[46px]">
                    {service.title}
                  </h4>
                  <p className="font-body text-blue text-[16px] leading-[22.4px] font-normal">
                    {service.index}
                  </p>
                </div>
                <p className="font-body text-blue w-full max-w-[320px] text-[16px] leading-[22.4px] font-normal min-[810px]:w-[320px] min-[810px]:shrink-0">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
