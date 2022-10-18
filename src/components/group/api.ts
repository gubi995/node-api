import { Router } from 'express';

import {
  getByIdValidation,
  createValidation,
  updateValidation,
  deleteValidation,
} from './validation';
import groupController from './controller';

const router = Router();

router.get('/:id', ...getByIdValidation, groupController.getById);
router.get('', groupController.getAll);
router.post('', ...createValidation, groupController.create);
router.put('/:id', ...updateValidation, groupController.update);
router.delete('/:id', ...deleteValidation, groupController.delete);

export default router;
