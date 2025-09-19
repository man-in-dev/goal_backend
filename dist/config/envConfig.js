"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validateEnvVariables = () => {
    const requiredVars = ['MONGO_URI'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
    return {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: parseInt(process.env.PORT || '8000', 10),
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: 'goalsecrete@123@321',
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
        CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3001'
    };
};
const EnvVariables = validateEnvVariables();
exports.default = EnvVariables;
//# sourceMappingURL=envConfig.js.map