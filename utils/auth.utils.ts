import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import {
  JWT_EXPIRY,
  JWT_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from '../config/default';
import { User } from '@prisma/client';
import db from '../services/db.services';
import { PublicUser } from '../types/PublicUser.type';

export const hashPassword = async (password: string) => {
  const hash = await argon2.hash(password);
  return hash;
};

export const comparePassword = async (hash: string, password: string) => {
  const result = await argon2.verify(hash, password);
  return result;
};

export const generateJWT = (payload: { [key: string]: any }) => {
  const options: any = { expiresIn: JWT_EXPIRY };
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
};
export const generateRefreshJWT = (payload: { [key: string]: any }) => {
  const options: any = { expiresIn: REFRESH_TOKEN_EXPIRY };
  const token = jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
  return token;
};

export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as PublicUser;
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err: any) {
    return {
      valid: false,
      expired: err.message === 'jwt expired',
      decoded: null,
    };
  }
};
export const verifyRefreshJWT = (token: string) => {
  try {
    // return sessionId
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { id: string };
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err: any) {
    return {
      valid: false,
      expired: err.message === 'jwt expired',
      decoded: null,
    };
  }
};

export const reIssueAccessToken = async (refreshToken: string) => {
  const { decoded } = verifyRefreshJWT(refreshToken);

  if (!decoded) throw new AppError('session expired', { status: 401 });

  const sessionInfo = await db.session.findFirst({
    where: {
      id: decoded.id,
      valid: true,
      // expiresAt: { gte: new Date() }, // FIXME expiresAt
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });

  if (!sessionInfo) throw new AppError('session expired', { status: 401 });

  const accessToken = generateJWT(sessionInfo.user);

  return accessToken;
};
