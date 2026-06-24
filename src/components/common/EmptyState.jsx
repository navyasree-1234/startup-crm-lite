import { FolderOpen, Search, XCircle } from "lucide-react";

/**
 * EmptyState Component
 * Displays a descriptive, friendly message when no leads are available.
 * Tailored styling for two scenarios:
 * 1. Zero total leads in the CRM database.
 * 2. Zero leads matching current search queries or filters.
 *
 * @param {Object} props
 * @param {number} props.totalCount - Total number of leads in the CRM
 * @param {number} props.filteredCount - Number of leads matching the active filters
 * @param {Function} props.onClearFilters - Callback to reset search query and active filter
 */
function EmptyState({ totalCount, filteredCount, onClearFilters }) {
  const isSearchOrFilterActive = totalCount > 0 && filteredCount === 0;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-16 bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl shadow-sm space-y-4 animate-in fade-in duration-300 transition-colors duration-200">
      {isSearchOrFilterActive ? (
        <>
          {/* Visual indicator for search with zero matches */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 transition-colors duration-200">
            <Search className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h4 className="text-base font-bold text-slate-800 dark:text-white transition-colors duration-200">No leads found</h4>
            <p className="text-xs text-slate-400 dark:text-gray-400 font-medium transition-colors duration-200">
              We couldn't find any leads matching your current search query or active pipeline filters.
            </p>
          </div>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          )}
        </>
      ) : (
        <>
          {/* Visual indicator for complete empty state */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 transition-colors duration-200">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h4 className="text-base font-bold text-slate-800 dark:text-white transition-colors duration-200">No leads found</h4>
            <p className="text-xs text-slate-400 dark:text-gray-400 font-medium transition-colors duration-200">
              Start tracking new sales opportunities by clicking the "Add Lead" button.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default EmptyState;
