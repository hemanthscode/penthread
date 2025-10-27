import { Router } from 'express';
import * as interactionController from './interaction.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/:postId/like', authMiddleware(['user', 'author', 'admin']), interactionController.likePost);
router.delete('/:postId/like', authMiddleware(['user', 'author', 'admin']), interactionController.likePost);

router.post('/:postId/favorite', authMiddleware(['user', 'author', 'admin']), interactionController.favoritePost);
router.delete('/:postId/favorite', authMiddleware(['user', 'author', 'admin']), interactionController.favoritePost);

router.post('/:postId/view', interactionController.viewPost);

export default router;
