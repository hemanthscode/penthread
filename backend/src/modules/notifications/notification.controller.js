import * as notificationService from './notification.service.js';

export async function getNotifications(req, res, next) {
  try {
    const notifications = await notificationService.getUserNotifications(req.user._id);
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    await notificationService.markAllAsRead(req.user._id);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
}

export async function deleteNotification(req, res, next) {
  try {
    await notificationService.deleteNotification(req.params.id, req.user._id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
}
