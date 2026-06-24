
/**
 * FilterBar Component
 * Renders a row of horizontal filter buttons representing pipeline stages.
 * Displays the dynamic lead count for each stage.
 *
 * @param {Object} props
 * @param {string} props.activeFilter - The active filter key (e.g., 'All', 'New')
 * @param {Function} props.onFilterChange - Callback when a filter button is clicked
 * @param {Array} props.leads - Array of lead items to compute status counts
 */
function FilterBar({ activeFilter, onFilterChange, leads = [] }) {
  const filterStages = [
    "All",
    "New",
    "Contacted",
    "Meeting Scheduled",
    "Proposal Sent",
    "Won",
    "Lost",
  ];

  /**
   * Calculates how many leads are in a given status.
   * If status is "All", returns total count.
   */
  const getFilterCount = (status) => {
    if (status === "All") {
      return leads.length;
    }
    return leads.filter((lead) => lead.status === status).length;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 w-full">
      {filterStages.map((stage) => {
        const isActive = activeFilter === stage;
        const count = getFilterCount(stage);

        return (
          <button
            key={stage}
            onClick={() => onFilterChange(stage)}
            className={`px-3.5 py-3 md:py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 whitespace-nowrap ${
              isActive
                ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/10"
                : "bg-white dark:bg-gray-850 border-slate-200/80 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-700"
            }`}
          >
            {stage}
            <span
              className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors duration-200 ${
                isActive
                  ? "bg-blue-700/50 text-blue-100"
                  : "bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-400"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default FilterBar;
