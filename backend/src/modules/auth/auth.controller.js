import * as authService from './auth.service.js';
import { sendEmail } from '../../config/email.js';
import User from './auth.model.js';

export async function register(req, res, next) {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ success: true, message: 'User registered successfully', userId: user._id });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const user = await authService.loginUser(req.body.email, req.body.password);
    const tokens = await authService.createTokens(user);
    res.json({ success: true, userId: user._id, role: user.role, tokens });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  // For stateless JWT, logout handled client-side by token discard or blacklisting (if implemented)
  res.status(200).json({ success: true, message: 'Logged out successfully' });
}

export async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const payload = await authService.verifyRefreshToken(refreshToken);
    const user = { _id: payload.id, role: payload.role };
    const tokens = await authService.createTokens(user);
    res.json({ success: true, tokens });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { user, resetToken } = await authService.generatePasswordResetToken(req.body.email);
    
    // Email sending is a side effect; can be async but here await for assured delivery
    // await sendEmail({
    //   to_name: user.name,
    //   to_email: user.email,
    //   reset_link: `https://yourfrontend.com/reset-password?token=${resetToken}`,
    // });

    res.json({
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
      resetToken, 
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const { _id, name, email, role } = req.user;
    res.json({ success: true, data: { id: _id, name, email, role } });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const userFromToken = req.user;
    const user = await User.findById(userFromToken._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { currentPassword, newPassword } = req.body;
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
}
