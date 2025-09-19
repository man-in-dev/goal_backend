import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// import listEndpoints from "express-list-endpoints";
// import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean";
import hpp from "hpp";

import EnvVariables from "./config/envConfig";
import connectDB from "./config/db";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// app.use("/api/", limiter);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Sanitize data
// app.use(mongoSanitize());

// Prevent XSS attacks
// app.use(xss());

// Prevent http param pollution
app.use(hpp());

// CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Mount routes
app.use("/api", routes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is running...",
    version: "1.0.0",
    environment: EnvVariables.NODE_ENV,
  });
});

// Handle 404 errors
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully");
  process.exit(0);
});

// Unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const PORT = EnvVariables.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
  console.log(`🌍 Environment: ${EnvVariables.NODE_ENV}`);
  console.log(`🔗 CORS Origin: ${EnvVariables.CORS_ORIGIN}`);
});
