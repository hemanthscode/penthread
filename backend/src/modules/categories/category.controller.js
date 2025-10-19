import * as categoryService from './category.service.js';

export async function createCategory(req, res, next) {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export async function getCategories(req, res, next) {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function getCategory(req, res, next) {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
}
