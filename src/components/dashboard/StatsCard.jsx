
/**
 * @typedef {Object} StatsCardProps
 * @property {string} title - The title of the metric (e.g. "Total Leads")
 * @property {string|number} value - The display value of the metric (e.g. "45", "$128,000")
 * @property {React.ComponentType<{ className?: string }>} icon - Lucide React Icon component reference
 * @property {string} change - The percentage change text (e.g. "+12.4%", "-2.5%")
 * @property {"primary" | "success" | "warning" | "danger"} color - Theme color key mapping for the icon style
 */

/**
 * StatsCard displays summary business metrics with a header icon, large numeric output,
 * and a color-coded percentage change indicator representing growth or decline.
 * 
 * @param {StatsCardProps} props - Component properties
 * @returns {React.JSX.Element} The rendered stats card
 */
function StatsCard({ title, value, icon: Icon, change, color = "primary" }) {
  // Determine text and background styles based on the theme color key
  const colorMap = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/20",
    },
    success: {
      bg: "bg-success/10",
      text: "text-success",
      border: "border-success/20",
    },
    warning: {
      bg: "bg-warning/10",
      text: "text-warning",
      border: "border-warning/20",
    },
    danger: {
      bg: "bg-danger/10",
      text: "text-danger",
      border: "border-danger/20",
    },
  };

  const currentStyles = colorMap[color] || colorMap.primary;

  // Determine trend status styling (positive/negative/neutral)
  const isPositive = String(change).startsWith("+");
  const isNegative = String(change).startsWith("-");

  let trendBadgeStyle = "bg-slate-100 text-slate-600 border border-slate-200/60";
  if (isPositive) {
    trendBadgeStyle = "bg-success/10 text-success border border-success/20";
  } else if (isNegative) {
    trendBadgeStyle = "bg-danger/10 text-danger border border-danger/20";
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between">
      {/* Header containing title and icon */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-text-gray tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${currentStyles.bg} ${currentStyles.text} transition-colors duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Primary metric value and trend change details */}
      <div className="flex items-end justify-between mt-2">
        <div className="flex flex-col">
          <span className="text-3xl font-extrabold text-text-dark tracking-tight leading-none">
            {value}
          </span>
        </div>

        {/* Change indicator badge */}
        {change && (
          <div className="flex flex-col items-end">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${trendBadgeStyle}`}>
              {change}
            </span>
            <span className="text-[10px] text-text-gray mt-1 font-medium">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
