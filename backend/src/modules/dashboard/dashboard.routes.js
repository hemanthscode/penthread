import { Router } from 'express';
import * as dashboardController from './dashboard.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/admin/summary', authMiddleware(['admin']), dashboardController.adminSummary);
router.get('/admin/stats', authMiddleware(['admin']), dashboardController.adminStats);

router.get('/author/summary', authMiddleware(['author']), dashboardController.authorSummary);
router.get('/author/stats', authMiddleware(['author']), dashboardController.authorStats);

router.get('/user/summary', authMiddleware(['user']), dashboardController.userSummary);

export default router;
