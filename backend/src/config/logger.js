/**
 * Logger Configuration Module
 * 
 * Configures Winston logger with multiple transports and formatting.
 * Supports request ID tracking for better debugging.
 * 
 * @module config/logger
 */

import { createLogger, format, transports } from 'winston';
import config from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors, json } = format;

/**
 * Custom log format for console output
 */
const consoleFormat = printf(({ level, message, timestamp, stack, requestId, ...meta }) => {
  const reqId = requestId ? `[${requestId}]` : '';
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
  
  if (stack) {
    return `${timestamp} ${level} ${reqId}: ${message}\n${stack}`;
  }
  
  return `${timestamp} ${level} ${reqId}: ${message} ${metaStr}`;
});

/**
 * Custom log format for file output
 */
const fileFormat = printf(({ level, message, timestamp, stack, requestId, ...meta }) => {
  return JSON.stringify({
    timestamp,
    level: level.toUpperCase(),
    requestId,
    message,
    stack,
    ...meta,
  });
});

/**
 * Winston logger instance
 */
const logger = createLogger({
  level: config.logging.level,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
  ),
  defaultMeta: { service: 'blog-api' },
  transports: [],
  exitOnError: false,
});

// Console transport (always enabled)
logger.add(new transports.Console({
  format: combine(
    colorize(),
    consoleFormat
  ),
}));

// File transports (configurable)
if (config.logging.file.enabled) {
  // Error logs
  logger.add(new transports.File({
    filename: config.logging.file.errorPath,
    level: 'error',
    format: combine(fileFormat),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }));

  // Combined logs
  logger.add(new transports.File({
    filename: config.logging.file.combinedPath,
    format: combine(fileFormat),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }));
}

/**
 * Creates a child logger with request ID
 * @param {string} requestId - Request ID for tracking
 * @returns {Object} Child logger instance
 */
logger.withRequestId = function(requestId) {
  return logger.child({ requestId });
};

/**
 * Logs HTTP request details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {number} duration - Request duration in ms
 */
logger.httpLog = function(req, res, duration) {
  const { method, originalUrl, ip } = req;
  const { statusCode } = res;
  
  const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms - ${ip}`;
  
  if (statusCode >= 500) {
    this.error(message);
  } else if (statusCode >= 400) {
    this.warn(message);
  } else {
    this.info(message);
  }
};

export default logger;
