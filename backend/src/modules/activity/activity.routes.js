import { Router } from 'express';
import * as activityController from './activity.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware(['admin', 'author', 'user']), activityController.getActivities);

export default router;
