import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

// Define the state type for the ThemeProvider
export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Define the initial state for the ThemeProvider
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

// Creates a 'bucket' that holds data that any componen can access without props if inside the provider
export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

// Define the props type for the ThemeProvider
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "system",
}) => {
  // Load theme from localStorage if available, otherwise use defaultTheme
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem("theme");
    if (
      storedTheme === "dark" ||
      storedTheme === "light" ||
      storedTheme === "system"
    ) {
      return storedTheme;
    }
    return defaultTheme;
  });

  // Effect to update the theme when it changes
  useEffect(() => {
    // Get the root element, which is the entire html document
    const root = window.document.documentElement;

    // Remove all existing theme classes on the root element
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
      localStorage.setItem("theme", theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
};
