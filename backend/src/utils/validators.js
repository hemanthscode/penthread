/**
 * Validation Utilities
 * 
 * Common validation functions used across the application.
 * 
 * @module utils/validators
 */

import { REGEX } from './constants.js';

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} Validation result
 */
export function isValidEmail(email) {
  return REGEX.EMAIL.test(email);
}

/**
 * Validates MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} Validation result
 */
export function isValidObjectId(id) {
  return REGEX.MONGODB_ID.test(id);
}

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Validation result
 */
export function isValidUrl(url) {
  return REGEX.URL.test(url);
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with message
 */
export function validatePasswordStrength(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return {
      valid: false,
      message: `Password must be at least ${minLength} characters long`,
    };
  }

  const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
    .filter(Boolean).length;

  if (strengthScore < 3) {
    return {
      valid: false,
      message: 'Password must contain at least 3 of: uppercase, lowercase, numbers, special characters',
    };
  }

  return { valid: true, message: 'Password is strong' };
}

/**
 * Sanitizes string input to prevent XSS
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export default {
  isValidEmail,
  isValidObjectId,
  isValidUrl,
  validatePasswordStrength,
  sanitizeString,
};
