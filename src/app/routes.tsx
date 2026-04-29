import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { IntegrationPage } from "@/features/integration/pages/IntegrationPage";
import { PricingPage } from "@/features/billing/pages/PricingPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { ReportingPage } from "@/features/reporting/pages/ReportingPage";
import { CreativePage } from "@/features/creative/pages/CreativePage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { OnboardingPage } from "@/features/Onboarding/pages/Onboarding";
import { useAuthStore } from "@/store/useAuthStore";

import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import EmailVerify from "@/features/auth/pages/EmailVerify";

function CatchAll() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return <Navigate to={isAuthenticated ? "/integration" : "/login"} replace />;
}

const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
            { path: "/forgot-password", element: <ForgotPasswordPage /> },
            { path: "/reset-password", element: <ResetPasswordPage /> },
            { path: "/email-verify", element: <EmailVerify /> },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            { path: "/onboarding", element: <OnboardingPage /> },
            {
                element: <MainLayout />,
                children: [
                    { path: "/", element: <Navigate to="/integration" replace /> },
                    { path: "/integration", element: <IntegrationPage /> },
                    { path: "/pricing", element: <PricingPage /> },
                    { path: "/dashboard", element: <DashboardPage /> },
                    { path: "/reporting", element: <ReportingPage /> },
                    { path: "/creative", element: <CreativePage /> },
                    { path: "/settings", element: <SettingsPage /> },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <CatchAll />,
    },
]);

export function AppRoutes() {
    return <RouterProvider router={router} />;
}
