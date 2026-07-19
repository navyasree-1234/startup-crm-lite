import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import mongoose from "mongoose";

// Configuration & Middlewares
import connectDB from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

// Load Environment Variables
dotenv.config();

/**
 * Validate that all required environment variables are present on startup.
 * If any are missing, logs the missing keys and terminates the process with code 1.
 */
const checkRequiredEnvVars = () => {
  const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET", "PORT"];
  const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingEnvVars.length > 0) {
    console.error(`❌ Critical Startup Error: Missing required environment variables: ${missingEnvVars.join(", ")}`);
    process.exit(1);
  }
  console.log("✅ Environment variables validation passed.");
};

// Verify required configuration before doing anything else
checkRequiredEnvVars();

const app = express();

// --- Express Configuration & Middlewares ---

// 1. Helmet to secure Express apps by setting various HTTP headers
app.use(helmet());

// 2. Request logging configuration based on environment type
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// 3. CORS configuration with dynamic checking for production and local environments
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://your-app.vercel.app",
  "http://localhost:5173" // Fallback local development port
].filter(Boolean); // Clean any undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server requests)
      // Also allow any localhost/127.0.0.1 port in development/local environments
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// 4. Request body size-limiting for JSON payloads to prevent DOS attacks
app.use(express.json({ limit: "10kb" }));

// 5. URL-encoded parser
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 6. MongoDB Operator Injection Protection
// Workaround for Express 5 compatibility: make req.query writable before sanitizing
app.use((req, res, next) => {
  if (req.query) {
    Object.defineProperty(req, "query", {
      value: { ...req.query },
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }
  next();
});
app.use(mongoSanitize());

// --- Rate Limiting Configuration ---

// General rate limiter: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests, please try again later.",
});

// Authentication rate limiter (stricter): 10 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many auth attempts.",
});

// Apply general rate limiting to all API requests
app.use("/api/", generalLimiter);

// Apply strict rate limiting to authentication routes specifically
app.use("/api/auth/", authLimiter);

// --- Route Registration ---

// Auth Routes
app.use("/api/auth", authRoutes);

// Leads Routes
app.use("/api/leads", leadRoutes);

// Default Route (Landing page feedback)
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Startup CRM Backend is Running 🚀",
  });
});

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date(),
  });
});

// --- Error Handling Middleware ---
// Global Error Handler must be registered LAST, after all routes
app.use(errorHandler);

// --- Server Lifecycle & Initialization ---

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const startServer = async () => {
  // Connect to Database first
  await connectDB();

  // Bind port and start listening
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
  });
};

startServer();

// --- Graceful Shutdown Handling ---
/**
 * Gracefully shuts down the database connection and exits the process.
 * 
 * @param {string} signal - The OS process signal captured (SIGINT, SIGTERM)
 */
const handleGracefulShutdown = async (signal) => {
  console.log(`\n[${signal}] Server shutting down gracefully...`);
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB Connection closed cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error closing MongoDB connection during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => handleGracefulShutdown("SIGTERM"));
process.on("SIGINT", () => handleGracefulShutdown("SIGINT"));

export default app;