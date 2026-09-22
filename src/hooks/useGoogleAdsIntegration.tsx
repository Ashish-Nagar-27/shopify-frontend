import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { settingsKeys } from "@/features/settings/api/queryKeys";
import { integrationApi } from "@/services/integrationApis";
import type { AccountOption } from "@/components/shared/SelectAccountsModal";

export function extractCustomerIDsAndRefreshToken(url: string) {
    // Checking if the URL contains a query string
    if (!url.includes("?")) {
        return { customerIDs: [], refreshToken: null };
    }

    // Extracting the query parameter part of the URL
    const queryString = url.split("?")[1];

    // Decoding the URL-encoded string
    const decodedQueryString = decodeURIComponent(queryString);

    // Extracting the resource_names parameter value
    const resourceNamesParam = decodedQueryString
        .split("&")
        .find((param) => param.startsWith("resource_names="));

    // Extracting the refresh_token parameter value
    const refreshTokenParam = decodedQueryString
        .split("&")
        .find((param) => param.startsWith("refresh_token="));

    // Checking if resourceNamesParam is undefined
    if (!resourceNamesParam) {
        console.log("resource_names parameter not found");
        return { customerIDs: [], refreshToken: null };
    }

    const resourceNamesValue = resourceNamesParam.split("=")[1];

    // Removing the square brackets and single quotes from the value
    const cleanedResourceNames = resourceNamesValue.replace(/\[|\]|'/g, "");

    // Splitting the cleaned string into an array of customer IDs
    const customerIDs = cleanedResourceNames.split(", ");

    // Extracting the refresh_token value
    const refreshToken = refreshTokenParam ? refreshTokenParam.split("=")[1] : null;

    return { customerIDs, refreshToken };
}

interface UseGoogleAuthProps {
    setConnectingGoogle?: (val: boolean) => void;
    setGoogleConnected?: (val: boolean) => void;
}

export function useGoogleAdsIntegration({ setConnectingGoogle, setGoogleConnected }: UseGoogleAuthProps) {
    const [extractedAccounts, setExtractedAccounts] = useState<AccountOption[]>([]);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        const { customerIDs, refreshToken: extractedToken } = extractCustomerIDsAndRefreshToken(
            window.location.href
        );

        if (customerIDs?.length > 0 && extractedToken) {
            setExtractedAccounts(customerIDs.map(id => ({ id, name: id })));
            setRefreshToken(extractedToken);
            setIsModalOpen(true);
        } else {
            console.log("No accessible customers found");
        }
    }, []);

    const connectGoogleAds = (source: string) => {
        if (!source) return;
        setConnectingGoogle?.(true);

        const baseUrl = (import.meta.env.VITE_REACT_APP_BASE_URL || "").trim().replace(/\/$/, "");
        window.location.href = `${baseUrl}/setting/integrations/google/authorize/null?source=${source}`;
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // Clear the URL query params so it doesn't reopen on refresh
        window.history.replaceState({}, document.title, window.location.pathname);
    };

    const handleAccountsSubmit = async (selectedAccounts: string[]) => {
        try {
            const customerIdParam = selectedAccounts.join(",");
            const response = await integrationApi.connectGoogleAdsAccounts(customerIdParam, refreshToken);

            if (response.data?.status === "success" || response.status === 200) {
                toast.success("Google Ads accounts connected successfully!");
                setGoogleConnected?.(true);
                queryClient.invalidateQueries({ queryKey: ['onboardingStatus'] });
                queryClient.invalidateQueries({ queryKey: settingsKeys.integrations() });
            } else {
                toast.error("Failed to connect Google Ads accounts.");
                throw new Error("Failed response status");
            }
        } catch (error) {
            console.error("Error connecting accounts:", error);
            toast.error("An error occurred while connecting accounts.");
            throw error; 
        }
    };

    return { 
        connectGoogleAds, 
        extractedAccounts, 
        isModalOpen, 
        closeModal,
        handleAccountsSubmit
    };
}
