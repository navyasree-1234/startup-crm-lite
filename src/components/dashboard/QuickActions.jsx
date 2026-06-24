import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, ArrowUpRight, Download, X } from "lucide-react";

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique lead identifier
 * @property {string} name - Lead contact name
 * @property {string} company - Lead company name
 * @property {string} email - Lead email address
 * @property {string} [phone] - Lead phone number
 * @property {number} value - Deal value in USD
 * @property {string} status - Pipeline stage
 * @property {string} source - Source of lead
 * @property {string} createdAt - ISO date string of lead addition
 */

/**
 * @typedef {Object} QuickActionsProps
 * @property {Lead[]} leads - The list of active leads to be exported
 * @property {function(Object): void} onAddLead - Callback invoked when a new lead is saved
 */

/**
 * QuickActions provides administrative shortcut buttons to perform common tasks
 * in the CRM, including adding a new lead via modal, navigating to all leads,
 * and exporting current database listings as a CSV file.
 *
 * @param {QuickActionsProps} props - Component properties
 * @returns {React.JSX.Element} The rendered quick actions widget
 */
function QuickActions({ leads = [], onAddLead }) {
  const [isOpen, setIsOpen] = useState(false);

  // Form Field States
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("New");
  const [source, setSource] = useState("Website");
  const [error, setError] = useState("");

  /**
   * Triggers client-side export of current leads array to a standard CSV file format
   */
  const handleExportData = () => {
    if (!leads || leads.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Define CSV columns
    const headers = ["ID", "Name", "Company", "Email", "Phone", "Deal Value ($)", "Status", "Source", "Date Added"];

    // Format rows, escaping quotes to avoid breaking column divisions
    const rows = leads.map((lead) => [
      lead.id || "",
      `"${(lead.name || "").replace(/"/g, '""')}"`,
      `"${(lead.company || "").replace(/"/g, '""')}"`,
      lead.email || "",
      lead.phone || "",
      lead.value || 0,
      lead.status || "",
      lead.source || "",
      lead.createdAt || "",
    ]);

    // Construct CSV content
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    // Create a secure download blob URL
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Create hidden anchor element and trigger programmatically
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CRM_Leads_Export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Handles creation submission, validates details, and bubbles new object up to parent state
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmitLead = (e) => {
    e.preventDefault();
    setError("");

    // Simple validation checks
    if (!name.trim()) {
      setError("Lead Name is required.");
      return;
    }
    if (!company.trim()) {
      setError("Company Name is required.");
      return;
    }

    // Call callback prop to add the lead to the parent dashboard state
    onAddLead({
      name: name.trim(),
      company: company.trim(),
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, ".")}@${company.trim().toLowerCase().replace(/\s+/g, "")}.com`,
      phone: "+1 (555) 123-4567",
      value: parseFloat(value) || 0,
      status,
      source,
    });

    // Reset local field states
    setName("");
    setCompany("");
    setEmail("");
    setValue("");
    setStatus("New");
    setSource("Website");

    // Close the Modal
    setIsOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm mt-6 transition-colors duration-200">
      {/* Title Header */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-text-dark">Quick Actions</h2>
        <p className="text-xs text-text-gray mt-1 font-medium">
          Perform administrative database actions instantly
        </p>
      </div>

      {/* Button Row layout, stack on small devices, row on md */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Trigger to open Lead addition modal */}
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary/95 text-white rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Lead</span>
        </button>

        {/* Link shortcut navigating to CRM Table */}
        <Link
          to="/leads"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-gray-600 text-slate-700 dark:text-gray-300 rounded-xl text-sm font-semibold border border-slate-200/60 dark:border-gray-600 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>View All Leads</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>

        {/* Client-side CSV generator trigger */}
        <button
          onClick={handleExportData}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-gray-600 text-slate-700 dark:text-gray-300 rounded-xl text-sm font-semibold border border-slate-200/60 dark:border-gray-600 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Modern Dialog Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Backdrop (only useful on desktop/tablet since it's hidden under container on mobile) */}
          <div
            onClick={() => setIsOpen(false)}
            className="hidden md:block absolute inset-0 transition-opacity duration-300"
          />

          {/* Dialog Container: Full-screen on mobile, centered modal with max-w-lg on tablet+ */}
          <div className="relative bg-white dark:bg-gray-800 w-full h-full md:h-auto md:max-w-lg p-6 rounded-none md:rounded-2xl shadow-2xl border-0 md:border border-slate-100 dark:border-gray-700 overflow-y-auto md:overflow-visible animate-in fade-in md:zoom-in-95 duration-200 transition-colors duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-gray-700 pb-3">
              <h3 className="text-lg font-bold text-text-dark">Quick Add Lead</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-3 md:p-1.5 text-slate-400 dark:text-gray-400 hover:text-slate-650 dark:hover:text-white rounded-xl bg-slate-50 dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5.5 h-5.5 md:w-4 md:h-4" />
              </button>
            </div>

            {/* Error banner if validation fails */}
            {error && (
              <div className="mb-4 p-3 bg-danger/10 text-danger border border-danger/20 rounded-xl text-xs font-bold">
                {error}
              </div>
            )}

            {/* Form Panel */}
            <form onSubmit={handleSubmitLead} className="space-y-4">
              {/* Lead Name field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-gray tracking-wider uppercase">
                  Lead Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3.5 py-2.5 text-sm border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 dark:bg-gray-900/50 text-slate-800 dark:text-white font-medium"
                />
              </div>

              {/* Company field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-gray tracking-wider uppercase">
                  Company *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyberdyne Systems"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="px-3.5 py-2.5 text-sm border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 dark:bg-gray-900/50 text-slate-800 dark:text-white font-medium"
                />
              </div>

              {/* Email field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-gray tracking-wider uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. sarah@cyberdyne.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2.5 text-sm border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 dark:bg-gray-900/50 text-slate-800 dark:text-white font-medium"
                />
              </div>

              {/* Deal Value & Status Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-gray tracking-wider uppercase">
                    Deal Value ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 15000"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="px-3.5 py-2.5 text-sm border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 dark:bg-gray-900/50 text-slate-800 dark:text-white font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-gray tracking-wider uppercase">
                    Status Stage
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-3 py-2.5 text-sm border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 dark:bg-gray-900/50 font-semibold text-text-dark dark:text-white"
                  >
                    <option value="New" className="dark:bg-gray-800">New</option>
                    <option value="Contacted" className="dark:bg-gray-800">Contacted</option>
                    <option value="Meeting Scheduled" className="dark:bg-gray-800">Meeting Scheduled</option>
                    <option value="Proposal Sent" className="dark:bg-gray-800">Proposal Sent</option>
                    <option value="Won" className="dark:bg-gray-800">Won</option>
                    <option value="Lost" className="dark:bg-gray-800">Lost</option>
                  </select>
                </div>
              </div>

              {/* Lead Source */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-gray tracking-wider uppercase">
                  Lead Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="px-3 py-2.5 text-sm border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 dark:bg-gray-900/50 font-semibold text-text-dark dark:text-white"
                >
                  <option value="Website" className="dark:bg-gray-800">Website</option>
                  <option value="Referral" className="dark:bg-gray-800">Referral</option>
                  <option value="LinkedIn" className="dark:bg-gray-800">LinkedIn</option>
                  <option value="Cold Call" className="dark:bg-gray-800">Cold Call</option>
                  <option value="Email Campaign" className="dark:bg-gray-800">Email Campaign</option>
                  <option value="Other" className="dark:bg-gray-800">Other</option>
                </select>
              </div>

              {/* Action buttons footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-gray-700 mt-5">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuickActions;
