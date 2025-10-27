// Mongoose schema for logging user activities/actions
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  details: { type: String, trim: true },
}, { timestamps: true });

export default model('Activity', activitySchema);
