import {
    Loader2, ShieldCheck, ShieldAlert, Sparkles,
    ToggleRight, Save, ArrowLeft, ExternalLink, RefreshCw, CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEnableTracking } from "../hooks/useEnableTracking";

interface EnableTrackingProps {
    isThemeExtensionEnabled: boolean;
    isLoading: boolean;
    error: string | null;
    shopName?: string;
    workspaceId?: string;
    onEnableTracking: () => Promise<void>;
    onExtensionVerified?: () => void | Promise<void>;
    onNext?: () => void;
}

export function EnableTracking({
    isThemeExtensionEnabled,
    isLoading,
    error,
    shopName,
    workspaceId,
    onEnableTracking,
    onExtensionVerified,
    onNext,
}: EnableTrackingProps) {
    const {
        hasOpenedEditor,
        isChecking,
        checkError,
        checkSuccess,
        handleOpenEditor,
        handleCheck,
    } = useEnableTracking({
        onEnableTracking,
        onExtensionVerified,
    });

    return (
        <div className="flex flex-col gap-6 py-2">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                    Enable Storefront Tracking
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground mt-2 max-w-[500px]">
                    Trackocity requires the theme app extension to accurately attribute your store's sales and customer journeys.
                </p>
            </div>

            {/* Already enabled state */}
            {isThemeExtensionEnabled && checkSuccess ? (
                <Card className="relative overflow-hidden border-[1.5px] border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10 p-6 rounded-2xl flex flex-col gap-4 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-500 shrink-0">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-lg text-foreground">Theme Pixel Active</span>
                                <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 text-xs animate-pulse">
                                    Live
                                </Badge>
                            </div>
                            <p className="text-[14px] leading-relaxed text-muted-foreground">
                                Shopify Theme App Extension is successfully active on your storefront. Trackocity is now capturing and attributing your store events in real-time.
                            </p>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="flex flex-col gap-5">
                    {/* Status card */}
                    <Card className="relative overflow-hidden border-[1.5px] border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/10 p-6 rounded-2xl flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500 shrink-0">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-lg text-foreground">Activation Required</span>
                                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-transparent font-semibold px-2 py-0.5 text-xs">
                                        Inactive
                                    </Badge>
                                </div>
                                <p className="text-[14px] leading-relaxed text-muted-foreground">
                                    The tracking extension is not yet active. Follow the steps below to enable it in your Shopify theme.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Steps card */}
                    <Card className="border-[1.5px] border-border/60 p-5 rounded-2xl flex flex-col gap-4">
                        <p className="text-sm font-semibold text-foreground">Follow these steps:</p>
                        <ol className="flex flex-col gap-4">

                            {/* Step 1 - Open editor */}
                            <li className="flex items-start gap-3">
                                <span className={`shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 transition-colors ${hasOpenedEditor ? "bg-emerald-500/15 text-emerald-600" : "bg-primary/10 text-primary"}`}>
                                    {hasOpenedEditor ? <CheckCircle2 className="w-4 h-4" /> : "1"}
                                </span>
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                        <ExternalLink className="w-4 h-4 text-primary" />
                                        Open your theme editor
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Click the button below — it opens the App embeds panel directly.
                                    </span>
                                    <Button
                                        variant={hasOpenedEditor ? "outline" : "default"}
                                        size="sm"
                                        className="mt-1 w-fit gap-2 rounded-lg text-[13px] font-semibold"
                                        disabled={isLoading}
                                        onClick={handleOpenEditor}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <ExternalLink className="w-4 h-4" />
                                                {hasOpenedEditor ? "Re-open Theme Editor" : "Open Theme Editor"}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </li>

                            {/* Step 2 - Toggle on */}
                            <li className="flex items-start gap-3">
                                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                        <ToggleRight className="w-4 h-4 text-primary" />
                                        Toggle <strong>Trackocity Tracker</strong> on
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        It appears at the top of the App embeds panel on the left sidebar.
                                    </span>
                                </div>
                            </li>

                            {/* Step 3 - Save */}
                            <li className="flex items-start gap-3">
                                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">3</span>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                        <Save className="w-4 h-4 text-primary" />
                                        Click <strong>Save</strong> in the top right
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Don't close the tab without saving or the change won't apply.
                                    </span>
                                </div>
                            </li>

                            {/* Step 4 - Verify */}
                            <li className="flex items-start gap-3">
                                <span className={`shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 transition-colors ${checkSuccess ? "bg-emerald-500/15 text-emerald-600" : "bg-primary/10 text-primary"}`}>
                                    {checkSuccess ? <CheckCircle2 className="w-4 h-4" /> : "4"}
                                </span>
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                        <ArrowLeft className="w-4 h-4 text-primary" />
                                        Come back here and verify
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        After saving in the theme editor, click below to confirm it's active.
                                    </span>

                                    {/* Check error */}
                                    {checkError && (
                                        <p className="text-xs font-medium text-destructive mt-1">
                                            {checkError}
                                        </p>
                                    )}

                                    {/* Check success */}
                                    {checkSuccess && (
                                        <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-300">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Extension detected!
                                        </p>
                                    )}

                                    <div className="flex items-center gap-3 mt-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`w-fit gap-2 rounded-lg text-[13px] font-semibold transition-all ${checkSuccess ? "border-emerald-500/40 text-emerald-600" : ""} ${!hasOpenedEditor ? "opacity-50 cursor-not-allowed" : ""}`}
                                            disabled={isChecking || checkSuccess || !hasOpenedEditor}
                                            onClick={handleCheck}
                                        >
                                            {isChecking ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Checking...
                                                </>
                                            ) : checkSuccess ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Verified
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="w-4 h-4" />
                                                    {checkError ? "Check Again" : "Check Now"}
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {!hasOpenedEditor && (
                                        <p className="text-xs text-muted-foreground/60">
                                            Open the theme editor first to enable this button.
                                        </p>
                                    )}
                                </div>
                            </li>
                        </ol>
                    </Card>

                    {/* Global error */}
                    {error && (
                        <p className="text-sm font-medium text-destructive">{error}</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default EnableTracking;