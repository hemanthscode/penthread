/**
 * Application Constants
 * 
 * Centralized constants used across the application.
 * 
 * @module utils/constants
 */

/**
 * User roles
 */
export const ROLES = Object.freeze({
  ADMIN: 'admin',
  AUTHOR: 'author',
  USER: 'user',
});

/**
 * Post statuses
 */
export const POST_STATUS = Object.freeze({
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
});

/**
 * Comment statuses
 */
export const COMMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
});

/**
 * Activity action types
 */
export const ACTIVITY_TYPES = Object.freeze({
  POST_CREATED: 'post_created',
  POST_PUBLISHED: 'post_published',
  POST_UPDATED: 'post_updated',
  POST_DELETED: 'post_deleted',
  COMMENT_CREATED: 'comment_created',
  COMMENT_DELETED: 'comment_deleted',
  PROFILE_UPDATED: 'profile_updated',
  PASSWORD_CHANGED: 'password_changed',
});

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = Object.freeze({
  POST_APPROVED: 'post_approved',
  POST_REJECTED: 'post_rejected',
  COMMENT_ON_POST: 'comment_on_post',
  COMMENT_APPROVED: 'comment_approved',
  COMMENT_REJECTED: 'comment_rejected',
  POST_LIKED: 'post_liked',
  ROLE_CHANGED: 'role_changed',
});

/**
 * Regex patterns
 */
export const REGEX = Object.freeze({
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MONGODB_ID: /^[0-9a-fA-F]{24}$/,
  URL: /^https?:\/\/.+/,
});

/**
 * HTTP status codes
 */
export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
});

export default {
  ROLES,
  POST_STATUS,
  COMMENT_STATUS,
  ACTIVITY_TYPES,
  NOTIFICATION_TYPES,
  REGEX,
  HTTP_STATUS,
};
