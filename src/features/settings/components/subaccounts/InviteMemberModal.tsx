import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { MemberRole, TeamMember } from "../../types/settings.types";

export type MemberModalMode = "invite" | "edit";

export interface MemberModalState {
  mode: MemberModalMode;
  id?: TeamMember["id"];
  name: string;
  email: string;
  role: MemberRole;
}

interface InviteMemberModalProps {
  state: MemberModalState;
  onClose: () => void;
  onSubmit: (values: { name: string; email: string; role: MemberRole }) => void;
  isSubmitting?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Shared modal for both "Invite a member" and "Edit access" flows. */
export function InviteMemberModal({ state, onClose, onSubmit, isSubmitting }: InviteMemberModalProps) {
  const [name, setName] = useState(state.name ?? "");
  const [email, setEmail] = useState(state.email ?? "");
  const [role, setRole] = useState<MemberRole>(
    state.role?.toLowerCase() === "admin" ? "Admin" : "Read-only"
  );
  const [attempted, setAttempted] = useState(false);

  const nameError = attempted && !name.trim();
  const emailError = attempted && !EMAIL_RE.test(email.trim());

  const isInvite = state.mode === "invite";
  const title = isInvite ? "Invite a member" : "Edit access";
  const subtitle = isInvite ? "They'll get an email to join your account." : "Update this person's details or role.";
  const submitLabel = isInvite ? "Send invite" : "Save changes";

  const handleSubmit = () => {
    if (!name.trim() || !EMAIL_RE.test(email.trim())) {
      setAttempted(true);
      return;
    }
    onSubmit({ name: name.trim(), email: email.trim(), role });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[380px] max-w-[380px] gap-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5.5 text-inherit shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
      >
        <DialogHeader className="gap-0 text-left">
          <DialogTitle className="mb-1 text-base font-semibold text-[var(--fg)]">{title}</DialogTitle>
          <DialogDescription className="mb-4.5 text-xs text-[var(--fg-mute)]">{subtitle}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3.5">
          <div>
            <Label className="mb-1.5 block text-xs font-normal text-[var(--fg-dim)]">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Meera Iyer"
              className={`h-[38px] w-full rounded-[9px] border bg-[var(--bg-deep)] px-3 text-[13px] text-[var(--fg)] shadow-none outline-none focus-visible:ring-1 focus-visible:ring-[var(--cyan)] ${
                nameError ? "border-[var(--neg)]" : "border-[var(--border-soft)]"
              }`}
            />
            {nameError && <div className="mt-1 text-[11px] text-[var(--neg)]">Name is required.</div>}
          </div>

          <div>
            <Label className="mb-1.5 block text-xs font-normal text-[var(--fg-dim)]">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className={`h-[38px] w-full rounded-[9px] border bg-[var(--bg-deep)] px-3 text-[13px] text-[var(--fg)] shadow-none outline-none focus-visible:ring-1 focus-visible:ring-[var(--cyan)] ${
                emailError ? "border-[var(--neg)]" : "border-[var(--border-soft)]"
              }`}
              disabled={state.mode === 'edit'}
            />
            {emailError && (
              <div className="mt-1 text-[11px] text-[var(--neg)]">Enter a valid email address.</div>
            )}
          </div>

          <div>
            <Label className="mb-1.5 block text-xs font-normal text-[var(--fg-dim)]">Role</Label>
            <div className="flex gap-2">
              {(["Admin", "Read-only"] as const).map((r) => {
                const selected = role === r;
                return (
                  <Button
                    key={r}
                    type="button"
                    variant="outline"
                    onClick={() => setRole(r)}
                    className={`h-9 flex-1 rounded-lg text-[13px] font-medium shadow-none ${
                      selected
                        ? "border border-[var(--cyan-deep)] bg-[var(--cyan)]/[0.16] text-[var(--cyan)] hover:bg-[var(--cyan)]/[0.2] hover:text-[var(--cyan)]"
                        : "border border-[var(--border-soft)] bg-[var(--bg-deep)] text-[var(--fg-dim)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                    }`}
                  >
                    {r}
                  </Button>
                );
              })}
            </div>
            <div className="mt-1.5 text-[11px] text-[var(--fg-mute)]">
              {role === "Admin" ? "Can manage billing, integrations and team." : "Can view dashboards and reports only."}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-5.5 flex flex-row justify-end gap-2.5 sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="h-9 rounded-lg border border-[var(--border-soft)] bg-transparent px-4 text-[13px] text-[var(--fg-dim)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-9 rounded-lg bg-[image:var(--gradient-accent)] px-4.5 text-[13px] font-semibold text-[var(--text-on-accent)] shadow-none hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
