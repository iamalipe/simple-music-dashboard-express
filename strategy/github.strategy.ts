import GitHubStrategy from 'passport-github2';

import db from '../services/db.service';

const gitHubStrategy = GitHubStrategy.Strategy;

const opts = {
  clientID: process.env.GITHUB_CLIENT_ID as string,
  clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  callbackURL: 'http://localhost:3010/api/auth/github/callback',
  // callbackURL: process.env.GITHUB_CALLBACK_URL
};

export const gitHubPassportStrategy = new gitHubStrategy(
  opts,
  // @ts-ignore
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const user = await db.user.findFirst({
        where: {
          githubId: profile.id,
        },
        omit: { password: true, refreshToken: true },
      });

      if (!user) {
        const newUser = await db.user.create({
          data: {
            githubId: profile.id,
            name: profile.displayName,
            profileImageUrl: profile._json.avatar_url,
            email: profile._json.email,
          },
          omit: { password: true, refreshToken: true },
        });

        return done(null, newUser);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);
