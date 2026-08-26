import type { StatusMeta, CreativeStatus } from "../types/creative";

export const STATUS_META: Record<CreativeStatus, StatusMeta> = {
  winner: { label: "Winner", cls: "winner" },
  fatigue: { label: "Fatiguing", cls: "fatigue" },
  testing: { label: "Testing", cls: "testing" },
  kill: { label: "Kill", cls: "kill" },
};

export const FMT_FILTERS = ["All", "Video", "Static", "Carousel"] as const;
export const ST_FILTERS = ["All", "Winner", "Fatiguing", "Testing", "Kill"] as const;
