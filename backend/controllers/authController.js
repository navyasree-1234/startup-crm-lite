import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

/**
 * Helper function to generate JWT for a given User ID.
 * Uses environment variable secret and expiration.
 * 
 * @param {string|object} userId - Database ID of the user
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/**
 * Controller: Register a new CRM user.
 * Checks for existing emails, creates the record, and signs an initial session token.
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "Email already exists", 400);
    }

    // 2. Create new user document (password hashed automatically by pre-save schema hook)
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // 3. Generate JWT
    const token = generateToken(user._id);

    // 4. Return success response (user object will automatically exclude password via its toJSON override)
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Login user account.
 * Validates credentials, verifies status, and returns a session token.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("🔑 [Login Attempt] Email:", email);

    // 1. Find user by email (explicitly select password to compare)
    const user = await User.findOne({ email }).select("+password");
    
    // 2. For security: do not disclose if email vs password is wrong to prevent brute-forcing
    if (!user) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    // 3. Verify that the user account is active
    if (!user.isActive) {
      return errorResponse(res, "Account is deactivated", 403);
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    // 5. Return token and user info
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user, // serialize strips password
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Get currently logged in user's profile.
 * Simply returns the user object attached to the request by the protect middleware.
 */
export const getProfile = async (req, res, next) => {
  try {
    return successResponse(res, req.user, "User profile retrieved successfully", 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Update currently logged in user's profile.
 * Only allows changing the name field. If password change is requested,
 * verifies the old password first.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, oldPassword, newPassword } = req.body;

    // Find the user by ID (explicitly fetch the password for verification)
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // 1. Allow updating name only
    if (name !== undefined) {
      user.name = name;
    }

    // 2. Handle password modification
    if (newPassword) {
      if (!oldPassword) {
        return errorResponse(res, "Please provide old password to set a new password", 400);
      }

      // Check if old password matches
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return errorResponse(res, "Invalid old password", 401);
      }

      // Assigning new password triggers pre-save hook hashing
      user.password = newPassword;
    }

    await user.save();

    // Convert document to JSON object to automatically strip password
    const updatedUser = user.toJSON();

    return successResponse(res, updatedUser, "Profile updated successfully", 200);
  } catch (error) {
    next(error);
  }
};
