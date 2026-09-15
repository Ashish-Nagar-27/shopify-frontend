interface AvatarProps {
  /** Full name or label; only the first character is shown. Falls back to "?" */
  label?: string;
  shape?: "circle" | "square";
  size?: number;
  /** Tailwind text/bg color classes, e.g. "text-[var(--cyan)] bg-[var(--cyan)]/[0.18]" */
  colorClassName?: string;
  /** If no colorClassName supplied, falls back to the brand gradient (used for people). */
  useGradient?: boolean;
}

/** Initial-letter avatar/badge — used for team members, ad platforms, and the shopify store icon. */
export function Avatar({
  label,
  shape = "square",
  size = 34,
  colorClassName,
  useGradient = false,
}: AvatarProps) {
  const initial = (label ?? "?").trim().charAt(0).toUpperCase() || "?";
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-[9px]";
  const paletteClass = useGradient
    ? "bg-[image:var(--gradient-avatar)] text-[var(--text-on-accent)]"
    : colorClassName ?? "bg-[var(--surface-2)] text-[var(--fg-dim)]";

  return (
    <span
      className={`inline-grid flex-none place-items-center font-bold ${shapeClass} ${paletteClass}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initial}
    </span>
  );
}
