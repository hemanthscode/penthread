import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

export default rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: 'Too many requests from this IP, please try again later.',
});
