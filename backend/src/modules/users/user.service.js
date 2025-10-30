import User from './user.model.js';

const ROLES = ['admin', 'author', 'user'];

/**
 * Get all users without passwords
 */
export async function getAllUsers() {
  return User.find().select('-password');
}

/**
 * Get single user by ID without password
 */
export async function getUserById(userId) {
  return User.findById(userId).select('-password');
}

/**
 * Update allowed user fields (admin-level)
 */
export async function updateUser(userId, updateData) {
  const allowedUpdates = ['name', 'email', 'role', 'isActive'];
  const updates = Object.keys(updateData).filter(field => allowedUpdates.includes(field));
  const user = await User.findById(userId);

  if (!user) throw new Error('User not found');

  updates.forEach(field => {
    user[field] = updateData[field];
  });

  await user.save();
  return user;
}

/**
 * Delete a user by ID
 */
export async function deleteUser(userId) {
  const result = await User.findByIdAndDelete(userId);
  if (!result) throw new Error('User not found or already deleted');
  return result;
}

/**
 * Update own profile (name and email)
 */
export async function updateProfile(userId, profileData) {
  const allowedUpdates = ['name', 'email'];
  const updates = Object.keys(profileData).filter(field => allowedUpdates.includes(field));
  const user = await User.findById(userId);

  if (!user) throw new Error('User not found');

  updates.forEach(field => {
    user[field] = profileData[field];
  });

  await user.save();
  return user;
}

/**
 * Update user's role (admin only)
 */
export async function updateUserRole(userId, newRole) {
  if (!ROLES.includes(newRole)) throw new Error('Invalid role');
  const user = await User.findById(userId);

  if (!user) throw new Error('User not found');

  user.role = newRole;
  await user.save();
  return user;
}

/**
 * Update user's active status (admin only)
 */
export async function updateUserStatus(userId, isActive) {
  const user = await User.findById(userId);

  if (!user) throw new Error('User not found');

  user.isActive = isActive;
  await user.save();
  return user;
}
