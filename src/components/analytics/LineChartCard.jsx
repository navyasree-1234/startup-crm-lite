import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function LineChartCard({ data }) {
  // Check if we have any data to determine if chart is empty
  const hasData = data.some((d) => d["Conversion Rate"] > 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full min-h-[380px]">
      <div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Monthly Conversion Trend</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Ratio of won deals to total acquired leads plotted monthly
        </p>
      </div>

      <div className="h-[230px] w-full mt-6">
        {!hasData ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
            No conversion records found in this timeframe
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#E2E8F0"
              />
              <XAxis
                dataKey="name"
                stroke="#64748B"
                fontSize={11}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
                dx={-8}
                domain={[0, 100]}
                tickFormatter={(tick) => `${tick}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-slate-100 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-100">
                        <p className="text-xs font-bold text-slate-900 mb-0.5">
                          {item.fullName}
                        </p>
                        <p className="text-sm font-bold text-emerald-600">
                          {item["Conversion Rate"]}% Win Rate
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="Conversion Rate"
                stroke="#22C55E"
                strokeWidth={3}
                dot={{ stroke: "#22C55E", strokeWidth: 2, fill: "#FFFFFF", r: 4 }}
                activeDot={{ stroke: "#22C55E", strokeWidth: 2, fill: "#22C55E", r: 6 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default React.memo(LineChartCard);
