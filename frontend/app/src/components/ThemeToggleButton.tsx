import useThemeContext from "../hooks/useThemeContext";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      title={theme === "light" ? "Light" : "Dark"}
      className="rounded-full bg-white dark:bg-gray-700 cursor-pointer text-xl w-10 h-10"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggleButton;
