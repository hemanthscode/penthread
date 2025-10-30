import * as activityService from './activity.service.js';

export async function getActivities(req, res, next) {
  try {
    const activities = await activityService.getUserActivities(req.user._id);
    res.json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
}
