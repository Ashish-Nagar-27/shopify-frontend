import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const strokeBase: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const GridIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const ChartIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <path d="M4 20V10M10 20V4M16 20V13M22 20H2" />
  </svg>
);

export const AudienceIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M15 19c0-2.5 1.6-4 4-4" />
  </svg>
);

export const SearchIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const FunnelIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <path d="M4 5h16l-6 8v6l-4-2v-4z" />
  </svg>
);

export const RefreshIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" />
  </svg>
);

export const CalendarIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);

export const ColumnsIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <rect x="3" y="4" width="5" height="16" rx="1" />
    <rect x="10" y="4" width="5" height="16" rx="1" />
    <rect x="17" y="4" width="4" height="16" rx="1" />
  </svg>
);

export const DownloadIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <path d="M12 4v12m0 0 5-5m-5 5-5-5M4 20h16" />
  </svg>
);

export const ChevronIcon = (p: IconProps) => (
  <svg {...strokeBase} strokeWidth={2} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...strokeBase} strokeWidth={2} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const JourneyIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <circle cx="5" cy="5" r="2" />
    <circle cx="19" cy="19" r="2" />
    <path d="M5 7c0 6 14 6 14 10" />
  </svg>
);

export const BagIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <path d="M5 8h14l-1 12H6zM8 8a4 4 0 0 1 8 0" />
  </svg>
);

export const UserIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

export const SettingsIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);

export const SparkleIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2 13.8 8.2 20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
  </svg>
);

export const CampaignIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <path d="M3 11v2l13 5V6L3 11z" />
    <path d="M16 8a4 4 0 0 1 0 8" />
  </svg>
);

export const AdsetIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <rect x="3" y="6" width="13" height="13" rx="2" />
    <path d="M8 3h13v13" />
  </svg>
);

export const AdIcon = (p: IconProps) => (
  <svg {...strokeBase} {...p}>
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M3 9h18M7 13h4M7 16h6" />
  </svg>
);

export const ArrowUpIcon = (p: IconProps) => (
  <svg {...strokeBase} strokeWidth={2} {...p}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const ArrowDownIcon = (p: IconProps) => (
  <svg {...strokeBase} strokeWidth={2} {...p}>
    <path d="M7 7l10 10M17 9v8H9" />
  </svg>
);

/* Format glyphs used inside creative thumbnails */
export const PlayGlyph = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="oklch(0.97 0.006 235 / 0.9)" {...p}>
    <path d="M8 6.5v11l9-5.5z" />
  </svg>
);

export const CarouselGlyph = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={14}
    height={14}
    fill="none"
    stroke="oklch(0.97 0.006 235 / 0.9)"
    strokeWidth={2}
    {...p}
  >
    <rect x="7" y="5" width="10" height="14" rx="1.5" />
    <path d="M3.5 8v8M20.5 8v8" />
  </svg>
);

export const StaticGlyph = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={14}
    height={14}
    fill="none"
    stroke="oklch(0.97 0.006 235 / 0.9)"
    strokeWidth={2}
    {...p}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="m4 15 4.5-4.5L14 16l3-3 3 3" />
    <circle cx="9.5" cy="8.5" r="1.4" fill="oklch(0.97 0.006 235 / 0.9)" stroke="none" />
  </svg>
);
