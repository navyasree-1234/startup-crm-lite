import React from "react";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Percent,
  Wallet,
  Award,
  Clock,
  XOctagon,
} from "lucide-react";

// Helper to format currency in Indian Rupees format (en-IN)
const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

function KPICard({ title, value, icon: Icon, changeText, isPositive, colorClass }) {
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50";

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500">{title}</span>
        <div className={`p-2.5 rounded-xl ${colorClass}`}>
          <Icon className="w-5.5 h-5.5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
        {changeText !== undefined && (
          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-[10px] font-bold ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            <span>{changeText}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function StatsCards({ kpis }) {
  const {
    totalLeads,
    conversionRate,
    pipelineValue,
    wonRevenue,
    avgSalesCycle,
    lostRate,
  } = kpis;

  // Total Leads trend
  const totalLeadsChange = totalLeads.growth !== undefined ? `${Math.abs(totalLeads.growth)}%` : "0%";
  const totalLeadsPos = totalLeads.growth >= 0;

  // Conversion rate trend (direct percentage point difference)
  const convRateChange = conversionRate.change !== undefined ? `${Math.abs(conversionRate.change)}%` : "0%";
  const convRatePos = conversionRate.change >= 0;

  // Pipeline value trend
  const pipelineChange = pipelineValue.growth !== undefined ? `${Math.abs(pipelineValue.growth)}%` : "0%";
  const pipelinePos = pipelineValue.growth >= 0;

  // Won Revenue trend
  const wonRevenueChange = wonRevenue.growth !== undefined ? `${Math.abs(wonRevenue.growth)}%` : "0%";
  const wonRevenuePos = wonRevenue.growth >= 0;

  // Avg Sales Cycle trend (Lower cycle is positive!)
  const cycleChange = avgSalesCycle.change !== undefined ? `${Math.abs(avgSalesCycle.change)} Days` : "0 Days";
  const cyclePos = avgSalesCycle.change <= 0; // Negative change is good!

  // Lost rate trend (Lower lost rate is positive!)
  const lostRateChange = lostRate.change !== undefined ? `${Math.abs(lostRate.change)}%` : "0%";
  const lostRatePos = lostRate.change <= 0; // Lower is better!

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
      {/* Total Leads */}
      <KPICard
        title="Total Leads"
        value={totalLeads.value}
        icon={Users}
        changeText={totalLeadsChange}
        isPositive={totalLeadsPos}
        colorClass="bg-blue-50 text-blue-600"
      />

      {/* Conversion Rate */}
      <KPICard
        title="Conversion Rate"
        value={`${conversionRate.value}%`}
        icon={Percent}
        changeText={convRateChange}
        isPositive={convRatePos}
        colorClass="bg-emerald-50 text-emerald-600"
      />

      {/* Pipeline Value */}
      <KPICard
        title="Pipeline Value"
        value={formatINR(pipelineValue.value)}
        icon={Wallet}
        changeText={pipelineChange}
        isPositive={pipelinePos}
        colorClass="bg-amber-50 text-amber-600"
      />

      {/* Won Revenue */}
      <KPICard
        title="Won Revenue"
        value={formatINR(wonRevenue.value)}
        icon={Award}
        changeText={wonRevenueChange}
        isPositive={wonRevenuePos}
        colorClass="bg-indigo-50 text-indigo-600"
      />

      {/* Average Sales Cycle */}
      <KPICard
        title="Avg Sales Cycle"
        value={`${avgSalesCycle.value} Days`}
        icon={Clock}
        changeText={cycleChange}
        isPositive={cyclePos}
        colorClass="bg-purple-50 text-purple-600"
      />

      {/* Lost Rate */}
      <KPICard
        title="Lost Rate"
        value={`${lostRate.value}%`}
        icon={XOctagon}
        changeText={lostRateChange}
        isPositive={lostRatePos}
        colorClass="bg-rose-50 text-rose-600"
      />
    </div>
  );
}

export default React.memo(StatsCards);
