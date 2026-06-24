import React from "react";
import { Zap, TrendingUp, TrendingDown, HelpCircle } from "lucide-react";

// Helper to format currency in Indian Rupees format (en-IN)
const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

function SalesVelocityCard({ data }) {
  const { velocity, opportunities, winRate, avgDealSize, salesCycle, growth } = data;

  const isPositive = growth >= 0;
  const growthText = growth !== undefined ? `${Math.abs(growth)}%` : "0%";
  const trendColor = isPositive
    ? "text-emerald-650 bg-emerald-50 dark:text-emerald-450 dark:bg-emerald-900/20"
    : "text-rose-650 bg-rose-50 dark:text-rose-455 dark:bg-rose-900/20";
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full min-h-[340px] transition-colors duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-200">Sales Velocity</h3>
          <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl transition-colors duration-200">
            <Zap className="w-5 h-5 fill-current" />
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 transition-colors duration-200">
          The speed at which your pipeline converts opportunities into revenue per day
        </p>
      </div>

      {/* Main Metric */}
      <div className="my-6">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-200">
            {formatINR(velocity)}
          </span>
          <span className="text-sm font-semibold text-slate-500 dark:text-gray-400 transition-colors duration-200">/ day</span>
        </div>

        {/* Growth Trend */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-bold ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{growthText}</span>
          </span>
          <span className="text-xs font-medium text-slate-400 dark:text-gray-500 transition-colors duration-200">vs previous period</span>
        </div>
      </div>

      {/* Formula & Metrics Breakdown */}
      <div className="border-t border-slate-100 dark:border-gray-700 pt-4 bg-slate-50/50 dark:bg-gray-750/30 -mx-6 -mb-6 p-6 rounded-b-2xl transition-colors duration-200">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-gray-500 font-bold tracking-wider uppercase mb-3 transition-colors duration-200">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Velocity Formula Breakdown</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-slate-100 dark:border-gray-700 shadow-2xs transition-colors duration-200">
            <div className="text-[10px] font-bold text-slate-400 dark:text-gray-550 uppercase">Opportunities</div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{opportunities}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-slate-100 dark:border-gray-700 shadow-2xs transition-colors duration-200">
            <div className="text-[10px] font-bold text-slate-400 dark:text-gray-555 uppercase">Win Rate</div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{winRate}%</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-slate-100 dark:border-gray-700 shadow-2xs transition-colors duration-200">
            <div className="text-[10px] font-bold text-slate-400 dark:text-gray-555 uppercase">Avg Deal</div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5 truncate" title={formatINR(avgDealSize)}>
              {formatINR(avgDealSize)}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-slate-100 dark:border-gray-700 shadow-2xs transition-colors duration-200">
            <div className="text-[10px] font-bold text-slate-400 dark:text-gray-555 uppercase">Sales Cycle</div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{salesCycle} Days</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(SalesVelocityCard);
