import { useState } from "react";
import { toast } from "sonner";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import { useProfileQuery, useUpdateProfileMutation } from "../hooks/useProfileQueries";
import type { ProfileFormState } from "../types";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileDetailsView } from "./ProfileDetailsView";
import { ProfileEditForm } from "./ProfileEditForm";

const labelStyle = "original";
const timezones = {
    ...allTimezones,
};

const CURRENCY_OPTIONS = [
    { code: "INR", label: "INR — Indian Rupee (₹)" },
    { code: "USD", label: "USD — US Dollar ($)" },
    { code: "GBP", label: "GBP — British Pound (£)" },
];

/**
 * Profile tab — personal information & organization settings.
 * Read-only "Your details" card by default; "Edit profile" swaps it for
 * an editable form with Cancel / Save changes.
 */
export function UserProfile() {
    const { data: profile, isLoading } = useProfileQuery();
    const updateProfileMutation = useUpdateProfileMutation();
    const { options: timezoneOptions } = useTimezoneSelect({ labelStyle, timezones });

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<ProfileFormState | null>(null);

    const startEdit = () => {
        const matchingTz = timezoneOptions.find(
            (opt) => opt.label === profile?.timezone || opt.value === profile?.timezone
        );
        const initialTz = matchingTz?.value || profile?.timezone || (timezoneOptions[0]?.value ?? "");

        setForm({
            fullName: profile?.name || profile?.fullName || "",
            email: profile?.email ?? "",
            phone: profile?.phone ?? "",
            companyName: profile?.company ?? profile?.companyName ?? "",
            timezone: initialTz,
            currency: profile?.currency || CURRENCY_OPTIONS[0].code,
        });
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setForm(null);
    };

    const updateField = (field: keyof ProfileFormState, value: string) => {
        setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleSave = () => {
        if (!form) return;
        const selectedTz = timezoneOptions.find(
            (opt) => opt.value === form.timezone || opt.label === form.timezone
        );
        updateProfileMutation.mutate(
            {
                email: form.email.trim(),
                phone: form.phone.trim() || null,
                name: form.fullName.trim(),
                fullName: form.fullName.trim(),
                company: form.companyName.trim() || null,
                timezone: selectedTz?.label || form.timezone || undefined,
                currency: form.currency,
            },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    setForm(null);
                    toast.success("Profile updated successfully");
                },
                onError: (err) => {
                    toast.error(err instanceof Error ? err.message : "Could not update profile");
                },
            }
        );
    };

    const displayName = profile?.name || profile?.fullName || "—";
    const displayEmail = profile?.email || "—";
    const displayCompany = profile?.company || profile?.companyName || "—";
    const displayTimezone =
        timezoneOptions.find(
            (opt) => opt.label === profile?.timezone || opt.value === profile?.timezone
        )?.value ||
        profile?.timezone ||
        "—";
    const displayCurrency =
        CURRENCY_OPTIONS.find((c) => c.code === profile?.currency)?.label || profile?.currency || "—";
    const roleLabel = profile?.role || "Account owner";

    return (
        <div className="flex flex-col gap-5 max-w-[760px]">
            {/* Identity header card */}
            <ProfileHeader
                displayName={displayName}
                displayEmail={displayEmail}
                displayCompany={displayCompany}
                roleLabel={roleLabel}
            />

            {/* Details card */}
            <div className="rounded-xl border border-border-soft bg-surface shadow-card">
                <div className="flex items-center justify-between gap-4 border-b border-border-soft px-[22px] py-5">
                    <div>
                        <div className="text-[15px] font-semibold text-fg">Your details</div>
                        <div className="mt-[3px] text-xs text-fg-mute">
                            {isEditing ? "Change any field, then save." : "Used across reports, invoices and email alerts."}
                        </div>
                    </div>
                    {!isEditing && (
                        <button
                            type="button"
                            onClick={startEdit}
                            className="h-9 flex-none cursor-pointer whitespace-nowrap rounded-lg border border-border-soft bg-surface px-4 text-[13px] font-medium text-fg-dim transition-colors hover:border-border"
                        >
                            Edit profile
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="p-[22px] text-sm text-fg-mute">Loading profile…</div>
                ) : isEditing && form ? (
                    <ProfileEditForm
                        form={form}
                        timezoneOptions={timezoneOptions}
                        currencyOptions={CURRENCY_OPTIONS}
                        isPending={updateProfileMutation.isPending}
                        onUpdateField={updateField}
                        onCancel={cancelEdit}
                        onSave={handleSave}
                    />
                ) : (
                    <ProfileDetailsView
                        displayName={displayName}
                        email={profile?.email}
                        phone={profile?.phone}
                        displayCompany={displayCompany}
                        displayTimezone={displayTimezone}
                        displayCurrency={displayCurrency}
                    />
                )}
            </div>
        </div>
    );
}

export default UserProfile;