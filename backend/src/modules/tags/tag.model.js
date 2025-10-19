import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const tagSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 50 },
}, { timestamps: true });

export default model('Tag', tagSchema);
