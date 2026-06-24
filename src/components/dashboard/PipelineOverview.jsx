
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
 * @typedef {Object} PipelineOverviewProps
 * @property {Lead[]} leads - Array of lead records currently in the CRM
 */

/**
 * PipelineOverview displays a horizontal multi-segment progress bar reflecting lead distribution
 * across the various pipeline stages, paired with detailed metrics showing the lead counts and
 * accumulated financial value of each stage.
 *
 * @param {PipelineOverviewProps} props - Component properties
 * @returns {React.JSX.Element} The rendered pipeline overview widget
 */
function PipelineOverview({ leads = [] }) {
  // Define standard sales stages, their corresponding tailwind colors, and hex values for visual badges
  const STAGES = [
    { status: "New", color: "bg-slate-400", textColor: "text-slate-500" },
    { status: "Contacted", color: "bg-primary", textColor: "text-primary" },
    { status: "Meeting Scheduled", color: "bg-indigo-500", textColor: "text-indigo-500" },
    { status: "Proposal Sent", color: "bg-warning", textColor: "text-warning" },
    { status: "Won", color: "bg-success", textColor: "text-success" },
    { status: "Lost", color: "bg-danger", textColor: "text-danger" },
  ];

  const totalLeads = leads.length;

  // Process data for each stage: count leads, sum deal values, and compute percentages
  const stageData = STAGES.map((stage) => {
    const stageLeads = leads.filter((l) => l.status === stage.status);
    const count = stageLeads.length;
    const value = stageLeads.reduce((sum, l) => sum + (l.value || 0), 0);
    const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;

    return {
      ...stage,
      count,
      value,
      percentage,
    };
  });

  // Filter out stages with 0 leads for rendering the segment bar
  const activeSegments = stageData.filter((segment) => segment.count > 0);

  // Formatter helper to output currency values
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-full transition-colors duration-200">
      {/* Title Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-text-dark">Pipeline Overview</h2>
        <p className="text-xs text-text-gray mt-1 font-medium">
          Distribution and financial valuation of deals across pipeline stages
        </p>
      </div>

      {/* Visual Multi-Segment Horizontal Progress Bar */}
      <div className="mb-6">
        <div className="h-4 w-full bg-slate-100 dark:bg-gray-700 rounded-full flex overflow-hidden shadow-inner border border-slate-100 dark:border-gray-600 transition-colors duration-200">
          {activeSegments.length === 0 ? (
            <div className="w-full h-full bg-slate-200 dark:bg-gray-655 animate-pulse rounded-full flex items-center justify-center">
              <span className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-wider">No Leads in Pipeline</span>
            </div>
          ) : (
            activeSegments.map((segment) => (
              <div
                key={segment.status}
                className={`${segment.color} h-full transition-all duration-500`}
                style={{ width: `${segment.percentage}%` }}
                title={`${segment.status}: ${segment.count} leads (${Math.round(segment.percentage)}%)`}
              />
            ))
          )}
        </div>
      </div>

      {/* Detailed Stage Breakdown Legend */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {stageData.map((stage) => {
          return (
            <div key={stage.status} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 dark:border-gray-750 last:border-0 hover:bg-slate-50/50 dark:hover:bg-gray-700/30 px-2 rounded-lg transition-colors duration-200">
              {/* Left Side: Color badge + stage name */}
              <div className="flex items-center gap-3">
                <span className={`w-3.5 h-3.5 rounded-full ${stage.color} shadow-sm border border-white`} />
                <div className="flex flex-col">
                  <span className="font-semibold text-text-dark">{stage.status}</span>
                  <span className="text-[10px] text-text-gray font-medium">
                    {stage.count} {stage.count === 1 ? "lead" : "leads"} ({totalLeads > 0 ? Math.round(stage.percentage) : 0}%)
                  </span>
                </div>
              </div>

              {/* Right Side: Accumulated Value */}
              <span className="font-bold text-text-dark">
                {formatCurrency(stage.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PipelineOverview;