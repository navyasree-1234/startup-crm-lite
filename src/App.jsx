
// Import BrowserRouter from react-router-dom to enable routing capabilities across the app
import { BrowserRouter } from "react-router-dom";

// Import the Navbar component which acts as our responsive sidebar navigation
import Navbar from "./components/common/Navbar";

// Import the AppRoutes component which defines all our lazy loaded routes
import AppRoutes from "./routes";

// Import LeadProvider to provide core lead/activity context state across all pages
import { LeadProvider } from "./context/LeadContext";

// Import ThemeProvider for dark mode context
import { ThemeProvider } from "./context/ThemeContext";

// App component is the root element representing the base layout of Startup CRM Lite
function App() {
  return (
    // Wrap entire layout in ThemeProvider, LeadProvider and BrowserRouter so theme, context and routing are available globally
    <ThemeProvider>
      <LeadProvider>
        <BrowserRouter>
          {/* Outer flex container setting up split screen layout with light grey background */}
          <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-gray-950 font-roboto text-slate-800 dark:text-white transition-colors duration-200">
            
            {/* Render the sidebar Navbar component on the left side of screen */}
            <Navbar />

            {/* Main content wrapper stretching across available space and handling vertical scrolling */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              
              {/* Scrollable page container area with standard padding */}
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 transition-colors duration-200">
                
                {/* Limit maximum width of the content for cleaner premium desktop readability */}
                <div className="max-w-7xl mx-auto">
                  {/* AppRoutes acts as the route outlet, loading lazy pages inside Suspense fallbacks */}
                  <AppRoutes />
                </div>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </LeadProvider>
    </ThemeProvider>
  );
}

// Export the App component as the default export of this file
export default App;