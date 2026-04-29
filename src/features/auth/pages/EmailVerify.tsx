import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { Loader2 } from "lucide-react";

const EmailVerify = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login");
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <AuthLayout
            title="Email Verification"
            subtitle="Your email has been successfully verified."
        >
            <div className="flex flex-col items-center justify-center space-y-6 py-4 text-center">
                <div className="rounded-full bg-green-100 p-4 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <svg
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <div className="space-y-3 w-full rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <h3 className="font-semibold text-foreground text-lg">Onboarding</h3>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        For a smooth experience, we are redirecting you to Sign-in Page.
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
};

export default EmailVerify;