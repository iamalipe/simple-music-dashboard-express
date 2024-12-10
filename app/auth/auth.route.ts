import express from 'express';

import passport from '../../config/passport.config';
import controller from './auth.controller';
import authenticate from '../../middlewares/authenticate.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { registerSchema, loginSchema } from './auth.schema';

const authRouter = express.Router();

authRouter.post(
  '/login',
  validate(loginSchema),
  passport.authenticate('local', { session: false }),
  controller.login,
);

authRouter.post('/register', validate(registerSchema), controller.register);
authRouter.post('/refreshToken', controller.renewRefreshToken);
authRouter.get('/logout', authenticate, controller.logout);
authRouter.get('/me', authenticate, controller.getCurrentUser);

authRouter.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
);

authRouter.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  controller.login,
);

export default authRouter;
