import { eq } from 'drizzle-orm';
import db from '../../services/db.services';
import { databaseResponseTimeHistogram } from '../../utils/metrics.utils';
import { UserTable, SessionTable } from './../../drizzle/schema';

export const createUser = async (data: typeof UserTable.$inferInsert) => {
  const timer = databaseResponseTimeHistogram.startTimer();
  const result = await db.insert(UserTable).values(data).returning();
  timer({ operation: 'createUser', success: 'true' });
  return result[0];
};

export const createSession = async (data: typeof SessionTable.$inferInsert) => {
  const timer = databaseResponseTimeHistogram.startTimer();
  const result = await db.insert(SessionTable).values(data).returning();
  timer({ operation: 'createSession', success: 'true' });
  return result[0];
};

export const getUserById = async (id: string) => {
  const timer = databaseResponseTimeHistogram.startTimer();
  const result = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
    columns: {
      password: false,
    },
  });
  timer({ operation: 'getUserById', success: 'true' });
  return result;
};

export const getUserByEmail = async (email: string) => {
  const timer = databaseResponseTimeHistogram.startTimer();
  const result = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, email),
  });
  timer({ operation: 'getUserByEmail', success: 'true' });
  return result;
};
