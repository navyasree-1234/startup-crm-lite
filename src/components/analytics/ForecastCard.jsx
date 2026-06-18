import React from "react";
import { Sparkles, TrendingUp, TrendingDown, ShieldAlert } from "lucide-react";

// Helper to format currency in Indian Rupees format (en-IN)
const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

function ForecastCard({ data }) {
  const { forecastedRevenue, confidenceScore, growthTrend } = data;

  const isPositive = growthTrend >= 0;
  const growthText = growthTrend !== undefined ? `${Math.abs(growthTrend)}%` : "0%";
  const trendColor = isPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50";
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  // Determine confidence tier
  let confidenceColor;
  let confidenceText;
  let confidenceTextColor;

  if (confidenceScore >= 80) {
    confidenceColor = "bg-emerald-500";
    confidenceText = "High Confidence";
    confidenceTextColor = "text-emerald-700 bg-emerald-50";
  } else if (confidenceScore >= 50) {
    confidenceColor = "bg-amber-500";
    confidenceText = "Moderate Confidence";
    confidenceTextColor = "text-amber-700 bg-amber-50";
  } else {
    confidenceColor = "bg-rose-500";
    confidenceText = "Low Confidence";
    confidenceTextColor = "text-rose-700 bg-rose-50";
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full min-h-[340px]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Revenue Forecast</h3>
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Predictive sales forecasting based on won revenue averages from previous months
        </p>
      </div>

      {/* Main Metric */}
      <div className="my-6">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
          Predicted Revenue Next Month
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatINR(forecastedRevenue)}
          </span>
        </div>

        {/* Growth Trend */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-bold ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{growthText}</span>
          </span>
          <span className="text-xs font-medium text-slate-400">historical MoM baseline trend</span>
        </div>
      </div>

      {/* Confidence Score Bar */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-bold text-slate-500">Forecast Reliability</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${confidenceTextColor}`}>
            {confidenceText} ({confidenceScore}%)
          </span>
        </div>
        
        {/* Confidence progress bar */}
        <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-750 ${confidenceColor}`}
            style={{ width: `${confidenceScore}%` }}
          />
        </div>

        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed flex items-start gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
          <span>
            Projections assume stable close rates and average deal sizes. High deal count variances will impact confidence scores.
          </span>
        </p>
      </div>
    </div>
  );
}

export default React.memo(ForecastCard);
