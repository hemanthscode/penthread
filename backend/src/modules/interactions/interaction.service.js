/**
 * Interaction Service
 * 
 * Handles all user interaction logic with atomic operations.
 * 
 * @module modules/interactions/service
 */

import Interaction from './interaction.model.js';
import Post from '../posts/post.model.js';
import Comment from '../comments/comment.model.js';
import AppError from '../../utils/AppError.js';
import { logActivity } from '../activity/activity.service.js';
import { ACTIVITY_TYPES } from '../../utils/constants.js';
import logger from '../../config/logger.js';

/**
 * Toggles like status for a post
 */
export async function toggleLike(userId, postId) {
  // Verify post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw AppError.notFound('Post not found');
  }

  // Find or create interaction
  let interaction = await Interaction.findOne({ user: userId, post: postId });

  if (!interaction) {
    // Create new interaction with like
    interaction = new Interaction({
      user: userId,
      post: postId,
      liked: true,
      favorited: false,
    });
    await interaction.save();

    // Increment post likes count
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

    logger.info(`User ${userId} liked post ${postId}`);

    return { liked: true, favorited: false };
  }

  // Toggle existing like
  const newLikedStatus = !interaction.liked;
  interaction.liked = newLikedStatus;
  await interaction.save();

  // Update post count
  const increment = newLikedStatus ? 1 : -1;
  await Post.findByIdAndUpdate(postId, { $inc: { likesCount: increment } });

  logger.info(`User ${userId} ${newLikedStatus ? 'liked' : 'unliked'} post ${postId}`);

  return {
    liked: newLikedStatus,
    favorited: interaction.favorited,
  };
}

/**
 * Toggles favorite status for a post
 */
export async function toggleFavorite(userId, postId) {
  // Verify post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw AppError.notFound('Post not found');
  }

  // Find or create interaction
  let interaction = await Interaction.findOne({ user: userId, post: postId });

  if (!interaction) {
    // Create new interaction with favorite
    interaction = new Interaction({
      user: userId,
      post: postId,
      liked: false,
      favorited: true,
    });
    await interaction.save();

    // Increment post favorites count
    await Post.findByIdAndUpdate(postId, { $inc: { favoritesCount: 1 } });

    logger.info(`User ${userId} favorited post ${postId}`);

    return { liked: false, favorited: true };
  }

  // Toggle existing favorite
  const newFavoritedStatus = !interaction.favorited;
  interaction.favorited = newFavoritedStatus;
  await interaction.save();

  // Update post count
  const increment = newFavoritedStatus ? 1 : -1;
  await Post.findByIdAndUpdate(postId, { $inc: { favoritesCount: increment } });

  logger.info(`User ${userId} ${newFavoritedStatus ? 'favorited' : 'unfavorited'} post ${postId}`);

  return {
    liked: interaction.liked,
    favorited: newFavoritedStatus,
  };
}

/**
 * Records a view for a post
 */
export async function recordView(postId) {
  const post = await Post.findByIdAndUpdate(
    postId,
    { $inc: { viewsCount: 1 } },
    { new: true }
  );

  if (!post) {
    throw AppError.notFound('Post not found');
  }

  return { viewsCount: post.viewsCount };
}

/**
 * Gets user's liked posts with pagination
 */
export async function getUserLikedPosts(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const interactions = await Interaction.find({ user: userId, liked: true })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'post',
      match: { status: 'published' },
      populate: [
        { path: 'author', select: 'name email role avatar' },
        { path: 'categories', select: 'name' },
        { path: 'tags', select: 'name' },
      ],
    });

  // Filter out null posts (deleted or unpublished)
  const posts = interactions
    .filter(i => i.post)
    .map(i => {
      const post = i.post.toObject();
      post.userInteractions = { liked: true, favorited: i.favorited };
      return post;
    });

  // Add comment counts
  const postIds = posts.map(p => p._id);
  const commentCounts = await Comment.aggregate([
    { $match: { post: { $in: postIds }, status: 'approved' } },
    { $group: { _id: '$post', count: { $sum: 1 } } },
  ]);

  const commentCountMap = new Map(
    commentCounts.map(item => [item._id.toString(), item.count])
  );

  posts.forEach(post => {
    post.commentsCount = commentCountMap.get(post._id.toString()) || 0;
  });

  // Get total count
  const total = await Interaction.countDocuments({ user: userId, liked: true });

  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Gets user's favorited posts with pagination
 */
export async function getUserFavoritedPosts(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const interactions = await Interaction.find({ user: userId, favorited: true })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'post',
      match: { status: 'published' },
      populate: [
        { path: 'author', select: 'name email role avatar' },
        { path: 'categories', select: 'name' },
        { path: 'tags', select: 'name' },
      ],
    });

  // Filter out null posts
  const posts = interactions
    .filter(i => i.post)
    .map(i => {
      const post = i.post.toObject();
      post.userInteractions = { liked: i.liked, favorited: true };
      return post;
    });

  // Add comment counts
  const postIds = posts.map(p => p._id);
  const commentCounts = await Comment.aggregate([
    { $match: { post: { $in: postIds }, status: 'approved' } },
    { $group: { _id: '$post', count: { $sum: 1 } } },
  ]);

  const commentCountMap = new Map(
    commentCounts.map(item => [item._id.toString(), item.count])
  );

  posts.forEach(post => {
    post.commentsCount = commentCountMap.get(post._id.toString()) || 0;
  });

  // Get total count
  const total = await Interaction.countDocuments({ user: userId, favorited: true });

  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Gets interaction status for a single post
 */
export async function getUserInteractions(userId, postId) {
  if (!userId || !postId) {
    return { liked: false, favorited: false };
  }

  const interaction = await Interaction.findOne({ user: userId, post: postId });

  if (!interaction) {
    return { liked: false, favorited: false };
  }

  return {
    liked: interaction.liked || false,
    favorited: interaction.favorited || false,
  };
}

/**
 * Gets user interactions for multiple posts (bulk operation)
 */
export async function getUserInteractionsForPosts(userId, postIds) {
  if (!userId || !postIds || postIds.length === 0) {
    return new Map();
  }

  const interactions = await Interaction.find({
    user: userId,
    post: { $in: postIds },
  });

  const map = new Map();
  interactions.forEach(i => {
    map.set(i.post.toString(), {
      liked: i.liked || false,
      favorited: i.favorited || false,
    });
  });

  return map;
}

/**
 * Gets interaction statistics for a post
 */
export async function getPostInteractionStats(postId) {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw AppError.notFound('Post not found');
  }

  const [likesCount, favoritesCount] = await Promise.all([
    Interaction.countDocuments({ post: postId, liked: true }),
    Interaction.countDocuments({ post: postId, favorited: true }),
  ]);

  return {
    likesCount,
    favoritesCount,
    viewsCount: post.viewsCount,
  };
}

export default {
  toggleLike,
  toggleFavorite,
  recordView,
  getUserLikedPosts,
  getUserFavoritedPosts,
  getUserInteractions,
  getUserInteractionsForPosts,
  getPostInteractionStats,
};
