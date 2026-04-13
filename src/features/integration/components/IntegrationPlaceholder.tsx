import { Card, CardContent } from "@/components/ui/card";

export function IntegrationPlaceholder() {
    return (
        <Card className="flex items-center justify-center border-dashed border-white/10 bg-white/[0.02]">
            <CardContent className="py-12 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-white/20 text-slate-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                    >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-slate-500">
                    More integrations
                </p>
                <p className="mt-1 text-xs text-slate-600">Coming soon</p>
            </CardContent>
        </Card>
    );
}
