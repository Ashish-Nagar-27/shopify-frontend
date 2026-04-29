import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GoogleIcon, MetaIcon, CheckIcon } from "./icons";
import type { UseOnboardingReturn } from "../types/onboarding.types";

export function UtmParamsStep({
    connectedChannels,
    utmApplied,
    setUtmApplied,
}: Pick<UseOnboardingReturn, "connectedChannels" | "utmApplied" | "setUtmApplied">) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Set Up UTM Parameters
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[500px]">
                Add UTM tracking to your connected ad channels so every click is properly attributed.
            </p>
            <div className="flex flex-col gap-3 mt-1">
                {connectedChannels.map((ch) => (
                    <Card
                        key={ch}
                        className="flex justify-between items-center px-5 py-4 bg-secondary border-[1.5px] shadow-none rounded-xl border-border"
                    >
                        <div className="flex items-center gap-2.5">
                            {ch === "google" ? <GoogleIcon /> : <MetaIcon />}
                            <span className="font-semibold text-sm text-foreground">
                                {ch === "google" ? "Google Ads" : "Meta Ads"}
                            </span>
                        </div>
                        {utmApplied[ch] ? (
                            <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                                <CheckIcon /> UTMs Applied
                            </div>
                        ) : (
                            <Button
                                size="sm"
                                className="px-5 font-bold transition-opacity hover:opacity-90"
                                onClick={() =>
                                    setUtmApplied((prev) => ({
                                        ...prev,
                                        [ch]: true,
                                    }))
                                }
                            >
                                Apply UTMs
                            </Button>
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
