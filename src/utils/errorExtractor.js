/**
 * Utility to extract user-friendly error messages from Axios and HTTP response objects.
 * Handles different error categories:
 * 1. Wrong credentials (401)
 * 2. Backend unavailable / offline (Network Error / CORS)
 * 3. Database connection/query failure (500 Server Error)
 * 4. CORS configuration failure
 * 5. Invalid API endpoint (404)
 * 6. Unexpected server error
 */
export const extractErrorMessage = (error, fallbackMessage = "An unexpected error occurred.") => {
  if (!error) {
    return fallbackMessage;
  }

  // 1. If we received a response from the backend
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    // Check if express-validator returns validation arrays
    if (data?.errors) {
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors[0].message || data.errors[0].msg || "Validation error.";
      }
      if (typeof data.errors === "object") {
        const values = Object.values(data.errors);
        if (values.length > 0) return values[0];
      }
    }

    if (data?.message) {
      return data.message;
    }

    switch (status) {
      case 400:
        return "Bad request. Please verify your submitted information.";
      case 401:
        return "Invalid email or password.";
      case 403:
        return "Access forbidden. Your account may be deactivated.";
      case 404:
        return "Requested resource or API endpoint not found.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Unexpected server error. The database or server might be experiencing issues.";
      case 502:
      case 503:
      case 504:
        return "Server is temporarily unavailable or gateway timed out.";
      default:
        return `Server returned error status ${status}.`;
    }
  }

  // 2. If the request was made but no response was received (Network or CORS failure)
  if (error.request) {
    // In Axios, network/CORS issues manifest here with no error.response
    return "Cannot connect to server. Check your connection. This might be due to the backend being offline, a network disruption, or a CORS policy blocking the request.";
  }

  // 3. Fallback for client setup errors or unexpected issues
  return error.message || fallbackMessage;
};

export default extractErrorMessage;
