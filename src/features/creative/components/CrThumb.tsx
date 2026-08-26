import type { Creative } from "../types/creative";
import { PlayGlyph, CarouselGlyph, StaticGlyph } from "../icons/Icon";

interface CrThumbProps {
  c?: Partial<Creative> | any;
  size?: number;
}

export function CrThumb({ c, size = 40 }: CrThumbProps) {
  const fmtStr = String(c?.fmt || c?.creative_type || c?.format || "video").toLowerCase();
  const isVideo = fmtStr === "video";
  const isCarousel = fmtStr === "carousel";

  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border text-[13px] font-bold text-[oklch(0.97_0.006_235/0.85)]"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(140deg, oklch(0.42 0.09 ${200}), oklch(0.24 0.06 ${240}))`,
      }}
    >
      <span className="absolute inset-0 grid place-items-center">
        {isVideo ? <PlayGlyph /> : isCarousel ? <CarouselGlyph /> : <StaticGlyph />}
      </span>
    </span>
  );
}
