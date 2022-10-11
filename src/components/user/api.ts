import { Router } from 'express';

import {
  getUserById,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from './controller';

const router = Router();

router.get('/:id', getUserById);
router.get('', getUsers);
router.post('', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
