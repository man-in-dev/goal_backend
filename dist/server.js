"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// import listEndpoints from "express-list-endpoints";
// import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean";
const hpp_1 = __importDefault(require("hpp"));
const envConfig_1 = __importDefault(require("./config/envConfig"));
const db_1 = __importDefault(require("./config/db"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// Create uploads directory if it doesn't exist
const uploadsDir = path_1.default.join(__dirname, 'uploads', 'resumes');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Connect to database
(0, db_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
});
// app.use("/api/", limiter);
// Body parser
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Sanitize data
// app.use(mongoSanitize());
// Prevent XSS attacks
// app.use(xss());
// Prevent http param pollution
app.use((0, hpp_1.default)());
// CORS
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
}));
// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});
// Serve static files (uploads)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Mount routes
app.use("/api", routes_1.default);
// Root route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Server is running...",
        version: "1.0.0",
        environment: envConfig_1.default.NODE_ENV,
    });
});
// Handle 404 errors
app.use(errorHandler_1.notFound);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
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
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});
// Uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});
const PORT = envConfig_1.default.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
    console.log(`🌍 Environment: ${envConfig_1.default.NODE_ENV}`);
    console.log(`🔗 CORS Origin: ${envConfig_1.default.CORS_ORIGIN}`);
});
//# sourceMappingURL=server.js.map