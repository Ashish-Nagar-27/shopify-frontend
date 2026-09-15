import { useState } from "react";
import { Avatar } from "../common/Avatar";
import { ConfirmInline } from "../common/ConfirmInline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TeamMember } from "../../types/settings.types";

interface TeamMemberRowProps {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onRemove: (id: TeamMember["id"]) => void;
  isRemoving?: boolean;
}

export function TeamMemberRow({ member, onEdit, onRemove, isRemoving }: TeamMemberRowProps) {
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const isAdmin = member.role?.toLowerCase() === "admin";
  const isActive = member.status?.toLowerCase() === "active";
  const displayRole =
    member.role?.toLowerCase() === "admin"
      ? "Admin"
      : member.role?.toLowerCase() === "readonly"
      ? "Read-only"
      : member.role;


  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--border-soft)] px-5.5 py-4 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar label={member.name} shape="circle" useGradient />
        <div className="min-w-0">
          <div className="truncate text-[13px] font-medium text-[var(--fg)]">{member.name}</div>
          <div className="mt-0.5 truncate text-[11px] text-[var(--fg-mute)]">{member.email}</div>
        </div>
      </div>

      {confirmingRemove ? (
        <ConfirmInline
          question="Remove access?"
          onCancel={() => setConfirmingRemove(false)}
          onConfirm={() => onRemove(member.id)}
          isPending={isRemoving}
        />
      ) : (
        <div className="flex flex-none items-center gap-2.5">
          <Badge
            variant="outline"
            className={`rounded-full border-transparent px-2.5 py-1 text-[11px] font-semibold shadow-none flex items-center gap-1.5 ${
              isActive
              ? "bg-pos text-pos bg-pos-soft"
                : "bg-[var(--surface-2)] text-[var(--fg-mute)]"
            }`}
          >
              <span className={`w-[6px] h-[6px] rounded-full ${isActive ? "bg-pos shadow-[0_0_8px_var(--pos)]" : "bg-fg-faint"} `} />
              <span className="capitalize">
            {member.status}
              </span>
          </Badge>
          <Badge
            variant="outline"
            className={`rounded-full border-transparent px-2.5 py-1 text-[11px] font-semibold shadow-none ${
              isAdmin
                ? "bg-[var(--cyan)]/[0.16] text-[var(--cyan)]"
                : "bg-[var(--surface-2)] text-[var(--fg-mute)]"
            }`}
          >
            {displayRole}
          </Badge>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(member)}
            className="h-[30px] rounded-[7px] border border-[var(--border-soft)] bg-[var(--surface)] px-3 text-xs text-[var(--fg-dim)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setConfirmingRemove(true)}
            className="h-[30px] rounded-[7px] bg-transparent px-3 text-xs text-[var(--neg)] hover:bg-[var(--neg)]/[0.1] hover:text-[var(--neg)]"
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
