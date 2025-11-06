/**
 * Interaction Routes
 * 
 * Defines all interaction-related endpoints.
 * 
 * @module modules/interactions/routes
 */

import { Router } from 'express';
import * as interactionController from './interaction.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Get user's liked/favorited posts (requires authentication)
router.get(
  '/liked',
  authMiddleware(['user', 'author', 'admin']),
  interactionController.getLikedPosts
);

router.get(
  '/favorited',
  authMiddleware(['user', 'author', 'admin']),
  interactionController.getFavoritedPosts
);

// Toggle interactions (requires authentication)
router.post(
  '/:postId/like',
  authMiddleware(['user', 'author', 'admin']),
  interactionController.likePost
);

router.post(
  '/:postId/favorite',
  authMiddleware(['user', 'author', 'admin']),
  interactionController.favoritePost
);

// View tracking (public)
router.post('/:postId/view', interactionController.viewPost);

// Get post stats (public)
router.get('/:postId/stats', interactionController.getPostStats);

export default router;
