import { Router } from 'express';
import * as postController from './post.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { createPostSchema, updatePostSchema } from './post.validators.js';

const router = Router();

router.get('/', postController.getPosts);
router.get('/:postId', postController.getPost);

// Only authors or admins can create, update, or delete posts
router.post('/', authMiddleware(['author', 'admin']), validate(createPostSchema), postController.createPost);
router.patch('/:postId', authMiddleware(['author', 'admin']), validate(updatePostSchema), postController.updatePost);
router.delete('/:postId', authMiddleware(['author', 'admin']), postController.deletePost);

// Admin-only moderation routes
router.patch('/:postId/approve', authMiddleware(['admin']), postController.approvePost);
router.patch('/:postId/reject', authMiddleware(['admin']), postController.rejectPost);

// Publish/unpublish routes for author/admin
router.patch('/:postId/publish', authMiddleware(['author', 'admin']), postController.publishPost);
router.patch('/:postId/unpublish', authMiddleware(['author', 'admin']), postController.unpublishPost);

export default router;
