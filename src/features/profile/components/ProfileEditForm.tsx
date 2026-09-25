import type { ProfileFormState } from "../types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TimezoneOption {
    value: string;
    label: string;
}

interface CurrencyOption {
    code: string;
    label: string;
}

interface ProfileEditFormProps {
    form: ProfileFormState;
    timezoneOptions: TimezoneOption[];
    currencyOptions: CurrencyOption[];
    isPending: boolean;
    onUpdateField: (field: keyof ProfileFormState, value: string) => void;
    onCancel: () => void;
    onSave: () => void;
}

export function ProfileEditForm({
    form,
    timezoneOptions,
    currencyOptions,
    isPending,
    onUpdateField,
    onCancel,
    onSave,
}: ProfileEditFormProps) {
    return (
        <>
            {/* Fixed 2-column grid */}
            <div className="grid grid-cols-1 gap-[18px] p-[22px] sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-xs text-fg-dim">Full name</label>
                    <input
                        value={form.fullName}
                        onChange={(e) => onUpdateField("fullName", e.target.value)}
                        placeholder="e.g. Ravi Shah"
                        className="h-10 w-full rounded-[9px] border border-border-soft bg-bg-deep px-3 text-sm text-fg outline-none transition-colors focus:border-cyan"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs text-fg-dim">Email address</label>
                    <input
                        value={form.email}
                        onChange={(e) => onUpdateField("email", e.target.value)}
                        placeholder="name@company.com"
                        className="h-10 w-full rounded-[9px] border border-border-soft bg-bg-deep px-3 text-sm text-fg outline-none transition-colors focus:border-cyan"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs text-fg-dim">Phone number</label>
                    <input
                        value={form.phone}
                        onChange={(e) => onUpdateField("phone", e.target.value)}
                        placeholder="+91 98200 12345"
                        className="h-10 w-full rounded-[9px] border border-border-soft bg-bg-deep px-3 text-sm text-fg outline-none transition-colors focus:border-cyan"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs text-fg-dim">Company name</label>
                    <input
                        value={form.companyName}
                        onChange={(e) => onUpdateField("companyName", e.target.value)}
                        placeholder="e.g. BrandCo"
                        className="h-10 w-full rounded-[9px] border border-border-soft bg-bg-deep px-3 text-sm text-fg outline-none transition-colors focus:border-cyan"
                    />
                </div>

                {/* <div>
                    <label className="mb-1.5 block text-xs text-fg-dim">Timezone</label>
                    <Select
                        value={form.timezone}
                        onValueChange={(value) => onUpdateField("timezone", value)}
                    >
                        <SelectTrigger className="h-10 w-full cursor-pointer rounded-[9px] border border-border-soft bg-bg-deep px-3 text-sm text-fg outline-none transition-colors focus:border-cyan">
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[280px]">
                            {form.timezone && !timezoneOptions.some((opt) => opt.value === form.timezone) && (
                                <SelectItem value={form.timezone}>
                                    {form.timezone}
                                </SelectItem>
                            )}
                            {timezoneOptions.map((option, i) => (
                                <SelectItem value={option.value} key={option.value || i}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="mt-[5px] text-[11px] text-fg-mute">
                        All report dates and schedules use this timezone.
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs text-fg-dim">Reporting currency</label>
                    <Select
                        value={form.currency}
                        onValueChange={(value) => onUpdateField("currency", value)}
                    >
                        <SelectTrigger className="h-10 w-full cursor-pointer rounded-[9px] border border-border-soft bg-bg-deep px-3 text-sm text-fg outline-none transition-colors focus:border-cyan">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencyOptions.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                    {currency.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="mt-[5px] text-[11px] text-fg-mute">
                        Ad spend and revenue are converted to this currency.
                    </div>
                </div> */}
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-border-soft bg-surface-2 px-[22px] py-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                    className="h-[38px] cursor-pointer rounded-lg border border-border-soft bg-transparent px-4 text-[13px] text-fg-dim transition-colors hover:text-fg disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onSave}
                    disabled={isPending}
                    className="h-[38px] cursor-pointer rounded-lg bg-[image:var(--gradient-accent)] px-[18px] text-[13px] font-semibold text-[var(--text-on-accent)] transition-opacity disabled:opacity-60"
                >
                    {isPending ? "Saving…" : "Save changes"}
                </button>
            </div>
        </>
    );
}

export default ProfileEditForm;
