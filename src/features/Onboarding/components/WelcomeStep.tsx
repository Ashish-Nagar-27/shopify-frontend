import { RocketIcon } from "./icons";

export function WelcomeStep() {
    return (
        <div className="flex flex-col gap-4">
            <div className="mb-1">
                <RocketIcon />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Welcome to Trackocity!
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[500px]">
                Your journey to accurate, real-time marketing attribution starts here. We'll guide you through
                connecting your store and ad platforms in just a few quick steps.
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
}
