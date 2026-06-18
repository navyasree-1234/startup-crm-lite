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
  const trendColor = isPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50";
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full min-h-[340px]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Sales Velocity</h3>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Zap className="w-5 h-5 fill-current" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          The speed at which your pipeline converts opportunities into revenue per day
        </p>
      </div>

      {/* Main Metric */}
      <div className="my-6">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatINR(velocity)}
          </span>
          <span className="text-sm font-semibold text-slate-500">/ day</span>
        </div>

        {/* Growth Trend */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-bold ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{growthText}</span>
          </span>
          <span className="text-xs font-medium text-slate-400">vs previous period</span>
        </div>
      </div>

      {/* Formula & Metrics Breakdown */}
      <div className="border-t border-slate-100 pt-4 bg-slate-50/50 -mx-6 -mb-6 p-6 rounded-b-2xl">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold tracking-wider uppercase mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Velocity Formula Breakdown</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Opportunities</div>
            <div className="text-sm font-extrabold text-slate-800 mt-0.5">{opportunities}</div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Win Rate</div>
            <div className="text-sm font-extrabold text-slate-800 mt-0.5">{winRate}%</div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Deal</div>
            <div className="text-sm font-extrabold text-slate-800 mt-0.5 truncate" title={formatINR(avgDealSize)}>
              {formatINR(avgDealSize)}
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Sales Cycle</div>
            <div className="text-sm font-extrabold text-slate-800 mt-0.5">{salesCycle} Days</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(SalesVelocityCard);
