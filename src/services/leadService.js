import api from "./api.js";

/**
 * Lead service communicating with /api/leads endpoints on the Express backend.
 * Unwraps and returns the nested `.data` payload from Axios response wrappers.
 */

/**
 * Fetch a list of leads using optional query parameters (e.g. status, search, page).
 * 
 * @param {object} [params] - Query filter parameters
 * @returns {Promise<object>} Response containing lead records and pagination details
 */
export const getLeads = async (params) => {
  const response = await api.get("/api/leads", { params });
  return response.data;
};

/**
 * Create a new lead record.
 * 
 * @param {object} leadData - Object matching the Lead schema field layout
 * @returns {Promise<object>} Response containing the newly created lead document
 */
export const createLead = async (leadData) => {
  const response = await api.post("/api/leads", leadData);
  return response.data;
};

/**
 * Update an existing lead record's values.
 * 
 * @param {string} id - Lead database ObjectId
 * @param {object} leadData - Object containing lead updates
 * @returns {Promise<object>} Response containing the updated lead document
 */
export const updateLead = async (id, leadData) => {
  const response = await api.put(`/api/leads/${id}`, leadData);
  return response.data;
};

/**
 * Update status field on a target lead.
 * 
 * @param {string} id - Lead database ObjectId
 * @param {string} status - Target status enum value
 * @returns {Promise<object>} Response containing the updated lead document
 */
export const updateLeadStatus = async (id, status) => {
  const response = await api.patch(`/api/leads/${id}/status`, { status });
  return response.data;
};

/**
 * Remove a lead record permanently.
 * 
 * @param {string} id - Lead database ObjectId
 * @returns {Promise<object>} Response confirmation message
 */
export const deleteLead = async (id) => {
  const response = await api.delete(`/api/leads/${id}`);
  return response.data;
};

/**
 * Fetch aggregated total deal summary metrics for active pipeline displays.
 * 
 * @returns {Promise<object>} Returns the dashboard aggregate calculations
 */
export const getLeadStats = async () => {
  const response = await api.get("/api/leads/stats/summary");
  return response.data;
};

/**
 * Fetch 6-month historical monthly lead counts for bar analytics graphs.
 * 
 * @returns {Promise<object>} Returns the monthly trends dataset array
 */
export const getMonthlyStats = async () => {
  const response = await api.get("/api/leads/stats/monthly");
  return response.data;
};

export default {
  getLeads,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
};
