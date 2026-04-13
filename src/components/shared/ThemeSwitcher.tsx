import { useThemeStore, type Mode } from "@/store/useThemeStore";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Monitor, Check, CloudMoon } from "lucide-react";

const modes: { value: Mode; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
    { value: "dim", label: "Dim", icon: <CloudMoon className="h-4 w-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
    { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
];

export function ThemeSwitcher() {
    const { mode, setMode } = useThemeStore();

    const currentMode = modes.find((m) => m.value === mode) || modes[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    {currentMode.icon}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-36">
                {modes.map((m) => (
                    <DropdownMenuItem
                        key={m.value}
                        onClick={() => setMode(m.value)}
                        className="flex items-center justify-between cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            {m.icon}
                            {m.label}
                        </div>
                        {mode === m.value && <Check className="h-3.5 w-3.5" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}