import axios from "axios";
import toast from "react-hot-toast";

/**
 * Configure standard Axios client instance using Vite environment variables.
 * Fallback to http://localhost:5000 in development if undefined.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Request Interceptor: Automatically inject Authorization token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("crm-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Intercept status responses to manage session expiry and network failures globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response, request } = error;

    if (response) {
      // 1. Handle unauthorized/expired token statuses (401)
      if (response.status === 401) {
        localStorage.removeItem("crm-token");
        
        // Prevent redirect looping if user is already attempting credentials logging
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/register") {
          window.location.href = "/login";
        }
      }
    } else if (request) {
      // 2. Handle client-side offline or server network failures
      toast.error("Cannot connect to server. Check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;
