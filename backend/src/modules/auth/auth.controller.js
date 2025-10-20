import * as authService from './auth.service.js';
import { sendEmail } from '../../config/email.js';
import User from './auth.model.js';

export async function register(req, res, next) {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ message: 'User registered', userId: user._id });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const user = await authService.loginUser(req.body.email, req.body.password);
    const tokens = await authService.createTokens(user);
    res.json({ userId: user._id, role: user.role, tokens });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  // Stateless JWT logout - just client side removal
  res.status(200).json({ message: 'Logged out' });
}

export async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const payload = await authService.verifyRefreshToken(refreshToken);
    const user = { _id: payload.id, role: payload.role };
    const tokens = await authService.createTokens(user);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { user, resetToken } = await authService.generatePasswordResetToken(req.body.email);

    // Send email with nodemailer
    await sendEmail({
      to_name: user.name,
      to_email: user.email,
      reset_link: `https://yourfrontend.com/reset-password?token=${resetToken}`,
    });

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const user = req.user; 
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const userFromToken = req.user;
    const user = await User.findById(userFromToken._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { currentPassword, newPassword } = req.body;
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
}
