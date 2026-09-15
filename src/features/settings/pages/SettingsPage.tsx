import TopBar from "@/components/shared/Header";
import { Outlet } from "react-router-dom";
import { SettingsTabs } from "../components/SettingsTabs";

export function SettingsPage() {
    return (
        <>
            <TopBar
                showDatePicker={false}
            />
            <div className="min-h-svh bg-background text-foreground">
                <SettingsTabs />
                <main className="px-7 pt-6 pb-12 flex flex-col gap-[22px] max-w-[1180px] mx-auto">
                    <Outlet />
                </main>
            </div>
        </>
    );
}
