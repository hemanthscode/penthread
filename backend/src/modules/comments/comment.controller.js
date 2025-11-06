/**
 * Comment Controller
 * 
 * Handles HTTP requests for comment endpoints.
 * 
 * @module modules/comments/controller
 */

import * as commentService from './comment.service.js';
import { sendSuccess, sendPaginatedResponse } from '../../utils/response.js';
import { getPaginationParams, buildPaginationMeta } from '../../utils/pagination.js';

/**
 * Create comment
 * POST /api/posts/:postId/comments
 */
export async function createComment(req, res, next) {
  try {
    const comment = await commentService.createComment({
      postId: req.params.postId,
      authorId: req.user._id,
      content: req.body.content,
    });

    sendSuccess(res, comment, 'Comment created and pending approval', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Get comments for a post
 * GET /api/posts/:postId/comments
 */
export async function getComments(req, res, next) {
  try {
    const { page, limit } = getPaginationParams(req.query);
    const { postId } = req.params;

    const comments = await commentService.getCommentsByPost(postId, { page, limit });
    const total = await commentService.countCommentsByPost(postId);
    const pagination = buildPaginationMeta(page, limit, total);

    sendPaginatedResponse(res, comments, pagination, 'Comments retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get pending comments (author/admin)
 * GET /api/comments/pending
 */
export async function getPendingComments(req, res, next) {
  try {
    const comments = await commentService.getPendingComments(req.user._id, req.user.role);
    sendSuccess(res, comments, 'Pending comments retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Moderate comment
 * PATCH /api/comments/:commentId/moderate
 */
export async function moderateComment(req, res, next) {
  try {
    const { action } = req.body;
    const comment = await commentService.moderateComment(
      req.params.commentId,
      action,
      req.user._id,
      req.user.role
    );

    sendSuccess(res, comment, `Comment ${action}ed successfully`);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete comment
 * DELETE /api/comments/:commentId
 */
export async function deleteComment(req, res, next) {
  try {
    await commentService.deleteComment(req.params.commentId, req.user._id, req.user.role);
    sendSuccess(res, null, 'Comment deleted successfully');
  } catch (error) {
    next(error);
  }
}

export default {
  createComment,
  getComments,
  getPendingComments,
  moderateComment,
  deleteComment,
};
