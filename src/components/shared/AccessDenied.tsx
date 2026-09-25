import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AccessDeniedProps {
    title?: ReactNode;
    description?: ReactNode;
    className?: string;
}

export function AccessDenied({
    title = "You Don't Have Permissions to see this page",
    description = "Contact your admin/owner to get access to this page",
    className,
}: AccessDeniedProps) {
    return (
        <div className={cn("bg-card rounded-2xl border border-border/40 p-6 flex flex-col items-center justify-center h-[400px]", className)}>
            <div className="flex flex-col items-center gap-3 text-center">
                {typeof title === "string" ? (
                    <h2 className="text-xl font-medium text-foreground">{title}</h2>
                ) : (
                    title
                )}
                {typeof description === "string" ? (
                    <p className="text-muted-foreground">{description}</p>
                ) : (
                    description
                )}
            </div>
        </div>
    );
}

export default AccessDenied;
