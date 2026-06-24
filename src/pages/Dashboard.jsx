import { useContext } from "react";
import { Users, Percent, Wallet, Award } from "lucide-react";

// Import LeadContext to utilize global CRM state
import { LeadContext } from "../context/LeadContext";

// Import custom sub-components
import StatsCard from "../components/dashboard/StatsCard";
import PipelineOverview from "../components/dashboard/PipelineOverview";
import RecentLeads from "../components/dashboard/RecentLeads";
import QuickActions from "../components/dashboard/QuickActions";

/**
 * Dashboard page represents the primary visual command center of the CRM,
 * displaying aggregate key performance indicators (KPIs), pipeline distributions,
 * lists of recent lead records, and administrative shortcut tools.
 *
 * @returns {React.JSX.Element} The rendered Dashboard page
 */
function Dashboard() {
  // Use global leads state and handlers from context
  const { leads, addLead } = useContext(LeadContext);

  /**
   * Helper function to format numeric deal values into USD standard format
   * @param {number} amount - The currency value
   * @returns {string} Formatted currency string (e.g. "$15,500")
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /**
   * Event handler callback to register a new lead in the active database state.
   * Bubbled up from the QuickActions modal submission.
   * 
   * @param {Object} newLeadData - The lead object containing form values
   */
  const handleAddLead = (newLeadData) => {
    addLead(newLeadData);
  };

  // Derive dynamic metrics from the active leads state
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === "Won");
  const lostLeads = leads.filter((l) => l.status === "Lost");
  
  // Win rate is computed from won/lost closed deals
  const winRate =
    wonLeads.length + lostLeads.length > 0
      ? Math.round((wonLeads.length / (wonLeads.length + lostLeads.length)) * 100)
      : 0;

  // Active pipeline includes all deals not in a terminal state (Won/Lost)
  const activePipelineValue = leads
    .filter((l) => l.status !== "Won" && l.status !== "Lost")
    .reduce((sum, l) => sum + (l.value || 0), 0);

  // Closed Revenue is the accumulated value of successfully won deals
  const closedWonValue = wonLeads.reduce((sum, l) => sum + (l.value || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Welcome back, Admin</h1>
          <p className="text-sm text-text-gray mt-1 font-medium">
            Here is what's happening with your startup pipeline today.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-gray-750 px-3.5 py-2 rounded-full border border-slate-200/60 dark:border-gray-650 shadow-sm transition-colors duration-200">
          Last updated: Just now
        </div>
      </div>

      {/* Grid of 4 Key Stats Cards */}
      {/* Responsive columns: 1 on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Leads */}
        <StatsCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          change="+12.4%"
          color="primary"
        />

        {/* Win Rate */}
        <StatsCard
          title="Won / Lost Ratio"
          value={`${winRate}%`}
          icon={Percent}
          change="+4.2%"
          color="success"
        />

        {/* Active Pipeline Value */}
        <StatsCard
          title="Active Pipeline"
          value={formatCurrency(activePipelineValue)}
          icon={Wallet}
          change="-2.5%"
          color="warning"
        />

        {/* Closed Won Revenue */}
        <StatsCard
          title="Closed Revenue"
          value={formatCurrency(closedWonValue)}
          icon={Award}
          change="+15.3%"
          color="success"
        />
      </div>

      {/* Split Widget Section (1 column on mobile/tablet, 2 columns on lg desktop screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Widget: Pipeline stage visual bar overview */}
        <PipelineOverview leads={leads} />

        {/* Right Widget: Listing of 5 most recent prospects */}
        <RecentLeads leads={leads} />
      </div>

      {/* Quick Actions Panel at bottom of screen */}
      <QuickActions leads={leads} onAddLead={handleAddLead} />
    </div>
  );
}

export default Dashboard;