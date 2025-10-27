// Mongoose schema for user notifications
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const notificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 150 },
  message: { type: String, required: true, maxlength: 1000 },
  isRead: { type: Boolean, default: false },
  link: { type: String, default: '' }, // Optional link related to notification
}, { timestamps: true });

export default model('Notification', notificationSchema);
