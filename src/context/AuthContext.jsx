import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService.js";
import toast from "react-hot-toast";
import { extractErrorMessage } from "../utils/errorExtractor.js";

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
      const errMsg = extractErrorMessage(err, "Invalid email or password.");
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
      const errMsg = extractErrorMessage(err, "Registration failed.");
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

  /**
   * Clears the current user's session and redirects to login with account switch query option.
   */
  const switchUser = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    toast.success("Session cleared. Please sign in with another account.");
    navigate("/login?switch=true");
  };

  // Compile context bundle values
  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    switchUser,
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
