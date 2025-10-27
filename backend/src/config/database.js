// MongoDB connection setup using mongoose
import mongoose from 'mongoose';
import config from './index.js';
import logger from './logger.js';

export async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}
