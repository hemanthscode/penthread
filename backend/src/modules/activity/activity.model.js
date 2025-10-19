import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  resource: { type: String },
  resourceId: { type: Schema.Types.ObjectId },
  ipAddress: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

export default model('Activity', activitySchema);
