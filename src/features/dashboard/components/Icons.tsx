import type { FC } from "react";
import type { IconProps } from "../types";
import * as Icons from "@/components/icons";

/**
 * Re-exports consolidated icons from `@/components/icons` for the Dashboard feature.
 * All SVG code is centralized in `src/components/icons.tsx`.
 */
export const Icon: Record<string, FC<IconProps>> = {
    grid: Icons.grid,
    chart: Icons.chart,
    audience: Icons.audience,
    search: Icons.search,
    funnel: Icons.funnel,
    refresh: Icons.refresh,
    calendar: Icons.calendar,
    chevron: Icons.chevron,
    chevronDown: Icons.chevronDown,
    user: Icons.user,
    settings: Icons.settings,
    sparkle: Icons.sparkle,
    arrowUp: Icons.arrowUp,
    arrowDown: Icons.arrowDown,
    info: Icons.info,
};
