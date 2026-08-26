import type { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <>

            <div className="relative flex  items-center justify-center overflow-hidden bg-background px-4 py-12">
                {/* Decorative background elements */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden ">
                    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-chart-1/10 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
                </div>

                <div className="relative z-10 w-full max-w-md h-screen">
                    {/* Logo / Brand */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">

                            <img src='/pumalyze-logo.png' alt="Pumalyze Logo" className="w-13 h-10 w-full h-full object-cover" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-border bg-card text-card-foreground p-8 shadow-2xl backdrop-blur-xl">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
