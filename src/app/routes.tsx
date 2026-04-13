import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { IntegrationPage } from "@/features/integration/pages/IntegrationPage";
import { PricingPage } from "@/features/billing/pages/PricingPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { ReportingPage } from "@/features/reporting/pages/ReportingPage";
import { CreativePage } from "@/features/creative/pages/CreativePage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { OnboardingPage } from "@/features/Onboarding/pages/Onboarding";

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/integration" replace />} />
                <Route path="/integration" element={<IntegrationPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/reporting" element={<ReportingPage />} />
                <Route path="/creative" element={<CreativePage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
