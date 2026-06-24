import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";
import { SOURCE_COLORS } from "../../constants/analyticsColors";
import { useTheme } from "../../context/ThemeContext";

function LeadSourceChart({ data }) {
  const { isDarkMode } = useTheme();
  const totalLeads = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full min-h-[380px] transition-colors duration-200">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-200">Lead Source Analytics</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 transition-colors duration-200">
          Distribution and effectiveness of different marketing and outreach channels
        </p>
      </div>

      <div className="h-[230px] w-full mt-6">
        {totalLeads === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-gray-500 text-sm font-medium">
            No source data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 5, right: 15, left: 15, bottom: 5 }}
            >
              <XAxis
                type="number"
                stroke={isDarkMode ? "#9CA3AF" : "#64748B"}
                fontSize={11}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke={isDarkMode ? "#9CA3AF" : "#64748B"}
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
                width={85}
              />
              <Tooltip
                cursor={{ fill: isDarkMode ? "#374151" : "#F8FAFC", radius: 4 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    const percentage = totalLeads > 0 ? Math.round((item.value / totalLeads) * 100) : 0;
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border border-slate-100 dark:border-gray-700 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-100 transition-colors duration-200">
                        <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">
                          {item.name}
                        </p>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {item.value} {item.value === 1 ? "Lead" : "Leads"}
                        </p>
                        <p className="text-[10px] text-slate-505 dark:text-gray-400 font-semibold mt-0.5">
                          {percentage}% of total leads
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="value"
                radius={[0, 6, 6, 0]}
                maxBarSize={20}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`source-cell-${index}`}
                    fill={SOURCE_COLORS[entry.name] || "#64748B"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default React.memo(LeadSourceChart);
