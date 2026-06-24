import { useAnalytics } from "../hooks/useAnalytics";

// Import Custom Analytics UI Components
import AnalyticsFilters from "../components/analytics/AnalyticsFilters";
import StatsCards from "../components/analytics/StatsCards";
import PieChartCard from "../components/analytics/PieChartCard";
import FunnelChartCard from "../components/analytics/FunnelChartCard";
import BarChartCard from "../components/analytics/BarChartCard";
import LineChartCard from "../components/analytics/LineChartCard";
import RevenueChartCard from "../components/analytics/RevenueChartCard";
import LeadSourceChart from "../components/analytics/LeadSourceChart";
import ActivityHeatmap from "../components/analytics/ActivityHeatmap";
import TopPerformersCard from "../components/analytics/TopPerformersCard";
import ForecastCard from "../components/analytics/ForecastCard";
import SalesVelocityCard from "../components/analytics/SalesVelocityCard";
import EmptyAnalyticsState from "../components/analytics/EmptyAnalyticsState";
import LoadingSkeleton from "../components/analytics/LoadingSkeleton";

/**
 * Analytics page component acts as the orchestrator for the CRM Analytics dashboard view.
 */
function Analytics() {
  const {
    leads,
    filteredLeads,
    kpis,
    chartsData,
    loading,
    filterType,
    setFilterType,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
  } = useAnalytics();

  // Show skeletal loader while calculations compile or filters shift
  if (loading) {
    return <LoadingSkeleton />;
  }

  // If there are zero leads in the entire CRM context database
  if (!leads || leads.length === 0) {
    return <EmptyAnalyticsState />;
  }

  return (
    <div className="space-y-6">
      
      {/* Section 1: Analytics Header & Date Range Filters */}
      <AnalyticsFilters
        filterType={filterType}
        setFilterType={setFilterType}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
      />

      {/* Evaluate if the active date filter yields zero matching leads */}
      {filteredLeads.length === 0 ? (
        <EmptyAnalyticsState />
      ) : (
        <>
          {/* Section 2: 6 KPI Summary Cards Row */}
          <StatsCards kpis={kpis} />

          {/* Section 3: Pie Chart & Funnel Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PieChartCard data={chartsData.statusDistribution} />
            <FunnelChartCard data={chartsData.funnelData} />
          </div>

          {/* Section 4: Monthly Leads Bar & Conversion Line Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BarChartCard data={chartsData.monthlyLeads} />
            <LineChartCard data={chartsData.conversionTrend} />
          </div>

          {/* Section 5: Revenue Area & Lead Source Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RevenueChartCard data={chartsData.revenueTrend} />
            <LeadSourceChart data={chartsData.leadSources} />
          </div>

          {/* Section 6: Activity Heatmap & Top Performers leaderboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActivityHeatmap data={chartsData.activityHeatmap} />
            <TopPerformersCard data={chartsData.topPerformers} />
          </div>

          {/* Section 7: Revenue Forecast & Sales Velocity Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ForecastCard data={chartsData.revenueForecast} />
            <SalesVelocityCard data={dataSalesVelocityAdapter(chartsData.salesVelocity)} />
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Tiny local adapter to safeguard Recharts / sales velocity structures in the card.
 */
function dataSalesVelocityAdapter(velocityData) {
  return {
    velocity: velocityData?.velocity ?? 0,
    opportunities: velocityData?.opportunities ?? 0,
    winRate: velocityData?.winRate ?? 0,
    avgDealSize: velocityData?.avgDealSize ?? 0,
    salesCycle: velocityData?.salesCycle ?? 30,
    growth: velocityData?.growth ?? 0,
  };
}

export default Analytics;