import { validationResult } from "express-validator";

/**
 * Higher-order Express middleware to execute validation chains
 * and consistently format any resulting errors.
 * 
 * @param {Array} validations - Array of express-validator check rules
 * @returns {Function} Express middleware function
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validation checks in parallel
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Map validation error arrays to a cleaner format: [{ field, message }]
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  };
};

export default validate;
