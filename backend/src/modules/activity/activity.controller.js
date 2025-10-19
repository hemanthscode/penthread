import * as activityService from './activity.service.js';

export async function getActivities(req, res, next) {
  try {
    const activities = await activityService.getAllActivities();
    res.json(activities);
  } catch (err) {
    next(err);
  }
}

export async function getUserActivities(req, res, next) {
  try {
    const userId = req.params.userId;
    const activities = await activityService.getUserActivities(userId);
    res.json(activities);
  } catch (err) {
    next(err);
  }
}
