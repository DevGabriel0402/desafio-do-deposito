const baseTheme = {
    radius: { sm: "12px", md: "16px", lg: "22px", pill: "999px" },
    shadow: { soft: "0 12px 30px rgba(2, 6, 23, 0.08)", card: "0 6px 18px rgba(2, 6, 23, 0.06)" },
    space: (n) => `${n * 8}px`,
    font: { body: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial' },
};

export const THEME_PRESETS = {
    light: {
        id: "light",
        label: "Claro",
        brandColor: "#2563EB", // Blue
        colors: {
            bg: "#F7F8FA",
            surface: "#FFFFFF",
            surface2: "#F1F3F6",
            border: "rgba(2, 6, 23, 0.08)",
            text: "#0B1220",
            muted: "rgba(11, 18, 32, 0.62)",
        }
    },
    dark: {
        id: "dark",
        label: "Escuro",
        brandColor: "#3B82F6", // Lighter Blue for Dark Mode
        colors: {
            bg: "#0B1222",
            surface: "#111827",
            surface2: "#1F2937",
            border: "rgba(255, 255, 255, 0.08)",
            text: "#FFFFFF",
            muted: "rgba(156, 163, 175, 0.8)",
        }
    },
    dracula: {
        id: "dracula",
        label: "Dracula",
        brandColor: "#BD93F9", // Purple
        colors: {
            bg: "#282a36",
            surface: "#44475a",
            surface2: "#6272a4",
            border: "rgba(189, 147, 249, 0.2)",
            text: "#f8f8f2",
            muted: "rgba(248, 248, 242, 0.6)",
        }
    },
    tokio: {
        id: "tokio",
        label: "Tokio",
        brandColor: "#7aa2f7", // Indigo/Blue
        colors: {
            bg: "#1a1b26",
            surface: "#24283b",
            surface2: "#414868",
            border: "rgba(122, 162, 247, 0.2)",
            text: "#c0caf5",
            muted: "rgba(192, 202, 245, 0.6)",
        }
    },
    material: {
        id: "material",
        label: "Material",
        brandColor: "#80CBC4", // Teal
        colors: {
            bg: "#263238",
            surface: "#37474F",
            surface2: "#455A64",
            border: "rgba(255, 255, 255, 0.1)",
            text: "#ECEFF1",
            muted: "rgba(236, 239, 241, 0.6)",
        }
    }
};

export const createTheme = (presetKey = "light", brandColor = null) => {
    const preset = THEME_PRESETS[presetKey] || THEME_PRESETS.light;
    const isDark = presetKey !== "light";

    // Use passed brandColor if available (for custom override capability if we ever want it back)
    // OR default to the preset's brand color
    const effectiveBrand = brandColor || preset.brandColor;

    const colors = {
        ...preset.colors,
        brand: effectiveBrand,
        brand2: effectiveBrand,
        danger: isDark ? "#F87171" : "#EF4444",
        warning: isDark ? "#FBBF24" : "#F59E0B",
    };

    return {
        name: presetKey,
        ...baseTheme,
        colors,
        shadow: isDark ? {
            soft: "0 12px 30px rgba(0, 0, 0, 0.4)",
            card: "0 6px 18px rgba(0, 0, 0, 0.3)"
        } : baseTheme.shadow
    };
};

export const theme = createTheme("light");
