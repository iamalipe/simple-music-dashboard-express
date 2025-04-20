import { Request, Response } from 'express';
import { loginSchemaType, registerSchemaType } from './auth.schema';
import db from '../../services/db.services';
import {
  hashPassword,
  comparePassword,
  generateJWT,
  generateRefreshJWT,
} from '../../utils/auth.utils';
import { databaseResponseTimeHistogram } from '../../utils/metrics.utils';
import {
  createSession,
  createUser,
  getUserByEmail,
  getUserById,
} from './auth.service';

const registerController = async (req: Request, res: Response) => {
  const body = req.body as registerSchemaType['body'];

  const passwordHash = await hashPassword(body.password);
  const result = await createUser({
    email: body.email,
    password: passwordHash,
  });

  // Create token
  // const timer2 = databaseResponseTimeHistogram.startTimer();
  const sessionInfo = await createSession({
    userId: result.id,
    expiresAt: new Date(), // FIXME expiresAt
    valid: true,
  });

  const userInfo = await getUserById(result.id);
  const refreshToken = generateRefreshJWT({ id: sessionInfo.id });
  const token = generateJWT(userInfo!);

  // Set cookie
  res.cookie('access', token, {
    httpOnly: true,
    sameSite: 'strict',
  });
  res.cookie('refresh', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
  });

  res.status(201).json({ success: true, data: result });
};
const loginController = async (req: Request, res: Response) => {
  const body = req.body as loginSchemaType['body'];

  const result = await getUserByEmail(body.email);

  if (!result)
    throw new AppError('user not found', { status: 404, path: 'email' });
  if (!result.password)
    throw new AppError('password not found', { status: 404, path: 'password' });
  const verifyResult = await comparePassword(result.password, body.password);
  if (!verifyResult) throw new Error('password is wrong');

  const sessionInfo = await createSession({
    userId: result.id,
    expiresAt: new Date(), // FIXME expiresAt
    valid: true,
  });
  const userInfo = await getUserById(result.id);

  const refreshToken = generateRefreshJWT({ id: sessionInfo.id });
  const token = generateJWT(userInfo!);

  // Set cookie
  res.cookie('access', token, {
    httpOnly: true,
    sameSite: 'strict',
  });
  res.cookie('refresh', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
  });

  res.status(200).json({ success: true, data: result });
};

const getCurrentUser = (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    res.sendStatus(401);
    return;
  }

  res.status(200).json({ success: true, data: user });
};

export default {
  registerController,
  loginController,
  getCurrentUser,
};
