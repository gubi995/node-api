import { Router } from 'express';
import authController from './controller';
import {
  loginPayloadValidation,
  registrationPayloadValidation,
} from './validation';

const router = Router();

router.post('/login', loginPayloadValidation, authController.login);
router.post(
  '/register',
  registrationPayloadValidation,
  authController.register
);

export default router;
