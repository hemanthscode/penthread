/**
 * Post Routes
 * 
 * Defines all post-related endpoints with proper authorization.
 * 
 * @module modules/posts/routes
 */

import { Router } from 'express';
import * as postController from './post.controller.js';
import * as commentController from '../comments/comment.controller.js';  
import authMiddleware from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  createPostSchema,
  updatePostSchema,
  rejectPostSchema,
  getPostsQuerySchema,
} from './post.validators.js';
import { createCommentSchema } from '../comments/comment.validators.js';  

const router = Router();

// ==================== PUBLIC ROUTES (with optional auth) ====================
router.get(
  '/public',
  authMiddleware([], true),
  validate(getPostsQuerySchema, 'query'),
  postController.getPublicPosts
);

// ==================== AUTHOR ROUTES ====================
router.get(
  '/my-posts',
  authMiddleware(['author', 'admin']),
  validate(getPostsQuerySchema, 'query'),
  postController.getMyPosts
);

// ==================== ADMIN ROUTES ====================
router.get(
  '/admin/all',
  authMiddleware(['admin']),
  validate(getPostsQuerySchema, 'query'),
  postController.getAllPostsAdmin
);

router.patch(
  '/:postId/approve',
  authMiddleware(['admin']),
  postController.approvePost
);

router.patch(
  '/:postId/reject',
  authMiddleware(['admin']),
  validate(rejectPostSchema),
  postController.rejectPost
);

// ==================== PROTECTED CRUD ROUTES ====================
router.post(
  '/',
  authMiddleware(['author', 'admin']),
  validate(createPostSchema),
  postController.createPost
);

router.patch(
  '/:postId',
  authMiddleware(['author', 'admin']),
  validate(updatePostSchema),
  postController.updatePost
);

router.delete(
  '/:postId',
  authMiddleware(['author', 'admin']),
  postController.deletePost
);

router.patch(
  '/:postId/publish',
  authMiddleware(['author', 'admin']),
  postController.publishPost
);

router.patch(
  '/:postId/unpublish',
  authMiddleware(['author', 'admin']),
  postController.unpublishPost
);

// ==================== COMMENT ROUTES (NESTED UNDER POSTS) ====================

// Get comments for a post (public)
router.get(
  '/:postId/comments',
  commentController.getComments
);

// Create comment on a post (authenticated)
router.post(
  '/:postId/comments',
  authMiddleware(['user', 'author', 'admin']),
  validate(createCommentSchema),
  commentController.createComment
);

// ==================== SINGLE POST (MUST BE LAST) ====================
router.get(
  '/:postId',
  authMiddleware([], true),
  postController.getPost
);

export default router;
