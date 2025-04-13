import { Request, Response, NextFunction } from 'express';
import { reIssueAccessToken, verifyJWT } from '../utils/auth.utils';

export const jwtAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies?.access;
  const refreshToken = req.cookies?.refresh;

  if (!accessToken) {
    throw new AppError('Unauthorized', { status: 401 });
  }

  const { decoded, expired } = verifyJWT(accessToken);

  if (decoded) {
    req.user = decoded;
    next();
    return;
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken(refreshToken);
    res.cookie('access', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    const result = verifyJWT(newAccessToken);
    if (result.decoded) req.user = result.decoded;
    next();
    return;
  }

  throw new AppError('Unauthorized', { status: 401 });
};
