import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Lead Schema for Startup CRM Lite
 * Represents a prospective customer or business lead tracked by a CRM user.
 */
const leadSchema = new Schema(
  {
    /**
     * Full name of the lead contact person.
     * Required, trimmed, minimum 2 characters, maximum 100 characters.
     */
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
      minlength: [2, "Lead name must be at least 2 characters"],
      maxlength: [100, "Lead name cannot exceed 100 characters"],
    },
    /**
     * Name of the company the lead is associated with.
     * Required, trimmed.
     */
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    /**
     * Contact email address of the lead.
     * Required, trimmed, validated against standard email regex format.
     */
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      validate: {
        validator: function (v) {
          // Standard RFC 5322 compliant regex for email validation
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: "Email must be a valid email address",
      },
    },
    /**
     * Phone number of the lead.
     * Optional, trimmed.
     */
    phone: {
      type: String,
      trim: true,
    },
    /**
     * Current status of the lead in the pipeline.
     * Enum matching frontend state: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'].
     * Defaults to 'New'.
     */
    status: {
      type: String,
      enum: {
        values: ["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"],
        message: "{VALUE} is not a valid status.",
      },
      default: "New",
    },
    /**
     * Source from which the lead was acquired.
     * Enum matching frontend state: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'].
     * Defaults to 'Website'.
     */
    source: {
      type: String,
      enum: {
        values: ["Website", "Referral", "LinkedIn", "Cold Call", "Email Campaign", "Other"],
        message: "{VALUE} is not a valid lead source.",
      },
      default: "Website",
    },
    /**
     * Optional notes or background context about the lead.
     * Maximum length is 1000 characters.
     */
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    /**
     * Estimated deal/pipeline value.
     */
    value: {
      type: Number,
      default: 0,
    },
    /**
     * Reference to the User (ObjectId) who owns/created the lead.
     * Required.
     */
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
  },
  {
    // Auto-generates createdAt and updatedAt fields
    timestamps: true,
    // Ensure virtuals are included when document is converted to JSON or plain object
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// --- Indexes ---

// Compound index on owner and status for fast filtered queries
leadSchema.index({ owner: 1, status: 1 });

// Single field index on email for fast lookups (not unique as same contact might be registered multiple times)
leadSchema.index({ email: 1 });

// Index for sorting and pagination by creation date
leadSchema.index({ owner: 1, createdAt: -1 });

// Index for source filtering within owner workspace
leadSchema.index({ owner: 1, source: 1 });

// Indexes for autocomplete search matching name/company
leadSchema.index({ owner: 1, name: 1 });
leadSchema.index({ owner: 1, company: 1 });

// --- Virtuals ---

/**
 * Virtual Field: age
 * Returns the number of days since the lead was created.
 * Useful for pipeline age analysis and stale lead identification.
 * 
 * @returns {number} Age of the lead in days
 */
leadSchema.virtual("age").get(function () {
  if (!this.createdAt) {
    return 0;
  }
  const diffTime = Date.now() - this.createdAt.getTime();
  // Convert milliseconds to full days
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Export the schema separately for extensibility or embedding
export { leadSchema };

// Export the Mongoose model as default
export const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
