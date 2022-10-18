import { Router } from 'express';

import {
  getByIdValidation,
  createValidation,
  updateValidation,
  deleteValidation,
  getAutoSuggestUsersValidation,
} from './validation';
import userController from './controller';

const router = Router();

router.get(
  '/auto-suggestion',
  ...getAutoSuggestUsersValidation,
  userController.getAutoSuggestions
);
router.get('/:id', ...getByIdValidation, userController.getById);
router.get('', userController.getAll);
router.post('', ...createValidation, userController.create);
router.put('/:id', ...updateValidation, userController.update);
router.delete('/:id', ...deleteValidation, userController.delete);

export default router;
