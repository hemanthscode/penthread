import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const interactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  liked: { type: Boolean, default: false },
  favorited: { type: Boolean, default: false },
}, { timestamps: true });

interactionSchema.index({ user: 1, post: 1 }, { unique: true });

export default model('Interaction', interactionSchema);
