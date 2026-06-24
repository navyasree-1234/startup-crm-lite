import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

// Helper to format currency in Indian Rupees format (en-IN)
const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

// Compact Indian format for Y-Axis labels (e.g. ₹1.2L, ₹50K)
const formatCompactINR = (val) => {
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(1).replace(/\.0$/, "")}L`;
  }
  if (val >= 1000) {
    return `₹${(val / 1000).toFixed(0)}K`;
  }
  return `₹${val}`;
};

function RevenueChartCard({ data }) {
  const { isDarkMode } = useTheme();
  const totalRevenue = data.reduce((sum, d) => sum + d["Won Revenue"], 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full min-h-[380px] transition-colors duration-200">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-200">Revenue Analytics</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 transition-colors duration-200">
              Won revenue trends tracked monthly for closed leads
            </p>
          </div>
          {totalRevenue > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-colors duration-200">
              Total Won: {formatINR(totalRevenue)}
            </div>
          )}
        </div>
      </div>

      <div className="h-[230px] w-full mt-6">
        {totalRevenue === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-gray-500 text-sm font-medium">
            No won revenue generated in this timeframe
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 5, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke={isDarkMode ? "#374151" : "#E2E8F0"}
              />
              <XAxis
                dataKey="name"
                stroke={isDarkMode ? "#9CA3AF" : "#64748B"}
                fontSize={11}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis
                stroke={isDarkMode ? "#9CA3AF" : "#64748B"}
                fontSize={11}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
                dx={-8}
                tickFormatter={formatCompactINR}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border border-slate-100 dark:border-gray-700 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-100 transition-colors duration-200">
                        <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">
                          {item.fullName} Revenue
                        </p>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-450 font-bold">
                          {formatINR(item["Won Revenue"])}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="Won Revenue"
                stroke="#22C55E"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#revenueGrad)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default React.memo(RevenueChartCard);
