import React, { useMemo } from "react";
import { Info } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// Helper to format date nicely (e.g., Jun 15, 2026)
const formatDate = (dateStr) => {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-US", options);
};

function ActivityHeatmap({ data }) {
  const { isDarkMode } = useTheme();

  // Generate date grid for the last 13 weeks (approx. 91 days)
  const grid = useMemo(() => {
    const cells = [];
    const now = new Date();
    
    // We want the last 13 weeks. To make columns align, we start from a Sunday
    const startDate = new Date();
    startDate.setDate(now.getDate() - 91);
    
    // Roll back to the preceding Sunday
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay);
    
    // Loop through 98 days (14 complete weeks) to fill the grid nicely
    const tempDate = new Date(startDate);
    const todayStr = now.toISOString().split("T")[0];
    
    for (let i = 0; i < 98; i++) {
      const dateStr = tempDate.toISOString().split("T")[0];
      const activity = data[dateStr] || { created: 0, meetings: 0, calls: 0, total: 0 };
      
      cells.push({
        date: dateStr,
        displayDate: formatDate(dateStr),
        dayOfWeek: tempDate.getDay(),
        month: tempDate.getMonth(),
        isToday: dateStr === todayStr,
        isFuture: tempDate > now,
        ...activity,
      });
      
      tempDate.setDate(tempDate.getDate() + 1);
    }
    
    // Group cells by columns (weeks)
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    
    return weeks;
  }, [data]);

  // Determine cell color based on activity count
  const getCellColor = (total, isFuture) => {
    if (isFuture) {
      return isDarkMode
        ? "bg-gray-850/40 border-dashed border-gray-700/50"
        : "bg-slate-50 border-dashed border-slate-200/40";
    }
    if (total === 0) {
      return isDarkMode
        ? "bg-gray-800/40 border-gray-700/40"
        : "bg-slate-100 border-slate-200/20";
    }
    if (total <= 1) return "bg-blue-100/70 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/40";
    if (total <= 2) return "bg-blue-300 dark:bg-blue-700/40 border-blue-400 dark:border-blue-700/60";
    if (total <= 4) return "bg-blue-500 dark:bg-blue-600/80 border-blue-600 dark:border-blue-550/80";
    return "bg-blue-700 dark:bg-blue-500 border-blue-800 dark:border-blue-400";
  };

  // Extract month labels to render above columns
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    grid.forEach((week, weekIndex) => {
      const firstCell = week[0];
      if (firstCell.month !== lastMonth) {
        labels.push({
          label: months[firstCell.month],
          weekIndex,
        });
        lastMonth = firstCell.month;
      }
    });
    
    return labels;
  }, [grid]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full min-h-[340px] transition-colors duration-200">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 transition-colors duration-200">
          CRM Activity Heatmap
        </h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 transition-colors duration-200">
          Visual contribution board tracking Leads Created, Calls Logged, and Meetings Scheduled
        </p>
      </div>

      {/* Grid Container */}
      <div className="my-6 overflow-x-auto pb-3 -mx-2 px-2 scrollbar-thin">
        <div className="min-w-[640px] relative">
          
          {/* Month Labels */}
          <div className="flex text-[10px] font-bold text-slate-400 dark:text-gray-500 h-5 relative ml-6 transition-colors duration-200">
            {monthLabels.map((m, idx) => (
              <span
                key={`${m.label}-${idx}`}
                className="absolute"
                style={{ left: `${m.weekIndex * 13.5}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid Layout (Days as rows, Weeks as columns) */}
          <div className="flex gap-[2px]">
            {/* Y-Axis day labels */}
            <div className="flex flex-col justify-between text-[9px] font-bold text-slate-400 dark:text-gray-500 pr-2 pt-[1px] w-6 h-[91px] transition-colors duration-200">
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>

            {/* Weeks */}
            {grid.map((week, weekIdx) => (
              <div key={`week-${weekIdx}`} className="flex flex-col gap-[2px]">
                {week.map((cell) => {
                  const color = getCellColor(cell.total, cell.isFuture);

                  return (
                    <div
                      key={cell.date}
                      className={`w-3.5 h-3.5 rounded-sm border transition-all duration-150 relative group cursor-pointer ${color} ${
                        cell.isToday ? "ring-2 ring-indigo-500 ring-offset-1" : ""
                      }`}
                    >
                      {/* Tooltip Overlay */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 hidden group-hover:block z-50 bg-slate-900 dark:bg-slate-950 text-white p-3.5 rounded-xl shadow-xl border border-slate-800 dark:border-gray-800 text-[10px] font-medium leading-relaxed pointer-events-none transition-all duration-200">
                        <div className="font-bold border-b border-slate-800 dark:border-gray-800 pb-1 mb-1.5 flex items-center justify-between">
                          <span>{cell.displayDate}</span>
                          {cell.isToday && <span className="text-indigo-400 text-[9px] uppercase font-extrabold bg-indigo-500/10 px-1 py-0.5 rounded">Today</span>}
                        </div>
                        {cell.isFuture ? (
                          <span className="text-slate-400 dark:text-gray-500">Future date</span>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Leads Created</span>
                              <strong className="text-blue-400">{cell.created}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Calls Logged</span>
                              <strong className="text-amber-400">{cell.calls}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Meetings Scheduled</span>
                              <strong className="text-purple-400">{cell.meetings}</strong>
                            </div>
                            <div className="flex justify-between border-t border-slate-800 dark:border-gray-800 pt-1 mt-1 font-bold text-white">
                              <span>Total Activities</span>
                              <span>{cell.total}</span>
                            </div>
                          </div>
                        )}
                        {/* Triangle arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-950" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info & Legend */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-gray-700 pt-4 text-[10px] font-semibold text-slate-500 dark:text-gray-400 transition-colors duration-200">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500" />
          <span>Last 3 months of CRM logs</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <span className="w-3.5 h-3.5 rounded-sm bg-slate-105 dark:bg-gray-800/40 border border-slate-202/20 dark:border-gray-700/40" />
          <span className="w-3.5 h-3.5 rounded-sm bg-blue-100/70 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/40" />
          <span className="w-3.5 h-3.5 rounded-sm bg-blue-300 dark:bg-blue-700/40 border border-blue-400 dark:border-blue-700/60" />
          <span className="w-3.5 h-3.5 rounded-sm bg-blue-500 dark:bg-blue-600/80 border border-blue-600 dark:border-blue-550/80" />
          <span className="w-3.5 h-3.5 rounded-sm bg-blue-700 dark:bg-blue-500 border border-blue-800 dark:border-blue-400" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ActivityHeatmap);
