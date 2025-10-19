import cors from 'cors';
import rateLimit from 'express-rate-limit';
import config from './index.js';

export const corsOptions = {
  origin: ['http://localhost:3000', 'https://yourfrontenddomain.com'],
  credentials: true,
};

export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: 'Too many requests from this IP, please try again later.',
});
