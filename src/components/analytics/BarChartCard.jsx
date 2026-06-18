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

function BarChartCard({ data }) {
  const totalLeads = data.reduce((sum, d) => sum + d["Leads Created"], 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full min-h-[380px]">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Monthly Leads Trend</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              New lead acquisition volume tracked over the last 6 months
            </p>
          </div>
          {totalLeads > 0 && (
            <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0">
              Total: {totalLeads}
            </div>
          )}
        </div>
      </div>

      <div className="h-[230px] w-full mt-6">
        {totalLeads === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
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
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "#F8FAFC", radius: 4 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-slate-100 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-100">
                        <p className="text-xs font-bold text-slate-900 mb-0.5">
                          {item.fullName}
                        </p>
                        <p className="text-sm font-bold text-blue-600">
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
