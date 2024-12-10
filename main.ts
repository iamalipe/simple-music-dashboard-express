import * as dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { PublicUser } from './types/PublicUser.type';
import { globalErrorHandler } from './middlewares/error.middleware';
import './utils/appError.util';
import appRouter from './app/app.route';
import { limiter } from './middlewares/limiter.middleware';
import passport from './config/passport.config';

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
// app.set('trust proxy', true);

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(',')
  : [];

app.use(
  cors({
    origin: whitelist,
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
  }),
);
app.use(limiter);
app.use(passport.initialize());

app.get('/', async (_, res) => {
  res.send('Hello World');
});
app.get('/ping', async (_, res) => {
  res.send('Pong!');
});

app.use('/api', appRouter);
app.use(globalErrorHandler);

const EXPRESS_PORT = process.env.PORT || 3000;
const start = (): void => {
  try {
    app.listen(EXPRESS_PORT, () => {
      console.info(`App is running on port ${EXPRESS_PORT}.`);
    });
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};
start();

declare global {
  namespace Express {
    interface User extends PublicUser {}
  }
  var AppError: {
    new (
      message: string,
      options?: { path?: string; status?: number },
    ): AppError;
  };
  interface AppError extends Error {
    options?: { path?: string; status?: number };
  }
}
