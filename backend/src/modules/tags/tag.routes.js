import { Router } from 'express';
import * as tagController from './tag.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { createTagSchema, updateTagSchema } from './tag.validators.js';

const router = Router();

router.get('/', tagController.getTags);
router.get('/:id', tagController.getTag);

router.post('/', authMiddleware(['admin', 'author']), validate(createTagSchema), tagController.createTag);
router.patch('/:id', authMiddleware(['admin', 'author']), validate(updateTagSchema), tagController.updateTag);
router.delete('/:id', authMiddleware(['admin']), tagController.deleteTag);

export default router;
