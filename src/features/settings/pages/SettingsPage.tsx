import TopBar from "@/components/shared/Header";
import { Outlet } from "react-router-dom";
import { SettingsTabs } from "../components/SettingsTabs";
import { useAuthStore } from "@/store/useAuthStore";

export function SettingsPage() {
    const { user } = useAuthStore();

    const settingsContent = () => {
        if (user?.role === 'read_only') {
            return (
                <div className="bg-card rounded-2xl border border-border/40 p-6 flex flex-col items-center justify-center h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <h2 className="text-xl font-medium text-foreground">You Don't Have Permissions to see this page</h2>
                    <p className="text-muted-foreground">Contact your admin/owner to get access to this page</p>
                </div>
            </div>
        );
    }
    return <Outlet />
   }

    return (
        <>
            <TopBar
                showDatePicker={false}
            />
            <div className=" bg-background text-foreground">
                <SettingsTabs />
                <main className="px-7 pt-6 pb-12 flex flex-col gap-[22px] max-w-[1180px] mx-auto">
                    {settingsContent()}
                </main>
            </div>
        </>
    );
}
