import { Mail, Phone, Pencil, Trash2, DollarSign, Calendar } from "lucide-react";
import StatusBadge from "./StatusBadge";

/**
 * LeadCard Component
 * Displays a single lead in a premium card layout.
 *
 * @param {Object} props
 * @param {Object} props.lead - The lead data object
 * @param {Function} props.onEdit - Callback triggered when clicking the Edit button
 * @param {Function} props.onDelete - Callback triggered when clicking the Delete button
 */
function LeadCard({ lead, onEdit, onDelete }) {
  // Formatter helper to output deal values in standard USD currency structure
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Formatter helper to present dates cleanly
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm p-5 hover:shadow-md dark:hover:border-gray-600 transition-all duration-200 flex flex-col justify-between space-y-4 group">
      
      {/* Top Header: Lead Name, Company, and Status Badge */}
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white text-base leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {lead.name}
            </h4>
            <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 mt-0.5">
              {lead.company}
            </p>
          </div>
          <StatusBadge status={lead.status} />
        </div>
      </div>

      {/* Main Details Section */}
      <div className="text-xs font-medium text-slate-600 dark:text-gray-300 space-y-2.5 pt-1 border-t border-slate-50 dark:border-gray-750 transition-colors duration-200">
        {/* Email detail */}
        {lead.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500 shrink-0" />
            <span className="truncate" title={lead.email}>
              {lead.email}
            </span>
          </div>
        )}

        {/* Phone detail */}
        {lead.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500 shrink-0" />
            <span>{lead.phone}</span>
          </div>
        )}

        {/* Deal Value detail */}
        <div className="flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500 shrink-0" />
          <span className="font-semibold text-slate-800 dark:text-white">
            {formatCurrency(lead.value)}
          </span>
        </div>

        {/* Lead Source / Date row */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-gray-500 pt-1 border-t border-slate-50/50 dark:border-gray-750">
          <span className="bg-slate-50 dark:bg-gray-700 border border-slate-100 dark:border-gray-600 text-slate-500 dark:text-gray-350 font-semibold px-2 py-0.5 rounded-md transition-colors duration-200">
            {lead.source}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-350 dark:text-gray-500" />
            <span>{formatDate(lead.createdAt)}</span>
          </span>
        </div>
      </div>

      {/* Action buttons (Edit & Delete) footer */}
      <div className="flex justify-end items-center gap-2 pt-2">
        <button
          onClick={() => onEdit(lead)}
          className="p-2 text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-slate-150 dark:border-gray-600 rounded-xl transition-all duration-200 cursor-pointer"
          title="Edit Lead"
          aria-label={`Edit ${lead.name}`}
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(lead.id)}
          className="p-2 text-slate-550 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 border border-slate-150 dark:border-gray-600 rounded-xl transition-all duration-200 cursor-pointer"
          title="Delete Lead"
          aria-label={`Delete ${lead.name}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}

export default LeadCard;
