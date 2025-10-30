import { Router } from 'express';
import * as categoryController from './category.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { createCategorySchema, updateCategorySchema } from './category.validators.js';

const router = Router();

// Public read endpoints
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

// Protected create/update by admin or author; delete only by admin
router.post('/', authMiddleware(['admin', 'author']), validate(createCategorySchema), categoryController.createCategory);
router.patch('/:id', authMiddleware(['admin', 'author']), validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', authMiddleware(['admin']), categoryController.deleteCategory);

export default router;
