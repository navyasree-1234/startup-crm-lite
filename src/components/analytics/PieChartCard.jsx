import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from "recharts";
import { STATUS_COLORS } from "../../constants/analyticsColors";

// Custom active shape for the hovered slice to expand
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 8}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
};

function PieChartCard({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const totalLeads = data.reduce((sum, item) => sum + item.value, 0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full min-h-[380px]">
      <div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Lead Status Distribution</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Prospect counts grouped by active sales pipeline stage
        </p>
      </div>

      <div className="relative flex-1 flex items-center justify-center my-4 h-[200px]">
        {totalLeads === 0 ? (
          <div className="text-slate-400 text-sm font-medium">No leads data available</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name] || "#94A3B8"}
                      className="outline-none transition-all duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-slate-100 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-100">
                          <p className="text-xs font-bold text-slate-900 mb-0.5">{data.name}</p>
                          <p className="text-sm font-bold text-blue-600">
                            {data.value} {data.value === 1 ? "Lead" : "Leads"}
                          </p>
                          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                            {data.percentage}% of total
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Absolute Centered Total Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tighter leading-none">
                {totalLeads}
              </span>
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-1">
                Total Leads
              </span>
            </div>
          </>
        )}
      </div>

      {/* Custom Legend to fulfill exact design specs: Won 34 (27%) */}
      {totalLeads > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-4 mt-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[item.name] || "#94A3B8" }}
                />
                <span className="font-semibold text-slate-700">{item.name}</span>
              </div>
              <span className="font-bold text-slate-900">
                {item.value} <span className="text-slate-400 font-medium text-[10px] ml-0.5">({item.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(PieChartCard);
