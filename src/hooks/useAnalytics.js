import { useState, useMemo, useEffect } from "react";
import { useLeads } from "./useLeads";
import {
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData,
} from "../utils/analyticsHelpers";

/**
 * Custom hook to manage all filtering, calculation, and comparisons for the Analytics Dashboard.
 */
export function useAnalytics() {
  const { leads } = useLeads();
  const [filterType, setFilterType] = useState("30days"); // default filter
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  // Re-simulate a premium skeleton loading experience once on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450); // fast transition for premium feel
    return () => clearTimeout(timer);
  }, []);

  // Compute the current and previous date boundaries based on filterType
  const dateRanges = useMemo(() => {
    const now = new Date();
    let currentStart = new Date(0); // Epoch start by default
    let currentEnd = new Date();
    let prevStart = new Date(0);
    let prevEnd = new Date(0);
    let isAllTime = false;

    switch (filterType) {
      case "7days": {
        currentStart = new Date();
        currentStart.setDate(now.getDate() - 7);
        currentStart.setHours(0, 0, 0, 0);

        prevStart = new Date(currentStart);
        prevStart.setDate(prevStart.getDate() - 7);
        prevEnd = new Date(currentStart);
        break;
      }
      case "30days": {
        currentStart = new Date();
        currentStart.setDate(now.getDate() - 30);
        currentStart.setHours(0, 0, 0, 0);

        prevStart = new Date(currentStart);
        prevStart.setDate(prevStart.getDate() - 30);
        prevEnd = new Date(currentStart);
        break;
      }
      case "90days": {
        currentStart = new Date();
        currentStart.setDate(now.getDate() - 90);
        currentStart.setHours(0, 0, 0, 0);

        prevStart = new Date(currentStart);
        prevStart.setDate(prevStart.getDate() - 90);
        prevEnd = new Date(currentStart);
        break;
      }
      case "thisYear": {
        currentStart = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);

        prevStart = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
        prevEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
        break;
      }
      case "custom": {
        if (customStartDate) {
          currentStart = new Date(customStartDate);
          currentStart.setHours(0, 0, 0, 0);
        }
        if (customEndDate) {
          currentEnd = new Date(customEndDate);
          currentEnd.setHours(23, 59, 59, 999);
        }
        
        // Calculate interval length to construct previous period
        const diffMs = currentEnd - currentStart;
        if (diffMs > 0) {
          prevStart = new Date(currentStart.getTime() - diffMs);
          prevEnd = new Date(currentStart.getTime());
        }
        break;
      }
      case "all":
      default:
        isAllTime = true;
        break;
    }

    return { currentStart, currentEnd, prevStart, prevEnd, isAllTime };
  }, [filterType, customStartDate, customEndDate]);

  // Filter leads for the current period
  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leads)) return [];
    if (dateRanges.isAllTime) return leads;

    return leads.filter((lead) => {
      if (!lead || !lead.createdAt) return false;
      const created = new Date(lead.createdAt);
      return created >= dateRanges.currentStart && created <= dateRanges.currentEnd;
    });
  }, [leads, dateRanges]);

  // Filter leads for the previous period to compare trends
  const prevFilteredLeads = useMemo(() => {
    if (!Array.isArray(leads) || dateRanges.isAllTime) return [];

    return leads.filter((lead) => {
      if (!lead || !lead.createdAt) return false;
      const created = new Date(lead.createdAt);
      return created >= dateRanges.prevStart && created <= dateRanges.prevEnd;
    });
  }, [leads, dateRanges]);

  // Calculate KPIs with comparative trends
  const kpis = useMemo(() => {
    // Current KPIs
    const totalLeads = filteredLeads.length;
    const wonLeads = filteredLeads.filter((l) => l.status === "Won").length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
    const pipelineValue = getPipelineValue(filteredLeads);
    const wonRevenue = getWonRevenue(filteredLeads);
    const avgSalesCycle = getAverageSalesCycle(filteredLeads);
    const lostRate = getLostRate(filteredLeads);

    // Previous KPIs (for comparisons)
    const prevTotal = prevFilteredLeads.length;
    const prevWon = prevFilteredLeads.filter((l) => l.status === "Won").length;
    const prevConversionRate = prevTotal > 0 ? Math.round((prevWon / prevTotal) * 100) : 0;
    const prevPipeline = getPipelineValue(prevFilteredLeads);
    const prevWonRev = getWonRevenue(prevFilteredLeads);
    const prevAvgCycle = getAverageSalesCycle(prevFilteredLeads);
    const prevLostRate = getLostRate(prevFilteredLeads);

    // Growth calculation helper
    const calcGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      totalLeads: {
        value: totalLeads,
        growth: calcGrowth(totalLeads, prevTotal),
      },
      conversionRate: {
        value: conversionRate,
        change: conversionRate - prevConversionRate, // direct percentage point change
      },
      pipelineValue: {
        value: pipelineValue,
        growth: calcGrowth(pipelineValue, prevPipeline),
      },
      wonRevenue: {
        value: wonRevenue,
        growth: calcGrowth(wonRevenue, prevWonRev),
      },
      avgSalesCycle: {
        value: avgSalesCycle,
        change: avgSalesCycle - prevAvgCycle, // diff in days (fewer days is positive in sales, so we handle it visually)
      },
      lostRate: {
        value: lostRate,
        change: lostRate - prevLostRate,
      },
    };
  }, [filteredLeads, prevFilteredLeads]);

  // Aggregate charts and sub-components data
  const chartsData = useMemo(() => {
    // Current calculations
    const statusDistribution = getStatusDistribution(filteredLeads);
    const monthlyLeads = getMonthlyLeads(filteredLeads);
    const conversionTrend = getConversionByMonth(filteredLeads);
    const revenueTrend = getRevenueByMonth(filteredLeads);
    const leadSources = getLeadSourceStats(filteredLeads);
    const funnelData = getFunnelData(filteredLeads);
    const salesVelocity = getSalesVelocity(filteredLeads);
    const revenueForecast = getForecastRevenue(filteredLeads);
    const topPerformers = getTopPerformers(filteredLeads);
    const activityHeatmap = getActivityHeatmapData(filteredLeads);

    // Sales Velocity Previous calculations
    const prevSalesVelocity = getSalesVelocity(prevFilteredLeads);
    const salesVelocityGrowth = prevSalesVelocity.velocity > 0
      ? Math.round(((salesVelocity.velocity - prevSalesVelocity.velocity) / prevSalesVelocity.velocity) * 100)
      : salesVelocity.velocity > 0 ? 100 : 0;

    return {
      statusDistribution,
      monthlyLeads,
      conversionTrend,
      revenueTrend,
      leadSources,
      funnelData,
      salesVelocity: {
        ...salesVelocity,
        growth: salesVelocityGrowth,
      },
      revenueForecast,
      topPerformers,
      activityHeatmap,
    };
  }, [filteredLeads, prevFilteredLeads]);

  return {
    leads,
    filteredLeads,
    prevFilteredLeads,
    kpis,
    chartsData,
    loading,
    filterType,
    setFilterType,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
  };
}
