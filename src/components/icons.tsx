import React from 'react';

/**
 * Common Icon Props type for reusability across components
 */
export type IconProps = React.SVGProps<SVGSVGElement>;

// ============================================================================
// NAVIGATION & LAYOUT ICONS
// ============================================================================

/**
 * Grid Icon (2x2 squares)
 * SVG: 4 rounded rectangles in 2x2 grid layout
 * Used in Pages / Components:
 *  - Dashboard / Overview Page (AppSidebar.tsx, navigation.ts)
 *  - Creative Dashboard
 */
export const grid = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);

/**
 * Columns Icon (3 vertical columns)
 * SVG: 3 rounded vertical column rectangles
 * Used in Pages / Components:
 *  - Reporting Table (ReportHeader.tsx - Customize Columns button, ColumnsMenu.tsx)
 *  - Creative Dashboard
 */
export const columns = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="4" width="5" height="16" rx="1"/>
    <rect x="10" y="4" width="5" height="16" rx="1"/>
    <rect x="17" y="4" width="4" height="16" rx="1"/>
  </svg>
);


// ============================================================================
// ANALYTICS & DATA ICONS
// ============================================================================

/**
 * Chart Icon (Bar Chart)
 * SVG: 3 vertical bars with baseline
 * Used in Pages / Components:
 *  - Analytics / Reports Page (AppSidebar.tsx, navigation.ts)
 */
export const chart = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 20V10M10 20V4M16 20V13M22 20H2"/>
  </svg>
);

/**
 * Journey Icon (Flow path with nodes)
 * SVG: Two circles connected by an S-curve path
 * Used in Pages / Components:
 *  - Customer Journey Page (AppSidebar.tsx)
 */
export const journey = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="5" cy="5" r="2"/>
    <circle cx="19" cy="19" r="2"/>
    <path d="M5 7c0 6 14 6 14 10"/>
  </svg>
);


// ============================================================================
// USER & AUDIENCE ICONS
// ============================================================================

/**
 * Audience Icon (Multiple User Profiles)
 * SVG: Main user circle/arc with secondary user circle/arc behind
 * Used in Pages / Components:
 *  - Audience Insights Page (AppSidebar.tsx)
 *  - Dashboard Audience/Sessions Widget
 */
export const audience = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="9" cy="8" r="3.2"/>
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
    <circle cx="17" cy="9" r="2.5"/>
    <path d="M15 19c0-2.5 1.6-4 4-4"/>
  </svg>
);

/**
 * User Icon (Single User Profile)
 * SVG: Single centered head circle and shoulder arc
 * Used in Pages / Components:
 *  - Customer Profile Drawer (ReportCustomerProfilePanel.tsx)
 */
export const user = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="8" r="3.5"/>
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);


// ============================================================================
// CONTROLS, SEARCH & FILTER ICONS
// ============================================================================

/**
 * Search Icon (Magnifying Glass)
 * SVG: Circle with diagonal handle
 * Used in Pages / Components:
 *  - Top Header (Header.tsx - Global Search)
 *  - Reporting Table Filter Bar (ReportFilterBar.tsx)
 *  - Customise Columns Modal (CustomiseColumnsModal.tsx, ColumnsMenu.tsx)
 */
export const search = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="11" cy="11" r="6.5"/>
    <path d="m20 20-3.5-3.5"/>
  </svg>
);

/**
 * Funnel Icon (Filter Funnel)
 * SVG: Wide top funnel tapering down to vertical spout
 * Used in Pages / Components:
 *  - Reporting Table Filter Bar (ReportFilterBar.tsx, FilterPopover.tsx)
 *  - Reporting AI Action Center (ActionCenter.tsx)
 */
export const funnel = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 5h16l-6 8v6l-4-2v-4z"/>
  </svg>
);

/**
 * Filter Icon (Alias to Funnel - EXACT DUPLICATE SVG)
 * SVG: Same funnel path (M4 5h16l-6 8v6l-4-2v-4z)
 * Kept right next to `funnel` for quick reference and comparison.
 * Used in Pages / Components:
 *  - Reporting Table Filters
 */
export const filter = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 5h16l-6 8v6l-4-2v-4z"/>
  </svg>
);


// ============================================================================
// ACTION & UTILITY ICONS
// ============================================================================

/**
 * Refresh Icon (Circular Reload Arrows)
 * SVG: Curved circular arrows pointing to each other
 * Used in Pages / Components:
 *  - Top Header (Header.tsx - Sync/Refresh data)
 *  - Reporting Table Header (ReportHeader.tsx)
 */
export const refresh = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5"/>
  </svg>
);

/**
 * Calendar Icon (Calendar Grid Box)
 * SVG: Rectangle with header line and top binder pins
 * Used in Pages / Components:
 *  - Date Range Pickers (CalendarPopover.tsx, Header.tsx)
 */
export const calendar = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2"/>
    <path d="M3 9h18M8 3v4M16 3v4"/>
  </svg>
);

/**
 * Download Icon (Arrow pointing down into a tray)
 * SVG: Vertical arrow pointing down with bottom baseline bar
 * Used in Pages / Components:
 *  - Report Export Modal & Table Header (ReportHeader.tsx, ExportReportModal.tsx)
 */
export const download = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 4v12m0 0 5-5m-5 5-5-5M4 20h16"/>
  </svg>
);

/**
 * Settings Icon (Gear/Cog)
 * SVG: Center circle with gear teeth outline
 * Used in Pages / Components:
 *  - Settings Page (AppSidebar.tsx)
 */
export const settings = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
  </svg>
);

/**
 * Info Icon (Circle with 'i' letter)
 * SVG: Circle with central vertical line and dot
 * Used in Pages / Components:
 *  - Dashboard Audience/Sessions tooltips (AudienceSessions/index.tsx)
 */
export const info = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

/**
 * Check Icon (Checkmark)
 * SVG: Clean checkmark path
 * Used in Pages / Components:
 *  - Settings Plan Card (PlanCard.tsx)
 */
export const check = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);


// ============================================================================
// CHEVRONS & DIRECTIONAL ARROW ICONS
// ============================================================================

/**
 * Chevron Right Icon
 * SVG: Right pointing angle chevron (strokeWidth 2)
 * Used in Pages / Components:
 *  - Dashboard AI Insights (AiInsights.tsx)
 *  - Reporting Table Tabs (ReportTabs.tsx)
 */
export const chevron = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m9 6 6 6-6 6"/>
  </svg>
);

/**
 * Chevron Down Icon
 * SVG: Down pointing angle chevron (strokeWidth 2)
 * Used in Pages / Components:
 *  - Calendar Popover & Dropdowns (CalendarPopover.tsx)
 *  - Reporting Table Header (ReportHeader.tsx, ReportSelectionBar.tsx)
 */
export const chevronDown = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

/**
 * Arrow Up Right Icon (Trend Increase)
 * SVG: Diagonal arrow pointing top-right (strokeWidth 2)
 * Used in Pages / Components:
 *  - Dashboard Performance Metrics (PerformanceMetrics/index.tsx)
 *  - Dashboard Audience Sessions trend (AudienceSessions/index.tsx)
 */
export const arrowUp = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M7 17 17 7M9 7h8v8"/>
  </svg>
);

/**
 * Arrow Down Right Icon (Trend Decrease)
 * SVG: Diagonal arrow pointing bottom-right (strokeWidth 2)
 * Used in Pages / Components:
 *  - Dashboard Performance Metrics (PerformanceMetrics/index.tsx)
 *  - Dashboard Audience Sessions trend (AudienceSessions/index.tsx)
 */
export const arrowDown = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M7 7l10 10M17 9v8H9"/>
  </svg>
);


// ============================================================================
// MARKETING, CAMPAIGNS & SHOPPING ICONS
// ============================================================================

/**
 * Shopping Bag Icon
 * SVG: Handle and bag container
 * Used in Pages / Components:
 *  - Customer Profile Sales Panel (ReportCustomerProfilePanel.tsx)
 */
export const bag = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 8h14l-1 12H6zM8 8a4 4 0 0 1 8 0"/>
  </svg>
);

/**
 * Campaign Icon (Megaphone)
 * SVG: Loudspeaker shape with sound waves
 * Used in Pages / Components:
 *  - Reporting Table (ReportTable.tsx - Campaign level tab/filter)
 */
export const campaign = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 11v2l13 5V6L3 11z"/>
    <path d="M16 8a4 4 0 0 1 0 8"/>
  </svg>
);

/**
 * AdSet Icon (Layered Rectangles)
 * SVG: Base rectangle with offset top-right border
 * Used in Pages / Components:
 *  - Reporting Table (ReportTable.tsx - AdSet level tab/filter)
 */
export const adset = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="6" width="13" height="13" rx="2"/>
    <path d="M8 3h13v13"/>
  </svg>
);

/**
 * Ad Icon (Ad Card layout)
 * SVG: Outer card rectangle with top header bar and text lines
 * Used in Pages / Components:
 *  - Creative / Ads Page (AppSidebar.tsx, navigation.ts)
 *  - Reporting Table (ReportTable.tsx - Ad level tab/filter)
 */
export const ad = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="4" width="18" height="14" rx="2"/>
    <path d="M3 9h18M7 13h4M7 16h6"/>
  </svg>
);


// ============================================================================
// AI & HIGHLIGHT ICONS
// ============================================================================

/**
 * Sparkle Icon (4-point Star)
 * SVG: Solid filled four-point sparkle star
 * Used in Pages / Components:
 *  - Dashboard AI Insights (AiInsights.tsx)
 *  - Dashboard Audience Sessions (AudienceSessions/index.tsx)
 *  - Creative Dashboard AI Features (ActionCards.tsx, AssistFab.tsx)
 *  - Reporting Insights (ActionCenter.tsx, ActionCard.tsx, KpiStrip.tsx)
 */
export const sparkle = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2 13.8 8.2 20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/>
  </svg>
);


// ============================================================================
// CREATIVE FORMAT GLYPHS / BADGES
// ============================================================================

/**
 * Play Glyph (Video Badge)
 * SVG: Play triangle icon for video creative thumbnails
 * Used in Pages / Components:
 *  - Creative Dashboard Thumbnails (CrThumb.tsx)
 */
export const playGlyph = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="oklch(0.97 0.006 235 / 0.9)" {...p}>
    <path d="M8 6.5v11l9-5.5z" />
  </svg>
);

/**
 * Carousel Glyph (Carousel Badge)
 * SVG: Stacked cards icon for carousel creative thumbnails
 * Used in Pages / Components:
 *  - Creative Dashboard Thumbnails (CrThumb.tsx)
 */
export const carouselGlyph = (p: React.SVGProps<SVGSVGElement>) => (
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

/**
 * Static Glyph (Image Badge)
 * SVG: Image photo frame with sun and mountain for static creative thumbnails
 * Used in Pages / Components:
 *  - Creative Dashboard Thumbnails (CrThumb.tsx)
 */
export const staticGlyph = (p: React.SVGProps<SVGSVGElement>) => (
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


// ============================================================================
// PASCALCASE ALIASES FOR BACKWARD COMPATIBILITY & FLEXIBLE IMPORTS
// ============================================================================

export const GridIcon = grid;
export const ChartIcon = chart;
export const AudienceIcon = audience;
export const SearchIcon = search;
export const FunnelIcon = funnel;
export const FilterIcon = filter;
export const RefreshIcon = refresh;
export const CalendarIcon = calendar;
export const ColumnsIcon = columns;
export const DownloadIcon = download;
export const ChevronIcon = chevron;
export const ChevronDownIcon = chevronDown;
export const JourneyIcon = journey;
export const BagIcon = bag;
export const UserIcon = user;
export const SettingsIcon = settings;
export const SparkleIcon = sparkle;
export const CampaignIcon = campaign;
export const AdsetIcon = adset;
export const AdIcon = ad;
export const ArrowUpIcon = arrowUp;
export const ArrowDownIcon = arrowDown;
export const InfoIcon = info;
export const PlayGlyph = playGlyph;
export const CarouselGlyph = carouselGlyph;
export const StaticGlyph = staticGlyph;
export const CheckIcon = check;
export const DashboardIcon = grid;
export const ReportingIcon = chart;
export const AudiencesIcon = audience;
export const ExploreIcon = search;
export const FunnelsIcon = funnel;
export const GearIcon = settings;
