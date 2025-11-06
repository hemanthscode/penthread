/**
 * Post Service
 * 
 * Handles all post-related business logic with proper
 * authorization, status management, and relationships.
 * 
 * @module modules/posts/service
 */

import Post from './post.model.js';
import Comment from '../comments/comment.model.js';
import Interaction from '../interactions/interaction.model.js';
import * as interactionService from '../interactions/interaction.service.js';
import { logActivity } from '../activity/activity.service.js';
import { createNotification } from '../notifications/notification.service.js';
import AppError from '../../utils/AppError.js';
import { POST_STATUS, ACTIVITY_TYPES, NOTIFICATION_TYPES } from '../../utils/constants.js';
import logger from '../../config/logger.js';

/**
 * Validates post ID
 */
function validatePostId(postId) {
  if (!postId || !postId.match(/^[0-9a-fA-F]{24}$/)) {
    throw AppError.badRequest('Invalid post ID');
  }
}

/**
 * Creates a new post
 */
export async function createPost(postData) {
  const { author, title, content, categories, tags, featuredImage, excerpt } = postData;

  const post = new Post({
    title,
    content,
    author,
    categories: categories || [],
    tags: tags || [],
    featuredImage,
    excerpt,
    status: POST_STATUS.DRAFT,
  });

  await post.save();

  // Populate relationships
  await post.populate([
    { path: 'author', select: 'name email role avatar' },
    { path: 'categories', select: 'name' },
    { path: 'tags', select: 'name' },
  ]);

  // Log activity
  try {
    await logActivity(author, ACTIVITY_TYPES.POST_CREATED, `Created post: ${title}`);
  } catch (error) {
    logger.error('Failed to log post creation activity:', error);
  }

  logger.info(`Post created: ${post._id} by ${author}`);

  return post;
}

/**
 * Gets a single post by ID with user interactions
 */
export async function getPostById(postId, userId = null) {
  validatePostId(postId);

  const post = await Post.findById(postId)
    .populate('author', 'name email role avatar')
    .populate('categories', 'name')
    .populate('tags', 'name');

  if (!post) {
    throw AppError.notFound('Post not found');
  }

  // Get approved comments count
  const commentsCount = await Comment.countDocuments({
    post: postId,
    status: 'approved',
  });

  // Get user interactions if userId provided
  let userInteractions = { liked: false, favorited: false };
  if (userId) {
    userInteractions = await interactionService.getUserInteractions(userId, postId);
  }

  // Build response
  const postObject = post.toObject();
  postObject.commentsCount = commentsCount;
  postObject.userInteractions = userInteractions;

  return postObject;
}

/**
 * Gets posts with filtering, sorting, and pagination
 */
export async function getPosts(filter = {}, options = {}) {
  const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', userId = null } = options;
  const skip = (page - 1) * limit;

  const posts = await Post.find(filter)
    .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'name email role avatar')
    .populate('categories', 'name')
    .populate('tags', 'name');

  if (posts.length === 0) {
    return [];
  }

  const postIds = posts.map(p => p._id);

  // Bulk fetch comment counts
  const commentCounts = await Comment.aggregate([
    { $match: { post: { $in: postIds }, status: 'approved' } },
    { $group: { _id: '$post', count: { $sum: 1 } } },
  ]);

  const commentCountMap = new Map(
    commentCounts.map(item => [item._id.toString(), item.count])
  );

  // Get user interactions if userId provided
  let interactionsMap = new Map();
  if (userId) {
    interactionsMap = await interactionService.getUserInteractionsForPosts(userId, postIds);
  }

  // Enrich posts with counts and interactions
  const enrichedPosts = posts.map(post => {
    const postObject = post.toObject();
    const postIdStr = post._id.toString();
    
    postObject.commentsCount = commentCountMap.get(postIdStr) || 0;
    postObject.userInteractions = interactionsMap.get(postIdStr) || {
      liked: false,
      favorited: false,
    };

    return postObject;
  });

  return enrichedPosts;
}

/**
 * Counts posts matching filter
 */
export async function countPosts(filter = {}) {
  return Post.countDocuments(filter);
}

/**
 * Updates a post
 */
export async function updatePost(postId, updateData, userId, isAdmin = false) {
  validatePostId(postId);

  const post = await Post.findById(postId);
  
  if (!post) {
    throw AppError.notFound('Post not found');
  }

  // Authorization check
  if (!isAdmin && post.author.toString() !== userId.toString()) {
    throw AppError.forbidden('Not authorized to update this post');
  }

  // Prevent changing author
  delete updateData.author;

  // Prevent non-admins from changing certain fields
  if (!isAdmin) {
    delete updateData.status;
  }

  // Update fields
  Object.assign(post, updateData);
  await post.save();

  // Populate relationships
  await post.populate([
    { path: 'author', select: 'name email role avatar' },
    { path: 'categories', select: 'name' },
    { path: 'tags', select: 'name' },
  ]);

  // Log activity
  try {
    await logActivity(userId, ACTIVITY_TYPES.POST_UPDATED, `Updated post: ${post.title}`);
  } catch (error) {
    logger.error('Failed to log post update activity:', error);
  }

  logger.info(`Post updated: ${postId} by ${userId}`);

  return post;
}

/**
 * Deletes a post and related data
 */
export async function deletePost(postId, userId, isAdmin = false) {
  validatePostId(postId);

  const post = await Post.findById(postId);
  
  if (!post) {
    throw AppError.notFound('Post not found');
  }

  // Authorization check
  if (!isAdmin && post.author.toString() !== userId.toString()) {
    throw AppError.forbidden('Not authorized to delete this post');
  }

  const postTitle = post.title;

  // Delete related data in parallel
  await Promise.all([
    post.deleteOne(),
    Comment.deleteMany({ post: postId }),
    Interaction.deleteMany({ post: postId }),
  ]);

  // Log activity
  try {
    await logActivity(userId, ACTIVITY_TYPES.POST_DELETED, `Deleted post: ${postTitle}`);
  } catch (error) {
    logger.error('Failed to log post deletion activity:', error);
  }

  logger.info(`Post deleted: ${postId} by ${userId}`);
}

/**
 * Approves a post (admin only)
 */
export async function approvePost(postId, adminId) {
  validatePostId(postId);

  const post = await Post.findById(postId).populate('author', 'name email');
  
  if (!post) {
    throw AppError.notFound('Post not found');
  }

  if (post.status === POST_STATUS.APPROVED) {
    throw AppError.badRequest('Post is already approved');
  }

  post.status = POST_STATUS.APPROVED;
  await post.save();

  // Notify author
  try {
    await createNotification({
      user: post.author._id,
      title: 'Post Approved',
      message: `Your post "${post.title}" has been approved and can now be published`,
      link: `/posts/${post._id}`,
    });
  } catch (error) {
    logger.error('Failed to create approval notification:', error);
  }

  logger.info(`Post approved: ${postId} by admin ${adminId}`);

  return post;
}

/**
 * Rejects a post (admin only)
 */
export async function rejectPost(postId, rejectionReason, adminId) {
  validatePostId(postId);

  const post = await Post.findById(postId).populate('author', 'name email');
  
  if (!post) {
    throw AppError.notFound('Post not found');
  }

  post.status = POST_STATUS.REJECTED;
  post.rejectionReason = rejectionReason || 'Does not meet content guidelines';
  await post.save();

  // Notify author
  try {
    await createNotification({
      user: post.author._id,
      title: 'Post Rejected',
      message: `Your post "${post.title}" was rejected. Reason: ${post.rejectionReason}`,
      link: `/posts/${post._id}`,
    });
  } catch (error) {
    logger.error('Failed to create rejection notification:', error);
  }

  logger.info(`Post rejected: ${postId} by admin ${adminId}`);

  return post;
}

/**
 * Publishes a post
 */
export async function publishPost(postId, userId, isAdmin = false) {
  validatePostId(postId);

  const post = await Post.findById(postId);
  
  if (!post) {
    throw AppError.notFound('Post not found');
  }

  // Authorization check
  if (!isAdmin && post.author.toString() !== userId.toString()) {
    throw AppError.forbidden('Not authorized to publish this post');
  }

  // Validate post can be published
  if (!post.canPublish()) {
    throw AppError.badRequest(`Cannot publish post with status: ${post.status}`);
  }

  post.status = POST_STATUS.PUBLISHED;
  post.publishedAt = new Date();
  await post.save();

  // Log activity
  try {
    await logActivity(userId, ACTIVITY_TYPES.POST_PUBLISHED, `Published post: ${post.title}`);
  } catch (error) {
    logger.error('Failed to log post publish activity:', error);
  }

  logger.info(`Post published: ${postId} by ${userId}`);

  return post;
}

/**
 * Unpublishes a post
 */
export async function unpublishPost(postId, userId, isAdmin = false) {
  validatePostId(postId);

  const post = await Post.findById(postId);
  
  if (!post) {
    throw AppError.notFound('Post not found');
  }

  // Authorization check
  if (!isAdmin && post.author.toString() !== userId.toString()) {
    throw AppError.forbidden('Not authorized to unpublish this post');
  }

  if (post.status !== POST_STATUS.PUBLISHED) {
    throw AppError.badRequest('Only published posts can be unpublished');
  }

  post.status = POST_STATUS.UNPUBLISHED;
  await post.save();

  logger.info(`Post unpublished: ${postId} by ${userId}`);

  return post;
}

/**
 * Searches posts by text
 */
export async function searchPosts(searchText, options = {}) {
  const { page = 1, limit = 10, userId = null } = options;
  const skip = (page - 1) * limit;

  const filter = {
    status: POST_STATUS.PUBLISHED,
    $text: { $search: searchText },
  };

  const posts = await Post.find(filter, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limit)
    .populate('author', 'name email role avatar')
    .populate('categories', 'name')
    .populate('tags', 'name');

  // Enrich with interactions
  return getPosts({ _id: { $in: posts.map(p => p._id) } }, { ...options, page: 1, limit: posts.length });
}

export default {
  createPost,
  getPostById,
  getPosts,
  countPosts,
  updatePost,
  deletePost,
  approvePost,
  rejectPost,
  publishPost,
  unpublishPost,
  searchPosts,
};
