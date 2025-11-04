import { Router } from 'express';
import * as postController from './post.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { createPostSchema, updatePostSchema } from './post.validators.js';

const router = Router();

// ==================== PUBLIC ROUTES ====================
// Get published posts (for guests and all users)
router.get('/public', postController.getPublicPosts);

// ==================== AUTHOR ROUTES ====================
// Author's own posts (all statuses)
router.get('/my-posts', authMiddleware(['author', 'admin']), postController.getMyPosts);

// ==================== ADMIN ROUTES ====================
// Admin sees all posts (all statuses, all authors)
router.get('/admin/all', authMiddleware(['admin']), postController.getAllPostsAdmin);

// Admin moderation
router.patch('/:postId/approve', authMiddleware(['admin']), postController.approvePost);
router.patch('/:postId/reject', authMiddleware(['admin']), postController.rejectPost);

// ==================== PROTECTED CRUD ROUTES ====================
// Create post (author/admin)
router.post('/', authMiddleware(['author', 'admin']), validate(createPostSchema), postController.createPost);

// Update post (author of post or admin)
router.patch('/:postId', authMiddleware(['author', 'admin']), validate(updatePostSchema), postController.updatePost);

// Delete post (author of post or admin)
router.delete('/:postId', authMiddleware(['author', 'admin']), postController.deletePost);

// Publish/unpublish (author of post or admin)
router.patch('/:postId/publish', authMiddleware(['author', 'admin']), postController.publishPost);
router.patch('/:postId/unpublish', authMiddleware(['author', 'admin']), postController.unpublishPost);

// ==================== SINGLE POST (MUST BE LAST) ====================
// Get single post (public) - MUST be at the end to avoid matching other routes
router.get('/:postId', postController.getPost);

export default router;
