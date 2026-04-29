export interface OnboardingState {
    step: number;
    shopifyConnected: boolean;
    connectingShopify: boolean;
    googleConnected: boolean;
    metaConnected: boolean;
    connectingGoogle: boolean;
    connectingMeta: boolean;
    utmApplied: Record<string, boolean>;
    animating: boolean;
    shopDomain: string;
    isLoading: boolean;
    error: string | null;
    isPixelEnabled: boolean;
    isWebhookEnabled: boolean;
    billingPlan: string | null;
}

export interface UseOnboardingReturn extends OnboardingState {
    connectedChannels: string[];
    canNext: () => boolean;
    goTo: (dir: "next" | "prev") => void;
    simulateConnect: (
        setter: (v: boolean) => void,
        loadingSetter: (v: boolean) => void
    ) => void;
    handleConnectShopify: () => Promise<void>;
    setShopifyConnected: React.Dispatch<React.SetStateAction<boolean>>;
    setConnectingShopify: React.Dispatch<React.SetStateAction<boolean>>;
    setGoogleConnected: React.Dispatch<React.SetStateAction<boolean>>;
    setMetaConnected: React.Dispatch<React.SetStateAction<boolean>>;
    setConnectingGoogle: React.Dispatch<React.SetStateAction<boolean>>;
    setConnectingMeta: React.Dispatch<React.SetStateAction<boolean>>;
    setUtmApplied: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    setShopDomain: React.Dispatch<React.SetStateAction<string>>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    setBillingPlan: React.Dispatch<React.SetStateAction<string | null>>;
}
