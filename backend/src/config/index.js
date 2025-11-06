/**
 * Centralized Configuration Module
 * 
 * Loads and validates all environment variables with sensible defaults.
 * Provides a single source of truth for application configuration.
 * 
 * @module config
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Validates required environment variables
 * @throws {Error} If required variables are missing
 */
const validateEnv = () => {
  const required = ['MONGO_URI', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env file and ensure all required variables are set.`
    );
  }

  // Warn about default values in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.JWT_SECRET === 'supersecretjwtkey') {
      console.warn('⚠️  WARNING: Using default JWT_SECRET in production!');
    }
  }
};

// Validate on load
validateEnv();

/**
 * Application configuration object
 * @type {Object}
 */
const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Server
  port: parseInt(process.env.PORT, 10) || 4000,
  host: process.env.HOST || '0.0.0.0',
  
  // Database
  mongoUri: process.env.MONGO_URI,
  
  // Authentication
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    resetExpiry: process.env.JWT_RESET_EXPIRY || '1h',
  },
  
  // Email Configuration
  email: {
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'Blog Platform <noreply@blogplatform.com>',
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // 100 requests per window
  },
  
  // CORS
  cors: {
    origins: process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },
  
  // Redis (Optional - for Bull queue)
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    enabled: process.env.REDIS_ENABLED === 'true',
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: {
      enabled: process.env.LOG_FILE_ENABLED !== 'false',
      errorPath: 'logs/error.log',
      combinedPath: 'logs/combined.log',
    },
  },
  
  // File Upload
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE, 10) || 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    destination: process.env.UPLOAD_DESTINATION || 'uploads/',
  },
  
  // Pagination
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
  
  // Security
  security: {
    bcryptRounds: 10,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
};

export default config;
