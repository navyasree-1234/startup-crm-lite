// Import standard React APIs for dynamic imports (lazy) and async boundary loading wrapper (Suspense)
import { lazy, Suspense } from "react";

// Import key React Router DOM v6 components: Routes container and individual Route mapping component
import { Routes, Route } from "react-router-dom";

// Declare Dashboard component through React.lazy to enable dynamic chunk division and load it on-demand for path '/'
const Dashboard = lazy(() => import("../pages/Dashboard"));

// Declare Leads component through React.lazy to enable dynamic chunk division and load it on-demand for path '/leads'
const Leads = lazy(() => import("../pages/Leads"));

// Declare Analytics component through React.lazy to enable dynamic chunk division and load it on-demand for path '/analytics'
const Analytics = lazy(() => import("../pages/Analytics"));

// Declare NotFound component through React.lazy to load the 404 page dynamically for all unmatched URL pathways
const NotFound = lazy(() => import("../pages/NotFound"));

/**
 * LoadingFallback component represents the loading spinner.
 * It is rendered during transition states while the React bundle splits are fetched.
 */
function LoadingFallback() {
  return (
    // Centered flex layout wrapper to occupy 60% of the viewport height during lazy component transitions
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-6">
      {/* Container to stack the animation elements relatively */}
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing circle representing primary theme color with opacity */}
        <div className="absolute w-16 h-16 rounded-full border-4 border-primary/10 border-t-primary/40 animate-ping"></div>
        {/* Inner high-speed spinning indicator representing primary theme color */}
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
      {/* End relative spinner stack wrapper */}
      </div>
      {/* Text label underneath the loader showing an active state change to the user */}
      <p className="mt-4 text-sm font-medium text-text-gray animate-pulse tracking-wide">
        Loading view... Please wait
      </p>
    {/* End main centering flex wrapper */}
    </div>
  );
}

/**
 * AppRoutes component aggregates all the individual page paths.
 * It wraps them in React.Suspense so lazy-loaded page modules are loaded seamlessly.
 */
function AppRoutes() {
  return (
    // React Suspense wraps the routes and provides the LoadingFallback component when resources are being fetched
    <Suspense fallback={<LoadingFallback />}>
      {/* Routes is the React Router v6 container that evaluates active locations and chooses matching routes */}
      <Routes>
        {/* Exact path match mapping root url '/' to lazy loaded CRM Dashboard page */}
        <Route path="/" element={<Dashboard />} />

        {/* Path match mapping '/leads' to lazy loaded Leads Management table page */}
        <Route path="/leads" element={<Leads />} />

        {/* Path match mapping '/analytics' to lazy loaded CRM Analytics metrics page */}
        <Route path="/analytics" element={<Analytics />} />

        {/* Wildcard path match mapping all remaining unmatched URLs to lazy loaded 404 page */}
        <Route path="*" element={<NotFound />} />
      {/* End Routes matching container */}
      </Routes>
    {/* End Suspense container */}
    </Suspense>
  );
}

// Export the AppRoutes component as standard default to plug into App layout
export default AppRoutes;

