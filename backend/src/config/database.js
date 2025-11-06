/**
 * Database Connection Module
 * 
 * Handles MongoDB connection with proper error handling and logging.
 * Uses modern Mongoose configuration without deprecated options.
 * 
 * @module config/database
 */

import mongoose from 'mongoose';
import config from './index.js';
import logger from './logger.js';

/**
 * MongoDB connection state
 */
let isConnected = false;

/**
 * Connects to MongoDB with retry logic
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<void>}
 */
export async function connectDB(retries = 5) {
  if (isConnected) {
    logger.info('MongoDB already connected');
    return;
  }

  try {
    // Modern Mongoose connection (no deprecated options)
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    
    logger.info(`MongoDB connected successfully: ${conn.connection.host}`);
    logger.info(`Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error(`MongoDB connection failed (attempt ${6 - retries}/5):`, error.message);
    
    if (retries > 0) {
      logger.info(`Retrying connection in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retries - 1);
    }
    
    logger.error('Failed to connect to MongoDB after 5 attempts');
    process.exit(1);
  }
}

/**
 * Disconnects from MongoDB
 * @returns {Promise<void>}
 */
export async function disconnectDB() {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.connection.close();
    isConnected = false;
    logger.info('MongoDB disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}

/**
 * Gets connection status
 * @returns {boolean}
 */
export function getConnectionStatus() {
  return isConnected && mongoose.connection.readyState === 1;
}

export default { connectDB, disconnectDB, getConnectionStatus };
