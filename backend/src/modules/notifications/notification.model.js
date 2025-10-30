import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const notificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 150 },
  message: { type: String, required: true, maxlength: 1000 },
  isRead: { type: Boolean, default: false },
  link: { type: String, default: '' }, // Optional related URL
}, { timestamps: true });

notificationSchema.index({ user: 1, createdAt: -1 });

export default model('Notification', notificationSchema);
