import express from 'express';
import controller from './auth.controller';
import { validate } from '../../middlewares/validate.middlewares';
import { loginSchema, registerSchema } from './auth.schema';
import { jwtAuth } from '../../middlewares/jwtAuth.middlewares';

const router = express.Router();
router.post('/login', validate(loginSchema), controller.loginController);
router.post(
  '/register',
  validate(registerSchema),
  controller.registerController,
);
router.get('/me', jwtAuth, controller.getCurrentUser);

export default router;
