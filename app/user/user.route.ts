import express from 'express';
import userController from './user.controller';
import { validate } from '../../middlewares/validate.middleware';
import { updateUserSchema } from './user.schema';

const userRouter = express.Router();

userRouter.get('/', userController.getUser);

userRouter.put('/', validate(updateUserSchema), userController.updateUser);

export default userRouter;
