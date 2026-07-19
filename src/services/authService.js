import api from "./api.js";

/**
 * Authentication service communicating with /api/auth endpoints on the Express backend.
 * Unwraps and returns the nested `.data` payload from Axios response wrappers.
 */

/**
 * Register a new user account.
 * 
 * @param {string} name - User's full name
 * @param {string} email - Unique email address
 * @param {string} password - Raw password (min 6 characters)
 * @returns {Promise<object>} Returns the backend response body containing user details and signed token
 */
export const register = async (name, email, password) => {
  const response = await api.post("/api/auth/register", { name, email, password });
  return response.data;
};

/**
 * Authenticate login credentials.
 * 
 * @param {string} email - Registered email address
 * @param {string} password - Raw password
 * @returns {Promise<object>} Returns the backend response body containing user details and signed token
 */
export const login = async (email, password) => {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
};

/**
 * Sign out the current session (stateless operation).
 * Clears the stored JWT from the local browser client.
 */
export const logout = () => {
  localStorage.removeItem("crm-token");
};

/**
 * Retrieve the active user's profile information.
 * 
 * @returns {Promise<object>} Returns the user profile object
 */
export const getProfile = async () => {
  const response = await api.get("/api/auth/profile");
  return response.data;
};

/**
 * Update the user's profile attributes (e.g. name or password).
 * 
 * @param {object} data - Object containing modified fields (name, oldPassword, newPassword)
 * @returns {Promise<object>} Returns the updated user object
 */
export const updateProfile = async (data) => {
  const response = await api.put("/api/auth/profile", data);
  return response.data;
};

export default {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};
