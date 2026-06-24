import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

/**
 * SearchBar Component
 * Renders a premium, accessible search input with immediate visual typing response
 * and a 300ms debounced update to the parent filter callback.
 *
 * @param {Object} props
 * @param {string} props.value - The active query string value from the parent
 * @param {Function} props.onChange - Callback triggered 300ms after typing halts, or immediately on clear
 */
function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const debounceTimeout = useRef(null);

  // Keep local value in sync with the parent value prop (e.g. if cleared from outside)
  if (value !== prevValue) {
    setLocalValue(value);
    setPrevValue(value);
  }

  // Clean up debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setLocalValue(newVal);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      onChange(newVal);
    }, 300);
  };

  const handleClear = () => {
    setLocalValue("");
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    onChange("");
  };

  return (
    <div className="relative flex-1 max-w-md w-full">
      {/* Magnifying glass search icon */}
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 dark:text-gray-500 transition-colors duration-200">
        <Search className="w-4.5 h-4.5" />
      </span>

      {/* Search Input Box */}
      <input
        type="text"
        value={localValue}
        onChange={handleInputChange}
        placeholder="Search by name, company, or email..."
        aria-label="Search leads"
        className="w-full pl-10 pr-10 py-2.5 text-sm font-medium border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-slate-50/50 dark:bg-gray-905/30 hover:bg-slate-50 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-850 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 transition-all duration-200"
      />

      {/* Clear 'X' Button */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 dark:text-gray-400 hover:text-slate-650 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
