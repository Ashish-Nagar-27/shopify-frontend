import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { AppSidebar } from "./AppSidebar";
import Header from "@/components/shared/Header";
import { Sidebar } from "lucide-react";

export function MainLayout() {
    // const { isAuthenticated, isLoading } = useAuthStore();
    const { isLoading } = useAuthStore();
    const isAuthenticated = true
    const location = useLocation()
    

    const showSidebar = !location.pathname.includes('/onboarding')
    const showDatePicker = location.pathname.includes('/reporting')

    if (isLoading) {
        return (
            <div className="flex min-h-svh items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <svg
                        className="h-8 w-8 animate-spin text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    <p className="text-sm text-muted-foreground">Loading…</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        // <div className="flex w-full h-svh overflow-hidden bg-background">
        //     {showSidebar && <AppSidebar />}
        //     <main className="flex-1 h-full overflow-y-auto">
        //         {/* <Header /> */}
              
        //         <div className="">
        //             <Outlet />
        //         </div>
        //     </main>
        // </div>
          <div className={`grid ${showSidebar ? 'grid-cols-[72px_1fr]' : 'grid-cols-1'} min-h-screen`}>
      {showSidebar && <AppSidebar />}
      <div className="flex flex-col min-w-0">
       {showSidebar &&  <Header showDatePicker={showDatePicker} dateStoreKey={showDatePicker ? "reportingDates" : "dashboardDates"} />}
        <>
            <Outlet /> 
        </>
      </div>
      {/* <button
        className="fixed right-5 bottom-5 w-11 h-11 rounded-[14px] bg-[linear-gradient(135deg,var(--cyan),var(--magenta))] grid place-items-center shadow-[0_12px_30px_-8px_oklch(0.72_0.20_340/0.5)] text-[oklch(0.10_0.018_240)] z-10"
        title="Pumalyze AI">
        <Icon.sparkle width={20} height={20} />
      </button>
      <ThemeSwitcher state={state} set={set} accentColors={ACCENT_COLORS} /> */}
    </div>
    );
}
