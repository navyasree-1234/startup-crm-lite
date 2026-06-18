import React from "react";
import { ResponsiveContainer, FunnelChart, Funnel, Cell, LabelList, Tooltip } from "recharts";
import { STATUS_COLORS } from "../../constants/analyticsColors";

function FunnelChartCard({ data }) {
  const totalLeads = data.length > 0 ? data[0].value : 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full min-h-[380px]">
      <div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Sales Funnel</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Cumulative conversion performance and drop-off rate across stages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center flex-1 my-4">
        {/* Left Side: Funnel Chart */}
        <div className="h-[200px] w-full">
          {totalLeads === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
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
                        <div className="bg-white p-3 border border-slate-100 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-100">
                          <p className="text-xs font-bold text-slate-900 mb-0.5">{data.stage} Stage</p>
                          <p className="text-sm font-bold text-blue-600">
                            {data.value} {data.value === 1 ? "Lead" : "Leads"}
                          </p>
                          <p className="text-[10px] text-slate-500 font-semibold mt-1">
                            Conversion from top: {data.totalConversion}%
                          </p>
                          {data.stage !== "New" && (
                            <>
                              <p className="text-[10px] text-slate-500 font-semibold">
                                Conversion from last: {data.conversion}%
                              </p>
                              <p className="text-[10px] text-rose-500 font-semibold">
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
                    fill="#475569"
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
            <div className="text-slate-400 text-xs font-medium">No metrics to display</div>
          ) : (
            data.map((item, index) => {
              const color = STATUS_COLORS[item.stage] || "#94A3B8";
              return (
                <div key={item.stage} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-slate-700">{item.stage}</span>
                    </div>
                    <span className="text-slate-950 font-bold">{item.value} Leads</span>
                  </div>

                  {/* Visual mini-bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: color,
                        width: `${item.totalConversion}%`,
                      }}
                    />
                  </div>

                  {/* Percentage Details */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>From top: <strong className="text-slate-600">{item.totalConversion}%</strong></span>
                    {index > 0 && (
                      <span className="flex items-center gap-1.5">
                        <span>Conv: <strong className="text-emerald-600">{item.conversion}%</strong></span>
                        <span>Drop: <strong className="text-rose-500">{item.dropoff}%</strong></span>
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
