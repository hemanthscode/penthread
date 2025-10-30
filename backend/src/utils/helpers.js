/**
 * Validate email format using robust regex
 * @param {string} email Email string to validate
 * @returns {boolean} Validity
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
