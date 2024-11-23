import { Request, Response } from 'express';
import userService from '../user/user.service';
import { db } from '../../services/db.service';
import jwt from 'jsonwebtoken';
import {
  registerSchemaType,
  loginSchemaType,
  usernameCheckSchemaType,
} from './auth.schema';
import * as argon2 from 'argon2';

// POST /login
const login = async (req: Request, res: Response) => {
  const payload = req.body as loginSchemaType['body'];

  const userReturn = await db.user.findUnique({
    where: { username: payload.username },
  });

  if (!userReturn) throw new OError('wrong username', { path: 'username' });

  const isPasswordValid = await argon2.verify(
    userReturn.password,
    payload.password,
  );
  if (!isPasswordValid)
    throw new OError('Invalid password', { path: 'password' });

  const userReturnWithoutPassword = { ...userReturn, password: undefined };

  const token = jwt.sign(
    userReturnWithoutPassword,
    process.env.JWT_SECRET as string,
    {
      expiresIn: eval(process.env.SESSION_EXPIRY as string),
    },
  );

  res
    .status(200)
    .json({ success: true, token, data: userReturnWithoutPassword });
};

const usernameCheck = async (req: Request, res: Response) => {
  const payload = req.body as usernameCheckSchemaType['body'];
  const userReturn = await db.user.findUnique({
    where: { username: payload.username },
  });

  if (userReturn)
    throw new OError('Username not available', {
      path: 'username',
      status: 200,
    });

  res
    .status(200)
    .json({ success: true, message: 'Username available', errors: [] });
};

const register = async (req: Request, res: Response) => {
  const payload = req.body as registerSchemaType['body'];
  const usernameReturn = await db.user.findUnique({
    where: { username: payload.username },
  });
  if (usernameReturn)
    throw new OError('Username not available', {
      path: 'username',
    });

  const hash = await argon2.hash(payload.password);

  const userReturn = await userService.createUser({
    ...payload,
    password: hash,
  });

  if (!userReturn) throw new OError('Failed to register');

  const token = jwt.sign(userReturn, process.env.JWT_SECRET as string, {
    expiresIn: eval(process.env.SESSION_EXPIRY as string),
  });

  res.status(201).json({ success: true, token, data: userReturn });
};

const authController = {
  login,
  register,
  usernameCheck,
};

export default authController;
