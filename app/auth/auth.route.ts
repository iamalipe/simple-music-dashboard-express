import express from 'express';
import authController from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  registerSchema,
  loginSchema,
  usernameCheckSchema,
} from './auth.schema';

const authRouter = express.Router();
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post(
  '/username-check',
  validate(usernameCheckSchema),
  authController.usernameCheck,
);

authRouter.post('/register', validate(registerSchema), authController.register);

export default authRouter;
