import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PartyIcon } from "./icons";

export function CompleteStep() {
    const navigate = useNavigate();
    
    return (
        <div className="flex flex-col items-center gap-4">
            <PartyIcon />
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-2">
                You're All Set!
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground text-center max-w-[420px]">
                Your store and ad channels are connected. Trackocity is now tracking every touchpoint. Head to your
                dashboard to see real-time attribution data.
            </p>
            <Button
                size="lg"
                className="px-8 mt-2 font-bold transition-opacity hover:opacity-90 tracking-tight"
                onClick={() => navigate("/dashboard")}
            >
                Go to Dashboard →
            </Button>
        </div>
    );
}
