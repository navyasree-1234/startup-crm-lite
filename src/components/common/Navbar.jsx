// Import standard React useState hook to manage mobile sidebar toggles (open/close states)
import { useState } from "react";

// Import NavLink (for navigation with active route highlights) and Link (for standard path redirection)
import { NavLink, Link } from "react-router-dom";

// Import visual Lucide icon components representing dashboard metrics, lead users, analytics bars, hamburger menus, exit icons, and branding landmark
import { LayoutDashboard, Users, BarChart3, Menu, X, Landmark } from "lucide-react";

/**
 * Navbar component represents the Sidebar navigation on desktop viewports
 * and a sliding overlay navigation drawer on mobile viewports.
 */
function Navbar() {
  // Define a state variable 'isOpen' initialized to false to determine if the mobile menu drawer is currently open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Declare an array of navigation configuration items mapping the path routes, display labels, and Lucide React components
  const navItems = [
    // Dashboard landing page route config pointing to root URL '/' with LayoutDashboard icon
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    // Lead Management workspace route config pointing to path '/leads' with Users icon
    { path: "/leads", label: "Leads Management", icon: Users },
    // CRM metrics Analytics page route config pointing to path '/analytics' with BarChart3 icon
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  /**
   * Helper function getNavLinkClass determines styling dynamic classes for NavLink.
   * It takes a destructured 'isActive' state provided automatically by react-router-dom's NavLink.
   */
  const getNavLinkClass = ({ isActive }) => {
    // Return a combined space-separated list of Tailwind CSS styles
    return [
      // Align items horizontally with centered items, set consistent margins, text padding, and rounded custom corners
      "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300",
      // If the link is active, apply a gradient background of blue-600 to indigo-600, white text color, and a drop shadow
      isActive
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 translate-x-1"
        : // If the link is inactive, display light slate gray text and shift the link layout slightly right on hover actions
          "text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:translate-x-1"
    ].join(" "); // Combine the list array into a single space-delimited string
  }; // End getNavLinkClass helper function

  return (
    // React fragment parent container grouping desktop sidebar and mobile header structures
    <>
      {/* MOBILE HEADER: Visually displayed only on screens smaller than md (medium) breakpoints */}
      <header className="md:hidden flex items-center justify-between w-full bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-40 shadow-sm">
        {/* Navigation Link wrapper wrapping logo image and brand identity, routing back to main page '/' */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-800">
          {/* Logo container wrapper styled with dynamic gradient gradients and white graphic fill */}
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg text-white">
            {/* Render the Landmark Lucide icon */}
            <Landmark className="w-5 h-5" />
          {/* End logo container wrapper */}
          </div>
          {/* Visual text representing CRM logo brand layout */}
          <span>CRM<span className="text-blue-600 font-extrabold">Lite</span></span>
        {/* End Link branding wrapper */}
        </Link>

        {/* Button to toggle the open/close state of the mobile side menu */}
        <button
          // Click handler flips the local boolean value state of isOpen to hide/reveal the side drawer drawer
          onClick={() => setIsOpen(!isOpen)}
          // Styling including padding, rounded corners, bg color states, active focus outlines, and color transition animations
          className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 focus:outline-none transition-colors"
          // Set accessibility label for visually impaired browser readers
          aria-label="Toggle menu"
        >
          {/* If isOpen is true, render X close icon component, otherwise render standard hamburger Menu icon component */}
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        {/* End button container */}
        </button>
      {/* End mobile header wrapper */}
      </header>

      {/* MOBILE DRAWER NAVIGATION: Overlay slide-in drawer layout hidden by default on desktop viewports */}
      <div
        // Container dynamic classes: absolute positions, z-indexes, transition animations, and opacity controls based on state
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Semi-transparent dark overlay background to dim the main application view when sidebar is open */}
        <div
          // Click handler closes the mobile drawer when clicking on the blurred overlay background backdrop
          onClick={() => setIsOpen(false)}
          // Styling classes for overlay viewport positioning and blur filtering effects
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        ></div>

        {/* Aside drawer layout body sliding in from the left hand side of the display screen */}
        <aside
          // Dynamic translation animation classes mapping isOpen states to shift the navbar drawer on/off screen
          className={`absolute top-0 left-0 bottom-0 w-72 bg-white px-6 py-8 flex flex-col justify-between shadow-2xl transition-transform duration-300 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Content wrapper splitting branding title and lists from footer copyright details */}
          <div className="flex flex-col gap-8">
            {/* Header section of the drawer housing brand logo and the close button */}
            <div className="flex items-center justify-between">
              {/* Branding link for logo redirection inside the drawer */}
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-800">
                {/* Logo wrapper frame with blue-to-indigo gradient color */}
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg text-white">
                  {/* Landmark icon component representation */}
                  <Landmark className="w-5 h-5" />
                {/* End logo wrapper frame */}
                </div>
                {/* Visual text branding title logo inside drawer list */}
                <span>CRM<span className="text-blue-600 font-extrabold">Lite</span></span>
              {/* End brand logo Link */}
              </Link>
              {/* Button to manually dismiss and close the sidebar navigation panel */}
              <button
                // Click handler triggers update resetting isOpen status to false
                onClick={() => setIsOpen(false)}
                // Styling wrapper class for button visual hover colors
                className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100"
              >
                {/* Close X icon representation */}
                <X className="w-5 h-5" />
              {/* End button wrapper */}
              </button>
            {/* End header section container */}
            </div>

            {/* Navigation container element housing all page NavLinks inside mobile menu */}
            <nav className="flex flex-col gap-2">
              {/* Loop through each route navigation config item in the navItems array */}
              {navItems.map((item) => {
                // Assign local variable to represent the Lucide Icon component class mapping
                const IconComponent = item.icon;
                return (
                  // NavLink element with browser routes and custom styling hook
                  <NavLink
                    // Unique mapping key set to the navigation path route
                    key={item.path}
                    // URL endpoint mapping link to the router config
                    to={item.path}
                    // Click handler closes the mobile drawer view on navigating to the target screen
                    onClick={() => setIsOpen(false)}
                    // Dynamic active state style calculator function
                    className={getNavLinkClass}
                  >
                    {/* Render matching visual icon component */}
                    <IconComponent className="w-5 h-5" />
                    {/* Render visual navigation item label text */}
                    <span>{item.label}</span>
                  {/* End NavLink element */}
                  </NavLink>
                );
              // End map loop parameter function
              })}
            {/* End navigation tag container */}
            </nav>
          {/* End content wrapper container */}
          </div>

          {/* Copyright section displayed at the bottom of mobile sidebar */}
          <div className="border-t border-slate-100 pt-4 text-xs text-slate-400">
            &copy; 2026 CRM Lite Inc.
          {/* End copyright footer frame */}
          </div>
        {/* End mobile aside sidebar layout body */}
        </aside>
      {/* End mobile drawer navigation wrapper */}
      </div>

      {/* DESKTOP SIDEBAR: Stays static and sticky on screens equal to or wider than md (medium) breakpoint */}
      <aside className="hidden md:flex flex-col justify-between w-64 min-h-screen bg-white border-r border-slate-100 sticky top-0 px-6 py-8 shrink-0 shadow-sm z-20">
        {/* Upper layout area grouping logo branding and main page links list */}
        <div className="flex flex-col gap-8">
          {/* Main logo branding Link layout routing back to '/' */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-800 px-2">
            {/* Logo container wrapper styled with dynamic gradient fill */}
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-blue-500/10">
              {/* Landmark icon component representation */}
              <Landmark className="w-5 h-5" />
            {/* End logo container */}
            </div>
            {/* Logo title visual representation styling */}
            <span>CRM<span className="text-blue-600 font-extrabold">Lite</span></span>
          {/* End brand logo Link */}
          </Link>

          {/* Desktop Navigation Links List wrapping NavLinks */}
          <nav className="flex flex-col gap-2">
            {/* Loop through each navigation route configs mapped inside navItems */}
            {navItems.map((item) => {
              // Extract matching Lucide component class
              const IconComponent = item.icon;
              return (
                // NavLink automatically checks router path to evaluate isActive dynamic class
                <NavLink
                  // Unique mapping key set to target URL link path
                  key={item.path}
                  // Target URL routing path value
                  to={item.path}
                  // Styling class hook evaluator function
                  className={getNavLinkClass}
                >
                  {/* Dynamic icon graphic render */}
                  <IconComponent className="w-5 h-5" />
                  {/* Dynamic page text label output */}
                  <span>{item.label}</span>
                {/* End NavLink component */}
                </NavLink>
              );
            // End map loop parameter function
            })}
          {/* End navigation bar layout */}
          </nav>
        {/* End upper content division container */}
        </div>

        {/* Footer info panel displayed at the bottom of the sidebar */}
        <div className="border-t border-slate-100 pt-6 px-2 text-xs text-slate-400">
          {/* CRM current role type info display */}
          <p className="font-semibold text-slate-500 mb-1">CRM Lite Admin</p>
          {/* Copyright description string */}
          <p>&copy; 2026 Startup CRM Lite</p>
        {/* End footer layout division */}
        </div>
      {/* End static desktop aside sidebar */}
      </aside>
    </>
  );
}

// Export the Navbar component as standard default
export default Navbar;