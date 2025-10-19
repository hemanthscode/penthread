import User from './user.model.js';

export async function getAllUsers() {
  return User.find().select('-password');
}

export async function getUserById(userId) {
  return User.findById(userId).select('-password');
}

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

export async function deleteUser(userId) {
  const result = await User.findByIdAndDelete(userId);
  if (!result) {
    throw new Error('User not found or already deleted');
  }
  return result;
}

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

export async function updateUserRole(userId, newRole) {
  const roles = ['admin', 'author', 'user'];
  if (!roles.includes(newRole)) throw new Error('Invalid role');
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.role = newRole;
  await user.save();
  return user;
}

export async function updateUserStatus(userId, isActive) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.isActive = isActive;
  await user.save();
  return user;
}
