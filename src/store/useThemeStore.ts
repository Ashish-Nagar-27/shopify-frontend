import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Mode = "light" | "dark" | "dim" | "system";

interface ThemeState {
    mode: Mode;
    setMode: (mode: Mode) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            mode: "dim",
            setMode: (mode) => set({ mode }),
        }),
        { name: "theme-storage" }
    )
);