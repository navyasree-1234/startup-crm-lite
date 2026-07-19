/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import leadService from "../services/leadService.js";
import { useAuth } from "./AuthContext.jsx";

// Create context container for Lead management
export const LeadContext = createContext();

/**
 * LeadProvider component manages active lead lists, pagination, 
 * summary metrics, loading states, and transient activity logs.
 */
export function LeadProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  });

  // Keep a local list for visual activity tracking logs
  const [activities, setActivities] = useState([]);

  // Stats state mirroring the dashboard expectations
  const [stats, setStats] = useState({
    totalLeads: 0,
    wonLeadsCount: 0,
    conversionRate: 0,
    winRate: 0,
    pipelineValue: 0,
    closedWonValue: 0,
    avgDealCycle: 30,
  });

  /**
   * Helper: Fetch dashboard summary aggregates from the database
   */
  const fetchStats = async () => {
    try {
      const res = await leadService.getLeadStats();
      if (res.success) {
        const data = res.data;
        const won = data.wonLeads || 0;
        const lost = data.lostLeads || 0;
        const closedDeals = won + lost;
        
        // Calculate closed deals win rate
        const winRate = closedDeals > 0 ? Math.round((won / closedDeals) * 100) : 0;

        setStats({
          totalLeads: data.totalLeads || 0,
          wonLeadsCount: won,
          conversionRate: data.conversionRate || 0,
          winRate: winRate,
          pipelineValue: data.pipelineValue || 0,
          closedWonValue: data.closedWonValue || 0,
          avgDealCycle: 30, // Default average cycle representation
        });
      }
    } catch (error) {
      console.error("Failed to fetch lead stats:", error);
    }
  };

  /**
   * fetchLeads: Load leads matching filter parameters from the database.
   * 
   * @param {object} params - Filters like { status, search, page, limit }
   */
  const fetchLeads = async (params) => {
    setIsLoading(true);
    try {
      const res = await leadService.getLeads(params);
      if (res.success) {
        setLeads(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
        // Sync stats alongside lead fetches
        await fetchStats();
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to load leads from database.";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const { token } = useAuth();

  // Fetch initial leads when authenticated token is set or changes
  useEffect(() => {
    if (token) {
      fetchLeads();
    } else {
      setLeads([]);
      setStats({
        totalLeads: 0,
        wonLeadsCount: 0,
        conversionRate: 0,
        winRate: 0,
        pipelineValue: 0,
        closedWonValue: 0,
        avgDealCycle: 30,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /**
   * addLead: Creates a new lead in the database and refetches state.
   * 
   * @param {object} leadData - Object containing name, company, email, phone, status, source, value, notes
   */
  const addLead = async (leadData) => {
    setIsLoading(true);
    try {
      const res = await leadService.createLead(leadData);
      if (res.success) {
        toast.success("Lead added successfully!");
        
        // Add to activities feed
        const newActivity = {
          id: `act-${Date.now()}`,
          leadName: res.data.name,
          action: `added as a new lead under status "${res.data.status}"`,
          timestamp: "Just now",
          type: "create",
        };
        setActivities((prev) => [newActivity, ...prev]);

        // Refetch to ensure proper sorting/pagination is preserved
        await fetchLeads(pagination);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to create lead.";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * updateLeadStatus: Patches status field of lead in database and refetches state.
   * 
   * @param {string} leadId - Lead database ID
   * @param {string} newStatus - New status value
   */
  const updateLeadStatus = async (leadId, newStatus) => {
    // Capture old status from state for activity log
    const targetLead = leads.find((l) => l._id === leadId);
    const oldStatus = targetLead ? targetLead.status : "";
    const leadName = targetLead ? targetLead.name : "A lead";

    try {
      const res = await leadService.updateLeadStatus(leadId, newStatus);
      if (res.success) {
        toast.success(`Status updated to ${newStatus}`);

        // Add to activities feed
        if (oldStatus !== newStatus) {
          const newActivity = {
            id: `act-${Date.now()}`,
            leadName,
            action: `updated status from "${oldStatus}" to "${newStatus}"`,
            timestamp: "Just now",
            type: "status_change",
          };
          setActivities((prev) => [newActivity, ...prev]);
        }

        await fetchLeads(pagination);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to update lead status.";
      toast.error(errMsg);
    }
  };

  /**
   * updateLead: Modifies lead details in database and refetches state.
   * 
   * @param {string} leadId - Lead database ID
   * @param {object} updatedData - Object containing lead updates
   */
  const updateLead = async (leadId, updatedData) => {
    // Capture old status from state for activity log
    const targetLead = leads.find((l) => l._id === leadId);
    const oldStatus = targetLead ? targetLead.status : "";
    const leadName = targetLead ? targetLead.name : "A lead";
    const newStatus = updatedData.status;

    setIsLoading(true);
    try {
      const res = await leadService.updateLead(leadId, updatedData);
      if (res.success) {
        toast.success("Lead details updated successfully!");

        // Add to activities feed
        const newActivity = {
          id: `act-${Date.now()}`,
          leadName,
          action: oldStatus !== newStatus
            ? `updated status from "${oldStatus}" to "${newStatus}"`
            : "updated lead details",
          timestamp: "Just now",
          type: oldStatus !== newStatus ? "status_change" : "update",
        };
        setActivities((prev) => [newActivity, ...prev]);

        await fetchLeads(pagination);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to update lead details.";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * deleteLead: Removes lead from database and refetches state.
   * 
   * @param {string} leadId - Lead database ID
   */
  const deleteLead = async (leadId) => {
    const targetLead = leads.find((l) => l._id === leadId);
    const leadName = targetLead ? targetLead.name : "A lead";

    setIsLoading(true);
    try {
      const res = await leadService.deleteLead(leadId);
      if (res.success) {
        toast.success("Lead deleted successfully");

        // Add to activities feed
        const newActivity = {
          id: `act-${Date.now()}`,
          leadName,
          action: "was deleted from the CRM",
          timestamp: "Just now",
          type: "delete",
        };
        setActivities((prev) => [newActivity, ...prev]);

        await fetchLeads(pagination);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to delete lead.";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Build context payload bundle
  const value = {
    leads,
    isLoading,
    pagination,
    activities,
    stats,
    fetchLeads,
    addLead,
    updateLeadStatus,
    updateLead,
    deleteLead,
  };

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  );
}
