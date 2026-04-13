import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export function useThemeEffect() {
    const { mode } = useThemeStore();

    useEffect(() => {
        const root = document.documentElement;

        // Force ocean theme globally
        root.setAttribute("data-theme", "ocean");

        // Mode classes
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const apply = () => {
            root.classList.remove("dark", "dim");
            if (mode === "dark") {
                root.classList.add("dark");
            } else if (mode === "dim") {
                root.classList.add("dim");
            } else if (mode === "system" && media.matches) {
                root.classList.add("dark");
            }
        };

        apply();
        media.addEventListener("change", apply);
        return () => media.removeEventListener("change", apply);
    }, [mode]);
}