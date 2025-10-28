// CORS and API rate limiting configuration
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import config from './index.js';

export const corsOptions = {
  origin: [
    'http://localhost:5173',           // Vite frontend (local dev)
    'http://localhost:3000',           // backend default or other frontends
    'https://yourfrontenddomain.com'   // production frontend domain
  ],
  credentials: true,
};


export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: 'Too many requests from this IP, please try again later.',
});
