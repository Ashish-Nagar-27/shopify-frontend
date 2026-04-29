import { Loader2, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShopifyIcon, CheckIcon } from "./icons";
import type { UseOnboardingReturn } from "../types/onboarding.types";

export function ShopifyStep({
    shopifyConnected,
    isLoading,
    shopDomain,
    setShopDomain,
    error,
    handleConnectShopify,
}: Pick<UseOnboardingReturn, "shopifyConnected" | "isLoading" | "shopDomain" | "setShopDomain" | "error" | "handleConnectShopify">) {
    return (
        <div className="flex flex-col gap-4">
            <ShopifyIcon />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Connect Your Shopify Store
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[500px]">
                Link your Shopify store so Trackocity can track orders, sessions, and attribute every sale to the
                right campaign.
            </p>
            {shopifyConnected ? (
                <Badge variant="outline" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-[1.5px] border-primary/50 bg-primary/8 text-primary font-semibold text-[15px] w-fit">
                    <CheckIcon /> <span>Shopify is connected</span>
                </Badge>
            ) : (
                <div className="flex flex-col gap-3 max-w-[320px]">
                    <Input
                        type="text"
                        placeholder="your-store.myshopify.com"
                        value={shopDomain}
                        onChange={(e) => setShopDomain(e.target.value)}
                        disabled={isLoading}
                    />
                    {error && (
                        <p className="text-sm font-medium text-destructive">
                            {error}
                        </p>
                    )}
                    <Button
                        variant="secondary"
                        size="lg"
                        className="inline-flex items-center justify-center gap-2 px-7 py-6 rounded-lg text-[15px] font-semibold transition-all duration-150 hover:border-primary/40 hover:bg-secondary/80 w-full"
                        disabled={isLoading}
                        onClick={() => handleConnectShopify()}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <LinkIcon size={18} /> Connect Shopify
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
