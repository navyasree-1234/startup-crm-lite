/**
 * Utility functions to format standard and consistent API responses
 * for the Startup CRM Lite backend application.
 */

/**
 * Sends a structured success response.
 * 
 * @param {object} res - Express response object
 * @param {*} data - Payload to send in the response
 * @param {string} message - Descriptive success message
 * @param {number} [statusCode=200] - HTTP status code
 * @returns {object} Express JSON response
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a structured error response.
 * 
 * @param {object} res - Express response object
 * @param {string} message - Descriptive error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {object|null} [errors=null] - Specific validation errors or details
 * @returns {object} Express JSON response
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Sends a structured paginated list response.
 * 
 * @param {object} res - Express response object
 * @param {Array} data - The array of items for the current page
 * @param {number} total - The total count of matching items in the database
 * @param {number} page - The current page index (1-based)
 * @param {number} limit - The limit of items per page
 * @returns {object} Express JSON response
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  const totalItems = Number(total) || 0;
  const currentPage = Number(page) || 1;
  const limitPerPage = Number(limit) || 10;
  const totalPages = Math.ceil(totalItems / limitPerPage);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total: totalItems,
      page: currentPage,
      limit: limitPerPage,
      pages: totalPages,
      hasNext,
      hasPrev,
    },
  });
};
