import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const postSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'published', 'unpublished'],
    default: 'draft',
  },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  likesCount: { type: Number, default: 0 },
  favoritesCount: { type: Number, default: 0 },
  viewsCount: { type: Number, default: 0 },
}, { timestamps: true });

// Text index for efficient search
postSchema.index({ title: 'text', content: 'text' });

export default model('Post', postSchema);
