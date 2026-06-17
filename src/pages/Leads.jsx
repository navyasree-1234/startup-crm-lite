import React, { useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
// Import Context to hook into state operations
import { LeadContext } from "../context/LeadContext";
// Import Lucide React icons for buttons, headers, search, and view toggling
import { Plus, Search, Filter, LayoutGrid, Table, Info } from "lucide-react";
// Import Custom Components
import StatusBadge from "../components/leads/StatusBadge";
import LeadForm from "../components/leads/LeadForm";
import LeadCard from "../components/leads/LeadCard";
import LeadTable from "../components/leads/LeadTable";

/**
 * Leads component provides the main CRM workspace where managers can search,
 * filter, add, edit, or delete lead entries. It orchestrates card and table layout modes.
 */
function Leads() {
  // Extract leads and CRUD operation handlers from Context provider
  const { leads, addLead, updateLead, deleteLead } = useContext(LeadContext);

  // Layout View Mode state ('card' | 'table') - defaults to table for desktop layout
  const [viewMode, setViewMode] = useState("table");

  // Modal display toggling state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Selected lead state for edit mode (null when creating a new lead)
  const [selectedLead, setSelectedLead] = useState(null);

  // Search input state value
  const [searchTerm, setSearchTerm] = useState("");

  // Filter selection state value (default to "All" stages)
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter selection state value for Lead Source (default to "All" sources)
  const [sourceFilter, setSourceFilter] = useState("All");

  // Form submission handler inside the modal (works for both CREATE and UPDATE)
  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      // Edit mode: update existing lead record
      updateLead(selectedLead.id, formData);
      toast.success("Lead updated successfully!", {
        style: {
          border: "1px solid #10B981",
          padding: "16px",
          color: "#065F46",
          fontWeight: "600",
        },
        iconTheme: {
          primary: "#10B981",
          secondary: "#FFFFFF",
        },
      });
    } else {
      // Create mode: add new lead record
      addLead(formData);
      toast.success("Lead created successfully!", {
        style: {
          border: "1px solid #10B981",
          padding: "16px",
          color: "#065F46",
          fontWeight: "600",
        },
        iconTheme: {
          primary: "#10B981",
          secondary: "#FFFFFF",
        },
      });
    }
    handleCloseModal();
  };

  // Delete handler with toast notification
  const handleDeleteLead = (leadId) => {
    // Show a confirmation dialog (optional, but standard best practice)
    if (window.confirm("Are you sure you want to delete this lead?")) {
      deleteLead(leadId);
      toast.error("Lead deleted successfully.", {
        style: {
          border: "1px solid #EF4444",
          padding: "16px",
          color: "#991B1B",
          fontWeight: "600",
        },
        iconTheme: {
          primary: "#EF4444",
          secondary: "#FFFFFF",
        },
      });
    }
  };

  // Open modal for Create Mode
  const handleAddClick = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit Mode
  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  // Close modal and clean up selection state
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  // Filter leads based on active search terms, status tabs, and source selections
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "All" || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification Container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Title Header area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leads Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track, configure, and manage active startup clients in your pipeline.
          </p>
        </div>

        {/* Trigger to open form modal */}
        <button
          onClick={handleAddClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-blue-500/10 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Filter Toolbar Panel */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Search box input wrapper */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, company, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Pipeline Status Filter Selection Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50/50 px-3 py-1 border border-slate-200 rounded-xl">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1.5 text-xs font-semibold text-slate-700 focus:outline-none bg-transparent cursor-pointer"
              >
                <option value="All">All Pipeline Stages</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Meeting Scheduled">Meeting Scheduled</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {/* Lead Source Filter Selection Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50/50 px-3 py-1 border border-slate-200 rounded-xl">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="py-1.5 text-xs font-semibold text-slate-700 focus:outline-none bg-transparent cursor-pointer"
              >
                <option value="All">All Lead Sources</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Layout View Toggle buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/40">
              <button
                onClick={() => setViewMode("card")}
                className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  viewMode === "card"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-750"
                }`}
                title="Card Grid View"
                aria-label="Switch to Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-750"
                }`}
                title="Table List View"
                aria-label="Switch to Table List View"
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main content display section */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-semibold text-slate-600">No leads found</p>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your query string filters or add a new lead entry.
          </p>
        </div>
      ) : (
        <>
          {/* Card View Layout */}
          {viewMode === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteLead}
                />
              ))}
            </div>
          )}

          {/* Table View Layout (Responsive: table on desktop, cards on mobile) */}
          {viewMode === "table" && (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <LeadTable
                  leads={filteredLeads}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteLead}
                />
              </div>

              {/* Mobile Card Stack View */}
              <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteLead}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Lead Form Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Form container body */}
          <div className="relative bg-white w-full max-w-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3
              id="modal-title"
              className="text-xl font-bold text-slate-800 mb-5 pb-3 border-b border-slate-50"
            >
              {selectedLead ? "Edit Lead Details" : "Add New CRM Lead"}
            </h3>

            <LeadForm
              initialData={selectedLead}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Leads;