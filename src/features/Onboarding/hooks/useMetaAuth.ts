import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { onboardingApi } from "../api/onboardingApi";
import type { AccountOption } from "../components/SelectAccountsModal";
import { useLocation } from "react-router-dom";
import { settingsKeys } from "@/features/settings/api/queryKeys";

interface UseMetaAuthProps {
    setConnectingMeta: (val: boolean) => void;
    setMetaConnected: (val: boolean) => void;
}

const gettRedirectUri = () => {
    let frontendBaseUrl = import.meta.env.VITE_REACT_APP_FRONT_END_BASE_URL || "http://localhost:5173";
    if (!frontendBaseUrl.startsWith('http')) {
        frontendBaseUrl = `http://${frontendBaseUrl}`;
    }
    
    return location.pathname.includes('/onboarding/ad-channels') ? `${frontendBaseUrl}/onboarding/ad-channels` : `${frontendBaseUrl}/settings/integrations` ;
}
    

export const metaConnectUrl_2 = (shortLivedToken: string) => {
    let frontendBaseUrl = import.meta.env.VITE_REACT_APP_FRONT_END_BASE_URL || "http://localhost:5173";
    if (!frontendBaseUrl.startsWith('http')) {
        frontendBaseUrl = `http://${frontendBaseUrl}`;
    }
    const redirectUri = gettRedirectUri();
    // Using the same redirect_uri used in the initial OAuth request
    // const redirectUri = location.pathname.includes('onboarding') ? `${frontendBaseUrl}/onboarding/ad-channels` : `${frontendBaseUrl}/setting/integration`;
    return `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${import.meta.env.VITE_REACT_APP_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${import.meta.env.VITE_REACT_APP_CLIENT_SECRET}&code=${shortLivedToken}`;
};

export function useMetaAuth({ setConnectingMeta, setMetaConnected }: UseMetaAuthProps) {
    const [extractedAccounts, setExtractedAccounts] = useState<AccountOption[]>([]);
    const [longLivedToken, setLongLivedToken] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const location = useLocation()
    
    const submitMetaAccounts = async (accountsToSubmit: AccountOption[], token: string) => {
        try {
            const payload = {
                accessToken: token,
                expireon: null,
                accountinfo: accountsToSubmit
            };
            const response = await onboardingApi.connectMetaAdsAccounts(payload);

            if (response.data?.status === "success" || response.status === 200) {
                toast.success("Meta Ads accounts connected successfully!");
                setMetaConnected(true);

                queryClient.invalidateQueries({ queryKey: ['onboardingStatus'] });
                queryClient.invalidateQueries({ queryKey: settingsKeys.integrations() });
                
            } else {
                toast.error("Failed to connect Meta Ads accounts.");
                throw new Error("Failed response status");
            }
        } catch (error) {
            console.error("Error connecting accounts:", error);
            toast.error("An error occurred while connecting accounts.");
            throw error; 
        }
    };

    const handleAccountsSubmit = async (selectedAccountIds: string[]) => {
        if (longLivedToken) {
            const accountsToSubmit = extractedAccounts.filter(acc => selectedAccountIds.includes(acc.id));
            await submitMetaAccounts(accountsToSubmit, longLivedToken);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleFacebookCallback = async (shortLivedToken: string) => {
        if (shortLivedToken) {
            try {
                const url = metaConnectUrl_2(shortLivedToken);
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.error) {
                    console.error("Error exchanging token:", data.error);
                    return;
                }
                
                const token = data.access_token;
                
                const adAccountsUrl = `https://graph.facebook.com/v21.0/me/adaccounts?access_token=${token}&fields=id,name`;
                const res = await fetch(adAccountsUrl);
                const metadata = await res.json();
                
                console.log("Long-lived token:", token);
                console.log("Ad accounts metadata:", metadata);
                
                if (metadata && metadata.data) {
                    const accounts = metadata.data;
                    if (accounts.length <= 3) {
                        // Submit directly
                        const accountsToSubmit = accounts.map((a: any) => ({ id: a.id, name: a.name }));
                        await submitMetaAccounts(accountsToSubmit, token);
                    } else {
                        // Open modal
                        setExtractedAccounts(accounts.map((a: any) => ({ id: a.id, name: a.name })));
                        setLongLivedToken(token);
                        setIsModalOpen(true);
                    }
                }
            } catch (error: any) {
                console.log("Error fetching ad accounts:", error.message);
            }
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        
        if (code) {
            handleFacebookCallback(code);
            
            // Clean up the URL to remove the code so it doesn't re-trigger on refresh
            const url = new URL(window.location.href);
            url.searchParams.delete("code");
            // Facebook appends #_=_ to the URL, we can clean it up
            if (url.hash === "#_=_") {
                url.hash = "";
            }
            window.history.replaceState({}, document.title, url.toString());
        }
    }, []);

    const connectMetaAds = () => {
        setConnectingMeta(true);
        
        const appId = import.meta.env.VITE_REACT_APP_APP_ID;
        const configId = import.meta.env.VITE_REACT_APP_CONFIG_ID;
        const redirectUri = gettRedirectUri();
        
        window.location.href = `https://www.facebook.com/v21.0/dialog/oauth?app_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&config_id=${configId}&response_type=code&override_default_response_type=True`;
    };

    return { 
        connectMetaAds,
        extractedAccounts,
        isModalOpen,
        closeModal,
        handleAccountsSubmit
    };
}
