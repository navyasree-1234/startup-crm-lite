// Import standard Link component from react-router-dom to enable SPA routing back to home page without hard reloading the browser
import { Link } from "react-router-dom";

// Import Home (home icon layout) and AlertOctagon (alert visual layout) icon components from lucide-react package
import { Home, AlertOctagon } from "lucide-react";

/**
 * NotFound functional component represents the 404 page view.
 * It renders when the user browses to an invalid path that does not match predefined routing entries.
 */
function NotFound() {
  return (
    // Main outer container styled with vertical flex layouts, height parameters, margins, and center alignments
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      
      {/* Relative wrapper container designed for placing soft background gradients behind the alert icon */}
      <div className="relative mb-6">
        
        {/* Decorative red glowing circle with background opacity blur-2xl and scaling factor of 1.5 */}
        <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50 scale-150"></div>
        
        {/* Main icon layout frame featuring gradient background, drop shadows, and rounded visual borders */}
        <div className="relative bg-gradient-to-tr from-red-500 to-rose-500 text-white p-6 rounded-2xl shadow-xl shadow-red-500/20">
          
          {/* Render the AlertOctagon icon styled with bouncing CSS animation and set size */}
          <AlertOctagon className="w-16 h-16 animate-bounce" />
        
        {/* Close tag for gradient icon container */}
        </div>
      
      {/* Close tag for relative wrapper container */}
      </div>

      {/* Renders bold 404 error code layout text */}
      <h1 className="text-8xl font-extrabold tracking-widest text-slate-800">
        404
      </h1>

      {/* Renders descriptive header title text */}
      <h2 className="mt-4 text-2xl font-bold text-slate-800">
        Page Not Found
      </h2>

      {/* Renders secondary instruction description to help the user resolve the issue */}
      <p className="mt-2 text-slate-500 max-w-md mx-auto">
        Sorry, the page you are looking for doesn't exist or has been moved to a new location.
      </p>

      {/* Action wrapper container to position redirect button */}
      <div className="mt-8">
        
        {/* React Router Link element mapping to Dashboard homepage path '/' */}
        <Link
          // Set target path value to Dashboard home page root
          to="/"
          // Component styles including gradients, visual layout, responsive padding, transitions, and hover translation effects
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/10 transition-all duration-200 hover:-translate-y-0.5"
        >
          {/* Render the Home Lucide icon inside the navigation link */}
          <Home className="w-4 h-4" />
          
          {/* Text content inside navigation redirection link */}
          <span>Back to Dashboard</span>
        
        {/* Close tag for the redirection Link */}
        </Link>
      
      {/* Close tag for action wrapper container */}
      </div>
    
    {/* Close tag for main outer container */}
    </div>
  );
}

// Export the NotFound component as default
export default NotFound;
