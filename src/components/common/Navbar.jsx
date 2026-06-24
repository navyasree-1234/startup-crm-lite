// Import standard React useState hook to manage mobile sidebar toggles (open/close states)
import { useState } from "react";

// Import NavLink (for navigation with active route highlights) and Link (for standard path redirection)
import { NavLink, Link } from "react-router-dom";

// Import visual Lucide icon components representing dashboard metrics, lead users, analytics bars, hamburger menus, exit icons, and branding landmark
import { LayoutDashboard, Users, BarChart3, Menu, X, Landmark } from "lucide-react";

// Import DarkModeToggle component
import DarkModeToggle from "./DarkModeToggle";

/**
 * Navbar component represents the Sidebar navigation on desktop/tablet viewports
 * and a sticky bottom navigation bar with a sliding settings drawer on mobile viewports.
 */
function Navbar() {
  // Define a state variable 'isOpen' initialized to false to determine if the mobile menu drawer is currently open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Declare an array of navigation configuration items mapping the path routes, display labels, sub-labels, and Lucide components
  const navItems = [
    { path: "/", label: "Dashboard", subLabel: "Overview & key stats", icon: LayoutDashboard },
    { path: "/leads", label: "Leads Management", subLabel: "Track and close deals", icon: Users },
    { path: "/analytics", label: "Analytics", subLabel: "Visual reports & trends", icon: BarChart3 },
  ];

  /**
   * Helper function getNavLinkClass determines styling dynamic classes for NavLink.
   */
  const getNavLinkClass = ({ isActive }) => {
    return [
      "flex items-start lg:items-start gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-left w-full",
      isActive
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 translate-x-1"
        : "text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1"
    ].join(" ");
  };

  return (
    <>
      {/* MOBILE TOP HEADER: Only visible on screens below md */}
      <header className="md:hidden flex items-center justify-between w-full bg-white dark:bg-gray-800 border-b border-slate-100 dark:border-gray-700 px-6 py-4 sticky top-0 z-40 shadow-sm transition-colors duration-200">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-800 dark:text-white">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg text-white">
            <Landmark className="w-5 h-5" />
          </div>
          <span>CRM<span className="text-blue-600 font-extrabold">Lite</span></span>
        </Link>
        <DarkModeToggle />
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR: Only visible on screens below md */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-slate-200 dark:border-gray-700 flex items-center justify-around px-2 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-colors duration-200">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 font-bold scale-110"
                    : "text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white"
                }`
              }
              aria-label={item.label}
            >
              <IconComponent className="w-5.5 h-5.5" />
            </NavLink>
          );
        })}
        {/* Hamburger Menu Item to open drawer */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-all duration-300 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>
      </nav>

      {/* MOBILE DRAWER OVERLAY: Slide-in overlay drawer triggered by bottom menu button */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
        />

        <aside
          className={`absolute top-0 right-0 bottom-0 w-72 bg-white dark:bg-gray-800 px-6 py-8 flex flex-col justify-between shadow-2xl transition-transform duration-300 transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-white">Menu Options</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-3 text-slate-400 dark:text-gray-300 hover:text-slate-650 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            <div className="border-t border-slate-100 dark:border-gray-700 my-1" />

            {/* Quick Links inside drawer */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider text-left">Quick Navigation</span>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={getNavLinkClass}
                  >
                    <IconComponent className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-sm leading-snug">{item.label}</span>
                      <span className="text-[10px] text-slate-400 dark:text-gray-500 leading-normal mt-0.5">{item.subLabel}</span>
                    </div>
                  </NavLink>
                );
              })}
            </div>

            <div className="border-t border-slate-100 dark:border-gray-700 my-1" />

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider text-left">Preferences</span>
              <div className="flex items-center justify-between bg-slate-50 dark:bg-gray-900/50 p-4 rounded-xl border border-slate-100 dark:border-gray-750">
                <span className="text-sm font-semibold text-slate-700 dark:text-gray-300">Dark Mode</span>
                <DarkModeToggle />
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-slate-100 dark:border-gray-700 pt-4 text-left">
            <p className="font-bold text-slate-700 dark:text-gray-300 text-sm">CRM Lite Admin</p>
            <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-1">&copy; 2026 Startup CRM Lite Inc.</p>
          </div>
        </aside>
      </div>

      {/* DESKTOP/TABLET SIDEBAR: Persistent, widths adjust between md (tablet) and lg/xl (desktop) */}
      <aside className="hidden md:flex flex-col justify-between w-60 lg:w-76 xl:w-80 min-h-screen bg-white dark:bg-gray-800 border-r border-slate-100 dark:border-gray-700 sticky top-0 px-4 lg:px-6 py-8 shrink-0 shadow-sm z-20 transition-colors duration-200">
        <div className="flex flex-col gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg lg:text-xl tracking-tight text-slate-800 dark:text-white px-2">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-blue-500/10">
              <Landmark className="w-5 h-5" />
            </div>
            <span>CRM<span className="text-blue-600 font-extrabold">Lite</span></span>
          </Link>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={getNavLinkClass}
                >
                  <IconComponent className="w-5 h-5 mt-0.5 lg:mt-1 shrink-0" />
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-sm lg:text-base leading-snug">{item.label}</span>
                    <span className="hidden lg:block text-xs text-slate-400 dark:text-gray-500 mt-0.5 leading-normal transition-colors duration-200">
                      {item.subLabel}
                    </span>
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info panel at the bottom of the sidebar */}
        <div className="border-t border-slate-100 dark:border-gray-700 pt-6 px-2 text-xs text-slate-400 dark:text-gray-500 text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">Theme</span>
            <DarkModeToggle />
          </div>
          <p className="font-semibold text-slate-500 dark:text-gray-400 mb-1">CRM Lite Admin</p>
          <p>&copy; 2026 Startup CRM Lite</p>
        </div>
      </aside>
    </>
  );
}

export default Navbar;