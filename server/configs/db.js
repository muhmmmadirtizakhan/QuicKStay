import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is missing in environment variables");
    }

    // Connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
      family: 4 // Force IPv4
    };

    // Event listeners
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

    // Connect
    await mongoose.connect(uri, options);
    console.log("⏳ Connecting to MongoDB...");
    
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Don't exit process in serverless
    throw error;
  }
};

export default connectDB;