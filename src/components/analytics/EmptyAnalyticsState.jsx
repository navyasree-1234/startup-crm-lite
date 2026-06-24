import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, Plus } from "lucide-react";

function EmptyAnalyticsState() {
  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl p-10 py-16 text-center shadow-sm max-w-lg mx-auto my-10 animate-in fade-in zoom-in-95 duration-200 transition-colors duration-200">
      {/* Icon Area */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-400 dark:text-gray-500 mb-6 transition-colors duration-200">
        <BarChart3 className="w-8 h-8" />
      </div>

      {/* Text Content */}
      <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-200">
        No analytics available yet
      </h2>
      <p className="text-sm text-slate-500 dark:text-gray-400 mt-2 max-w-sm leading-relaxed transition-colors duration-200">
        Add your first lead to start tracking pipeline conversions, sales velocity, monthly revenue trends, and representative performance.
      </p>

      {/* CTA Button */}
      <Link
        to="/leads"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold mt-8 shadow-sm shadow-blue-500/15 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
      >
        <Plus className="w-4.5 h-4.5" />
        <span>Add Lead</span>
      </Link>
    </div>
  );
}

export default React.memo(EmptyAnalyticsState);
