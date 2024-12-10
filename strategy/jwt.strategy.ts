import JwtStrategy from 'passport-jwt';
import jwt from 'jsonwebtoken';

import db from '../services/db.service';

const jwtStrategy = JwtStrategy.Strategy;
const extractJwt = JwtStrategy.ExtractJwt;

const opts = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

// Used by the authenticated requests to deserialize the user,
// i.e., to fetch user details from the JWT.
export const jwtPassportStrategy = new jwtStrategy(
  opts,
  async (jwt_payload, done) => {
    try {
      // Check against the DB only if necessary.
      // This can be avoided if you don't want to fetch user details in each request.
      const user = await db.user.findUnique({
        where: {
          id: jwt_payload.id,
        },
        omit: { password: true, refreshToken: true },
      });
      if (!user) {
        return done(
          new AppError('Incorrect information', {
            status: 401,
          }),
          false,
        );
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);

export const getToken = (user: any) => {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: eval(process.env.SESSION_EXPIRY as string) * 1000,
  });
};

export const getRefreshToken = (user: any) => {
  const refreshToken = jwt.sign(
    user,
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY as string) * 1000,
    },
  );
  return refreshToken;
};
