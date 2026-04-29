import { useThemeEffect } from "@/hooks/useThemeEffect";
import { AppProviders } from "./providers";
import { AppRoutes } from "./routes";
import { Toaster } from "@/components/ui/sonner";

export function App() {
    useThemeEffect();
    return (
        <AppProviders>
            <AppRoutes />
            <Toaster />
        </AppProviders>
    );
}

export default App;
