import * as dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import type { PublicUser } from './types/PublicUser.type';
import { globalErrorHandler } from './middlewares/error.middlewares';
import './utils/appError.utils';
import appRouter from './app/app.route';
import { limiter } from './middlewares/limiter.middlewares';
import { PORT } from './config/default';
import { startMetricsServer } from './utils/metrics.utils';
import { healthCheckController, rootController } from './app/app.controller';
import { resTime } from './middlewares/resTime.middlewares';
import logger from './utils/logger';
import db from './services/db.services';

const app = express();
app.use(express.json());
app.use(cookieParser());
// app.set('trust proxy', true);

// app.use(cors());
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
app.use(resTime);

app.get('/', rootController);
app.get('/healthcheck', healthCheckController);

app.use('/api', appRouter);
app.use(globalErrorHandler);

const start = (): void => {
  try {
    app.listen(PORT, () => {
      logger.info(`🟢 App is running on port ${PORT}.`);
      db.$connect().then(() => logger.info('🟢 Database connected'));
      startMetricsServer();
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error('🔴 An unknown error occurred');
    }
    db.$disconnect().then(() => logger.info('🔴 Database connection closed'));
    process.exit(1);
  }
};
start();

declare global {
  namespace Express {
    interface Request {
      user: PublicUser;
    }
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
