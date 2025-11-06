/**
 * Comment Routes
 * 
 * Defines all comment-related endpoints.
 * 
 * @module modules/comments/routes
 */

import { Router } from 'express';
import * as commentController from './comment.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  createCommentSchema,
  moderateCommentSchema,
} from './comment.validators.js';

const router = Router();

// Get pending comments (author/admin)
router.get(
  '/pending',
  authMiddleware(['author', 'admin']),
  commentController.getPendingComments
);

// Moderate comment (author/admin)
router.patch(
  '/:commentId/moderate',
  authMiddleware(['author', 'admin']),
  validate(moderateCommentSchema),
  commentController.moderateComment
);

// Delete comment (author/admin/owner)
router.delete(
  '/:commentId',
  authMiddleware(['user', 'author', 'admin']),
  commentController.deleteComment
);

export default router;
