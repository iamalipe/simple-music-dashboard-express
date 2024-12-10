import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { getToken, getRefreshToken } from '../../strategy/jwt.strategy';
import { COOKIE_OPTIONS } from '../../config/passport.config';
import db from '../../services/db.service';
import { registerSchemaType } from './auth.schema';
import { PublicUser } from '../../types/PublicUser.type';

const login = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) throw new AppError('Unauthorized', { status: 401 });

  const token = getToken(user);
  const refreshToken = getRefreshToken(user);

  await db.user.update({
    where: { id: user.id },
    data: {
      refreshToken: {
        push: refreshToken,
      },
    },
  });
  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  res.send({ success: true, token, refreshToken });
};

const register = async (req: Request, res: Response) => {
  const body = req.body as registerSchemaType['body'];

  // TODO encrypt/hash password
  const userReturn = await db.user.create({
    data: {
      email: body.email,
      password: body.password,
      name: body.name,
    },
    omit: { password: true },
  });

  const token = getToken(userReturn);
  const refreshToken = getRefreshToken(userReturn);

  await db.user.update({
    where: { id: userReturn.id },
    data: {
      refreshToken: {
        push: refreshToken,
      },
    },
  });

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  res.status(200).json({ success: true, token });
};

const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', { status: 401 });

  const data = await db.user.findUnique({
    where: {
      id: req.user.id,
    },
    omit: { password: true, refreshToken: true },
  });

  if (!data)
    throw new AppError('something went wrong, user not found', { status: 401 });

  res.status(200).json({ data: data, success: true });
};

const renewRefreshToken = async (req: Request, res: Response) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (!refreshToken)
    throw new AppError('Unauthorized', {
      status: 401,
    });

  const payload = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
  ) as PublicUser | undefined;

  if (!payload)
    throw new AppError('Unauthorized', {
      status: 401,
    });

  const userId = payload.id;

  const user = await db.user.findUnique({
    where: {
      id: userId,
      refreshToken: {
        has: refreshToken,
      },
    },
    omit: { password: true, refreshToken: true },
  });
  if (!user)
    throw new AppError('Unauthorized', {
      status: 401,
    });

  const token = getToken(user);
  // If the refresh token exists, then create new one and replace it.
  const newRefreshToken = getRefreshToken(user);

  await db.user.update({
    where: { id: user.id },
    data: {
      refreshToken: {
        push: newRefreshToken,
      },
    },
  });

  res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
  res.status(200).json({ success: true, token });
};

const logout = async (req: Request, res: Response) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (!refreshToken)
    throw new AppError('Unauthorized', {
      status: 401,
    });

  const payload = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
  ) as PublicUser | undefined;

  if (!payload)
    throw new AppError('Unauthorized', {
      status: 401,
    });
  const userId = payload.id;

  const user = await db.user.findUnique({
    where: {
      id: userId,
      refreshToken: {
        has: refreshToken,
      },
    },
  });

  if (!user)
    throw new AppError('Unauthorized', {
      status: 401,
    });

  await db.user.update({
    where: { id: user.id },
    data: { refreshToken: { set: [] } },
  });

  res.clearCookie('refreshToken');
  res.status(200).send({ success: true });
};

export default {
  login,
  register,
  getCurrentUser,
  renewRefreshToken,
  logout,
};
