import { Router } from 'express';
import * as commentController from './comment.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { createCommentSchema, moderateCommentSchema } from './comment.validators.js';

const router = Router({ mergeParams: true });

router.get('/posts/:postId/comments', commentController.getComments);
router.post('/posts/:postId/comments', authMiddleware(['user', 'author', 'admin']), validate(createCommentSchema), commentController.createComment);
router.patch('/comments/:commentId/moderate', authMiddleware(['author', 'admin']), validate(moderateCommentSchema), commentController.moderateComment);
router.delete('/comments/:commentId', authMiddleware(['author', 'admin']), commentController.deleteComment);

export default router;
