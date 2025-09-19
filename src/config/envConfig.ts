import dotenv from "dotenv";

dotenv.config();

interface EnvVariables {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
}

const validateEnvVariables = (): EnvVariables => {
  const requiredVars = ['MONGO_URI'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '8000', 10),
    MONGO_URI: process.env.MONGO_URI!,
    JWT_SECRET: 'goalsecrete@123@321',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3001'
  };
};

const EnvVariables = validateEnvVariables();

export default EnvVariables;
