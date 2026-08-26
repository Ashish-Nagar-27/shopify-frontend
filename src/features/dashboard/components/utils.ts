export const fmtO = (n?: number | null, d = 0): string =>
    n == null ? "—" : n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

export function smoothO(pts: [number, number][]): string {
    if (pts.length < 2) return "";
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || p2;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
    }
    return d;
}

export const STANDARD_PRESETS: Record<string, { label: string; color: string }> = {
    google: { label: "Google", color: "var(--cyan)" },
    meta: { label: "Meta", color: "var(--violet)" },
    facebook: { label: "Meta", color: "var(--violet)" },
};

export const COLOR_PALETTE = [
    "var(--cyan)",
    "var(--violet)",
    "var(--magenta)",
    "var(--blue-accent)",
    "var(--pos)",
    "var(--warn)",
    "#f97316",
    "#8b5cf6",
    "#06b6d4",
    "#f43f5e",
    "#84cc16",
    "#10b981",
    "#6366f1",
    "#ec4899",
];

export const formatChannelLabel = (rawKey: string): string => {
    const trimmed = rawKey.trim();
    const normalized = trimmed.toLowerCase();
    if (STANDARD_PRESETS[normalized]) {
        return STANDARD_PRESETS[normalized].label;
    }
    if (trimmed === trimmed.toUpperCase() || trimmed === trimmed.toLowerCase()) {
        return trimmed
            .split(/\s+/)
            .map((w) => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
            .join(" ");
    }
    return trimmed;
};

export const getChannelColor = (rawKey: string, index: number): string => {
    const normalized = rawKey.trim().toLowerCase();
    if (STANDARD_PRESETS[normalized]) {
        return STANDARD_PRESETS[normalized].color;
    }
    return COLOR_PALETTE[index % COLOR_PALETTE.length];
};

