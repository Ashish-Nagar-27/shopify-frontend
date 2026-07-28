import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ReactNode } from "react";

interface AppTooltipProps {
    content: ReactNode;
    children: ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    disabled?: boolean; // for the "disabled button" case
    className?: string;
}

export function AppTooltip({
    content,
    children,
    side = "top",
    disabled = false,
    className,
}: AppTooltipProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {disabled ? <span tabIndex={0}>{children}</span> : children}
            </TooltipTrigger>
            <TooltipContent side={side} className={`max-w-[240px] text-wrap text-center ${className || ""}`}>
                {content}
            </TooltipContent>
        </Tooltip>
    );
}