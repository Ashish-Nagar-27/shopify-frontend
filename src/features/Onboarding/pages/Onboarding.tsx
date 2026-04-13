import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = [
    { id: 1, label: "Welcome" },
    { id: 2, label: "Shopify" },
    { id: 3, label: "Ad Channels" },
    { id: 4, label: "UTM Params" },
    { id: 5, label: "Complete" },
];

// --- Icons ---
const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
            d="M4 9.5L7.5 13L14 5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const ShopifyIcon = () => (
    <svg width="32" height="32" viewBox="0 0 256 292" fill="none">
        <path
            d="M224 56s-2-1-4-1c-1 0-26-2-26-2s-17-17-19-19c-2-2-5-1-6-1l-9 3C156 25 149 16 138 16h-2c-4-5-8-7-12-7-30 0-44 37-49 56l-20 6c-6 2-6 2-7 8L33 234l148 28 80-17S225 57 224 56zM162 41l-14 4c0-4-1-10-2-16 8 2 13 10 16 12zm-25 8l-29 9c3-11 8-22 18-29 4 3 8 11 11 20zm-19-27c3 0 5 1 7 3-13 6-21 22-24 36l-23 7c6-22 19-46 40-46z"
            fill="#95BF47"
        />
        <path
            d="M220 55c-1 0-26-2-26-2s-17-17-19-19c-1-1-2-1-3-1l-11 225 80-17S225 57 224 56c0-1-3-1-4-1z"
            fill="#5E8E3E"
        />
        <path
            d="M138 101l-12 38s-11-6-24-6c-19 0-20 12-20 15 0 17 43 23 43 62 0 31-19 50-45 50-31 0-47-19-47-19l8-27s16 14 30 14c9 0 13-7 13-12 0-22-36-23-36-58 0-30 21-59 64-59 17 0 26 5 26 5v-3z"
            fill="#FFF"
        />
    </svg>
);

const GoogleIcon = () => (
    <svg width="28" height="28" viewBox="0 0 48 48">
        <path
            fill="#EA4335"
            d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.5 30.4 0 24 0 14.6 0 6.6 5.5 2.7 13.4l7.9 6.2C12.7 13.4 17.9 9.5 24 9.5z"
        />
        <path
            fill="#4285F4"
            d="M46.6 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 2.8-2.2 5.2-4.6 6.8l7.1 5.5c4.1-3.8 6.4-9.4 6.4-16.8z"
        />
        <path
            fill="#34A853"
            d="M10.5 28.7c-1-2.8-1-5.8 0-8.6l-7.9-6.2c-3.5 7-3.5 15 0 22l7.9-6.2v-1z"
        />
        <path
            fill="#FBBC05"
            d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2.2 1.5-5 2.4-8.8 2.4-6.1 0-11.3-3.9-13.2-9.5l-7.9 6.2C6.6 42.5 14.6 48 24 48z"
        />
    </svg>
);

const MetaIcon = () => (
    <svg width="28" height="28" viewBox="0 0 48 48">
        <defs>
            <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0081FB" />
                <stop offset="100%" stopColor="#0064E0" />
            </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="24" fill="url(#mg)" />
        <path
            d="M13 18c-2.5 0-4 2.5-4 6s1.5 6.5 4 6.5c1.5 0 3-1.5 4.5-4l2.5-4 2.5 4c1.5 2.5 3 4 4.5 4 2.5 0 4-3 4-6.5s-1.5-6-4-6c-1.5 0-3 1.5-4.5 4l-2.5 4-2.5-4c-1.5-2.5-3-4-4.5-4z"
            fill="#FFF"
        />
    </svg>
);

const RocketIcon = () => (
    <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        className="text-primary"
    >
        <path
            d="M24 4C24 4 14 14 14 28c0 4 2 8 4 10l6-6 6 6c2-2 4-6 4-10C34 14 24 4 24 4z"
            fill="currentColor"
        />
        <circle cx="24" cy="22" r="3" fill="#FFF" />
        <path
            d="M14 28c-4 2-6 6-6 6l6 2v-8zM34 28c4 2 6 6 6 6l-6 2v-8z"
            fill="currentColor"
            opacity="0.5"
        />
    </svg>
);

const PartyIcon = () => (
    <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        className="text-primary"
    >
        <circle cx="28" cy="28" r="26" fill="currentColor" fillOpacity="0.12" />
        <path
            d="M28 12l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z"
            fill="currentColor"
        />
        <path
            d="M16 32l1 4h4l-3 2 1 4-3-3-3 3 1-4-3-2h4l1-4z"
            fill="currentColor"
            opacity="0.5"
        />
        <path
            d="M38 30l1 4h4l-3 2 1 4-3-3-3 3 1-4-3-2h4l1-4z"
            fill="currentColor"
            opacity="0.5"
        />
        <circle
            cx="28"
            cy="34"
            r="8"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
        />
        <path
            d="M24 34l2.5 2.5L32 31"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const LinkIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
            d="M8.5 11.5a3.5 3.5 0 005 0l3-3a3.5 3.5 0 00-5-5l-1 1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
        />
        <path
            d="M11.5 8.5a3.5 3.5 0 00-5 0l-3 3a3.5 3.5 0 005 5l1-1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
        />
    </svg>
);

// --- Main Component ---
export function OnboardingPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [shopifyConnected, setShopifyConnected] = useState(false);
    const [connectingShopify, setConnectingShopify] = useState(false);
    const [googleConnected, setGoogleConnected] = useState(false);
    const [metaConnected, setMetaConnected] = useState(false);
    const [connectingGoogle, setConnectingGoogle] = useState(false);
    const [connectingMeta, setConnectingMeta] = useState(false);
    const [utmApplied, setUtmApplied] = useState<Record<string, boolean>>({
        google: false,
        meta: false,
    });
    const [animating, setAnimating] = useState(false);
    const contentRef = useRef<HTMLElement>(null);

    const connectedChannels: string[] = [];
    if (googleConnected) connectedChannels.push("google");
    if (metaConnected) connectedChannels.push("meta");

    const canNext = () => {
        if (step === 1) return true;
        if (step === 2) return shopifyConnected;
        if (step === 3) return connectedChannels.length > 0;
        if (step === 4)
            return connectedChannels.some((c) => utmApplied[c]);
        return false;
    };

    const goTo = (dir: "next" | "prev") => {
        if (animating) return;
        setAnimating(true);
        setTimeout(() => {
            setStep((s) => s + (dir === "next" ? 1 : -1));
            setTimeout(() => setAnimating(false), 30);
        }, 260);
    };

    const simulateConnect = (
        setter: (v: boolean) => void,
        loadingSetter: (v: boolean) => void
    ) => {
        loadingSetter(true);
        setTimeout(() => {
            loadingSetter(false);
            setter(true);
        }, 1600);
    };

    // --- Render Steps ---
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="flex flex-col gap-4">
                        <div className="mb-1">
                            <RocketIcon />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            Welcome to Trackocity!
                        </h2>
                        <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[500px]">
                            Your journey to accurate, real-time marketing
                            attribution starts here. We'll guide you through
                            connecting your store and ad platforms in just a few
                            quick steps.
                        </p>
                        <div className="mt-2 rounded-xl overflow-hidden border border-border bg-black">
                            <iframe
                                className="w-full aspect-video block border-none"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                title="Onboarding Tutorial"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                            <span className="block px-3.5 py-2.5 text-xs text-muted-foreground bg-secondary font-mono">
                                Watch a quick setup tutorial (2 min)
                            </span>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="flex flex-col gap-4">
                        <ShopifyIcon />
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            Connect Your Shopify Store
                        </h2>
                        <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[500px]">
                            Link your Shopify store so Trackocity can track
                            orders, sessions, and attribute every sale to the
                            right campaign.
                        </p>
                        {shopifyConnected ? (
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-[1.5px] border-primary/50 bg-primary/8 text-primary font-semibold text-[15px] w-fit">
                                <CheckIcon />{" "}
                                <span>Shopify is connected</span>
                            </div>
                        ) : (
                            <button
                                className="inline-flex items-center gap-2 px-7 py-3 rounded-lg border-[1.5px] border-border bg-secondary text-foreground text-[15px] font-semibold cursor-pointer transition-all duration-150 hover:border-primary/40 hover:bg-secondary/80 w-fit disabled:opacity-60 disabled:cursor-wait"
                                disabled={connectingShopify}
                                onClick={() =>
                                    simulateConnect(
                                        setShopifyConnected,
                                        setConnectingShopify
                                    )
                                }
                            >
                                {connectingShopify ? (
                                    <span className="inline-block w-5 h-5 border-[2.5px] border-border border-t-primary rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <LinkIcon /> Connect Shopify
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            Connect Ad Channels
                        </h2>
                        <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[500px]">
                            Connect at least one ad platform so Trackocity can
                            pull campaign data and map it to your revenue.
                        </p>
                        <div className="grid grid-cols-2 gap-3.5 mt-1">
                            {/* Google */}
                            <div
                                className={`flex flex-col items-center gap-3 px-4 py-7 rounded-xl border-[1.5px] transition-all duration-200 ${
                                    googleConnected
                                        ? "border-primary/50 bg-primary/4"
                                        : "border-border bg-secondary"
                                }`}
                            >
                                <GoogleIcon />
                                <span className="font-semibold text-sm text-foreground">
                                    Google Ads
                                </span>
                                {googleConnected ? (
                                    <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                                        <CheckIcon /> Connected
                                    </div>
                                ) : (
                                    <button
                                        className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-wait"
                                        disabled={connectingGoogle}
                                        onClick={() =>
                                            simulateConnect(
                                                setGoogleConnected,
                                                setConnectingGoogle
                                            )
                                        }
                                    >
                                        {connectingGoogle ? (
                                            <span className="inline-block w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                                        ) : (
                                            "Connect"
                                        )}
                                    </button>
                                )}
                            </div>
                            {/* Meta */}
                            <div
                                className={`flex flex-col items-center gap-3 px-4 py-7 rounded-xl border-[1.5px] transition-all duration-200 ${
                                    metaConnected
                                        ? "border-primary/50 bg-primary/4"
                                        : "border-border bg-secondary"
                                }`}
                            >
                                <MetaIcon />
                                <span className="font-semibold text-sm text-foreground">
                                    Meta Ads
                                </span>
                                {metaConnected ? (
                                    <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                                        <CheckIcon /> Connected
                                    </div>
                                ) : (
                                    <button
                                        className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-wait"
                                        disabled={connectingMeta}
                                        onClick={() =>
                                            simulateConnect(
                                                setMetaConnected,
                                                setConnectingMeta
                                            )
                                        }
                                    >
                                        {connectingMeta ? (
                                            <span className="inline-block w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                                        ) : (
                                            "Connect"
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            Set Up UTM Parameters
                        </h2>
                        <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[500px]">
                            Add UTM tracking to your connected ad channels so
                            every click is properly attributed.
                        </p>
                        <div className="flex flex-col gap-3 mt-1">
                            {connectedChannels.map((ch) => (
                                <div
                                    key={ch}
                                    className="flex justify-between items-center px-5 py-4 bg-secondary border-[1.5px] border-border rounded-xl"
                                >
                                    <div className="flex items-center gap-2.5">
                                        {ch === "google" ? (
                                            <GoogleIcon />
                                        ) : (
                                            <MetaIcon />
                                        )}
                                        <span className="font-semibold text-sm text-foreground">
                                            {ch === "google"
                                                ? "Google Ads"
                                                : "Meta Ads"}
                                        </span>
                                    </div>
                                    {utmApplied[ch] ? (
                                        <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                                            <CheckIcon /> UTMs Applied
                                        </div>
                                    ) : (
                                        <button
                                            className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold cursor-pointer transition-opacity hover:opacity-90"
                                            onClick={() =>
                                                setUtmApplied((prev) => ({
                                                    ...prev,
                                                    [ch]: true,
                                                }))
                                            }
                                        >
                                            Apply UTMs
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 mt-2 px-4 py-3 bg-primary/5 rounded-lg text-[13px] text-muted-foreground leading-relaxed">
                            <span className="text-base">💡</span>
                            Trackocity auto-generates UTM templates optimized
                            for attribution accuracy.
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="flex flex-col items-center gap-4">
                        <PartyIcon />
                        <h2 className="text-2xl font-bold tracking-tight text-foreground mt-2">
                            You're All Set!
                        </h2>
                        <p className="text-[15px] leading-relaxed text-muted-foreground text-center max-w-[420px]">
                            Your store and ad channels are connected. Trackocity
                            is now tracking every touchpoint. Head to your
                            dashboard to see real-time attribution data.
                        </p>
                        <button
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg text-[15px] font-bold cursor-pointer transition-opacity hover:opacity-90 tracking-tight"
                            onClick={() => navigate("/dashboard")}
                        >
                            Go to Dashboard →
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-svh bg-background flex flex-col items-center px-4 pb-12 font-sans text-foreground">
            {/* Header */}
            <header className="w-full max-w-[720px] flex justify-between items-center pt-7">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                    <span className="font-mono font-bold text-lg tracking-tight text-foreground">
                        trackocity
                    </span>
                </div>
                <span className="text-[13px] text-muted-foreground font-mono">
                    Step {Math.min(step, 5)} of 5
                </span>
            </header>

            {/* Stepper */}
            <nav className="flex items-center justify-center mt-9 mb-8 w-full max-w-[620px]">
                {STEPS.map((s, i) => {
                    const done = step > s.id;
                    const active = step === s.id;
                    return (
                        <div
                            key={s.id}
                            className="flex items-center flex-shrink-0"
                        >
                            <div
                                className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-250 flex-shrink-0 ${
                                    done
                                        ? "bg-primary/70 text-primary-foreground border-primary/70"
                                        : active
                                          ? "bg-primary text-primary-foreground border-primary animate-pulse"
                                          : "bg-secondary text-muted-foreground border-border"
                                }`}
                            >
                                {done ? <CheckIcon /> : s.id}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div
                                    className={`w-12 h-0.5 mx-1.5 rounded-sm transition-colors duration-250 ${
                                        done
                                            ? "bg-primary/70"
                                            : "bg-border"
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Content Card */}
            <main
                ref={contentRef}
                className={`w-full max-w-[620px] bg-card border border-border rounded-2xl px-10 py-11 min-h-[340px] flex flex-col ${
                    !animating ? "animate-in fade-in slide-in-from-bottom-3 duration-400" : ""
                }`}
                key={step}
            >
                {renderStep()}
            </main>

            {/* Navigation */}
            {step < 5 && (
                <footer className="w-full max-w-[620px] flex justify-between items-center mt-6">
                    {step > 1 ? (
                        <button
                            className="px-6 py-3 bg-transparent border-[1.5px] border-border rounded-lg text-muted-foreground text-sm font-medium cursor-pointer transition-colors hover:border-muted-foreground/40"
                            onClick={() => goTo("prev")}
                        >
                            ← Back
                        </button>
                    ) : (
                        <div />
                    )}
                    <button
                        className={`px-8 py-3 bg-primary text-primary-foreground rounded-lg text-[15px] font-bold cursor-pointer transition-opacity tracking-tight ${
                            canNext()
                                ? "hover:opacity-90"
                                : "opacity-35 cursor-not-allowed"
                        }`}
                        disabled={!canNext()}
                        onClick={() => goTo("next")}
                    >
                        {step === 4 ? "Finish Setup" : "Continue"} →
                    </button>
                </footer>
            )}
        </div>
    );
}