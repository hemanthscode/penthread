// Email config and reusable email sender
import nodemailer from 'nodemailer';
import config from './index.js';

// Secure Gmail SMTP setup
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
 * Sends password reset email
 * @param {{to_name: string, to_email: string, reset_link: string}} templateParams
 */
export async function sendEmail(templateParams) {
  try {
    const mailOptions = {
      from: `"Blog Platform" <${config.emailUser}>`,
      to: templateParams.to_email,
      subject: 'Password Reset Request',
      html: `
        <p>Hello ${templateParams.to_name || 'User'},</p>
        <p>You requested a password reset. Click below to reset your password:</p>
        <a href="${templateParams.reset_link}" 
           style="display:inline-block;padding:10px 20px;background-color:#007bff;color:white;text-decoration:none;border-radius:6px;">
           Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this message.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${templateParams.to_email}`);
    return 200;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}
