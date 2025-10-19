import { Router } from 'express';
import * as commentController from './comment.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { createCommentSchema, moderateCommentSchema } from './comment.validators.js';

const router = Router({ mergeParams: true });

// Anyone can get approved comments
router.get('/posts/:postId/comments', commentController.getComments);

// Authenticated users can comment
router.post('/posts/:postId/comments', authMiddleware(['user', 'author', 'admin']), validate(createCommentSchema), commentController.createComment);

// Authors moderate comments on their posts
router.patch('/comments/:commentId/moderate', authMiddleware(['author', 'admin']), validate(moderateCommentSchema), commentController.moderateComment);

// Admin or authors can delete comments accordingly
router.delete('/comments/:commentId', authMiddleware(['author', 'admin']), commentController.deleteComment);

export default router;
