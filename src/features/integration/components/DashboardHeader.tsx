import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";

interface DashboardHeaderProps {
    userName?: string | "";
    userEmail?: string | "";
    onLogout: () => void | "";
}

export function DashboardHeader({ userName, userEmail, onLogout }: DashboardHeaderProps) {
    return (
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5 text-white"
                            >
                                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                            </svg>
                        </div>
                        <span className="text-lg font-semibold text-white">Dashboard</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/integration" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Integrations
                        </Link>
                        <Link to="/pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Billing
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        {userName && <p className="text-sm font-medium text-white">{userName}</p>}
                        {userEmail && <p className="text-xs text-slate-400">{userEmail}</p>}
                    </div>
                    <>
                        <ThemeSwitcher />
                        {onLogout && <Button
                            variant="outline"
                            size="sm"
                            onClick={onLogout}
                            className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                            Sign out
                        </Button>}
                    </>
                </div>
            </div>
        </header>
    );
}
