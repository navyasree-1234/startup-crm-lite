import { errorResponse } from "../utils/apiResponse.js";

/**
 * Global Express Error Handling Middleware.
 * Catches database, authentication, validation, and execution errors,
 * formatting them consistently for client consumption.
 * 
 * @param {object} err - Error object thrown by Express or middlewares
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";
  let errors = null;

  // Log error stacks inside development console for debugging
  if (process.env.NODE_ENV === "development") {
    console.error("💥 Error handler caught:", err);
  }

  // 1. Mongoose Validation Error (Code 400)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = {};
    // Extract error messages for individual fields
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }

  // 2. Mongoose Cast Error (Invalid Object ID) (Code 404)
  else if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  // 3. MongoDB Duplicate Key (Code 11000) (Code 409)
  else if (err.code === 11000) {
    statusCode = 409;
    message = "Email already exists"; // Default message per specification
    const duplicatedField = Object.keys(err.keyValue || {})[0];
    errors = {
      [duplicatedField]: `${duplicatedField.charAt(0).toUpperCase() + duplicatedField.slice(1)} already exists.`,
    };
  }

  // 4. JWT invalid signature error (Code 401)
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please authenticate again.";
  }

  // 5. JWT token expired error (Code 401)
  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired. Please log in again.";
  }

  // 6. CORS origin rejection (Code 403)
  else if (err.message === "Not allowed by CORS") {
    statusCode = 403;
    message = "Origin not allowed by CORS policy";
  }

  // Build client payload format.
  // Never expose stack trace in production environments to maintain security hygiene.
  const isDev = process.env.NODE_ENV === "development";
  
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(isDev && { stack: err.stack }),
  });
};

export default errorHandler;
