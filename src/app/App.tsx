import { useThemeEffect } from "@/hooks/useThemeEffect";
import { AppProviders } from "./providers";
import { AppRoutes } from "./routes";

export function App() {
    useThemeEffect();
    return (
        <AppProviders>
            <AppRoutes />
        </AppProviders>
    );
}

export default App;
