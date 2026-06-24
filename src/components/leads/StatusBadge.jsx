
/**
 * StatusBadge Component
 * Renders a pill-shaped badge with custom colors for each CRM lead status stage.
 *
 * @param {Object} props
 * @param {string} props.status - The status value (New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost)
 * @param {string} [props.className] - Optional custom Tailwind classes
 */
function StatusBadge({ status, className = "" }) {
  // Map lead status options to custom theme-friendly Tailwind badge colors
  const getBadgeColors = (statusVal) => {
    switch (statusVal) {
      case "New":
        return "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-600";
      case "Contacted":
        return "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800/40";
      case "Meeting Scheduled":
        return "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/40";
      case "Proposal Sent":
        return "bg-amber-50 dark:bg-amber-905/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800/30";
      case "Won":
        return "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-450 border-emerald-100 dark:border-emerald-800/40";
      case "Lost":
        return "bg-rose-50 dark:bg-rose-905/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800/40";
      default:
        return "bg-slate-50 dark:bg-gray-750 text-slate-600 dark:text-gray-400 border-slate-100 dark:border-gray-700";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border leading-none tracking-wide ${getBadgeColors(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
