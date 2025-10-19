import Category from './category.model.js';

export async function createCategory(data) {
  const category = new Category(data);
  await category.save();
  return category;
}

export async function getAllCategories() {
  return Category.find().sort({ name: 1 });
}

export async function getCategoryById(categoryId) {
  return Category.findById(categoryId);
}

export async function updateCategory(categoryId, updateData) {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error('Category not found');

  Object.assign(category, updateData);
  await category.save();
  return category;
}

export async function deleteCategory(categoryId) {
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) throw new Error('Category not found or already deleted');
  return category;
}
