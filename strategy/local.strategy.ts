import LocalStrategy from 'passport-local';

import db from '../services/db.service';

const localStrategy = LocalStrategy.Strategy;

export const localPassportStrategy = new localStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await db.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return done(
          new AppError('Incorrect email', {
            path: 'email',
            status: 401,
          }),
          false,
        );
      }
      // Check password with bcrypt or argon2
      if (user.password !== password) {
        return done(
          new AppError('Incorrect password', {
            path: 'password',
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
