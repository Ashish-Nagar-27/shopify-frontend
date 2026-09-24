import { Avatar } from "@/features/settings/components/common/Avatar";
import { StatusBadge } from "@/features/settings/components/common/StatusBadge";

interface ProfileHeaderProps {
    displayName: string;
    displayEmail: string;
    displayCompany: string;
    roleLabel: string;
}

export function ProfileHeader({
    displayName,
    displayEmail,
    displayCompany,
    roleLabel,
}: ProfileHeaderProps) {
    return (
        <div className="flex items-center gap-[18px] rounded-xl border border-border-soft bg-surface p-[22px] shadow-card">
            <Avatar label={displayName} shape="circle" size={64} useGradient />
            <div className="min-w-0">
                <div className="text-xl font-semibold tracking-[-0.01em] text-fg">
                    {displayName}
                </div>
                <div className="mt-1 text-[13px] text-fg-mute">
                    {displayEmail} · {displayCompany}
                </div>
            </div>
            <div className="ml-auto flex-none">
                <StatusBadge label={roleLabel} variant="accent" />
            </div>
        </div>
    );
}

export default ProfileHeader;
