import * as userService from './user.service.js';

export async function getUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.userId, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await userService.deleteUser(req.params.userId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const user = await userService.getUserById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updatedUser = await userService.updateProfile(req.user._id, req.body);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
}

export async function updateRole(req, res, next) {
  try {
    const updatedUser = await userService.updateUserRole(req.params.userId, req.body.role);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const updatedUser = await userService.updateUserStatus(req.params.userId, req.body.isActive);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
}
