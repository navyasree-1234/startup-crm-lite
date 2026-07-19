
// Import BrowserRouter, useLocation, and routing components from react-router-dom
import { BrowserRouter, useLocation } from "react-router-dom";

// Import global toast styling component
import { Toaster } from "react-hot-toast";

// Import Navbar sidebar navigation
import Navbar from "./components/common/Navbar";

// Import AppRoutes router container
import AppRoutes from "./routes";

// Import providers
import { LeadProvider } from "./context/LeadContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

/**
 * AppContent component handles the layout routing state.
 * Conditionally hides the sidebar Navbar when the user is on /login or /register.
 */
function AppContent() {
  const location = useLocation();
  
  // Identify if we are currently visiting login or registration screens
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  // If on an authentication page, render a clean minimalist card view without navbars
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 font-roboto text-slate-800 dark:text-white transition-colors duration-200">
        <AppRoutes />
      </div>
    );
  }

  // Otherwise, render the standard side-by-side CRM dashboard console frame
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-gray-950 font-roboto text-slate-800 dark:text-white transition-colors duration-200">
      
      {/* Sidebar Navbar */}
      <Navbar />

      {/* Main console content canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 transition-colors duration-200">
          <div className="max-w-7xl mx-auto">
            <AppRoutes />
          </div>
        </main>
      </div>
    </div>
  );
}

// App component is the root element representing the base layout of Startup CRM Lite
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <LeadProvider>
            {/* Render global toaster for notifications on any screen */}
            <Toaster position="top-right" reverseOrder={false} />
            <AppContent />
          </LeadProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;