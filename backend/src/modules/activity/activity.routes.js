/**
 * Activity Routes
 * 
 * Defines all activity-related endpoints.
 * 
 * @module modules/activity/routes
 */

import { Router } from 'express';
import * as activityController from './activity.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware(['admin', 'author', 'user']));

router.get('/', activityController.getActivities);
router.get('/recent', activityController.getRecentActivities);

export default router;
