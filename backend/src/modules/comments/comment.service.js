/**
 * Comment Service
 * 
 * Handles comment business logic with moderation and authorization.
 * 
 * @module modules/comments/service
 */

import Comment from './comment.model.js';
import Post from '../posts/post.model.js';
import { createNotification } from '../notifications/notification.service.js';
import { logActivity } from '../activity/activity.service.js';
import AppError from '../../utils/AppError.js';
import { COMMENT_STATUS, ACTIVITY_TYPES, NOTIFICATION_TYPES } from '../../utils/constants.js';
import logger from '../../config/logger.js';

/**
 * Creates a new comment
 */
export async function createComment({ postId, authorId, content }) {
  // Verify post exists and is published
  const post = await Post.findById(postId).populate('author', 'name email');
  
  if (!post) {
    throw AppError.notFound('Post not found');
  }

  if (post.status !== 'published') {
    throw AppError.badRequest('Cannot comment on unpublished posts');
  }

  const comment = new Comment({
    post: postId,
    author: authorId,
    content,
    status: COMMENT_STATUS.PENDING,
  });

  await comment.save();
  await comment.populate('author', 'name avatar role');

  // Increment post comments count
  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

  // Notify post author (if not commenting on own post)
  if (post.author._id.toString() !== authorId.toString()) {
    try {
      await createNotification({
        user: post.author._id,
        title: 'New Comment',
        message: `Someone commented on your post "${post.title}"`,
        link: `/posts/${postId}`,
      });
    } catch (error) {
      logger.error('Failed to create comment notification:', error);
    }
  }

  // Log activity
  try {
    await logActivity(authorId, ACTIVITY_TYPES.COMMENT_CREATED, `Commented on: ${post.title}`);
  } catch (error) {
    logger.error('Failed to log comment activity:', error);
  }

  logger.info(`Comment created on post ${postId} by user ${authorId}`);

  return comment;
}

/**
 * Gets approved comments for a post
 */
export async function getCommentsByPost(postId, options = {}) {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ post: postId, status: COMMENT_STATUS.APPROVED })
    .populate('author', 'name avatar role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return comments;
}

/**
 * Counts comments for a post
 */
export async function countCommentsByPost(postId, status = COMMENT_STATUS.APPROVED) {
  return Comment.countDocuments({ post: postId, status });
}

/**
 * Gets pending comments (admin/author view)
 */
export async function getPendingComments(userId, userRole) {
  let filter = { status: COMMENT_STATUS.PENDING };

  // If author (not admin), only show comments on their posts
  if (userRole === 'author') {
    const posts = await Post.find({ author: userId }).select('_id');
    const postIds = posts.map(p => p._id);
    filter.post = { $in: postIds };
  }

  const comments = await Comment.find(filter)
    .populate('author', 'name avatar role')
    .populate('post', 'title author')
    .sort({ createdAt: -1 });

  return comments;
}

/**
 * Moderates a comment (approve/reject)
 */
export async function moderateComment(commentId, action, userId, userRole) {
  const comment = await Comment.findById(commentId).populate({
    path: 'post',
    select: 'author title',
  });

  if (!comment) {
    throw AppError.notFound('Comment not found');
  }

  const postAuthorId = comment.post.author.toString();
  const isAdmin = userRole === 'admin';
  const isPostAuthor = userRole === 'author' && postAuthorId === userId.toString();

  // Authorization check
  if (!isAdmin && !isPostAuthor) {
    throw AppError.forbidden('Not authorized to moderate this comment');
  }

  // Update status
  if (action === 'approve') {
    if (comment.status === COMMENT_STATUS.APPROVED) {
      throw AppError.badRequest('Comment is already approved');
    }
    comment.status = COMMENT_STATUS.APPROVED;
  } else if (action === 'reject') {
    if (comment.status === COMMENT_STATUS.REJECTED) {
      throw AppError.badRequest('Comment is already rejected');
    }
    comment.status = COMMENT_STATUS.REJECTED;
  } else {
    throw AppError.badRequest('Invalid moderation action');
  }

  await comment.save();
  await comment.populate('author', 'name avatar role');

  // Notify comment author
  try {
    const notificationMessage = action === 'approve'
      ? `Your comment on "${comment.post.title}" has been approved`
      : `Your comment on "${comment.post.title}" was rejected`;

    await createNotification({
      user: comment.author._id,
      title: `Comment ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      message: notificationMessage,
      link: `/posts/${comment.post._id}`,
    });
  } catch (error) {
    logger.error('Failed to create comment moderation notification:', error);
  }

  logger.info(`Comment ${commentId} ${action}ed by ${userId}`);

  return comment;
}

/**
 * Deletes a comment
 */
export async function deleteComment(commentId, userId, userRole) {
  const comment = await Comment.findById(commentId).populate({
    path: 'post',
    select: 'author',
  });

  if (!comment) {
    throw AppError.notFound('Comment not found');
  }

  const postAuthorId = comment.post.author.toString();
  const isAdmin = userRole === 'admin';
  const isPostAuthor = userRole === 'author' && postAuthorId === userId.toString();
  const isCommentOwner = comment.author.toString() === userId.toString();

  // Authorization check
  if (!isAdmin && !isPostAuthor && !isCommentOwner) {
    throw AppError.forbidden('Not authorized to delete this comment');
  }

  // Decrement post comments count if comment was approved
  if (comment.status === COMMENT_STATUS.APPROVED) {
    await Post.findByIdAndUpdate(comment.post._id, { $inc: { commentsCount: -1 } });
  }

  await comment.deleteOne();

  // Log activity
  try {
    await logActivity(userId, ACTIVITY_TYPES.COMMENT_DELETED, `Deleted comment on post ${comment.post._id}`);
  } catch (error) {
    logger.error('Failed to log comment deletion activity:', error);
  }

  logger.info(`Comment ${commentId} deleted by ${userId}`);
}

export default {
  createComment,
  getCommentsByPost,
  countCommentsByPost,
  getPendingComments,
  moderateComment,
  deleteComment,
};
