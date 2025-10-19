import { Router } from 'express';
import * as activityController from './activity.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware(['admin']), activityController.getActivities);
router.get('/user/:userId', authMiddleware(['admin']), activityController.getUserActivities);

export default router;
