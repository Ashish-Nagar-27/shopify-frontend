interface ConfirmInlineProps {
  question?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
  confirmLabel?: string;
}

/**
 * Inline "Remove this account? Cancel / Remove" confirmation that replaces a
 * row's actions in place, instead of a modal — matches the source design's
 * destructive-action pattern.
 */
export function ConfirmInline({
  question = "Are you sure?",
  onConfirm,
  onCancel,
  isPending = false,
  confirmLabel = "Remove",
}: ConfirmInlineProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] text-[var(--fg-dim)]">{question}</span>
      <button
        type="button"
        onClick={onCancel}
        disabled={isPending}
        className="h-[30px] rounded-[7px] border border-[var(--border-soft)] bg-transparent px-3 text-xs text-[var(--fg-dim)] disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isPending}
        className="h-[30px] rounded-[7px] border border-[var(--neg)]/60 bg-[var(--neg)]/[0.12] px-3 text-xs font-medium text-[var(--neg)] disabled:opacity-50"
      >
        {isPending ? "Removing…" : confirmLabel}
      </button>
    </div>
  );
}
