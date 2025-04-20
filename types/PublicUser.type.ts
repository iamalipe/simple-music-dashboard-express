import { UserTable } from './../drizzle/schema';

export type PublicUser = Omit<typeof UserTable.$inferSelect, 'password'>;
