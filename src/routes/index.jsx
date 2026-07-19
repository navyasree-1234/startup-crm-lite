// Import standard React APIs for dynamic imports (lazy) and async boundary loading wrapper (Suspense)
import { lazy, Suspense } from "react";

// Import key React Router DOM components
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Import custom hook to check authentication status
import { useAuth } from "../context/AuthContext";

// Declare page components through React.lazy to enable dynamic chunk division
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Leads = lazy(() => import("../pages/Leads"));
const Analytics = lazy(() => import("../pages/Analytics"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const NotFound = lazy(() => import("../pages/NotFound"));

/**
 * ProtectedRoute: Intercepts transitions into protected views.
 * If user token check is pending, renders a spinner. If unauthorized, redirects to /login.
 */
function ProtectedRoute() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full p-6">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-150 dark:border-indigo-950/20 border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

/**
 * LoadingFallback component represents the loading spinner.
 * It is rendered during transition states while the React bundle splits are fetched.
 */
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-6">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-16 h-16 rounded-full border-4 border-indigo-600/10 border-t-indigo-600/40 animate-ping"></div>
        <div className="w-12 h-12 rounded-full border-4 border-indigo-600/20 border-t-indigo-600 animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-gray-400 animate-pulse tracking-wide">
        Loading view... Please wait
      </p>
    </div>
  );
}

/**
 * AppRoutes component aggregates all the individual page paths.
 * It wraps them in React.Suspense so lazy-loaded page modules are loaded seamlessly.
 */
function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
          {/* Exact path match mapping root url '/' to lazy loaded CRM Dashboard page */}
          <Route path="/" element={<Dashboard />} />

          {/* Path match mapping '/leads' to lazy loaded Leads Management table page */}
          <Route path="/leads" element={<Leads />} />

          {/* Path match mapping '/analytics' to lazy loaded CRM Analytics metrics page */}
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        {/* Wildcard path match mapping all remaining unmatched URLs to lazy loaded 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

// Export the AppRoutes component as standard default to plug into App layout
export default AppRoutes;

