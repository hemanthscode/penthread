export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const ROLES = Object.freeze({
  ADMIN: 'admin',
  AUTHOR: 'author',
  USER: 'user',
});

export const POST_STATUS = Object.freeze({
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
});

export const COMMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
});

export const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  POSTS: '/posts',
  POST_DETAIL: '/posts/:id',
  CREATE_POST: '/posts/create',
  EDIT_POST: '/posts/edit/:id',
  CATEGORIES: '/categories',
  TAGS: '/tags',
  USERS: '/users',
  NOTIFICATIONS: '/notifications',
});

export const STORAGE_KEYS = Object.freeze({
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
});

export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
});
