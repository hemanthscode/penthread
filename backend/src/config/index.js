// Configuration loader: Loads environment variables and core configuration
import dotenv from 'dotenv';
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/blog-db',
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey',
  emailUser: process.env.EMAIL_USER || '',
  emailPassword: process.env.EMAIL_PASSWORD || '',
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // limit each IP to 100 requests per windowMs
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export default config;
