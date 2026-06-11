export interface OnboardingStatusResponse {
    current_step: "welcome" | "shopify" | "billing" | "storefront_tracking" | "ad_channels" | "utm_params" | "dashboard_ready" | "dashboard";
    is_complete: boolean;
    steps: {
        welcome?: { status: string };
        shopify?: { status: string; shop_domain?: string };
        billing?: { status: string };
        storefront_tracking?: { status: string; verified?: boolean };
        ad_channels?: { status: string; google_connected?: boolean; meta_connected?: boolean };
        utm_params?: { status: string; facebook_utm_done?: boolean; google_utm_done?: boolean };
        dashboard_ready?: { status: string };
    };
}

export interface UseOnboardingReturn {
    status: OnboardingStatusResponse | null;
    isLoadingStatus: boolean;
    step: number; // Numeric step derived from current_step for the UI stepper
    animating: boolean;
    
    // Derived from status for convenience
    connectedChannels: string[];
    
    // Shopify specifics
    shopDomain: string;
    setShopDomain: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    error: string | null;
    handleConnectShopify: () => Promise<void>;
    handleEnableTracking: () => Promise<void>;
    handleExtensionVerified: () => Promise<void>;
    
    // Billing specifics
    billingPlan: string | null;
    setBillingPlan: React.Dispatch<React.SetStateAction<string | null>>;

    // Local state for UTM applied
    utmApplied: Record<string, boolean>;
    setUtmApplied: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

    // Simulation/legacy helpers (adjust if needed)
    connectingGoogle: boolean;
    connectingMeta: boolean;
    setConnectingGoogle: React.Dispatch<React.SetStateAction<boolean>>;
    setConnectingMeta: React.Dispatch<React.SetStateAction<boolean>>;
    simulateConnect: (
        setter: (v: boolean) => void,
        loadingSetter: (v: boolean) => void
    ) => void;

    // Actions
    canNext: () => boolean;
    handleFinishWelcome: () => Promise<void>;
    handleFinishUtms: () => Promise<void>;
    handleComplete: () => Promise<void>;
    handleNext: () => Promise<void>;
    handlePrev: () => void;
    handleFinishSingleUtm: (channel: string) => Promise<void>;
}
