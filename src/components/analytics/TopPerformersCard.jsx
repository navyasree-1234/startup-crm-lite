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
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 shrink-0 transition-colors duration-200">
            <Trophy className="w-4 h-4 fill-amber-200 dark:fill-amber-900/30" />
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-505 dark:text-gray-400 border border-slate-200 dark:border-gray-650 shrink-0 transition-colors duration-200">
            <Award className="w-4 h-4" />
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/40 shrink-0 transition-colors duration-200">
            <Medal className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 dark:bg-gray-750 text-slate-400 dark:text-gray-500 border border-slate-202 dark:border-gray-700 text-xs font-extrabold shrink-0 transition-colors duration-200">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full min-h-[340px] transition-colors duration-200">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-200">Top Performers</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 transition-colors duration-200">
          Leaderboard of sales representatives ranked by won deal volume and revenue
        </p>
      </div>

      {/* Leaderboard List */}
      <div className="my-5 flex-1 space-y-4.5">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 text-sm font-medium py-10">
            <Users className="w-8 h-8 text-slate-300 dark:text-gray-600 mb-2" />
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
                    <span className="text-xs font-bold text-slate-800 dark:text-white truncate transition-colors duration-200" title={item.name}>
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-gray-500 transition-colors duration-200">
                        {item.count} closed
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white transition-colors duration-200">
                        {formatINR(item.revenue)}
                      </span>
                    </div>
                  </div>

                  {/* Relative bar */}
                  <div className="w-full bg-slate-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden transition-colors duration-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        rank === 1
                          ? "bg-gradient-to-r from-amber-400 to-amber-500"
                          : rank === 2
                          ? "bg-slate-455 dark:bg-slate-500"
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
