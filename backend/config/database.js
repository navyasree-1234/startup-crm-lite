import mongoose from "mongoose";
import dns from "node:dns";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

// Explicitly set reliable public DNS servers to resolve MongoDB SRV records on Windows/ISP networks
// Putting Google DNS first as it is universally accessible across ISPs
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("⚠️ Warning: Failed to set custom DNS servers, falling back to default DNS.");
}

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 * 
 * @returns {Promise<typeof mongoose>} The mongoose instance upon connection success
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Database Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
