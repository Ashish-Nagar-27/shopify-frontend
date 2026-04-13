import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { EmbedStatusResponse } from "../api/integrationApi";

interface ActiveIntegrationCardProps {
    isPixelEnabled: boolean;
    isWebhookEnabled: boolean;
    isPixelPending: boolean;
    isWebhookPending: boolean;
    embedStatus?: EmbedStatusResponse;
    onTogglePixel: (checked: boolean) => void;
    onToggleWebhook: (checked: boolean) => void;
}

export function ActiveIntegrationCard({
    isPixelEnabled,
    isWebhookEnabled,
    isPixelPending,
    isWebhookPending,
    embedStatus,
    onTogglePixel,
    onToggleWebhook,
}: ActiveIntegrationCardProps) {
    return (
        <Card className="group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-indigo-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader className="relative">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-7 w-7 text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </div>
                <CardTitle className="text-lg text-white">Active Integrations</CardTitle>
                <CardDescription className="text-slate-400">
                    Manage your Shopify data connection settings.
                </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-6">
                <div className="flex items-center justify-between space-x-2">
                    <label
                        htmlFor="pixel-switch"
                        className="flex flex-col space-y-1"
                    >
                        <span className="text-sm font-medium text-white leading-none">Connect Pixel</span>
                        <span className="text-xs text-slate-400">Tracks user visits and events on the storefront.</span>
                    </label>
                    <Switch
                        id="pixel-switch"
                        size="lg"
                        className="data-[state=checked]:bg-indigo-500 shadow-sm"
                        checked={isPixelEnabled}
                        onCheckedChange={onTogglePixel}
                        disabled={isPixelPending}
                    />
                </div>

                <div className="flex items-center justify-between space-x-2">
                    <label
                        htmlFor="webhook-switch"
                        className="flex flex-col space-y-1"
                    >
                        <span className="text-sm font-medium text-white leading-none">Connect Webhook</span>
                        <span className="text-xs text-slate-400">Receives order creation and update details.</span>
                    </label>
                    <Switch
                        id="webhook-switch"
                        size="lg"
                        className="data-[state=checked]:bg-indigo-500 shadow-sm"
                        checked={isWebhookEnabled}
                        onCheckedChange={onToggleWebhook}
                        disabled={isWebhookPending}
                    />
                </div>

                {embedStatus?.active && (
                    <div className="mt-6 border-t border-white/10 pt-6">
                        <div className="flex items-center justify-between space-x-2">
                            <label className="flex flex-col space-y-1">
                                <span className="text-sm font-medium text-white leading-none">Theme Pixel Active</span>
                                <span className="text-xs text-slate-400">Status of the theme app extension pixel.</span>
                            </label>
                            <span className="text-sm text-white font-medium bg-white/10 px-3 py-1 rounded-md">
                                {embedStatus.active ? "True" : "False"}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
