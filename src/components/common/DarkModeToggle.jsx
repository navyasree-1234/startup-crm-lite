import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * DarkModeToggle renders a premium sliding toggle switch
 * with Sun and Moon icons to switch between Light and Dark themes.
 */
function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-14 h-8 bg-slate-200 dark:bg-gray-700 rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
      aria-label="Toggle theme mode"
    >
      {/* Sliding Knob */}
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900 shadow-md transition-transform duration-300 ease-in-out ${
          isDarkMode ? "translate-x-6" : "translate-x-0"
        }`}
      />
      
      {/* Icons */}
      <Sun
        className={`w-4 h-4 text-amber-500 z-10 ml-1 transition-opacity duration-300 ${
          isDarkMode ? "opacity-30" : "opacity-100"
        }`}
      />
      <Moon
        className={`w-4 h-4 text-indigo-400 z-10 mr-1 transition-opacity duration-300 ${
          isDarkMode ? "opacity-100" : "opacity-30"
        }`}
      />
    </button>
  );
}

export default DarkModeToggle;
