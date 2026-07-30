
import TopBar from "@/components/shared/Header";
import { AudienceSessions, ChannelMetrics, PerformanceMetrics, ChannelPerformance } from "../components";



export function DashboardPage() {
    return (
        <>
            <TopBar
                showDatePicker={true}
                dateStoreKey={"dashboardDates"}
                title="Overview"
            />
            <div className="min-h-svh bg-background text-foreground">
                <main className="px-7 pt-6 pb-12 flex flex-col gap-[22px]">
                    <PerformanceMetrics />
                    <ChannelMetrics />
                    <ChannelPerformance />
                    <AudienceSessions />
                    {/* <AiInsights /> */}
                </main>
            </div>
        </>
    );
}
