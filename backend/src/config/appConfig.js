import cors from 'cors';
import rateLimit from 'express-rate-limit';
import config from './index.js';

export const corsOptions = {
  origin: [
    'http://localhost:5173',          // Vite frontend during development
    'http://localhost:3000',          // Backend and other local frontends
    'https://yourfrontenddomain.com'  // Production frontend domain
  ],
  credentials: true,
};

export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
