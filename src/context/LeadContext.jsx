/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";

// Import initial mock lists for fallback data initialization
import { initialLeads, initialActivities } from "../data/mockData";

// Create the LeadContext using standard React context API
export const LeadContext = createContext();

/**
 * LeadProvider component wraps child DOM trees and manages active lead entries,
 * activity history lists, and real-time CRM aggregate metrics.
 */
export function LeadProvider({ children }) {
  // Initialize 'leads' state by reading from localStorage, falling back to initialLeads mock array
  const [leads, setLeads] = useState(() => {
    // Read cached leads string from client browser storage
    const local = localStorage.getItem("crm_leads");
    // Parse JSON if it exists, otherwise return default mock dataset
    return local ? JSON.parse(local) : initialLeads;
  });

  // Initialize 'activities' state by reading from localStorage, falling back to initialActivities mock array
  const [activities, setActivities] = useState(() => {
    // Read cached activities string from client browser storage
    const local = localStorage.getItem("crm_activities");
    // Parse JSON if it exists, otherwise return default mock activity records
    return local ? JSON.parse(local) : initialActivities;
  });

  // Synchronize leads data with localStorage whenever the leads array state is modified
  useEffect(() => {
    // Write stringified leads JSON data to localStorage key
    localStorage.setItem("crm_leads", JSON.stringify(leads));
  }, [leads]); // Re-run effect only when leads change

  // Synchronize activities data with localStorage whenever the activities array state is modified
  useEffect(() => {
    // Write stringified activities JSON data to localStorage key
    localStorage.setItem("crm_activities", JSON.stringify(activities));
  }, [activities]); // Re-run effect only when activities change

  /**
   * addLead: appends a new lead record to state, and logs the creation activity.
   * @param {Object} leadData - Struct containing name, company, email, phone, value, status, source.
   */
  const addLead = (leadData) => {
    // Generate a unique ID using timestamp and form standard lead struct
    const newLead = {
      ...leadData,
      id: `lead-${Date.now()}`, // String identifier
      value: Number(leadData.value) || 0, // Convert string input to safe number representation
      createdAt: new Date().toISOString(), // Standard timestamp
      dealCycleDays: leadData.status === "Won" ? 30 : null, // Set default cycle if already won
    };

    // Prepend the new lead structure to existing list array
    setLeads((prev) => [newLead, ...prev]);

    // Create an activity tracker record matching this insertion
    const newActivity = {
      id: `act-${Date.now()}`, // Unique ID
      leadName: newLead.name, // Target lead's name
      action: `added as a new lead under status "${newLead.status}"`, // Action description
      timestamp: "Just now", // Visual text label
      type: "create", // Tag
    };

    // Prepend new activity record to state
    setActivities((prev) => [newActivity, ...prev]);
  };

  /**
   * updateLeadStatus: modifies status property on a target lead and logs status change.
   * @param {String} leadId - Unique ID of lead.
   * @param {String} newStatus - Target status value.
   */
  const updateLeadStatus = (leadId, newStatus) => {
    // Declare tracking variables to log detailed logs
    let leadName = "A lead";
    let oldStatus = "";

    // Map lead entries and update target matching elements
    setLeads((prev) =>
      prev.map((lead) => {
        // Evaluate ID equivalence
        if (lead.id === leadId) {
          // Capture descriptors for visual logging
          leadName = lead.name;
          oldStatus = lead.status;

          // Calculate deal cycle duration if status is transitioned to "Won" or "Lost"
          let dealCycleDays = lead.dealCycleDays;
          if ((newStatus === "Won" || newStatus === "Lost") && !lead.dealCycleDays) {
            // Find difference between date fields in days
            const start = new Date(lead.createdAt);
            const end = new Date();
            const diffTime = Math.abs(end - start);
            dealCycleDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
          }

          // Return updated copy of the lead object
          return {
            ...lead,
            status: newStatus,
            dealCycleDays,
          };
        }
        // Return unchanged entries
        return lead;
      })
    );

    // Skip activity logger if status has not actually changed
    if (oldStatus !== newStatus) {
      // Append a status change activity tracking log
      const newActivity = {
        id: `act-${Date.now()}`,
        leadName: leadName,
        action: `updated status from "${oldStatus}" to "${newStatus}"`,
        timestamp: "Just now",
        type: "status_change",
      };
      // Prepend to activity states
      setActivities((prev) => [newActivity, ...prev]);
    }
  };

  /**
   * deleteLead: removes a lead from lists and records a delete log event.
   * @param {String} leadId - Target lead identifier.
   */
  /**
   * updateLead: updates an existing lead's attributes and records the change log.
   * @param {String} leadId - Unique ID of lead.
   * @param {Object} updatedData - Object containing updated lead details.
   */
  const updateLead = (leadId, updatedData) => {
    let leadName = "A lead";
    let oldStatus = "";
    let newStatus = updatedData.status;

    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          leadName = lead.name;
          oldStatus = lead.status;

          // Calculate deal cycle duration if status is transitioned to "Won" or "Lost"
          let dealCycleDays = lead.dealCycleDays;
          if (newStatus !== oldStatus && (newStatus === "Won" || newStatus === "Lost") && !lead.dealCycleDays) {
            const start = new Date(lead.createdAt);
            const end = new Date();
            const diffTime = Math.abs(end - start);
            dealCycleDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
          }

          return {
            ...lead,
            ...updatedData,
            value: Number(updatedData.value) || 0,
            dealCycleDays,
          };
        }
        return lead;
      })
    );

    // Record activity depending on whether status changed or details changed
    if (oldStatus !== newStatus) {
      const newActivity = {
        id: `act-${Date.now()}`,
        leadName: leadName,
        action: `updated status from "${oldStatus}" to "${newStatus}"`,
        timestamp: "Just now",
        type: "status_change",
      };
      setActivities((prev) => [newActivity, ...prev]);
    } else {
      const newActivity = {
        id: `act-${Date.now()}`,
        leadName: leadName,
        action: `updated lead details`,
        timestamp: "Just now",
        type: "update",
      };
      setActivities((prev) => [newActivity, ...prev]);
    }
  };

  /**
   * deleteLead: removes a lead from lists and records a delete log event.
   * @param {String} leadId - Target lead identifier.
   */
  const deleteLead = (leadId) => {
    // Find target lead name for activity log
    const targetLead = leads.find((l) => l.id === leadId);
    const leadName = targetLead ? targetLead.name : "A lead";

    // Filter out target lead matching id
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId));

    // Register deletion activity log
    const newActivity = {
      id: `act-${Date.now()}`,
      leadName: leadName,
      action: "was deleted from the CRM",
      timestamp: "Just now",
      type: "delete",
    };
    // Prepend to activity list
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Derive dynamic CRM statistical aggregates based on the leads array state
  const totalLeads = leads.length; // Count of all leads
  const wonLeads = leads.filter((l) => l.status === "Won"); // Leads closed won
  const lostLeads = leads.filter((l) => l.status === "Lost"); // Leads closed lost

  // Calculate overall win conversion percentage (Won leads divided by total leads)
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads.length / totalLeads) * 100) : 0;

  // Calculate win rate from closed deals (Won divided by Won + Lost)
  const winRate =
    wonLeads.length + lostLeads.length > 0
      ? Math.round((wonLeads.length / (wonLeads.length + lostLeads.length)) * 100)
      : 0;

  // Sum total value of active pipeline deals (not won or lost)
  const pipelineValue = leads
    .filter((l) => l.status !== "Won" && l.status !== "Lost")
    .reduce((sum, l) => sum + (l.value || 0), 0);

  // Sum total value of deals closed successfully (Won)
  const closedWonValue = wonLeads.reduce((sum, l) => sum + (l.value || 0), 0);

  // Calculate average deal cycle in days from completed deals (Won/Lost)
  const closedDealsWithCycles = leads.filter((l) => l.dealCycleDays !== null && l.dealCycleDays !== undefined);
  const avgDealCycle =
    closedDealsWithCycles.length > 0
      ? Math.round(closedDealsWithCycles.reduce((sum, l) => sum + l.dealCycleDays, 0) / closedDealsWithCycles.length)
      : 30; // Fallback to 30 days if no historical deal cycles are logged

  // Package all stats, lists, and handlers inside a unified context value object
  const value = {
    leads,
    activities,
    stats: {
      totalLeads,
      wonLeadsCount: wonLeads.length,
      conversionRate,
      winRate,
      pipelineValue,
      closedWonValue,
      avgDealCycle,
    },
    addLead,
    updateLeadStatus,
    updateLead,
    deleteLead,
  };

  return (
    // Render the context Provider supplying packaged values to child component hooks
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  );
}
