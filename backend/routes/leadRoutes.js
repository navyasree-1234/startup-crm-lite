import express from "express";
import { body } from "express-validator";

// Middleware imports
import protect from "../middleware/auth.js";
import validate from "../middleware/validate.js";

// Controller imports
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeadsAutocomplete,
} from "../controllers/leadController.js";

const router = express.Router();

// Apply authentication protection to ALL endpoints in this router
router.use(protect);

// --- Validation Schemas ---

const leadValidationRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Lead name is required")
    .isLength({ min: 2 }).withMessage("Lead name must be at least 2 characters"),
  body("company")
    .trim()
    .notEmpty().withMessage("Company name is required"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email must be a valid email address"),
  body("status")
    .optional()
    .isIn(["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"])
    .withMessage("Invalid status value. Allowed: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost"),
  body("source")
    .optional()
    .isIn(["Website", "Referral", "LinkedIn", "Cold Call", "Email Campaign", "Other"])
    .withMessage("Invalid source value. Allowed: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other"),
  body("value")
    .optional()
    .isNumeric().withMessage("Value must be a number"),
];

const leadUpdateValidationRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage("Lead name must be at least 2 characters"),
  body("company")
    .optional()
    .trim()
    .notEmpty().withMessage("Company name cannot be empty"),
  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Email must be a valid email address"),
  body("status")
    .optional()
    .isIn(["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"])
    .withMessage("Invalid status value. Allowed: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost"),
  body("source")
    .optional()
    .isIn(["Website", "Referral", "LinkedIn", "Cold Call", "Email Campaign", "Other"])
    .withMessage("Invalid source value. Allowed: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other"),
  body("value")
    .optional()
    .isNumeric().withMessage("Value must be a number"),
];

// --- Routes Definition ---

// 1. Get all leads (with filters, pagination, searching)
router.get("/", getLeads);

// 2. Create a new lead
router.post("/", validate(leadValidationRules), createLead);

// 3. Get overall pipeline stats (MUST be defined before /:id)
router.get("/stats", getLeadStats);
router.get("/stats/summary", getLeadStats);

// 4. Get monthly aggregation stats for analytics chart (MUST be defined before /:id)
router.get("/monthly-stats", getMonthlyStats);
router.get("/stats/monthly", getMonthlyStats);

// 5. Autocomplete search leads (MUST be defined before /:id)
router.get("/search", searchLeadsAutocomplete);

// 6. Get a specific lead details
router.get("/:id", getLeadById);

// 6. Update lead attributes
router.put("/:id", validate(leadUpdateValidationRules), updateLead);

// 7. Update status only
router.patch("/:id/status", updateLeadStatus);

// 8. Delete a lead
router.delete("/:id", deleteLead);

export default router;
