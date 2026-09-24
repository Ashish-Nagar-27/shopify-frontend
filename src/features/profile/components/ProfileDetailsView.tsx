interface ProfileDetailsViewProps {
    displayName: string;
    email?: string;
    phone?: string;
    displayCompany: string;
    displayTimezone: string;
    displayCurrency: string;
}

export function ProfileDetailsView({
    displayName,
    email,
    phone,
    displayCompany,
    displayTimezone,
    displayCurrency,
}: ProfileDetailsViewProps) {
    const details = [
        ["Full name", displayName === "—" ? undefined : displayName],
        ["Email address", email],
        ["Phone number", phone],
        ["Company name", displayCompany === "—" ? undefined : displayCompany],
        ["Timezone", displayTimezone === "—" ? undefined : displayTimezone],
        ["Reporting currency", displayCurrency === "—" ? undefined : displayCurrency],
    ] as const;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2">
            {details.map(([label, value]) => (
                <div key={label} className="border-b border-border-soft px-[22px] py-[18px]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-mute">
                        {label}
                    </div>
                    <div className="mt-[6px] text-sm text-fg">{value || "—"}</div>
                </div>
            ))}
        </div>
    );
}

export default ProfileDetailsView;
