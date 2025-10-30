import nodemailer from 'nodemailer';
import config from './index.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});

/**
 * Send an email for password reset
 * @param {Object} params
 * @param {string} params.to_name Recipient's display name
 * @param {string} params.to_email Recipient's email address
 * @param {string} params.reset_link Reset URL link
 */
export async function sendEmail({ to_name, to_email, reset_link }) {
  try {
    const mailOptions = {
      from: `"Blog Platform" <${config.emailUser}>`,
      to: to_email,
      subject: 'Password Reset Request',
      html: `
        <p>Hello ${to_name || 'User'},</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${reset_link}" 
           style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:6px;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to_email}`);
    return 200;
  } catch (error) {
    logger.error(`Email sending failed: ${error.message}`);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}
