import mongoose from "mongoose";
import dns from "node:dns";

// Explicitly set reliable DNS servers to resolve MongoDB SRV records
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Full MongoDB Error:");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;