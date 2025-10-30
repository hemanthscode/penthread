import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

// Standardized API rate limiting applied globally or on selected routes
export default rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
