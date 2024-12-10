import passport from 'passport';
import { CookieOptions } from 'express';

import { localPassportStrategy } from '../strategy/local.strategy';
import { jwtPassportStrategy } from '../strategy/jwt.strategy';
import { gitHubPassportStrategy } from '../strategy/github.strategy';
import db from '../services/db.service';

passport.use('local', localPassportStrategy);
passport.use('jwt', jwtPassportStrategy);
passport.use('github', gitHubPassportStrategy);

passport.serializeUser((user, done) => {
  console.log('serializeUser', user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log('deserializeUser', id);

    const _id = id as string | undefined;
    if (!_id) return done(null, null);
    const user = await db.user.findUnique({
      where: { id: _id },
      omit: { password: true, refreshToken: true },
    });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const dev = process.env.NODE_ENV !== 'production';
export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  // Since localhost is not having https protocol,
  // secure cookies do not work correctly (in postman)
  secure: !dev,
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY as string) * 1000,
  sameSite: 'none',
};

export default passport;
