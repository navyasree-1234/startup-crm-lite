import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Express Middleware to protect routes using JWT authentication.
 * Resolves the 'Bearer <token>' token from the Authorization header,
 * verifies it, and attaches the corresponding User document to req.user.
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If token is missing, reject
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, access denied",
      });
    }

    // 2. Verify token signature
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Differentiate token expiration from general token invalidation
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired, please login again",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    // 3. Find active user belonging to the token (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User belonging to this token no longer exists",
      });
    }

    // 4. Attach user to request object and proceed
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
export default protect;
