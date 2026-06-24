import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

function BarChartCard({ data }) {
  const { isDarkMode } = useTheme();
  const totalLeads = data.reduce((sum, d) => sum + d["Leads Created"], 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full min-h-[380px] transition-colors duration-200">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-200">Monthly Leads Trend</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 transition-colors duration-200">
              New lead acquisition volume tracked over the last 6 months
            </p>
          </div>
          {totalLeads > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-colors duration-200">
              Total: {totalLeads}
            </div>
          )}
        </div>
      </div>

      <div className="h-[230px] w-full mt-6">
        {totalLeads === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-gray-500 text-sm font-medium">
            No leads data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
            >
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
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: isDarkMode ? "#374151" : "#F8FAFC", radius: 4 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                     const item = payload[0].payload;
                     return (
                       <div className="bg-white dark:bg-gray-800 p-3 border border-slate-100 dark:border-gray-700 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-100 transition-colors duration-200">
                         <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">
                           {item.fullName}
                         </p>
                         <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                           {item["Leads Created"]}{" "}
                           {item["Leads Created"] === 1 ? "Lead" : "Leads"}
                         </p>
                       </div>
                     );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="Leads Created"
                fill="#2563EB"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default React.memo(BarChartCard);
