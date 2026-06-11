import { useState } from "react";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleIcon, MetaIcon, CheckIcon } from "./icons";
import type { UseOnboardingReturn } from "../types/onboarding.types";

const UTM_TEMPLATES: Record<string, string> = {
    google: "ad_source=google&ad_id={creative}&campaign_id={campaignid}&adgroup_id={adgroupid}&keyword={keyword}&placement={placement}",
    meta: "ad_source=facebook&ad_id={{ad.id}}&placement={{placement}}",
};

export function UtmParamsStep({
    connectedChannels,
    utmApplied,
    handleFinishSingleUtm,
}: Pick<UseOnboardingReturn, "connectedChannels" | "utmApplied" | "handleFinishSingleUtm">) {
    const [checked, setChecked] = useState<Record<string, boolean>>({
        google: false,
        meta: false,
    });
    const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("UTM parameters copied to clipboard");
        } catch (err) {
            toast.error("Failed to copy text");
        }
    };

    const onConfirm = async (ch: string) => {
        setSubmitting(prev => ({ ...prev, [ch]: true }));
        try {
            await handleFinishSingleUtm(ch);
            toast.success(`${ch === "google" ? "Google Ads" : "Meta Ads"} UTM parameters confirmed!`);
        } catch (err) {
            toast.error("Failed to confirm UTM setup.");
        } finally {
            setSubmitting(prev => ({ ...prev, [ch]: false }));
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Set Up UTM Parameters
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[500px]">
                Add UTM tracking to your connected ad channels so every click is properly attributed.
            </p>
            <div className="flex flex-col gap-4 mt-1">
                {connectedChannels.map((ch) => (
                    <Card
                        key={ch}
                        className="flex flex-col gap-4 px-5 py-5 bg-secondary border-[1.5px] shadow-none rounded-xl border-border"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2.5">
                                {ch === "google" ? <GoogleIcon /> : <MetaIcon />}
                                <span className="font-semibold text-base text-foreground">
                                    {ch === "google" ? "Google Ads" : "Meta Ads"}
                                </span>
                            </div>
                            {utmApplied[ch] && (
                                <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                                    <CheckIcon /> UTMs Applied
                                </div>
                            )}
                        </div>

                        {!utmApplied[ch] && (
                            <div className="flex flex-col gap-4 pt-1">
                                <div className="space-y-2">
                                    <p className="text-sm text-foreground font-medium">
                                        Add these UTM parameters to your {ch === "google" ? "Google Ads tracking template" : "Meta Ads URL parameters"}:
                                    </p>
                                    <div className="flex items-center gap-2 bg-background border border-border p-2.5 rounded-lg">
                                        <code className="text-[13px] text-foreground flex-1 break-all font-mono">
                                            {UTM_TEMPLATES[ch]}
                                        </code>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2 flex-shrink-0"
                                            onClick={() => handleCopy(UTM_TEMPLATES[ch])}
                                            title="Copy to clipboard"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 mt-1">
                                    <div className="flex items-center space-x-2.5">
                                        <Checkbox
                                            id={`utm-check-${ch}`}
                                            checked={checked[ch] || false}
                                            onCheckedChange={(val) => setChecked(prev => ({ ...prev, [ch]: val === true }))}
                                        />
                                        <label
                                            htmlFor={`utm-check-${ch}`}
                                            className="text-sm font-medium leading-none cursor-pointer text-foreground"
                                        >
                                            Yes, I have successfully applied the UTM params for {ch === "google" ? "Google" : "Meta"}
                                        </label>
                                    </div>
                                    <Button
                                        className="w-full md:w-auto self-start mt-1 min-w-[130px]"
                                        disabled={!checked[ch] || submitting[ch]}
                                        onClick={() => onConfirm(ch)}
                                    >
                                        {submitting[ch] ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Setup"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
            <div className="flex items-center gap-2 mt-2 px-4 py-3 bg-primary/5 rounded-lg text-[13px] text-muted-foreground leading-relaxed">
                <span className="text-base">💡</span>
                Trackocity auto-generates UTM templates optimized for attribution accuracy.
            </div>
        </div>
    );
}
