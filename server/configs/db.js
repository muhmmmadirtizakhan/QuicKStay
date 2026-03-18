import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is missing");
    }

    mongoose.connection.on("connected", () => console.log("database connected"));
    await mongoose.connect(uri);
  } catch (error) {
    console.log("MongoDB connection error:", error.message);
  }
};

export default connectDB;
