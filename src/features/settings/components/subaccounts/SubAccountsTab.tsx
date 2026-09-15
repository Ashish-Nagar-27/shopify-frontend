import { useState, useMemo } from "react";
import { TeamMemberRow } from "./TeamMemberRow";
import { InviteMemberModal, type MemberModalState } from "./InviteMemberModal";
import {
  useInviteMemberMutation,
  useRemoveMemberMutation,
  useTeamMembersQuery,
  useUpdateMemberMutation,
} from "../../api/useSettingsQueries";
import type { MemberRole, TeamMember, TeamMemberApiItem } from "../../types/settings.types";
import { toast } from "sonner";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function SubAccountsTab() {
  const { data: membersData, isLoading } = useTeamMembersQuery();
  const inviteMutation = useInviteMemberMutation();
  const updateMutation = useUpdateMemberMutation();
  const removeMutation = useRemoveMemberMutation();

  const [modal, setModal] = useState<MemberModalState | null>(null);

  // Normalize API team_members array to internal TeamMember format
  const members: TeamMember[] = useMemo(() => {
    return (membersData?.team_members ?? []).map((item: TeamMemberApiItem): TeamMember => {
      const normalizedRole: MemberRole =
        item.member_role?.toLowerCase() === "admin"
          ? "Admin"
          : item.member_role?.toLowerCase() === "read_only"
          ? "Read-only"
          : item.member_role;

      return {
        id: item.member_id,
        name: item.member_name,
        email: item.member_email,
        role: normalizedRole,
        joinedAt: item.joined_at,
        lastActiveAt: item.last_active_at,
        status: item.member_status,
      };
    });
  }, [membersData]);

  const openInvite = () => setModal({ mode: "invite", name: "", email: "", role: "Read-only" });
  const openEdit = (member: TeamMember) =>
    setModal({ mode: "edit", id: member.id, name: member.name, email: member.email, role: member.role });

  const handleSubmit = (values: { name: string; email: string; role: MemberRole }) => {
    if (!modal) return;
    if (modal.mode === "invite") {
      inviteMutation.mutate({ ...values, role: values.role === "Read-only" ? "read_only" : "admin" }, {
        onSuccess: () => {
          setModal(null);
          toast.success(`Invite sent to ${values.email}`);
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : "Could not send invite"),
      });
    } else if (modal.id !== undefined) {
      updateMutation.mutate(
        { id: modal.id, ...values, role: values.role === "Read-only" ? "read_only" : "admin" },
        {
          onSuccess: () => {
            setModal(null);
            toast.success(`Access updated for ${values.name}`);
          },
          onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update access"),
        }
      );
    }
  };

  const handleRemove = (id: TeamMember["id"]) => {
    const member = members.find((m) => m.id === id);
    removeMutation.mutate(id, {
      onSuccess: () => toast.success(member ? `${member.name}'s access removed` : "Access removed"),
      onError: (err) => toast.error(err instanceof Error ? err.message : "Could not remove access"),
    });
  };

  const isSubmitting = inviteMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Card className="gap-0 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] py-0 text-inherit shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_40px_-24px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-soft)] px-5.5 py-5">
          <div>
            <CardTitle className="text-[15px] font-semibold text-[var(--fg)]">Team access</CardTitle>
            <CardDescription className="mt-0.5 text-xs text-[var(--fg-mute)]">
              People who can sign in to this Pumalyze account.
            </CardDescription>
          </div>
          <Button
            type="button"
            onClick={openInvite}
            className="h-9 rounded-lg bg-[image:var(--gradient-accent)] px-4 text-[13px] font-semibold text-[var(--text-on-accent)] shadow-none hover:opacity-90"
          >
            + Invite member
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3 p-5.5">
            <Skeleton className="h-10 w-full bg-[var(--surface-hi)]" />
            <Skeleton className="h-10 w-full bg-[var(--surface-hi)]" />
          </div>
        ) : members.length === 0 ? (
          <div className="p-5.5 text-sm text-[var(--fg-mute)]">No team members yet.</div>
        ) : (
          members.map((member) => (
            <TeamMemberRow
              key={member.id}
              member={member}
              onEdit={openEdit}
              onRemove={handleRemove}
              isRemoving={removeMutation.isPending && removeMutation.variables === member.id}
            />
          ))
        )}
      </Card>

      {modal && (
        <InviteMemberModal
          state={modal}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
