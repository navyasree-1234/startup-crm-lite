import React from "react";
import { Calendar } from "lucide-react";

/**
 * AnalyticsFilters Component
 * Provides a responsive pill switcher for date range selections,
 * including dynamic start/end fields for Custom Ranges.
 */
function AnalyticsFilters({
  filterType,
  setFilterType,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
}) {
  const filters = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "thisYear", label: "This Year" },
    { value: "custom", label: "Custom Range" },
    { value: "all", label: "All Time" },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
      {/* Description */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Track sales performance, forecasting, and pipeline metrics.
        </p>
      </div>

      {/* Controls Container */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
        {/* Switcher pills */}
        <div className="flex flex-wrap items-center bg-slate-50 p-1.5 rounded-xl border border-slate-200/80">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterType(f.value)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                filterType === f.value
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200/40 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Custom Range Calendars */}
        {filterType === "custom" && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-3 duration-250">
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
                placeholder="Start Date"
                aria-label="Custom Start Date"
              />
            </div>
            <span className="text-xs font-medium text-slate-400">to</span>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
                placeholder="End Date"
                aria-label="Custom End Date"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(AnalyticsFilters);
