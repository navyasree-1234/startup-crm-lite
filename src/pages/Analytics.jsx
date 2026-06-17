import React, { useState, useContext } from "react";
// Import Context to grab real-time CRM datasets
import { LeadContext } from "../context/LeadContext";
// Import Lucide React icons representing timelines, metrics, and filter parameters
import { Calendar, Clock, CheckCircle2, Megaphone, TrendingUp, Info } from "lucide-react";
// Import Recharts visual charting components to plot CRM data
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

/**
 * Analytics page component aggregates CRM data into premium, interactive graphs
 * and KPIs, supporting date-range filtering.
 */
function Analytics() {
  // Query leads and statistical metrics from Context
  const { leads, stats } = useContext(LeadContext);

  // Local state managing selected date range filter ('all' | '30days' | '6months')
  const [dateRange, setDateRange] = useState("all");

  // Filter leads based on selected date ranges
  const filteredLeads = leads.filter((lead) => {
    if (dateRange === "all") return true;
    const leadDate = new Date(lead.createdAt);
    const now = new Date();

    if (dateRange === "30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return leadDate >= thirtyDaysAgo;
    }

    if (dateRange === "6months") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      return leadDate >= sixMonthsAgo;
    }

    return true;
  });

  // Calculate dynamic stats for the selected date range
  const totalFilteredLeads = filteredLeads.length;
  const wonFiltered = filteredLeads.filter((l) => l.status === "Won");
  const lostFiltered = filteredLeads.filter((l) => l.status === "Lost");
  
  // Calculate win rate percentage for filtered selection
  const filteredWinRate =
    wonFiltered.length + lostFiltered.length > 0
      ? Math.round((wonFiltered.length / (wonFiltered.length + lostFiltered.length)) * 100)
      : stats.winRate; // Default fallback to global ratio

  // Calculate average deal cycle from completion records in date selection
  const completedWithCycle = filteredLeads.filter(
    (l) => l.dealCycleDays !== null && l.dealCycleDays !== undefined
  );
  const filteredAvgCycle =
    completedWithCycle.length > 0
      ? Math.round(completedWithCycle.reduce((sum, l) => sum + l.dealCycleDays, 0) / completedWithCycle.length)
      : stats.avgDealCycle;

  // Format dataset for the Monthly Lead Growth Chart
  const getMonthlyGrowthData = () => {
    // Array of standard abbreviated month names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // Empty map object to group counts
    const dataMap = {};
    
    // Auto-populate map up to current month
    const currentMonth = new Date().getMonth();
    for (let i = 0; i <= currentMonth; i++) {
      dataMap[months[i]] = 0;
    }

    // Loop through filtered leads and increment month counters
    filteredLeads.forEach((lead) => {
      const date = new Date(lead.createdAt);
      const monthIndex = date.getMonth();
      const monthName = months[monthIndex];
      if (dataMap[monthName] !== undefined) {
        dataMap[monthName] += 1;
      }
    });

    // Convert map to array format compatible with Recharts
    return Object.keys(dataMap).map((m) => ({
      name: m,
      "Leads Created": dataMap[m],
    }));
  };

  // Format dataset for Lead Source Pie Chart
  const getSourceDistributionData = () => {
    const sources = ["Website", "Referral", "LinkedIn", "Cold Call", "Email Campaign", "Other"];
    const sourceMap = {};
    sources.forEach((src) => (sourceMap[src] = 0));

    filteredLeads.forEach((lead) => {
      if (sourceMap[lead.source] !== undefined) {
        sourceMap[lead.source] += 1;
      }
    });

    return Object.keys(sourceMap)
      .map((src) => ({
        name: src,
        value: sourceMap[src],
      }))
      .filter((d) => d.value > 0); // Exclude sources with 0 counts to clean chart layout
  };

  // Format dataset for Pipeline Conversion Funnel Bar Chart
  const getFunnelStageData = () => {
    const stages = ["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"];
    const stageMap = {};
    stages.forEach((stg) => (stageMap[stg] = 0));

    filteredLeads.forEach((lead) => {
      if (stageMap[lead.status] !== undefined) {
        stageMap[lead.status] += 1;
      }
    });

    return stages.map((stg) => ({
      stage: stg,
      "Lead Count": stageMap[stg],
    }));
  };

  // Recharts Pie Chart Palette (Harmonious Stripe-inspired colors)
  const PIE_COLORS = ["#2563EB", "#3B82F6", "#6366F1", "#8B5CF6", "#A78BFA"];

  return (
    <div className="space-y-6">
      
      {/* Title Header with Date Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Analytics Dashboard</h1>
          <p className="text-sm text-text-gray mt-1">
            Real-time metrics, growth trends, and source analyses for your pipeline.
          </p>
        </div>

        {/* Date Filter Segmented Controls */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/60 shrink-0">
          {/* All Time button */}
          <button
            onClick={() => setDateRange("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              dateRange === "all"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Time
          </button>
          
          {/* Last 30 Days button */}
          <button
            onClick={() => setDateRange("30days")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              dateRange === "30days"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Last 30 Days
          </button>
          
          {/* Last 6 Months button */}
          <button
            onClick={() => setDateRange("6months")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              dateRange === "6months"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Last 6 Months
          </button>
        </div>
      {/* End Header section */}
      </div>

      {/* KPI Cards Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Deal Cycle KPI */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-text-gray block">Avg Deal Cycle</span>
            <span className="text-2xl font-bold text-text-dark">{filteredAvgCycle} Days</span>
            <span className="text-[10px] text-success font-semibold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Optimizing target</span>
            </span>
          </div>
        </div>

        {/* Win Rate KPI */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-text-gray block">Win Rate (Closed)</span>
            <span className="text-2xl font-bold text-text-dark">{filteredWinRate}%</span>
            <span className="text-[10px] text-text-gray font-semibold flex items-center gap-0.5 mt-0.5">
              <Info className="w-3 h-3 text-slate-400" />
              <span>Based on closed deals</span>
            </span>
          </div>
        </div>

        {/* Campaigns KPI */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-text-gray block">Active Campaigns</span>
            <span className="text-2xl font-bold text-text-dark">5 Campaigns</span>
            <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 mt-0.5">
              <span>Website + LinkedIn + Ads</span>
            </span>
          </div>
        </div>

      {/* End KPI Cards Panel */}
      </div>

      {/* Main Graph Area: Monthly Growth Area Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-text-dark">Monthly Lead Growth</h2>
          <p className="text-xs text-text-gray mt-1">
            Dynamic timeline showing total lead volume acquired per month
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getMonthlyGrowthData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              />
              <Area type="monotone" dataKey="Leads Created" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lower Graphs: Lead Source Distribution & Pipeline Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pie Chart: Lead Source Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-text-dark">Lead Sources</h2>
            <p className="text-xs text-text-gray mt-1">
              Percentage split of how prospects find your business
            </p>
          </div>

          <div className="h-64 flex items-center justify-center">
            {getSourceDistributionData().length === 0 ? (
              <p className="text-sm text-text-gray font-medium">No source data available</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getSourceDistributionData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {getSourceDistributionData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bar Chart: Conversion Funnel Stage Analysis */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-text-dark">Conversion Funnel</h2>
            <p className="text-xs text-text-gray mt-1">
              Quantity of active/completed leads in each pipeline stage
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getFunnelStageData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="stage" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="Lead Count" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {/* Dynamic coloring per stage matching standard theme highlights */}
                  {getFunnelStageData().map((entry, index) => {
                    const colors = {
                      New: "#94A3B8",
                      Contacted: "#3B82F6",
                      "Meeting Scheduled": "#6366F1",
                      "Proposal Sent": "#F59E0B",
                      Won: "#10B981",
                      Lost: "#EF4444",
                    };
                    return <Cell key={`cell-${index}`} fill={colors[entry.stage] || "#2563EB"} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      {/* End Lower Graphs grid */}
      </div>

    {/* End main layout frame */}
    </div>
  );
}

// Export the Analytics page as default
export default Analytics;