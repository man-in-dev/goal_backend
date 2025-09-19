import mongoose from "mongoose";
import EnvVariables from "./envConfig";

const connectDB = async (): Promise<void> => {
  try {
    if (!EnvVariables.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(EnvVariables.MONGO_URI);
    console.log(
      `Database connected successfully with host: ${conn.connection.host}`
    );
  } catch (error: any) {
    console.error(`Database connection failed: ${error.message}`);
    // Retry connection after 5 seconds
    setTimeout(() => {
      console.log("Retrying database connection...");
      connectDB();
    }, 5000);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

export default connectDB;
