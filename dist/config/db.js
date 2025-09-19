"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const envConfig_1 = __importDefault(require("./envConfig"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!envConfig_1.default.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        const conn = yield mongoose_1.default.connect(envConfig_1.default.MONGO_URI);
        console.log(`Database connected successfully with host: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        // Retry connection after 5 seconds
        setTimeout(() => {
            console.log("Retrying database connection...");
            connectDB();
        }, 5000);
    }
});
// Handle MongoDB connection events
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
}));
exports.default = connectDB;
//# sourceMappingURL=db.js.map