import React from "react";
import { Mail, Calendar, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

/**
 * LeadTable Component
 * Renders a tabular view of leads for desktop screen sizes.
 *
 * @param {Object} props
 * @param {Array} props.leads - The array of leads to display
 * @param {Function} props.onEdit - Callback triggered when clicking the Edit button on a row
 * @param {Function} props.onDelete - Callback triggered when clicking the Delete button on a row
 */
function LeadTable({ leads, onEdit, onDelete }) {
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
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider uppercase">
              Name
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider uppercase">
              Company
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider uppercase">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider uppercase">
              Email
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider uppercase">
              Source
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider uppercase">
              Date Added
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 tracking-wider uppercase text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-50/40 transition-colors">
              {/* Name */}
              <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-slate-800">
                {lead.name}
              </td>

              {/* Company */}
              <td className="px-6 py-4.5 whitespace-nowrap text-sm font-semibold text-slate-650">
                {lead.company}
              </td>

              {/* Status Badge */}
              <td className="px-6 py-4.5 whitespace-nowrap">
                <StatusBadge status={lead.status} />
              </td>

              {/* Email */}
              <td className="px-6 py-4.5 whitespace-nowrap text-sm font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{lead.email}</span>
                </div>
              </td>

              {/* Source */}
              <td className="px-6 py-4.5 whitespace-nowrap text-xs">
                <span className="text-slate-600 font-semibold px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                  {lead.source}
                </span>
              </td>

              {/* Date Added */}
              <td className="px-6 py-4.5 whitespace-nowrap text-xs text-slate-500 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{formatDate(lead.createdAt)}</span>
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-150 rounded-xl transition-all duration-200 cursor-pointer"
                    title="Edit Lead"
                    aria-label={`Edit ${lead.name}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(lead.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-150 rounded-xl transition-all duration-200 cursor-pointer"
                    title="Delete Lead"
                    aria-label={`Delete ${lead.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeadTable;
