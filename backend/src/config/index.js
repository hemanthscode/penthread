import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';

export default {
  env,
  port: process.env.PORT || 4000,
  mongoUri:
    env === 'production'
      ? process.env.MONGO_PROD_URI
      : process.env.MONGO_DEV_URI || 'mongodb://localhost:27017/blog-platform',
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
  emailJsServiceId: process.env.EMAILJS_SERVICE_ID,
  emailJsTemplateId: process.env.EMAILJS_TEMPLATE_ID,
  emailJsUserId: process.env.EMAILJS_USER_ID,
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // max requests per window per IP
  logs: {
    level: env === 'production' ? 'info' : 'debug',
  },
};
