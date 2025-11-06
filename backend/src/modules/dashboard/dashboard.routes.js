/**
 * Dashboard Routes
 * 
 * Defines all dashboard-related endpoints.
 * 
 * @module modules/dashboard/routes
 */

import { Router } from 'express';
import * as dashboardController from './dashboard.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Admin dashboard routes
router.get(
  '/admin/summary',
  authMiddleware(['admin']),
  dashboardController.adminSummary
);

router.get(
  '/admin/stats',
  authMiddleware(['admin']),
  dashboardController.adminStats
);

// Author dashboard routes
router.get(
  '/author/summary',
  authMiddleware(['author']),
  dashboardController.authorSummary
);

router.get(
  '/author/stats',
  authMiddleware(['author']),
  dashboardController.authorStats
);

// User dashboard routes
router.get(
  '/user/summary',
  authMiddleware(['user']),
  dashboardController.userSummary
);

router.get(
  '/user/stats',
  authMiddleware(['user']),
  dashboardController.userStats
);

export default router;
