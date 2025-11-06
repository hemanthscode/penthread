/**
 * Routes Loader
 * 
 * Aggregates all module routes into the main router.
 * 
 * @module loaders/routes
 */

import { Router } from 'express';

// Import all module routes
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import postRoutes from '../modules/posts/post.routes.js';
import commentRoutes from '../modules/comments/comment.routes.js';
import categoryRoutes from '../modules/categories/category.routes.js';
import tagRoutes from '../modules/tags/tag.routes.js';
import interactionRoutes from '../modules/interactions/interaction.routes.js';
import notificationRoutes from '../modules/notifications/notification.routes.js';
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';
import activityRoutes from '../modules/activity/activity.routes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/interactions', interactionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/activity', activityRoutes);

export default router;
