import nodemailer from 'nodemailer';
import config from './index.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});

/**
 * Send email with given template parameters.
 * @param {{to_name:string, to_email:string, reset_link:string}} templateParams
 */
export async function sendEmail(templateParams) {
  const mailOptions = {
    from: `"Blog Platform" <${config.emailUser}>`,
    to: templateParams.to_email,
    subject: 'Password Reset Request',
    html: `
      <p>Hello ${templateParams.to_name},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${templateParams.reset_link}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
  return 200;
}
