import React, { useState, useEffect } from "react";

// Standard Option lists matching the requirements
const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Meeting Scheduled",
  "Proposal Sent",
  "Won",
  "Lost",
];

const SOURCE_OPTIONS = [
  "Website",
  "Referral",
  "LinkedIn",
  "Cold Call",
  "Email Campaign",
  "Other",
];

/**
 * LeadForm Component
 * A reusable form for creating or editing leads with validation error states.
 *
 * @param {Object} props
 * @param {Object} [props.initialData] - Existing lead data for edit mode, or undefined for create mode
 * @param {Function} props.onSubmit - Callback function triggered on valid form submission
 * @param {Function} props.onCancel - Callback function triggered on form cancellation
 */
function LeadForm({ initialData, onSubmit, onCancel }) {
  // State variables for form fields
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("New");
  const [source, setSource] = useState("Website");

  // State variables for inline validation error messages
  const [errors, setErrors] = useState({
    name: "",
    company: "",
    email: "",
  });

  // Track if form validation check was triggered
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load initialData when editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCompany(initialData.company || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setValue(initialData.value !== undefined ? initialData.value : "");
      setStatus(initialData.status || "New");
      setSource(initialData.source || "Website");
    } else {
      // Clear values if transitioning back to create mode
      setName("");
      setCompany("");
      setEmail("");
      setPhone("");
      setValue("");
      setStatus("New");
      setSource("Website");
    }
    setErrors({ name: "", company: "", email: "" });
    setIsSubmitted(false);
  }, [initialData]);

  // Handle single field validations
  const validateField = (field, val) => {
    let errMsg = "";
    if (field === "name" && !val.trim()) {
      errMsg = "Lead Name is required";
    } else if (field === "company" && !val.trim()) {
      errMsg = "Company Name is required";
    } else if (field === "email") {
      if (!val.trim()) {
        errMsg = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        errMsg = "Please enter a valid email address";
      }
    }
    setErrors((prev) => ({ ...prev, [field]: errMsg }));
    return errMsg === "";
  };

  // Handle input change and validate dynamically if form has been submitted once
  const handleChange = (field, setter) => (e) => {
    const val = e.target.value;
    setter(val);
    if (isSubmitted) {
      validateField(field, val);
    }
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Validate all required fields
    const isNameValid = validateField("name", name);
    const isCompanyValid = validateField("company", company);
    const isEmailValid = validateField("email", email);

    if (!isNameValid || !isCompanyValid || !isEmailValid) {
      return; // Stop form submission if invalid
    }

    // Submit validated payload
    onSubmit({
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      value: parseFloat(value) || 0,
      status,
      source,
    });
  };

  const isEditMode = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Name field */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="lead-name"
          className="text-xs font-bold text-slate-500 tracking-wider uppercase"
        >
          Lead Name *
        </label>
        <input
          id="lead-name"
          type="text"
          placeholder="e.g. Jane Doe"
          value={name}
          onChange={handleChange("name", setName)}
          className={`px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 bg-slate-50/50 font-medium transition-all ${
            errors.name ? "border-rose-500 bg-rose-50/10" : "border-slate-200"
          }`}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <span id="name-error" className="text-xs text-rose-500 font-semibold mt-0.5">
            {errors.name}
          </span>
        )}
      </div>

      {/* Company field */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="company-name"
          className="text-xs font-bold text-slate-500 tracking-wider uppercase"
        >
          Company Name *
        </label>
        <input
          id="company-name"
          type="text"
          placeholder="e.g. Initech Corp"
          value={company}
          onChange={handleChange("company", setCompany)}
          className={`px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 bg-slate-50/50 font-medium transition-all ${
            errors.company ? "border-rose-500 bg-rose-50/10" : "border-slate-200"
          }`}
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? "company-error" : undefined}
        />
        {errors.company && (
          <span id="company-error" className="text-xs text-rose-500 font-semibold mt-0.5">
            {errors.company}
          </span>
        )}
      </div>

      {/* Email field */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="lead-email"
          className="text-xs font-bold text-slate-500 tracking-wider uppercase"
        >
          Email Address *
        </label>
        <input
          id="lead-email"
          type="email"
          placeholder="e.g. jane@company.com"
          value={email}
          onChange={handleChange("email", setEmail)}
          className={`px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 bg-slate-50/50 font-medium transition-all ${
            errors.email ? "border-rose-500 bg-rose-50/10" : "border-slate-200"
          }`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <span id="email-error" className="text-xs text-rose-500 font-semibold mt-0.5">
            {errors.email}
          </span>
        )}
      </div>

      {/* Phone & Value row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Phone field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="lead-phone"
            className="text-xs font-bold text-slate-500 tracking-wider uppercase"
          >
            Phone Number
          </label>
          <input
            id="lead-phone"
            type="tel"
            placeholder="e.g. +1 (555) 019-2834"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 bg-slate-50/50 font-medium"
          />
        </div>

        {/* Deal Value field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="lead-value"
            className="text-xs font-bold text-slate-500 tracking-wider uppercase"
          >
            Deal Value ($)
          </label>
          <input
            id="lead-value"
            type="number"
            min="0"
            placeholder="e.g. 15000"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 bg-slate-50/50 font-medium"
          />
        </div>
      </div>

      {/* Status & Source row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="lead-status"
            className="text-xs font-bold text-slate-500 tracking-wider uppercase"
          >
            Pipeline Stage
          </label>
          <select
            id="lead-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 bg-slate-50/50 font-semibold text-slate-800 cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Source Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="lead-source"
            className="text-xs font-bold text-slate-500 tracking-wider uppercase"
          >
            Lead Source
          </label>
          <select
            id="lead-source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 bg-slate-50/50 font-semibold text-slate-800 cursor-pointer"
          >
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions buttons footer */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm cursor-pointer shadow-blue-500/10"
        >
          {isEditMode ? "Update Lead" : "Save Lead"}
        </button>
      </div>
    </form>
  );
}

export default LeadForm;
