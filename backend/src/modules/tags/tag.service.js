import Tag from './tag.model.js';

/**
 * Create a new tag
 */
export async function createTag(data) {
  const tag = new Tag(data);
  await tag.save();
  return tag;
}

/**
 * Get all tags sorted by name
 */
export async function getAllTags() {
  return Tag.find().sort({ name: 1 });
}

/**
 * Get tag by ID
 */
export async function getTagById(tagId) {
  return Tag.findById(tagId);
}

/**
 * Update tag
 */
export async function updateTag(tagId, updateData) {
  const tag = await Tag.findById(tagId);
  if (!tag) throw new Error('Tag not found');

  Object.assign(tag, updateData);
  await tag.save();

  return tag;
}

/**
 * Delete tag
 */
export async function deleteTag(tagId) {
  const tag = await Tag.findByIdAndDelete(tagId);
  if (!tag) throw new Error('Tag not found or already deleted');
  return tag;
}
