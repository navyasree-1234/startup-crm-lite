import React from "react";

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
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Contacted":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Meeting Scheduled":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Proposal Sent":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Won":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Lost":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
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
