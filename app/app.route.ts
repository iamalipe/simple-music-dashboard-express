import express from 'express';
import userRouter from './user/user.route';
import authRouter from './auth/auth.route';
import { authenticate } from '../middlewares/authenticate.middleware';

const appRouter = express.Router();

appRouter.use('/user', authenticate, userRouter);
appRouter.use('/auth', authRouter);

export default appRouter;
