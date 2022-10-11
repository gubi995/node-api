import { Router } from 'express';

import {
  getByIdValidation,
  createValidation,
  updateValidation,
  deleteValidation,
  getAutoSuggestUsersValidation,
} from './validation';
import {
  getUserById,
  getUsers,
  getAutoSuggestUsers,
  createUser,
  updateUser,
  deleteUser,
} from './controller';

const router = Router();

router.get(
  '/auto-suggestion',
  ...getAutoSuggestUsersValidation,
  getAutoSuggestUsers
);
router.get('/:id', ...getByIdValidation, getUserById);
router.get('', getUsers);
router.post('', ...createValidation, createUser);
router.put('/:id', ...updateValidation, updateUser);
router.delete('/:id', ...deleteValidation, deleteUser);

export default router;
