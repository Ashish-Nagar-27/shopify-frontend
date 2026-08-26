import TopBar from "@/components/shared/Header";
import { FunnelStrip } from "../components/FunnelStrip";
import { ActionCards } from "../components/ActionCards";
import { CreativeTable } from "../components/CreativeTable";

export function CreativePage() {
    return (
        <>
            <TopBar
                showDatePicker={true}
                dateStoreKey={"creativeDates"}
                title="Creative Insights"
            />
            <div className="min-h-svh bg-background text-foreground">
                <main className="px-7 pt-6 pb-12 flex flex-col gap-[22px]">
                    <FunnelStrip />
                    <ActionCards />
                    <CreativeTable />
                </main>
            </div>
        </>
    );
}
