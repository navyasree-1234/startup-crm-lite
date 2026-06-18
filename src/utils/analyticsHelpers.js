/**
 * analyticsHelpers.js
 * Utility functions for aggregating and analyzing CRM leads data.
 * Pure functions with defensive null handling.
 */

// Helper to map DB statuses to the dashboard's 6 clean statuses
export const mapStatus = (status) => {
  if (!status) return "New";
  const normalized = status.trim();
  if (normalized === "Meeting Scheduled" || normalized === "Meeting") return "Meeting";
  if (normalized === "Proposal Sent" || normalized === "Proposal") return "Proposal";
  return normalized; // "New", "Contacted", "Won", "Lost"
};

/**
 * Calculates lead status distribution with counts and percentages
 */
export const getStatusDistribution = (leads) => {
  if (!Array.isArray(leads)) return [];
  
  const counts = {
    New: 0,
    Contacted: 0,
    Meeting: 0,
    Proposal: 0,
    Won: 0,
    Lost: 0,
  };

  leads.forEach((lead) => {
    if (lead && lead.status) {
      const mapped = mapStatus(lead.status);
      if (counts[mapped] !== undefined) {
        counts[mapped]++;
      }
    }
  });

  const total = leads.length;
  return Object.keys(counts).map((status) => {
    const value = counts[status];
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    return { name: status, value, percentage };
  });
};

/**
 * Groups leads by month of creation for the last 6 months
 */
export const getMonthlyLeads = (leads) => {
  if (!Array.isArray(leads)) return [];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Get last 6 months labels
  const now = new Date();
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mIndex = d.getMonth();
    const year = d.getFullYear();
    last6Months.push({
      name: months[mIndex],
      fullName: fullMonths[mIndex],
      year,
      monthIndex: mIndex,
      leadsCount: 0,
    });
  }

  leads.forEach((lead) => {
    if (!lead || !lead.createdAt) return;
    const date = new Date(lead.createdAt);
    const mIndex = date.getMonth();
    const year = date.getFullYear();

    const monthObj = last6Months.find(
      (m) => m.monthIndex === mIndex && m.year === year
    );
    if (monthObj) {
      monthObj.leadsCount++;
    }
  });

  return last6Months.map((m) => ({
    name: m.name,
    fullName: m.fullName,
    "Leads Created": m.leadsCount,
    // fallback key for general chart usage
    value: m.leadsCount,
  }));
};

/**
 * Calculates conversion rate (Won / Total) per month for the last 6 months
 */
export const getConversionByMonth = (leads) => {
  if (!Array.isArray(leads)) return [];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const now = new Date();
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mIndex = d.getMonth();
    const year = d.getFullYear();
    last6Months.push({
      name: months[mIndex],
      fullName: fullMonths[mIndex],
      year,
      monthIndex: mIndex,
      total: 0,
      won: 0,
    });
  }

  leads.forEach((lead) => {
    if (!lead || !lead.createdAt) return;
    const date = new Date(lead.createdAt);
    const mIndex = date.getMonth();
    const year = date.getFullYear();

    const monthObj = last6Months.find(
      (m) => m.monthIndex === mIndex && m.year === year
    );
    if (monthObj) {
      monthObj.total++;
      if (lead.status === "Won") {
        monthObj.won++;
      }
    }
  });

  return last6Months.map((m) => {
    const rate = m.total > 0 ? Math.round((m.won / m.total) * 100) : 0;
    return {
      name: m.name,
      fullName: m.fullName,
      "Conversion Rate": rate,
      // fallback key for standard line components
      value: rate,
    };
  });
};

/**
 * Calculates Won Revenue grouped by month for the last 6 months
 */
export const getRevenueByMonth = (leads) => {
  if (!Array.isArray(leads)) return [];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const now = new Date();
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mIndex = d.getMonth();
    const year = d.getFullYear();
    last6Months.push({
      name: months[mIndex],
      fullName: fullMonths[mIndex],
      year,
      monthIndex: mIndex,
      revenue: 0,
    });
  }

  leads.forEach((lead) => {
    if (!lead || lead.status !== "Won" || !lead.createdAt) return;
    const date = new Date(lead.createdAt);
    const mIndex = date.getMonth();
    const year = date.getFullYear();

    const monthObj = last6Months.find(
      (m) => m.monthIndex === mIndex && m.year === year
    );
    if (monthObj) {
      monthObj.revenue += Number(lead.value) || 0;
    }
  });

  return last6Months.map((m) => ({
    name: m.name,
    fullName: m.fullName,
    "Won Revenue": m.revenue,
    // fallback key
    value: m.revenue,
  }));
};

/**
 * Returns sum of all active lead values (not Won, not Lost)
 */
export const getPipelineValue = (leads) => {
  if (!Array.isArray(leads)) return 0;
  return leads
    .filter((l) => l && l.status !== "Won" && l.status !== "Lost")
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
};

/**
 * Returns sum of all Won lead values
 */
export const getWonRevenue = (leads) => {
  if (!Array.isArray(leads)) return 0;
  return leads
    .filter((l) => l && l.status === "Won")
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
};

/**
 * Calculates the average sales cycle in days
 */
export const getAverageSalesCycle = (leads) => {
  if (!Array.isArray(leads)) return 0;
  const wonLeads = leads.filter((l) => l && l.status === "Won");
  if (wonLeads.length === 0) return 0;

  let totalDays = 0;
  let count = 0;

  wonLeads.forEach((lead) => {
    if (lead.wonAt && lead.createdAt) {
      const diffTime = new Date(lead.wonAt) - new Date(lead.createdAt);
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (days >= 0) {
        totalDays += days;
        count++;
        return;
      }
    }
    if (typeof lead.dealCycleDays === "number" && lead.dealCycleDays > 0) {
      totalDays += lead.dealCycleDays;
      count++;
    }
  });

  return count > 0 ? Math.round(totalDays / count) : 0;
};

/**
 * Calculates the Lost Rate (Lost Leads / Total Leads)
 */
export const getLostRate = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return 0;
  const lostLeads = leads.filter((l) => l && l.status === "Lost");
  return Math.round((lostLeads.length / leads.length) * 100);
};

/**
 * Calculates lead source statistics, sorted descending
 */
export const getLeadSourceStats = (leads) => {
  if (!Array.isArray(leads)) return [];
  const sourcesMap = {};

  leads.forEach((lead) => {
    if (lead && lead.source) {
      const src = lead.source.trim();
      sourcesMap[src] = (sourcesMap[src] || 0) + 1;
    }
  });

  return Object.keys(sourcesMap)
    .map((source) => ({
      name: source,
      value: sourcesMap[source],
      count: sourcesMap[source],
    }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Generates conversion stages funnel data
 */
export const getFunnelData = (leads) => {
  if (!Array.isArray(leads)) return [];

  // Cumulative funnel calculations
  // All leads are New.
  // Contacted includes: Contacted, Meeting, Proposal, Won.
  // Meeting includes: Meeting, Proposal, Won.
  // Proposal includes: Proposal, Won.
  // Won includes: Won.
  const total = leads.length;

  const countNew = total;
  const countContacted = leads.filter((l) =>
    l && ["Contacted", "Meeting Scheduled", "Meeting", "Proposal Sent", "Proposal", "Won"].includes(l.status)
  ).length;
  
  const countMeeting = leads.filter((l) =>
    l && ["Meeting Scheduled", "Meeting", "Proposal Sent", "Proposal", "Won"].includes(l.status)
  ).length;

  const countProposal = leads.filter((l) =>
    l && ["Proposal Sent", "Proposal", "Won"].includes(l.status)
  ).length;

  const countWon = leads.filter((l) => l && l.status === "Won").length;

  const stages = [
    { stage: "New", value: countNew },
    { stage: "Contacted", value: countContacted },
    { stage: "Meeting", value: countMeeting },
    { stage: "Proposal", value: countProposal },
    { stage: "Won", value: countWon },
  ];

  return stages.map((item, index) => {
    const prevValue = index > 0 ? stages[index - 1].value : item.value;
    const conversion = prevValue > 0 ? Math.round((item.value / prevValue) * 100) : 0;
    const dropoff = prevValue > 0 ? 100 - conversion : 0;
    const totalConversion = total > 0 ? Math.round((item.value / total) * 100) : 0;
    return {
      ...item,
      conversion, // conversion from previous stage
      dropoff, // drop-off from previous stage
      totalConversion, // conversion from top of funnel (New)
    };
  });
};

/**
 * Calculates sales velocity: (Opportunities * Win Rate * Avg Deal Size) / Avg Sales Cycle
 */
export const getSalesVelocity = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return { velocity: 0, opportunities: 0, winRate: 0, avgDealSize: 0, salesCycle: 30 };

  // Opportunities: active leads
  const opportunities = leads.filter((l) => l && l.status !== "Won" && l.status !== "Lost").length;
  
  // Win rate: Won / (Won + Lost)
  const wonLeads = leads.filter((l) => l && l.status === "Won");
  const lostLeads = leads.filter((l) => l && l.status === "Lost");
  const closedCount = wonLeads.length + lostLeads.length;
  const winRate = closedCount > 0 ? wonLeads.length / closedCount : 0;

  // Average deal size of closed won leads (fallback to average of all leads with value > 0)
  let avgDealSize = 0;
  if (wonLeads.length > 0) {
    avgDealSize = wonLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0) / wonLeads.length;
  } else {
    const leadsWithValue = leads.filter((l) => l && Number(l.value) > 0);
    if (leadsWithValue.length > 0) {
      avgDealSize = leadsWithValue.reduce((sum, l) => sum + (Number(l.value) || 0), 0) / leadsWithValue.length;
    }
  }

  // Sales cycle in days
  const salesCycle = getAverageSalesCycle(leads) || 30; // fallback to 30 days to avoid division by 0

  const velocity = salesCycle > 0 ? (opportunities * winRate * avgDealSize) / salesCycle : 0;

  return {
    velocity: Math.round(velocity),
    opportunities,
    winRate: Math.round(winRate * 100),
    avgDealSize: Math.round(avgDealSize),
    salesCycle,
  };
};

/**
 * Forecasts revenue for the next month based on average revenue of the last 6 months
 */
export const getForecastRevenue = (leads) => {
  if (!Array.isArray(leads)) return { forecastedRevenue: 0, confidenceScore: 0, growthTrend: 0 };

  const monthlyRev = getRevenueByMonth(leads);
  const totalRev = monthlyRev.reduce((sum, m) => sum + m["Won Revenue"], 0);
  const forecastedRevenue = Math.round(totalRev / 6);

  // Confidence Score calculation
  // Base score 75. Modify based on number of won deals (data volume) and revenue variance
  const wonCount = leads.filter((l) => l && l.status === "Won").length;
  let confidenceScore = 70;
  
  if (wonCount > 20) confidenceScore += 15;
  else if (wonCount > 10) confidenceScore += 10;
  else if (wonCount > 5) confidenceScore += 5;
  else confidenceScore -= 15; // penalize low data

  // Growth Trend: last month vs previous month or last month vs 6-month average
  const lastMonthRev = monthlyRev[5]?.["Won Revenue"] || 0;
  const prevMonthRev = monthlyRev[4]?.["Won Revenue"] || 0;
  
  let growthTrend = 0;
  if (prevMonthRev > 0) {
    growthTrend = Math.round(((lastMonthRev - prevMonthRev) / prevMonthRev) * 100);
  } else if (forecastedRevenue > 0) {
    growthTrend = Math.round(((lastMonthRev - forecastedRevenue) / forecastedRevenue) * 100);
  }

  // Cap confidence score between 30% and 98%
  confidenceScore = Math.max(30, Math.min(98, confidenceScore));

  return {
    forecastedRevenue,
    confidenceScore,
    growthTrend,
  };
};

/**
 * Ranks lead owners (sales reps) by Won Revenue, descending
 */
export const getTopPerformers = (leads) => {
  if (!Array.isArray(leads)) return [];

  const reps = {};
  leads.forEach((lead) => {
    if (lead && lead.status === "Won") {
      const owner = lead.owner || "Unassigned";
      if (!reps[owner]) {
        reps[owner] = { revenue: 0, count: 0 };
      }
      reps[owner].revenue += Number(lead.value) || 0;
      reps[owner].count++;
    }
  });

  return Object.keys(reps)
    .map((name) => ({
      name,
      revenue: reps[name].revenue,
      count: reps[name].count,
    }))
    .sort((a, b) => b.revenue - a.revenue);
};

/**
 * Formats daily activity logs (Leads Created, Meetings Scheduled, Calls Logged)
 * for the contribution heatmap widget.
 */
export const getActivityHeatmapData = (leads) => {
  if (!Array.isArray(leads)) return {};

  const activityMap = {};

  // For each lead, we populate activity markers to make the heatmap look gorgeous:
  // - Leads Created on lead.createdAt
  // - Call Logged (inferred from contactedAt, or if Status is not New/Contacted, 1 day after createdAt)
  // - Meeting Scheduled (inferred from meetingAt, or if Status is Meeting, Proposal, Won, 3 days after createdAt)
  leads.forEach((lead) => {
    if (!lead || !lead.createdAt) return;

    const createdDateStr = lead.createdAt.split("T")[0];
    
    // 1. Created lead activity
    if (!activityMap[createdDateStr]) {
      activityMap[createdDateStr] = { date: createdDateStr, created: 0, meetings: 0, calls: 0, total: 0 };
    }
    activityMap[createdDateStr].created++;
    activityMap[createdDateStr].total++;

    // 2. Call logged activity
    let callDateStr = null;
    if (lead.contactedAt) {
      callDateStr = lead.contactedAt.split("T")[0];
    } else if (["Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"].includes(lead.status)) {
      // Infer call logged 1 day after creation
      const createdDate = new Date(lead.createdAt);
      createdDate.setDate(createdDate.getDate() + 1);
      callDateStr = createdDate.toISOString().split("T")[0];
    }

    if (callDateStr) {
      if (!activityMap[callDateStr]) {
        activityMap[callDateStr] = { date: callDateStr, created: 0, meetings: 0, calls: 0, total: 0 };
      }
      activityMap[callDateStr].calls++;
      activityMap[callDateStr].total++;
    }

    // 3. Meeting Scheduled activity
    let meetingDateStr = null;
    if (lead.meetingAt) {
      meetingDateStr = lead.meetingAt.split("T")[0];
    } else if (["Meeting Scheduled", "Proposal Sent", "Won"].includes(lead.status)) {
      // Infer meeting scheduled 3 days after creation
      const createdDate = new Date(lead.createdAt);
      createdDate.setDate(createdDate.getDate() + 3);
      meetingDateStr = createdDate.toISOString().split("T")[0];
    }

    if (meetingDateStr) {
      if (!activityMap[meetingDateStr]) {
        activityMap[meetingDateStr] = { date: meetingDateStr, created: 0, meetings: 0, calls: 0, total: 0 };
      }
      activityMap[meetingDateStr].meetings++;
      activityMap[meetingDateStr].total++;
    }
  });

  return activityMap;
};
