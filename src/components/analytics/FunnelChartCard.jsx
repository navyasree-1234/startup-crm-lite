import React from "react";
import { ResponsiveContainer, FunnelChart, Funnel, Cell, LabelList, Tooltip } from "recharts";
import { STATUS_COLORS } from "../../constants/analyticsColors";
import { useTheme } from "../../context/ThemeContext";

function FunnelChartCard({ data }) {
  const { isDarkMode } = useTheme();
  const totalLeads = data.length > 0 ? data[0].value : 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full min-h-[380px] transition-colors duration-200">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-200">Sales Funnel</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 transition-colors duration-200">
          Cumulative conversion performance and drop-off rate across stages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center flex-1 my-4">
        {/* Left Side: Funnel Chart */}
        <div className="h-[200px] w-full">
          {totalLeads === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 dark:text-gray-500 text-sm font-medium">
              No leads data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <FunnelChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 border border-slate-100 dark:border-gray-700 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-100 transition-colors duration-200">
                          <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{data.stage} Stage</p>
                          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {data.value} {data.value === 1 ? "Lead" : "Leads"}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold mt-1">
                            Conversion from top: {data.totalConversion}%
                          </p>
                          {data.stage !== "New" && (
                            <>
                              <p className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold">
                                Conversion from last: {data.conversion}%
                              </p>
                              <p className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold">
                                Drop-off from last: {data.dropoff}%
                              </p>
                            </>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Funnel dataKey="value" data={data} isAnimationActive>
                  <LabelList
                    position="right"
                    fill={isDarkMode ? "#9CA3AF" : "#475569"}
                    stroke="none"
                    dataKey="stage"
                    className="text-[10px] font-bold"
                  />
                  {data.map((entry) => (
                    <Cell
                      key={`funnel-cell-${entry.stage}`}
                      fill={STATUS_COLORS[entry.stage] || "#94A3B8"}
                    />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Right Side: Step breakdown */}
        <div className="space-y-3">
          {totalLeads === 0 ? (
            <div className="text-slate-400 dark:text-gray-500 text-xs font-medium">No metrics to display</div>
          ) : (
            data.map((item, index) => {
              const color = STATUS_COLORS[item.stage] || "#94A3B8";
              return (
                <div key={item.stage} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-slate-700 dark:text-gray-300">{item.stage}</span>
                    </div>
                    <span className="text-slate-955 dark:text-white font-bold">{item.value} Leads</span>
                  </div>

                  {/* Visual mini-bar */}
                  <div className="w-full bg-slate-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: color,
                        width: `${item.totalConversion}%`,
                      }}
                    />
                  </div>

                  {/* Percentage Details */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-gray-500 font-medium">
                    <span>From top: <strong className="text-slate-600 dark:text-gray-300">{item.totalConversion}%</strong></span>
                    {index > 0 && (
                      <span className="flex items-center gap-1.5">
                        <span>Conv: <strong className="text-emerald-600 dark:text-emerald-400">{item.conversion}%</strong></span>
                        <span>Drop: <strong className="text-rose-500 dark:text-rose-450">{item.dropoff}%</strong></span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(FunnelChartCard);
