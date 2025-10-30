import Category from './category.model.js';

/**
 * Create a new category
 */
export async function createCategory(data) {
  const category = new Category(data);
  await category.save();
  return category;
}

/**
 * Get all categories sorted by name
 */
export async function getAllCategories() {
  return Category.find().sort({ name: 1 });
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(categoryId) {
  return Category.findById(categoryId);
}

/**
 * Update category
 */
export async function updateCategory(categoryId, updateData) {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error('Category not found');

  Object.assign(category, updateData);
  await category.save();

  return category;
}

/**
 * Delete category
 */
export async function deleteCategory(categoryId) {
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) throw new Error('Category not found or already deleted');
  return category;
}
