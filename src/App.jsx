// Import React library for JSX structure and component rendering
import React from "react";

// Import BrowserRouter from react-router-dom to enable routing capabilities across the app
import { BrowserRouter } from "react-router-dom";

// Import the Navbar component which acts as our responsive sidebar navigation
import Navbar from "./components/common/Navbar";

// Import the AppRoutes component which defines all our lazy loaded routes
import AppRoutes from "./routes";

// Import LeadProvider to provide core lead/activity context state across all pages
import { LeadProvider } from "./context/LeadContext";

// App component is the root element representing the base layout of Startup CRM Lite
function App() {
  return (
    // Wrap entire layout in LeadProvider and BrowserRouter so context and routing are available globally
    <LeadProvider>
      <BrowserRouter>
        {/* Outer flex container setting up split screen layout with light grey background */}
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-roboto text-slate-800">
          
          {/* Render the sidebar Navbar component on the left side of screen */}
          <Navbar />

          {/* Main content wrapper stretching across available space and handling vertical scrolling */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            
            {/* Scrollable page container area with standard padding */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 md:p-8">
              
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
  );
}

// Export the App component as the default export of this file
export default App;