/**
 * Interaction Controller
 * 
 * Handles HTTP requests for interaction endpoints.
 * 
 * @module modules/interactions/controller
 */

import * as interactionService from './interaction.service.js';
import { sendSuccess, sendPaginatedResponse } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';

/**
 * Like a post
 * POST /api/interactions/:postId/like
 */
export async function likePost(req, res, next) {
  try {
    const result = await interactionService.toggleLike(req.user._id, req.params.postId);
    
    sendSuccess(
      res,
      result,
      result.liked ? 'Post liked successfully' : 'Like removed successfully'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Favorite a post
 * POST /api/interactions/:postId/favorite
 */
export async function favoritePost(req, res, next) {
  try {
    const result = await interactionService.toggleFavorite(req.user._id, req.params.postId);
    
    sendSuccess(
      res,
      result,
      result.favorited ? 'Post added to favorites' : 'Post removed from favorites'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Record a view
 * POST /api/interactions/:postId/view
 */
export async function viewPost(req, res, next) {
  try {
    const result = await interactionService.recordView(req.params.postId);
    sendSuccess(res, result, 'View recorded');
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's liked posts
 * GET /api/interactions/liked
 */
export async function getLikedPosts(req, res, next) {
  try {
    const { page, limit } = getPaginationParams(req.query);
    const result = await interactionService.getUserLikedPosts(req.user._id, page, limit);
    
    sendPaginatedResponse(
      res,
      result.posts,
      result.pagination,
      'Liked posts retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's favorited posts
 * GET /api/interactions/favorited
 */
export async function getFavoritedPosts(req, res, next) {
  try {
    const { page, limit } = getPaginationParams(req.query);
    const result = await interactionService.getUserFavoritedPosts(req.user._id, page, limit);
    
    sendPaginatedResponse(
      res,
      result.posts,
      result.pagination,
      'Favorited posts retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Get post interaction stats
 * GET /api/interactions/:postId/stats
 */
export async function getPostStats(req, res, next) {
  try {
    const stats = await interactionService.getPostInteractionStats(req.params.postId);
    sendSuccess(res, stats, 'Post statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export default {
  likePost,
  favoritePost,
  viewPost,
  getLikedPosts,
  getFavoritedPosts,
  getPostStats,
};
