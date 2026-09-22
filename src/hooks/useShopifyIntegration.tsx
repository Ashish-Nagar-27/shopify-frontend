import { useState, useRef } from "react";
import { integrationApi } from "@/features/integration/api/integrationApi";

export interface UseShopifyIntegrationOptions {
    defaultShopDomain?: string;
    source?: string;
    onError?: (error: string) => void;
    onSuccess?: (url: string) => void;
}

export interface UseShopifyIntegrationReturn {
    shopDomain: string;
    setShopDomain: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    handleConnectShopify: (customShopDomain?: string, customSource?: string) => Promise<void>;
    handleEnableTracking: (customShopDomain?: string) => Promise<string | void>;
    getThemeEditorUrl: (customShopDomain?: string) => string | null;
}

export function useShopifyIntegration(
    options: UseShopifyIntegrationOptions = {}
): UseShopifyIntegrationReturn {
    const [shopDomain, setShopDomain] = useState<string>(options.defaultShopDomain || "");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Keep reference to latest options to prevent stale closures
    const optionsRef = useRef(options);
    optionsRef.current = options;

    /**
     * Constructs theme editor deep-link URL for enabling the storefront app embed
     */
    const getThemeEditorUrl = (targetDomain?: string): string | null => {
        const rawDomain = (
            targetDomain ||
            shopDomain ||
            optionsRef.current.defaultShopDomain ||
            ""
        ).trim();

        if (!rawDomain) return null;

        const shopHandle = rawDomain
            .replace(/^https?:\/\//, "")
            .replace(/\.myshopify\.com\/?$/, "")
            .replace(/\/$/, "");

        if (!shopHandle) return null;

        const CLIENT_ID = import.meta.env.VITE_SHOPIFY_CLIENT_ID;
        const EMBED_HANDLE = import.meta.env.VITE_SHOPIFY_EMBED_HANDLE;

        return `https://admin.shopify.com/store/${shopHandle}/themes/current/editor?context=apps&appEmbed=${encodeURIComponent(
            `${CLIENT_ID}/${EMBED_HANDLE}`
        )}`;
    };

    /**
     * Connects to Shopify OAuth flow and redirects to the generated authorization URL
     */
    const handleConnectShopify = async (
        customShopDomain?: string,
        customSource?: string
    ): Promise<void> => {
        let shop = (
            customShopDomain ||
            shopDomain ||
            optionsRef.current.defaultShopDomain ||
            ""
        ).trim();

        // Strip protocol and trailing slash if user entered a full URL
        shop = shop.replace(/^https?:\/\//, "").replace(/\/$/, "");

        if (!shop) {
            const errorMsg = "Please enter your Shopify store domain";
            setError(errorMsg);
            optionsRef.current.onError?.(errorMsg);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const targetSource =
                customSource || optionsRef.current.source || "onboarding";
            const data = await integrationApi.connectShopify(shop, targetSource);

            if (data?.url) {
                optionsRef.current.onSuccess?.(data.url);
                window.location.href = data.url;
            } else {
                alert("Connection initiated (Mock response)");
            }
        } catch (err: any) {
            console.error("Failed to connect shopify:", err);
            const errorMsg =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to initiate connection. Please try again.";
            setError(errorMsg);
            optionsRef.current.onError?.(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Generates and opens Shopify theme editor to enable the tracking app embed extension
     */
    const handleEnableTracking = async (
        customShopDomain?: string
    ): Promise<string | void> => {
        setIsLoading(true);
        setError(null);

        const domainVal = (
            customShopDomain ||
            shopDomain ||
            optionsRef.current.defaultShopDomain ||
            ""
        ).trim();

        if (!domainVal) {
            alert("Please connect your Shopify store first.");
            setIsLoading(false);
            return;
        }

        try {
            const url = getThemeEditorUrl(domainVal);
            if (!url) {
                throw new Error("Could not construct theme editor URL");
            }

            console.log("Opening Shopify theme editor URL:", url);
            window.open(url, "_blank");
            return url;
        } catch (err: any) {
            console.error("Failed to open theme editor:", err);
            const errorMsg = "Failed to open theme editor. Please try again.";
            setError(errorMsg);
            optionsRef.current.onError?.(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        shopDomain,
        setShopDomain,
        isLoading,
        setIsLoading,
        error,
        setError,
        handleConnectShopify,
        handleEnableTracking,
        getThemeEditorUrl,
    };
}

export default useShopifyIntegration;