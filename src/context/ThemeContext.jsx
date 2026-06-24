/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

// Create context for Theme
const ThemeContext = createContext();

/**
 * ThemeProvider wraps the application and manages the dark/light mode state.
 */
export function ThemeProvider({ children }) {
  // Read initial preference from localStorage or default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("crm_theme");
    return savedTheme === "dark";
  });

  // Keep DOM in sync with state on mount/initial load
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Toggle the theme state, update DOM, and persist to localStorage
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      if (nextMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("crm_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("crm_theme", "light");
      }
      return nextMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to consume the Theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
