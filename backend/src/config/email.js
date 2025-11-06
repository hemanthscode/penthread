/**
 * Email Service Module
 * 
 * Handles email sending with nodemailer.
 * Supports HTML templates and error handling.
 * 
 * @module config/email
 */

import nodemailer from 'nodemailer';
import config from './index.js';
import logger from './logger.js';

/**
 * Email transporter instance
 */
let transporter = null;

/**
 * Initializes email transporter
 * @returns {Object} Nodemailer transporter
 */
function getTransporter() {
  if (!transporter) {
    if (!config.email.user || !config.email.password) {
      logger.warn('Email credentials not configured. Email functionality disabled.');
      return null;
    }

    transporter = nodemailer.createTransport({
      service: config.email.service,
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });

    logger.info('Email transporter initialized');
  }

  return transporter;
}

/**
 * Sends an email
 * @param {Object} options - Email options
 * @param {string} options.to_email - Recipient email
 * @param {string} options.to_name - Recipient name
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @returns {Promise<Object>} Email send result
 */
export async function sendEmail({ to_email, to_name, subject, html, text }) {
  const emailTransporter = getTransporter();
  
  if (!emailTransporter) {
    logger.error('Cannot send email: transporter not configured');
    throw new Error('Email service not configured');
  }

  try {
    const mailOptions = {
      from: config.email.from,
      to: `"${to_name}" <${to_email}>`,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const info = await emailTransporter.sendMail(mailOptions);
    
    logger.info(`Email sent successfully to ${to_email}`, { messageId: info.messageId });
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    logger.error(`Email sending failed to ${to_email}:`, error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

/**
 * Sends password reset email
 * @param {Object} params - Email parameters
 * @param {string} params.to_name - Recipient name
 * @param {string} params.to_email - Recipient email
 * @param {string} params.reset_link - Password reset link
 * @returns {Promise<Object>} Email send result
 */
export async function sendPasswordResetEmail({ to_name, to_email, reset_link }) {
  const subject = 'Password Reset Request - Blog Platform';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          background-color: #21808D; 
          color: #ffffff; 
          text-decoration: none; 
          border-radius: 6px;
          font-weight: bold;
        }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hello ${to_name || 'User'},</p>
        <p>You requested a password reset for your account. Click the button below to reset your password:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${reset_link}" class="button">Reset Password</a>
        </p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you did not request this reset, please ignore this email and your password will remain unchanged.</p>
        <p>For security reasons, never share this link with anyone.</p>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Blog Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to_email, to_name, subject, html });
}

/**
 * Sends welcome email to new users
 * @param {Object} params - Email parameters
 * @param {string} params.to_name - Recipient name
 * @param {string} params.to_email - Recipient email
 * @returns {Promise<Object>} Email send result
 */
export async function sendWelcomeEmail({ to_name, to_email }) {
  const subject = 'Welcome to Blog Platform!';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Welcome to Blog Platform! 🎉</h2>
        <p>Hello ${to_name},</p>
        <p>Thank you for joining our community! Your account has been successfully created.</p>
        <p>You can now:</p>
        <ul>
          <li>Create and publish blog posts</li>
          <li>Interact with other users' content</li>
          <li>Build your author profile</li>
        </ul>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Happy blogging!</p>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Blog Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to_email, to_name, subject, html });
}

export default { sendEmail, sendPasswordResetEmail, sendWelcomeEmail };
