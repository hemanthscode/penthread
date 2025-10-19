import Activity from './activity.model.js';

export async function logActivity(data) {
  const activity = new Activity(data);
  await activity.save();
  return activity;
}

export async function getAllActivities() {
  return Activity.find()
    .populate('user', 'name email role')
    .sort({ createdAt: -1 })
    .limit(100); // limit for performance
}

export async function getUserActivities(userId) {
  return Activity.find({ user: userId })
    .populate('user', 'name email role')
    .sort({ createdAt: -1 });
}
