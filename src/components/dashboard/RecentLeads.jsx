
/**
 * @typedef {Object} Lead
 * @property {string} id - Unique lead identifier
 * @property {string} name - Lead contact name
 * @property {string} company - Lead company name
 * @property {string} email - Lead email address
 * @property {string} [phone] - Lead phone number
 * @property {number} value - Deal value in USD
 * @property {string} status - Pipeline stage (e.g., "New", "Won", "Lost")
 * @property {string} source - Source of lead
 * @property {string} createdAt - ISO date string of lead addition
 */

/**
 * @typedef {Object} RecentLeadsProps
 * @property {Lead[]} leads - Array of lead records currently in the CRM
 */

/**
 * RecentLeads displays a tabular view of the five most recently added leads,
 * featuring their contact info, company details, status indicator badges, and creation dates.
 *
 * @param {RecentLeadsProps} props - Component properties
 * @returns {React.JSX.Element} The rendered recent leads widget
 */
function RecentLeads({ leads = [] }) {
  // Sort leads by date added (createdAt) descending, taking the first 5 records
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  /**
   * Helper function to return visual styles for different pipeline stages.
   * @param {string} status - The current stage of the lead
   * @returns {string} Tailwind styling classes
   */
  const getStatusStyles = (status) => {
    switch (status) {
      case "Won":
        return "bg-success/15 text-success border-success/30";
      case "Lost":
        return "bg-danger/15 text-danger border-danger/30";
      case "Proposal Sent":
        return "bg-warning/15 text-warning border-warning/30";
      case "Contacted":
        return "bg-primary/15 text-primary border-primary/30";
      case "Meeting Scheduled":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/60";
      case "New":
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  /**
   * Helper to format ISO date strings into a reader-friendly layout
   * @param {string} dateString - The raw ISO timestamp
   * @returns {string} Formatted date (e.g. "Jun 16, 2026")
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  /**
   * Extract initials from a name to display as an avatar placeholder
   * @param {string} name - User's name
   * @returns {string} 2-letter uppercase initials
   */
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
      {/* Widget Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-text-dark">Recent Leads</h2>
        <p className="text-xs text-text-gray mt-1 font-medium">
          The last 5 prospects added to your CRM workspace
        </p>
      </div>

      {/* Leads Table Container with Horizontal Scroll fallback */}
      <div className="flex-1 overflow-x-auto min-w-full">
        {recentLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-text-gray font-semibold">No recent leads found</p>
            <p className="text-xs text-slate-400 mt-1">Try adding a new lead using Quick Actions!</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-text-gray tracking-wider uppercase">
                <th className="pb-3 pl-2">Lead</th>
                <th className="pb-3">Company</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {recentLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/50 transition-colors duration-150"
                >
                  {/* Lead Info Cell with Avatar circle */}
                  <td className="py-3.5 pl-2 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/40 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                      {getInitials(lead.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-text-dark">{lead.name}</span>
                      <span className="text-[11px] text-text-gray font-medium leading-none mt-0.5">
                        {lead.email}
                      </span>
                    </div>
                  </td>

                  {/* Company Name */}
                  <td className="py-3.5 font-semibold text-text-dark">
                    {lead.company}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyles(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>

                  {/* Date Added */}
                  <td className="py-3.5 text-text-gray font-semibold pr-2">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default RecentLeads;
