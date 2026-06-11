import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GoogleIcon, MetaIcon, CheckIcon } from "./icons";
import type { UseOnboardingReturn } from "../types/onboarding.types";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { useMetaAuth } from "../hooks/useMetaAuth";
import { SelectAccountsModal } from "./SelectAccountsModal";

export interface AdChannelsStepProps {
    googleConnected: boolean;
    metaConnected: boolean;
    connectingGoogle: boolean;
    connectingMeta: boolean;
    simulateConnect: UseOnboardingReturn["simulateConnect"];
    setGoogleConnected: UseOnboardingReturn["setConnectingGoogle"];
    setConnectingGoogle: UseOnboardingReturn["setConnectingGoogle"];
    setMetaConnected: UseOnboardingReturn["setConnectingMeta"];
    setConnectingMeta: UseOnboardingReturn["setConnectingMeta"];
}

export function AdChannelsStep({
    googleConnected,
    metaConnected,
    connectingGoogle,
    connectingMeta,
    simulateConnect,
    setGoogleConnected,
    setConnectingGoogle,
    setMetaConnected,
    setConnectingMeta,
}: AdChannelsStepProps) {
    const { 
        connectGoogleAds, 
        extractedAccounts: googleAccounts, 
        isModalOpen: isGoogleModalOpen, 
        closeModal: closeGoogleModal,
        handleAccountsSubmit: handleGoogleAccountsSubmit
    } = useGoogleAuth({ setConnectingGoogle, setGoogleConnected });

    const { 
        connectMetaAds,
        extractedAccounts: metaAccounts,
        isModalOpen: isMetaModalOpen,
        closeModal: closeMetaModal,
        handleAccountsSubmit: handleMetaAccountsSubmit
    } = useMetaAuth({ setConnectingMeta, setMetaConnected });

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Connect Ad Channels
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[500px]">
                Connect at least one ad platform so Trackocity can pull campaign data and map it to your revenue.
            </p>
            <div className="grid grid-cols-2 gap-3.5 mt-1">
                {/* Google */}
                <Card
                    className={`flex flex-col items-center gap-3 px-4 py-7 rounded-xl border-[1.5px] transition-all duration-200 shadow-none ${
                        googleConnected ? "border-primary/50 bg-primary/4" : "border-border bg-secondary"
                    }`}
                >
                    <GoogleIcon />
                    <span className="font-semibold text-sm text-foreground">Google Ads</span>
                    {googleConnected ? (
                        <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                            <CheckIcon /> Connected
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            className="px-5 font-bold transition-opacity hover:opacity-90"
                            disabled={connectingGoogle}
                            onClick={connectGoogleAds}
                        >
                            {connectingGoogle ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
                        </Button>
                    )}
                </Card>

                {/* Meta */}
                <Card
                    className={`flex flex-col items-center gap-3 px-4 py-7 rounded-xl border-[1.5px] transition-all duration-200 shadow-none ${
                        metaConnected ? "border-primary/50 bg-primary/4" : "border-border bg-secondary"
                    }`}
                >
                    <MetaIcon />
                    <span className="font-semibold text-sm text-foreground">Meta Ads</span>
                    {metaConnected ? (
                        <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                            <CheckIcon /> Connected
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            className="px-5 font-bold transition-opacity hover:opacity-90"
                            disabled={connectingMeta}
                            onClick={connectMetaAds}
                        >
                            {connectingMeta ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
                        </Button>
                    )}
                </Card>
            </div>

            <SelectAccountsModal
                isOpen={isGoogleModalOpen}
                onClose={closeGoogleModal}
                accounts={googleAccounts}
                channelName="Google Ads"
                onSubmit={handleGoogleAccountsSubmit}
            />

            <SelectAccountsModal
                isOpen={isMetaModalOpen}
                onClose={closeMetaModal}
                accounts={metaAccounts}
                channelName="Meta Ads"
                onSubmit={handleMetaAccountsSubmit}
            />
        </div>
    );
}
