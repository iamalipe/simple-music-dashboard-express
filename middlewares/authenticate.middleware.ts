import { Request, Response, NextFunction } from 'express';

import passport from '../config/passport.config';

// Single combined middleware
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (!refreshToken)
    throw new AppError('Unauthorized, refreshToken', { status: 401 });

  // Proceed to authentication using Passport
  passport.authenticate('jwt', { session: false })(req, res, next);
};

export default authenticate;
