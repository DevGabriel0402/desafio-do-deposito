import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "styled-components";
import { createTheme } from "../theme.js";

const ThemeContext = createContext();

export const useThemeTransition = () => useContext(ThemeContext);

export function ThemeToggleProvider({ children }) {
    // Stores the ID of the theme (light, dark, dracula, etc.)
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem("theme_preset") || "light";
    });

    const [brandColor, setBrandColor] = useState(() => {
        return localStorage.getItem("theme_brand") || "#2563EB";
    });

    const [appIcon, setAppIcon] = useState(() => {
        return localStorage.getItem("app_icon") || "Target";
    });

    const [appName, setAppName] = useState(() => {
        // Fallback for reading the old JSON storage or just simple string
        // For simplicity let's stick to a simple string key similar to others
        return localStorage.getItem("app_name") || "Cofrinho";
    });

    useEffect(() => {
        localStorage.setItem("theme_preset", currentTheme);
    }, [currentTheme]);

    useEffect(() => {
        localStorage.setItem("theme_brand", brandColor);
    }, [brandColor]);

    useEffect(() => {
        localStorage.setItem("app_icon", appIcon);
    }, [appIcon]);

    useEffect(() => {
        localStorage.setItem("app_name", appName);
        document.title = appName; // Also update document title
    }, [appName]);

    // Dynamic Favicon Effect
    useEffect(() => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${encodeURIComponent(brandColor)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2.5V5z"/>
            <path d="M2 9v1c0 1.1.9 2 2 2h1"/>
            <path d="M16 11h.01"/>
        </svg>
        `.trim();

        const link = document.querySelector("link[rel~='icon']");
        if (link) {
            link.href = `data:image/svg+xml;charset=utf-8,${svg}`;
        } else {
            const newLink = document.createElement("link");
            newLink.rel = "icon";
            newLink.href = `data:image/svg+xml;charset=utf-8,${svg}`;
            document.head.appendChild(newLink);
        }
    }, [brandColor]);

    const theme = useMemo(() => {
        return createTheme(currentTheme, brandColor);
    }, [currentTheme, brandColor]);

    // Helper for legacy components that rely on boolean check
    const isDark = currentTheme !== "light";

    // Legacy support for toggle button (cycles Light <-> Dark)
    const toggleTheme = () => {
        setCurrentTheme(prev => prev === "light" ? "dark" : "light");
    };

    const value = {
        currentTheme,
        setCurrentTheme,
        isDark,
        toggleTheme,
        brandColor,
        setBrandColor,

        appIcon,
        setAppIcon,
        appName,
        setAppName
    };

    return (
        <ThemeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}
