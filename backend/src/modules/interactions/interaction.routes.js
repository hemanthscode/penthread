import { Router } from 'express';
import * as interactionController from './interaction.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Toggle interactions (authenticated users)
router.post('/:postId/like', authMiddleware(['user', 'author', 'admin']), interactionController.likePost);
router.post('/:postId/favorite', authMiddleware(['user', 'author', 'admin']), interactionController.favoritePost);

// Get user's liked/favorited posts
router.get('/liked', authMiddleware(['user', 'author', 'admin']), interactionController.getLikedPosts);
router.get('/favorited', authMiddleware(['user', 'author', 'admin']), interactionController.getFavoritedPosts);

// Views are public
router.post('/:postId/view', interactionController.viewPost);

export default router;
