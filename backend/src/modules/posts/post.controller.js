/**
 * Post Controller
 * 
 * Handles HTTP requests for post endpoints.
 * 
 * @module modules/posts/controller
 */

import * as postService from './post.service.js';
import { sendSuccess, sendPaginatedResponse } from '../../utils/response.js';
import { getPaginationParams, buildPaginationMeta } from '../../utils/pagination.js';
import { POST_STATUS } from '../../utils/constants.js';

/**
 * Get published posts (public endpoint with optional auth)
 * GET /api/posts/public
 */
export async function getPublicPosts(req, res, next) {
  try {
    const { page, limit } = getPaginationParams(req.query);
    const { authorId, categoryId, tagId, search, sortBy = 'publishedAt', order = 'desc' } = req.query;

    const filter = { status: POST_STATUS.PUBLISHED };

    if (authorId) filter.author = authorId;
    if (categoryId) filter.categories = categoryId;
    if (tagId) filter.tags = tagId;

    const options = {
      page,
      limit,
      sortBy,
      order,
      userId: req.user?._id,
    };

    let posts, total;

    if (search) {
      posts = await postService.searchPosts(search, options);
      total = posts.length;
    } else {
      posts = await postService.getPosts(filter, options);
      total = await postService.countPosts(filter);
    }

    const pagination = buildPaginationMeta(page, limit, total);
    sendPaginatedResponse(res, posts, pagination, 'Posts retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get single post by ID (public with optional auth)
 * GET /api/posts/:postId
 */
export async function getPost(req, res, next) {
  try {
    const post = await postService.getPostById(req.params.postId, req.user?._id);
    sendSuccess(res, post, 'Post retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get author's own posts (all statuses)
 * GET /api/posts/my-posts
 */
export async function getMyPosts(req, res, next) {
  try {
    const { page, limit } = getPaginationParams(req.query);
    const { status, categoryId, tagId, search } = req.query;

    const filter = { author: req.user._id };

    if (status) filter.status = status;
    if (categoryId) filter.categories = categoryId;
    if (tagId) filter.tags = tagId;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const options = { page, limit, userId: req.user._id };

    const posts = await postService.getPosts(filter, options);
    const total = await postService.countPosts(filter);
    const pagination = buildPaginationMeta(page, limit, total);

    sendPaginatedResponse(res, posts, pagination, 'My posts retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get all posts (admin only)
 * GET /api/posts/admin/all
 */
export async function getAllPostsAdmin(req, res, next) {
  try {
    const { page, limit } = getPaginationParams(req.query);
    const { status, authorId, categoryId, tagId, search } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (authorId) filter.author = authorId;
    if (categoryId) filter.categories = categoryId;
    if (tagId) filter.tags = tagId;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const options = { page, limit, userId: req.user._id };

    const posts = await postService.getPosts(filter, options);
    const total = await postService.countPosts(filter);
    const pagination = buildPaginationMeta(page, limit, total);

    sendPaginatedResponse(res, posts, pagination, 'All posts retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Create new post
 * POST /api/posts
 */
export async function createPost(req, res, next) {
  try {
    const postData = {
      ...req.body,
      author: req.user._id,
    };

    const post = await postService.createPost(postData);
    sendSuccess(res, post, 'Post created successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Update post
 * PATCH /api/posts/:postId
 */
export async function updatePost(req, res, next) {
  try {
    const isAdmin = req.user.role === 'admin';
    const post = await postService.updatePost(
      req.params.postId,
      req.body,
      req.user._id,
      isAdmin
    );
    sendSuccess(res, post, 'Post updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete post
 * DELETE /api/posts/:postId
 */
export async function deletePost(req, res, next) {
  try {
    const isAdmin = req.user.role === 'admin';
    await postService.deletePost(req.params.postId, req.user._id, isAdmin);
    sendSuccess(res, null, 'Post deleted successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Approve post (admin only)
 * PATCH /api/posts/:postId/approve
 */
export async function approvePost(req, res, next) {
  try {
    const post = await postService.approvePost(req.params.postId, req.user._id);
    sendSuccess(res, post, 'Post approved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Reject post (admin only)
 * PATCH /api/posts/:postId/reject
 */
export async function rejectPost(req, res, next) {
  try {
    const { reason } = req.body;
    const post = await postService.rejectPost(req.params.postId, reason, req.user._id);
    sendSuccess(res, post, 'Post rejected');
  } catch (error) {
    next(error);
  }
}

/**
 * Publish post
 * PATCH /api/posts/:postId/publish
 */
export async function publishPost(req, res, next) {
  try {
    const isAdmin = req.user.role === 'admin';
    const post = await postService.publishPost(req.params.postId, req.user._id, isAdmin);
    sendSuccess(res, post, 'Post published successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Unpublish post
 * PATCH /api/posts/:postId/unpublish
 */
export async function unpublishPost(req, res, next) {
  try {
    const isAdmin = req.user.role === 'admin';
    const post = await postService.unpublishPost(req.params.postId, req.user._id, isAdmin);
    sendSuccess(res, post, 'Post unpublished successfully');
  } catch (error) {
    next(error);
  }
}

export default {
  getPublicPosts,
  getPost,
  getMyPosts,
  getAllPostsAdmin,
  createPost,
  updatePost,
  deletePost,
  approvePost,
  rejectPost,
  publishPost,
  unpublishPost,
};
