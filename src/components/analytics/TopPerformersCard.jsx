import React from "react";
import { Trophy, Award, Medal, Users } from "lucide-react";

// Helper to format currency in Indian Rupees format (en-IN)
const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

function TopPerformersCard({ data }) {
  // Find the maximum revenue value to calculate relative percentages
  const maxRevenue = data.length > 0 ? data[0].revenue : 1;

  // Render visual rank badge
  const renderRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-600 border border-amber-200">
            <Trophy className="w-4 h-4 fill-amber-200" />
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            <Award className="w-4 h-4" />
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-600 border border-orange-200">
            <Medal className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 text-slate-400 border border-slate-200 text-xs font-extrabold">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full min-h-[340px]">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Top Performers</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Leaderboard of sales representatives ranked by won deal volume and revenue
        </p>
      </div>

      {/* Leaderboard List */}
      <div className="my-5 flex-1 space-y-4.5">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm font-medium py-10">
            <Users className="w-8 h-8 text-slate-300 mb-2" />
            <span>No sales records found</span>
          </div>
        ) : (
          data.slice(0, 5).map((item, index) => {
            const rank = index + 1;
            const percentage = Math.round((item.revenue / maxRevenue) * 100);

            return (
              <div key={item.name} className="flex items-center gap-3.5">
                {/* Rank Badge */}
                {renderRankBadge(rank)}

                {/* Info & Bar Stack */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-800 truncate" title={item.name}>
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {item.count} closed
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">
                        {formatINR(item.revenue)}
                      </span>
                    </div>
                  </div>

                  {/* Relative bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        rank === 1
                          ? "bg-gradient-to-r from-amber-400 to-amber-500"
                          : rank === 2
                          ? "bg-slate-400"
                          : rank === 3
                          ? "bg-orange-400"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default React.memo(TopPerformersCard);
