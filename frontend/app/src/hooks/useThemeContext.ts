import { useContext } from "react";
import {
  ThemeContext,
  type ThemeContextType,
} from "../context/theme/ThemeContext";

const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export default useThemeContext;
