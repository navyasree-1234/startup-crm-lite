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

// Trust proxy for hosted environments (Render, Vercel, Heroku, etc.)
app.set("trust proxy", 1);

// --- Express Configuration & Middlewares ---

// 1. CORS configuration with dynamic origin checking for production, Vercel deployments, and local environments
const defaultAllowedOrigins = [
  "https://startup-crm-lite-zeta.vercel.app",
  "https://startup-crm-lite.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5000"
];

if (process.env.FRONTEND_URL) {
  const envUrl = process.env.FRONTEND_URL.trim().replace(/\/$/, "");
  if (envUrl && !defaultAllowedOrigins.includes(envUrl)) {
    defaultAllowedOrigins.push(envUrl);
  }
}

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow curl, mobile apps, Postman, health-checks
  const cleanOrigin = origin.trim().replace(/\/$/, "");

  // Match exact allowed origin list
  if (defaultAllowedOrigins.some((allowed) => allowed.toLowerCase() === cleanOrigin.toLowerCase())) {
    return true;
  }

  // Match any Vercel deployment preview / production URL for this project
  if (/^https:\/\/startup-crm-lite(-[a-z0-9-]+)?\.vercel\.app$/i.test(cleanOrigin)) {
    return true;
  }

  // Match local development ports
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(cleanOrigin)) {
    return true;
  }

  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin"
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  optionsSuccessStatus: 204
};

// Apply CORS middleware first so preflight and headers are processed immediately
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// 2. Helmet to secure Express apps by setting various HTTP headers
// Allow cross-origin requests from Vercel frontend to read API resources
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

// 3. Request logging configuration based on environment type
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

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
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS"
});

// Authentication rate limiter: 50 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { success: false, message: "Too many authentication attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS"
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
    message: "Startup CRM Backend is Running 🚀 - Version 1.0.2",
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