import morgan from 'morgan';
import logger from '../config/logger.js';

// Morgan HTTP logger streaming to Winston logger
const stream = {
  write: (message) => logger.info(message.trim()),
};

export default morgan('combined', { stream });
