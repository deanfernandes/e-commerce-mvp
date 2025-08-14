import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";

interface ThemeContextProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = "theme";

const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const localStorageTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (!localStorageTheme) {
      return;
    }

    if (localStorageTheme === "light" || localStorageTheme === "dark") {
      setTheme(localStorageTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (theme === "light") {
      document.body.classList.remove("dark");
    } else if (theme === "dark") {
      document.body.classList.add("dark");
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
