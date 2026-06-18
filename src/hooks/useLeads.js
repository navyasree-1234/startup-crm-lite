import { useContext } from "react";
import { LeadContext } from "../context/LeadContext";

/**
 * Custom hook to retrieve CRM leads data and operations.
 * Wraps LeadContext.
 */
export function useLeads() {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error("useLeads must be used within a LeadProvider");
  }
  return context;
}
