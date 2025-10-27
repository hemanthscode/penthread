// Mongoose Tag schema for post categorization
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const tagSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 50 },
}, { timestamps: true });

// Optionally add index for quick lookup
tagSchema.index({ name: 1 });

export default model('Tag', tagSchema);
