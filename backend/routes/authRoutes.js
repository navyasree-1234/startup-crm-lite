import express from "express";
import { body } from "express-validator";

// Middleware imports
import protect from "../middleware/auth.js";
import validate from "../middleware/validate.js";

// Controller imports
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * PRODUCTION NOTE:
 * In a production environment, you should apply rate limiting specifically to authentication routes
 * (e.g., /register and /login) to mitigate brute-force and credential stuffing attacks.
 * Example implementation:
 * 
 * import rateLimit from 'express-rate-limit';
 * const authLimiter = rateLimit({
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   max: 5, // Limit each IP to 5 registration/login requests per windowMs
 *   message: 'Too many authentication attempts from this IP, please try again after 15 minutes'
 * });
 * 
 * router.use('/login', authLimiter);
 * router.use('/register', authLimiter);
 */

// --- Validation Schemas ---

const registerValidationRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email must be a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginValidationRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email must be a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required"),
];

// --- Routes Definition ---

// 1. Register a new user
router.post(
  "/register",
  validate(registerValidationRules),
  register
);

// 2. Login existing user
router.post(
  "/login",
  validate(loginValidationRules),
  login
);

// 3. Retrieve currently authenticated user profile
router.get(
  "/profile",
  protect,
  getProfile
);

// 4. Retrieve profile alias (/me)
router.get(
  "/me",
  protect,
  getProfile
);

// 5. Update user profile details
router.put(
  "/profile",
  protect,
  updateProfile
);

export default router;
