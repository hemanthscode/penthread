import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 300 },
}, { timestamps: true });

// Index name for faster lookup and uniqueness enforcement
categorySchema.index({ name: 1 }, { unique: true });

export default model('Category', categorySchema);
