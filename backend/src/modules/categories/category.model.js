// Mongoose schema for blog categories
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 300 },
}, { timestamps: true });

// Optional: add index for search optimization
categorySchema.index({ name: 1 });

export default model('Category', categorySchema);
