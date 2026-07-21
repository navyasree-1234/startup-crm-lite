import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService.js";
import toast from "react-hot-toast";

// Create context container for authorization states
export const AuthContext = createContext();

/**
 * AuthProvider component manages global session states (active user data, active JWT, loaders).
 * Handles persistent session restoration on load and encapsulates async login/register APIs.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("crm-token"));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // On mount: Restore user profile session if client token exists in localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("crm-token");
      if (storedToken) {
        try {
          const res = await authService.getProfile();
          if (res.success) {
            setUser(res.data);
            setToken(storedToken);
          } else {
            // If verification check failed, flush expired values
            authService.logout();
            setUser(null);
            setToken(null);
          }
        } catch (err) {
          console.error("Failed to restore session:", err);
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  /**
   * Log in user credentials.
   * 
   * @param {string} email - Raw email input
   * @param {string} password - Raw password input
   * @returns {Promise<object>} Status report containing success status and error descriptors
   */
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const res = await authService.login(email, password);
      
      if (res.success) {
        localStorage.setItem("crm-token", res.token);
        setToken(res.token);
        setUser(res.data);
        toast.success("Welcome back! Login successful.");
        navigate("/");
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || (err.response ? "Invalid email or password." : "Cannot connect to server. Check your connection.");
      if (err.response) {
        toast.error(errMsg);
      }
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user credential profile.
   * 
   * @param {string} name - User's full name
   * @param {string} email - Email address
   * @param {string} password - Min 6 char password
   * @returns {Promise<object>} Status report containing success status and error descriptors
   */
  const register = async (name, email, password) => {
    try {
      setIsLoading(true);
      const res = await authService.register(name, email, password);
      
      if (res.success) {
        localStorage.setItem("crm-token", res.token);
        setToken(res.token);
        setUser(res.data);
        toast.success("Account created successfully!");
        navigate("/");
        return { success: true };
      }
    } catch (err) {
      // Check for validation errors returned from the express-validator middleware
      const valErrors = err.response?.data?.errors;
      let errMsg = "Registration failed.";
      if (valErrors && typeof valErrors === "object") {
        if (Array.isArray(valErrors) && valErrors.length > 0) {
          errMsg = valErrors[0].message || valErrors[0].msg || "Registration validation failed.";
        } else {
          errMsg = Object.values(valErrors)[0] || "Registration validation failed.";
        }
      } else if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      } else if (!err.response) {
        errMsg = "Cannot connect to server. Check your connection.";
      }
      
      if (err.response) {
        toast.error(errMsg);
      }
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Flush active token and context states, and redirect user to /login.
   */
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    toast.success("Signed out successfully.");
    navigate("/login");
  };

  // Compile context bundle values
  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom React hook to consume authorization context values easily.
 * 
 * @returns {object} Auth Context bundle
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
