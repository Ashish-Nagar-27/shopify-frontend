import type { BadgeVariant } from "../../types/settings.types";

interface StatusBadgeProps {
  label?: string;
  variant?: BadgeVariant;
  uppercase?: boolean;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: "text-[var(--pos)] bg-[var(--pos)]/[0.16]",
  accent: "text-[var(--cyan)] bg-[var(--cyan)]/[0.16]",
  neutral: "text-[var(--fg-mute)] bg-[var(--surface-2)]",
  danger: "text-[var(--neg)] bg-[var(--neg)]/[0.16]",
};

/** Small rounded status pill — used for account status, roles, "current plan" etc. */
export function StatusBadge({ label, variant = "neutral", uppercase = false }: StatusBadgeProps) {
  if (!label) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        uppercase ? "uppercase tracking-wide" : ""
      } ${VARIANT_CLASSES[variant]}`}
    >
      {label}
    </span>
  );
}
