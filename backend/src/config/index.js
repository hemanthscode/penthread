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
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,

  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMax: 100,

  logs: {
    level: env === 'production' ? 'info' : 'debug',
  },
};
